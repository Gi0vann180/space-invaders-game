# Research — Progressão com Chefes e Power-ups

## Decisão 1: Chefes por fase com padrões de ataque compostos

- Decision: Modelar cada chefe com um conjunto pequeno de padrões de ataque reutilizáveis (ex.: rajada frontal, varredura lateral, projétil rastreador), combinados em sequências específicas por fase.
- Rationale: Garante identidade por fase (FR-002) com custo de manutenção controlado e leitura clara de comportamento para o jogador.
- Alternatives considered:
  - Chefes totalmente scriptados e únicos por fase: rejeitado por alto custo de evolução e menor reuso.
  - Apenas aumento de atributos sem padrão novo: rejeitado por não atender variedade percebida.

## Decisão 2: Escalonamento de chefes por parâmetros monotônicos

- Decision: Escalar ameaça de chefes por fase com parâmetros monotônicos (vida total, frequência de ataque e densidade de projéteis), preservando janelas de reação.
- Rationale: Atende FR-003 e evita picos injustos, mantendo progressão consistente entre fases.
- Alternatives considered:
  - Escalonamento com saltos agressivos por fase: rejeitado por risco de frustração.
  - Escalonamento puramente aleatório: rejeitado por perda de previsibilidade/balanceamento.

## Decisão 3: Power-ups temporários com duração fixa por categoria e regra de conflito

- Decision: Implementar estados temporários de combate (`laser`, `homingMissile`, `shield`) com duração explícita e política de conflito por tipo (substituição de arma ativa e coexistência limitada com escudo).
- Rationale: Atende FR-004, FR-005 e FR-009 com regra simples, testável e comunicável ao jogador.
- Alternatives considered:
  - Acúmulo irrestrito de power-ups: rejeitado por quebrar balanceamento.
  - Sem regra de conflito explícita: rejeitado por gerar estados ambíguos.

## Decisão 4: Meta progressão permanente reaproveitando persistência existente

- Decision: Reutilizar serviço de persistência local já presente para salvar níveis de upgrades permanentes entre partidas/sessões.
- Rationale: Atende FR-006 e FR-007 sem aumentar escopo com backend adicional.
- Alternatives considered:
  - Persistência apenas em memória: rejeitada por perda de progresso ao reiniciar.
  - Backend remoto para progressão: rejeitado por extrapolar escopo da feature.

## Decisão 5: Roguelike com amostragem ponderada e proteção contra oferta inútil

- Decision: Gerar opções de melhoria por run com amostragem pseudoaleatória ponderada, garantindo ao menos uma opção aplicável ao estado atual.
- Rationale: Atende FR-008 e edge case de oferta repetitiva sem valor, mantendo variabilidade entre runs.
- Alternatives considered:
  - Lista totalmente fixa de melhorias por fase: rejeitada por baixa rejogabilidade.
  - Aleatoriedade pura sem filtros: rejeitada por risco de opções sem utilidade prática.

## Decisão 6: Mitigação de performance para 60 FPS

- Decision: Aplicar limites de entidades ativas (projéteis/efeitos), cooldowns e limpeza determinística por frame, além de evitar cálculos de IA fora de janela ativa.
- Rationale: Sustenta meta de performance da constituição sem comprometer legibilidade de combate.
- Alternatives considered:
  - Sem limites de entidades: rejeitado por risco de degradação em hardware médio.
  - Redução global de efeitos em todas as fases: rejeitado por sacrificar experiência base.
