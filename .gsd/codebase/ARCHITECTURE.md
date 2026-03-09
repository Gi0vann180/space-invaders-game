# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Single-page React frontend with an imperative Canvas game engine and lightweight in-memory stores.

**Key Characteristics:**
- React in `frontend/src/main.tsx` and `frontend/src/App.tsx` owns the application shell, layout, modal panels, HUD, and shop flow.
- The gameplay simulation lives in `frontend/src/game/engine.ts` and runs outside React through a fixed-timestep loop from `frontend/src/game/loop.ts`.
- Shared runtime state crosses the React and engine boundary through custom observable stores in `frontend/src/state/gameStore.ts` and `frontend/src/state/settingsStore.ts`.
- Persistence and side effects are isolated in `frontend/src/services/*` and `frontend/src/lib/*`, primarily over IndexedDB in `frontend/src/lib/indexedDb.ts`.

## Layers

**Application Shell:**
- Purpose: bootstrap React and mount the game screen.
- Location: `frontend/src/main.tsx`, `frontend/src/App.tsx`.
- Contains: root render, canvas host, overlay wiring, settings panel, shop screen, subscription lifecycle.
- Depends on: React, engine control functions, stores, services, hooks, presentational components.
- Used by: the browser entry point created by Vite.

**UI Components:**
- Purpose: render game-adjacent UI from state snapshots.
- Location: `frontend/src/components/`.
- Contains: `HUD.tsx`, `GameOverlay.tsx`, `SettingsPanel.tsx`, `ShopScreen.tsx`.
- Depends on: props passed from `frontend/src/App.tsx`; components do not drive the simulation loop directly.
- Used by: `frontend/src/App.tsx`.

**State Bridge:**
- Purpose: expose mutable session state and settings to both the engine and React.
- Location: `frontend/src/state/gameStore.ts`, `frontend/src/state/settingsStore.ts`.
- Contains: simple store classes with `getState`, `setState`, `subscribe`, and `reset` for gameplay.
- Depends on: shared types from `frontend/src/game/types.ts` and upgrade defaults from `frontend/src/services/shopService.ts`.
- Used by: `frontend/src/App.tsx`, `frontend/src/game/engine.ts`, and supporting services.

**Game Engine:**
- Purpose: own simulation state, update entities, resolve collisions, render to Canvas, and control phase transitions.
- Location: `frontend/src/game/engine.ts`, `frontend/src/game/loop.ts`.
- Contains: module-level world state for player, wave, projectiles, drops, pending stage, and run metadata.
- Depends on: entity factories, systems, input manager, config modules, persistence services, telemetry, and `gameStore`.
- Used by: `frontend/src/App.tsx` through `startGame`, `startRound`, `pauseGame`, `resumeGame`, `restartRound`, `continueToNextStage`, and `stopGame`.

**Domain Modules:**
- Purpose: keep gameplay rules split by concern instead of concentrated inside React.
- Location: `frontend/src/game/entities/`, `frontend/src/game/systems/`, `frontend/src/game/config/`, `frontend/src/game/input/`, `frontend/src/game/perf/`.
- Contains: entity creation and movement, collisions, boss logic, projectile logic, power-ups, upgrades, progression rules, input adapters, and performance caps.
- Depends on: shared game types and local config.
- Used by: `frontend/src/game/engine.ts` and tests under `frontend/tests/`.

**Persistence and Side Effects:**
- Purpose: isolate browser storage and optional telemetry from gameplay orchestration.
- Location: `frontend/src/services/`, `frontend/src/lib/`.
- Contains: settings persistence, upgrade/profile persistence, high score persistence, telemetry logging, IndexedDB helpers.
- Depends on: browser APIs and shared types.
- Used by: `frontend/src/App.tsx` and `frontend/src/game/engine.ts`.

## Data Flow

**Bootstrap and Mount:**
1. `frontend/src/main.tsx` creates the React root and renders `frontend/src/App.tsx`.
2. `frontend/src/App.tsx` allocates the `<canvas>` ref and calls `startGame(canvas)` inside `useEffect`.
3. `frontend/src/game/engine.ts` gets the 2D context, resets runtime entities, connects input, starts the loop, and pushes an initial snapshot into `gameStore`.

**Runtime Simulation to UI:**
1. The loop in `frontend/src/game/loop.ts` calls `update` on a fixed timestep and `render` on every animation frame.
2. `frontend/src/game/engine.ts` reads input, advances entities and systems, computes progression, and writes derived state into `gameStore`.
3. `frontend/src/App.tsx` subscribes to `gameStore` and `settingsStore`, then re-renders `HUD`, `GameOverlay`, `ShopScreen`, and `SettingsPanel` from those snapshots.

**UI Actions Back to Engine:**
1. Overlay and shop actions in `frontend/src/App.tsx` call engine commands such as `startRound`, `resumeGame`, `restartRound`, and `continueToNextStage`.
2. Shop selection mutates upgrade-related state in `gameStore` before the next stage resumes.
3. Engine commands resume or pause the loop and continue writing authoritative session state back to the store.

**Persistence Flow:**
1. `frontend/src/App.tsx` loads saved settings and progression through `frontend/src/services/settingsService.ts` and `frontend/src/services/shopPersistenceService.ts`.
2. Storage services use `frontend/src/lib/indexedDb.ts` to read or write the `highscores`, `upgrades`, `settings`, and `telemetry` object stores.
3. `frontend/src/game/engine.ts` persists high scores, progression counters, and telemetry events at transition points instead of on every frame.

## Frontend React and Game Engine Relationship

**Boundary:**
- React is not the source of truth for simulation objects such as player, wave, projectiles, and drops; those live as module-level variables in `frontend/src/game/engine.ts`.
- React is the source of truth for the DOM shell and reads a serialized gameplay snapshot from `gameStore`.

**Integration Pattern:**
- `frontend/src/App.tsx` hosts the canvas and imperatively starts the engine once the DOM node exists.
- `frontend/src/game/engine.ts` renders directly to Canvas 2D and only exposes coarse control functions to React.
- `frontend/src/state/gameStore.ts` is the seam between imperative gameplay code and declarative React rendering.

**Implication for changes:**
- Add UI-only concerns in `frontend/src/components/` and `frontend/src/App.tsx`.
- Add simulation rules in `frontend/src/game/systems/`, `frontend/src/game/entities/`, or `frontend/src/game/config/`.
- Extend the React-engine contract by changing `frontend/src/game/types.ts` and `frontend/src/state/gameStore.ts` before updating UI consumers.

## Key Abstractions

**GameSessionState:**
- Purpose: transport the UI-safe snapshot of the current run.
- Examples: `frontend/src/game/types.ts`, `frontend/src/state/gameStore.ts`.
- Pattern: serializable snapshot consumed by React and tests.

**GameLoopController:**
- Purpose: start, stop, pause, and resume the browser animation loop.
- Examples: `frontend/src/game/loop.ts`.
- Pattern: fixed-timestep controller around `requestAnimationFrame`.

**InputManager:**
- Purpose: merge keyboard, touch, and gamepad signals into one input snapshot.
- Examples: `frontend/src/game/input/inputManager.ts`.
- Pattern: adapter composition with a single `readInput()` boundary.

## Entry Points

**Workspace scripts:**
- Location: `package.json`.
- Triggers: root `npm run dev`, `npm run build`, `npm run test`, and related commands.
- Responsibilities: delegate all developer workflows to the `frontend` package.

**Frontend runtime entry:**
- Location: `frontend/src/main.tsx`.
- Triggers: Vite browser startup.
- Responsibilities: mount the React tree.

**Application composition root:**
- Location: `frontend/src/App.tsx`.
- Triggers: initial render.
- Responsibilities: start/stop engine, subscribe to stores, load persisted data, and wire UI actions.

## Error Handling

**Strategy:** minimal defensive branching with early returns and safe defaults.

**Patterns:**
- Engine functions in `frontend/src/game/engine.ts` check for missing canvas context or invalid status before mutating runtime state.
- Persistence functions such as `frontend/src/services/shopPersistenceService.ts` and `frontend/src/services/settingsService.ts` return default snapshots when records are absent instead of throwing custom domain errors.
- The codebase does not define a centralized error boundary or cross-cutting exception layer.

## Cross-Cutting Concerns

**Logging:** telemetry is optional and gated by consent in `frontend/src/lib/telemetry.ts`.
**Validation:** most invariants are enforced through TypeScript types and small guard functions rather than schema validators.
**Authentication:** not present in the runtime architecture.

---

*Architecture analysis: 2026-03-09*
