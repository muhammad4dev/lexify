# @lexify/ui

> Unstyled, accessible toolbar components for [Lexify](https://github.com/muhammad4dev/lexify). Pre-wired to their plugins — bring your own styles.

📖 **[Full documentation →](https://muhammad4dev.github.io/lexify)** · [GitHub](https://github.com/muhammad4dev/lexify) · [Changelog](https://github.com/muhammad4dev/lexify/releases)

## Installation

```bash
pnpm add @lexify/ui @lexify/plugins @lexify/react @lexify/core lexical
# peer deps: react, react-dom
```

## Usage

```tsx
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  UndoButton,
  RedoButton,
  HeadingSelect,
  BoldButton,
  ItalicButton,
  UnderlineButton,
  StrikethroughButton,
  CodeButton,
  TextAlignButton,
  BulletListButton,
  NumberedListButton,
  FontSizeInput,
  FontColorInput,
} from "@lexify/ui";

function MyToolbar() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup>
        <UndoButton />
        <RedoButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingSelect />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <BoldButton />
        <ItalicButton />
        <UnderlineButton />
        <StrikethroughButton />
        <CodeButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <BulletListButton />
        <NumberedListButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <FontSizeInput />
      <FontColorInput />
    </Toolbar>
  );
}
```

All components must be rendered **inside** a `LexifyComposer` tree (they call `useLexifyEditor()` internally).

## Components

### Primitives

| Component          | Description                                |
| ------------------ | ------------------------------------------ |
| `Toolbar`          | `role="toolbar"` wrapper                   |
| `ToolbarButton`    | Base button with `isActive?: boolean` prop |
| `ToolbarGroup`     | Groups related buttons                     |
| `ToolbarSeparator` | Visual divider between groups              |

### Pre-wired components

| Component             | Required plugin       |
| --------------------- | --------------------- |
| `BoldButton`          | `boldPlugin`          |
| `ItalicButton`        | `italicPlugin`        |
| `UnderlineButton`     | `underlinePlugin`     |
| `StrikethroughButton` | `strikethroughPlugin` |
| `CodeButton`          | `codePlugin`          |
| `HeadingSelect`       | `headingPlugin`       |
| `TextAlignButton`     | `textAlignPlugin`     |
| `BulletListButton`    | `listPlugin`          |
| `NumberedListButton`  | `listPlugin`          |
| `RemoveListButton`    | `listPlugin`          |
| `FontSizeInput`       | `fontSizePlugin`      |
| `FontColorInput`      | `fontColorPlugin`     |
| `UndoButton`          | `historyPlugin`       |
| `RedoButton`          | `historyPlugin`       |

All components forward refs and accept all native HTML attributes for their element type.

## Styling

Components ship with **no default styles**. Add your own CSS targeting the rendered elements, or use `className` props. Use `isActive` on button components to reflect active formatting state:

```tsx
<BoldButton isActive={isBold} aria-pressed={isBold} />
```

## License

MIT © [Muhammad Mustafa](https://github.com/muhammad4dev)
