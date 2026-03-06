# Feature Specification: Progressao de Fases com Boss e Drops Raros

**Feature Branch**: `001-boss-phase-drops`  
**Created**: 2026-03-06  
**Status**: Draft  
**Input**: User description: "quero que o chefe principal tome dano e qunado a barra de vida dele acabar ele morra e vai para outra fase, quero que as 9 fases sejam normais mas na 10 fase o boss apareça no final dela quero q isso seja um padrão e vai ficando cada vez mais dificil,quero tambem q os boosts como os tiros diferentes sejam adiquiridos como drops raros de quando vc matar um inimigo dropa uma bolinha q te da um tiro especial aleatorio, quero tambem q o boss se mova."

## Constitution Compliance (mandatory)

- **Clean Code & Architecture**: A funcionalidade separa claramente regras de progressao, comportamento do boss e sistema de drops, com responsabilidades distintas para facilitar manutencao.
- **Component-Driven UI & Separation of Concerns**: Estados e eventos de combate (vida do boss, derrota, troca de fase e coletaveis) permanecem desacoplados da camada visual.
- **Predictable State & Game Loop**: Evolucao de fase, dano, derrota do boss e geracao de drops seguem regras deterministicas baseadas em eventos de gameplay.
- **Testing, CI & Quality Gates**: A feature exige cobertura de testes para ciclo de fases, derrota do boss, escalonamento de dificuldade e comportamento probabilistico controlado de drops raros.
- **Accessibility, Performance & Observability**: Informacoes de fase, aparicao de boss, barra de vida e coleta de boost devem ser comunicadas de forma clara sem degradar a fluidez da jogabilidade.
- **Colaboracao em Portugues do Brasil (pt-BR)**: Especificacao redigida integralmente em pt-BR, mantendo termos tecnicos apenas quando necessario.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ciclo de boss previsivel por fases (Priority: P1)

Como jogador, quero enfrentar um boss ao final de toda 10a fase para entender o ritmo de progressao e ter marcos claros de desafio.

**Why this priority**: Este e o eixo principal solicitado para progressao da partida e define o loop central do jogo.

**Independent Test**: Pode ser testado jogando uma sequencia de fases e verificando que as fases 1-9 sao normais e a fase 10 termina com encontro de boss, repetindo o mesmo padrao em 20, 30 e assim por diante.

**Acceptance Scenarios**:

1. **Given** que o jogador concluiu a fase 9, **When** inicia a fase 10, **Then** essa fase termina com a aparicao de um boss.
2. **Given** que o jogador concluiu a fase 10 derrotando o boss, **When** a proxima fase comeca, **Then** o jogo avanca para a fase 11 normalmente.
3. **Given** que o jogador alcanca a fase 20, **When** chega ao final da fase, **Then** um boss aparece novamente seguindo o mesmo padrao.

---

### User Story 2 - Boss com vida, movimento e derrota (Priority: P1)

Como jogador, quero causar dano no boss, ver a barra de vida reduzir e derrotar o boss para desbloquear a proxima fase.

**Why this priority**: Sem esse comportamento, o encontro com boss nao fecha o ciclo de combate e nao entrega a progressao desejada.

**Independent Test**: Pode ser testado em uma fase de boss validando que o boss se move durante o combate, recebe dano de ataques validos e, ao zerar vida, e removido da partida com transicao de fase.

**Acceptance Scenarios**:

1. **Given** um boss ativo na fase, **When** recebe ataques validos do jogador, **Then** sua barra de vida diminui proporcionalmente ao dano.
2. **Given** que a vida do boss chegou a zero, **When** o ultimo golpe e aplicado, **Then** o boss morre e a fase e concluida com avancao para a proxima.
3. **Given** um boss em combate, **When** o encontro acontece, **Then** o boss se movimenta continuamente em vez de permanecer parado.

---

### User Story 3 - Drops raros de tiros especiais (Priority: P2)

Como jogador, quero ter chance rara de obter tiros especiais ao derrotar inimigos para variar estrategias e aumentar o potencial de combate.

**Why this priority**: Aumenta variedade e sensacao de recompensa sem substituir o loop principal de fases e boss.

**Independent Test**: Pode ser testado derrotando grandes quantidades de inimigos e verificando ocorrencia rara de bolinhas de drop que concedem, ao coletar, um tiro especial aleatorio.

**Acceptance Scenarios**:

1. **Given** um inimigo comum derrotado, **When** o evento de morte e processado, **Then** existe chance rara de gerar uma bolinha de boost no campo.
2. **Given** uma bolinha de boost ativa no campo, **When** o jogador coleta essa bolinha, **Then** recebe imediatamente um tipo de tiro especial aleatorio entre os tipos permitidos.
3. **Given** que o jogador nao coleta a bolinha a tempo, **When** o tempo de vida do item expira, **Then** o drop desaparece sem conceder beneficio.

---

### User Story 4 - Dificuldade crescente ao longo dos ciclos (Priority: P2)

Como jogador, quero que o jogo fique cada vez mais dificil em ciclos de fases para manter desafio progressivo.

**Why this priority**: O usuario pediu padrao repetitivo com aumento de dificuldade, essencial para longevidade da experiencia.

**Independent Test**: Pode ser testado comparando indicadores de dificuldade entre ciclos consecutivos (1-10, 11-20, 21-30), confirmando aumento gradual e consistente.

**Acceptance Scenarios**:

1. **Given** dois ciclos consecutivos de 10 fases, **When** comparados, **Then** o ciclo mais avancado apresenta dificuldade maior que o anterior.
2. **Given** uma fase normal em ciclo avancado, **When** o jogador inicia o combate, **Then** percebe pressao maior que em fases normais de ciclos iniciais.

### Edge Cases

- O que acontece se o boss e derrotado no mesmo instante em que derrota o jogador?
- Como o sistema se comporta se varios inimigos forem eliminados ao mesmo tempo e mais de um drop raro surgir em sequencia?
- O que acontece se o jogador entrar em contato com um drop raro exatamente no frame em que ele expiraria?
- Como o sistema garante que fases de boss nao aparecam fora do padrao (por exemplo, fase 9 ou 11)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST aplicar dano ao boss quando o boss for atingido por ataque valido do jogador.
- **FR-002**: O sistema MUST exibir e atualizar a barra de vida do boss durante todo o encontro de boss.
- **FR-003**: O sistema MUST considerar o boss derrotado quando sua vida atingir zero.
- **FR-004**: O sistema MUST concluir a fase de boss e avancar para a fase seguinte imediatamente apos a derrota do boss, salvo condicao explicita de derrota do jogador no mesmo instante.
- **FR-005**: O sistema MUST estruturar a progressao em ciclos de 10 fases, sendo as fases 1-9 de cada ciclo fases normais.
- **FR-006**: O sistema MUST garantir que a fase 10 de cada ciclo contenha encontro com boss no final da fase.
- **FR-007**: O sistema MUST repetir o padrao de boss a cada multiplo de 10 fases (10, 20, 30, ...).
- **FR-008**: O sistema MUST aumentar a dificuldade geral a cada novo ciclo de 10 fases, mantendo progressao de desafio perceptivel e consistente.
- **FR-009**: O sistema MUST movimentar o boss durante o encontro, com deslocamento observavel para o jogador.
- **FR-010**: O sistema MUST conceder chance rara de drop ao derrotar inimigos comuns, gerando uma bolinha coletavel quando o drop ocorrer.
- **FR-011**: O sistema MUST conceder um tiro especial aleatorio ao jogador quando a bolinha de drop raro for coletada.
- **FR-012**: O sistema MUST limitar os tiros especiais aleatorios aos tipos de boost permitidos no jogo.
- **FR-013**: O sistema MUST remover a bolinha de drop raro do campo apos coleta ou expiracao de tempo.
- **FR-014**: O sistema MUST manter a progressao jogavel mesmo quando nao ocorrer drop raro por varias eliminacoes consecutivas.

### Key Entities *(include if feature involves data)*

- **CicloDeFases**: Representa um bloco de 10 fases com atributos de indice do ciclo, intervalo de fases e nivel de dificuldade associado.
- **EncontroBoss**: Representa o combate de boss com estado de vida atual, vida maxima, estado de movimento e estado final (ativo, derrotado).
- **DropRaroDeBoost**: Representa o item coletavel gerado por chance rara ao derrotar inimigo, com tempo de vida e estado (ativo, coletado, expirado).
- **TiroEspecial**: Representa o tipo de disparo especial concedido ao jogador por drop raro, selecionado aleatoriamente dentre o conjunto permitido.

## Assumptions

- O padrao de fases considera contagem sequencial iniciando em 1.
- "Drop raro" sera calibrado para ocorrer de forma esporadica e notavelmente menos frequente que eventos comuns de combate.
- O jogo ja possui mais de um tipo de tiro especial disponivel para selecao aleatoria.
- Em empate de eventos criticos (morte do boss e derrota do jogador no mesmo instante), uma regra de desempate sera definida no planejamento tecnico para manter consistencia.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de progressao de 30 fases, 100% dos encontros de boss ocorrem exclusivamente nas fases 10, 20 e 30.
- **SC-002**: Em testes de combate de boss, 100% das derrotas de boss com vida zerada resultam em transicao para a fase seguinte em ate 2 segundos.
- **SC-003**: Em sessoes de validacao com jogadores, pelo menos 85% identificam corretamente que o jogo segue o padrao de 9 fases normais + 1 fase com boss.
- **SC-004**: Em comparacao entre tres ciclos consecutivos de 10 fases, 100% dos ciclos avancados apresentam dificuldade superior ao ciclo imediatamente anterior segundo os indicadores de balanceamento definidos pelo produto.
- **SC-005**: Em amostras de 1.000 inimigos derrotados, a taxa de drops raros permanece dentro da faixa alvo definida para evento raro e sem quedas de desempenho perceptiveis.
