# Lexify AI Workflow (GitHub Copilot–Specific)

This document defines the **official AI development workflow** for Lexify when using  
:contentReference[oaicite:0]{index=0} (Chat + Agent mode).

The goal is to:

- Keep architecture stable
- Prevent leakage of Lexical internals
- Maintain strict TypeScript quality
- Ensure plugin isolation
- Enforce tests-first discipline
- Avoid AI-generated architectural drift

This workflow is mandatory for all AI-assisted contributions.

---

# 1. Core Principles

Copilot is an assistant — not an architect.

Every AI-generated change must:

- Respect Lexify’s layered architecture
- Follow plugin-first design
- Include tests
- Preserve RTL compatibility
- Maintain undo/redo integrity
- Avoid React re-render per keystroke
- Avoid `any`
- Avoid leaking Lexical types

If Copilot violates any of these, reject the output.

---

# 2. Repository Architecture Reminder

Lexify is structured as:

```

packages/
core/
react/
plugins/
ui/
themes/
test-utils/
e2e/

```

### Rules

- `@lexify/core` → no React, no UI, no Lexical public types
- `@lexify/react` → bindings only
- `@lexify/plugins/*` → feature isolation
- `@lexify/ui` → optional visual layer only
- `test-utils` → testing helpers only

Copilot must not blur boundaries.

---

# 3. Copilot Session Workflow

Every feature must follow this flow.

---

## Step 1 — Planning Mode (Mandatory)

Before generating code, ask Copilot:

> Generate implementation plan only. Do not generate code yet.

The plan must include:

- Files to modify
- Plugin responsibilities
- Command additions
- Serialization impact
- Test cases required
- Edge cases
- RTL considerations
- Undo/redo implications

Do not proceed until plan looks correct.

---

## Step 2 — Implementation

After approving the plan:

> Generate full TypeScript implementation following Lexify architecture. Include no `any`. No public Lexical types.

Ensure:

- Strict typing
- No architecture drift
- No duplicated logic
- No UI in core

---

## Step 3 — Test Generation (Mandatory)

Then explicitly request:

> Generate comprehensive Vitest tests for this feature.

Tests must cover:

- Full selection
- Partial selection
- Multiple applications (no duplication)
- Undo
- Redo
- Mixed styled content
- Serialization round-trip
- RTL scenarios (if relevant)

No snapshot-only tests.

---

## Step 4 — Review Mode

Ask Copilot:

> Analyze this implementation for:
>
> - Architectural violations
> - Type safety issues
> - Performance risks
> - RTL compatibility
> - Undo/redo safety
> - Style normalization consistency

Refactor before merging.

---

# 4. Approved Prompt Templates

---

## Plugin Creation

```

Create a Lexify plugin named <PLUGIN_NAME>.

Requirements:

* Located in @lexify/plugin-<name>
* Must register commands
* Must not expose Lexical types
* Must support undo/redo
* Must not duplicate inline styles
* Must include Vitest tests
* Must respect RTL behavior

First provide implementation plan.
Then provide code.
Then provide tests.
Then analyze edge cases.

```

---

## Inline Style Plugin

```

Implement an inline style plugin for Lexify.

Constraints:

* Use TextNode.setStyle internally.
* Normalize and deduplicate style strings.
* Whitelist allowed values.
* Preserve existing inline styles.
* Maintain undo/redo integrity.
* Include comprehensive tests.

Plan first. Then implement.

```

---

## Core Modification

```

We are modifying @lexify/core.

Constraints:

* No React imports.
* No UI logic.
* No Lexical public types.
* Strict TypeScript.
* Backward compatible.

First analyze architectural risks.
Then propose solution.
Then implement.
Then provide migration notes.

```

---

## React Layer Change

```

We are modifying @lexify/react.

Requirements:

* Support controlled & uncontrolled modes.
* Avoid re-render per keystroke.
* Memoize heavy logic.
* SSR safe.
* Strict typing.
* Provide tests.

Plan first.

```

---

# 5. Copilot Agent Mode Rules

When using Copilot Agent:

- Never allow it to modify unrelated files.
- Always review diff before commit.
- Always run:
  - Type check
  - Unit tests
  - Lint
- Never auto-merge without review.

---

# 6. Testing Enforcement

No feature is complete without:

- Unit tests
- Integration tests (if React behavior)
- Undo/redo validation
- Serialization validation
- Edge-case validation

If Copilot forgets tests → reject output.

---

# 7. RTL Enforcement

Before merging formatting features, run:

```

Analyze RTL compatibility for:

* Selection behavior
* Alignment
* Cursor movement
* Mixed LTR/RTL text
* Logical CSS usage

```

Editors often break here. Do not ignore.

---

# 8. Performance Checklist

For every change:

- Does this cause React re-render per keystroke?
- Does this reapply styles unnecessarily?
- Does this reparse entire document?
- Does this increase bundle size?
- Is plugin tree-shakeable?

Copilot tends to ignore performance unless explicitly told.

---

# 9. Security & Sanitization

When touching paste or HTML:

- Whitelist tags
- Whitelist inline styles
- Strip scripts
- Strip event handlers
- Prevent XSS
- Include tests

Never trust AI to remember sanitization unless instructed.

---

# 10. Pull Request Guidelines (AI-Generated)

Every AI-generated PR must include:

- Problem statement
- Architectural decisions
- Edge cases handled
- Performance considerations
- Test coverage
- Breaking changes (if any)

---

# 11. AI Anti-Patterns (Reject Immediately)

- Using `any`
- Exporting Lexical types publicly
- Mixing UI inside core
- Duplicating inline styles
- Ignoring undo/redo
- Skipping tests
- Snapshot-only tests
- Massive refactors without plan
- Adding dependencies without justification

---

# 12. Continuous Improvement

After merging AI-generated code:

- Review failure cases
- Improve prompt templates
- Update this workflow document
- Keep architecture stable

Copilot adapts to context — keep context clean.

---

# Final Rule

Copilot assists.

Lexify’s architecture leads.

Structure > Speed.
Tests > Assumptions.
Plan > Code.
