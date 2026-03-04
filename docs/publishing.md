# Publishing to npm

Lexify is a pnpm monorepo. All publishable packages live under `packages/` and
share the `@lexify` npm scope.

---

## Prerequisites

1. **npm account** — create one at [npmjs.com](https://www.npmjs.com)
2. **`@lexify` org** — create the organization at npmjs.com so scoped packages can
   be published publicly
3. **npm access token** — generate at npmjs.com → Account → Access Tokens →
   _Automation_ type (for CI) or _Publish_ type (for local)

---

## One-time setup

### Local

```bash
npm login
# Verify you're logged in:
npm whoami
```

### GitHub Actions (CI publishing)

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add a secret named `NPM_TOKEN` with your npm Automation token

---

## Release workflow

Releases are triggered by pushing a version tag. The full flow:

```bash
# 1. Bump all package versions
pnpm -r exec -- npm version 0.1.0 --no-git-tag-version

# 2. Commit the version bump
git add -A
git commit -m "chore: release v0.1.0"

# 3. Tag the commit
git tag v0.1.0

# 4. Push — the tag triggers release.yml in GitHub Actions
git push && git push --tags
```

GitHub Actions will then:

- Install dependencies
- Build all publishable packages
- Run tests
- Publish to npm with provenance
- Create a GitHub release with auto-generated notes

---

## Publishable packages

| Package           | Description         |
| ----------------- | ------------------- |
| `@lexify/core`    | Core engine         |
| `@lexify/react`   | React bindings      |
| `@lexify/themes`  | Theme objects + CSS |
| `@lexify/ui`      | Toolbar components  |
| `@lexify/plugins` | All plugins         |

**Not published** (mark `"private": true` in their `package.json`):

- `@lexify/demo` — already private
- `@lexify/e2e` — dev tooling only
- `@lexify/test-utils` — excluded from publish scripts (can be published if desired)

---

## Manual publish (without CI)

```bash
# Build everything
pnpm -r --filter='!@lexify/demo' --filter='!@lexify/e2e' --filter='!@lexify/test-utils' build

# Dry run — see what would be published
pnpm -r --filter='!@lexify/demo' --filter='!@lexify/e2e' --filter='!@lexify/test-utils' \
  publish --access public --no-git-checks --dry-run

# Publish for real
pnpm -r --filter='!@lexify/demo' --filter='!@lexify/e2e' --filter='!@lexify/test-utils' \
  publish --access public --no-git-checks
```

---

## `workspace:*` dependencies

All cross-package dependencies use the `workspace:*` protocol in `package.json`.
pnpm **automatically rewrites** these to real version numbers (e.g. `^0.1.0`)
when publishing — no manual intervention needed.

---

## Versioning strategy

All packages in the monorepo are versioned together (lockstep). Bump every
package to the same version before each release:

```bash
# Bump to a specific version
pnpm -r exec -- npm version 0.2.0 --no-git-tag-version

# Or use semver increment keywords
pnpm -r exec -- npm version minor --no-git-tag-version
pnpm -r exec -- npm version patch --no-git-tag-version
```

### With Changesets (optional, for independent versioning)

If packages need independent versioning in the future:

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init

# Per-change workflow:
pnpm changeset            # describe changes, select packages, choose semver bump
pnpm changeset version    # apply bumps to package.json files
pnpm changeset publish    # build + publish changed packages
```

---

## npm provenance

The release workflow uses `id-token: write` permission and pnpm's `--provenance`
flag (implicit via the npm registry's OIDC support). This links published
packages to the specific GitHub Actions run that produced them, verifiable at
`npmjs.com/<package>`.
