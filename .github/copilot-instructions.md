# Copilot Instructions for Lexify

**Lexify** is a headless, plugin-driven Rich Text Editor built on top of Lexical. It is a library, not an application.

---

## Commands

```bash
pnpm install                        # install all workspace deps
pnpm build                          # build all packages with tsup
pnpm test                           # run all tests with Vitest
pnpm vitest run packages/core       # run tests for a single package
pnpm tsc --noEmit                   # type-check without emitting
pnpm lint                           # lint all packages
```

Always use `pnpm`. Never use `npm` or `yarn`.

---

## Architecture

pnpm workspace monorepo with strict layer boundaries:

```
packages/
  core/        → @lexify/core     — engine abstraction only; no React, no UI, no public Lexical types
  react/       → @lexify/react    — React bindings only; no business logic
  plugins/     → @lexify/plugins/* — feature plugins; tree-shakeable, isolated, no UI dependency
  ui/          → @lexify/ui       — optional visual components only
  themes/      → @lexify/themes   — styling presets only
  test-utils/  →                 — shared testing helpers only
  e2e/         →                 — end-to-end tests only
```

**Layer rules:**

- `@lexify/core` must not import from React, UI, or any Lexical public types
- Plugins must not import from `@lexify/ui`
- Cross-package dependencies use `workspace:*` protocol; never relative deep imports

Every non-engine feature must be a plugin. If it's not engine-level, it belongs in `packages/plugins/`.

---

## Build Tooling

All library packages use **tsup**. Each `tsup.config.ts` must produce:

```ts
export default {
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
};
```

Do not use Vite, Webpack, or Rollup directly to build library packages. Builds must be side-effect free where possible.

---

## Key Conventions

**TypeScript:** Strict mode throughout. No `any`, no implicit `any`, no unused exports.

**Plugins:**

- Register all behavior via the plugin command system
- Must support undo/redo
- Must be tree-shakeable (no side effects at module level)

**Inline styles** (`@lexify/plugins/*` style features):

- Use `TextNode.setStyle` internally
- Normalize and deduplicate style strings before applying
- Whitelist allowed values; preserve existing styles
- Ensure serialization round-trip integrity

**React layer (`@lexify/react`):**

- Support both controlled and uncontrolled modes
- No re-render per keystroke — memoize heavy logic
- Must be SSR-safe

**RTL:** All formatting features must work in RTL-only, mixed RTL/LTR, and handle alignment and cursor movement correctly. Use logical CSS properties.

**HTML/paste handling:** Whitelist tags and styles, strip scripts and event handlers, prevent XSS. Always include sanitization tests.

---

## Testing Requirements (Vitest)

Every feature needs:

- Full and partial selection behavior
- Multiple applications without duplication
- Undo and redo validation
- Serialization round-trip
- Edge-case coverage

No snapshot-only tests.

---

## Feature Workflow

For every feature, follow this order — do not skip steps:

1. **Plan** — list files to modify, commands to add, serialization impact, test cases, RTL considerations, undo/redo implications
2. **Implement** — strict TypeScript, no `any`, no public Lexical types, no UI in core
3. **Tests** — comprehensive Vitest suite per requirements above
4. **Review** — check for architectural violations, type issues, performance risks, RTL compat, undo/redo safety

---

## Prompt Templates

**New plugin:**

```
Create a Lexify plugin named <PLUGIN_NAME> in @lexify/plugin-<name>.
Must register commands, support undo/redo, not expose Lexical types, not duplicate inline styles, include Vitest tests, respect RTL.
Plan first. Then implement. Then tests. Then edge cases.
```

**Inline style plugin:**

```
Implement an inline style plugin for Lexify.
Use TextNode.setStyle. Normalize and deduplicate styles. Whitelist values. Preserve existing styles. Maintain undo/redo. Include tests.
Plan first. Then implement.
```

**Modifying @lexify/core:**

```
Modifying @lexify/core. No React, no UI, no Lexical public types. Strict TypeScript. Backward compatible.
Analyze architectural risks first. Then propose. Then implement. Then migration notes.
```

**Modifying @lexify/react:**

```
Modifying @lexify/react. Controlled & uncontrolled support. No re-render per keystroke. Memoize. SSR-safe. Strict typing. Tests required.
Plan first.
```

---

## Anti-Patterns — Reject Immediately

- Using `any`
- Exporting Lexical types publicly
- UI logic inside `@lexify/core`
- Bypassing the plugin command system
- Applying inline styles without normalization/deduplication
- Ignoring undo/redo
- Snapshot-only tests
- Adding dependencies without justification
- Modifying unrelated files in agent mode
