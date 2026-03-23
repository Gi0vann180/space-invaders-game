# Phase 1: Campaign Meta-Layer - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver campaign progression with clear phase goals, persistent unlocks between sessions, pause/resume continuity, and full offline operation for the core campaign loop.

</domain>

<decisions>
## Implementation Decisions

### Campaign Structure
- **D-01:** Campaign map will be linear from phase 1 to phase 5, with sequential unlocks.
- **D-02:** Visual progression will use connected nodes with explicit status states.
- **D-03:** Locked phases remain visible with lock indicator and unlock requirement hint.
- **D-04:** Replay of previously completed phases is allowed and does not remove progression.

### Progression Rules
- **D-05:** A phase is completed when the player defeats that phase boss.
- **D-06:** Completion reward uses fixed package plus one bonus choice.
- **D-07:** Next phase unlock is automatic after boss defeat.
- **D-08:** On defeat, player gets immediate retry of the same phase.

### Persistence and Autosave
- **D-09:** Autosave triggers on phase start, phase completion, and pause/background transitions.
- **D-10:** Persistence writes are checkpoint-event based (no periodic timer in v1).
- **D-11:** Persist minimum campaign state: highest unlocked phase, current phase result, and total runs.
- **D-12:** On incompatible saved data, attempt migration first, then fallback to safe minimum progression.

### Offline Resume Behavior
- **D-13:** On app reopen with interrupted run, show prompt: Continue or Restart.
- **D-14:** Interrupted run has no expiration in v1, as long as state is valid.
- **D-15:** If run snapshot is invalid/corrupted, fallback to start of current phase.
- **D-16:** Campaign progression and resume are fully local/offline in v1.

### the agent's Discretion
- Visual styling details of campaign map nodes and transition animations.
- Exact wording and iconography of lock/reward/retry messages.
- Technical snapshot shape internals as long as D-09 to D-16 are preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and acceptance
- `.planning/ROADMAP.md` - Defines Phase 1 goal, requirements mapping, and success criteria.
- `.planning/REQUIREMENTS.md` - Source of CAMP-01, CAMP-05, CORE-02, CORE-03 constraints.
- `.planning/PROJECT.md` - Product intent, non-negotiables, and v1 scope boundaries.

### Existing architecture and conventions
- `.planning/codebase/ARCHITECTURE.md` - Current engine/store/system layering and data flow.
- `.planning/codebase/CONVENTIONS.md` - Code style and module patterns to preserve.
- `.planning/codebase/STRUCTURE.md` - Code organization and target locations for new code.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/state/gameStore.ts`: already has `progressionProfile` with `highestUnlockedStage` and `totalRuns`.
- `frontend/src/services/shopPersistenceService.ts`: provides persisted progress profile get/save on IndexedDB.
- `frontend/src/game/config/stages.ts`: stage model and scaling logic already established.
- `frontend/src/game/engine.ts`: status lifecycle (`idle`, `running`, `paused`, `shop`, `game-over`) and progression transitions.
- `frontend/src/App.tsx`: startup hydration of persisted profile and UI orchestration hooks.

### Established Patterns
- Store-centric updates with `gameStore.setState` and immutable partial state merges.
- Persistence through service wrappers over IndexedDB, with safe default fallbacks.
- Progression flow controlled in engine/systems, not in UI components.

### Integration Points
- Add campaign map/read-model in UI layer without breaking current HUD/overlay/shop flow.
- Extend progress persistence in `shopPersistenceService` while keeping backward-compatible migration path.
- Wire continue/restart prompt flow into existing status transitions and round lifecycle in engine.

</code_context>

<specifics>
## Specific Ideas

No specific requirements - open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 01-campaign-meta-layer*
*Context gathered: 2026-03-23*
