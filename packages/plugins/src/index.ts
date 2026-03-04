// ─── Utilities (internal) ─────────────────────────────────────────────────────
export {
  parseStyleString,
  serializeStyleMap,
  setStyleProperty,
  isValidColor,
  isValidFontSize,
} from "./utils.js";

// ─── Format plugins ───────────────────────────────────────────────────────────
export { boldPlugin, FORMAT_BOLD_COMMAND } from "./bold.js";
export { italicPlugin, FORMAT_ITALIC_COMMAND } from "./italic.js";
export { underlinePlugin, FORMAT_UNDERLINE_COMMAND } from "./underline.js";
export { strikethroughPlugin, FORMAT_STRIKETHROUGH_COMMAND } from "./strikethrough.js";
export { codePlugin, FORMAT_CODE_COMMAND } from "./code.js";

// ─── Block plugins ────────────────────────────────────────────────────────────
export { headingPlugin, SET_HEADING_COMMAND, REMOVE_HEADING_COMMAND } from "./heading.js";
export type { HeadingTag } from "./heading.js";
export { textAlignPlugin, SET_TEXT_ALIGN_COMMAND } from "./text-align.js";
export type { TextAlignValue } from "./text-align.js";
export {
  listPlugin,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  INDENT_LIST_ITEM_COMMAND,
  OUTDENT_LIST_ITEM_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "./list.js";

// ─── Inline style plugins ─────────────────────────────────────────────────────
export { fontSizePlugin, SET_FONT_SIZE_COMMAND, REMOVE_FONT_SIZE_COMMAND } from "./font-size.js";
export { fontColorPlugin, SET_FONT_COLOR_COMMAND, REMOVE_FONT_COLOR_COMMAND } from "./font-color.js";

// ─── Link plugin ──────────────────────────────────────────────────────────────
export { linkPlugin, INSERT_LINK_COMMAND, UPDATE_LINK_COMMAND, REMOVE_LINK_COMMAND } from "./link.js";
export type { LinkPayload } from "./link.js";

// ─── History plugin ───────────────────────────────────────────────────────────
export { historyPlugin, UNDO_COMMAND, REDO_COMMAND, HISTORY_MERGE_DELAY } from "./history.js";
