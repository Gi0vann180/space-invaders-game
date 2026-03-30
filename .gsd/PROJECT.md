# Space Invaders Futurista Mobile

## What This Is

Um jogo arcade shooter inspirado em Space Invaders, com loop de campanha por fases, chefes e progressao de build durante a partida. O produto e voltado para publico casual mobile, com visual futurista (neon/cyber), sessoes curtas e controles pensados para toque. O objetivo e transformar o jogo atual em um titulo pronto para distribuicao como app na Play Store e Apple Store.

## Core Value

Entregar uma experiencia de combate espacial divertida, moderna e altamente rejogavel no mobile, com controles simples e sensacao forte de progresso a cada fase.

## Current State

- Campanha agora tem meta-layer jogavel nas fases 1..5 com mapa visivel, estados locked/unlocked/completed e selecao de fase desbloqueada.
- Progressao persistida ficou migration-safe: perfil local salva `highestUnlockedStage`, `lastAttemptedStage`, `lastCompletedStage` e `interruptedRun` com defaults aditivos para perfis antigos.
- Inicio de run, pausa/background e conclusao de fase gravam checkpoints locais deterministas sem dependencia de rede.
- App inicializa perfil persistido, detecta run interrompida valida e oferece fluxo explicito de `Continuar` ou `Reiniciar`.
- Overlay/HUD agora expõem contexto de campanha: fase atual, maior fase desbloqueada, fases concluidas e CTA de avancar apos conclusao.
- Suite frontend esta verde com `npm --prefix frontend run validate`.

## Requirements

### Validated

- ✓ Loop de simulacao em tempo real com engine dedicada (update/render/tick) separado da UI React - existente
- ✓ Estrutura de fases com progressao, ondas e sistema de chefes - existente
- ✓ Sistemas de colisao, drops e power-ups com cobertura automatizada (unit/integration/e2e) - existente
- ✓ HUD, overlays e tela de loja/configuracoes no cliente - existente
- ✓ Persistencia local (highscore, settings, shop progress) via IndexedDB/services - existente
- ✓ Pipeline de qualidade com TypeScript estrito, Vitest e Playwright - existente

### Active

- [ ] Evoluir o jogo para uma experiencia mobile-first (UX de toque, legibilidade e fluxos de sessao curta)
- [ ] Expandir campanha por fases com mecanicas novas e chefes mais marcantes
- [ ] Introduzir eventos dinamicos em partida para aumentar variacao e rejogabilidade
- [ ] Criar sistema de builds/sinergias mais profundo durante runs
- [ ] Modernizar direcao visual futurista (neon/cyber) com feedback de impacto
- [ ] Preparar empacotamento/publicacao para Play Store e Apple Store
- [ ] Definir e implementar monetizacao hibrida (Ads + IAP) sem comprometer a experiencia core
- [ ] Atingir criterio de prontidao para publicacao com base em qualidade de gameplay core e retencao inicial
- [ ] CTRL-03 parcialmente avancado por fluxo de restart/continue e checkpoint de campanha, ainda sem validacao em dispositivo mobile real
- [ ] ANDR-01 parcialmente avancado por persistencia de interrupcao/resume offline, ainda sem prova de lifecycle Android real

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
- **Performance**: Sessoes suaves em dispositivos mobile intermediarios - essencial para retencao inicial
- **Monetization**: Ads + IAP no v1 - precisa ser integrado sem degradar a experiencia principal
- **Quality**: Manter gate de testes e tipagem estrita - reduz regressao em mecanicas centrais

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Priorizar publico casual mobile | Maior aderencia com objetivo de publicar em lojas e ampliar alcance | - Pending |
| Estruturar v1 como campanha por fases | Direcao clara para progressao e conteudo incremental | - In progress: campanha meta-layer entregue no slice S01 |
| Adotar abordagem mobile-first desde agora | Evita retrabalho de UX/controles no fim do ciclo | - Pending |
| Incluir Ads + IAP no v1 | Suporta viabilidade de produto sem depender de unico modelo | - Pending |
| Definir sucesso por qualidade do core gameplay + retencao inicial | Evita publicacao prematura baseada apenas em feature count | - Pending |

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
*Last updated: 2026-03-30 after slice S01 completion*