import {
  createEditor as createLexicalEditor,
  type LexicalEditor,
  type EditorState,
  type SerializedEditorState,
} from "lexical";
import type {
  LexraEditor,
  LexraEditorConfig,
  LexraCommand,
  LexraPlugin,
} from "./types.js";

type CommandHandler<TPayload> = (payload: TPayload) => void;

export function createEditor(config: LexraEditorConfig): LexraEditor {
  // If an external Lexical editor is injected (by @lexra/react), use it directly.
  // Otherwise create one — this path is used in tests and standalone usage.
  let lexical: LexicalEditor;
  if (config._lexicalEditor) {
    lexical = config._lexicalEditor as LexicalEditor;
  } else {
    const pluginNodes = (config.plugins ?? []).flatMap((p) => p.nodes ?? []);
    type LexicalCreateArgs = NonNullable<Parameters<typeof createLexicalEditor>[0]>;
    type LexicalNodes = NonNullable<LexicalCreateArgs["nodes"]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const theme = (config.theme ?? {}) as any;
    const baseArgs = { namespace: config.namespace, theme };
    lexical = createLexicalEditor(
      pluginNodes.length > 0
        ? { ...baseArgs, nodes: pluginNodes as LexicalNodes }
        : baseArgs,
    );
  }

  const registeredPlugins = new Map<string, () => void>(); // name → cleanup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commandHandlers = new Map<string, Set<CommandHandler<any>>>();

  const editor: LexraEditor = {
    get namespace() {
      return config.namespace;
    },

    registerPlugin(plugin: LexraPlugin): void {
      if (registeredPlugins.has(plugin.name)) return;
      const cleanup = plugin.register(editor);
      registeredPlugins.set(plugin.name, cleanup);
    },

    registerCommandHandler<TPayload>(
      command: LexraCommand<TPayload>,
      handler: CommandHandler<TPayload>,
    ): () => void {
      let handlers = commandHandlers.get(command.type);
      if (!handlers) {
        handlers = new Set();
        commandHandlers.set(command.type, handlers);
      }
      handlers.add(handler);
      return () => handlers!.delete(handler);
    },

    dispatchCommand<TPayload>(
      command: LexraCommand<TPayload>,
      payload: TPayload,
    ): void {
      const handlers = commandHandlers.get(command.type);
      if (!handlers) return;
      for (const handler of handlers) {
        handler(payload);
      }
    },

    getEditorState(): EditorState {
      return lexical.getEditorState();
    },

    toJSON(): SerializedEditorState {
      return lexical.getEditorState().toJSON();
    },

    destroy(): void {
      for (const cleanup of registeredPlugins.values()) {
        cleanup();
      }
      registeredPlugins.clear();
      commandHandlers.clear();
    },

    update(updater: () => void, options?: { discrete?: boolean }): void {
      lexical.update(updater, options as Parameters<typeof lexical.update>[1]);
    },

    get _lexical(): unknown {
      return lexical;
    },
  };

  // Register any plugins provided at construction time
  for (const plugin of config.plugins ?? []) {
    editor.registerPlugin(plugin);
  }

  return editor;
}
