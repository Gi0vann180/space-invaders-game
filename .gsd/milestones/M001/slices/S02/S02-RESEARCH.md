# Phase 2: Boss Encounters - Research

**Researched:** 2026-03-24
**Domain:** Boss encounter design + game loop transitions + local telemetry in React/Canvas architecture
**Confidence:** HIGH

## User Constraints

No `02-CONTEXT.md` was found for this phase (`has_context: false` from init).  
Locked/discretion/deferred constraints were not provided for Phase 2.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CAMP-02 | Cada fase possui chefe com mecanica distinta e telemetria de derrota/vitoria | Sections: Gap Analysis, Data Model and State Changes, Telemetry Events, Plan Slices |
| CORE-04 | Feedback audiovisual claro em impactos, dano, derrotas e vitorias | Sections: Gap Analysis, Architecture Patterns, Test Strategy, Risks and Mitigations |
</phase_requirements>

## Summary

A base atual ja possui fundacao importante para encontros de boss: `WaveState` com `boss` opcional, spawn de boss em `progressionSystem`, colisao dedicada (`resolveBossProjectileCollisions`), barra de HP no HUD/overlay e transicao para loja apos derrota do boss. A dificuldade tambem escala por `StageConfig` e multiplicador de ciclo.

O gap principal para CAMP-02 e CORE-04 esta em tres pontos: (1) boss nao existe em cada fase, apenas em multiplos de 10 (`isBossStage`), (2) mecanicas ainda sao combinacoes de poucos padroes de tiro em um unico chassis de boss (mesmo movimento/base visual), e (3) nao existe telemetria de boss start/vitoria/derrota no loop atual (apenas `cycle-stage-advanced`). Feedback audiovisual ainda e majoritariamente visual simples (retangulos + textos), sem integracao de audio/haptics do `audioService`.

**Primary recommendation:** implementar um `BossEncounterCoordinator` dentro da engine atual (sem trocar arquitetura), com perfil de boss por fase, estado explicito de encontro (attempt/outcome), hooks de feedback audiovisual e emissao de 3 eventos de telemetria obrigatorios (`boss_encounter_started`, `boss_player_defeated`, `boss_player_victory`).

## Current Architecture Snapshot

### Runtime flow relevante para bosses
- `engine.ts` orquestra update loop, spawn/tick de boss e transicoes de estado (`running` -> `shop` / `game-over`).
- `progressionSystem.evaluateStageProgression` decide entrada em boss ou loja.
- `bossSystem` controla spawn e movimento horizontal + cooldown de ataque.
- `bossAttackSystem` emite projeteis por padrao (`burst-3`, `line-5`, `targeted-2`).
- `collisionSystem.resolveBossProjectileCollisions` aplica dano e sinaliza `bossDefeated`.
- `gameStore` expoe `bossEncounter` (active, bossId, health, maxHealth) para UI.

### UI/feedback atual
- `HUD` e `GameOverlay` mostram HP do boss quando `bossEncounter.active`.
- Overlay de conclusao e game-over existe, mas sem diferenciacao forte de boss victory vs normal completion.
- `audioService` (shoot/hit/game-over + vibrate) existe mas nao esta integrado ao loop.

### Persistencia/telemetria atual
- Persistencia local de progresso via IndexedDB (`shopPersistenceService`).
- Telemetria local (`lib/telemetry.ts`) depende de consentimento e grava em store `telemetry`.
- Evento atual no fluxo de jogo: `cycle-stage-advanced` em `continueToNextStage`.

## Gap Analysis vs CAMP-02 and CORE-04

### CAMP-02 (boss por fase, mecanica distinta, telemetria vitoria/derrota)
- **Coberto parcialmente:** existe sistema de boss com HP, ataque e derrota.
- **Gap 1 (alto):** boss so em fases multiplas de 10, nao em cada fase.
- **Gap 2 (alto):** identidade mecanica por fase e limitada; diferenca atual e mix de padroes e numeros de config, sem behavior kit por boss.
- **Gap 3 (alto):** sem eventos de telemetria de `boss_start`, `boss_player_defeated`, `boss_player_victory`.

### CORE-04 (feedback audiovisual claro)
- **Coberto parcialmente:** HUD/overlay textual + barra de HP.
- **Gap 1 (alto):** audio/haptics nao usados apesar de infraestrutura pronta.
- **Gap 2 (medio):** impactos/dano de boss nao tem feedback diferenciado (hit normal vs boss hit).
- **Gap 3 (medio):** derrota/vitoria de boss nao possui sequencia audiovisual propria (estado de celebracao/derrota contextual).

## Standard Stack

### Core
| Library | Version in repo | Purpose | Why Standard |
|---------|-----------------|---------|--------------|
| TypeScript | ^5.0.0 | Tipagem de entidades/sistemas do loop | Ja adotado em 100% da logica de jogo |
| React | ^18.0.0 | UI HUD/overlay/mapa | Base existente para estado visual de encontro |
| Vitest | ^2.1.8 | Unit/integration tests | Suite rapida para regras de progressao/boss |
| Playwright | ^1.53.2 (repo), 1.58.2 disponivel via npx | E2E browser flows | Ja usado para fluxos de run e transicao |

### Supporting
| Library | Version in repo | Purpose | When to Use |
|---------|------------------|---------|-------------|
| Testing Library | ^16.1.0 | Assert de overlays/HUD | Validar feedback visual e copy |
| IndexedDB wrapper local | interno | Persistir telemetria e progresso | Registro offline-first de eventos |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Expandir engine atual com coordenador de encontro | Introduzir FSM externa (ex: XState) | Melhor visualizacao de estados, mas custo de migracao alto para fase curta |
| Telemetria local simples | Pipeline remoto imediato | Maior observabilidade, mas quebra requisito offline-first desta fase |

**Installation (fase 2):**
```bash
npm --prefix frontend run test
```
Sem novas dependencias obrigatorias para implementar a fase.

**Version verification (npm registry, 2026-03-24):**
- react: 19.2.4 (repo esta em 18.x)
- vite: 8.0.2 (repo esta em 5.x)
- vitest: 4.1.1 (repo esta em 2.x)
- @playwright/test: 1.58.2 (repo esta em 1.53.x)
- typescript: 6.0.2 (repo esta em 5.x)

## Implementation Options with Trade-offs

### Option A (Recommended): Boss per stage + encounter coordinator in engine
- **What:** remover dependencia de `isBossStage` para spawn; cada fase entra em sequencia enemy -> boss -> result.
- **Pros:** menor risco arquitetural, reaproveita systems atuais, entrega CAMP-02 rapido.
- **Cons:** `engine.ts` fica maior; precisa disciplina de modularizacao por helper.

### Option B: Dedicated boss state machine module
- **What:** criar modulo `bossEncounterStateMachine.ts` com estados (`intro`, `active`, `victory`, `defeat`, `transition`).
- **Pros:** clareza de fluxo e testabilidade superior.
- **Cons:** refactor mais profundo; risco de atrasar entrega da fase.

### Option C: Scripted boss timeline per phase (data-driven)
- **What:** cada fase define timeline de ataques e janelas de vulnerabilidade.
- **Pros:** maior identidade mecanica.
- **Cons:** tuning complexo; alto risco de regressao de dificuldade para prazo curto.

## Recommended Approach for This Codebase

Usar **Option A com elementos de Option B**:
1. Manter engine/systems atuais.
2. Introduzir subestado de encontro no store (`bossEncounter.phase`, `attempt`, `outcome`, timestamps).
3. Extrair helpers da engine para reduzir acoplamento:
   - `startBossEncounter(...)`
   - `handleBossDefeat(...)`
   - `handleBossPlayerDefeat(...)`
   - `emitBossTelemetry(...)`
4. Tornar boss obrigatorio em toda fase da campanha v1 (1-5) e manter scaling de ciclo para fases >5.
5. Adicionar camada data-driven de identidade por fase (padroes + movimento + cadencia + visual/audio cues).

## Architecture Patterns

### Recommended Project Structure
```text
frontend/src/game/
├── config/
│   ├── stages.ts              # base stats
│   └── bossProfiles.ts        # NEW: identidade por fase
├── systems/
│   ├── bossSystem.ts
│   ├── bossAttackSystem.ts
│   ├── progressionSystem.ts
│   └── bossEncounterTelemetry.ts  # NEW: payload builders + emit wrappers
└── engine.ts                  # orquestracao + chamadas dos helpers
```

### Pattern 1: Data-driven boss identity
**What:** definir perfis por fase em dados, nao em `if` espalhado.
**When to use:** sempre que adicionar/ajustar mecanica de boss.
**Example:**
```ts
export type BossProfile = {
  stage: number
  attackPatternSequence: BossAttackPatternId[]
  moveModel: 'horizontal-bounce' | 'dash-window'
  telegraphMs: number
  sfx: { spawn: 'hit' | 'shoot'; victory: 'hit' | 'game-over' }
}
```

### Pattern 2: Outcome-driven transitions
**What:** transicao baseada em outcome explicito (`victory`/`defeat`) e nao apenas status global.
**When to use:** para garantir feedback/UI/telemetria consistentes.

### Pattern 3: Telemetry-at-source
**What:** emitir evento no ponto de verdade do loop (spawn/kill/death), nao na UI.
**When to use:** todos os eventos CAMP-02.

### Anti-Patterns to Avoid
- **Boss logic in React components:** quebra separacao engine/UI.
- **Emitir telemetria apenas no `continueToNextStage`:** perde derrotas e abandonos.
- **Adicionar flags soltas no store sem modelo de outcome:** gera condicoes ambiguas.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Persistencia de eventos offline | Fila custom com IndexedDB manual em varios pontos | `logTelemetryEvent` + store `telemetry` ja existente | Menos risco de corrupcao e menos codigo duplicado |
| Controle de fase/campanha | Reescrever progressao do zero | Expandir `evaluateStageProgression` e `StageConfig` | Fluxo atual ja cobre transicoes base |
| Sistema de audio complexo agora | Mixer/audio graph completo | Integrar `audioService` atual por eventos-chave | CORE-04 pede clareza, nao complexidade sonora |

**Key insight:** O projeto ja tem 80% dos blocos. O valor da fase esta em conectar os blocos (boss identity + feedback + telemetry), nao em trocar stack.

## Data Model and State Changes Needed

### Existing types to evolve
- `BossEncounterState` em `frontend/src/game/types.ts`
- `GameSessionState` em `frontend/src/game/types.ts`
- `initialState` em `frontend/src/state/gameStore.ts`

### Proposed shape updates
```ts
type BossEncounterOutcome = 'none' | 'victory' | 'defeat'

type BossEncounterState = {
  active: boolean
  bossId: string | null
  health: number
  maxHealth: number
  stage: number | null
  attempt: number
  startedAtMs: number | null
  endedAtMs: number | null
  outcome: BossEncounterOutcome
  damageTaken: number
}
```

### Progression rule changes
- Boss encounter ocorre em toda fase da campanha ativa (1-5) em vez de apenas multiplos de 10.
- `evaluateStageProgression` deve aceitar regra configuravel (`bossEveryStage: true` para campanha v1).
- `StageConfig` deve separar `enemyPhase` e `bossPhase` tuning para evitar picos.

## Telemetry Events / Schema Proposals

### Required events (CAMP-02)
1. `boss_encounter_started`
2. `boss_player_defeated`
3. `boss_player_victory`

### Common payload
```ts
type BossTelemetryPayload = {
  runId: string
  stage: number
  bossId: string
  attempt: number
  cycle: number
  bossHealthMax: number
  elapsedMs?: number
  remainingLives?: number
  score?: number
  reason?: 'player_hp_zero' | 'quit' | 'timeout'
}
```

### Emission points
- Start: imediatamente apos `spawnBossForWave` bem-sucedido.
- Player defeated: quando `status` muda para `game-over` com `bossEncounter.active === true`.
- Player victory: no ramo de `progression.enterShop` quando `bossDefeated === true`.

### Consent/offline behavior
- Manter gate de consentimento (`setTelemetryConsent`).
- Sem consentimento: retorno `false` e nenhum side effect.
- Com consentimento: salvar em IndexedDB local; sync remoto fica para fase posterior.

## Test Strategy

### Unit tests
- `progressionSystem`: fase com boss obrigatorio por stage.
- `bossProfiles`: perfil correto por fase (ataque, movimento, telegraph).
- `bossEncounterTelemetry`: payload completo e tipos validos.
- `audio feedback hooks`: dispara `playTone`/`vibrate` nos outcomes certos.

### Integration tests
- Boss start atualiza store com `attempt`, `startedAtMs`, `stage`.
- Defeat em boss ativa overlay/estado correto e emite `boss_player_defeated`.
- Victory em boss entra em shop, aplica score e emite `boss_player_victory`.
- HUD/GameOverlay refletem boss HP + resultado de encontro sem delay de estado.

### E2E tests
- Fluxo fase 1 ate boss e derrota/vitoria com feedback visivel.
- Verificacao de copy/estado para vitoria e derrota de boss.
- Telemetria gravada localmente (stub do IndexedDB/spy) quando consentimento ativo.

### Concrete test cases (phase requirements mapping)
- **CAMP-02-T1:** ao limpar inimigos da fase, boss nasce sempre (fases 1-5).
- **CAMP-02-T2:** bosses de fases consecutivas usam perfis mecanicos distintos.
- **CAMP-02-T3:** start/defeat/victory geram exatamente 1 evento cada por tentativa.
- **CORE-04-T1:** dano em boss mostra feedback visual imediato (barra HP + hit cue).
- **CORE-04-T2:** derrota do jogador no boss mostra feedback de derrota contextual.
- **CORE-04-T3:** vitoria do boss mostra feedback audiovisual antes da transicao.

## Common Pitfalls

### Pitfall 1: Telemetry emitida em ponto errado
**What goes wrong:** eventos faltando ou duplicados.
**Why:** emissao na UI (render) em vez de transicao de estado.
**How to avoid:** emitir apenas em pontos de transicao da engine.
**Warning signs:** contagem de eventos > tentativas de boss.

### Pitfall 2: Dificuldade explode ao mudar boss para every-stage
**What goes wrong:** picos injustos entre fases.
**Why:** reuse direto de tuning de ciclo 10-stage.
**How to avoid:** separar curva de campanha curta (1-5) da curva infinita.
**Warning signs:** aumento abrupto de mortes em fase n+1 sem mudanca de skill.

### Pitfall 3: Feedback audiovisual inconsistente com settings
**What goes wrong:** audio/vibracao tocando sem respeitar preferencias.
**Why:** bypass de `settingsStore` no disparo de feedback.
**How to avoid:** encapsular feedback em helper com flags de configuracao.
**Warning signs:** testes de consent/config falhando em cenarios de mute/haptics off.

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Regressao no fluxo de progressao de campanha | Alto | Medio | Preservar contrato de `evaluateStageProgression` com testes de snapshot por fase |
| Duplicidade de telemetria por re-render | Medio | Medio | Emissao apenas em engine transitions + idempotencia por `attempt` |
| Baixa legibilidade visual em mobile | Medio | Medio | Reusar HUD/Overlay existentes e validar por testes visuais/e2e |
| Aumento de complexidade da engine | Medio | Alto | Extrair helpers dedicados e manter funcoes puras nos systems |

## Proposed Plan Breakdown into Executable Plan Slices

1. **Slice 1 - Boss identity model per stage**
   - Criar `bossProfiles` e ligar em spawn/ataque.
   - Definir diferencas mecanicas minimas por fase 1-5.

2. **Slice 2 - Encounter lifecycle state**
   - Expandir `BossEncounterState` com attempt/outcome/timestamps.
   - Atualizar transicoes de engine para start/victory/defeat.

3. **Slice 3 - Audiovisual feedback wiring (CORE-04)**
   - Integrar `audioService` e vibracao em hit/victory/defeat.
   - Ajustar HUD/Overlay para estados contextuais de boss.

4. **Slice 4 - Telemetry contracts (CAMP-02)**
   - Implementar 3 eventos obrigatorios com schema tipado.
   - Adicionar testes de consentimento e contagem por tentativa.

5. **Slice 5 - Balance and fairness guardrails**
   - Ajustar tuning boss per-stage para curva 1-5.
   - Adicionar testes monotonicos especificos de boss.

6. **Slice 6 - End-to-end verification**
   - Cobrir fluxo completo boss start -> outcome -> transition.
   - Executar `test`, `test:e2e` e checklist manual de feedback.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Boss como checkpoint raro (a cada 10 fases) | Boss como pilar da identidade de fase (cada fase) | Proposed in Phase 2 | Melhor alinhamento com CAMP-02 |
| Telemetria generica de ciclo | Eventos especificos de encounter outcome | Proposed in Phase 2 | Medicao real de dificuldade/falha |
| Feedback majoritariamente textual | Feedback audiovisual orientado a eventos | Proposed in Phase 2 | Melhor leitura de estado para jogador |

**Deprecated/outdated for this phase scope:**
- Regra `isBossStage` baseada em modulo 10 para campanha principal.

## Open Questions

1. **Campanha v1 termina na fase 5, mas boss era fase 10. Como conciliar?**
   - What we know: fase 1 definiu mapa 1-5 e progressao local.
   - What's unclear: manter modo infinito antigo junto da campanha curta.
   - Recommendation: introduzir `campaignMode` com boss every-stage (1-5) e manter regra legacy para endless se existir.

2. **Qual intensidade de feedback (audio/vibracao) e aceitavel em mobile?**
   - What we know: settings ja tem `audioEnabled` e `vibrationEnabled`.
   - What's unclear: thresholds de frequencia para nao incomodar.
   - Recommendation: limitar feedback forte a eventos de outcome e hit critico de boss.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/test/runtime tooling | Yes | v24.13.0 | - |
| npm | Scripts (`test`, `validate`) | Yes | 11.12.0 | - |
| Playwright CLI | E2E validation | Yes (via npx) | 1.58.2 | Rodar apenas unit/integration se browser setup falhar |

**Missing dependencies with no fallback:**
- None identified for Phase 2 planning.

**Missing dependencies with fallback:**
- None identified.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.x + Testing Library + Playwright |
| Config file | `frontend/vitest.config.ts`, `frontend/playwright.config.ts` |
| Quick run command | `npm --prefix frontend run test -- --run tests/unit/us2-boss-movement.test.ts` |
| Full suite command | `npm --prefix frontend run validate` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CAMP-02 | Boss em cada fase com mecanica distinta | unit + integration + e2e | `npm --prefix frontend run test` | Partial |
| CAMP-02 | Telemetria start/defeat/victory por tentativa | unit + integration | `npm --prefix frontend run test` | No (new tests needed) |
| CORE-04 | Feedback audiovisual claro em hit/defeat/victory | integration + e2e + manual | `npm --prefix frontend run test:e2e` | Partial |

### Sampling Rate
- **Per task commit:** `npm --prefix frontend run test`
- **Per wave merge:** `npm --prefix frontend run validate`
- **Phase gate:** suite completa verde + checklist manual de feedback audiovisual

### Wave 0 Gaps
- [ ] `frontend/tests/unit/us2-boss-encounter-telemetry.test.ts` - CAMP-02 events contract
- [ ] `frontend/tests/integration/us2-boss-outcome-feedback.test.tsx` - CORE-04 feedback and transitions
- [ ] `frontend/tests/e2e/us2-boss-encounter-outcomes.spec.ts` - full encounter outcomes by stage

## Sources

### Primary (HIGH confidence)
- Internal codebase inspection: `frontend/src/game/engine.ts`, `frontend/src/game/systems/progressionSystem.ts`, `frontend/src/game/systems/bossSystem.ts`, `frontend/src/game/systems/bossAttackSystem.ts`, `frontend/src/lib/telemetry.ts`
- Product requirements: `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`
- Existing test suite: `frontend/tests/integration/us1-boss-stage-flow.test.tsx` and related `us2/*` tests

### Secondary (MEDIUM confidence)
- npm registry version checks (`npm view react/vite/vitest/@playwright/test/typescript version time.modified`)

### Tertiary (LOW confidence)
- None. No unverified web-only claims used.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - derived from workspace package/config files
- Architecture: HIGH - derived from current engine/systems/store implementation
- Pitfalls: HIGH - tied to identified code paths and existing test coverage gaps

**Research date:** 2026-03-24
**Valid until:** 2026-04-23 (30 days)