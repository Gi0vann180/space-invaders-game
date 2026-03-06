# Quickstart — Progressão com Chefes e Power-ups

## Pré-requisitos

- Node.js 18+
- Dependências instaladas na raiz e no frontend

## Executar localmente

1. Instalar dependências (se necessário):
   - `npm install`
   - `npm --prefix frontend install`
2. Executar frontend em modo dev:
   - `npm --prefix frontend run dev`
3. Abrir o jogo e iniciar rodada.

## Smoke rápido (2-3 minutos)

1. Inicie uma rodada e confirme HUD com `Stage` e `Lives` visíveis.
2. Elimine inimigos da fase até iniciar encontro de chefe.
3. Derrote o chefe e confirme ida para loja/progressão.
4. Compre um upgrade e avance para a próxima fase.

## Validar fluxos principais

1. **Chefes por fase (P1)**
   - Avance até o fim da fase e confirme spawn do chefe antes da próxima transição.
   - Derrote chefes de ao menos duas fases e valide padrões de ataque diferentes.

2. **Power-ups temporários (P2)**
   - Ative laser, míssil teleguiado e escudo em momentos distintos.
   - Confirme efeito ativo durante janela válida e retorno ao estado base após expiração.
   - Valide regra de conflito/substituição para power-ups incompatíveis.

3. **Progressão permanente + roguelike (P3)**
   - Compre upgrade permanente e reinicie partida.
   - Confirme persistência do upgrade adquirido.
   - Execute múltiplas runs e verifique variação de ofertas de melhoria por run.

## Testes automatizados recomendados

- Unit/integration: `npm --prefix frontend run test`
- E2E: `npm --prefix frontend run test:e2e`
- Validação completa: `npm --prefix frontend run validate`

## Critérios de aceite observáveis

- Toda fase termina com chefe antes da progressão.
- Dano/efeitos de power-ups temporários são aplicados e expiram corretamente.
- Upgrades permanentes persistem entre partidas.
- Combinações de melhorias variam entre runs dentro do conjunto permitido.

## Resultado da validação executada

- Data: 2026-03-05
- `npm --prefix frontend run validate`: sucesso
- `npm --prefix frontend run test:e2e -- tests/e2e/us1-boss-progression.spec.ts tests/e2e/us2-powerups-lifecycle.spec.ts tests/e2e/us3-roguelike-variation.spec.ts`: sucesso (3 cenários)
