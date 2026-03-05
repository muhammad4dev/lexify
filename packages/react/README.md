# @lexify/react

> React bindings for [Lexify](https://github.com/muhammad4dev/lexify) — `LexifyComposer`, `useLexifyEditor`, controlled & uncontrolled modes.

📖 **[Full documentation →](https://muhammad4dev.github.io/lexify)** · [GitHub](https://github.com/muhammad4dev/lexify) · [Changelog](https://github.com/muhammad4dev/lexify/releases)

## Installation

```bash
pnpm add @lexify/react @lexify/core
```

## Usage

### Basic editor

```tsx
import { LexifyComposer } from "@lexify/react";
import { boldPlugin, italicPlugin } from "@lexify/plugins";

export function MyEditor() {
  return (
    <LexifyComposer
      namespace="my-editor"
      plugins={[boldPlugin, italicPlugin]}
      placeholder="Start typing…"
    />
  );
}
```

### With toolbar

```tsx
import { LexifyComposer, useLexifyEditor } from "@lexify/react";
import { boldPlugin, FORMAT_BOLD_COMMAND } from "@lexify/plugins";

function BoldButton() {
  const editor = useLexifyEditor();
  return (
    <button
      onClick={() => editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined)}
    >
      B
    </button>
  );
}

export function MyEditor() {
  return (
    <LexifyComposer namespace="my-editor" plugins={[boldPlugin]}>
      <BoldButton />
    </LexifyComposer>
  );
}
```

### Controlled mode

```tsx
const [state, setState] = useState<SerializedEditorState>(initialState);

<LexifyComposer
  namespace="my-editor"
  plugins={[boldPlugin]}
  value={state}
  onChange={setState}
/>;
```

## Props

| Prop           | Type                    | Description                               |
| -------------- | ----------------------- | ----------------------------------------- |
| `namespace`    | `string`                | **Required.** Unique editor identifier    |
| `plugins`      | `LexifyPlugin[]`        | Plugins to register at mount              |
| `theme`        | `LexifyTheme`           | CSS class name map                        |
| `className`    | `string`                | Applied to the `contenteditable` element  |
| `placeholder`  | `ReactNode`             | Shown when editor is empty                |
| `initialState` | `SerializedEditorState` | Uncontrolled initial state                |
| `value`        | `SerializedEditorState` | Controlled state                          |
| `onChange`     | `(state) => void`       | Called on every state change              |
| `children`     | `ReactNode`             | Rendered inside the composer context tree |

## License

MIT © [Muhammad Mustafa](https://github.com/muhammad4dev)
