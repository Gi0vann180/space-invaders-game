# Tasks: Space Invaders — Modern UI

**Input**: Design documents from `/specs/001-space-invaders-modern-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/leaderboard-openapi.yaml, quickstart.md

**Tests**: Incluídos porque a especificação exige estratégia de testes para gameplay, integração e fluxos principais.

**Organization**: Tarefas agrupadas por história de usuário para implementação e validação independentes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar toolchain, qualidade e base de testes do frontend.

- [X] T001 Atualizar dependências e scripts de qualidade/testes em frontend/package.json
- [X] T002 Configurar lint/format com ESLint + Prettier em frontend/.eslintrc.cjs e frontend/.prettierrc
- [X] T003 [P] Configurar Vitest + React Testing Library em frontend/vitest.config.ts e frontend/src/test/setup.ts
- [X] T004 [P] Configurar Playwright para smoke E2E em frontend/playwright.config.ts
- [X] T005 [P] Criar estrutura base de módulos em frontend/src/game/{entities,systems,input,config,perf} e frontend/src/services
- [X] T006 Configurar verificação de tipos e scripts de validação (`typecheck`, `lint`, `test`) em frontend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura central que bloqueia todas as histórias.

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase.

- [X] T007 Definir tipos de domínio compartilhados em frontend/src/game/types.ts
- [X] T008 [P] Implementar game loop determinístico com delta time em frontend/src/game/loop.ts
- [X] T009 [P] Implementar adaptadores de input (teclado/touch/gamepad) em frontend/src/game/input/{keyboard.ts,touch.ts,gamepad.ts}
- [X] T010 Implementar reconciliador de input unificado em frontend/src/game/input/inputManager.ts
- [X] T011 [P] Implementar camada IndexedDB (highscore, upgrades, settings, telemetria local) em frontend/src/lib/indexedDb.ts
- [X] T012 Implementar logger de eventos locais com guarda de consentimento em frontend/src/lib/telemetry.ts
- [X] T013 [P] Criar store global de sessão/partida em frontend/src/state/gameStore.ts
- [X] T014 Implementar pausa automática por visibilidade de aba em frontend/src/hooks/useVisibilityPause.ts
- [X] T015 Criar shell inicial de HUD responsivo em frontend/src/components/HUD.tsx

**Checkpoint**: Base pronta para implementar histórias de usuário.

---

## Phase 3: User Story 1 - Jogar uma rodada (Priority: P1) 🎯 MVP

**Goal**: Entregar gameplay central (movimento, tiro, colisão, pontuação, vidas e game over).

**Independent Test**: Iniciar jogo, mover nave, eliminar 1 inimigo, validar aumento de pontuação, perder vidas até game over e reiniciar.

### Tests for User Story 1

- [X] T016 [P] [US1] Criar testes unitários de movimento/tiro/colisão em frontend/tests/unit/us1-core-gameplay.test.ts
- [X] T017 [P] [US1] Criar teste de integração do fluxo rodada->game over->restart em frontend/tests/integration/us1-round-flow.test.tsx
- [X] T018 [P] [US1] Criar smoke E2E de gameplay básico em frontend/tests/e2e/us1-round.spec.ts

### Implementation for User Story 1

- [X] T019 [P] [US1] Implementar entidades Player/Enemy/Projectile em frontend/src/game/entities/{player.ts,enemy.ts,projectile.ts}
- [X] T020 [P] [US1] Implementar sistema de colisão entre entidades em frontend/src/game/systems/collisionSystem.ts
- [X] T021 [P] [US1] Implementar sistema de pontuação e vidas em frontend/src/game/systems/scoreLivesSystem.ts
- [X] T022 [US1] Implementar sistema de onda base e condições de vitória/derrota em frontend/src/game/systems/waveSystem.ts
- [X] T023 [US1] Integrar sistemas no orquestrador principal em frontend/src/game/engine.ts
- [X] T024 [US1] Implementar overlay de início/pausa/game over em frontend/src/components/GameOverlay.tsx
- [X] T025 [US1] Persistir highscore local ao final da partida em frontend/src/services/highscoreService.ts
- [X] T026 [US1] Integrar HUD e loop de rodada no container principal em frontend/src/App.tsx

**Checkpoint**: US1 funcional e validável isoladamente (MVP jogável).

---

## Phase 4: User Story 2 - Progressão e power-ups (Priority: P2)

**Goal**: Entregar progressão por fases, loja entre fases e power-ups temporários com regras de coexistência/renovação.

**Independent Test**: Completar fase, abrir loja, comprar upgrade, iniciar próxima fase com efeito visível; coletar power-up e validar duração/expiração.

### Tests for User Story 2

- [X] T027 [P] [US2] Criar teste unitário de coexistência e refresh de power-ups em frontend/tests/unit/us2-powerup-stacking.test.ts
- [X] T028 [P] [US2] Criar teste de integração de progressão e loja entre fases em frontend/tests/integration/us2-progression-shop.test.tsx
- [X] T029 [P] [US2] Criar teste de persistência de compras em IndexedDB em frontend/tests/integration/us2-shop-persistence.test.ts

### Implementation for User Story 2

- [X] T030 [P] [US2] Implementar entidade e timer de PowerUp em frontend/src/game/entities/powerUp.ts
- [X] T031 [P] [US2] Implementar sistema de power-ups (coexistência por tipo e refresh do mesmo tipo) em frontend/src/game/systems/powerUpSystem.ts
- [X] T032 [P] [US2] Definir configuração de fases e curva de dificuldade em frontend/src/game/config/stages.ts
- [X] T033 [US2] Implementar controlador de progressão de ondas/fases em frontend/src/game/systems/progressionSystem.ts
- [X] T034 [P] [US2] Implementar catálogo e regras da loja em frontend/src/services/shopService.ts
- [X] T035 [US2] Implementar persistência de upgrades comprados em frontend/src/services/shopPersistenceService.ts
- [X] T036 [US2] Construir tela de progressão/loja entre fases em frontend/src/components/ShopScreen.tsx
- [X] T037 [US2] Aplicar upgrades persistidos no início da fase em frontend/src/game/systems/upgradeSystem.ts
- [X] T038 [US2] Integrar fluxo fase->loja->próxima fase em frontend/src/App.tsx

**Checkpoint**: US2 funcional e validável sem depender de US3.

---

## Phase 5: User Story 3 - Experiência e configurações (Priority: P3)

**Goal**: Entregar configurações de acessibilidade/áudio/sensibilidade, suporte robusto a inputs e política de telemetria com opt-in.

**Independent Test**: Alterar áudio e contraste nas configurações, retornar ao jogo e validar comportamento; testar teclado/touch/gamepad com reconciliação correta.

### Tests for User Story 3

- [X] T039 [P] [US3] Criar testes de componente para painel de configurações em frontend/tests/integration/us3-settings-panel.test.tsx
- [X] T040 [P] [US3] Criar teste E2E de inputs (teclado/touch/gamepad) e alto contraste em frontend/tests/e2e/us3-inputs-a11y.spec.ts
- [X] T041 [P] [US3] Criar teste de consentimento de telemetria (opt-in) em frontend/tests/unit/us3-telemetry-consent.test.ts

### Implementation for User Story 3

- [X] T042 [P] [US3] Implementar store de configurações (áudio, vibração, sensibilidade, contraste, captions, consentimento) em frontend/src/state/settingsStore.ts
- [X] T043 [P] [US3] Implementar serviço de áudio/vibração com fallback de suporte em frontend/src/services/audioService.ts
- [X] T044 [US3] Implementar painel de configurações com controles de acessibilidade em frontend/src/components/SettingsPanel.tsx
- [X] T045 [US3] Aplicar modo alto contraste e captions na UI em frontend/src/styles/index.css e frontend/src/components/HUD.tsx
- [X] T046 [US3] Refinar reconciliação de input simultâneo em frontend/src/game/input/inputManager.ts
- [X] T047 [US3] Persistir preferências e consentimento no IndexedDB em frontend/src/services/settingsService.ts
- [X] T048 [US3] Implementar cliente opcional de leaderboard conforme contrato em frontend/src/services/leaderboardApi.ts
- [X] T049 [US3] Sincronizar highscore remoto somente com opt-in explícito em frontend/src/services/highscoreSyncService.ts

**Checkpoint**: US3 funcional e validável sem quebrar US1/US2.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias transversais de performance, qualidade e documentação.

- [X] T050 [P] Implementar sonda de FPS em dev para meta adaptativa em frontend/src/game/perf/fpsProbe.ts
- [X] T051 Implementar mitigação de performance (degradação 60->30 FPS) em frontend/src/game/systems/performanceAdaptation.ts
- [X] T052 [P] Endurecer privacidade (sanitização + bloqueio de upload sem consentimento) em frontend/src/services/privacyGuard.ts
- [X] T053 [P] Atualizar guia de execução e validação em specs/001-space-invaders-modern-ui/quickstart.md
- [X] T054 Atualizar checklist de cobertura de requisitos em specs/001-space-invaders-modern-ui/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sem dependências
- Foundational (Phase 2): depende de Setup; bloqueia todas as histórias
- User Stories (Phases 3-5): dependem de Foundational
- Polish (Phase 6): depende das histórias concluídas

### User Story Dependencies

- US1 (P1): inicia após Phase 2, sem dependência de outras histórias
- US2 (P2): inicia após Phase 2, reutiliza base de gameplay da US1
- US3 (P3): inicia após Phase 2, pode avançar em paralelo com US2

### Dependency Graph

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- Paralelo recomendado após Phase 2: trilhas de US2 e US3 em equipe separada

---

## Parallel Execution Examples

### User Story 1

- Rodar em paralelo: T016, T017, T018
- Rodar em paralelo: T019, T020, T021

### User Story 2

- Rodar em paralelo: T027, T028, T029
- Rodar em paralelo: T030, T031, T032, T034

### User Story 3

- Rodar em paralelo: T039, T040, T041
- Rodar em paralelo: T042, T043

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2
2. Concluir US1 (Phase 3)
3. Validar critérios independentes da US1
4. Demonstrar MVP jogável

### Incremental Delivery

1. Base pronta (Phases 1-2)
2. Entregar US1 e validar
3. Entregar US2 e validar
4. Entregar US3 e validar
5. Aplicar ajustes finais (Phase 6)
