# @lexify/themes

> Theme presets for [Lexify](https://github.com/muhammad4dev/lexify) — `baseTheme`, `darkTheme`, and a ready-to-use CSS file.

📖 **[Full documentation →](https://muhammad4dev.github.io/lexify)** · [GitHub](https://github.com/muhammad4dev/lexify) · [Changelog](https://github.com/muhammad4dev/lexify/releases)

## Installation

```bash
pnpm add @lexify/themes @lexify/core
```

## Usage

```tsx
import { LexifyComposer } from "@lexify/react";
import { baseTheme } from "@lexify/themes";
import "@lexify/themes/css/base.css"; // optional default styles

<LexifyComposer
  namespace="my-editor"
  plugins={[...]}
  theme={baseTheme}
/>
```

### Dark theme

```tsx
import { darkTheme } from "@lexify/themes";

<LexifyComposer theme={darkTheme} ...>
```

### Custom theme

```typescript
import type { LexifyTheme } from "@lexify/core";

const myTheme: LexifyTheme = {
  paragraph: "my-paragraph",
  heading: {
    h1: "my-h1",
    h2: "my-h2",
    h3: "my-h3",
  },
  text: {
    bold: "my-bold",
    italic: "my-italic",
    underline: "my-underline",
    strikethrough: "my-strikethrough",
    code: "my-code",
  },
  link: "my-link",
  list: {
    ul: "my-ul",
    ol: "my-ol",
    listitem: "my-listitem",
  },
  // ... other node types
};
```

## Exports

| Export         | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `baseTheme`    | Full theme mapping all node types to `lexify-*` class names   |
| `darkTheme`    | Same as `baseTheme` with `-dark` suffix on all class names    |
| `css/base.css` | Default styles for all `lexify-*` classes (import separately) |

## Overriding styles

The CSS file uses plain class names — override any of them in your own stylesheet:

```css
/* override heading styles */
.lexify-h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--my-heading-color);
}
```

## License

MIT © [Muhammad Mustafa](https://github.com/muhammad4dev)
