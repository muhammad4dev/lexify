# Lexra

**Headless, plugin-driven Rich Text Editor** built on top of [Lexical](https://lexical.dev) by Meta.

Lexra wraps Lexical with a clean, opinionated abstraction layer:
no Lexical types leak into your application code, every feature is a plugin,
and the command system is fully typed and testable.

---

## Packages

| Package | Description |
|---|---|
| [`@lexra/core`](packages/core) | Editor engine: `createEditor`, command bus, plugin registry |
| [`@lexra/react`](packages/react) | React bindings: `LexraComposer`, `useLexraEditor`, `LexraContext` |
| [`@lexra/ui`](packages/ui) | Unstyled toolbar components: `Toolbar`, `BoldButton`, `HeadingSelect`, … |
| [`@lexra/themes`](packages/themes) | Theme system: `baseTheme`, `darkTheme`, `css/base.css` |
| [`@lexra/plugin-utils`](packages/plugins/utils) | Shared CSS style utilities used by style plugins |
| [`@lexra/plugin-bold`](packages/plugins/bold) | Bold text format |
| [`@lexra/plugin-italic`](packages/plugins/italic) | Italic text format |
| [`@lexra/plugin-underline`](packages/plugins/underline) | Underline text format |
| [`@lexra/plugin-strikethrough`](packages/plugins/strikethrough) | Strikethrough text format |
| [`@lexra/plugin-code`](packages/plugins/code) | Inline code text format |
| [`@lexra/plugin-link`](packages/plugins/link) | Insert/update/remove links |
| [`@lexra/plugin-font-size`](packages/plugins/font-size) | Inline font-size via CSS style |
| [`@lexra/plugin-font-color`](packages/plugins/font-color) | Inline font color via CSS style |
| [`@lexra/plugin-text-align`](packages/plugins/text-align) | Block-level text alignment |
| [`@lexra/plugin-heading`](packages/plugins/heading) | Heading blocks (h1–h6) |
| [`@lexra/plugin-list`](packages/plugins/list) | Bullet and numbered lists |

---

## Quick start

### Install

```bash
pnpm add @lexra/core @lexra/react lexical @lexical/react
```

### Minimal editor

```tsx
import { LexraComposer } from "@lexra/react";
import { boldPlugin } from "@lexra/plugin-bold";
import { italicPlugin } from "@lexra/plugin-italic";

export function MyEditor() {
  return (
    <LexraComposer
      namespace="my-editor"
      plugins={[boldPlugin, italicPlugin]}
      className="my-editor-content"
    >
      {/* optional toolbar or plugins as children */}
    </LexraComposer>
  );
}
```

### With theme

```tsx
import { baseTheme } from "@lexra/themes";
import "@lexra/themes/css/base.css";

<LexraComposer namespace="my-editor" plugins={[...]} theme={baseTheme}>
  ...
</LexraComposer>
```

### Dispatch commands from a toolbar

```tsx
import { useLexraEditor } from "@lexra/react";
import { FORMAT_BOLD_COMMAND } from "@lexra/plugin-bold";

function BoldButton() {
  const editor = useLexraEditor();
  return (
    <button onClick={() => editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined)}>
      B
    </button>
  );
}
```

### Use the pre-built toolbar

```tsx
import { Toolbar, ToolbarGroup, BoldButton, ItalicButton, HeadingSelect } from "@lexra/ui";

function MyToolbar() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <HeadingSelect />
      </ToolbarGroup>
      <ToolbarGroup>
        <BoldButton />
        <ItalicButton />
      </ToolbarGroup>
    </Toolbar>
  );
}
```

---

## Monorepo commands

```bash
pnpm install          # install all deps
pnpm build            # build all packages (recursive)
pnpm test             # run all unit tests
pnpm typecheck        # typecheck all packages
pnpm clean            # remove all dist/ folders
```

### Single-package commands

```bash
pnpm --filter @lexra/core build
pnpm --filter @lexra/plugin-bold test
pnpm --filter @lexra/ui test:watch
```

### Run the demo

```bash
pnpm --filter @lexra/demo dev
```

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for design decisions.
See [`docs/getting-started.md`](docs/getting-started.md) for a full tutorial.
See [`docs/plugin-api.md`](docs/plugin-api.md) for the plugin contract.
See [`docs/packages.md`](docs/packages.md) for per-package API reference.
See [`docs/themes.md`](docs/themes.md) for the theme system.
