# Technology Stack

**Analysis Date:** 2026-03-09

## Languages

**Primary:**
- TypeScript 5.x - Frontend app and game logic in `frontend/src/**/*.ts` and `frontend/src/**/*.tsx`

**Secondary:**
- JavaScript (Node runtime for tooling) - Build/test/lint scripts in `frontend/package.json`
- CSS (Tailwind + custom styles) - UI styles in `frontend/src/styles/index.css`

## Runtime

**Environment:**
- Node.js (version not pinned in repo) for Vite/Vitest/Playwright commands in `frontend/package.json`
- Browser runtime for gameplay loop and rendering in `frontend/src/game/engine.ts`

**Package Manager:**
- npm
- Lockfile: present (`package-lock.json`, `frontend/package-lock.json`)

## Frameworks

**Core:**
- React 18 - UI composition in `frontend/src/App.tsx` and `frontend/src/components/*.tsx`
- Vite 5 - Dev server/build pipeline in `frontend/vite.config.ts`

**Testing:**
- Vitest 2 - Unit/integration tests via `frontend/vitest.config.ts`
- Playwright 1.53 - E2E tests via `frontend/playwright.config.ts`
- Testing Library - Component assertions in `frontend/tests/integration/*.test.tsx`

**Build/Dev:**
- TypeScript compiler - static checks with `npm run typecheck` in `frontend/package.json`
- ESLint - linting via `frontend/.eslintrc.cjs`
- Prettier - formatting via `frontend/.prettierrc`
- TailwindCSS/PostCSS - utility CSS pipeline via `frontend/tailwind.config.cjs` and `frontend/postcss.config.cjs`

## Key Dependencies

**Critical:**
- `react`, `react-dom` - UI runtime and root rendering in `frontend/src/main.tsx`
- `vite` - local dev and production bundling in `frontend/package.json`
- `typescript` - strict typing (`"strict": true`) in `frontend/tsconfig.json`

**Infrastructure:**
- `vitest`, `jsdom` - test runner and browser-like environment in `frontend/vitest.config.ts`
- `@playwright/test` - browser automation for E2E in `frontend/playwright.config.ts`
- `eslint`, `@typescript-eslint/*`, `prettier` - quality gates in `frontend/package.json`

## Configuration

**Environment:**
- No `.env` files detected in workspace root during mapping.
- Runtime API base defaults to relative path `/api` in `frontend/src/services/leaderboardApi.ts`.

**Build:**
- Root script delegation in `package.json` (commands routed to `frontend/`)
- Frontend build config in `frontend/vite.config.ts`
- TS compiler options in `frontend/tsconfig.json`

## Platform Requirements

**Development:**
- Node.js + npm
- Modern browser with Canvas + IndexedDB support required by `frontend/src/game/engine.ts` and `frontend/src/lib/indexedDb.ts`

**Production:**
- Static frontend hosting for Vite output (`frontend/dist`)
- Optional backend endpoint expected at `/api/leaderboard` used by `frontend/src/services/leaderboardApi.ts`

---

*Stack analysis: 2026-03-09*
