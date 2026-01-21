import type { LexraTheme } from "@lexra/core";

export type { LexraTheme, LexraTextTheme } from "@lexra/core";

// ─── Base theme ───────────────────────────────────────────────────────────────

/** Class-name-based theme for use with LexraComposer `theme` prop. */
export const baseTheme: LexraTheme = {
  root: "lexra-root",
  paragraph: "lexra-paragraph",
  quote: "lexra-quote",

  heading: {
    h1: "lexra-h1",
    h2: "lexra-h2",
    h3: "lexra-h3",
    h4: "lexra-h4",
    h5: "lexra-h5",
    h6: "lexra-h6",
  },

  list: {
    ul: "lexra-ul",
    ol: "lexra-ol",
    listitem: "lexra-listitem",
    listitemChecked: "lexra-listitem-checked",
    listitemUnchecked: "lexra-listitem-unchecked",
    checklist: "lexra-checklist",
    nested: {
      list: "lexra-nested-list",
      listitem: "lexra-nested-listitem",
    },
    ulDepth: [
      "lexra-ul-depth-1",
      "lexra-ul-depth-2",
      "lexra-ul-depth-3",
      "lexra-ul-depth-4",
    ],
    olDepth: [
      "lexra-ol-depth-1",
      "lexra-ol-depth-2",
      "lexra-ol-depth-3",
      "lexra-ol-depth-4",
    ],
  },

  link: "lexra-link",

  code: "lexra-code-block",
  codeHighlight: {
    atrule: "lexra-code-atrule",
    attr: "lexra-code-attr",
    boolean: "lexra-code-boolean",
    builtin: "lexra-code-builtin",
    cdata: "lexra-code-cdata",
    class: "lexra-code-class",
    "class-name": "lexra-code-class-name",
    comment: "lexra-code-comment",
    constant: "lexra-code-constant",
    deleted: "lexra-code-deleted",
    doctype: "lexra-code-doctype",
    entity: "lexra-code-entity",
    function: "lexra-code-function",
    important: "lexra-code-important",
    inserted: "lexra-code-inserted",
    keyword: "lexra-code-keyword",
    namespace: "lexra-code-namespace",
    number: "lexra-code-number",
    operator: "lexra-code-operator",
    prolog: "lexra-code-prolog",
    property: "lexra-code-property",
    punctuation: "lexra-code-punctuation",
    regex: "lexra-code-regex",
    selector: "lexra-code-selector",
    string: "lexra-code-string",
    symbol: "lexra-code-symbol",
    tag: "lexra-code-tag",
    url: "lexra-code-url",
    variable: "lexra-code-variable",
  },

  text: {
    bold: "lexra-text-bold",
    italic: "lexra-text-italic",
    underline: "lexra-text-underline",
    strikethrough: "lexra-text-strikethrough",
    underlineStrikethrough: "lexra-text-underline-strikethrough",
    code: "lexra-text-code",
    subscript: "lexra-text-subscript",
    superscript: "lexra-text-superscript",
    highlight: "lexra-text-highlight",
  },

  mark: "lexra-mark",
  markOverlap: "lexra-mark-overlap",
  blockCursor: "lexra-block-cursor",
  hr: "lexra-hr",
  image: "lexra-image",
  indent: "lexra-indent",
  ltr: "lexra-ltr",
  rtl: "lexra-rtl",

  table: "lexra-table",
  tableCell: "lexra-table-cell",
  tableCellHeader: "lexra-table-cell-header",
  tableRow: "lexra-table-row",
  tableSelected: "lexra-table-selected",
  tableSelection: "lexra-table-selection",
};

// ─── Dark theme ───────────────────────────────────────────────────────────────

/**
 * Dark variant of baseTheme — applies an extra `-dark` suffix to all root-level
 * class names and can be swapped in at runtime.
 */
function darkify(theme: LexraTheme): LexraTheme {
  const result: LexraTheme = {};
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === "string") {
      result[key] = `${value}-dark`;
    } else if (Array.isArray(value)) {
      result[key] = (value as string[]).map((v) => `${v}-dark`);
    } else if (value !== null && typeof value === "object") {
      result[key] = darkify(value as LexraTheme);
    }
  }
  return result;
}

export const darkTheme: LexraTheme = darkify(baseTheme);
