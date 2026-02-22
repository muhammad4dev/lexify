import { useCallback, useEffect, useMemo, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { createEditor } from "@lexify/core";
import { LexifyContext } from "./context.js";
import type { LexifyComposerProps } from "./types.js";
import type { EditorState } from "lexical";

// ─── Inner component — has access to LexicalComposerContext ──────────────────

interface InnerProps {
  composerProps: LexifyComposerProps;
}

function LexifyInner({ composerProps }: InnerProps): React.ReactElement {
  const { namespace, plugins, onChange, children, className, placeholder } =
    composerProps;

  // Use the LexicalComposer's editor so plugin update() calls target the
  // rendered editor, not a second detached Lexical instance.
  const [lexical] = useLexicalComposerContext();

  const lexifyEditorRef = useRef(
    createEditor({
      namespace,
      plugins: plugins ?? [],
      _lexicalEditor: lexical,
    }),
  );

  // Register any plugins added after initial mount
  useEffect(() => {
    for (const plugin of plugins ?? []) {
      lexifyEditorRef.current.registerPlugin(plugin);
    }
  }, [plugins]);

  // Tear down on unmount
  useEffect(() => {
    const editor = lexifyEditorRef.current;
    return () => editor.destroy();
  }, []);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      onChange?.(editorState.toJSON());
    },
    [onChange],
  );

  const contextValue = useMemo(() => lexifyEditorRef.current, []);

  return (
    <LexifyContext.Provider value={contextValue}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className={className ?? "lexify-content-editable"} />
        }
        placeholder={<div className="lexify-placeholder">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {onChange && <OnChangePlugin onChange={handleChange} />}
      {children}
    </LexifyContext.Provider>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function LexifyComposer(props: LexifyComposerProps): React.ReactElement {
  const { namespace, plugins, theme, initialState } = props;

  // Collect node classes from plugins — Lexical needs them at construction time
  const nodes = useMemo(
    () => (plugins ?? []).flatMap((p) => p.nodes ?? []),
    // plugins list is stable (defined outside component) in typical usage
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const initialConfig = useMemo(
    () => ({
      namespace,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      theme: (theme ?? {}) as any,
      nodes: nodes as any[],
      editorState: initialState ? JSON.stringify(initialState) : null,
      onError: (error: Error) => {
        throw error;
      },
    }),
    // intentionally only run once at mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexifyInner composerProps={props} />
    </LexicalComposer>
  );
}
