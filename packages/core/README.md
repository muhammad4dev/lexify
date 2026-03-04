# @lexify/core

> Editor engine for [Lexify](https://github.com/muhammad4dev/lexify) — no React, no UI, no Lexical types in your app code.

📖 **[Full documentation →](https://muhammad4dev.github.io/lexify)** · [GitHub](https://github.com/muhammad4dev/lexify) · [Changelog](https://github.com/muhammad4dev/lexify/releases)

## Installation

```bash
pnpm add @lexify/core lexical
```

## Overview

`@lexify/core` is the foundation of Lexify. It provides a typed command bus, plugin registry, and the `LexifyEditor` interface that abstracts over Lexical's editor. No Lexical types leak into your application — the public API is fully self-contained.

## Usage

```typescript
import { createEditor, createCommand } from "@lexify/core";
import type { LexifyPlugin } from "@lexify/core";

// Create a typed command
const MY_COMMAND = createCommand<string>("my-plugin:my-action");

// Write a plugin
const myPlugin: LexifyPlugin = {
  name: "my-plugin",
  register(editor) {
    const unsub = editor.registerCommandHandler(MY_COMMAND, (payload) => {
      editor.update(() => {
        // use Lexical $ functions here
      });
    });
    return unsub; // cleanup
  },
};

// Create the editor
const editor = createEditor({
  namespace: "my-editor",
  plugins: [myPlugin],
});

// Dispatch a command
editor.dispatchCommand(MY_COMMAND, "hello");
```

## API

### `createEditor(config)`

| Option      | Type             | Description                    |
| ----------- | ---------------- | ------------------------------ |
| `namespace` | `string`         | Unique identifier              |
| `plugins`   | `LexifyPlugin[]` | Plugins to register at startup |
| `theme`     | `LexifyTheme`    | CSS class name map             |

### `createCommand<T>(type)`

Creates a typed command token. `type` must be globally unique — use `scope:action` format.

### `LexifyEditor` interface

```typescript
interface LexifyEditor {
  namespace: string;
  registerPlugin(plugin: LexifyPlugin): void;
  registerCommandHandler<T>(
    command: LexifyCommand<T>,
    handler: (payload: T) => void,
  ): () => void;
  dispatchCommand<T>(command: LexifyCommand<T>, payload: T): void;
  update(updater: () => void): void;
  destroy(): void;
}
```

## License

MIT © [Muhammad Mustafa](https://github.com/muhammad4dev)
