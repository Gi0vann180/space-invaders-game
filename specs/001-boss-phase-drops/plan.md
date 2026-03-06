# Implementation Plan: Ciclo de 10 Fases com Boss e Drops Raros

**Branch**: `001-boss-phase-drops` | **Date**: 2026-03-06 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-boss-phase-drops/spec.md`

## Summary

Implementar um ciclo recorrente de 10 fases onde as fases 1-9 sao normais e a 10a termina com boss movel, com combate de vida/dano/morte e transicao de fase apos derrota; introduzir escala progressiva de dificuldade entre ciclos e drops raros de bolinha que concedem tiro especial aleatorio ao coletar.

## Technical Context

**Language/Version**: TypeScript 5.x (React frontend)  
**Primary Dependencies**: React 18, Vite 5, Vitest 2, Playwright 1.53, Testing Library, ESLint, Prettier  
**Storage**: Persistencia local existente para configuracoes/progresso (servicos no frontend)  
**Testing**: `vitest` (unit/integration), React Testing Library (component), `playwright` (E2E)  
**Target Platform**: Navegadores desktop modernos (jogo em canvas + overlays React)
**Project Type**: Aplicacao web unica em `frontend/`  
**Performance Goals**: Manter 60 FPS no gameplay tipico e evitar quedas sustentadas abaixo de 55 FPS em fases de boss  
**Constraints**: Logica de gameplay deterministica no game loop, separacao de UI e engine, compatibilidade com controles por teclado  
**Scale/Scope**: Alteracoes incrementais em progressao de fases, comportamento de boss, sistema de drops e testes relacionados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate Review

- **TypeScript e type-check**: PASS - projeto usa TypeScript e possui `npm --prefix frontend run typecheck`.
- **Lint/format**: PASS - `eslint` e `prettier` estao configurados e incluidos no fluxo de validacao.
- **Testing strategy**: PASS - plano cobre testes unitarios de regras de combate/progressao, integration para fluxo de fases e E2E para jornada principal.
- **Accessibility**: PASS - HUD e overlays devem manter navegacao/feedback por teclado, sem regressao de leitura de estado de fase/boss.
- **Performance**: PASS - meta de 60 FPS com mitigacao por limites de entidades, cooldowns e tuning de spawn.
- **Communication pt-BR**: PASS - artefatos e handoff em portugues do Brasil.

### Post-Phase 1 Gate Review

- **Resultado**: PASS sem violacoes.
- `research.md` define decisoes de escalonamento/drops com previsibilidade.
- `data-model.md` separa entidades de ciclo, boss, drop e estado de run para testabilidade.
- `contracts/` formaliza eventos/operacoes de progressao e coleta.
- `quickstart.md` cobre validacao manual e automatizada dos fluxos P1/P2.

## Project Structure

### Documentation (this feature)

```text
specs/001-boss-phase-drops/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── boss-cycle-drops-openapi.yaml
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
    ├── e2e/
    ├── integration/
    └── unit/
```

**Structure Decision**: Manter arquitetura atual de app web unica e concentrar a feature em `frontend/src/game/` para regras de combate/progressao, com ajustes de HUD em `frontend/src/components/` e cobertura de testes em `frontend/tests/`.

## Phase 0: Research Scope & Outcomes

- Definir politica de ciclo fixo de fases (1-9 normal, 10 boss) repetida em multiplos de 10.
- Definir regra de derrota do boss e transicao de fase com desempate para eventos simultaneos.
- Definir modelo de movimentacao do boss com padrao legivel e escalavel por ciclo.
- Definir drop raro com probabilidade controlada e expiracao de item coletavel.
- Definir estrategia de randomizacao de tiro especial sem enviesar para um unico tipo.
- Definir mitigacoes de desempenho para manter FPS em fases avancadas.

## Phase 1: Design Scope & Outputs

- **Data model**: entidades para ciclo, fase, boss encounter, drop raro e tiro especial concedido.
- **Contracts**: contrato OpenAPI de referencia para eventos de progressao de fase, hit/kill de boss e coleta de drop.
- **Quickstart**: roteiro de validacao manual e automatizada com foco em padrao de 10 fases e escalonamento.
- **Agent context**: atualizacao via script oficial de contexto do agente.

## Complexity Tracking

Sem violacoes constitucionais que exijam justificativa.

## Implementation Checkpoint (2026-03-06)

- Setup e Fundacao concluidados para ciclo de boss e drops raros.
- US1 concluida: boss apenas em fases multiplas de 10, com testes unit/integration dedicados.
- US2 concluida no escopo de combate: movimento do boss, derrota por dano e sincronizacao visual de HP.
- US3 concluida no escopo core: spawn raro por morte de inimigo, coleta, concessao de tiro especial e expiracao.
- US4 concluida no escopo core: escalonamento por ciclo aplicado em configuracao de fase e ataque do boss.
- Validacao executada com sucesso em `npm --prefix frontend run validate`.
