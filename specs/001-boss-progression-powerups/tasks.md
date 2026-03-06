# Tasks: Progressão com Chefes e Power-ups

**Input**: Artefatos de design em `/specs/001-boss-progression-powerups/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Incluídos porque a estratégia de qualidade do plano exige cobertura unitária, integração e E2E para as jornadas principais.  
**Organization**: Tarefas agrupadas por user story para implementação e validação independente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de configuração e testes para a feature.

- [X] T001 Atualizar roteiro de validação da feature em specs/001-boss-progression-powerups/quickstart.md
- [X] T002 [P] Criar fixture compartilhada de chefes/padrões em frontend/tests/fixtures/boss-fixtures.ts
- [X] T003 [P] Criar helper de seed determinística para ofertas roguelike em frontend/tests/helpers/run-seed.ts
- [X] T004 [P] Criar cenário E2E smoke da feature em frontend/tests/e2e/us-boss-powerups-smoke.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir estruturas compartilhadas que bloqueiam todas as histórias.

- [X] T005 Definir tipos de chefe, padrão e estado de encontro em frontend/src/game/types.ts
- [X] T006 Definir configurações base de chefes por fase em frontend/src/game/config/stages.ts
- [X] T007 Criar entidade de chefe e inicializadores em frontend/src/game/entities/boss.ts
- [X] T008 Definir tipos e estado de power-up temporário em frontend/src/game/types.ts
- [X] T009 Criar estado base de power-ups ativos e expiração em frontend/src/state/gameStore.ts
- [X] T010 Definir modelo de perfil de progressão permanente em frontend/src/services/shopPersistenceService.ts
- [X] T011 Integrar carregamento de perfil de progressão no início da rodada em frontend/src/game/engine.ts
- [X] T012 [P] Adicionar teste unitário de contratos de tipos fundacionais em frontend/tests/unit/foundations-boss-powerups-types.test.ts

**Checkpoint**: Base compartilhada pronta; histórias podem avançar.

---

## Phase 3: User Story 1 - Chefes por fase com padrões únicos (Priority: P1) 🎯 MVP

**Goal**: Fazer cada fase culminar em um chefe mais forte com padrões de ataque distintos.

**Independent Test**: Concluir duas fases consecutivas e validar spawn de chefe, comportamento distinto e progressão após derrota.

### Tests for User Story 1

- [X] T013 [P] [US1] Criar teste unitário de seleção de padrão de ataque de chefe em frontend/tests/unit/us1-boss-pattern-selection.test.ts
- [X] T014 [P] [US1] Criar teste unitário de escalonamento de atributos do chefe por fase em frontend/tests/unit/us1-boss-scaling.test.ts
- [X] T015 [P] [US1] Criar teste de integração de transição fase→chefe→próxima fase em frontend/tests/integration/us1-boss-stage-flow.test.tsx
- [X] T016 [P] [US1] Criar teste E2E de derrota de chefe e avanço de fase em frontend/tests/e2e/us1-boss-progression.spec.ts

### Implementation for User Story 1

- [X] T017 [P] [US1] Implementar estado e ciclo de vida do encontro de chefe em frontend/src/game/systems/bossSystem.ts
- [X] T018 [P] [US1] Implementar executor de padrões de ataque do chefe em frontend/src/game/systems/bossAttackSystem.ts
- [X] T019 [US1] Integrar spawn de chefe ao fim da fase em frontend/src/game/systems/progressionSystem.ts
- [X] T020 [US1] Integrar atualização/renderização de chefe no loop principal em frontend/src/game/engine.ts
- [X] T021 [US1] Aplicar dano, derrota e recompensa de pontuação do chefe em frontend/src/game/systems/scoreLivesSystem.ts
- [X] T022 [US1] Exibir feedback de encontro e vida do chefe na HUD em frontend/src/components/HUD.tsx

**Checkpoint**: US1 funcional e validável isoladamente.

---

## Phase 4: User Story 2 - Power-ups temporários em partida (Priority: P2)

**Goal**: Ativar laser, míssil teleguiado e escudo com duração definida e regra de conflito clara.

**Independent Test**: Em uma run, ativar os três power-ups, validar efeito ativo, expiração e retorno ao estado base.

### Tests for User Story 2

- [X] T023 [P] [US2] Criar teste unitário de duração/expiração de power-ups em frontend/tests/unit/us2-powerup-duration-expiration.test.ts
- [X] T024 [P] [US2] Criar teste unitário de conflito entre power-ups de arma em frontend/tests/unit/us2-powerup-conflict-resolution.test.ts
- [X] T025 [P] [US2] Criar teste de integração de efeito de escudo sobre dano recebido em frontend/tests/integration/us2-shield-damage-mitigation.test.tsx
- [X] T026 [P] [US2] Criar teste E2E de ativação e expiração de power-ups em frontend/tests/e2e/us2-powerups-lifecycle.spec.ts

### Implementation for User Story 2

- [X] T027 [P] [US2] Implementar catálogo e regras de power-ups temporários em frontend/src/game/config/powerups.ts
- [X] T028 [P] [US2] Implementar sistema de ativação/expiração de power-ups em frontend/src/game/systems/powerUpSystem.ts
- [X] T029 [US2] Implementar disparo laser e míssil teleguiado no sistema de projéteis em frontend/src/game/entities/projectile.ts
- [X] T030 [US2] Aplicar mitigação de dano com escudo na colisão inimiga em frontend/src/game/systems/collisionSystem.ts
- [X] T031 [US2] Integrar coleta/aplicação de power-ups no loop da partida em frontend/src/game/engine.ts
- [X] T032 [US2] Exibir status e timer de power-ups ativos na interface em frontend/src/components/GameOverlay.tsx

**Checkpoint**: US2 funcional sem depender de US3.

---

## Phase 5: User Story 3 - Evolução permanente e variação roguelike (Priority: P3)

**Goal**: Persistir upgrades permanentes entre partidas e variar ofertas de melhorias por run.

**Independent Test**: Comprar upgrade, reiniciar partida e confirmar persistência; executar múltiplas runs e validar variação de ofertas.

### Tests for User Story 3

- [X] T033 [P] [US3] Criar teste unitário de incremento e limite de upgrade permanente em frontend/tests/unit/us3-permanent-upgrade-leveling.test.ts
- [X] T034 [P] [US3] Criar teste unitário de geração de ofertas roguelike com opção aplicável em frontend/tests/unit/us3-roguelike-offer-generation.test.ts
- [X] T035 [P] [US3] Criar teste de integração de persistência entre partidas em frontend/tests/integration/us3-permanent-upgrade-persistence.test.ts
- [X] T036 [P] [US3] Criar teste E2E de variação de ofertas entre runs em frontend/tests/e2e/us3-roguelike-variation.spec.ts

### Implementation for User Story 3

- [X] T037 [P] [US3] Implementar regra de compra e aplicação de upgrade permanente em frontend/src/services/shopService.ts
- [X] T038 [P] [US3] Implementar persistência de perfil de progressão em frontend/src/services/shopPersistenceService.ts
- [X] T039 [US3] Implementar gerador de ofertas roguelike por run em frontend/src/game/systems/runModifierSystem.ts
- [X] T040 [US3] Integrar seleção de ofertas no fluxo de progressão/loja em frontend/src/game/systems/progressionSystem.ts
- [X] T041 [US3] Exibir níveis permanentes e ofertas de run na loja em frontend/src/components/ShopScreen.tsx
- [X] T042 [US3] Persistir e restaurar estado de progressão no estado global em frontend/src/state/gameStore.ts

**Checkpoint**: US3 funcional e validável de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar qualidade, performance e documentação final.

- [X] T043 [P] Atualizar contrato da feature com campos finais implementados em specs/001-boss-progression-powerups/contracts/boss-powerups-openapi.yaml
- [X] T044 [P] Atualizar documentação de comportamento final em specs/001-boss-progression-powerups/spec.md
- [X] T045 [P] Adicionar medição de FPS para encontros de chefe em frontend/src/game/perf/fpsProbe.ts
- [X] T046 Ajustar limites de projéteis/efeitos para meta de desempenho em frontend/src/game/systems/performanceAdaptation.ts
- [X] T047 Executar validação completa do quickstart em specs/001-boss-progression-powerups/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente.
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia histórias.
- **Phase 3/4/5 (User Stories)**: dependem da conclusão da Phase 2.
- **Phase 6 (Polish)**: depende das histórias desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: começa após Foundational; sem dependência de US2/US3.
- **US2 (P2)**: começa após Foundational; independente de US3.
- **US3 (P3)**: começa após Foundational; pode reutilizar componentes de US2, mas é validável isoladamente.

### Within Each User Story

- Testes primeiro (falhando), depois implementação.
- Config/tipos antes de sistemas.
- Sistemas antes de integração em engine/UI.
- Fechar checkpoint da história antes de avançar prioridade.

### Parallel Opportunities

- **Setup**: T002, T003 e T004 em paralelo.
- **Foundational**: T005/T006/T007 e T008/T009 podem avançar em paralelo; T012 em paralelo após definição de tipos.
- **US1**: T013-T016 em paralelo; T017 e T018 em paralelo.
- **US2**: T023-T026 em paralelo; T027 e T028 em paralelo.
- **US3**: T033-T036 em paralelo; T037 e T038 em paralelo.
- **Polish**: T043, T044 e T045 em paralelo.

---

## Parallel Example: User Story 1

```bash
# Testes US1 em paralelo
T013 frontend/tests/unit/us1-boss-pattern-selection.test.ts
T014 frontend/tests/unit/us1-boss-scaling.test.ts
T015 frontend/tests/integration/us1-boss-stage-flow.test.tsx
T016 frontend/tests/e2e/us1-boss-progression.spec.ts

# Implementação inicial US1 em paralelo
T017 frontend/src/game/systems/bossSystem.ts
T018 frontend/src/game/systems/bossAttackSystem.ts
```

## Parallel Example: User Story 2

```bash
# Testes US2 em paralelo
T023 frontend/tests/unit/us2-powerup-duration-expiration.test.ts
T024 frontend/tests/unit/us2-powerup-conflict-resolution.test.ts
T025 frontend/tests/integration/us2-shield-damage-mitigation.test.tsx
T026 frontend/tests/e2e/us2-powerups-lifecycle.spec.ts

# Implementação inicial US2 em paralelo
T027 frontend/src/game/config/powerups.ts
T028 frontend/src/game/systems/powerUpSystem.ts
```

## Parallel Example: User Story 3

```bash
# Testes US3 em paralelo
T033 frontend/tests/unit/us3-permanent-upgrade-leveling.test.ts
T034 frontend/tests/unit/us3-roguelike-offer-generation.test.ts
T035 frontend/tests/integration/us3-permanent-upgrade-persistence.test.ts
T036 frontend/tests/e2e/us3-roguelike-variation.spec.ts

# Implementação inicial US3 em paralelo
T037 frontend/src/services/shopService.ts
T038 frontend/src/services/shopPersistenceService.ts
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2.
2. Entregar US1 completa (T013-T022).
3. Validar US1 isoladamente (unit + integration + E2E).
4. Demonstrar MVP com progressão de fase baseada em chefe.

### Incremental Delivery

1. Base pronta (Setup + Foundational).
2. Entregar US1 e validar independentemente.
3. Entregar US2 e validar ciclo de power-ups.
4. Entregar US3 e validar persistência + roguelike.
5. Consolidar Phase 6 para performance/documentação final.

### Parallel Team Strategy

1. Time conclui Setup + Foundational.
2. Após desbloqueio:
   - Dev A: trilha US1 (chefes e padrões de ataque).
   - Dev B: trilha US2 (power-ups temporários e conflito).
   - Dev C: trilha US3 (persistência permanente e ofertas roguelike).
3. Integrar em checkpoints por história e fechar Polish.
