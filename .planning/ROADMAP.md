# Roadmap: Space Invaders Futurista Mobile v1

**Project**: Space Invaders Futurista Mobile  
**Created**: 2026-03-23  
**Phases**: 7  
**Granularity**: Standard (natural delivery boundaries, balanced scope)  
**Coverage**: 14/14 v1 requirements mapped  

---

## Phases

- [ ] **Phase 1: Campaign Meta-Layer** - Estruturar campanha com progressÃ£o de fases e persistÃªncia entre partidas
- [ ] **Phase 2: Boss Encounters** - Implementar chefes Ãºnicos com mecÃ¢nicas distintas e dificuldade progressiva
- [ ] **Phase 3: Build System & Synergies** - Sistema de upgrades com sinergias identificÃ¡veis para aumentar rejogabilidade
- [ ] **Phase 4: Dynamic Events** - Eventos aleatÃ³rios durante runs para variar ritmo e desafio
- [ ] **Phase 5: Mobile Touch & UX Polish** - Otimizar controles de toque e interface para dispositivos mobile
- [ ] **Phase 6: Monetization & Soft Launch** - Integrar anÃºncios, IAP e telemetria; executar soft launch controlado
- [ ] **Phase 7: App Store Distribution** - Empacotamento, CI/CD e publicaÃ§Ã£o em Play Store e Apple Store

---

## Phase Details

### Phase 1: Campaign Meta-Layer

**Goal**: Jogador consegue progressar por uma campanha estruturada com objetivos claros, persistÃªncia entre partidas e salvamento automÃ¡tico de progresso.

**Depends on**: None (foundation)

**Requirements**: CAMP-01, CAMP-05, CORE-02, CORE-03

**Success Criteria** (what must be TRUE):
  1. Jogador vÃª mapa visual de campanha mostrando fases (1-5) com status desbloqueado/bloqueado/completado
  2. Jogador consegue completar uma fase (sobreviver ondas e derrotar chefe), ver "FASE COMPLETADA" com reward exibido
  3. Jogador fecha app e reabre para verificar que fases completadas permanecem desbloqueadas permanentemente
  4. Jogador consegue pausar durante run e retomar sem perder estado apÃ³s fechar/reabrir app
  5. Campanha funciona completa sem conexÃ£o de internet

**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md - Persistence foundation and resume-safe progression contracts
- [ ] 01-02-PLAN.md - Campaign map UI and completion/interrupted-run flows

**UI hint**: yes

---

**Plans**: TBD

**UI hint**: yes

---

**Plans**: TBD

**UI hint**: yes

---

### Phase 4: Dynamic Events

**Goal**: Runs adquirem variaÃ§Ã£o atravÃ©s de eventos aleatÃ³rios disparados durante partida, evitando monotonia e aumentando rejogabilidade.

**Depends on**: Phase 2

**Requirements**: CAMP-04

**Success Criteria** (what must be TRUE):
  1. Durante uma run, eventos aleatÃ³rios sÃ£o disparados (ex: gravidade invertida por 30s, tela distorce, wave muta para inimigos diferentes)
  2. Cada evento causa impacto visual e/ou mecÃ¢nico identificÃ¡vel no jogo (efeito de tela, novo comportamento de inimigos, etc)
  3. Eventos nÃ£o bloqueiam progressÃ£o mas aumentam dificuldade/caos (desafio opcional ainda Ã© completÃ¡vel)
  4. Jogador consegue visualizar log de eventos que ocorreram durante run (UI mostra histÃ³rico)
  5. Mesmo seed de campanha pode gerar runs completamente diferentes via combinaÃ§Ã£o de eventos aleatÃ³rios

**Plans**: TBD

---

**Plans**: TBD

**UI hint**: yes

---

### Phase 6: Monetization & Soft Launch

**Goal**: Sistema de monetizaÃ§Ã£o hÃ­brido (Ads + IAP) integrado sem degradar experiÃªncia core; soft launch controlado valida market viability com D1/D7 retention gates.

**Depends on**: Phase 3

**Requirements**: MOB-03, MOB-04, MOB-05

**Success Criteria** (what must be TRUE):
  1. AnÃºncios aparecem em pontos naturais sem interrupÃ§Ã£o do combate ativo (ex: apÃ³s death screen, level complete, shop)
  2. Compras in-app funcionam end-to-end sem falhas (ex: comprar cosmÃ©tica, receber item, persistir em follow-up sessions)
  3. Telemetria coleta D1/D7 retention, crash rate, session length e monetization metrics de soft launch regions
  4. Soft launch em regiÃ£o controlada (Canada/Australia) executa <2% crash rate por 7 dias
  5. D1 retention alcanÃ§a gate mÃ­nimo (â‰¥18%) apÃ³s dia 1; se abaixo, rollback ou urgent UX/monetization patch aplicado

**Plans**: TBD

---

### Phase 7: App Store Distribution

**Goal**: Aplicativo Ã© compilado, assinado e publicado com sucesso em Play Store (Android) e Apple Store (iOS), pronto para download pÃºblico.

**Depends on**: Phase 6

**Requirements**: MOB-01, MOB-02

**Success Criteria** (what must be TRUE):
  1. Build distribuÃ­vel para Android Ã© gerado, assinado com certificado release, e aceito pela Play Store (testado em 2+ diferentes dispositivos)
  2. Build distribuÃ­vel para iOS Ã© gerado, assinado com provisioning profile, e aceito pela Apple Store (app review aprovado)
  3. CI/CD pipeline Ã© automÃ¡tico (commit â†’ build â†’ sign â†’ upload sem intervenÃ§Ã£o manual)
  4. App Ã© visÃ­vel e downloadÃ¡vel em ambas as lojas sob nome correto
  5. Post-download em device real, app abre, lida com offline bootup, e core loop funciona sem crashes por 5 min iniciais

**Plans**: TBD

---

## Progress Table

| Phase | Goal Summary | Plans | Status | Completed |
|-------|--------------|-------|--------|-----------|
| 1 | Campaign Meta-Layer | 2 | Not started | - |
| 2 | Boss Encounters | TBD | Not started | - |
| 3 | Build System & Synergies | TBD | Not started | - |
| 4 | Dynamic Events | TBD | Not started | - |
| 5 | Mobile Touch & UX Polish | TBD | Not started | - |
| 6 | Monetization & Soft Launch | TBD | Not started | - |
| 7 | App Store Distribution | TBD | Not started | - |

---

**Roadmap validation**: 14/14 v1 requirements mapped to phases. No orphans. Every requirement has exactly one phase assignment. Coverage complete.

**Next step**: `/gsd:plan-phase 1` to create detailed plan for Phase 1 (Campaign Meta-Layer).


