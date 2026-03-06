# Quickstart — Inimigos com Tiro e Progressão de Fase

## Pré-requisitos

- Node.js 18+
- Dependências instaladas no repositório

## Executar localmente

1. Instalar dependências na raiz e no frontend (se necessário):
   - `npm install`
   - `npm --prefix frontend install`
2. Subir ambiente de desenvolvimento:
   - `npm run dev`
3. Abrir a aplicação e iniciar uma partida.

## Validar fluxos da feature

1. **Tiro inimigo**
   - Inicie a rodada e confirme que inimigos vivos passam a atirar com o tempo.
   - Confirme perda de vida quando projétil inimigo atinge o jogador.

2. **Dificuldade por fase**
   - Complete ao menos duas fases.
   - Valide aumento de pressão ofensiva na fase seguinte (maior ameaça/cadência/ritmo).

3. **Upgrade até nível 10**
   - Compre repetidamente a mesma melhoria.
   - Verifique incremento de nível em +1 por compra válida até 10.
   - Tente comprar no nível 10 e valide bloqueio sem aumento adicional.

## Testes automatizados recomendados

- Unit/integration: `npm run test`
- E2E: `npm run test:e2e`
- Qualidade (typecheck + lint + testes): `npm run validate`

## Resultado da validação executada

- Data: 2026-03-05
- `npm run test`: sucesso
- `npm run test:e2e`: sucesso (5 cenários)
- `npm run validate`: sucesso (typecheck + lint + testes)

## Consolidação de SC-005 (percepção >= 90%)

- Estado atual: pendente de coleta com jogadores de teste reais.
- Critério de fechamento: survey estruturado com base mínima de 10 jogadores e taxa de percepção >= 90%.
- Template pronto para execução: `specs/001-enemy-fire-progression/playtest-sc005-template.md`.
