# Getting Started with Lexify

This guide walks you through installing Lexify, creating an editor, registering
plugins, mounting it in React, applying a theme, and building a custom toolbar.

---

## 1. Installation

```bash
# Required peer dependencies
pnpm add lexical @lexical/react

# Core packages
pnpm add @lexify/core @lexify/react

# All plugins — tree-shakeable (bundler drops what you don't import)
pnpm add @lexify/plugins

# Optional: theme + UI toolbar
pnpm add @lexify/themes @lexify/ui
```

---

## 2. Create a basic editor

`LexifyComposer` is the React entry point. Pass a `namespace` and an array of
`plugins`. It renders a `contenteditable` area via Lexical's `RichTextPlugin`
internally.

```tsx
// MyEditor.tsx
import { LexifyComposer } from "@lexify/react";
import { boldPlugin, italicPlugin } from "@lexify/plugins";

export function MyEditor() {
  return (
    <LexifyComposer
      namespace="my-editor"
      plugins={[boldPlugin, italicPlugin]}
    />
  );
}
```

### Props

| Prop           | Type                    | Description                                  |
| -------------- | ----------------------- | -------------------------------------------- |
| `namespace`    | `string`                | Unique identifier for this editor instance   |
| `plugins`      | `LexifyPlugin[]`        | Plugins to register at mount                 |
| `theme`        | `LexifyTheme`           | CSS class name map (see [themes](themes.md)) |
| `className`    | `string`                | Applied to the `contenteditable` element     |
| `placeholder`  | `ReactNode`             | Shown when editor is empty                   |
| `initialState` | `SerializedEditorState` | Uncontrolled initial state                   |
| `value`        | `SerializedEditorState` | Controlled state                             |
| `onChange`     | `(state) => void`       | Called on every state change                 |
| `children`     | `ReactNode`             | Rendered inside the composer tree            |

---

## 3. Register plugins

Plugins are plain objects with a `name`, optional `nodes[]`, and a `register()`
function. Pass them in the `plugins` array:

```tsx
import { boldPlugin, headingPlugin, listPlugin } from "@lexify/plugins";

<LexifyComposer
  namespace="my-editor"
  plugins={[boldPlugin, headingPlugin, listPlugin]}
/>;
```

Plugin registration is **idempotent** — passing the same plugin twice is safe.

> **Important:** plugins that register custom Lexical nodes (e.g. `headingPlugin`,
> `linkPlugin`, `listPlugin`) must be in the `plugins` array passed to
> `LexifyComposer` so their nodes are registered at editor construction time.
> Adding them dynamically after mount will not register the nodes.

---

## 4. Dispatch commands from a toolbar

Inside the `LexifyComposer` tree, call `useLexifyEditor()` to get the editor
instance and dispatch commands:

```tsx
import { useLexifyEditor } from "@lexify/react";
import { FORMAT_BOLD_COMMAND, SET_HEADING_COMMAND } from "@lexify/plugins";

function MyToolbar() {
  const editor = useLexifyEditor();

  return (
    <div>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined)}
      >
        Bold
      </button>
      <button onClick={() => editor.dispatchCommand(SET_HEADING_COMMAND, "h2")}>
        H2
      </button>
    </div>
  );
}
```

The toolbar must be rendered **as a child** of `LexifyComposer`:

```tsx
<LexifyComposer namespace="my-editor" plugins={[boldPlugin, headingPlugin]}>
  <MyToolbar />
</LexifyComposer>
```

---

## 5. Use pre-built toolbar components

`@lexify/ui` exports unstyled, accessible toolbar components wired to their
respective plugins. They call `useLexifyEditor()` internally:

```tsx
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  BoldButton,
  ItalicButton,
  UnderlineButton,
  HeadingSelect,
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
        <HeadingSelect />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <BoldButton />
        <ItalicButton />
        <UnderlineButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left">←</TextAlignButton>
        <TextAlignButton align="center">↔</TextAlignButton>
        <TextAlignButton align="right">→</TextAlignButton>
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

All components forward HTML attributes and refs. Use `isActive` on
`ToolbarButton`-based components to reflect active state (e.g. when selection
is inside bold text):

```tsx
<BoldButton isActive={isBold} />
```

---

## 6. Apply a theme

```bash
pnpm add @lexify/themes
```

```tsx
import { baseTheme } from "@lexify/themes";
import "@lexify/themes/css/base.css"; // optional default styles

<LexifyComposer namespace="my-editor" plugins={[...]} theme={baseTheme}>
  ...
</LexifyComposer>
```

The `theme` object maps Lexical node types to CSS class names. The CSS file
provides sensible defaults for all `lexify-*` classes. Override them in your own
stylesheet.

For a dark theme:

```tsx
import { darkTheme } from "@lexify/themes";

<LexifyComposer theme={darkTheme} ...>
```

See [`docs/themes.md`](themes.md) for full customization options.

---

## 7. Listen to state changes

```tsx
<LexifyComposer
  namespace="my-editor"
  plugins={[boldPlugin]}
  onChange={(state) => {
    console.log("editor state:", state);
    // state is SerializedEditorState — safe to JSON.stringify and store
  }}
/>
```

---

## 8. Controlled mode

Pass `value` + `onChange` for fully controlled state:

```tsx
const [state, setState] = useState<SerializedEditorState>(initialState);

<LexifyComposer
  namespace="my-editor"
  plugins={[...]}
  value={state}
  onChange={setState}
/>
```

---

## 9. Write a custom plugin

See [`docs/plugin-api.md`](plugin-api.md) for the full plugin contract.
