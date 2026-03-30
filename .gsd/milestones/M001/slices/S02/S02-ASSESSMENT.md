# S02 Nyquist Baseline

## Scope locked by T01

T01 establishes the minimum verifiable contract for CAMP-02 foundation work without widening the architecture:

- Campaign stages `1..5` remain boss stages.
- Boss identity is data-driven per stage via `bossProfiles`.
- Spawned bosses carry explicit profile identity and encounter attempt metadata.
- Store-facing `bossEncounter` state carries explicit lifecycle/outcome fields (`idle | active | victory | defeat`) plus attempt/timestamps/health snapshots.
- Outcome feedback contracts already exercised in integration tests remain compatible with the new encounter state.

## Verified commands

1. `npm --prefix frontend run test -- tests/unit/us2-campaign-boss-contract.test.ts tests/unit/foundations-boss-powerups-types.test.ts tests/unit/us2-boss-encounter-telemetry.test.ts tests/integration/us2-boss-outcome-feedback.test.tsx`
2. `npm --prefix frontend run validate`

## What T01 proves

- Boss-per-campaign-stage contract is enforced at the progression rule level.
- Five campaign stages expose distinct mechanical boss identities.
- Boss creation snapshots the stage profile and explicit encounter attempt.
- Encounter result remains an explicit gate before shop progression.
- Foundation changes do not regress the broader frontend suite.

## Deferred to T02/T03

- Telemetry emission from engine transition points (`boss_encounter_started`, `boss_player_defeated`, `boss_player_victory`) needs full transition-point verification in T02.
- Audiovisual feedback wiring still belongs to T02.
- Full balance guardrails and boss-outcome e2e coverage remain for T03.
