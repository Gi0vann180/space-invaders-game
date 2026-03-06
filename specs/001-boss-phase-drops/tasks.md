# Tasks: Ciclo de 10 Fases com Boss e Drops Raros

**Input**: Design documents from `/specs/001-boss-phase-drops/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de configuracao e arquivos para evolucao segura da feature.

- [X] T001 Criar configuracao de gameplay para ciclo e raridade em `frontend/src/game/config/gameplay.ts`
- [X] T002 [P] Criar fixture de seeds deterministicas para testes de drop em `frontend/tests/fixtures/drop-fixtures.ts`
- [X] T003 [P] Criar helper de progressao de ciclos para testes em `frontend/tests/helpers/run-cycle.ts`
- [X] T004 Atualizar guia de execucao da feature em `specs/001-boss-phase-drops/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar blocos estruturais compartilhados que destravam todas as historias.

**CRITICAL**: Nenhuma historia de usuario comeca antes desta fase.

- [X] T005 Estender tipos de estado de fase e boss em `frontend/src/game/types.ts`
- [X] T006 [P] Definir modelo de drop raro e tiro concedido em `frontend/src/game/entities/dropItem.ts`
- [X] T007 [P] Criar sistema base de rolagem/expiracao de drop em `frontend/src/game/systems/dropSystem.ts`
- [X] T008 Integrar estado de drops ativos na store de jogo em `frontend/src/state/gameStore.ts`
- [X] T009 Criar testes unitarios de sanidade dos novos tipos e entidades em `frontend/tests/unit/foundation-drop-types.test.ts`

**Checkpoint**: Fundacao pronta, historias podem seguir por prioridade.

---

## Phase 3: User Story 1 - Ciclo de boss previsivel por fases (Priority: P1) MVP

**Goal**: Garantir padrao repetitivo de 9 fases normais e boss na 10a, repetindo em 20, 30 e seguintes.

**Independent Test**: Simular progressao ate fase 30 e validar boss apenas em 10/20/30 com transicoes corretas de fase.

### Tests for User Story 1

- [X] T010 [P] [US1] Criar teste unitario de deteccao de fase boss em `frontend/tests/unit/us1-boss-phase-detection.test.ts`
- [X] T011 [P] [US1] Criar teste de integracao de progressao 9->10->11 em `frontend/tests/integration/us1-stage-cycle-flow.test.tsx`
- [X] T012 [US1] Criar teste E2E de boss em fase 10 em `frontend/tests/e2e/us1-boss-phase10.spec.ts`

### Implementation for User Story 1

- [X] T013 [US1] Implementar regra `stage % 10 === 0` na progressao em `frontend/src/game/systems/progressionSystem.ts`
- [X] T014 [US1] Ajustar configuracao de fases ciclicas em `frontend/src/game/config/stages.ts`
- [X] T015 [US1] Integrar avaliacao de ciclo no loop principal em `frontend/src/game/engine.ts`
- [X] T016 [US1] Exibir indicador de fase boss no HUD em `frontend/src/components/HUD.tsx`

**Checkpoint**: US1 funcional e validavel isoladamente.

---

## Phase 4: User Story 2 - Boss com vida, movimento e derrota (Priority: P1)

**Goal**: Permitir combate completo com boss movel, dano, barra de vida e avancar fase ao derrotar boss.

**Independent Test**: Em uma fase de boss, aplicar dano ate vida zero e confirmar morte do boss com transicao para proxima fase em ate 2s.

### Tests for User Story 2

- [X] T017 [P] [US2] Criar teste unitario de movimento do boss em `frontend/tests/unit/us2-boss-movement.test.ts`
- [X] T018 [P] [US2] Criar teste unitario de derrota do boss por dano em `frontend/tests/unit/us2-boss-defeat-threshold.test.ts`
- [X] T019 [P] [US2] Criar teste de integracao de barra de vida do boss em `frontend/tests/integration/us2-boss-healthbar-sync.test.tsx`
- [X] T020 [US2] Criar teste E2E de derrota e transicao de fase em `frontend/tests/e2e/us2-boss-defeat-transition.spec.ts`

### Implementation for User Story 2

- [X] T021 [US2] Implementar movimento horizontal com reversao em bordas em `frontend/src/game/systems/bossSystem.ts`
- [X] T022 [US2] Integrar aplicacao de dano e morte do boss em `frontend/src/game/systems/collisionSystem.ts`
- [X] T023 [US2] Atualizar renderizacao da barra de vida do boss em `frontend/src/components/GameOverlay.tsx`

**Checkpoint**: US2 funcional e testavel sem depender de US3/US4.

---

## Phase 5: User Story 3 - Drops raros de tiros especiais (Priority: P2)

**Goal**: Gerar bolinha rara ao derrotar inimigo comum e conceder tiro especial aleatorio ao coletar.

**Independent Test**: Derrotar grande volume de inimigos, confirmar ocorrencia rara de drop, coleta e concessao de tiro valido.

### Tests for User Story 3

- [X] T024 [P] [US3] Criar teste unitario da probabilidade de drop raro em `frontend/tests/unit/us3-drop-rarity-roll.test.ts`
- [X] T025 [P] [US3] Criar teste unitario de sorteio de tiro especial permitido em `frontend/tests/unit/us3-random-special-shot.test.ts`
- [X] T026 [P] [US3] Criar teste de integracao de ciclo spawn/coleta/expiracao em `frontend/tests/integration/us3-drop-lifecycle.test.tsx`
- [X] T027 [US3] Criar teste E2E de coleta de bolinha e ativacao de tiro em `frontend/tests/e2e/us3-drop-collect-special-shot.spec.ts`

### Implementation for User Story 3

- [X] T028 [US3] Implementar spawn raro de bolinha na morte de inimigo em `frontend/src/game/systems/waveSystem.ts`
- [X] T029 [US3] Implementar colisao jogador-drop e concessao de tiro em `frontend/src/game/systems/collisionSystem.ts`
- [X] T030 [US3] Integrar expiracao e cleanup de drops no loop em `frontend/src/game/engine.ts`

**Checkpoint**: US3 funcional e validavel independentemente com uso de fase normal.

---

## Phase 6: User Story 4 - Dificuldade crescente ao longo dos ciclos (Priority: P2)

**Goal**: Aumentar pressao de combate a cada novo ciclo de 10 fases de forma monotonicamente crescente.

**Independent Test**: Comparar ciclos 1-10, 11-20 e 21-30 e validar incremento de dificuldade sem quebra de progressao.

### Tests for User Story 4

- [X] T031 [P] [US4] Criar teste unitario de multiplicador por ciclo em `frontend/tests/unit/us4-cycle-difficulty-multiplier.test.ts`
- [X] T032 [P] [US4] Criar teste de integracao de escalonamento de fase em `frontend/tests/integration/us4-cycle-scaling-flow.test.tsx`
- [X] T033 [US4] Criar teste E2E de progressao de dificuldade entre ciclos em `frontend/tests/e2e/us4-cycle-difficulty.spec.ts`

### Implementation for User Story 4

- [X] T034 [US4] Aplicar multiplicador de ciclo em inimigos e boss em `frontend/src/game/config/stages.ts`
- [X] T035 [US4] Ajustar cadencia de ataque do boss por ciclo em `frontend/src/game/systems/bossAttackSystem.ts`
- [X] T036 [US4] Registrar metricas de ciclo para observabilidade em `frontend/src/lib/telemetry.ts`

**Checkpoint**: US4 funcional e testavel com simulacao de multiplos ciclos.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar qualidade, performance e documentacao apos historias concluídas.

- [X] T037 [P] Revisar contrato de eventos de progressao/drop em `specs/001-boss-phase-drops/contracts/boss-cycle-drops-openapi.yaml`
- [X] T038 Otimizar limites de entidades para manter FPS alvo em `frontend/src/game/config/performance.ts`
- [X] T039 [P] Atualizar cobertura de regressao smoke para 30 fases em `frontend/tests/e2e/us-boss-powerups-smoke.spec.ts`
- [X] T040 Executar validacao completa da feature conforme quickstart em `specs/001-boss-phase-drops/quickstart.md`
- [X] T041 [P] Atualizar notas de entrega e criterios finais em `specs/001-boss-phase-drops/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente.
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as historias.
- **Phase 3-6 (User Stories)**: dependem da conclusao da Phase 2.
- **Phase 7 (Polish)**: depende das historias que forem entregues.

### User Story Dependencies

- **US1 (P1)**: inicia apos fundacao; sem dependencia de outras historias.
- **US2 (P1)**: inicia apos fundacao; depende de US1 apenas para validar ciclo completo em fase boss.
- **US3 (P2)**: inicia apos fundacao; independente de US4.
- **US4 (P2)**: inicia apos fundacao; usa logica de ciclo de US1 para escalar dificuldade.

### Within Each User Story

- Testes primeiro (devem falhar antes da implementacao).
- Regras de dominio antes de integracao no engine/UI.
- Integracao antes de E2E final da historia.

### Suggested Delivery Order

- MVP: Phase 1 -> Phase 2 -> Phase 3 -> Phase 4.
- Incremental: adicionar Phase 5, depois Phase 6, finalizar em Phase 7.

---

## Parallel Execution Examples

### US1

- Executar em paralelo `T010` e `T011`.
- Executar `T013` e `T014` em paralelo apos testes iniciais estarem definidos.

### US2

- Executar em paralelo `T017`, `T018` e `T019`.
- Executar `T021` e `T023` em paralelo antes da integracao final em `T022`.

### US3

- Executar em paralelo `T024`, `T025` e `T026`.
- Executar `T028` e `T029` em paralelo, consolidando loop em `T030`.

### US4

- Executar `T031` e `T032` em paralelo.
- Executar `T034` e `T036` em paralelo antes do ajuste de ataque em `T035`.

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Completar Setup e Foundational.
2. Entregar US1 (padrao de fases com boss no multiplo de 10).
3. Entregar US2 (combate completo do boss com movimento e morte).
4. Validar MVP com testes unit/integration/e2e de US1 e US2.

### Incremental Delivery

1. Adicionar US3 (drops raros e tiro especial aleatorio).
2. Adicionar US4 (dificuldade crescente por ciclo).
3. Finalizar com Polish para performance, contrato e smoke de regressao.

### Parallel Team Strategy

1. Time conclui fundacao em conjunto.
2. Dev A: US1 + US2.
3. Dev B: US3.
4. Dev C: US4 + telemetria/performance.

---

## Notes

- Todas as tarefas seguem formato de checklist executavel com ID unico.
- Marcacao `[P]` indica tarefas sem conflito direto de arquivo/dependencia.
- Labels `[US1]...[US4]` permitem rastreabilidade direta com `spec.md`.
- Descricoes e handoff em pt-BR, conforme constituicao do projeto.
