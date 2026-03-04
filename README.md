# Lexify

**Headless, plugin-driven Rich Text Editor** built on top of [Lexical](https://lexical.dev) by Meta.

Lexify wraps Lexical with a clean, opinionated abstraction layer:
no Lexical types leak into your application code, every feature is a plugin,
and the command system is fully typed and testable.

---

## Packages

| Package                                                          | Description                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@lexify/core`](packages/core)       | Editor engine: `createEditor`, command bus, plugin registry              |
| [`@lexify/react`](packages/react)     | React bindings: `LexifyComposer`, `useLexifyEditor`, `LexifyContext`     |
| [`@lexify/plugins`](packages/plugins) | All plugins in one tree-shakeable package                                |
| [`@lexify/ui`](packages/ui)           | Unstyled toolbar components: `Toolbar`, `BoldButton`, `HeadingSelect`, … |
| [`@lexify/themes`](packages/themes)   | Theme system: `baseTheme`, `darkTheme`, `css/base.css`                   |

---

## Quick start

### Install

```bash
# Required peer deps
pnpm add lexical @lexical/react

# Core
pnpm add @lexify/core @lexify/react

# All plugins — tree-shakeable, bundler drops what you don't import
pnpm add @lexify/plugins

# Optional: pre-built toolbar + themes
pnpm add @lexify/ui @lexify/themes
```

### Minimal editor

```tsx
import { LexifyComposer } from "@lexify/react";
import { boldPlugin, italicPlugin } from "@lexify/plugins";

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
import { FORMAT_BOLD_COMMAND } from "@lexify/plugins";

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
pnpm --filter @lexify/plugins test
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
