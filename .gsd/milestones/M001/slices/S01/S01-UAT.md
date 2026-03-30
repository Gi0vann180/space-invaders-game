# S01: Campaign Meta Layer — UAT

**Milestone:** M001
**Written:** 2026-03-30T18:45:57.337Z

# S01: Campaign Meta Layer — UAT

**Milestone:** M001
**Written:** 2026-03-30

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: the shipped behavior in this slice is primarily local persistence, app-shell state hydration, and deterministic React/engine contracts already covered by integration tests; no external services or device-only dependencies are involved yet.

## Preconditions

- `frontend` dependencies installed.
- Run from repo root: `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`
- For full regression confidence: `npm --prefix frontend run validate`

## Smoke Test

Run `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` and confirm all 7 tests pass, especially the campaign map rendering case and interrupted-run prompt case.

## Test Cases

### 1. Migrate legacy campaign progress safely

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `migra perfil legado com defaults seguros para novos campos de campanha`.
3. **Expected:** a legacy persisted profile without `lastAttemptedStage`, `lastCompletedStage`, or `interruptedRun` is normalized with `null` defaults instead of throwing or corrupting progress.

### 2. Persist checkpoints for start, pause, and completion

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `persiste sequencia de checkpoints (inicio, pausa e conclusao) sem dependencia de rede`.
3. **Expected:** three persistence writes occur in sequence, the final snapshot clears `interruptedRun`, preserves `lastAttemptedStage`, and advances `lastCompletedStage`/`highestUnlockedStage` without any network dependency.

### 3. Render campaign map states and locked guidance

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `renderiza mapa da campanha com estados locked, unlocked e completed`.
3. **Expected:** the map renders stages 1..5, locked stages show `Derrote o chefe da fase anterior para desbloquear`, and selecting an unlocked stage triggers `onSelectStage` with the chosen phase.

### 4. Surface interrupted run recovery and completion actions

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `mostra copy de fase completada e prompt de run interrompida com acoes`.
3. **Expected:** the completion overlay shows `FASE COMPLETADA` with `Proxima fase`, and the interrupted-run prompt shows `Continuar` and `Reiniciar`, both wired to their handlers.

### 5. Preserve unlocked progression when replaying earlier phases

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `replay de fase concluida nao reduz progressao desbloqueada`.
3. **Expected:** replaying a lower phase does not reduce `highestUnlockedStage` or `lastCompletedStage` in persisted progress.

## Edge Cases

### Invalid interrupted snapshot

1. Execute `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`.
2. Inspect the passing case `retorna fallback seguro quando interrupted payload e invalido`.
3. **Expected:** malformed interrupted-run payloads resolve to `null` instead of crashing boot or restoring bad state.

## Failure Signals

- `us1-boss-stage-flow.test.tsx` failing on migration defaults, checkpoint write count, or completion/interruption copy.
- `npm --prefix frontend run validate` failing in progression or overlay tests after campaign contract changes.
- Persisted profiles showing reduced unlocked stage after replay, or interrupted runs remaining set after phase completion.

## Not Proven By This UAT

- Real Android app lifecycle behavior across OS pause/resume/kill scenarios.
- Human-feel evaluation of campaign UX, touch ergonomics, or visual polish on a phone.

## Notes for Tester

This slice deliberately proves contract correctness at the artifact/test layer. If a downstream slice changes boss-stage rules or overlay copy, update adjacent integration expectations in the same change so repo-level validation stays aligned with the actual campaign contract.
