# Implementation Plan: Inimigos com Tiro e Progressão de Fase

**Branch**: `001-enemy-fire-progression` | **Date**: 2026-03-05 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-enemy-fire-progression/spec.md`

## Summary

Adicionar disparos inimigos, escalonamento de dificuldade por fase e progressão de melhorias até nível 10, preservando loop determinístico de jogo e separação entre lógica de engine e UI React. A implementação será concentrada em sistemas de jogo (`wave`, `progression`, `upgrade`) com cobertura de testes unitários, integração e E2E para garantir regressão controlada.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend web)  
**Primary Dependencies**: React 18, Vite 5, Vitest 2, Playwright 1.53, Testing Library, Zustand (estado), Tailwind CSS  
**Storage**: Persistência local existente (IndexedDB/local storage via serviços já presentes); sem novo banco  
**Testing**: `vitest` (unit/integration), React Testing Library (component), `playwright` (E2E)  
**Target Platform**: Navegadores modernos desktop/mobile com suporte a Canvas e teclado
**Project Type**: Aplicação web frontend única (`frontend/`)  
**Performance Goals**: Manter 60 FPS no gameplay típico; evitar queda sustentada abaixo de 55 FPS em fases avançadas  
**Constraints**: Preservar arquitetura atual de engine isolada do React, evitar acoplamento de lógica de combate à camada de UI, manter acessibilidade por teclado  
**Scale/Scope**: Ajuste incremental de gameplay em codebase existente (engine, sistemas e testes associados)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **TypeScript e type-check**: PASS — projeto já usa TypeScript e script `typecheck` com `tsc --noEmit`.
- **Lint/format**: PASS — ESLint e Prettier definidos com scripts de validação.
- **Estratégia de testes**: PASS — suíte existente contempla unit/integration/E2E; esta feature adicionará cenários para mecânicas novas.
- **Acessibilidade**: PASS — controles por teclado já fazem parte do produto e devem ser preservados nos fluxos alterados.
- **Performance**: PASS — alvo de 60 FPS explícito; mitigação prevista via controle de taxa/padrão de tiros inimigos por fase.
- **Comunicação pt-BR**: PASS — documentação e handoff mantidos em português do Brasil.

### Post-Phase 1 Gate Review

- **Resultado**: PASS sem violações.
- Artefatos de design (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) cobrem requisitos funcionais e critérios mensuráveis sem quebrar princípios constitucionais.

## Project Structure

### Documentation (this feature)

```text
specs/001-enemy-fire-progression/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── gameplay-progression-openapi.yaml
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
│   ├── services/
│   ├── state/
│   └── components/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Structure Decision**: Manter arquitetura web frontend já existente, centralizando mudanças nos módulos de `frontend/src/game/` e adicionando/ajustando testes em `frontend/tests/` por tipo de cobertura.

## Phase 0: Research Scope & Outcomes

- Curva de dificuldade: usar progressão monotônica por fase com incremento controlado de pressão ofensiva para evitar picos injustos.
- Tiro inimigo: gerar disparos apenas para inimigos vivos e com cadência parametrizada por fase.
- Melhorias: progressão linear por compra até nível 10 com bloqueio explícito no teto e efeito incremental consistente.
- Performance: limitar projéteis ativos, aplicar cooldowns e reciclagem de entidades para estabilidade de FPS.

## Phase 1: Design Scope & Outputs

- **Data model**: entidades e transições para disparo inimigo, progressão de fase e nível de melhoria.
- **Contracts**: contrato OpenAPI para operações de sessão/progressão/compra (fronteira de integração e referência de comportamento).
- **Quickstart**: roteiro curto para validar os fluxos da feature em ambiente local.
- **Agent context**: atualização automática via script oficial para refletir stack e contexto da feature.

## Complexity Tracking

Sem violações constitucionais que exijam justificativa formal nesta fase.
