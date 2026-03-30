---
id: S01
parent: M001
milestone: M001
provides:
  - Campaign persistence foundation with migration-safe local profile schema and checkpoint-driven resume contracts.
  - Player-visible campaign map and explicit completion/interrupted-run UX that downstream boss slices can extend.
  - A verified baseline for campaign-state rendering and local interruption recovery in the frontend test suite.
requires:
  []
affects:
  - S02
key_files:
  - frontend/src/App.tsx
  - frontend/src/components/CampaignMap.tsx
  - frontend/src/components/GameOverlay.tsx
  - frontend/src/components/HUD.tsx
  - frontend/src/game/engine.ts
  - frontend/src/game/types.ts
  - frontend/src/state/gameStore.ts
  - frontend/src/services/shopPersistenceService.ts
  - frontend/tests/integration/us1-boss-stage-flow.test.tsx
  - frontend/tests/integration/us2-boss-outcome-feedback.test.tsx
  - frontend/tests/integration/us2-progression-shop.test.tsx
  - .gsd/PROJECT.md
key_decisions:
  - Campaign progression persistence stays local-first and migration-safe, with additive defaults for legacy saved profiles.
  - Interrupted runs are restored through an explicit continue/restart prompt instead of silently resuming or hard-resetting a run.
  - Campaign stages 1..5 are treated as boss stages in the progression contract, and downstream tests must assert against that rule rather than the older every-10th-stage-only behavior.
patterns_established:
  - Treat the engine as the single point of truth for progression checkpoint writes on run start, pause, and phase completion.
  - Hydrate React app-shell campaign UI from persisted profile state first, then surface recovery decisions explicitly through overlays.
  - When campaign contracts change, keep broad validation green by updating adjacent legacy tests to the new source-of-truth rules instead of preserving outdated expectations.
observability_surfaces:
  - Persisted `progressionProfile.interruptedRun` snapshot in local storage as the primary diagnostic surface for interruption/resume behavior.
  - Deterministic integration coverage in `frontend/tests/integration/us1-boss-stage-flow.test.tsx` for migration, checkpoint, and campaign UI contracts.
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-30T18:45:57.336Z
blocker_discovered: false
---

# S01: Campaign Meta Layer

**Migration-safe campaign persistence, interrupted-run recovery, and visible phase progression UI now ship together as the Phase 01 campaign meta-layer.**

## What Happened

S01 delivered the first real campaign meta-layer on top of the existing arcade loop. The slice started by extending the progress profile contract so campaign state survives schema evolution: highest unlocked stage remained intact while new fields for last attempted stage, last completed stage, and interrupted runs were added with additive defaults, clamping, and invalid-payload fallback behavior. The engine then became the point of truth for checkpoint writes: starting a run records the attempted stage, pausing/backgrounding stores an interrupted snapshot with timestamp, and boss-completion shop transitions clear interruption state while unlocking the next stage and recording completion.

On top of those persistence contracts, the slice exposed a player-facing campaign layer in the app shell. `CampaignMap` renders stages 1..5 with explicit locked, unlocked, and completed states plus lock guidance copy. App bootstrap now loads the persisted profile, hydrates the store, and surfaces interrupted runs through an explicit prompt instead of implicit resume. `GameOverlay` gained campaign completion and interrupted-run affordances, and `HUD` now shows current progression context so the player can understand where they are in the campaign.

Slice verification also uncovered adjacent stale integration expectations from older boss/shop contracts. Those tests were updated to assert against the current campaign completion copy and the current progression rule that campaign stages 1..5 are boss stages. That cleanup mattered because downstream slices need a green repo-level baseline, not just a narrow slice test pass.

## Verification

Verified the slice at both the narrow and repo-wide levels.

- `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` passed: 7/7 tests green, covering legacy profile migration defaults, checkpoint persistence sequence, invalid interrupted payload fallback, campaign map states, completion/interrupted-run copy, and replay progression retention.
- `npm --prefix frontend run validate` passed after aligning adjacent stale tests to the current campaign contracts: typecheck, lint, and the full Vitest suite all passed (42 files, 72 tests).
- Code inspection confirmed the expected runtime surfaces exist in the source of truth: engine checkpoint writes on start/pause/completion, app-shell hydration from persisted progress, campaign map rendering, and HUD/overlay progression context.

## Requirements Advanced

- CTRL-03 — Added explicit continue/restart flows, completion CTA, and checkpoint-backed interrupted-run recovery that reduce friction after defeat or interruption.
- ANDR-01 — Added deterministic local interruption persistence and resume-safe profile hydration with invalid snapshot fallback.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Slice verification exposed adjacent stale tests under `frontend/tests/integration/us2-boss-outcome-feedback.test.tsx` and `frontend/tests/integration/us2-progression-shop.test.tsx`. They were updated to match the current campaign/boss-stage contracts so repo-level validation reflects shipped behavior. No plan scope changed.

## Known Limitations

Persistence and interrupted-run recovery are proven at the local/web test layer only; no Android device lifecycle proof exists yet. The campaign map is fixed to stages 1..5 and does not yet expose richer stage metadata, boss identity, or rewards. Completion and interruption UX is covered by integration tests, not browser-level or human-play verification.

## Follow-ups

S02 should build boss encounter feedback and telemetry on top of the new campaign completion/interruption flow instead of reintroducing separate outcome contracts. Mobile lifecycle verification on a real Android pause/resume path remains necessary before claiming ANDR-01 validated.

## Files Created/Modified

- `frontend/src/App.tsx` — Integrated campaign map, persisted profile bootstrap, interrupted-run prompt handling, and completion flow wiring.
- `frontend/src/components/CampaignMap.tsx` — Added campaign stage map with locked/unlocked/completed states and lock guidance copy.
- `frontend/src/components/GameOverlay.tsx` — Added explicit completion and interrupted-run overlays with campaign-specific CTAs.
- `frontend/src/components/HUD.tsx` — Extended HUD with unlocked-stage and completed-stage campaign context.
- `frontend/src/game/engine.ts` — Wired campaign checkpoint persistence on start, pause, and boss/shop transition.
- `frontend/src/game/types.ts` — Extended game session contract with attempted/completed/interrupted campaign fields.
- `frontend/src/state/gameStore.ts` — Initialized and preserved campaign progression fields in the store reset path.
- `frontend/src/services/shopPersistenceService.ts` — Added additive migration, clamping, and interrupted-run validation for local progress persistence.
- `frontend/tests/integration/us1-boss-stage-flow.test.tsx` — Added integration coverage for migration defaults, checkpoint sequence, campaign map rendering, interrupted-run prompts, and replay progression retention.
- `frontend/tests/integration/us2-boss-outcome-feedback.test.tsx` — Updated stale integration expectations to current completion overlay and boss-stage progression contracts.
- `frontend/tests/integration/us2-progression-shop.test.tsx` — Updated stale progression/shop assertions to reflect campaign boss-stage rules.
- `.gsd/PROJECT.md` — Refreshed project current-state document after slice completion.
