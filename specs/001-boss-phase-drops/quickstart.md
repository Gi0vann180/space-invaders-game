# Quickstart — Ciclo de 10 Fases com Boss e Drops Raros

## Pre-requisitos

- Node.js 18+
- Dependencias instaladas na raiz e no frontend

## Executar localmente

1. Instalar dependencias (se necessario):
   - `npm install`
   - `npm --prefix frontend install`
2. Iniciar app em modo desenvolvimento:
   - `npm --prefix frontend run dev`
3. Abrir o jogo no navegador e iniciar run.

## Smoke rapido (3-5 minutos)

1. Jogue ate fase 10 e confirme que fases 1-9 nao tem boss no fim.
2. No fim da fase 10, confirme spawn de boss com barra de vida visivel.
3. Aplique dano ate zerar vida do boss e valide transicao para fase 11.
4. Derrote inimigos comuns e confirme que, ocasionalmente, surge bolinha de drop raro.
5. Colete bolinha e confirme ativacao imediata de tiro especial aleatorio permitido.

## Validar padrao e escalonamento

1. **Padrao de fases (P1)**
   - Simular progresso ate fase 20.
   - Confirmar boss somente nas fases 10 e 20.

2. **Boss com movimento e morte (P1)**
   - Validar boss se move durante encontro.
   - Confirmar derrota ao zerar vida e fim correto da fase.

3. **Drops raros e tiros especiais (P2)**
   - Confirmar drop nao aparece em todas as mortes (evento raro).
   - Confirmar item expira quando nao coletado no tempo.
   - Confirmar tiro concedido pertence ao conjunto permitido.

4. **Dificuldade crescente (P2)**
   - Comparar ciclo 1-10 com 11-20.
   - Confirmar aumento de pressao de combate no ciclo seguinte.

## Testes automatizados recomendados

- Unit/Integration: `npm --prefix frontend run test`
- E2E: `npm --prefix frontend run test:e2e`
- Validacao completa: `npm --prefix frontend run validate`

## Criticos para regressao

- Fluxo de progressao de fases e encontro de boss.
- Colisoes de projeteis com boss e transicao apos derrota.
- Spawn/coleta/expiracao de drop raro.
- Escalonamento de dificuldade sem perda significativa de FPS.
