# Research — Inimigos com Tiro e Progressão de Fase

## Decisão 1: Disparo inimigo com cadência por fase

- Decision: Implementar disparo inimigo com cooldown/cadência parametrizada por fase e elegibilidade apenas para inimigos vivos.
- Rationale: Atende FR-001/FR-003 com previsibilidade e facilita balanceamento de dificuldade sem acoplamento de UI.
- Alternatives considered:
  - Disparo aleatório sem limite: rejeitado por risco de picos injustos e queda de FPS.
  - Disparo por todos os inimigos em todo frame: rejeitado por inviabilidade de performance e baixa legibilidade de gameplay.

## Decisão 2: Progressão monotônica de dificuldade por fase

- Decision: Escalar dificuldade fase a fase de forma monotônica, aumentando pressão ofensiva (cadência, velocidade/volume controlado) com teto de segurança operacional.
- Rationale: Atende FR-004/FR-005 e mantém clareza da sensação de progresso do jogador.
- Alternatives considered:
  - Curva não monotônica com reduções pontuais: rejeitada por contradizer requisito de aumento contínuo.
  - Escalada agressiva por saltos grandes: rejeitada por risco de frustração e regressão em retenção.

## Decisão 3: Melhorias com nível incremental até 10

- Decision: Cada compra válida incrementa exatamente +1 nível na melhoria até o limite 10, com bloqueio explícito no teto.
- Rationale: Atende FR-007 a FR-011 com regra simples, verificável e consistente para testes.
- Alternatives considered:
  - Upgrades com múltiplos níveis por compra: rejeitado por violar incrementalidade desejada.
  - Limite sem feedback ao usuário: rejeitado por baixa transparência de UX.

## Decisão 4: Salvamento de progressão de melhorias

- Decision: Reutilizar persistência local existente para manter níveis de melhorias consistentes em sessão e recarga.
- Rationale: Atende FR-012 com baixo risco arquitetural, sem introdução de infraestrutura nova.
- Alternatives considered:
  - Persistência somente em memória: rejeitada por perda de progresso ao recarregar.
  - Novo backend dedicado: rejeitado por extrapolar escopo desta feature.

## Decisão 5: Mitigação de performance em fases avançadas

- Decision: Aplicar limites de projéteis ativos e reciclagem/limpeza de projéteis para preservar meta de FPS.
- Rationale: Sustenta princípio de performance da constituição com impacto mínimo na arquitetura atual.
- Alternatives considered:
  - Sem limite de entidades: rejeitado por risco alto de degradação em hardware médio.
  - Redução visual drástica em todas as fases: rejeitado por prejudicar experiência base desnecessariamente.
