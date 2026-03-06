# Research — Ciclo de 10 Fases com Boss e Drops Raros

## Decisao 1: Boss somente em multiplos de 10

- Decision: Tratar fase de boss com regra deterministica `stage % 10 === 0`, mantendo fases 1-9 de cada ciclo como fases normais.
- Rationale: Atende diretamente o requisito de padrao fixo e facilita validacao automatizada em 10/20/30.
- Alternatives considered:
  - Lista hardcoded de fases com boss: rejeitada por baixa escalabilidade.
  - Probabilidade de boss por fase: rejeitada por quebrar previsibilidade.

## Decisao 2: Progressao apos derrota do boss com regra de desempate

- Decision: Encerrar encontro ao zerar vida do boss e disparar transicao imediata para proxima fase; em morte simultanea boss/jogador, aplicar regra unica de desempate definida no dominio de progressao.
- Rationale: Mantem consistencia do fluxo de partida e evita estados ambiguuos no loop.
- Alternatives considered:
  - Resolver empate de forma aleatoria: rejeitada por nao determinismo.
  - Travar partida para confirmacao manual: rejeitada por quebrar ritmo do jogo.

## Decisao 3: Movimento do boss com padrao horizontal e reversao em bordas

- Decision: Implementar deslocamento continuo do boss com velocidade parametrizavel e inversao de direcao ao atingir limites da arena.
- Rationale: Movimento claro para o jogador, baixo custo computacional e facil de testar em ticks fixos.
- Alternatives considered:
  - Boss parado: rejeitada por nao atender requisito.
  - Trajetoria complexa (curvas/senoides): rejeitada nesta fase por maior risco de regressao.

## Decisao 4: Escalonamento de dificuldade por ciclo de 10 fases

- Decision: Escalar atributos de fase e boss por indice de ciclo (`floor((stage-1)/10)`), com progressao monotonicamente crescente.
- Rationale: Garante que jogo fique cada vez mais dificil mantendo curva previsivel de balanceamento.
- Alternatives considered:
  - Escalonamento apenas por fase individual sem ciclo: rejeitada por perder o conceito de padrao repetido.
  - Saltos abruptos a cada boss: rejeitada por risco de frustracao.

## Decisao 5: Drops raros como entidade propria de coleta

- Decision: Modelar bolinha de drop como entidade separada com tempo de vida, spawn em morte de inimigo comum e expiracao automatica.
- Rationale: Separa responsabilidade de drop e efeito, simplificando regras de spawn/coleta/cleanup.
- Alternatives considered:
  - Aplicar tiro especial diretamente na morte do inimigo: rejeitada por nao refletir a coleta visual solicitada.
  - Reusar estado interno de power-up sem entidade de drop: rejeitada por acoplamento excessivo.

## Decisao 6: Tiro especial aleatorio com sorteio controlado

- Decision: Ao coletar um drop raro, selecionar um tiro especial aleatorio dentre tipos permitidos, com randomizacao controlada para testes reproduciveis.
- Rationale: Entrega variacao de gameplay e permite testes estaveis de distribuicao e limites.
- Alternatives considered:
  - Sempre conceder o mesmo tiro: rejeitada por reduzir variedade.
  - Sorteio totalmente livre com todos os boosts: rejeitada por permitir tipos fora do escopo de tiros especiais.

## Decisao 7: Mitigacao de performance para encontros avancados

- Decision: Aplicar limites de entidades simultaneas, limpeza deterministica de drops/projeteis expirados e parametrizacao conservadora de spawn em ciclos altos.
- Rationale: Preserva meta de 60 FPS em gameplay tipico mesmo com boss movel e itens coletaveis ativos.
- Alternatives considered:
  - Sem limites de entidades: rejeitada por risco de queda de FPS.
  - Reducao global de efeitos visuais em todas as fases: rejeitada por piorar experiencia base.
