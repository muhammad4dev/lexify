import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface EditorAreaProps {
  onCharCountChange?: (count: number) => void;
}

function CharCounter({ onChange }: { onChange?: (n: number) => void }) {
  const [editor] = useLexicalComposerContext();
  const prevCount = useRef(0);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      const text = editor.getRootElement()?.textContent ?? "";
      const count = text.length;
      if (count !== prevCount.current) {
        prevCount.current = count;
        onChange?.(count);
      }
    });
  }, [editor, onChange]);

  return (
    <button
      onClick={() =>
        console.log("Editor state:", editor.getEditorState().toJSON())
      }
    >
      Log Editor State
    </button>
  );
}

/** Wrapper div around the editor content area. The ContentEditable is rendered
 *  by LexifyComposer internally via RichTextPlugin. */
export function EditorArea({ onCharCountChange }: EditorAreaProps) {
  return (
    <div className="editor-area">
      {onCharCountChange && <CharCounter onChange={onCharCountChange} />}
    </div>
  );
}
