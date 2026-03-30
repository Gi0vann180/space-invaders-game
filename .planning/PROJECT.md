# Space Invaders Futurista Mobile

## What This Is

Um jogo arcade shooter inspirado em Space Invaders, com loop de campanha por fases, chefes e progressao de build durante a partida. O produto e voltado para publico casual mobile, com visual futurista (neon/cyber), sesses curtas e controles pensados para toque. O objetivo e transformar o jogo atual em um titulo pronto para distribuicao como app na Play Store e Apple Store.

## Core Value

Entregar uma experiencia de combate espacial divertida, moderna e altamente rejogavel no mobile, com controles simples e sensacao forte de progresso a cada fase.

## Requirements

### Validated

- ✓ Loop de simulacao em tempo real com engine dedicada (update/render/tick) separado da UI React - existente
- ✓ Estrutura de fases com progressao, ondas e sistema de chefes - existente
- ✓ Sistemas de colisao, drops e power-ups com cobertura automatizada (unit/integration/e2e) - existente
- ✓ HUD, overlays e tela de loja/configuracoes no cliente - existente
- ✓ Persistencia local (highscore, settings, shop progress) via IndexedDB/services - existente
- ✓ Pipeline de qualidade com TypeScript estrito, Vitest e Playwright - existente
- ✓ Campanha base com mapa visual, desbloqueio persistente e transicoes claras validada na Phase 01: Campaign Meta-Layer
- ✓ Pause/resume de run e retomada segura apos reabrir o app validados na Phase 01: Campaign Meta-Layer
- ✓ Loop principal offline para campanha base validado na Phase 01: Campaign Meta-Layer

### Active

- [ ] Evoluir o jogo para uma experiencia mobile-first (UX de toque, legibilidade e fluxos de sessao curta)
- [ ] Expandir campanha por fases com mecanicas novas, chefes mais marcantes e dificuldade progressiva sobre a fundacao entregue na Phase 01
- [ ] Introduzir eventos dinamicos em partida para aumentar variacao e rejogabilidade
- [ ] Criar sistema de builds/sinergias mais profundo durante runs
- [ ] Modernizar direcao visual futurista (neon/cyber) com feedback de impacto
- [ ] Preparar empacotamento/publicacao para Play Store e Apple Store
- [ ] Definir e implementar monetizacao hibrida (Ads + IAP) sem comprometer a experiencia core
- [ ] Atingir criterio de prontidao para publicacao com base em qualidade de gameplay core e retencao inicial

### Out of Scope

- Multiplayer online no v1 - alto custo tecnico e de operacao para etapa atual
- Sistema de clas/social completo no v1 - desvia foco do core loop e time-to-market

## Context

- Projeto brownfield ja em andamento, com frontend em React + TypeScript e engine de jogo dedicada em canvas/loop.
- Arquitetura atual separa UI, engine, systems e services, facilitando evolucao incremental de mecanicas.
- Existe base robusta de testes (unit, integration, e2e) que permite refatorar com seguranca.
- O foco estrategico atual e elevar qualidade de produto (game feel, visual, progressao) e concluir trilha de distribuicao mobile stores.
- Motivacao principal declarada: portfolio e aprendizado, com ambicao de publicar como produto real.

## Constraints

- **Platform**: Mobile-first (Android/iOS) com suporte a publicacao em lojas - define decisoes de UX, performance e empacotamento
- **Compatibility**: Manter versao web funcional durante a evolucao - preserva iteracao rapida e validacao continua
- **Performance**: Sesses suaves em dispositivos mobile intermediarios - essencial para retencao inicial
- **Monetization**: Ads + IAP no v1 - precisa ser integrado sem degradar a experiencia principal
- **Quality**: Manter gate de testes e tipagem estrita - reduz regressao em mecanicas centrais

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Priorizar publico casual mobile | Maior aderencia com objetivo de publicar em lojas e ampliar alcance | - Pending |
| Estruturar v1 como campanha por fases | Direcao clara para progressao e conteudo incremental | ✓ Foundation validated in Phase 01 |
| Adotar abordagem mobile-first desde agora | Evita retrabalho de UX/controles no fim do ciclo | - Pending |
| Incluir Ads + IAP no v1 | Suporta viabilidade de produto sem depender de unico modelo | - Pending |
| Definir sucesso por qualidade do core gameplay + retencao inicial | Evita publicacao prematura baseada apenas em feature count | - Pending |

## Current State

- Phase 01: Campaign Meta-Layer concluida com verificacao `passed` e UAT sem gaps em 2026-03-30.
- Campanha base agora possui mapa visual, persistencia de desbloqueios e fluxo de retomada de runs interrompidas.
- Proxima frente principal: executar Phase 02 para adicionar chefes com identidade mecanica e feedback audiovisual consistente.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after Phase 01 completion*
