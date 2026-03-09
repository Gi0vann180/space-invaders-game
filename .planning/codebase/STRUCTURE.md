# Codebase Structure

**Analysis Date:** 2026-03-09

## Directory Layout

```text
game/
├── frontend/                # React + TypeScript game client
├── specs/                   # Feature specs, plans, contracts, tasks
├── .specify/                # Local tooling templates/scripts
├── package.json             # Root command delegator to frontend scripts
└── .github/                 # Repository metadata (no workflows detected)
```

## Directory Purposes

**frontend/src/game:**
- Purpose: Core gameplay runtime
- Contains: `config/`, `entities/`, `systems/`, `input/`, `engine.ts`, `types.ts`
- Key files: `frontend/src/game/engine.ts`, `frontend/src/game/systems/progressionSystem.ts`, `frontend/src/game/config/stages.ts`

**frontend/src/components:**
- Purpose: Game UI composition
- Contains: HUD, overlay, settings, shop components
- Key files: `frontend/src/components/HUD.tsx`, `frontend/src/components/GameOverlay.tsx`, `frontend/src/components/ShopScreen.tsx`

**frontend/src/state:**
- Purpose: App-level observable stores
- Contains: game and settings stores
- Key files: `frontend/src/state/gameStore.ts`, `frontend/src/state/settingsStore.ts`

**frontend/src/services and frontend/src/lib:**
- Purpose: Persistence, API access, telemetry, utility wrappers
- Contains: IndexedDB abstractions, leaderboard service, shop/settings persistence
- Key files: `frontend/src/lib/indexedDb.ts`, `frontend/src/services/leaderboardApi.ts`, `frontend/src/services/shopPersistenceService.ts`

**frontend/tests:**
- Purpose: Automated validation by layer
- Contains: `unit/`, `integration/`, `e2e/`, plus `fixtures/` and `helpers/`
- Key files: `frontend/tests/unit/us1-boss-phase-detection.test.ts`, `frontend/tests/integration/us3-drop-lifecycle.test.tsx`, `frontend/tests/e2e/us2-boss-defeat-transition.spec.ts`

**specs:**
- Purpose: Feature-level planning and acceptance documentation
- Contains: numbered feature folders with `spec.md`, `plan.md`, `tasks.md`, `contracts/`
- Key files: `specs/001-boss-phase-drops/tasks.md`, `specs/001-boss-phase-drops/contracts/boss-cycle-drops-openapi.yaml`

## Key File Locations

**Entry Points:**
- `frontend/src/main.tsx`: Browser bootstrap and React mount
- `frontend/src/App.tsx`: Root UI and engine integration

**Configuration:**
- `frontend/package.json`: scripts/dependencies
- `frontend/vite.config.ts`: build/dev server config
- `frontend/vitest.config.ts`: unit/integration test config
- `frontend/playwright.config.ts`: E2E config
- `frontend/.eslintrc.cjs`: lint rules
- `frontend/.prettierrc`: formatter rules

**Core Logic:**
- `frontend/src/game/engine.ts`: runtime orchestration
- `frontend/src/game/systems/*.ts`: gameplay rules
- `frontend/src/game/entities/*.ts`: entity construction/update helpers

**Testing:**
- `frontend/tests/unit/*.test.ts`: domain rules
- `frontend/tests/integration/*.test.tsx`: multi-module flows
- `frontend/tests/e2e/*.spec.ts`: browser smoke and scenario checks

## Naming Conventions

**Files:**
- Feature-scoped test names: `usX-*.test.ts` / `usX-*.spec.ts` in `frontend/tests/*`
- Domain files by role: `*System.ts`, `*Service.ts`, `*Store.ts`, `*config.ts`

**Directories:**
- Layered domain folders under `frontend/src/game/` (`config`, `entities`, `systems`, `input`)
- Test taxonomy folders under `frontend/tests/` (`unit`, `integration`, `e2e`)

## Where to Add New Code

**New Feature:**
- Primary code: `frontend/src/game/systems/` for rules, `frontend/src/components/` for UI, `frontend/src/services/` for persistence/integration
- Tests: `frontend/tests/unit/` and `frontend/tests/integration/`; add scenario checks to `frontend/tests/e2e/` when user-visible

**New Component/Module:**
- Implementation: `frontend/src/components/` if UI-facing, `frontend/src/game/entities/` if runtime model object

**Utilities:**
- Shared helpers: `frontend/src/lib/` for cross-cutting browser/data helpers

## Special Directories

**frontend/dist:**
- Purpose: Vite production build output
- Generated: Yes
- Committed: No (build artifact)

**frontend/test-results:**
- Purpose: Playwright/Vitest result artifacts
- Generated: Yes
- Committed: No

**.planning/codebase:**
- Purpose: Codebase mapping documents for GSD orchestration
- Generated: Yes
- Committed: Typically yes, if team keeps planning artifacts in git

---

*Structure analysis: 2026-03-09*
