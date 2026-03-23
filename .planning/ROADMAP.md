# Roadmap: Space Invaders Futurista Mobile v1

**Project**: Space Invaders Futurista Mobile  
**Created**: 2026-03-23  
**Phases**: 7  
**Granularity**: Standard (natural delivery boundaries, balanced scope)  
**Coverage**: 14/14 v1 requirements mapped  

---

## Phases

- [ ] **Phase 1: Campaign Meta-Layer** - Estruturar campanha com progressão de fases e persistência entre partidas
- [ ] **Phase 2: Boss Encounters** - Implementar chefes únicos com mecânicas distintas e dificuldade progressiva
- [ ] **Phase 3: Build System & Synergies** - Sistema de upgrades com sinergias identificáveis para aumentar rejogabilidade
- [ ] **Phase 4: Dynamic Events** - Eventos aleatórios durante runs para variar ritmo e desafio
- [ ] **Phase 5: Mobile Touch & UX Polish** - Otimizar controles de toque e interface para dispositivos mobile
- [ ] **Phase 6: Monetization & Soft Launch** - Integrar anúncios, IAP e telemetria; executar soft launch controlado
- [ ] **Phase 7: App Store Distribution** - Empacotamento, CI/CD e publicação em Play Store e Apple Store

---

## Phase Details

### Phase 1: Campaign Meta-Layer

**Goal**: Jogador consegue progressar por uma campanha estruturada com objetivos claros, persistência entre partidas e salvamento automático de progresso.

**Depends on**: None (foundation)

**Requirements**: CAMP-01, CAMP-05, CORE-02, CORE-03

**Success Criteria** (what must be TRUE):
  1. Jogador vê mapa visual de campanha mostrando fases (1-5) com status desbloqueado/bloqueado/completado
  2. Jogador consegue completar uma fase (sobreviver ondas e derrotar chefe), ver "FASE COMPLETADA" com reward exibido
  3. Jogador fecha app e reabre para verificar que fases completadas permanecem desbloqueadas permanentemente
  4. Jogador consegue pausar durante run e retomar sem perder estado após fechar/reabrir app
  5. Campanha funciona completa sem conexão de internet

**Plans**: TBD

**UI hint**: yes

---

### Phase 2: Boss Encounters

**Goal**: Cada fase de campanha possui um chefe com mecânica única e comportamento identifiable, criando pontos de progresso marcantes.

**Depends on**: Phase 1

**Requirements**: CAMP-02, CORE-04

**Success Criteria** (what must be TRUE):
  1. Jogo implementa pelo menos 3 tipos de bosses com padrões de comportamento visualmente distintos (ex: padrão de disparo, forma, movimento)
  2. Boss possui HP bar visível durante combate que reduz com certos ataques do jogador
  3. Derrotar boss dispara feedback audiovisual claro e identificável (explosão visual, som de vitória, screen shake intenso)
  4. Transição para próxima fase após vitória é suave e clara (screen fade, UI update, novo mapa carregado)
  5. Chefes escalam em dificuldade conforme progresso na campanha (padrões mais rápidos, mais agressivos, mais HP)

**Plans**: TBD

**UI hint**: yes

---

### Phase 3: Build System & Synergies

**Goal**: Jogador consegue montar build customizado de upgrades durante run, com sinergias identificáveis entre itens que geram efeitos únicos.

**Depends on**: Phase 1

**Requirements**: CAMP-03

**Success Criteria** (what must be TRUE):
  1. Durante run, jogador consegue escolher upgrade a cada ondas/checkpoints com efeito imediato visual e mecânico
  2. Escolher certos upgrades em combinação dispara bonus ou efeito sinergético adicional (ex: 2 fire upgrades = nova weapon)
  3. Build escolhido persiste durante toda a run e aplica seus efeitos visualmente (armas diferentes, nave com visual modificado, stats alterados)
  4. UI exibe claramente quais sinergias estão ativas (ex: "Synergy: Double Shot +20% Damage")
  5. Diferentes builds geram runstyles diferentes e mecanicamente viáveis (não existe build dominante absoluto)

**Plans**: TBD

**UI hint**: yes

---

### Phase 4: Dynamic Events

**Goal**: Runs adquirem variação através de eventos aleatórios disparados durante partida, evitando monotonia e aumentando rejogabilidade.

**Depends on**: Phase 2

**Requirements**: CAMP-04

**Success Criteria** (what must be TRUE):
  1. Durante uma run, eventos aleatórios são disparados (ex: gravidade invertida por 30s, tela distorce, wave muta para inimigos diferentes)
  2. Cada evento causa impacto visual e/ou mecânico identificável no jogo (efeito de tela, novo comportamento de inimigos, etc)
  3. Eventos não bloqueiam progressão mas aumentam dificuldade/caos (desafio opcional ainda é completável)
  4. Jogador consegue visualizar log de eventos que ocorreram durante run (UI mostra histórico)
  5. Mesmo seed de campanha pode gerar runs completamente diferentes via combinação de eventos aleatórios

**Plans**: TBD

---

### Phase 5: Mobile Touch & UX Polish

**Goal**: Controles de toque são otimizados para dispositivos mobile com responsividade <50ms, haptic feedback e interface legível em múltiplos tamanhos de tela.

**Depends on**: Phase 1

**Requirements**: CORE-01

**Success Criteria** (what must be TRUE):
  1. Nave responde a toque com latência <50ms em dispositivos mobile (testado em mid-range: Pixel 4a, iPhone 11)
  2. One-handed play é suportado (controlesacessíveis com thumb, não requer uso de duas mãos)
  3. UI é legível e toque-friendly em telas pequenas (4.5"), médias (5.5-6.5") e grandes (7"+)
  4. Haptic feedback funciona em dispositivos compatíveis (vibração em hits, colisões, bosses, power-ups, defeats)
  5. Status bar e notch/safe areas são respeitados em device-specific layouts (UI não fica cortada)

**Plans**: TBD

**UI hint**: yes

---

### Phase 6: Monetization & Soft Launch

**Goal**: Sistema de monetização híbrido (Ads + IAP) integrado sem degradar experiência core; soft launch controlado valida market viability com D1/D7 retention gates.

**Depends on**: Phase 3

**Requirements**: MOB-03, MOB-04, MOB-05

**Success Criteria** (what must be TRUE):
  1. Anúncios aparecem em pontos naturais sem interrupção do combate ativo (ex: após death screen, level complete, shop)
  2. Compras in-app funcionam end-to-end sem falhas (ex: comprar cosmética, receber item, persistir em follow-up sessions)
  3. Telemetria coleta D1/D7 retention, crash rate, session length e monetization metrics de soft launch regions
  4. Soft launch em região controlada (Canada/Australia) executa <2% crash rate por 7 dias
  5. D1 retention alcança gate mínimo (≥18%) após dia 1; se abaixo, rollback ou urgent UX/monetization patch aplicado

**Plans**: TBD

---

### Phase 7: App Store Distribution

**Goal**: Aplicativo é compilado, assinado e publicado com sucesso em Play Store (Android) e Apple Store (iOS), pronto para download público.

**Depends on**: Phase 6

**Requirements**: MOB-01, MOB-02

**Success Criteria** (what must be TRUE):
  1. Build distribuível para Android é gerado, assinado com certificado release, e aceito pela Play Store (testado em 2+ diferentes dispositivos)
  2. Build distribuível para iOS é gerado, assinado com provisioning profile, e aceito pela Apple Store (app review aprovado)
  3. CI/CD pipeline é automático (commit → build → sign → upload sem intervenção manual)
  4. App é visível e downloadável em ambas as lojas sob nome correto
  5. Post-download em device real, app abre, lida com offline bootup, e core loop funciona sem crashes por 5 min iniciais

**Plans**: TBD

---

## Progress Table

| Phase | Goal Summary | Plans | Status | Completed |
|-------|--------------|-------|--------|-----------|
| 1 | Campaign Meta-Layer | TBD | Not started | - |
| 2 | Boss Encounters | TBD | Not started | - |
| 3 | Build System & Synergies | TBD | Not started | - |
| 4 | Dynamic Events | TBD | Not started | - |
| 5 | Mobile Touch & UX Polish | TBD | Not started | - |
| 6 | Monetization & Soft Launch | TBD | Not started | - |
| 7 | App Store Distribution | TBD | Not started | - |

---

**Roadmap validation**: 14/14 v1 requirements mapped to phases. No orphans. Every requirement has exactly one phase assignment. Coverage complete.

**Next step**: `/gsd:plan-phase 1` to create detailed plan for Phase 1 (Campaign Meta-Layer).
