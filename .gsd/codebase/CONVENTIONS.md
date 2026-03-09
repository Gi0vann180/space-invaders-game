# Coding Conventions

**Analysis Date:** 2026-03-09

## Naming Patterns

**Files:**
- React components use PascalCase file names in `frontend/src/components/` such as `HUD.tsx`, `GameOverlay.tsx`, and `SettingsPanel.tsx`.
- Hooks use `useX` naming in `frontend/src/hooks/` such as `useVisibilityPause.ts`.
- Services use camelCase plus `Service` suffix in `frontend/src/services/` such as `shopService.ts`, `settingsService.ts`, `shopPersistenceService.ts`, and `highscoreService.ts`.
- Game logic modules are grouped by concern under `frontend/src/game/systems/`, `frontend/src/game/entities/`, `frontend/src/game/config/`, and `frontend/src/game/input/` with camelCase file names like `progressionSystem.ts` and `bossAttackSystem.ts`.

**Functions:**
- Use camelCase for functions and favor verb-led names: `startGame`, `pauseGame`, `loadSettings`, `savePersistedUpgradeLevels`, `evaluateStageProgression`, `createShopRunModifierOffer`.
- Constructors/factories use `createX` naming, especially in the game layer: `createPlayer`, `createEnemyGrid`, `createGameLoop`, `createInputManager`.
- Predicate and capability helpers use `isX`, `canX`, `getX`, or `listX`: `isBossStage`, `canPurchaseExtraLife`, `getUpgradeLevel`, `listActiveUpgrades`.

**Variables:**
- Local variables and state slices use camelCase: `gameState`, `upgradeLevels`, `pendingStage`, `bossCollisionResult`.
- Constants use UPPER_SNAKE_CASE when exported configuration is intended to be reused, for example `EMPTY_UPGRADE_LEVELS`, `MAX_UPGRADE_LEVEL`, `EXTRA_LIFE_COST_POINTS`, and `STORE_ID`.

**Types:**
- Type aliases use PascalCase and often end with a domain suffix such as `GameSessionState`, `SettingsPanelProps`, `PermanentUpgradePurchaseResult`, `ProgressionResult`, and `TelemetryEvent`.
- Discriminated unions are used for result objects instead of exceptions in domain services, as seen in `frontend/src/services/shopService.ts`.

## Code Style

**Formatting:**
- Tool used: Prettier via `frontend/.prettierrc`.
- Repo formatting rules are explicit: `semi: false`, `singleQuote: true`, `trailingComma: none`.
- Existing source consistently follows those rules across `frontend/src/` and `frontend/tests/`.

**Linting:**
- Tool used: ESLint with `@typescript-eslint`, `react-hooks`, and `react-refresh` via `frontend/.eslintrc.cjs`.
- Extend `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`, and `prettier`.
- Hot-reload boundary rule is present: `react-refresh/only-export-components` warns on non-component exports from React component modules.

## Import Organization

**Order:**
1. Framework imports first, for example React hooks in `frontend/src/App.tsx`.
2. Local components, hooks, services, stores, and game modules after that.
3. `import type` declarations are used where possible to keep type-only dependencies explicit, for example in `frontend/src/components/SettingsPanel.tsx` and `frontend/src/game/systems/progressionSystem.ts`.

**Path Aliases:**
- Not detected. Imports are relative throughout `frontend/src/` and `frontend/tests/`.

## Error Handling

**Patterns:**
- Domain logic usually avoids throwing and returns structured result objects for expected outcomes, as in purchase flows in `frontend/src/services/shopService.ts`.
- UI components commonly use early returns for non-render states, as in `frontend/src/components/SettingsPanel.tsx` and `frontend/src/components/GameOverlay.tsx`.
- Persistence reads return nullable results and callers apply fallback defaults, for example `loadSettings()` in `frontend/src/services/settingsService.ts` and `getPersistedProgressProfile()` in `frontend/src/services/shopPersistenceService.ts`.
- External boundary code throws explicit errors when remote calls fail, as in `frontend/src/services/leaderboardApi.ts`.
- Asynchronous side effects in `frontend/src/App.tsx` and `frontend/src/game/engine.ts` are generally invoked with `void` and handled optimistically rather than wrapped in local `try/catch` blocks.

## State

**Approach:**
- Application state is managed with lightweight custom class-based stores in `frontend/src/state/gameStore.ts` and `frontend/src/state/settingsStore.ts`.
- Stores expose `getState`, `setState`, and `subscribe`, and use `Set` to manage listeners.
- React components mirror store state into local hook state using subscriptions, as shown in `frontend/src/App.tsx`.
- Game runtime state that should not trigger React rendering stays in module-level variables inside `frontend/src/game/engine.ts`, such as `player`, `wave`, `projectiles`, `activeDrops`, and `loopController`.

## Services

**Patterns:**
- Services are thin modules that wrap persistence or domain calculations and keep APIs small and explicit.
- IndexedDB access is centralized in `frontend/src/lib/indexedDb.ts`; higher-level services such as `frontend/src/services/settingsService.ts` and `frontend/src/services/shopPersistenceService.ts` compose on top of it.
- Telemetry is gated by explicit consent in `frontend/src/lib/telemetry.ts` and returns `boolean` to indicate whether an event was persisted.
- Game systems stay mostly pure and operate on plain objects, while orchestration and side effects live in `frontend/src/game/engine.ts`.

## Logging

**Framework:**
- No general logging framework is detected in `frontend/src/`.
- Telemetry events are persisted through `frontend/src/lib/telemetry.ts`; there is no evidence of `console`-driven diagnostics as a convention.

## Comments

**When to Comment:**
- Inline comments are rare. Code is written with descriptive identifiers and small helper functions instead of explanatory comments.
- Preserve this style: add comments only when a block would otherwise be ambiguous.

**JSDoc/TSDoc:**
- Not used as a common convention in `frontend/src/`.

## Function Design

**Size:**
- Most modules favor small pure helpers, but orchestration functions can be large when they centralize runtime flow, especially `update()` in `frontend/src/game/engine.ts`.
- When adding logic to the game domain, prefer extracting pure helpers into `frontend/src/game/systems/` or `frontend/src/services/` instead of further growing `engine.ts`.

**Parameters:**
- Multiple primitives are common for simple pure functions, for example `evaluateStageProgression(currentStage, enemiesRemaining, bossActive, bossDefeated)`.
- Object parameters are used when a function takes a cohesive payload, such as `createShopRunModifierOffer({ runId, runSeed, stageNumber, upgradeLevels })`.

**Return Values:**
- Prefer explicit object returns over tuples except where tuple semantics are intentional, such as `[nextPlayer, shouldShoot]` from `tryConsumeShot()`.
- Preserve immutable return shapes in domain logic; spreading into new objects is the dominant update style in stores and services.

## Module Design

**Exports:**
- Utility and domain modules primarily use named exports.
- UI root modules may default-export the main component, as in `frontend/src/App.tsx`.
- Store instances are exported as singletons, for example `gameStore` and `settingsStore`.

**Barrel Files:**
- Not detected. Import directly from concrete module paths.

---

*Convention analysis: 2026-03-09*
