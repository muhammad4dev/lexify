# Lexify

**Headless, plugin-driven Rich Text Editor** built on top of [Lexical](https://lexical.dev) by Meta.

Lexify wraps Lexical with a clean, opinionated abstraction layer:
no Lexical types leak into your application code, every feature is a plugin,
and the command system is fully typed and testable.

---

## Packages

| Package                                                          | Description                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@lexify/core`](packages/core)                                  | Editor engine: `createEditor`, command bus, plugin registry              |
| [`@lexify/react`](packages/react)                                | React bindings: `LexifyComposer`, `useLexifyEditor`, `LexifyContext`     |
| [`@lexify/ui`](packages/ui)                                      | Unstyled toolbar components: `Toolbar`, `BoldButton`, `HeadingSelect`, … |
| [`@lexify/themes`](packages/themes)                              | Theme system: `baseTheme`, `darkTheme`, `css/base.css`                   |
| [`@lexify/plugin-utils`](packages/plugins/utils)                 | Shared CSS style utilities used by style plugins                         |
| [`@lexify/plugin-bold`](packages/plugins/bold)                   | Bold text format                                                         |
| [`@lexify/plugin-italic`](packages/plugins/italic)               | Italic text format                                                       |
| [`@lexify/plugin-underline`](packages/plugins/underline)         | Underline text format                                                    |
| [`@lexify/plugin-strikethrough`](packages/plugins/strikethrough) | Strikethrough text format                                                |
| [`@lexify/plugin-code`](packages/plugins/code)                   | Inline code text format                                                  |
| [`@lexify/plugin-link`](packages/plugins/link)                   | Insert/update/remove links                                               |
| [`@lexify/plugin-font-size`](packages/plugins/font-size)         | Inline font-size via CSS style                                           |
| [`@lexify/plugin-font-color`](packages/plugins/font-color)       | Inline font color via CSS style                                          |
| [`@lexify/plugin-text-align`](packages/plugins/text-align)       | Block-level text alignment                                               |
| [`@lexify/plugin-heading`](packages/plugins/heading)             | Heading blocks (h1–h6)                                                   |
| [`@lexify/plugin-list`](packages/plugins/list)                   | Bullet and numbered lists                                                |

---

## Quick start

### Install

```bash
pnpm add @lexify/core @lexify/react lexical @lexical/react
```

### Minimal editor

```tsx
import { LexifyComposer } from "@lexify/react";
import { boldPlugin } from "@lexify/plugin-bold";
import { italicPlugin } from "@lexify/plugin-italic";

export function MyEditor() {
  return (
    <LexifyComposer
      namespace="my-editor"
      plugins={[boldPlugin, italicPlugin]}
      className="my-editor-content"
    >
      {/* optional toolbar or plugins as children */}
    </LexifyComposer>
  );
}
```

### With theme

```tsx
import { baseTheme } from "@lexify/themes";
import "@lexify/themes/css/base.css";

<LexifyComposer namespace="my-editor" plugins={[...]} theme={baseTheme}>
  ...
</LexifyComposer>
```

### Dispatch commands from a toolbar

```tsx
import { useLexifyEditor } from "@lexify/react";
import { FORMAT_BOLD_COMMAND } from "@lexify/plugin-bold";

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
```

### Use the pre-built toolbar

```tsx
import {
  Toolbar,
  ToolbarGroup,
  BoldButton,
  ItalicButton,
  HeadingSelect,
} from "@lexify/ui";

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
pnpm --filter @lexify/core build
pnpm --filter @lexify/plugin-bold test
pnpm --filter @lexify/ui test:watch
```

### Run the demo

```bash
pnpm --filter @lexify/demo dev
```

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for design decisions.
See [`docs/getting-started.md`](docs/getting-started.md) for a full tutorial.
See [`docs/plugin-api.md`](docs/plugin-api.md) for the plugin contract.
See [`docs/packages.md`](docs/packages.md) for per-package API reference.
See [`docs/themes.md`](docs/themes.md) for the theme system.
