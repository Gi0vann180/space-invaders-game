# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Stateful game-loop architecture with functional domain systems and React UI shell

**Key Characteristics:**
- Canvas simulation loop separated from React components (`frontend/src/game/engine.ts` vs `frontend/src/components/*.tsx`)
- Central mutable session store with observer pattern (`frontend/src/state/gameStore.ts`)
- Domain organized by `config`, `entities`, `systems`, and `input` under `frontend/src/game/`

## Layers

**UI Layer:**
- Purpose: Render HUD/overlays/settings/shop and trigger game actions
- Location: `frontend/src/App.tsx`, `frontend/src/components/`
- Contains: React components, handlers, UI state
- Depends on: Engine commands and stores from `frontend/src/game/engine.ts`, `frontend/src/state/*.ts`
- Used by: Browser entry point in `frontend/src/main.tsx`

**Game Engine Layer:**
- Purpose: Orchestrate update/render loop and cross-system coordination
- Location: `frontend/src/game/engine.ts`
- Contains: Tick pipeline, stage/shop transitions, collision and progression orchestration
- Depends on: Entities/systems/config/input/store/services
- Used by: `frontend/src/App.tsx`

**Domain Systems Layer:**
- Purpose: Isolated gameplay rules (progression, wave, boss, drops, collisions)
- Location: `frontend/src/game/systems/`
- Contains: Pure-ish functions that transform wave/entities/projectiles
- Depends on: `frontend/src/game/entities/*`, `frontend/src/game/config/*`
- Used by: `frontend/src/game/engine.ts` and tests in `frontend/tests/unit`/`frontend/tests/integration`

**Persistence/Services Layer:**
- Purpose: Save local state and call external leaderboard API
- Location: `frontend/src/services/`, `frontend/src/lib/`
- Contains: IndexedDB wrappers, settings/highscore/shop persistence, telemetry
- Depends on: Browser APIs (`indexedDB`, `fetch`)
- Used by: `frontend/src/App.tsx` and `frontend/src/game/engine.ts`

## Data Flow

**Gameplay Tick Flow:**

1. Input snapshot read from `frontend/src/game/input/inputManager.ts` in `frontend/src/game/engine.ts`
2. Systems update entities (`waveSystem`, `bossSystem`, `collisionSystem`, `dropSystem`) in `frontend/src/game/systems/*`
3. Progression evaluation decides boss/shop transitions via `evaluateStageProgression` in `frontend/src/game/systems/progressionSystem.ts`
4. `gameStore.setState` publishes snapshot consumed by UI (`frontend/src/state/gameStore.ts`)

**State Management:**
- Manual observable store class with `getState`, `setState`, `subscribe`, `reset` in `frontend/src/state/gameStore.ts`.

## Key Abstractions

**WaveState:**
- Purpose: Runtime stage state for enemies/boss/direction
- Examples: `frontend/src/game/systems/waveSystem.ts`, `frontend/src/game/engine.ts`
- Pattern: Immutable object replacement per system step

**GameSessionState:**
- Purpose: UI-facing aggregate game snapshot
- Examples: `frontend/src/game/types.ts`, `frontend/src/state/gameStore.ts`
- Pattern: Flat serializable state object

**UpgradeLevels:**
- Purpose: Long-term progression levels for shop effects
- Examples: `frontend/src/services/shopService.ts`, `frontend/src/services/shopPersistenceService.ts`
- Pattern: Record keyed by strict union `ShopItemId`

## Entry Points

**Web Entry:**
- Location: `frontend/src/main.tsx`
- Triggers: Browser load
- Responsibilities: Mount React app

**App Root:**
- Location: `frontend/src/App.tsx`
- Triggers: React lifecycle
- Responsibilities: Start/stop engine, bridge stores to UI, settings/persistence wiring

**Game Runtime:**
- Location: `frontend/src/game/engine.ts`
- Triggers: `startGame`, `startRound`, loop ticks
- Responsibilities: Full simulation and transition orchestration

## Error Handling

**Strategy:** Fail-fast through thrown errors in service boundaries and guarded returns in gameplay functions

**Patterns:**
- Service calls throw on HTTP failure (`frontend/src/services/leaderboardApi.ts`)
- Engine/systems prefer early return on invalid runtime state (`frontend/src/game/engine.ts`, `frontend/src/game/systems/*.ts`)

## Cross-Cutting Concerns

**Logging:** Local telemetry event persistence in `frontend/src/lib/telemetry.ts`
**Validation:** TypeScript strict mode and constrained union types in `frontend/tsconfig.json` and `frontend/src/game/types.ts`
**Authentication:** Not implemented

---

*Architecture analysis: 2026-03-09*
