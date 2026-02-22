import type { LexifyTheme } from "@lexify/core";

export type { LexifyTheme, LexifyTextTheme } from "@lexify/core";

// ─── Base theme ───────────────────────────────────────────────────────────────

/** Class-name-based theme for use with LexifyComposer `theme` prop. */
export const baseTheme: LexifyTheme = {
  root: "lexify-root",
  paragraph: "lexify-paragraph",
  quote: "lexify-quote",

  heading: {
    h1: "lexify-h1",
    h2: "lexify-h2",
    h3: "lexify-h3",
    h4: "lexify-h4",
    h5: "lexify-h5",
    h6: "lexify-h6",
  },

  list: {
    ul: "lexify-ul",
    ol: "lexify-ol",
    listitem: "lexify-listitem",
    listitemChecked: "lexify-listitem-checked",
    listitemUnchecked: "lexify-listitem-unchecked",
    checklist: "lexify-checklist",
    nested: {
      list: "lexify-nested-list",
      listitem: "lexify-nested-listitem",
    },
    ulDepth: [
      "lexify-ul-depth-1",
      "lexify-ul-depth-2",
      "lexify-ul-depth-3",
      "lexify-ul-depth-4",
    ],
    olDepth: [
      "lexify-ol-depth-1",
      "lexify-ol-depth-2",
      "lexify-ol-depth-3",
      "lexify-ol-depth-4",
    ],
  },

  link: "lexify-link",

  code: "lexify-code-block",
  codeHighlight: {
    atrule: "lexify-code-atrule",
    attr: "lexify-code-attr",
    boolean: "lexify-code-boolean",
    builtin: "lexify-code-builtin",
    cdata: "lexify-code-cdata",
    class: "lexify-code-class",
    "class-name": "lexify-code-class-name",
    comment: "lexify-code-comment",
    constant: "lexify-code-constant",
    deleted: "lexify-code-deleted",
    doctype: "lexify-code-doctype",
    entity: "lexify-code-entity",
    function: "lexify-code-function",
    important: "lexify-code-important",
    inserted: "lexify-code-inserted",
    keyword: "lexify-code-keyword",
    namespace: "lexify-code-namespace",
    number: "lexify-code-number",
    operator: "lexify-code-operator",
    prolog: "lexify-code-prolog",
    property: "lexify-code-property",
    punctuation: "lexify-code-punctuation",
    regex: "lexify-code-regex",
    selector: "lexify-code-selector",
    string: "lexify-code-string",
    symbol: "lexify-code-symbol",
    tag: "lexify-code-tag",
    url: "lexify-code-url",
    variable: "lexify-code-variable",
  },

  text: {
    bold: "lexify-text-bold",
    italic: "lexify-text-italic",
    underline: "lexify-text-underline",
    strikethrough: "lexify-text-strikethrough",
    underlineStrikethrough: "lexify-text-underline-strikethrough",
    code: "lexify-text-code",
    subscript: "lexify-text-subscript",
    superscript: "lexify-text-superscript",
    highlight: "lexify-text-highlight",
  },

  mark: "lexify-mark",
  markOverlap: "lexify-mark-overlap",
  blockCursor: "lexify-block-cursor",
  hr: "lexify-hr",
  image: "lexify-image",
  indent: "lexify-indent",
  ltr: "lexify-ltr",
  rtl: "lexify-rtl",

  table: "lexify-table",
  tableCell: "lexify-table-cell",
  tableCellHeader: "lexify-table-cell-header",
  tableRow: "lexify-table-row",
  tableSelected: "lexify-table-selected",
  tableSelection: "lexify-table-selection",
};

// ─── Dark theme ───────────────────────────────────────────────────────────────

/**
 * Dark variant of baseTheme — applies an extra `-dark` suffix to all root-level
 * class names and can be swapped in at runtime.
 */
function darkify(theme: LexifyTheme): LexifyTheme {
  const result: LexifyTheme = {};
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === "string") {
      result[key] = `${value}-dark`;
    } else if (Array.isArray(value)) {
      result[key] = (value as string[]).map((v) => `${v}-dark`);
    } else if (value !== null && typeof value === "object") {
      result[key] = darkify(value as LexifyTheme);
    }
  }
  return result;
}

export const darkTheme: LexifyTheme = darkify(baseTheme);
