# Architecture

Design decisions behind Lexra's implementation.

---

## Core principle: no Lexical types in the public API

Lexra's public API exposes zero Lexical types. `LexraEditor`, `LexraPlugin`, and
`LexraCommand` are all defined in `@lexra/core` without importing from `lexical`.

**Why:** Lexical's API is large, changes frequently, and ties consumers to its
abstractions. Lexra's abstraction gives plugin authors a stable surface to target
and makes the editor independently testable without a DOM.

**How it works:**
- `nodes?: unknown[]` on `LexraPlugin` — node classes pass through opaquely
- `LexraTheme` mirrors `EditorThemeClasses` in shape but doesn't import it
- `editor.update()` accepts a plain `() => void` callback — Lexical `$`
  functions are called *inside* the callback and never appear in the signature
- The internal Lexical editor is never exposed on `LexraEditor`

---

## Command bus

The command system is implemented independently of Lexical's `LexicalCommand`
system. Each `LexraEditor` instance owns a `Map<string, Set<handler>>`.

```
dispatchCommand(cmd, payload)
  → commandHandlers.get(cmd.type)
  → for each handler: handler(payload)
```

`LexraCommand<TPayload>` is a phantom-typed token: `{ type: string }`. The
`TPayload` type parameter enforces dispatch/handler type-safety at compile time
but has zero runtime cost.

**Why not use Lexical's command system?** Lexical commands require a registered
Lexical editor and a `LexicalCommand<T>` token (a Lexical type). Using our own
bus keeps the command system decoupled from Lexical's lifecycle and makes it
unit-testable without mounting a DOM.

---

## Plugin registration and idempotency

Plugins are registered by name. The second `registerPlugin()` call with the
same `plugin.name` is a no-op:

```typescript
const registeredPlugins = new Map<string, () => void>(); // name → cleanup
```

This means the `plugins` array can be re-passed on re-render without causing
duplicate handlers.

---

## Node registration timing

Lexical requires all custom node classes to be provided at editor construction
time via `createEditor({ nodes: [...] })`. They cannot be registered after the
fact.

Lexra solves this by collecting `plugin.nodes` arrays in `LexraComposer` before
constructing the `LexicalComposer`. The nodes are passed to `LexicalComposer`'s
`initialConfig.nodes`.

```
LexraComposer renders
  → collect plugins[].nodes (flat)
  → pass to LexicalComposer initialConfig.nodes
  → LexicalComposer constructs Lexical editor with all nodes registered
  → LexraInner receives the Lexical editor via useLexicalComposerContext()
  → createEditor({ _lexicalEditor: lexical }) — reuses it, doesn't create another
```

---

## `@lexra/react` and the two-editor problem

Early versions of `LexraComposer` created a Lexical editor inside `createEditor()`
*and* let `LexicalComposer` create its own — resulting in two separate editors.
Plugin mutations via `editor.update()` went to the wrong (non-rendered) editor.

**Fix:** `LexraInner` injects the `LexicalComposer`'s editor via the internal
`_lexicalEditor` config option. `createEditor()` uses it directly instead of
creating a new one. The standalone `createEditor()` path (used in tests) still
creates its own.

---

## `@lexra/ui` — headless toolbar components

`@lexra/ui` exports two layers:

1. **Primitives** — `Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`.  
   Fully unstyled HTML elements with semantic roles. Accept all native HTML
   attributes. `ToolbarButton` sets `data-active` for CSS targeting.

2. **Pre-wired components** — `BoldButton`, `HeadingSelect`, `FontSizeInput`, etc.  
   Import commands from their respective plugin packages and dispatch them via
   `useLexraEditor()`. Accept `isActive`, `disabled`, and other `ToolbarButton`
   props — but **not** `onClick` (which is handled internally).

Components provide no default visual styling. Apply your own CSS or import
`@lexra/themes/css/base.css` as a starting point.

---

## `@lexra/plugin-utils` — shared CSS style utilities

`parseStyleString`, `serializeStyleMap`, `setStyleProperty`, `isValidColor`, and
`isValidFontSize` are extracted into a shared package. This avoids duplicating
the paren-depth-aware CSS parser (needed to handle `url(data:...;...)` in style
strings) across multiple plugins.

Style plugins (`plugin-font-size`, `plugin-font-color`) import from here rather
than shipping private copies.

---

## TypeScript strictness

`tsconfig.base.json` enables:

- `strict: true` — full strict mode
- `exactOptionalPropertyTypes: true` — disallows `{ prop: T | undefined }` where `{ prop?: T }` is expected
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noUncheckedIndexedAccess: true`

The `exactOptionalPropertyTypes` flag causes friction when building objects
conditionally. The pattern used throughout is a ternary spread:

```typescript
// Wrong — TypeScript rejects T | undefined for exactOptionalPropertyTypes
const args = { prop: value !== undefined ? value : undefined };

// Correct — omit the key entirely when not needed
const args = value !== undefined ? { prop: value } : {};
```

---

## Testing strategy

- **Plugin tests:** `createEditor()` + `vi.spyOn(editor, "update")`. No DOM, no
  React. Verifies command registration, dispatch → update(), cleanup, command
  shape.
- **React tests:** `@testing-library/react` + jsdom + `LexraContext.Provider`
  with a mock editor. Verifies render, aria labels, click → `dispatchCommand`.
- **Theme tests:** pure JS — verify object shape and class name presence.
- **E2E:** Playwright (stub, not yet wired up).
