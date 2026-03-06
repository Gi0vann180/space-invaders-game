# Feature Specification: Progressão com Chefes e Power-ups

**Feature Branch**: `001-boss-progression-powerups`  
**Created**: 2026-03-05  
**Status**: Draft  
**Input**: User description: "Progressão e Chefes; cada fase culmina em inimigo mais forte com padrões únicos; armas temporárias (laser, mísseis teleguiados, escudos); evolução permanente da nave entre partidas; elementos roguelike com combinações diferentes de melhorias por partida."

## Constitution Compliance (mandatory)

- Valor para o jogador primeiro: cada fase termina com um chefe distinto para aumentar variedade, desafio e sensação de conquista.
- Progressão clara e justa: o jogador recebe escolhas de melhorias temporárias por partida e evolução permanente entre partidas, com impacto perceptível no desempenho.
- Qualidade validável: histórias de usuário, cenários de aceitação, requisitos funcionais e critérios mensuráveis permitem validação objetiva em testes de comportamento.
- Comunicação em pt-BR: toda a especificação está escrita em português brasileiro para alinhamento com o processo do projeto.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Chefes por fase com padrões únicos (Priority: P1)

Como jogador, quero que cada fase termine com um chefe mais forte e com padrão de ataque próprio, para sentir progressão real de desafio e recompensa ao vencer.

**Why this priority**: O ciclo principal de jogo depende de progressão de fases com clímax claro; sem isso, a experiência perde identidade e motivação.

**Independent Test**: Pode ser validada jogando múltiplas fases seguidas e confirmando que cada uma culmina em um chefe distinto com ataques reconhecíveis e dificuldade superior aos inimigos comuns.

**Acceptance Scenarios**:

1. **Given** que o jogador concluiu os objetivos da fase atual, **When** a fase entra no confronto final, **Then** um chefe exclusivo da fase deve surgir como último desafio.
2. **Given** que o jogador enfrenta chefes de fases diferentes, **When** observa o comportamento de ataque, **Then** cada chefe deve apresentar ao menos um padrão de ataque que não se repete de forma idêntica nos demais.
3. **Given** que o jogador derrota o chefe da fase, **When** a transição ocorre, **Then** o jogo deve registrar avanço para a próxima fase e apresentar feedback claro de conquista.

---

### User Story 2 - Power-ups temporários em partida (Priority: P2)

Como jogador, quero coletar power-ups temporários de arma e defesa (laser, mísseis teleguiados, escudo), para adaptar minha estratégia durante cada partida.

**Why this priority**: Aumenta a variedade tática no momento a momento e reduz repetição de combate.

**Independent Test**: Pode ser validada em uma partida única, obtendo cada tipo de power-up e observando efeito temporário, ativação e expiração.

**Acceptance Scenarios**:

1. **Given** que o jogador coleta um power-up de laser, **When** dispara durante o período ativo, **Then** o ataque deve refletir comportamento de laser e retornar ao estado base após expiração.
2. **Given** que o jogador coleta um power-up de mísseis teleguiados, **When** usa ataque durante o período ativo, **Then** os projéteis devem buscar alvos de forma guiada até o término do efeito.
3. **Given** que o jogador ativa escudo temporário, **When** recebe dano durante a janela de proteção, **Then** o escudo deve mitigar impacto conforme regra definida e encerrar ao expirar.

---

### User Story 3 - Evolução permanente e variação roguelike (Priority: P3)

Como jogador, quero melhorar permanentemente minha nave entre partidas e receber combinações diferentes de melhorias a cada nova run, para sentir progressão de longo prazo sem perder rejogabilidade.

**Why this priority**: Sustenta retenção do jogador ao combinar meta progressão com variedade de curto prazo.

**Independent Test**: Pode ser validada em duas ou mais partidas consecutivas, verificando persistência de upgrades permanentes e diferença na oferta de melhorias entre runs.

**Acceptance Scenarios**:

1. **Given** que o jogador compra um upgrade permanente, **When** inicia uma nova partida, **Then** o benefício permanente deve permanecer ativo.
2. **Given** que o jogador inicia partidas distintas, **When** recebe opções de melhorias de run, **Then** a combinação oferecida deve variar entre partidas dentro do conjunto permitido.
3. **Given** que o jogador combina upgrades permanentes e temporários, **When** entra em combate avançado, **Then** o efeito acumulado deve ser perceptível sem invalidar o desafio de progressão.

---

### Edge Cases

- Jogador derrota o chefe no mesmo instante em que sofre dano letal: o resultado da fase deve seguir uma regra única e consistente (vitória ou derrota), sem estado ambíguo.
- Dois power-ups temporários incompatíveis são coletados em sequência: o sistema deve aplicar prioridade clara ou substituição explícita, sem efeitos duplicados indevidos.
- Jogador encerra a sessão após adquirir upgrade permanente: o progresso deve permanecer disponível ao retornar.
- Oferta roguelike gera opções repetidas sem utilidade para o estado atual do jogador: o sistema deve garantir ao menos uma opção relevante dentro das regras da run.
- Jogador abandona uma partida antes de finalizar fase: melhorias temporárias da run devem ser descartadas, preservando apenas progressão permanente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE encerrar cada fase com um encontro de chefe obrigatório antes da progressão para a fase seguinte.
- **FR-002**: O sistema DEVE garantir que cada chefe de fase possua identidade de combate distinta, incluindo ao menos um padrão de ataque exclusivo.
- **FR-003**: O sistema DEVE escalar a ameaça dos chefes por fase de forma progressiva, mantendo dificuldade superior aos inimigos comuns da mesma fase.
- **FR-004**: O sistema DEVE fornecer power-ups temporários de laser, mísseis teleguiados e escudo durante as partidas.
- **FR-005**: O sistema DEVE limitar a duração dos power-ups temporários e retornar o estado de combate ao padrão base após expiração.
- **FR-006**: O sistema DEVE permitir aquisição de upgrades permanentes da nave entre partidas.
- **FR-007**: O sistema DEVE persistir upgrades permanentes entre sessões de jogo do mesmo jogador.
- **FR-008**: O sistema DEVE oferecer combinações variáveis de melhorias em cada nova partida, dentro de um conjunto de opções balanceadas.
- **FR-009**: O sistema DEVE tratar conflitos entre melhorias temporárias com regras explícitas de prioridade, substituição ou não acumulação.
- **FR-010**: O sistema DEVE comunicar ao jogador, de forma clara, quando um efeito temporário inicia, expira e quando um upgrade permanente é aplicado.

### Assumptions

- A progressão de fases e o fluxo de partida já existem e serão estendidos por esta feature.
- Upgrades permanentes são aplicados ao perfil local do jogador atual.
- A variação roguelike considera mudanças na combinação e ordem das opções de melhoria por run, sem garantir exclusividade total de opções em todas as partidas.

### Key Entities *(include if feature involves data)*

- **Fase**: representa uma etapa de progressão; inclui identificador, objetivos de conclusão e vínculo com o chefe final.
- **Chefe**: representa inimigo de clímax da fase; inclui nível de ameaça, conjunto de padrões de ataque e recompensa de conclusão.
- **Padrão de Ataque**: representa comportamento ofensivo de um chefe; inclui tipo, cadência, área de risco e condições de ativação.
- **Power-up Temporário**: representa melhoria de curta duração durante run; inclui tipo (laser, míssil teleguiado, escudo), duração e regra de conflito.
- **Upgrade Permanente**: representa melhoria persistente da nave entre partidas; inclui categoria, nível e custo de aquisição.
- **Run de Partida**: representa uma sessão jogável individual; inclui conjunto de melhorias temporárias recebidas e resultado final.
- **Perfil de Progressão**: representa estado persistente do jogador; inclui upgrades permanentes desbloqueados e histórico básico de avanço.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de jogabilidade, 100% das fases disponíveis culminam em um chefe antes da transição para a fase seguinte.
- **SC-002**: Em sessões de teste com jogadores internos, pelo menos 80% identificam corretamente diferenças de padrão entre chefes de fases distintas sem instrução prévia.
- **SC-003**: Pelo menos 95% dos power-ups temporários ativados expiram com retorno correto ao estado base, sem perda de controle ou estado inconsistente.
- **SC-004**: Em testes de duas partidas consecutivas, 100% dos upgrades permanentes adquiridos permanecem ativos na partida seguinte.
- **SC-005**: Em pelo menos 20 partidas de validação, cada nova run apresenta combinação de melhorias diferente da run imediatamente anterior em ao menos 70% dos casos.

## Notas de Comportamento Validado

- Progressão de fase ocorre em dois passos: limpeza da onda regular ativa encontro de chefe; derrota do chefe abre loja e avanço de fase.
- Power-ups temporários usam grupos de conflito explícitos (`weapon` e `defense`), com substituição no grupo de arma e expiração por tempo.
- Escudo temporário mitiga dano de projéteis inimigos durante janela ativa, sem alterar a regra base fora desse período.
- Upgrades permanentes avançam por compra com incremento +1 até limite 10, persistindo níveis e perfil de progressão entre partidas.
- Ofertas roguelike são geradas por run com variação por seed e garantia de ao menos uma opção aplicável ao estado atual.
