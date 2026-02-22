import type { SerializedEditorState } from "lexical";
import type { LexifyPlugin, LexifyTheme } from "@lexify/core";

export interface LexifyComposerProps {
  /** Unique namespace for this editor instance. */
  namespace: string;
  /** Plugins to register on mount. */
  plugins?: LexifyPlugin[];
  /** Theme class names to apply to this editor. */
  theme?: LexifyTheme;
  /**
   * Uncontrolled mode: initial serialized state to populate the editor.
   * Ignored if `value` is provided.
   */
  initialState?: SerializedEditorState;
  /**
   * Controlled mode: serialized state driven by the parent.
   * When provided, `onChange` is required.
   */
  value?: SerializedEditorState;
  /** Called whenever the editor state changes. */
  onChange?: (state: SerializedEditorState) => void;
  /** Rendered inside the editor surface. Use to compose Lexical plugins/UI. */
  children?: React.ReactNode;
  /** Applied to the contenteditable element. */
  className?: string;
  /** Placeholder shown when the editor is empty. */
  placeholder?: React.ReactNode;
}
