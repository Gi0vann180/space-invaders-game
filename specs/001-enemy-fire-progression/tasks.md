# Tasks: Inimigos com Tiro e Progressão de Fase

**Input**: Artefatos de design em `/specs/001-enemy-fire-progression/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de testes e configuração para suportar as três histórias.

- [X] T001 Atualizar cenários de validação da feature em specs/001-enemy-fire-progression/quickstart.md
- [X] T002 [P] Criar suíte E2E para disparo inimigo em frontend/tests/e2e/us1-enemy-fire.spec.ts
- [X] T003 [P] Criar suíte E2E para progressão de dificuldade em frontend/tests/e2e/us2-difficulty-scaling.spec.ts
- [X] T004 [P] Criar suíte E2E para upgrade até nível 10 em frontend/tests/e2e/us3-upgrade-level-cap.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir contratos internos e limites compartilhados por todas as histórias.

- [X] T005 Definir tipos de estado para tiro inimigo e progressão em frontend/src/game/types.ts
- [X] T006 Definir constantes globais de limite de upgrades (MAX_LEVEL=10) em frontend/src/game/systems/upgradeSystem.ts
- [X] T007 Definir curva base monotônica de dificuldade por fase em frontend/src/game/config/stages.ts
- [X] T008 Integrar parâmetros compartilhados no loop principal em frontend/src/game/engine.ts
- [X] T009 [P] Cobrir tipos/constantes fundacionais em frontend/tests/unit/foundations-progression-types.test.ts

**Checkpoint**: Base compartilhada pronta; histórias podem ser implementadas em paralelo.

---

## Phase 3: User Story 1 - Inimigos também atiram (Priority: P1) 🎯 MVP

**Goal**: Garantir que inimigos vivos disparem projéteis e que esses projéteis causem dano no jogador.

**Independent Test**: Iniciar rodada e verificar disparo recorrente de inimigos vivos, com perda de vida ao colidir e ausência de disparo de inimigo destruído.

### Tests for User Story 1

- [X] T010 [P] [US1] Criar teste unitário de cadência e elegibilidade de disparo em frontend/tests/unit/us1-enemy-fire-rate.test.ts
- [X] T011 [P] [US1] Criar teste unitário de bloqueio de disparo para inimigo morto em frontend/tests/unit/us1-dead-enemy-no-fire.test.ts
- [X] T012 [P] [US1] Criar teste de integração de colisão projétil inimigo vs jogador em frontend/tests/integration/us1-enemy-projectile-collision.test.tsx

### Implementation for User Story 1

- [X] T013 [P] [US1] Implementar estado e cooldown de disparo inimigo em frontend/src/game/entities/enemy.ts
- [X] T014 [P] [US1] Implementar criação e atualização de projétil inimigo em frontend/src/game/entities/projectile.ts
- [X] T015 [US1] Implementar emissão de disparos inimigos por tick em frontend/src/game/systems/waveSystem.ts
- [X] T016 [US1] Aplicar dano ao jogador por projétil inimigo em frontend/src/game/systems/collisionSystem.ts
- [X] T017 [US1] Sincronizar pontuação/vidas após dano por tiro inimigo em frontend/src/game/systems/scoreLivesSystem.ts

**Checkpoint**: US1 funcional e validável isoladamente.

---

## Phase 4: User Story 2 - Fases progressivamente mais difíceis (Priority: P2)

**Goal**: Garantir aumento monotônico de dificuldade a cada fase concluída.

**Independent Test**: Completar fases consecutivas e comprovar aumento de parâmetros ofensivos entre fase N e N+1 sem regressão de dificuldade.

### Tests for User Story 2

- [X] T018 [P] [US2] Criar teste unitário de monotonicidade da dificuldade por fase em frontend/tests/unit/us2-phase-difficulty-monotonic.test.ts
- [X] T019 [P] [US2] Criar teste de integração de transição de fase com nova dificuldade em frontend/tests/integration/us2-phase-transition-difficulty.test.tsx
- [X] T020 [P] [US2] Criar teste de integração de pressão ofensiva crescente em frontend/tests/integration/us2-offensive-pressure-scaling.test.tsx

### Implementation for User Story 2

- [X] T021 [P] [US2] Implementar multiplicadores de dificuldade por fase em frontend/src/game/config/stages.ts
- [X] T022 [US2] Aplicar progressão de dificuldade na virada de fase em frontend/src/game/systems/progressionSystem.ts
- [X] T023 [US2] Escalar taxa/velocidade/limite de disparos inimigos por fase em frontend/src/game/systems/waveSystem.ts
- [X] T024 [US2] Ajustar adaptação de desempenho para fases avançadas em frontend/src/game/systems/performanceAdaptation.ts

**Checkpoint**: US2 funcional e testável sem depender de US3.

---

## Phase 5: User Story 3 - Melhorias evoluem até nível 10 (Priority: P3)

**Goal**: Permitir compras repetidas da mesma melhoria com incremento de +1 até nível máximo 10.

**Independent Test**: Comprar repetidamente a mesma melhoria, validar progressão 1..10, confirmar bloqueio no nível 10 e persistência correta.

### Tests for User Story 3

- [X] T025 [P] [US3] Criar teste unitário de incremento +1 por compra em frontend/tests/unit/us3-upgrade-increment.test.ts
- [X] T026 [P] [US3] Criar teste unitário de bloqueio no nível máximo 10 em frontend/tests/unit/us3-upgrade-cap-level10.test.ts
- [X] T027 [P] [US3] Criar teste de integração de persistência de nível de melhoria em frontend/tests/integration/us3-upgrade-level-persistence.test.ts

### Implementation for User Story 3

- [X] T028 [P] [US3] Implementar regra de progressão 1..10 por melhoria em frontend/src/game/systems/upgradeSystem.ts
- [X] T029 [US3] Aplicar cálculo de efeito escalável por nível em frontend/src/game/systems/powerUpSystem.ts
- [X] T030 [US3] Atualizar regras de compra com bloqueio em nível 10 em frontend/src/services/shopService.ts
- [X] T031 [US3] Persistir e restaurar nível de melhoria no armazenamento local em frontend/src/services/shopPersistenceService.ts
- [X] T032 [US3] Refletir nível atual e status de máximo atingido na interface da loja em frontend/src/components/ShopScreen.tsx

**Checkpoint**: US3 funcional e validável de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar qualidade, contrato e validação final da feature.

- [X] T033 [P] Atualizar documentação de comportamento de progressão em specs/001-enemy-fire-progression/spec.md
- [X] T034 [P] Validar alinhamento do contrato com o comportamento implementado em specs/001-enemy-fire-progression/contracts/gameplay-progression-openapi.yaml
- [X] T035 Executar roteiro de validação final da feature em specs/001-enemy-fire-progression/quickstart.md
- [ ] T036 Consolidar resultado de playtest da métrica SC-005 (percepção >=90%) em specs/001-enemy-fire-progression/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sem dependências.
- **Phase 2 (Foundational)**: depende da conclusão da Phase 1 e bloqueia histórias.
- **Phase 3/4/5 (User Stories)**: dependem da conclusão da Phase 2; podem seguir em paralelo por equipe.
- **Phase 6 (Polish)**: depende da conclusão das histórias desejadas.

### User Story Dependencies

- **US1 (P1)**: começa após Foundational; não depende de US2/US3.
- **US2 (P2)**: começa após Foundational; é independentemente testável com progressão monotônica de dificuldade por fase.
- **US3 (P3)**: começa após Foundational; independente de US2, integra com serviços de loja existentes.

### Within Each User Story

- Testes primeiro (falhando), depois implementação.
- Entidades/configurações antes dos sistemas.
- Sistemas antes de integração em serviço/UI.
- Fechar checkpoint da história antes de avançar prioridade.

### Parallel Opportunities

- T002, T003, T004 podem rodar em paralelo.
- T009 pode rodar em paralelo com T008 após T005-T007.
- Em US1: T010, T011, T012 e T013, T014 podem rodar em paralelo.
- Em US2: T018, T019, T020 e T021 podem rodar em paralelo.
- Em US3: T025, T026, T027 e T028 podem rodar em paralelo.
- Em Polish: T033 e T034 podem rodar em paralelo.

---

## Parallel Example: User Story 1

```bash
# Testes em paralelo (US1)
T010 frontend/tests/unit/us1-enemy-fire-rate.test.ts
T011 frontend/tests/unit/us1-dead-enemy-no-fire.test.ts
T012 frontend/tests/integration/us1-enemy-projectile-collision.test.tsx

# Implementação em paralelo (US1)
T013 frontend/src/game/entities/enemy.ts
T014 frontend/src/game/entities/projectile.ts
```

## Parallel Example: User Story 2

```bash
# Testes em paralelo (US2)
T018 frontend/tests/unit/us2-phase-difficulty-monotonic.test.ts
T019 frontend/tests/integration/us2-phase-transition-difficulty.test.tsx
T020 frontend/tests/integration/us2-offensive-pressure-scaling.test.tsx

# Implementação paralela inicial (US2)
T021 frontend/src/game/config/stages.ts
```

## Parallel Example: User Story 3

```bash
# Testes em paralelo (US3)
T025 frontend/tests/unit/us3-upgrade-increment.test.ts
T026 frontend/tests/unit/us3-upgrade-cap-level10.test.ts
T027 frontend/tests/integration/us3-upgrade-level-persistence.test.ts

# Implementação paralela inicial (US3)
T028 frontend/src/game/systems/upgradeSystem.ts
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2.
2. Entregar US1 completa (T010-T017).
3. Validar isoladamente com testes de US1 e E2E de tiro inimigo.

### Incremental Delivery

1. Base pronta (Setup + Foundational).
2. Entregar US1 (MVP jogável).
3. Entregar US2 (progressão de dificuldade).
4. Entregar US3 (upgrade até nível 10).
5. Consolidar polish e validação final.

### Parallel Team Strategy

1. Pessoa A: trilha US1 (engine + colisão).
2. Pessoa B: trilha US2 (config de fases + progressão).
3. Pessoa C: trilha US3 (upgrade + shop + persistência).
4. Integração final conjunta na Phase 6.
