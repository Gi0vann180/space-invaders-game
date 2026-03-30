# Phase 2: Boss Encounters - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver boss encounters with distinct per-stage identity, clear audiovisual feedback for boss outcomes, and local/offline telemetry for boss start/victory/defeat events, while preserving campaign progression consistency from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Boss Identity Model
- **D-01:** Use `main archetype + variation` per stage (not fully fixed and not fully random).
- **D-02:** Campaign difficulty tone for bosses is **normal**.
- **D-03:** Attempt-to-attempt variation level is **medium** (timing and pattern order can vary, identity remains recognizable).
- **D-04:** Target encounter feel is **near bullet-hell, but fair** (high pressure with readable telegraphs and avoidable damage).

### Carried Forward from Phase 1
- **D-05:** Boss defeat remains the completion trigger for stage progression (compatibility with existing campaign rules).
- **D-06:** Defeat flow keeps immediate retry path for the same stage.
- **D-07:** Core loop and progression behavior remain offline-first/local-first.

### the agent's Discretion
- Exact naming and thematic flavor of each stage archetype.
- Precise parameter ranges for timing/order variation under the medium variation constraint.
- Concrete telegraph durations and per-stage balancing values, as long as fairness/readability is preserved.
- Optional telemetry fields beyond the minimum required start/victory/defeat contract.

</decisions>

<specifics>
## Specific Ideas

- User preference anchors:
  - "tom de dificuldade: normal"
  - "grau de variacao por tentativa: medio"
  - "referencia de sensacao: quase bullet-hell (mas justo)"

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements
- `.planning/ROADMAP.md` - Defines Phase 2 goal, requirements mapping, and success criteria.
- `.planning/REQUIREMENTS.md` - Source of CAMP-02 and CORE-04 constraints.
- `.planning/PROJECT.md` - Product direction and mobile-first/offline constraints.
- `.planning/STATE.md` - Current project progress and execution context.

### Prior Locked Decisions (Compatibility)
- `.planning/phases/01-campaign-meta-layer/01-CONTEXT.md` - Phase 1 decisions that must remain consistent (boss completion trigger, retry flow, offline behavior).

### Phase 2 Inputs and Existing Direction
- `.planning/phases/02-boss-encounters/02-RESEARCH.md` - Technical baseline and implementation risk/tradeoff analysis.
- `.planning/phases/02-boss-encounters/02-01-PLAN.md` - Existing plan slice relevant to encounter contracts and per-stage boss identity.

### Codebase Conventions and Architecture
- `.planning/codebase/ARCHITECTURE.md` - Engine/store/system layering and runtime data flow.
- `.planning/codebase/CONVENTIONS.md` - Coding patterns and module conventions.
- `.planning/codebase/TESTING.md` - Unit/integration testing patterns for gameplay systems.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/game/systems/progressionSystem.ts`: central progression decision point (`evaluateStageProgression`) for enemy->boss->shop transitions.
- `frontend/src/game/systems/bossAttackSystem.ts`: current boss projectile patterns and cycle-scaling hook.
- `frontend/src/game/config/gameplay.ts`: current boss-stage gating and cycle math.
- `frontend/src/lib/telemetry.ts`: local consent-gated telemetry event logging.
- `frontend/src/services/audioService.ts`: existing tone + vibration primitives for audiovisual feedback integration.

### Established Patterns
- Engine orchestrates transitions; UI should not own gameplay truth.
- Store snapshot is the single UI-facing source for encounter status.
- Service wrappers gate side effects (telemetry, persistence, feedback support checks).

### Integration Points
- Extend encounter lifecycle in engine transition points (boss start, boss victory, player defeat during boss).
- Feed profile-driven behavior into existing boss attack/progression flow.
- Emit telemetry at engine transition source points, not from React render paths.

</code_context>

<deferred>
## Deferred Ideas

- Full remote telemetry pipeline/sync transport (out of scope for Phase 2; local event capture only).
- Large audiovisual content pipeline changes (new asset production workflow) beyond necessary encounter feedback hooks.

</deferred>

---

*Phase: 02-boss-encounters*
*Context gathered: 2026-03-26*
