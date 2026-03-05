import {
  createEditor as createLexicalEditor,
  $getRoot,
  type LexicalEditor,
  type SerializedEditorState,
} from "lexical";
import type {
  LexifyEditor,
  LexifyEditorConfig,
  LexifyCommand,
  LexifyPlugin,
} from "./types.js";

type CommandHandler<TPayload> = (payload: TPayload) => void;

export function createEditor(config: LexifyEditorConfig): LexifyEditor {
  // If an external Lexical editor is injected (by @lexify/react), use it directly.
  // Otherwise create one — this path is used in tests and standalone usage.
  let lexical: LexicalEditor;
  if (config._lexicalEditor) {
    lexical = config._lexicalEditor as LexicalEditor;
  } else {
    const pluginNodes = (config.plugins ?? []).flatMap((p) => p.nodes ?? []);
    type LexicalCreateArgs = NonNullable<
      Parameters<typeof createLexicalEditor>[0]
    >;
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

  const editor: LexifyEditor = {
    get namespace() {
      return config.namespace;
    },

    registerPlugin(plugin: LexifyPlugin): void {
      if (registeredPlugins.has(plugin.name)) return;
      const cleanup = plugin.register(editor);
      registeredPlugins.set(plugin.name, cleanup);
    },

    registerCommandHandler<TPayload>(
      command: LexifyCommand<TPayload>,
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
      command: LexifyCommand<TPayload>,
      payload: TPayload,
    ): void {
      const handlers = commandHandlers.get(command.type);
      if (!handlers) return;
      for (const handler of handlers) {
        handler(payload);
      }
    },

    getEditorState(): unknown {
      return lexical.getEditorState();
    },

    getTextContent(): string {
      let text = "";
      lexical.getEditorState().read(() => {
        text = $getRoot().getTextContent();
      });
      return text;
    },

    registerUpdateListener(listener: () => void): () => void {
      return lexical.registerUpdateListener(() => listener());
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
