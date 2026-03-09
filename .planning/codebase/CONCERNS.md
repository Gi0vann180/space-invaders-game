# Codebase Concerns

**Analysis Date:** 2026-03-09

## Tech Debt

**Game loop orchestration concentration:**
- Issue: Single large coordinator accumulates many responsibilities (input, progression, collisions, persistence, telemetry, render)
- Files: `frontend/src/game/engine.ts`
- Impact: High change risk and regression probability when adding gameplay rules
- Fix approach: Extract phase-specific orchestrators (combat tick, progression transition, persistence sync) and keep `engine.ts` as composition root

**Shop and modifier domain coupling:**
- Issue: Upgrade logic and run-modifier logic are split across large files with overlapping concerns
- Files: `frontend/src/services/shopService.ts`, `frontend/src/game/systems/runModifierSystem.ts`, `frontend/src/components/ShopScreen.tsx`
- Impact: Harder to evolve economy balance and UI behavior consistently
- Fix approach: Introduce a single domain module for economy calculations shared by system and UI adapters

## Known Bugs

**Potential non-deterministic drops across environments:**
- Symptoms: Rare-drop generation uses real-time and enemy coordinates as seed source
- Files: `frontend/src/game/systems/waveSystem.ts`, `frontend/src/game/systems/dropSystem.ts`
- Trigger: Different frame timings or clocks can alter `nowMs` and produce divergent drop outcomes
- Workaround: In tests, keep deterministic seeds and helper flows (`frontend/tests/fixtures/drop-fixtures.ts`, `frontend/tests/helpers/run-cycle.ts`)

## Security Considerations

**Leaderboard API trust model:**
- Risk: Client posts arbitrary score payloads to `/leaderboard`
- Files: `frontend/src/services/leaderboardApi.ts`, `frontend/src/services/highscoreSyncService.ts`
- Current mitigation: Telemetry consent gate for sync invocation (`frontend/src/services/highscoreSyncService.ts`)
- Recommendations: Enforce server-side score validation/signing and rate limiting; keep client as untrusted input source

## Performance Bottlenecks

**Main update loop scales with entity counts:**
- Problem: Multiple array scans/maps/filters per frame over projectiles, enemies, and drops
- Files: `frontend/src/game/engine.ts`, `frontend/src/game/systems/collisionSystem.ts`, `frontend/src/game/systems/waveSystem.ts`
- Cause: Repeated full-collection passes and immutable copies in hot path
- Improvement path: Partition collision checks spatially, reduce intermediate allocations, and profile with stage stress scenarios

## Fragile Areas

**Engine-store-UI synchronization boundary:**
- Files: `frontend/src/game/engine.ts`, `frontend/src/state/gameStore.ts`, `frontend/src/App.tsx`
- Why fragile: Runtime state is mutable in engine globals while UI reads snapshots via store subscriptions
- Safe modification: Preserve atomic `gameStore.setState` updates and add integration tests when adding new state fields
- Test coverage: Good flow coverage exists, but no dedicated concurrency/race simulation

**Boss progression transitions:**
- Files: `frontend/src/game/systems/progressionSystem.ts`, `frontend/src/game/systems/bossSystem.ts`, `frontend/tests/integration/us1-boss-stage-flow.test.tsx`
- Why fragile: Multiple boolean gates (`bossActive`, `bossDefeated`, enemies count) control state transitions
- Safe modification: Keep progression as pure function and extend tests for each gate combination
- Test coverage: Core scenarios covered; edge cases for interrupted/resumed ticks are limited

## Scaling Limits

**Single-thread browser simulation:**
- Current capacity: Intended for current entity caps and stage scaling (`frontend/src/game/config/performance.ts`)
- Limit: Higher wave density or projectile bursts can drop FPS on lower-end devices
- Scaling path: Add adaptive quality tiers and entity culling based on FPS probe in `frontend/src/game/perf/fpsProbe.ts`

## Dependencies at Risk

**No dependency risk requiring migration detected:**
- Risk: Not applicable from current repository evidence
- Impact: Not applicable
- Migration plan: Not applicable

## Missing Critical Features

**Server-side anti-cheat for leaderboard:**
- Problem: Integrity guarantee for scores is not represented in frontend code/contracts
- Blocks: Trustworthy competitive ranking at scale

**Automated CI quality gate:**
- Problem: No repository CI workflow detected for lint/test/e2e execution
- Blocks: Consistent pre-merge validation

## Test Coverage Gaps

**Failure-mode API tests:**
- What's not tested: `fetchLeaderboard`/`submitHighscore` network failure and retry behavior
- Files: `frontend/src/services/leaderboardApi.ts`
- Risk: Runtime unhandled error regressions in network instability
- Priority: Medium

**Performance regression tests:**
- What's not tested: FPS/throughput behavior under high-stage stress
- Files: `frontend/src/game/engine.ts`, `frontend/src/game/systems/waveSystem.ts`
- Risk: Performance degradation can ship unnoticed
- Priority: High

---

*Concerns audit: 2026-03-09*
