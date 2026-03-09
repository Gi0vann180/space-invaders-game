# Codebase Structure

**Analysis Date:** 2026-03-09

## Directory Layout

```text
[project-root]/
├── frontend/             # Aplicacao React + engine Canvas + testes
├── specs/                # Especificacoes por feature, com plano, pesquisa e contratos
├── .github/              # Prompts, skills, agents e instructions do workflow
├── .gsd/                 # Templates e artefatos do fluxo GSD
├── .planning/            # Mapas de codebase ja gerados para planejamento
├── package.json          # Scripts raiz que delegam para frontend/
└── package-lock.json     # Lockfile da raiz
```

## Directory Purposes

**frontend/:**
- Purpose: pacote executavel principal do projeto.
- Contains: `package.json`, configs de Vite/Vitest/Playwright/Tailwind e todo o runtime em `frontend/src/`.
- Key files: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/vitest.config.ts`, `frontend/playwright.config.ts`.

**frontend/src/:**
- Purpose: codigo-fonte da aplicacao e do jogo.
- Contains: root React, componentes, stores, servicos, bibliotecas e modulos de engine.
- Key files: `frontend/src/main.tsx`, `frontend/src/App.tsx`.

**frontend/src/components/:**
- Purpose: UI declarativa fora do canvas.
- Contains: `HUD.tsx`, `GameOverlay.tsx`, `SettingsPanel.tsx`, `ShopScreen.tsx`.
- Key files: `frontend/src/components/GameOverlay.tsx`, `frontend/src/components/ShopScreen.tsx`.

**frontend/src/game/:**
- Purpose: runtime da engine e regras de gameplay.
- Contains: `engine.ts`, `loop.ts`, `types.ts` e subpastas especializadas.
- Key files: `frontend/src/game/engine.ts`, `frontend/src/game/loop.ts`, `frontend/src/game/types.ts`.

**frontend/src/game/config/:**
- Purpose: constantes e configuracoes de progressao, performance e fases.
- Contains: `gameplay.ts`, `performance.ts`, `powerups.ts`, `stages.ts`.
- Key files: `frontend/src/game/config/gameplay.ts`, `frontend/src/game/config/stages.ts`.

**frontend/src/game/entities/:**
- Purpose: entidades e operacoes locais de movimento/criacao.
- Contains: `player.ts`, `enemy.ts`, `boss.ts`, `projectile.ts`, `powerUp.ts`, `dropItem.ts`.
- Key files: `frontend/src/game/entities/player.ts`, `frontend/src/game/entities/projectile.ts`.

**frontend/src/game/systems/:**
- Purpose: regras de dominio separadas por concern.
- Contains: colisao, boss, ataques, progressao, drops, upgrades, pontuacao, ondas e modificadores de run.
- Key files: `frontend/src/game/systems/collisionSystem.ts`, `frontend/src/game/systems/progressionSystem.ts`, `frontend/src/game/systems/waveSystem.ts`.

**frontend/src/game/input/:**
- Purpose: adaptadores de entrada.
- Contains: `inputManager.ts`, `keyboard.ts`, `touch.ts`, `gamepad.ts`.
- Key files: `frontend/src/game/input/inputManager.ts`.

**frontend/src/services/:**
- Purpose: logica de persistencia e servicos de aplicacao fora da simulacao frame a frame.
- Contains: settings, upgrades, high score, leaderboard e audio.
- Key files: `frontend/src/services/settingsService.ts`, `frontend/src/services/shopPersistenceService.ts`, `frontend/src/services/shopService.ts`, `frontend/src/services/highscoreService.ts`.

**frontend/src/lib/:**
- Purpose: utilitarios de infraestrutura do browser.
- Contains: IndexedDB e telemetria.
- Key files: `frontend/src/lib/indexedDb.ts`, `frontend/src/lib/telemetry.ts`.

**frontend/src/state/:**
- Purpose: stores observaveis compartilhados entre React e engine.
- Contains: `gameStore.ts`, `settingsStore.ts`.
- Key files: `frontend/src/state/gameStore.ts`, `frontend/src/state/settingsStore.ts`.

**frontend/tests/:**
- Purpose: testes automatizados fora do bundle de runtime.
- Contains: `unit/`, `integration/`, `e2e/`, `fixtures/`, `helpers/`.
- Key files: `frontend/tests/integration/us1-round-flow.test.tsx`, `frontend/tests/e2e/us1-round.spec.ts`.

**specs/:**
- Purpose: artefatos de especificacao por fase/feature.
- Contains: `spec.md`, `plan.md`, `research.md`, `tasks.md`, `data-model.md`, `contracts/`, `checklists/`.
- Key files: `specs/001-space-invaders-modern-ui/spec.md`, `specs/001-boss-phase-drops/plan.md`.

## Key File Locations

**Entry Points:**
- `package.json`: comandos da raiz delegando para `frontend/`.
- `frontend/src/main.tsx`: bootstrap React.
- `frontend/src/App.tsx`: composicao da tela principal e hospedagem do canvas.
- `frontend/src/game/engine.ts`: controle do ciclo de vida do jogo.

**Configuration:**
- `frontend/vite.config.ts`: bundling e dev server.
- `frontend/vitest.config.ts`: testes unitarios e de integracao.
- `frontend/playwright.config.ts`: testes E2E.
- `frontend/tsconfig.json`: TypeScript do pacote frontend.
- `frontend/tailwind.config.cjs`: tokens e escopo do Tailwind.

**Core Logic:**
- `frontend/src/game/`: engine e dominio de gameplay.
- `frontend/src/services/`: persistencia e regras de loja/configuracao.
- `frontend/src/state/`: contrato de estado entre UI e engine.

**Testing:**
- `frontend/tests/unit/`: regras puras e calculos.
- `frontend/tests/integration/`: fluxo React + store + engine.
- `frontend/tests/e2e/`: jornadas de usuario com Playwright.
- `frontend/src/test/setup.ts`: setup compartilhado de testes.

## Naming Conventions

**Files:**
- Componentes React usam PascalCase: `App.tsx`, `HUD.tsx`, `GameOverlay.tsx`, `ShopScreen.tsx`.
- Modulos de engine, servicos, hooks e stores usam camelCase: `engine.ts`, `gameStore.ts`, `shopPersistenceService.ts`, `useVisibilityPause.ts`.
- Testes seguem sufixos `.test.ts`, `.test.tsx` e `.spec.ts` com prefixos de user story, por exemplo `us1-round-flow.test.tsx`.

**Directories:**
- Pastas funcionais e curtas em minusculas: `components`, `services`, `state`, `game`, `systems`, `entities`.
- O agrupamento principal e por responsabilidade tecnica, nao por feature vertical.

## Where to Add New Code

**New Feature in gameplay:**
- Primary code: `frontend/src/game/systems/` quando for regra de negocio frame a frame.
- Supporting entities/config: `frontend/src/game/entities/` ou `frontend/src/game/config/`.
- UI projection: `frontend/src/components/` e `frontend/src/App.tsx` se precisar refletir no HUD, overlay ou shop.
- Tests: `frontend/tests/unit/` para regra pura, `frontend/tests/integration/` para fluxo React+engine, `frontend/tests/e2e/` para comportamento do usuario.

**New Component/Module:**
- Implementacao visual: `frontend/src/components/`.
- Hook reutilizavel: `frontend/src/hooks/`.
- Persistencia ou integracao com browser API: `frontend/src/services/` ou `frontend/src/lib/`.

**Utilities:**
- Shared helpers de infraestrutura: `frontend/src/lib/`.
- Estado compartilhado e contratos serializaveis: `frontend/src/state/` e `frontend/src/game/types.ts`.

## Special Directories

**.github/:**
- Purpose: automacao do fluxo Copilot/GSD.
- Generated: No.
- Committed: Yes.

**.gsd/:**
- Purpose: templates e artefatos do processo de planejamento.
- Generated: Partially.
- Committed: Yes.

**.planning/:**
- Purpose: documentacao derivada do mapeamento do codebase.
- Generated: Yes.
- Committed: Yes.

**specs/:**
- Purpose: memoria de produto e implementacao por iniciativa.
- Generated: Partially.
- Committed: Yes.

---

*Structure analysis: 2026-03-09*
