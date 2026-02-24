# DialKit

## Architecture

DialKit is framework-agnostic with three entry points:

- **`dialkit/core`** — Pure JS store, types, value resolution, spring math, utilities. Zero framework dependencies.
- **`dialkit/react`** — React components + hooks. Imports from core.
- **`dialkit/vanilla`** — Vanilla JS adapter (`createDialKit`). Works with Svelte, Vue, or plain JS.
- **`dialkit`** (root) — Backwards-compatible re-export of `dialkit/react`.

Source layout:
- `src/core/` — Framework-agnostic: DialStore, types, utils, resolveValues, springMath
- `src/react/` — React adapter: components, useDialKit hook
- `src/vanilla/` — Vanilla JS adapter: createDialKit
- `src/styles/` — CSS theme (shared across all adapters)

## Build

- After editing styles in `src/styles/theme.css`, run `npm run build` — the CSS is copied to `dist/styles.css` via tsup's `onSuccess` hook, not hot-reloaded.
- The example app (`example/photostack`) imports `dialkit/styles.css` which resolves to `dist/styles.css`.
- Build produces four entry points: `dist/index.*`, `dist/core/index.*`, `dist/react/index.*`, `dist/vanilla/index.*`.

## Style Rules

- Buttons in `ButtonGroup` must always stack vertically (never inline/row).
