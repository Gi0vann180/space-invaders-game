<!-- GSD:project-start source:PROJECT.md -->
## Project

**Space Invaders Futurista Mobile**

Um jogo arcade shooter inspirado em Space Invaders, com loop de campanha por fases, chefes e progressao de build durante a partida. O produto e voltado para publico casual mobile, com visual futurista (neon/cyber), sesses curtas e controles pensados para toque. O objetivo e transformar o jogo atual em um titulo pronto para distribuicao como app na Play Store e Apple Store.

**Core Value:** Entregar uma experiencia de combate espacial divertida, moderna e altamente rejogavel no mobile, com controles simples e sensacao forte de progresso a cada fase.

### Constraints

- **Platform**: Mobile-first (Android/iOS) com suporte a publicacao em lojas - define decisoes de UX, performance e empacotamento
- **Compatibility**: Manter versao web funcional durante a evolucao - preserva iteracao rapida e validacao continua
- **Performance**: Sesses suaves em dispositivos mobile intermediarios - essencial para retencao inicial
- **Monetization**: Ads + IAP no v1 - precisa ser integrado sem degradar a experiencia principal
- **Quality**: Manter gate de testes e tipagem estrita - reduz regressao em mecanicas centrais
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - Frontend app and game logic in `frontend/src/**/*.ts` and `frontend/src/**/*.tsx`
- JavaScript (Node runtime for tooling) - Build/test/lint scripts in `frontend/package.json`
- CSS (Tailwind + custom styles) - UI styles in `frontend/src/styles/index.css`
## Runtime
- Node.js (version not pinned in repo) for Vite/Vitest/Playwright commands in `frontend/package.json`
- Browser runtime for gameplay loop and rendering in `frontend/src/game/engine.ts`
- npm
- Lockfile: present (`package-lock.json`, `frontend/package-lock.json`)
## Frameworks
- React 18 - UI composition in `frontend/src/App.tsx` and `frontend/src/components/*.tsx`
- Vite 5 - Dev server/build pipeline in `frontend/vite.config.ts`
- Vitest 2 - Unit/integration tests via `frontend/vitest.config.ts`
- Playwright 1.53 - E2E tests via `frontend/playwright.config.ts`
- Testing Library - Component assertions in `frontend/tests/integration/*.test.tsx`
- TypeScript compiler - static checks with `npm run typecheck` in `frontend/package.json`
- ESLint - linting via `frontend/.eslintrc.cjs`
- Prettier - formatting via `frontend/.prettierrc`
- TailwindCSS/PostCSS - utility CSS pipeline via `frontend/tailwind.config.cjs` and `frontend/postcss.config.cjs`
## Key Dependencies
- `react`, `react-dom` - UI runtime and root rendering in `frontend/src/main.tsx`
- `vite` - local dev and production bundling in `frontend/package.json`
- `typescript` - strict typing (`"strict": true`) in `frontend/tsconfig.json`
- `vitest`, `jsdom` - test runner and browser-like environment in `frontend/vitest.config.ts`
- `@playwright/test` - browser automation for E2E in `frontend/playwright.config.ts`
- `eslint`, `@typescript-eslint/*`, `prettier` - quality gates in `frontend/package.json`
## Configuration
- No `.env` files detected in workspace root during mapping.
- Runtime API base defaults to relative path `/api` in `frontend/src/services/leaderboardApi.ts`.
- Root script delegation in `package.json` (commands routed to `frontend/`)
- Frontend build config in `frontend/vite.config.ts`
- TS compiler options in `frontend/tsconfig.json`
## Platform Requirements
- Node.js + npm
- Modern browser with Canvas + IndexedDB support required by `frontend/src/game/engine.ts` and `frontend/src/lib/indexedDb.ts`
- Static frontend hosting for Vite output (`frontend/dist`)
- Optional backend endpoint expected at `/api/leaderboard` used by `frontend/src/services/leaderboardApi.ts`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components use PascalCase file names (`frontend/src/components/HUD.tsx`, `frontend/src/components/GameOverlay.tsx`)
- Domain and service modules use camelCase role suffixes (`frontend/src/game/systems/progressionSystem.ts`, `frontend/src/services/shopService.ts`)
- Tests use story-scoped prefixes (`frontend/tests/unit/us1-boss-phase-detection.test.ts`)
- Prefer verb-first camelCase (`startGame`, `evaluateStageProgression`, `savePersistedUpgradeLevels`)
- camelCase locals and constants (`currentRunId`, `activeDrops`, `nextStageConfig`)
- PascalCase aliases/interfaces (`GameSessionState`, `ProgressionResult`, `WaveState`)
## Code Style
- Tool used: Prettier (`frontend/.prettierrc`)
- Key settings: `semi: false`, `singleQuote: true`, `trailingComma: none`
- Tool used: ESLint + `@typescript-eslint` (`frontend/.eslintrc.cjs`)
- Key rules: `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`, `react-refresh/only-export-components`
## Import Organization
- Not detected; relative imports are standard across `frontend/src/**/*.ts` and `frontend/src/**/*.tsx`
## Error Handling
- Throw explicit errors on HTTP failures in service layer (`frontend/src/services/leaderboardApi.ts`)
- Return guarded fallbacks/defaults in gameplay and persistence paths (`frontend/src/game/engine.ts`, `frontend/src/services/shopPersistenceService.ts`)
## Logging
- Gate telemetry by user consent (`frontend/src/lib/telemetry.ts`)
- Persist telemetry records to IndexedDB (`frontend/src/lib/indexedDb.ts`)
## Comments
- Sparse inline comments; code favors explicit naming and small helper functions
- Not commonly used in `frontend/src`
## Function Design
- System helpers are mostly small; orchestration functions can be large (notably `frontend/src/game/engine.ts`)
- Structured object params used when argument sets grow (`spawnRareDrop`, `createShopRunModifierOffer`)
- Pure update functions return new state snapshots (`resolvePlayerProjectileCollisions`, `evaluateStageProgression`)
## Module Design
- Named exports are standard (`export function ...`, `export type ...`)
- Not used; modules are imported directly by file path
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Canvas simulation loop separated from React components (`frontend/src/game/engine.ts` vs `frontend/src/components/*.tsx`)
- Central mutable session store with observer pattern (`frontend/src/state/gameStore.ts`)
- Domain organized by `config`, `entities`, `systems`, and `input` under `frontend/src/game/`
## Layers
- Purpose: Render HUD/overlays/settings/shop and trigger game actions
- Location: `frontend/src/App.tsx`, `frontend/src/components/`
- Contains: React components, handlers, UI state
- Depends on: Engine commands and stores from `frontend/src/game/engine.ts`, `frontend/src/state/*.ts`
- Used by: Browser entry point in `frontend/src/main.tsx`
- Purpose: Orchestrate update/render loop and cross-system coordination
- Location: `frontend/src/game/engine.ts`
- Contains: Tick pipeline, stage/shop transitions, collision and progression orchestration
- Depends on: Entities/systems/config/input/store/services
- Used by: `frontend/src/App.tsx`
- Purpose: Isolated gameplay rules (progression, wave, boss, drops, collisions)
- Location: `frontend/src/game/systems/`
- Contains: Pure-ish functions that transform wave/entities/projectiles
- Depends on: `frontend/src/game/entities/*`, `frontend/src/game/config/*`
- Used by: `frontend/src/game/engine.ts` and tests in `frontend/tests/unit`/`frontend/tests/integration`
- Purpose: Save local state and call external leaderboard API
- Location: `frontend/src/services/`, `frontend/src/lib/`
- Contains: IndexedDB wrappers, settings/highscore/shop persistence, telemetry
- Depends on: Browser APIs (`indexedDB`, `fetch`)
- Used by: `frontend/src/App.tsx` and `frontend/src/game/engine.ts`
## Data Flow
- Manual observable store class with `getState`, `setState`, `subscribe`, `reset` in `frontend/src/state/gameStore.ts`.
## Key Abstractions
- Purpose: Runtime stage state for enemies/boss/direction
- Examples: `frontend/src/game/systems/waveSystem.ts`, `frontend/src/game/engine.ts`
- Pattern: Immutable object replacement per system step
- Purpose: UI-facing aggregate game snapshot
- Examples: `frontend/src/game/types.ts`, `frontend/src/state/gameStore.ts`
- Pattern: Flat serializable state object
- Purpose: Long-term progression levels for shop effects
- Examples: `frontend/src/services/shopService.ts`, `frontend/src/services/shopPersistenceService.ts`
- Pattern: Record keyed by strict union `ShopItemId`
## Entry Points
- Location: `frontend/src/main.tsx`
- Triggers: Browser load
- Responsibilities: Mount React app
- Location: `frontend/src/App.tsx`
- Triggers: React lifecycle
- Responsibilities: Start/stop engine, bridge stores to UI, settings/persistence wiring
- Location: `frontend/src/game/engine.ts`
- Triggers: `startGame`, `startRound`, loop ticks
- Responsibilities: Full simulation and transition orchestration
## Error Handling
- Service calls throw on HTTP failure (`frontend/src/services/leaderboardApi.ts`)
- Engine/systems prefer early return on invalid runtime state (`frontend/src/game/engine.ts`, `frontend/src/game/systems/*.ts`)
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
