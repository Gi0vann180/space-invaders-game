# Feature Specification: Inimigos com Tiro e Progressão de Fase

**Feature Branch**: `001-enemy-fire-progression`  
**Created**: 2026-03-05  
**Status**: Draft  
**Input**: User description: "eu quero que os inimigos do space invaders atirem tambem e que a cada fase vai ficando mais dificil de ganhar, quero tambem que as melhorias melhorem a cada vez que voce compra ela aumenta o nivel demelhoria até o 10."

## Constitution Compliance (mandatory)

- **Clean Code & Architecture**: As regras de tiro inimigo, dificuldade por fase e evolução de melhorias serão especificadas como comportamentos independentes e testáveis, com responsabilidade clara por regra de jogo.
- **Component-Driven UI & Separation of Concerns**: O comportamento de jogo será definido sem acoplamento à camada de interface, garantindo separação entre lógica de progressão e apresentação.
- **Predictable State & Game Loop**: A evolução de dificuldade e níveis de melhoria seguirá critérios determinísticos por fase e por compra, garantindo previsibilidade da partida.
- **Testing, CI & Quality Gates**: Cada história possui cenários de aceitação independentes para viabilizar cobertura por testes unitários, integração e jornada principal.
- **Accessibility, Performance & Observability**: Aumentos de dificuldade devem preservar jogabilidade responsiva, sem comprometer a experiência base em navegador moderno.
- **Colaboração em Português do Brasil (pt-BR)**: Todo o conteúdo desta especificação está em português do Brasil.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inimigos também atiram (Priority: P1)

Como jogador, quero que os inimigos atirem em direção ao jogador para que a partida tenha ameaça ativa além de colisão por contato.

**Why this priority**: Sem tiro inimigo, a principal mudança pedida não entrega o novo desafio central da partida.

**Independent Test**: Iniciar uma rodada e verificar que inimigos vivos disparam projéteis ao longo do tempo, causando dano/perda de vida quando atingem o jogador.

**Acceptance Scenarios**:

1. **Given** uma rodada em andamento com inimigos vivos, **When** o tempo de jogo avança, **Then** inimigos devem disparar projéteis de forma recorrente.
2. **Given** um projétil inimigo colide com o jogador, **When** a colisão é processada, **Then** o jogador perde vida conforme regra de dano da rodada.
3. **Given** um inimigo destruído, **When** o sistema de tiro é atualizado, **Then** esse inimigo não deve gerar novos disparos.

---

### User Story 2 - Fases progressivamente mais difíceis (Priority: P2)

Como jogador, quero que cada fase aumente a dificuldade para sentir evolução clara do desafio e maior mérito ao vencer fases avançadas.

**Why this priority**: A progressão de dificuldade sustenta longevidade e atende diretamente ao pedido de "cada fase mais difícil".

**Independent Test**: Jogar fases consecutivas e comparar indicadores de dificuldade (ex.: intensidade ofensiva inimiga e pressão de combate), validando aumento fase a fase.

**Acceptance Scenarios**:

1. **Given** o jogador conclui uma fase, **When** a fase seguinte inicia, **Then** os parâmetros de dificuldade da nova fase devem ser maiores que os da fase anterior.
2. **Given** múltiplas transições de fase, **When** comparar fase N e fase N+1, **Then** a dificuldade não deve reduzir sem evento explícito de balanceamento.
3. **Given** início de partida na fase inicial, **When** o jogador ainda não avançou de fase, **Then** a dificuldade base deve permanecer adequada para onboarding.

---

### User Story 3 - Melhorias evoluem até nível 10 (Priority: P3)

Como jogador, quero que cada compra da mesma melhoria aumente seu nível até 10 para sentir progressão contínua e impacto crescente das escolhas.

**Why this priority**: A progressão de melhorias aumenta estratégia e recompensas de longo prazo sem bloquear o núcleo da partida.

**Independent Test**: Comprar repetidamente a mesma melhoria e validar que o nível aumenta de 1 em 1 até 10, sem ultrapassar o limite.

**Acceptance Scenarios**:

1. **Given** uma melhoria no nível atual X (onde X < 10), **When** o jogador compra essa melhoria, **Then** o nível passa para X+1 e o efeito da melhoria aumenta.
2. **Given** uma melhoria já no nível 10, **When** o jogador tenta comprar novamente, **Then** o sistema impede aumento adicional e informa que o nível máximo foi atingido.
3. **Given** diferentes melhorias disponíveis, **When** o jogador compra apenas uma delas, **Then** somente a melhoria comprada deve evoluir de nível.

### Edge Cases

- O que acontece quando muitos projéteis inimigos estão ativos ao mesmo tempo em fases avançadas?
- Como o jogo se comporta se o jogador avança de fase com vida muito baixa e recebe disparos logo no início da próxima fase?
- O que acontece quando o jogador tenta comprar melhoria sem recursos suficientes?
- Como o sistema trata carregamento de progresso quando há melhoria em nível 10 já salva?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que inimigos ativos realizem disparos durante a rodada.
- **FR-002**: O sistema MUST aplicar consequências de dano ao jogador quando houver colisão com projétil inimigo.
- **FR-003**: O sistema MUST impedir disparos de inimigos já eliminados.
- **FR-004**: O sistema MUST aumentar a dificuldade a cada nova fase concluída.
- **FR-005**: O aumento de dificuldade por fase MUST ser monotônico (fase posterior não pode ser menos difícil que a fase anterior dentro da mesma partida padrão).
- **FR-006**: O sistema MUST manter uma dificuldade inicial adequada para início de partida, antes da primeira progressão.
- **FR-007**: Usuários MUST ser capazes de comprar a mesma melhoria múltiplas vezes, com evolução de nível incremental.
- **FR-008**: Cada compra válida da mesma melhoria MUST elevar exatamente 1 nível até o limite máximo.
- **FR-009**: O sistema MUST limitar o nível máximo de cada melhoria em 10.
- **FR-010**: O sistema MUST bloquear compra adicional de melhorias já no nível 10 sem alterar recursos ou nível.
- **FR-011**: O efeito percebido da melhoria MUST crescer conforme seu nível aumenta.
- **FR-012**: O estado de nível das melhorias MUST permanecer consistente durante a sessão e após carregamento de progresso salvo.

### Assumptions

- A progressão de níveis de melhoria inicia no nível 1 após a primeira compra da melhoria.
- O limite de nível 10 se aplica individualmente para cada tipo de melhoria.
- Aumento de dificuldade por fase considera principalmente pressão de combate (frequência/intensidade de ameaça), mantendo a fase inicial jogável.
- Não há mudança de regras de vitória/derrota além do impacto das novas mecânicas solicitadas.

### Key Entities *(include if feature involves data)*

- **Inimigo**: Unidade hostil ativa em fase, com estado de vida e capacidade de disparo enquanto estiver ativa.
- **Projétil Inimigo**: Disparo originado por inimigo, com trajetória e potencial de causar dano ao jogador.
- **Configuração de Fase**: Conjunto de parâmetros que define o nível de desafio de cada fase e sua progressão.
- **Melhoria**: Item evolutivo comprável pelo jogador, com nível atual, nível máximo (10) e efeito escalável.
- **Estado de Progressão do Jogador**: Registro dos níveis de melhorias e do avanço na partida/fases.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das partidas iniciadas, inimigos ativos realizam ao menos um disparo durante a fase.
- **SC-002**: Em testes de progressão, 100% das transições de fase apresentam aumento de dificuldade percebível por parâmetros de desafio definidos para a fase.
- **SC-003**: Em validação de loja, 100% das compras válidas da mesma melhoria aumentam exatamente 1 nível, até o limite 10.
- **SC-004**: Em validação de limite, 100% das tentativas de compra de melhoria já no nível 10 são bloqueadas sem ultrapassar o teto.
- **SC-005**: Pelo menos 90% dos jogadores de teste relatam percepção clara de aumento de desafio entre fases e de ganho progressivo ao evoluir melhorias.

## Notas de Comportamento Validado

- A progressão de fase aumenta pressão ofensiva por meio de cadência de tiro inimigo, velocidade de projétil e limite de projéteis ativos.
- O escalonamento permanece monotônico entre fases consecutivas, inclusive para fases acima das predefinidas.
- Melhorias evoluem por compra em incrementos de +1 até o nível 10, com bloqueio explícito no teto.
