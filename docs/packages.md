# Package Reference

All packages live under `packages/` (or `apps/` for the demo).

---

## `@lexify/core`

Core engine — no React, no UI.

```bash
pnpm add @lexify/core
```

### Exports

| Export                   | Description                                 |
| ------------------------ | ------------------------------------------- |
| `createEditor(config)`   | Factory — returns a `LexifyEditor` instance |
| `createCommand<T>(type)` | Create a typed command token                |
| `LexifyEditor`           | Editor interface (type)                     |
| `LexifyPlugin`           | Plugin interface (type)                     |
| `LexifyCommand<T>`       | Command token type                          |
| `LexifyEditorConfig`     | Config type for `createEditor`              |
| `LexifyTheme`            | Theme shape type                            |
| `LexifyTextTheme`        | Text sub-theme type                         |

### `LexifyEditorConfig`

```typescript
interface LexifyEditorConfig {
  namespace: string;
  plugins?: LexifyPlugin[];
  theme?: LexifyTheme;
}
```

---

## `@lexify/react`

React bindings.

```bash
pnpm add @lexify/react
# peer deps: react, react-dom, lexical, @lexical/react
```

### Exports

| Export                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `LexifyComposer`      | Root component — mounts the editor                         |
| `useLexifyEditor()`   | Hook — returns the `LexifyEditor` for the nearest composer |
| `LexifyContext`       | React context object (for test wrappers)                   |
| `LexifyComposerProps` | Prop types for `LexifyComposer`                            |

### `LexifyComposerProps`

```typescript
interface LexifyComposerProps {
  namespace: string;
  plugins?: LexifyPlugin[];
  theme?: LexifyTheme;
  className?: string;
  placeholder?: React.ReactNode;
  initialState?: SerializedEditorState;
  value?: SerializedEditorState;
  onChange?: (state: SerializedEditorState) => void;
  children?: React.ReactNode;
}
```

---

## `@lexify/themes`

Theme objects and CSS.

```bash
pnpm add @lexify/themes
```

### Exports

| Export         | Description                                 |
| -------------- | ------------------------------------------- |
| `baseTheme`    | Complete theme with `lexify-*` class names  |
| `darkTheme`    | Same as `baseTheme` but with `-dark` suffix |
| `LexifyTheme`  | Re-exported from `@lexify/core`             |
| `css/base.css` | Default styles for all `lexify-*` classes   |

---

## `@lexify/ui`

Toolbar primitives and pre-wired components.

```bash
pnpm add @lexify/ui
# peer deps: react
```

### Primitives

| Component          | Props                                            |
| ------------------ | ------------------------------------------------ |
| `Toolbar`          | `HTMLDivElement` attrs + `children`              |
| `ToolbarButton`    | `HTMLButtonElement` attrs + `isActive?: boolean` |
| `ToolbarGroup`     | `HTMLDivElement` attrs + `children`              |
| `ToolbarSeparator` | `HTMLDivElement` attrs                           |

### Pre-wired components

| Component             | Requires plugin        | Notes                   |
| --------------------- | ---------------------- | ----------------------- |
| `BoldButton`          | `plugin-bold`          | `isActive` prop         |
| `ItalicButton`        | `plugin-italic`        | `isActive` prop         |
| `UnderlineButton`     | `plugin-underline`     | `isActive` prop         |
| `StrikethroughButton` | `plugin-strikethrough` | `isActive` prop         |
| `CodeButton`          | `plugin-code`          | `isActive` prop         |
| `HeadingSelect`       | `plugin-heading`       | `<select>`              |
| `TextAlignButton`     | `plugin-text-align`    | `align` required prop   |
| `BulletListButton`    | `plugin-list`          | —                       |
| `NumberedListButton`  | `plugin-list`          | —                       |
| `RemoveListButton`    | `plugin-list`          | —                       |
| `FontSizeInput`       | `plugin-font-size`     | validates on blur/Enter |
| `FontColorInput`      | `plugin-font-color`    | validates on blur/Enter |

All components forward refs and accept all native HTML attributes.

---

## `@lexify/plugins`

All plugins in one tree-shakeable package. Your bundler (Vite, webpack, Rollup)
will drop anything you don't import.

```bash
pnpm add @lexify/plugins
```

### Format plugins

| Export                         | Plugin              | Description             |
| ------------------------------ | ------------------- | ----------------------- |
| `boldPlugin`                   | `LexifyPlugin`      | Toggle bold             |
| `FORMAT_BOLD_COMMAND`          | `LexifyCommand<void>` | —                     |
| `italicPlugin`                 | `LexifyPlugin`      | Toggle italic           |
| `FORMAT_ITALIC_COMMAND`        | `LexifyCommand<void>` | —                     |
| `underlinePlugin`              | `LexifyPlugin`      | Toggle underline        |
| `FORMAT_UNDERLINE_COMMAND`     | `LexifyCommand<void>` | —                     |
| `strikethroughPlugin`          | `LexifyPlugin`      | Toggle strikethrough    |
| `FORMAT_STRIKETHROUGH_COMMAND` | `LexifyCommand<void>` | —                     |
| `codePlugin`                   | `LexifyPlugin`      | Toggle inline code      |
| `FORMAT_CODE_COMMAND`          | `LexifyCommand<void>` | —                     |

### Block plugins

| Export                   | Plugin / Type                   | Notes                           |
| ------------------------ | ------------------------------- | ------------------------------- |
| `headingPlugin`          | `LexifyPlugin`                  | Registers `HeadingNode`         |
| `SET_HEADING_COMMAND`    | `LexifyCommand<HeadingTag>`     | `"h1"` – `"h6"`                 |
| `REMOVE_HEADING_COMMAND` | `LexifyCommand<void>`           | Converts back to paragraph      |
| `HeadingTag`             | `"h1"\|"h2"\|"h3"\|"h4"\|"h5"\|"h6"` | —                         |
| `textAlignPlugin`        | `LexifyPlugin`                  | —                               |
| `SET_TEXT_ALIGN_COMMAND` | `LexifyCommand<TextAlignValue>` | `"left"\|"center"\|"right"\|…`  |
| `TextAlignValue`         | union type                      | —                               |
| `listPlugin`             | `LexifyPlugin`                  | Registers `ListNode`, `ListItemNode` |
| `INSERT_UNORDERED_LIST_COMMAND` | `LexifyCommand<void>`    | —                               |
| `INSERT_ORDERED_LIST_COMMAND`   | `LexifyCommand<void>`    | —                               |
| `REMOVE_LIST_COMMAND`    | `LexifyCommand<void>`           | —                               |
| `INDENT_LIST_ITEM_COMMAND` | `LexifyCommand<void>`         | —                               |
| `OUTDENT_LIST_ITEM_COMMAND` | `LexifyCommand<void>`        | —                               |

### Inline style plugins

| Export                      | Type                    | Notes                          |
| --------------------------- | ----------------------- | ------------------------------ |
| `fontSizePlugin`            | `LexifyPlugin`          | Applies `font-size` style      |
| `SET_FONT_SIZE_COMMAND`     | `LexifyCommand<string>` | e.g. `"16px"`, `"1.2em"`       |
| `REMOVE_FONT_SIZE_COMMAND`  | `LexifyCommand<void>`   | —                              |
| `fontColorPlugin`           | `LexifyPlugin`          | Applies `color` style          |
| `SET_FONT_COLOR_COMMAND`    | `LexifyCommand<string>` | Any valid CSS color            |
| `REMOVE_FONT_COLOR_COMMAND` | `LexifyCommand<void>`   | —                              |

Valid font-size units: `px`, `em`, `rem`, `%`, `pt`, `vh`, `vw`, `ch`, `ex`.  
Valid colors: hex, functional (`rgb()`, `hsl()`, `oklch()`, …), ~35 named colors, `transparent`, `currentColor`.

### Link plugin

Registers `LinkNode` from `@lexical/link`.

| Export                | Type                         | Payload                    |
| --------------------- | ---------------------------- | -------------------------- |
| `linkPlugin`          | `LexifyPlugin`               | —                          |
| `INSERT_LINK_COMMAND` | `LexifyCommand<LinkPayload>` | `{ url, target?, rel? }`   |
| `UPDATE_LINK_COMMAND` | `LexifyCommand<LinkPayload>` | `{ url, target?, rel? }`   |
| `REMOVE_LINK_COMMAND` | `LexifyCommand<void>`        | —                          |
| `LinkPayload`         | type                         | `{ url: string; target?: string; rel?: string }` |

### History plugin

| Export               | Type                  | Notes                            |
| -------------------- | --------------------- | -------------------------------- |
| `historyPlugin`      | `LexifyPlugin`        | Registers undo/redo via `@lexical/history` |
| `UNDO_COMMAND`       | `LexifyCommand<void>` | —                                |
| `REDO_COMMAND`       | `LexifyCommand<void>` | —                                |
| `HISTORY_MERGE_DELAY`| `number`              | Default: `300` ms                |

### Style utilities (also exported for custom plugins)

| Export              | Signature                                                           | Description              |
| ------------------- | ------------------------------------------------------------------- | ------------------------ |
| `parseStyleString`  | `(style: string) => Map<string, string>`                            | Parse inline style attr  |
| `serializeStyleMap` | `(map: Map<string, string>) => string`                              | Serialize back to string |
| `setStyleProperty`  | `(existing: string, prop: string, value: string \| null) => string` | Set or remove property   |
| `isValidColor`      | `(value: string) => boolean`                                        | Validate CSS color       |
| `isValidFontSize`   | `(value: string) => boolean`                                        | Validate CSS font-size   |

---

## `@lexify/test-utils`

Testing helpers (currently a stub).

```bash
pnpm add -D @lexify/test-utils
```

| Export                                   | Description                          |
| ---------------------------------------- | ------------------------------------ |
| `createTestEditor(config?)`              | Create an editor pre-wired for tests |
| `dispatchOnce(editor, command, payload)` | Dispatch + flush in one call         |

---

## `@lexify/e2e`

Playwright configuration (stub). Run via `pnpm -F @lexify/e2e test`.
