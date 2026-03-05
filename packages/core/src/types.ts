import type { SerializedEditorState } from "lexical";

// ─── Command ────────────────────────────────────────────────────────────────

export interface LexifyCommandPayloadMap {
  [commandType: string]: unknown;
}

export interface LexifyCommand<TPayload = void> {
  readonly type: string;
  readonly _phantom?: TPayload; // phantom type — never used at runtime
}

export function createCommand<TPayload = void>(
  type: string,
): LexifyCommand<TPayload> {
  return { type };
}

// ─── Theme ───────────────────────────────────────────────────────────────────

/** Text format class names (maps to Lexical's TextNodeThemeClasses). */
export interface LexifyTextTheme {
  base?: string;
  bold?: string;
  italic?: string;
  underline?: string;
  strikethrough?: string;
  underlineStrikethrough?: string;
  code?: string;
  subscript?: string;
  superscript?: string;
  highlight?: string;
}

/** Full theme shape passed to Lexical's EditorThemeClasses. No Lexical types exposed. */
export interface LexifyTheme {
  root?: string;
  paragraph?: string;
  quote?: string;
  heading?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  list?: {
    ul?: string;
    ol?: string;
    listitem?: string;
    listitemChecked?: string;
    listitemUnchecked?: string;
    checklist?: string;
    nested?: {
      list?: string;
      listitem?: string;
    };
    ulDepth?: string[];
    olDepth?: string[];
  };
  link?: string;
  code?: string;
  codeHighlight?: Record<string, string>;
  text?: LexifyTextTheme;
  blockCursor?: string;
  hr?: string;
  image?: string;
  table?: string;
  tableCell?: string;
  tableCellHeader?: string;
  tableRow?: string;
  tableSelected?: string;
  tableSelection?: string;
  mark?: string;
  markOverlap?: string;
  ltr?: string;
  rtl?: string;
  indent?: string;
  [key: string]: unknown;
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

export interface LexifyPlugin {
  readonly name: string;
  /**
   * Lexical node classes required by this plugin.
   * Collected before the Lexical editor is created so nodes are registered
   * at construction time. Typed loosely to avoid leaking Lexical types.
   */
  readonly nodes?: unknown[];
  /** Called once when the plugin is registered with an editor instance. */
  register(editor: LexifyEditor): () => void; // returns cleanup fn
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export interface LexifyEditorConfig {
  namespace: string;
  plugins?: LexifyPlugin[];
  /** Theme class names to pass to the Lexical editor. */
  theme?: LexifyTheme;
  /**
   * @internal — used by @lexify/react to inject LexicalComposer's editor
   * so plugin update() calls target the rendered editor, not a separate one.
   */
  _lexicalEditor?: unknown;
}

export interface LexifyEditor {
  readonly namespace: string;
  /** Register a plugin. Idempotent — registering the same plugin twice is a no-op. */
  registerPlugin(plugin: LexifyPlugin): void;
  /** Register a handler for a command. Returns an unsubscribe function. */
  registerCommandHandler<TPayload>(
    command: LexifyCommand<TPayload>,
    handler: (payload: TPayload) => void,
  ): () => void;
  /** Dispatch a command to all registered handlers. */
  dispatchCommand<TPayload>(
    command: LexifyCommand<TPayload>,
    payload: TPayload,
  ): void;
  /** Read the current editor state as an opaque snapshot. Pass it to `setEditorState` to restore. */
  getEditorState(): unknown;
  /** Extract all plain text from the editor content. */
  getTextContent(): string;
  /** Subscribe to editor state updates. Returns an unsubscribe function. */
  registerUpdateListener(listener: () => void): () => void;
  /** Serialize the current state to JSON. */
  toJSON(): SerializedEditorState;
  /** Tear down the editor and all registered plugins. */
  destroy(): void;
  /**
   * Run a Lexical editor state mutation. Use this inside plugins to apply
   * formatting, insert nodes, etc. without exposing the Lexical editor instance.
   */
  update(updater: () => void, options?: { discrete?: boolean }): void;
  /**
   * @internal — exposes the underlying LexicalEditor for advanced plugin use
   * (e.g. `registerHistory`). Typed as `unknown` to avoid leaking Lexical types
   * in the public API. Cast with `as LexicalEditor` only in internal plugin code.
   */
  readonly _lexical: unknown;
}
