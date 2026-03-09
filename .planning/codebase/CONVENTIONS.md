# Coding Conventions

**Analysis Date:** 2026-03-09

## Naming Patterns

**Files:**
- React components use PascalCase file names (`frontend/src/components/HUD.tsx`, `frontend/src/components/GameOverlay.tsx`)
- Domain and service modules use camelCase role suffixes (`frontend/src/game/systems/progressionSystem.ts`, `frontend/src/services/shopService.ts`)
- Tests use story-scoped prefixes (`frontend/tests/unit/us1-boss-phase-detection.test.ts`)

**Functions:**
- Prefer verb-first camelCase (`startGame`, `evaluateStageProgression`, `savePersistedUpgradeLevels`)

**Variables:**
- camelCase locals and constants (`currentRunId`, `activeDrops`, `nextStageConfig`)

**Types:**
- PascalCase aliases/interfaces (`GameSessionState`, `ProgressionResult`, `WaveState`)

## Code Style

**Formatting:**
- Tool used: Prettier (`frontend/.prettierrc`)
- Key settings: `semi: false`, `singleQuote: true`, `trailingComma: none`

**Linting:**
- Tool used: ESLint + `@typescript-eslint` (`frontend/.eslintrc.cjs`)
- Key rules: `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`, `react-refresh/only-export-components`

## Import Organization

**Order:**
1. External libraries (`react`, `react-dom`)
2. Internal modules (relative imports from `./` and `../`)
3. Type imports mixed inline or `import type` statements

**Path Aliases:**
- Not detected; relative imports are standard across `frontend/src/**/*.ts` and `frontend/src/**/*.tsx`

## Error Handling

**Patterns:**
- Throw explicit errors on HTTP failures in service layer (`frontend/src/services/leaderboardApi.ts`)
- Return guarded fallbacks/defaults in gameplay and persistence paths (`frontend/src/game/engine.ts`, `frontend/src/services/shopPersistenceService.ts`)

## Logging

**Framework:** custom telemetry helper

**Patterns:**
- Gate telemetry by user consent (`frontend/src/lib/telemetry.ts`)
- Persist telemetry records to IndexedDB (`frontend/src/lib/indexedDb.ts`)

## Comments

**When to Comment:**
- Sparse inline comments; code favors explicit naming and small helper functions

**JSDoc/TSDoc:**
- Not commonly used in `frontend/src`

## Function Design

**Size:**
- System helpers are mostly small; orchestration functions can be large (notably `frontend/src/game/engine.ts`)

**Parameters:**
- Structured object params used when argument sets grow (`spawnRareDrop`, `createShopRunModifierOffer`)

**Return Values:**
- Pure update functions return new state snapshots (`resolvePlayerProjectileCollisions`, `evaluateStageProgression`)

## Module Design

**Exports:**
- Named exports are standard (`export function ...`, `export type ...`)

**Barrel Files:**
- Not used; modules are imported directly by file path

---

*Convention analysis: 2026-03-09*
