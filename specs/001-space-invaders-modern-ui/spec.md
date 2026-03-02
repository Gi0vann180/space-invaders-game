# Feature Specification: Space Invaders – Modern UI

**Feature Branch**: `001-space-invaders-modern-ui`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description:  
> "jogo space invaders com design moderno utilizando react tailwind css me ajude a definir algumas features para o jogo"

---

## Constitution Compliance (mandatory)

- **Testing:** Collision logic, enemy wave progression and core gameplay will have unit and integration tests defined in the plan.
- **Simplicity:** MVP focuses on core gameplay first (move, shoot, collisions, scoring) before optional systems (shop, achievements).
- **Accessibility:** Include keyboard, touch and gamepad controls and an optional high-contrast mode.
- **Performance:** UI and animations must remain smooth on typical desktop and mobile devices (see Success Criteria).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Jogar uma rodada (Priority: P1)

O jogador inicia o jogo, controla a nave, atira nos inimigos, evita projéteis e completa a fase ao eliminar a onda.

**Why this priority**:  
Este é o valor central do produto — permite aos jogadores experimentar o jogo.

**Independent Test**:  
Iniciar jogo → controlar nave → matar ao menos 1 inimigo → verificar aumento de pontuação e contabilização de vida/colisão.

#### Acceptance Scenarios

1. **Given** a tela de jogo carregada,  
   **When** o jogador pressiona a tecla de movimento e o botão de tiro,  
   **Then** a nave se move e projéteis são disparados.

2. **Given** um projétil acerta um inimigo,  
   **When** a colisão ocorre,  
   **Then** o inimigo é removido e os pontos são adicionados ao placar.

3. **Given** o jogador perde todas as vidas,  
   **When** ocorre a última colisão,  
   **Then** o jogo exibe a tela de *game over* e oferece reiniciar.

---

### User Story 2 – Progressão e power-ups (Priority: P2)

O jogador completa fases progressivamente; entre fases pode adquirir upgrades simples e utilizar power-ups coletáveis em jogo.

**Why this priority**:  
Mantém retenção e oferece objetivos de curto e médio prazo.

**Independent Test**:  
Completar uma fase → abrir tela de progressão/loja → comprar (ou não) um upgrade → iniciar próxima fase com alteração visível (ex.: mais vida ou tiro duplo).

#### Acceptance Scenarios

1. **Given** o jogador completou a fase,  
   **When** a fase termina,  
   **Then** a tela de progressão mostra pontos ganhos e permite comprar upgrades com pontos locais.

2. **Given** um power-up é coletado em jogo,  
   **When** o jogador o pega,  
   **Then** o efeito (ex.: tiro duplo) é aplicado por um tempo limitado e revertido após o término.

---

### User Story 3 – Experiência e configurações (Priority: P3)

O jogador ajusta opções (som, sensibilidade), ativa modo alto contraste e usa teclado, touch ou gamepad.

**Why this priority**:  
Melhora acessibilidade e usabilidade para um público mais amplo.

**Independent Test**:  
Abrir configurações → desativar som → voltar ao jogo → confirmar que efeitos/música não tocam; ativar alto contraste → verificar HUD legível.

#### Acceptance Scenarios

1. **Given** o jogador abre configurações,  
   **When** desativa efeitos sonoros,  
   **Then** nenhum efeito de som é reproduzido durante a sessão.

2. **Given** o jogador ativa alto contraste,  
   **When** entra no jogo,  
   **Then** HUD e elementos da interface usam contraste alto e legível.

---

## Edge Cases

- Perda de foco do navegador (aba em background): o jogo pausa automaticamente e restaura o estado ao retornar.
- Conexão de rede ausente: funcionalidades offline (jogo local e highscore local) continuam funcionando; sincronização de leaderboard global é adiada.
- Input simultâneo (touch + teclado): entradas devem ser reconciliadas e não causar duplicação de ações.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Permitir controlar a nave (esquerda/direita) e disparar projéteis.
- **FR-002**: Detectar colisões entre projéteis, inimigos e jogador, aplicando dano e removendo entidades.
- **FR-003**: Implementar sistema de vidas; ao chegar a zero, exibir tela de *game over* com opção de reiniciar.
- **FR-004**: Múltiplas fases com dificuldade progressiva (velocidade, padrões e quantidade de inimigos).
- **FR-005**: Power-ups colecionáveis aplicam efeitos temporários (ex.: tiro duplo, escudo, velocidade).
 - **FR-005**: Power-ups colecionáveis aplicam efeitos temporários (ex.: tiro duplo, escudo, velocidade). Diferentes tipos de power-up podem coexistir; pegar o mesmo tipo antes do término do efeito deve renovar/estender a duração, não empilhar efeitos adicionais.
- **FR-006**: Sistema de pontuação e placar local persistido entre sessões usando **IndexedDB**.
- **FR-007**: Tela de progressão/loja entre fases para upgrades persistentes da sessão.
 - **FR-007**: Tela de progressão/loja entre fases para upgrades persistentes; compras devem ser salvas entre sessões usando **IndexedDB**.
- **FR-008**: HUD responsivo, adaptado para telas pequenas com boa legibilidade.
- **FR-009**: Suporte a teclado, touch e gamepad, com ajuste de sensibilidade.
- **FR-010**: Opções de áudio: música, efeitos sonoros e vibração (quando suportado).
- **FR-011**: Modo alto contraste e legendas sonoras (quando aplicável).
 - **FR-012**: Registrar eventos de jogo para testes e telemetria; uploads externos só devem ocorrer com consentimento explícito do jogador (opt-in). Eventos devem ser gravados localmente por padrão.

---

### Acceptance Criteria (por requisito)

- **FR-001**: Jogador move a nave e dispara sem erros perceptíveis.
- **FR-002**: Colisões removem entidades e aplicam dano/pontuação corretamente.
- **FR-003**: Vidas decrementam corretamente e *game over* é exibido ao zerar.
- **FR-004**: Cada fase apresenta aumento mensurável de desafio.
- **FR-005**: Power-ups alteram o comportamento temporariamente e são revertidos.
 - **FR-005**: Power-ups alteram o comportamento temporariamente; diferentes tipos coexistem e o mesmo tipo renova a duração em vez de empilhar efeitos.
- **FR-006**: Pontuação é persistida corretamente entre sessões no mesmo navegador.
- **FR-007**: Loja permite gastar pontos e aplicar upgrades antes da próxima fase.
 - **FR-007**: Loja permite gastar pontos, aplicar upgrades antes da próxima fase e garantir que compras persistam entre sessões (IndexedDB).
- **FR-008**: HUD permanece legível em diferentes resoluções.
- **FR-009**: Jogo funciona corretamente com teclado, touch e gamepad.
- **FR-010**: Opções de áudio controlam corretamente som e vibração.
- **FR-011**: Alto contraste e legendas funcionam conforme esperado.
 - **FR-012**: Eventos são registrados localmente; uploads externos de telemetria ocorrem apenas após consentimento explícito (opt-in).

---

## Key Entities

- **Player**: vidas, pontuação, posição, estados de power-up.
- **Enemy**: tipo, posição, saúde, padrão de movimento, pontuação.
- **Projectile**: origem (player/inimigo), velocidade, dano.
- **PowerUp**: tipo, duração, efeito.
 - **PowerUp**: tipo, duração, efeito. Comportamento de empilhamento: tipos diferentes coexistem; mesmo tipo renova duração.
- **Stage**: número, padrões de inimigos, condições de vitória/derrota.
- **ShopItem**: identificador, custo, efeito.
 - **ShopItem**: identificador, custo, efeito (quando comprado, persistido em IndexedDB).
- **HighScore**: nome (opcional), pontuação e timestamp (persistido via IndexedDB).

---

## Clarifications

### Session 2026-02-02

 - **Q:** Storage mechanism for local persistence (highscore/state)?  
    **A:** IndexedDB (Option B)
 - **Q:** Should shop upgrades persist between sessions?  
    **A:** Persistent (Option B)
 - **Q:** Telemetry upload policy?  
    **A:** Opt-in consented upload (Option B)
 - **Q:** Performance target (frame rate)?  
    **A:** Adaptive (60fps target, degrade to 30fps) (Option D)
 - **Q:** Power-up stacking behavior?  
      **A:** Different types coexist; same-type refreshes duration (Option D)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% dos jogadores completam a primeira fase em até 5 minutos.
- **SC-002**: 95% relatam controles responsivos em 20 dispositivos testados.
- **SC-003**: Placar local persiste entre sessões em 100% dos testes.
- **SC-004**: HUD permanece legível em 100% dos testes em telas pequenas.

- **SC-005**: Alvo de desempenho adaptativo: buscar 60 FPS em dispositivos capazes e degradar para 30 FPS em dispositivos com limitação de recursos; manter jogabilidade fluida durante principais interações.

---

## Assumptions

- Highscore e estado do jogador são persistidos localmente no MVP.
- Integração com leaderboard global está fora do escopo inicial.
- Métricas de performance e QA serão definidas posteriormente.

---

## Non-Functional Quality Attributes

- **Performance:** Alvo adaptativo (veja SC-005): buscar 60 FPS em dispositivos capazes; degradar para 30 FPS em dispositivos limitados. Tempo máximo aceitável para resposta de entrada primária: 100ms.
- **Scalability:** Arquitetura cliente-first; persistência local em IndexedDB. Integração remota (leaderboard/sync) é opcional e ficará fora do MVP.
- **Reliability & Availability:** O jogo deve recuperar estado local após recarga/retorno do foco. Failsafe para dados corrompidos que reverte para valores padrão e registra evento de erro.
- **Observability:** Registrar métricas locais (FPS, errors, key events) para debug; enviar apenas com opt-in do usuário. Expor hooks para toggling de logs em ambiente de desenvolvimento.
- **Security & Privacy:** Nenhum dado pessoal (PII) enviado sem consentimento; armazenar apenas nome opcional para `HighScore` e gravar com mínima identificação. Sanitizar entradas do usuário antes de persistir.
- **Accessibility:** Confirmar comandos por teclado, touch e gamepad; implementar alto contraste e captions; foco navegacional e tamanhos de alvo mínimos.
- **Compliance:** Sem requisitos regulatórios específicos no MVP; respeitar leis locais de privacidade (opt-in para telemetria).

## Integration & External Dependencies

- **Local storage:** `IndexedDB` via uma pequena camada utilitária (por exemplo `idb`) para `HighScore`, `ShopItem` purchases e settings.
- **Optional remote services (deferred):** Leaderboard API v1 (HTTP), Telemetry ingest endpoint (opt-in). Implementar versioned endpoints e badger/retry logic se sincronização for adicionada.
- **Third-party libs:** React, Tailwind, idb, small audio library (optional). Evitar grandes game engines for MVP to keep bundle small.

## Edge Cases & Failure Handling

- **Corrupt or migrated IndexedDB schema:** Detect schema mismatch, run migration or fallback to defaults and notify (local log). Allow a manual "reset save" in settings.
- **Storage full / quota denied:** Gracefully degrade persistence (warn user), prioritize high-score and settings, skip non-critical writes.
- **Device capability constraints:** Fallback render/detail reduction when GPU or memory is constrained.
- **Gamepad disconnect / reconnect:** Pause on disconnect (configurable) and resume on reconnect; preserve input mappings.
- **Visibility changes:** Pause on tab/window blur; resume on focus. Persist transient state before unload to avoid data loss.
- **Audio/haptics unavailable:** Detect API support and disable related UI controls.

## Constraints & Tradeoffs

- **Tech constraint:** Use React + TypeScript + Vite and Tailwind for UI speed and developer experience; core rendering can use DOM/CSS for HUD and small canvas for game view.
- **Tradeoff:** DOM-based UI + canvas hybrid keeps accessibility and layout benefits, at cost of slightly more integration complexity between render layers.
- **Storage choice:** IndexedDB chosen for capacity and structured storage; simpler `localStorage` rejected due to size and sync limitations.

## Terminology & Glossary

- **Player:** The user-controlled ship and its persistent session state.
- **Enemy:** Any adversary entity with type, pattern and score value.
- **Projectile:** Bullets/lasers spawned by Player or Enemy.
- **PowerUp:** Temporary effect applying to Player; types include `DoubleShot`, `Shield`, `Speed`.
- **Stage / Wave:** A configured sequence of enemy spawns and conditions for completion.
- **ShopItem:** An upgrade purchasable between stages, persisted in session/store.
- **HighScore:** A persisted score record: optional name, score, timestamp.
- **HUD:** Heads-up display showing lives, score, power-up timers and controls.

## Completion Signals (Definition of Done)

- Each Functional Requirement (FR-001..FR-012) must have at least one automated test (unit or integration) validating its Acceptance Criteria.
- Performance: SC-005 (adaptive frame-rate) validated via profiling runs and automated smoke test that measures FPS on representative devices.
- Persistence: IndexedDB integration tests for `HighScore` and `ShopItem` purchases (write/read/migration tests).
- Accessibility: Keyboard-only walkthrough and high-contrast verification recorded in QA checklist.
- Privacy: Telemetry upload guarded behind explicit opt-in and documented in settings; verify no external requests occur by default.

## Next Steps

1. Priorizar requisitos para MVP (FR-001 a FR-006).
2. Criar plano técnico e tarefas (componentes, game loop, assets, testes).
3. Definir design visual: paleta, tipografia e protótipos de HUD.
