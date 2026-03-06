# Implementation Plan: Progressão com Chefes e Power-ups

**Branch**: `001-boss-progression-powerups` | **Date**: 2026-03-05 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-boss-progression-powerups/spec.md`

## Summary

Expandir o loop de gameplay com chefes por fase (padrões de ataque únicos e escalonamento de ameaça), power-ups temporários (laser, míssil teleguiado, escudo), meta progressão permanente entre partidas e seleção roguelike de melhorias por run, preservando engine determinística, performance alvo de 60 FPS e cobertura de testes multi-camada.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend web)  
**Primary Dependencies**: React 18, Vite 5, Vitest 2, Playwright 1.53, Zustand, Tailwind CSS  
**Storage**: Persistência local existente via serviços de estado/persistência (IndexedDB/storage local já adotado no projeto)  
**Testing**: `vitest` (unit/integration), React Testing Library (component), `playwright` (E2E)  
**Target Platform**: Navegadores modernos com Canvas, teclado e áudio básico
**Project Type**: Aplicação web frontend única (`frontend/`)  
**Performance Goals**: Manter 60 FPS no gameplay típico; evitar degradação sustentada abaixo de 55 FPS com chefes/power-ups ativos  
**Constraints**: Não acoplar lógica de combate ao React render, manter previsibilidade do game loop, preservar acessibilidade por teclado e overlays existentes  
**Scale/Scope**: Extensão incremental do motor atual (fases, inimigos, sistemas de colisão/upgrades, HUD e testes relacionados)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **TypeScript e type-check**: PASS — stack atual em TypeScript com estratégia de typecheck já estabelecida.
- **Lint/format**: PASS — ESLint e Prettier presentes com execução em rotina de validação.
- **Estratégia de testes**: PASS — plano cobre unit (lógica de chefes/power-ups), integration (fluxos de run/progressão) e E2E (jornada principal).
- **Acessibilidade**: PASS — controles por teclado e feedback visual de efeitos temporários serão mantidos sem regressão.
- **Performance**: PASS — alvo de 60 FPS mantido com mitigação por limites de entidades/projéteis e cooldowns parametrizados.
- **Comunicação pt-BR**: PASS — documentação e handoff em português do Brasil.

### Post-Phase 1 Gate Review

- **Resultado**: PASS sem violações.
- Artefatos de design (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) descrevem solução aderente à constituição, com foco em testabilidade, separação de responsabilidades e metas de performance.

## Project Structure

### Documentation (this feature)

```text
specs/001-boss-progression-powerups/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── boss-powerups-openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── game/
│   │   ├── config/
│   │   ├── entities/
│   │   ├── systems/
│   │   ├── engine.ts
│   │   └── types.ts
│   ├── components/
│   ├── services/
│   └── state/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Structure Decision**: Manter a estrutura web existente e concentrar alterações em `frontend/src/game/` (novas regras e entidades), `frontend/src/services/` e `frontend/src/state/` (persistência/meta progressão), com validação em `frontend/tests/`.

## Phase 0: Research Scope & Outcomes

- Definir padrão de design para chefes por fase com ataques únicos e legíveis ao jogador.
- Definir modelagem de power-ups temporários com duração, conflito e expiração previsíveis.
- Definir estratégia de geração roguelike de opções por run com variação suficiente e sem ofertas inúteis sistemáticas.
- Definir persistência de upgrades permanentes entre partidas/sessões sem introduzir backend novo.
- Definir mitigação de performance para manter FPS alvo em fases avançadas com múltiplos efeitos ativos.

## Phase 1: Design Scope & Outputs

- **Data model**: entidades para chefe, padrão de ataque, run, power-up temporário, upgrade permanente e perfil de progressão.
- **Contracts**: contrato OpenAPI de referência para operações de sessão, progressão de chefe/fase, ativação/expiração de power-ups e compra de upgrades permanentes.
- **Quickstart**: roteiro de validação local dos fluxos P1/P2/P3 e critérios de sucesso.
- **Agent context**: atualização via script oficial para refletir contexto técnico atual da feature.

## Complexity Tracking

Sem violações constitucionais que demandem justificativa nesta fase.
