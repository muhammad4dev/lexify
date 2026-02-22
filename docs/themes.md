# Themes

Lexify's theming system maps Lexical node types to CSS class names.

---

## How themes work

When you pass a `theme` to `LexifyComposer`, Lexify forwards it to Lexical's
`createEditor()`. Lexical applies the class names from the theme object to the
DOM elements it renders for each node type.

You can style those classes entirely in your own CSS — the theme object is just
a data contract.

---

## Built-in themes

```bash
pnpm add @lexify/themes
```

### `baseTheme`

A complete theme object covering all standard Lexical node types. Class names
use the `lexify-` prefix.

```tsx
import { baseTheme } from "@lexify/themes";
import "@lexify/themes/css/base.css"; // optional default styles

<LexifyComposer theme={baseTheme} ...>
```

### `darkTheme`

Auto-derived from `baseTheme`. Every class name gets a `-dark` suffix
(e.g. `lexify-heading-h1` → `lexify-heading-h1-dark`). Pair it with a
`prefers-color-scheme: dark` media query or toggle it in JavaScript.

```tsx
import { darkTheme } from "@lexify/themes";
```

---

## `LexifyTheme` type

```typescript
interface LexifyTextTheme {
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

interface LexifyTheme {
  root?: string;
  text?: LexifyTextTheme;
  paragraph?: string;
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

| Node type           | Class name                                |
| ------------------- | ----------------------------------------- |
| Root                | `lexify-root`                             |
| Paragraph           | `lexify-paragraph`                        |
| `h1`–`h6`           | `lexify-heading-h1` … `lexify-heading-h6` |
| Unordered list      | `lexify-list-ul`                          |
| Ordered list        | `lexify-list-ol`                          |
| List item           | `lexify-list-item`                        |
| Checked list item   | `lexify-list-item-checked`                |
| Unchecked list item | `lexify-list-item-unchecked`              |
| Link                | `lexify-link`                             |
| Code block          | `lexify-code`                             |
| Inline code         | `lexify-text-code`                        |
| Bold                | `lexify-text-bold`                        |
| Italic              | `lexify-text-italic`                      |
| Underline           | `lexify-text-underline`                   |
| Strikethrough       | `lexify-text-strikethrough`               |
| LTR                 | `lexify-ltr`                              |
| RTL                 | `lexify-rtl`                              |
| …                   | …                                         |

---

## Create a custom theme

Extend `baseTheme` or build from scratch:

```typescript
import type { LexifyTheme } from "@lexify/themes";

export const myTheme: LexifyTheme = {
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
import { baseTheme } from "@lexify/themes";

export const myTheme: LexifyTheme = {
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

`@lexify/themes/css/base.css` defines all styles in terms of CSS custom properties.
Override them in your own stylesheet:

```css
:root {
  --lexify-font-family: "Inter", sans-serif;
  --lexify-font-size: 1rem;
  --lexify-line-height: 1.6;
  --lexify-code-bg: #1e1e1e;
  --lexify-code-color: #d4d4d4;
  --lexify-link-color: #0070f3;
}
```

---

## Dark mode

`css/base.css` ships dark mode overrides under `@media (prefers-color-scheme: dark)`.

To toggle dark mode programmatically, swap the theme object:

```tsx
const [isDark, setIsDark] = useState(false);

<LexifyComposer theme={isDark ? darkTheme : baseTheme} ...>
```
