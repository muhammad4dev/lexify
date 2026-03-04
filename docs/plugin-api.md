# Plugin API

Every Lexify feature is a plugin. This document covers the plugin contract,
how to write one, how to test it, and common patterns.

---

## The `LexifyPlugin` interface

```typescript
interface LexifyPlugin {
  /** Unique name — used to deduplicate registrations. */
  readonly name: string;

  /**
   * Lexical node classes required by this plugin.
   * Must be provided if the plugin introduces custom node types
   * (e.g. HeadingNode, LinkNode, ListNode).
   * Collected before the Lexical editor is constructed.
   */
  readonly nodes?: unknown[];

  /**
   * Called once when the plugin is registered with an editor instance.
   * Return a cleanup function that unregisters all handlers.
   */
  register(editor: LexifyEditor): () => void;
}
```

---

## Commands

Commands are typed tokens — plain objects with a `type` string and a phantom
type parameter for the payload.

```typescript
import { createCommand } from "@lexify/core";
import type { LexifyCommand } from "@lexify/core";

// Create a command — the string is the stable type identifier
export const MY_COMMAND: LexifyCommand<string> = createCommand<string>(
  "my-plugin:my-action",
);
```

**Rules:**

- Command type strings must be unique across plugins. Use `lexify:<scope>:<action>` format.
- Command objects have only a `type` property at runtime — they never carry Lexical types.
- Payload types are enforced via TypeScript generics; `void` means no payload.

---

## Writing a plugin

A minimal plugin with one command:

```typescript
// my-plugin.ts
import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export const MY_FORMAT_COMMAND: LexifyCommand<void> = createCommand<void>(
  "lexify:format:my-format",
);

export const myPlugin: LexifyPlugin = {
  name: "lexify/my-format",

  register(editor: LexifyEditor): () => void {
    const unsub = editor.registerCommandHandler(MY_FORMAT_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // apply formatting …
          selection.formatText("bold");
        }
      });
    });

    // Return a cleanup function
    return () => unsub();
  },
};
```

### With custom nodes

Plugins that require Lexical node classes declare them in `nodes[]`:

```typescript
import { HeadingNode } from "@lexical/rich-text";

export const headingPlugin: LexifyPlugin = {
  name: "lexify/heading",
  nodes: [HeadingNode], // collected before Lexical editor creation

  register(editor) {
    const unsub = editor.registerCommandHandler(SET_HEADING_COMMAND, (tag) => {
      editor.update(() => {
        /* ... */
      });
    });
    return unsub;
  },
};
```

Nodes typed as `unknown[]` to avoid leaking Lexical types in the public API.
They are passed to Lexical's `createEditor({ nodes })` internally.

---

## The `LexifyEditor` API

```typescript
interface LexifyEditor {
  readonly namespace: string;

  /** Register a plugin. Idempotent — same name is a no-op. */
  registerPlugin(plugin: LexifyPlugin): void;

  /** Register a typed command handler. Returns an unsubscribe function. */
  registerCommandHandler<T>(
    command: LexifyCommand<T>,
    handler: (payload: T) => void,
  ): () => void;

  /** Dispatch a command to all registered handlers. */
  dispatchCommand<T>(command: LexifyCommand<T>, payload: T): void;

  /**
   * Run a Lexical editor state mutation.
   * Use `$` Lexical functions inside the updater.
   */
  update(updater: () => void, options?: { discrete?: boolean }): void;

  /** Get the current editor state. */
  getEditorState(): EditorState;

  /** Serialize the current state to JSON. */
  toJSON(): SerializedEditorState;

  /** Tear down the editor; calls all plugin cleanup functions. */
  destroy(): void;
}
```

---

## Plugin patterns

### Inline style (CSS property on TextNode)

Used by `plugin-font-size` and `plugin-font-color`. Key steps:

1. Validate the incoming value.
2. Use `setStyleProperty(node.getStyle(), property, value)` from `@lexify/plugin-utils`.
3. Apply with `node.setStyle(newStyle)`.

```typescript
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { setStyleProperty, isValidFontSize } from "@lexify/plugins";

editor.update(() => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;
  for (const node of selection.getNodes()) {
    if ($isTextNode(node)) {
      node.setStyle(setStyleProperty(node.getStyle(), "font-size", value));
    }
  }
});
```

### Block-level (ElementNode)

Used by `plugin-heading` and `plugin-text-align`. Key steps:

1. Get selection.
2. Walk nodes to their block-level `ElementNode` ancestor.
3. Use a `seen` Set to avoid processing the same block twice.

```typescript
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

editor.update(() => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createHeadingNode("h2"));
  }
});
```

### Multiple commands (cleanup pattern)

When a plugin registers multiple commands, collect all unsubscribers:

```typescript
register(editor) {
  const unsubA = editor.registerCommandHandler(CMD_A, handlerA);
  const unsubB = editor.registerCommandHandler(CMD_B, handlerB);
  const unsubC = editor.registerCommandHandler(CMD_C, handlerC);
  return () => { unsubA(); unsubB(); unsubC(); };
},
```

---

## Testing plugins

Plugins are tested without React — only `createEditor` from `@lexify/core`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { myPlugin, MY_FORMAT_COMMAND } from "../index.js";
import { createEditor } from "@lexify/core";

describe("myPlugin", () => {
  it("has the correct name", () => {
    expect(myPlugin.name).toBe("lexify/my-format");
  });

  it("registers handler for MY_FORMAT_COMMAND", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    myPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(MY_FORMAT_COMMAND, expect.any(Function));
  });

  it("calls update() when command dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    myPlugin.register(editor);
    editor.dispatchCommand(MY_FORMAT_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("unregisters on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = myPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(MY_FORMAT_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof myPlugin.register(editor)).toBe("function");
  });

  it("command does not expose Lexical types", () => {
    expect(Object.keys(MY_FORMAT_COMMAND)).toEqual(["type"]);
  });
});
```

> **Anti-pattern:** never call `plugin.register(editor)` manually if you also
> pass the plugin in `createEditor({ plugins: [plugin] })` — double registration
> causes duplicate handlers.

---

## Packaging a plugin

If you're contributing a plugin to `@lexify/plugins`, add a new source file
under `packages/plugins/src/` and re-export it from `packages/plugins/src/index.ts`.

For a standalone third-party plugin, use this structure:

```
my-lexify-plugin/
  src/
    my-plugin.ts
    index.ts
    __tests__/
      my-plugin.test.ts
  package.json
  tsconfig.json
  tsup.config.ts
```

`tsup.config.ts` must mark `lexical` and `@lexify/core` as external:

```typescript
import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { compilerOptions: { composite: false } },
  sourcemap: true,
  clean: true,
  external: ["lexical", "@lexify/core"],
});
```
