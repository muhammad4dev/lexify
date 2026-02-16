# Themes

Lexra's theming system maps Lexical node types to CSS class names.

---

## How themes work

When you pass a `theme` to `LexraComposer`, Lexra forwards it to Lexical's
`createEditor()`. Lexical applies the class names from the theme object to the
DOM elements it renders for each node type.

You can style those classes entirely in your own CSS — the theme object is just
a data contract.

---

## Built-in themes

```bash
pnpm add @lexra/themes
```

### `baseTheme`

A complete theme object covering all standard Lexical node types. Class names
use the `lexra-` prefix.

```tsx
import { baseTheme } from "@lexra/themes";
import "@lexra/themes/css/base.css"; // optional default styles

<LexraComposer theme={baseTheme} ...>
```

### `darkTheme`

Auto-derived from `baseTheme`. Every class name gets a `-dark` suffix
(e.g. `lexra-heading-h1` → `lexra-heading-h1-dark`). Pair it with a
`prefers-color-scheme: dark` media query or toggle it in JavaScript.

```tsx
import { darkTheme } from "@lexra/themes";
```

---

## `LexraTheme` type

```typescript
interface LexraTextTheme {
  bold?: string;
  italic?: string;
  underline?: string;
  strikethrough?: string;
  code?: string;
  highlight?: string;
  subscript?: string;
  superscript?: string;
  underlineStrikethrough?: string;
  [key: string]: unknown;
}

interface LexraTheme {
  root?: string;
  text?: LexraTextTheme;
  paragraph?: string;
  heading?: {
    h1?: string; h2?: string; h3?: string;
    h4?: string; h5?: string; h6?: string;
  };
  list?: {
    ul?: string; ol?: string; listitem?: string;
    nested?: { listitem?: string; list?: string };
    listitemChecked?: string;
    listitemUnchecked?: string;
    olDepth?: string[];
    ulDepth?: string[];
  };
  link?: string;
  code?: string;
  codeHighlight?: Record<string, string>;
  table?: string;
  tableRow?: string;
  tableCell?: string;
  tableCellHeader?: string;
  mark?: string;
  markOverlap?: string;
  hr?: string;
  image?: string;
  indent?: string;
  ltr?: string;
  rtl?: string;
  [key: string]: unknown;
}
```

---

## Class names in `baseTheme`

| Node type | Class name |
|---|---|
| Root | `lexra-root` |
| Paragraph | `lexra-paragraph` |
| `h1`–`h6` | `lexra-heading-h1` … `lexra-heading-h6` |
| Unordered list | `lexra-list-ul` |
| Ordered list | `lexra-list-ol` |
| List item | `lexra-list-item` |
| Checked list item | `lexra-list-item-checked` |
| Unchecked list item | `lexra-list-item-unchecked` |
| Link | `lexra-link` |
| Code block | `lexra-code` |
| Inline code | `lexra-text-code` |
| Bold | `lexra-text-bold` |
| Italic | `lexra-text-italic` |
| Underline | `lexra-text-underline` |
| Strikethrough | `lexra-text-strikethrough` |
| LTR | `lexra-ltr` |
| RTL | `lexra-rtl` |
| … | … |

---

## Create a custom theme

Extend `baseTheme` or build from scratch:

```typescript
import type { LexraTheme } from "@lexra/themes";

export const myTheme: LexraTheme = {
  paragraph: "my-para",
  heading: {
    h1: "my-h1",
    h2: "my-h2",
  },
  text: {
    bold: "my-bold",
    italic: "my-italic",
  },
};
```

Or start from `baseTheme` and override:

```typescript
import { baseTheme } from "@lexra/themes";

export const myTheme: LexraTheme = {
  ...baseTheme,
  paragraph: "my-custom-paragraph",
  heading: {
    ...baseTheme.heading,
    h1: "my-h1",
  },
};
```

---

## CSS variable overrides

`@lexra/themes/css/base.css` defines all styles in terms of CSS custom properties.
Override them in your own stylesheet:

```css
:root {
  --lexra-font-family: "Inter", sans-serif;
  --lexra-font-size: 1rem;
  --lexra-line-height: 1.6;
  --lexra-code-bg: #1e1e1e;
  --lexra-code-color: #d4d4d4;
  --lexra-link-color: #0070f3;
}
```

---

## Dark mode

`css/base.css` ships dark mode overrides under `@media (prefers-color-scheme: dark)`.

To toggle dark mode programmatically, swap the theme object:

```tsx
const [isDark, setIsDark] = useState(false);

<LexraComposer theme={isDark ? darkTheme : baseTheme} ...>
```
