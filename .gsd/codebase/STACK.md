# Technology Stack

**Analysis Date:** 2026-03-09

## Languages

**Primary:**
- TypeScript - application code in `frontend/src`, test code in `frontend/tests`, and config in `frontend/vite.config.ts`, `frontend/vitest.config.ts`, `frontend/playwright.config.ts`.
- TSX - React UI entrypoints and components in `frontend/src/App.tsx`, `frontend/src/main.tsx`, and `frontend/src/components/*`.

**Secondary:**
- JavaScript/CommonJS - tool configuration in `frontend/.eslintrc.cjs`, `frontend/postcss.config.cjs`, and `frontend/tailwind.config.cjs`.
- CSS - Tailwind entry stylesheet and small custom rules in `frontend/src/styles/index.css`.
- Markdown/YAML - project docs and API contract in `frontend/README.md` and `specs/001-space-invaders-modern-ui/contracts/leaderboard-openapi.yaml`.

## Runtime

**Environment:**
- Browser runtime for the shipped game. The app mounts through `frontend/src/main.tsx` and renders a canvas-based game plus React HUD.
- Node.js is required for development/build/test, but no pinned version file was detected (`.nvmrc`, `.node-version`, `.tool-versions` not found).

**Package Manager:**
- npm workspace pattern via root `package.json` delegating to `frontend/package.json`.
- Lockfiles present: `package-lock.json` and `frontend/package-lock.json`.

## Frameworks

**Core:**
- React 18 - UI shell and component rendering in `frontend/src/App.tsx` and `frontend/src/components/*`.
- Vite 5 - dev server, production build, and preview via scripts in `frontend/package.json` and config in `frontend/vite.config.ts`.
- TypeScript 5 - strict typing enabled in `frontend/tsconfig.json`.
- Tailwind CSS 3 - utility styling configured in `frontend/tailwind.config.cjs` and consumed from `frontend/src/styles/index.css`.

**Testing:**
- Vitest 2 - unit/integration runner configured in `frontend/vitest.config.ts`.
- Testing Library - React DOM interaction tests in `frontend/tests/integration/*`.
- Playwright - browser E2E smoke and gameplay tests in `frontend/tests/e2e/*` with config in `frontend/playwright.config.ts`.
- jsdom - test environment for component/integration tests from `frontend/vitest.config.ts`.

**Build/Dev:**
- `@vitejs/plugin-react` - Vite React transform in `frontend/vite.config.ts` and `frontend/vitest.config.ts`.
- ESLint - linting configured in `frontend/.eslintrc.cjs`.
- Prettier - formatting rules in `frontend/.prettierrc`.
- PostCSS + Autoprefixer - CSS pipeline in `frontend/postcss.config.cjs`.

## Key Dependencies

**Critical:**
- `react` / `react-dom` - frontend runtime.
- `typescript` - compile-time safety for gameplay, persistence, and services.
- `vite` - local development server and production bundling.
- `tailwindcss` - utility-first styling used throughout `frontend/src/App.tsx` and component markup.

**Quality/Tooling:**
- `vitest`, `@playwright/test`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
- `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`.
- `postcss`, `autoprefixer`, `prettier`, `jsdom`.

## Configuration

**Application:**
- Root scripts proxy all common commands to the frontend package in `package.json`.
- Vite dev server runs on port `5173` from `frontend/vite.config.ts`.
- Playwright preview server expects `127.0.0.1:4173` after `npm run build && npm run preview` from `frontend/playwright.config.ts`.
- TypeScript is configured with `strict: true`, `jsx: react-jsx`, `target: ES2020`, and `moduleResolution: Node` in `frontend/tsconfig.json`.

**Formatting/Linting:**
- Prettier enforces no semicolons, single quotes, and no trailing commas in `frontend/.prettierrc`.
- ESLint extends `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`, and `prettier` in `frontend/.eslintrc.cjs`.

**Environment variables:**
- No `.env` files were detected in the workspace.
- No runtime env var consumption was detected in current application code.
- API base for leaderboard defaults to the relative path `/api` inside `frontend/src/services/leaderboardApi.ts` instead of an env-driven endpoint.

## Build, Test, and Validation Commands

**Root commands:**
- `npm run dev` -> delegates to `frontend` dev server.
- `npm run build` -> delegates to Vite production build.
- `npm run lint` -> delegates to frontend ESLint.
- `npm run typecheck` -> delegates to `tsc --noEmit`.
- `npm run test` -> delegates to Vitest.
- `npm run test:e2e` -> delegates to Playwright.
- `npm run validate` -> typecheck + lint + unit/integration tests.

## Platform Requirements

**Development:**
- Node.js + npm.
- Modern browser with Canvas, IndexedDB, Fetch API, and optional Web Audio / Vibration API support.

**Production:**
- Static frontend hosting is sufficient for the shipped code under `frontend/`.
- An optional backend endpoint at `/api/leaderboard` is expected by `frontend/src/services/leaderboardApi.ts`, but no server implementation was detected in this repository.

---

*Stack analysis: 2026-03-09*
