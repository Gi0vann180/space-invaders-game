# Space Invaders Mobile

## What This Is

Um jogo inspirado em Space Invaders que ja funciona no navegador com loop arcade, progressao entre fases, loja, power-ups e configuracoes persistidas. O proximo passo e evoluir essa base para um produto mobile mais polido e divertido, com cara de release comercial e foco inicial em Android. A referencia nao e apenas o arcade classico, mas uma versao moderna com meta progressao leve e sensacao de roguelite casual.

## Core Value

Entregar uma sessao arcade curta, divertida e clara no celular, em que o jogador aprende jogando e sente progressao real sem perder a simplicidade do Space Invaders.

## Requirements

### Validated

- ✓ Jogador consegue iniciar uma partida, mover a nave, atirar, derrotar inimigos, perder vidas, receber pontuacao e chegar a game over ou restart — existing
- ✓ Jogador consegue avancar por fases, entrar na loja entre fases, comprar upgrades e coletar power-ups com regras de duracao e coexistencia — existing
- ✓ Jogador consegue usar teclado, touch e gamepad, salvar configuracoes/acessibilidade, persistir highscore e progresso local e sincronizar leaderboard opcional com consentimento — existing

### Active

- [ ] Evoluir o visual, HUD, menus e feedbacks para que o jogo pareca produto publicavel em vez de prototipo
- [ ] Melhorar mecanicas, variedade e progressao para reduzir repeticao e ensinar o jogo pela propria experiencia
- [ ] Ajustar controles, UX e estabilidade para uma experiencia mobile confiavel com foco inicial em Android
- [ ] Preparar a base do produto para publicacao em loja, com escopo viavel para trabalho solo e baixo custo

### Out of Scope

- Backend online complexo com contas e infraestrutura proprietaria — aumenta muito o custo e foge do foco de publicar um bom core loop mobile primeiro
- Multiplayer — nao e necessario para validar a proposta arcade nem cabe no escopo atual de evolucao
- Lancamento simultaneo em Android e iOS — Android sera o primeiro alvo realista para reduzir complexidade de release

## Context

- O projeto atual e um frontend React + TypeScript com engine de jogo em Canvas, loop deterministico, stores proprias e persistencia em IndexedDB
- O jogo ja tem shell de UI, HUD, overlay, settings panel, shop screen, progressao por fases, power-ups, upgrades persistidos e highscore local/remoto opcional
- O principal problema percebido hoje nao e ausencia de jogo, mas falta de polimento: loop repetitivo, UX/controles ainda fracos e problemas tecnicos que impedem sensacao de produto pronto
- O publico inicial e uma mistura de jogador casual mobile com a propria referencia do autor como filtro de qualidade
- O objetivo do trabalho nao e so publicar, mas tambem aprender desenvolvimento mobile enquanto transforma o projeto em algo realmente divertido de jogar

## Constraints

- **Tech stack**: Manter a base atual em React, TypeScript, Vite e Canvas — o jogo ja existe nessa arquitetura e reescrever agora destruiria velocidade
- **Scope**: Trabalho solo com baixo custo — o plano precisa priorizar impacto alto sem depender de equipe, backend robusto ou producao pesada
- **Platform**: Android first — a experiencia precisa funcionar bem em celular antes de expandir para outros alvos
- **Product**: Sessao curta e onboarding natural — o jogo precisa ser entendido e aproveitado rapidamente sem depender de tutorial pesado

## Key Decisions

| Decision | Rationale | Outcome |
| -------- | --------- | ------- |
| Lancar primeiro no Android | E o alvo mais realista para validar publicacao mobile com menor complexidade operacional | — Pending |
| Seguir uma direcao de arcade moderno com meta progressao leve | Preserva a identidade Space Invaders enquanto adiciona retencao e descoberta | — Pending |
| Priorizar polimento visual, UX e variedade antes de features online complexas | O bloqueio atual para publicacao e qualidade percebida, nao falta de infraestrutura | — Pending |
| Ensinar o jogador pela propria experiencia | O produto precisa ser acessivel para casual mobile sem depender de tutorial intrusivo | — Pending |

---

_Last updated: 2026-03-09 after initialization_