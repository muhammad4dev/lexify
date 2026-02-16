# Package Reference

All packages live under `packages/` (or `apps/` for the demo).

---

## `@lexra/core`

Core engine — no React, no UI.

```bash
pnpm add @lexra/core
```

### Exports

| Export | Description |
|---|---|
| `createEditor(config)` | Factory — returns a `LexraEditor` instance |
| `createCommand<T>(type)` | Create a typed command token |
| `LexraEditor` | Editor interface (type) |
| `LexraPlugin` | Plugin interface (type) |
| `LexraCommand<T>` | Command token type |
| `LexraEditorConfig` | Config type for `createEditor` |
| `LexraTheme` | Theme shape type |
| `LexraTextTheme` | Text sub-theme type |

### `LexraEditorConfig`

```typescript
interface LexraEditorConfig {
  namespace: string;
  plugins?: LexraPlugin[];
  theme?: LexraTheme;
}
```

---

## `@lexra/react`

React bindings.

```bash
pnpm add @lexra/react
# peer deps: react, react-dom, lexical, @lexical/react
```

### Exports

| Export | Description |
|---|---|
| `LexraComposer` | Root component — mounts the editor |
| `useLexraEditor()` | Hook — returns the `LexraEditor` for the nearest composer |
| `LexraContext` | React context object (for test wrappers) |
| `LexraComposerProps` | Prop types for `LexraComposer` |

### `LexraComposerProps`

```typescript
interface LexraComposerProps {
  namespace: string;
  plugins?: LexraPlugin[];
  theme?: LexraTheme;
  className?: string;
  placeholder?: React.ReactNode;
  initialState?: SerializedEditorState;
  value?: SerializedEditorState;
  onChange?: (state: SerializedEditorState) => void;
  children?: React.ReactNode;
}
```

---

## `@lexra/themes`

Theme objects and CSS.

```bash
pnpm add @lexra/themes
```

### Exports

| Export | Description |
|---|---|
| `baseTheme` | Complete theme with `lexra-*` class names |
| `darkTheme` | Same as `baseTheme` but with `-dark` suffix |
| `LexraTheme` | Re-exported from `@lexra/core` |
| `css/base.css` | Default styles for all `lexra-*` classes |

---

## `@lexra/ui`

Toolbar primitives and pre-wired components.

```bash
pnpm add @lexra/ui
# peer deps: react
```

### Primitives

| Component | Props |
|---|---|
| `Toolbar` | `HTMLDivElement` attrs + `children` |
| `ToolbarButton` | `HTMLButtonElement` attrs + `isActive?: boolean` |
| `ToolbarGroup` | `HTMLDivElement` attrs + `children` |
| `ToolbarSeparator` | `HTMLDivElement` attrs |

### Pre-wired components

| Component | Requires plugin | Notes |
|---|---|---|
| `BoldButton` | `plugin-bold` | `isActive` prop |
| `ItalicButton` | `plugin-italic` | `isActive` prop |
| `UnderlineButton` | `plugin-underline` | `isActive` prop |
| `StrikethroughButton` | `plugin-strikethrough` | `isActive` prop |
| `CodeButton` | `plugin-code` | `isActive` prop |
| `HeadingSelect` | `plugin-heading` | `<select>` |
| `TextAlignButton` | `plugin-text-align` | `align` required prop |
| `BulletListButton` | `plugin-list` | — |
| `NumberedListButton` | `plugin-list` | — |
| `RemoveListButton` | `plugin-list` | — |
| `FontSizeInput` | `plugin-font-size` | validates on blur/Enter |
| `FontColorInput` | `plugin-font-color` | validates on blur/Enter |

All components forward refs and accept all native HTML attributes.

---

## `@lexra/plugin-bold`

```bash
pnpm add @lexra/plugin-bold
```

| Export | Type | Description |
|---|---|---|
| `boldPlugin` | `LexraPlugin` | Plugin object |
| `FORMAT_BOLD_COMMAND` | `LexraCommand<void>` | Toggle bold on selection |

---

## `@lexra/plugin-italic`

| Export | Type |
|---|---|
| `italicPlugin` | `LexraPlugin` |
| `FORMAT_ITALIC_COMMAND` | `LexraCommand<void>` |

---

## `@lexra/plugin-underline`

| Export | Type |
|---|---|
| `underlinePlugin` | `LexraPlugin` |
| `FORMAT_UNDERLINE_COMMAND` | `LexraCommand<void>` |

---

## `@lexra/plugin-strikethrough`

| Export | Type |
|---|---|
| `strikethroughPlugin` | `LexraPlugin` |
| `FORMAT_STRIKETHROUGH_COMMAND` | `LexraCommand<void>` |

---

## `@lexra/plugin-code`

Inline code format. Not to be confused with code block (use `plugin-heading`'s
block variant or a dedicated plugin).

| Export | Type |
|---|---|
| `codePlugin` | `LexraPlugin` |
| `FORMAT_CODE_COMMAND` | `LexraCommand<void>` |

---

## `@lexra/plugin-heading`

Registers `HeadingNode` from `@lexical/rich-text`.

| Export | Type | Payload |
|---|---|---|
| `headingPlugin` | `LexraPlugin` | — |
| `SET_HEADING_COMMAND` | `LexraCommand<HeadingTag>` | `"h1"` \| `"h2"` … `"h6"` |
| `REMOVE_HEADING_COMMAND` | `LexraCommand<void>` | — |
| `HeadingTag` | union type | `"h1"` \| `"h2"` \| `"h3"` \| `"h4"` \| `"h5"` \| `"h6"` |

---

## `@lexra/plugin-text-align`

| Export | Type | Payload |
|---|---|---|
| `textAlignPlugin` | `LexraPlugin` | — |
| `SET_TEXT_ALIGN_COMMAND` | `LexraCommand<TextAlignValue>` | `"left"` \| `"center"` \| `"right"` \| `"justify"` |
| `TextAlignValue` | union type | — |

---

## `@lexra/plugin-font-size`

Applies `font-size` as an inline `style` attribute on `TextNode`s.

| Export | Type | Payload |
|---|---|---|
| `fontSizePlugin` | `LexraPlugin` | — |
| `SET_FONT_SIZE_COMMAND` | `LexraCommand<string>` | e.g. `"16px"`, `"1.2em"` |
| `REMOVE_FONT_SIZE_COMMAND` | `LexraCommand<void>` | — |

Valid font-size units: `px`, `em`, `rem`, `%`, `pt`, `vh`, `vw`, `ch`, `ex`.
Invalid values are ignored.

---

## `@lexra/plugin-font-color`

Applies `color` as an inline `style` attribute on `TextNode`s.

| Export | Type | Payload |
|---|---|---|
| `fontColorPlugin` | `LexraPlugin` | — |
| `SET_FONT_COLOR_COMMAND` | `LexraCommand<string>` | Any valid CSS color |
| `REMOVE_FONT_COLOR_COMMAND` | `LexraCommand<void>` | — |

Accepts: hex (`#rgb`, `#rrggbb`, `#rrggbbaa`), functional (`rgb()`, `hsl()`,
`oklch()`, etc.), ~35 named colors, `transparent`, `currentColor`.

---

## `@lexra/plugin-link`

Registers `LinkNode` from `@lexical/link`.

| Export | Type | Payload |
|---|---|---|
| `linkPlugin` | `LexraPlugin` | — |
| `INSERT_LINK_COMMAND` | `LexraCommand<LinkPayload>` | `{ url, title?, target? }` |
| `UPDATE_LINK_COMMAND` | `LexraCommand<LinkPayload>` | `{ url, title?, target? }` |
| `REMOVE_LINK_COMMAND` | `LexraCommand<void>` | — |
| `LinkPayload` | type | `{ url: string; title?: string; target?: string }` |

---

## `@lexra/plugin-list`

Registers `ListNode` and `ListItemNode` from `@lexical/list`.

| Export | Type | Payload |
|---|---|---|
| `listPlugin` | `LexraPlugin` | — |
| `INSERT_BULLET_LIST_COMMAND` | `LexraCommand<void>` | — |
| `INSERT_NUMBER_LIST_COMMAND` | `LexraCommand<void>` | — |
| `REMOVE_LIST_COMMAND` | `LexraCommand<void>` | — |
| `INDENT_LIST_COMMAND` | `LexraCommand<void>` | — |
| `OUTDENT_LIST_COMMAND` | `LexraCommand<void>` | — |

---

## `@lexra/plugin-utils`

Shared CSS style string utilities used by other plugins.

```bash
pnpm add @lexra/plugin-utils
```

| Export | Signature | Description |
|---|---|---|
| `parseStyleString` | `(style: string) => Map<string, string>` | Parse `style` attribute string |
| `serializeStyleMap` | `(map: Map<string, string>) => string` | Serialize back to string |
| `setStyleProperty` | `(existing: string, prop: string, value: string \| null) => string` | Set or remove a property |
| `isValidColor` | `(value: string) => boolean` | Validate CSS color |
| `isValidFontSize` | `(value: string) => boolean` | Validate CSS font-size |

---

## `@lexra/test-utils`

Testing helpers (currently a stub).

```bash
pnpm add -D @lexra/test-utils
```

| Export | Description |
|---|---|
| `createTestEditor(config?)` | Create an editor pre-wired for tests |
| `dispatchOnce(editor, command, payload)` | Dispatch + flush in one call |

---

## `@lexra/e2e`

Playwright configuration (stub). Run via `pnpm -F @lexra/e2e test`.
