# Phase 01 - Research

## Objective

Implement Phase 01 (Campaign Meta-Layer) with persistent campaign progression, safe resume behavior, and offline-first operation while preserving existing engine/store architecture.

## Inputs Reviewed

- `.planning/phases/01-campaign-meta-layer/01-CONTEXT.md`
- `.planning/phases/01-campaign-meta-layer/01-UI-SPEC.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/codebase/ARCHITECTURE.md`
- `frontend/src/game/engine.ts`
- `frontend/src/game/types.ts`
- `frontend/src/state/gameStore.ts`
- `frontend/src/services/shopPersistenceService.ts`
- `frontend/src/App.tsx`

## Key Findings

1. Existing architecture already supports most required primitives:
- `progressionProfile.highestUnlockedStage` and `totalRuns` already exist in store/types.
- persistence service already stores player progress in IndexedDB.
- engine already drives stage transitions and pause/resume states.

2. Missing pieces for Phase 01 are primarily orchestration + UI:
- campaign map UI model (locked/unlocked/completed) is not implemented.
- explicit resume prompt (Continue/Restart) for interrupted run is not implemented.
- checkpoint-oriented autosave policy exists partially but is not codified as phase contract.

3. Lowest-risk implementation strategy:
- extend current persistence schema with additive fields (backward compatible).
- keep progression truth in game store + persistence service, not in UI components.
- use engine lifecycle hooks for checkpoint writes (phase start, completion, pause/background).

## Recommended Technical Approach

### Data Model

Use a small additive snapshot for campaign state:
- `highestUnlockedStage: number`
- `lastAttemptedStage: number | null`
- `lastCompletedStage: number | null`
- `interruptedRun: { stage: number; atStatus: 'running' | 'paused'; savedAt: string } | null`
- `totalRuns: number`

Migration rule:
- if old record only has `highestUnlockedStage` and `totalRuns`, hydrate new fields with null-safe defaults.

### Persistence Strategy

Write on events, not timer:
- phase start
- phase completion (boss defeated)
- pause/background

Fallback behavior:
- invalid/corrupted interrupted snapshot -> clear interrupted payload and return to start of current stage.

### UI Strategy

Implement a dedicated campaign map component driven by store snapshot:
- node states: locked, unlocked, completed
- locked nodes visible with lock hint
- replay of completed stages allowed

Implement resume gate modal on app reopen when interrupted run exists:
- actions: Continue / Restart
- no expiration for v1 while snapshot remains valid.

## Risks and Mitigations

1. Risk: state drift between engine and persistence.
- Mitigation: centralize writes in service helpers called from engine transition points.

2. Risk: migration breaks existing players.
- Mitigation: additive schema + robust default fallback + tests with legacy fixture.

3. Risk: UX confusion around resume/restart.
- Mitigation: always show explicit modal when interrupted run exists; deterministic fallback copy.

## Verification Focus

- campaign unlock flow after boss defeat
- replay completed stages without regression
- reopen app with interrupted run -> prompt + branch behavior
- offline boot and progression continuity
- legacy profile migration

## Validation Architecture

Validation will be event-driven with fast feedback:
- unit tests for migration and persistence decisions
- integration tests for app/store/engine resume flows
- targeted e2e for campaign map unlock + restart/continue UX

Sampling:
- after each task commit run fast command (`npm run test -- --runInBand` equivalent via project scripts)
- after wave completion run full phase-related test subset

Nyquist expectations:
- each plan task includes automated verify command or explicit Wave 0 dependency
- no manual-only acceptance for core phase requirements (CAMP-01, CAMP-05, CORE-02, CORE-03)

## Output

Research complete. Phase is ready for planning with low technical uncertainty.