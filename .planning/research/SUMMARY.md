# Research Summary: Space Invaders Futurista Mobile

**Project:** Mobile arcade shooter with campaign progression, build synergies, and App Store/Play Store distribution  
**Synthesis Date:** 2026-03-23  
**Status:** Ready for roadmap creation

---

## Executive Summary

**Product type:** Free-to-play mobile arcade shooter targeting casual/mid-core audiences on iOS and Android. The existing web prototype (React + Canvas 2D + custom game loop) is technically sound and requires minimal rewritingthe challenge is *optimizing for mobile constraints* and *building meta-progression systems* that drive long-term retention. Expert teams in this domain prioritize campaign/boss progression, build synergies (roguelike-style runs), and careful monetization (ads + cosmetic IAP only) to achieve 20%+ D7 retention.

**Recommended approach:** Keep the existing React/TypeScript/Canvas architecture intact. Extend with: (1) campaign meta-layer for persistent unlocks, (2) boss state machines for difficulty progression, (3) build/synergy system enabling varied runs, (4) dynamic events for chaos/replayability, and (5) mobile-specific optimizations (Capacitor packaging, touch UX, performance profiling on mid-range devices). Monetization must be *designed in* with core loop (ads at natural pauses, cosmetics only), not bolted on afterward. Soft launch in secondary regions (Canada/Australia) for 23 weeks before official store release to validate D1/D7 retention, crash rate, and monetization impact.

**Key risks & mitigation:** The dominant pitfall is aggressive monetization crashing retention (D1 < 15% instead of 25%+). Prevent by establishing monetization guardrails in Phase 1 design and running soft launch gates (hard-fail if D1 retention < 18%). Secondary risk is performance degradation on mid-range devices (iPhone 11, Pixel 4a)mitigate by profiling on tier-2 hardware by Phase 2 end and implementing object pooling + dynamic scaling. Third risk is progression feeling grindyprevent by playtest-validating that each phase unlocks meaningful upgrades/cosmetics and that no skill wall emerges before phase 3.

---

## Key Findings

### From STACK.md

**Current state is solid; additions are focused and minimal:**

| Decision | Rationale |
|----------|-----------|
| **Keep React 18+ / TypeScript 5.0+ / Canvas 2D** | Existing validation; web codebase proven performant for arcade loop |
| **Add Capacitor 6.0+** | Only path to App Store/Play Store without full rewrite; wraps web app as WKWebView (iOS) / WebView (Android) |
| **Firebase Analytics + Google Mobile Ads** | Market standard for casual games; Firebase free tier covers DAU/session tracking; Admob  RPM typical for arcade |
| **Sentry for crash reporting** | Essential for debugging device-specific issues (memory leaks, thermal throttling on mid-range phones) |
| **Performance targets** | <2s cold boot, 60fps, <150MB RAM (mid-range), <100MB app size, 1015% battery per 30min |

**Installation effort:** 23 weeks (Week 1: Capacitor setup; Weeks 23: signing + CI/CD + real device testing). Handled as Phase 56 task (after core gameplay complete).

**No React Native required**  Capacitor is simpler, maintains web architecture, sufficient for arcade game performance.

---

### From FEATURES.md

**Table Stakes (non-negotiable):**
- Responsive touch controls (tap to shoot, drag to move, <50ms latency)
- Quick play sessions (315 min, saves mid-session automatically)
- High score / local leaderboard persistence
- Visual feedback on all actions (screen shake, hit flashes, particles, score popups)
- 60fps target; playable on mid-range devices (23 year-old phones)
- Pause/resume + app backgrounding survival
- Sound effects + background music (mutable toggle)
- Offline playable (no mandatory server dependency)
- Crash recovery (auto-save before major events)

**Differentiators (retention drivers):**
- **Build synergy system:** Roguelike-style runs where weapon/upgrade combos unlock emergent strategies. High replayability (+10x replay rate vs. non-synergy arcade games). Requires Phase 3 depth.
- **Neon/cyber visual polish:** Screen-space distortion, glow effects, cyberpunk HUD. Worth investment; differentiates in crowded App Store.
- **Dynamic events:** Mid-run surprises (gravity shifts, screen warp, wave mutations). Keeps 20+ run veterans engaged.
- **Boss encounters:** One per phase; each with unique mechanics (patterns, shields, split forms). Bookmarks progression.
- **Phase/campaign progression:** 5+ phases unlocked gradually. Natural stopping point; shows clear goal.
- **Powerful upgrade progression:** Visible power fantasy; builds feel earned, not purchased.
- **Cosmetic customization:** Ship skins, weapon trails, HUD themes. Pure cosmetics (no gameplay advantage). Primary IAP anchor point.
- **Haptic feedback:** Vibration on hits, power-ups, boss defeats. Modern mobile affordance.

**Anti-Features (explicitly avoid):**
-  Energy/stamina system limiting free plays  **CRITICAL: kills arcade retention instantly**
-  Mandatory ads interrupting core loop  place at natural breaks only (death screen, level complete)
-  Pay-to-win mechanics  skill determines outcome, not wallet
-  Aggressive monetization walls  IAP is optional; core content earnable via play
-  Always-online requirement  offline-first architecture
-  Unbalanced difficulty  gradual ramp; no skill walls before phase 3

**MVP scope (Phase 1-2):** Core loop (exists), phase/wave progression (exists), visual feedback polish (new), sound design (new), boss fights 35 (new), local high score (new).

---

### From ARCHITECTURE.md

**Recommended architecture:** Layered event-driven system:
- **UI Layer:** React components handle shop, settings, HUD overlays
- **Game Loop:** Engine orchestrates tick sequence; publishes events to event bus
- **Domain Systems:** Wave progression, boss state machines, collision, drops, progression
- **Data Layer:** Campaign definitions, build tree, event pools (all config-driven)
- **Persistence:** IndexedDB for campaign progress, settings; optional cloud sync for leaderboards

**Build order (dependencies matter):**

1. **Phase 1: Campaign Meta-Layer**  Campaign state schema, persistence, UI. Foundation for all downstream features.

2. **Phase 2: Boss Encounters**  Boss state machines, phase transitions. Core campaign feature; drives difficulty curve.

3. **Phase 3: Build System & Synergies**  Upgrade tree, synergy evaluation. Enables varied runs; high replayability.

4. **Phase 4: Dynamic Events**  Event schema, evaluator, effects. Transforms runs into chaotic/replayable experiences.

5. **Phase 5: Advanced Difficulty & Modifiers**  Difficulty settings, adaptive scaling. Satisfies casual + hardcore players.

6. **Phase 6: Monetization Integration**  Ad system, IAP shop, telemetry. Includes mandatory soft launch (23 weeks).

7. **Phase 7: Mobile UX Polish**  Touch optimization, haptic, session resumption, device safe zones.

**Key patterns:** Immutable state snapshots per tick; event-driven communication; config-driven definitions; synergy as stateless functions.

---

### From PITFALLS.md

**Critical Pitfalls:**

| Pitfall | Prevention | Phase |
|---------|-----------|-------|
| **Monetization too aggressive** | Ads at natural pauses only (max 1 video ad per 5-min session); IAP optional (prices .99.99). Soft launch gate: D1 retention 18%, session length stable 812 min. | Phase 3 design + Phase 6 soft launch |
| **Performance degradation on mid-range devices** | Profile on iPhone 11, Pixel 4a by Phase 2 end. Object pooling, batch rendering, dynamic scaling (720p480p). Target <120MB RAM, 60fps. | Phase 26 (continuous) |
| **Soft launch skipped** | Mandatory 23 week rollout (Canada/Australia days 17  UK days 814  all English days 1521). Hard gates: crash <2%, D1 retention 18%. | Phase 6 (mandatory) |
| **Progression doesn't reward retention** | Playtest curve extensively. Ensure every phase unlocks 1 cosmetic/gear. Validate no skill wall before phase 3. Target D7 retention 20%. | Phase 35 |

**Moderate Pitfalls:**
- Touch controls not mobile-first  One-handed mode; reticle 2cm; haptic on hits
- Network sync failures  Auto-save every 30s; offline mode; cloud always wins on merge
- App store quality too low  Asset review gate; translations 2 weeks pre-launch; no debug logs in build
- Analytics missing  Instrument by Phase 3; track D1/D7 by device/version; crash logs live

**Early warning signs (check weekly):**
- Frame rate drops <45fps on Pixel 4a / iPhone 11
- D1 retention <20% after major changes
- Review sentiment mentions "ads too aggressive" or "too hard"
- Session length trending down <8 min

---

## Implications for Roadmap

### Suggested Phase Structure (7 Phases + Soft Launch)

**Rationale for ordering:**
1. Campaign meta-layer is foundation  enables all downstream meta-progression
2. Boss encounters unlock difficulty progression  required before synergies/events enhance them
3. Build synergies require stable foundation  enables dynamic events to reference build state
4. Dynamic events layer on top  provides run variation
5. Difficulty/modifiers tune full stack  enables casual + hardcore paths
6. Monetization last (Phase 6)  prevents aggressive early decisions; soft launch validates market
7. Mobile UX polish last (Phase 7)  applies to all systems; non-blocking

### Phase Details

**Phase 1: Campaign Meta-Layer** (12 weeks)
- *Delivers:* Campaign state schema, persistence, UI (phase map, meta-upgrade shop)
- *Dependencies:* None (extends existing run system)
- *Downstream:* Phases 25 depend on campaign definitions
- *Pitfalls:* Design monetization guardrails in design doc; establish D1/D7 targets

**Phase 2: Boss Encounters** (1 week)
- *Delivers:* Boss state machines (35 boss types), phase transitions, victory/defeat loot
- *Dependencies:* Phase 1
- *Enables:* Difficulty progression; dramatic phase climaxes
- *Pitfalls:* No difficulty spikes; telegraph attacks 1.5s before firing

**Phase 3: Build System & Synergies** (1.52 weeks)
- *Delivers:* Upgrade tree, synergy evaluation, build UI, run-specific build state
- *Dependencies:* Phase 1 + Phase 2
- *Enables:* Run-to-run variety; replayability explosion
- *Pitfalls:* Ensure every run discovers 2 new synergies; balance synergies (powerful  broken)

**Phase 4: Dynamic Events** (11.5 weeks)
- *Delivers:* Event schema, evaluator, effects executor, event UI (screen flash, notifications)
- *Dependencies:* Phases 13
- *Enables:* Chaos/unpredictability; keeps veteran players engaged (20+ runs)
- *Research flag:* Event weighting/frequency may need playtesting

**Phase 5: Advanced Difficulty & Modifiers** (1 week)
- *Delivers:* Difficulty settings (easy/normal/hard), run modifiers, adaptive difficulty, leaderboard segregation
- *Dependencies:* Phases 14
- *Enables:* Casual + hardcore satisfaction; prevents progression plateaus
- *Research flag:* Scaling multipliers may need tuning via playtesting

**Phase 6: Monetization Integration** (11.5 weeks + 23 week soft launch)
- *Delivers:* Ad placement (reward/interstitial), IAP shop (meta-upgrades, cosmetics), telemetry, graceful failures
- *Dependencies:* Phases 15
- *Includes:* Mandatory soft launch (staggered regions, daily monitoring)
- **Research flag:**  **CRITICAL**  soft launch gates (crash <2%, D1 18%, session 812 min). Hard-fail if gates unmet.
- *Pitfalls:* Ads must NOT interrupt core gameplay; place at death screen only. IAP prices .99.99. Free players access 50%+ content.

**Phase 7: Mobile UX Polish** (12 weeks)
- *Delivers:* Touch optimization (larger hit zones), haptic feedback, session resumption, responsive layout (notches/safe areas), audio optimization
- *Dependencies:* Phases 16
- *Research flag:* Device testing gate  profile on 5 device tiers before release
- *Pitfalls:* One-handed mode required; reticle 2cm; no browser back-swipe triggers

**Post-Launch Soft Window:** 23 weeks (staggered rollout, daily monitoring, <24h hotfix cadence for critical bugs)

### Feature Mapping to Phases

| Feature | Phase | Rationale |
|---------|-------|-----------|
| Core loop, touch controls, pause/resume | Foundation | Exists; extend only |
| High score, local leaderboard | Phase 1 | Campaign meta storage |
| Phase/campaign progression | Phase 1 | Campaign schema foundation |
| Boss fights (35 unique) | Phase 2 | Boss state machines |
| Visual/sound feedback polish | Phases 12 | Incremental throughout |
| Build synergy system | Phase 3 | High-value replayability driver |
| Dynamic events | Phase 4 | Requires Phase 3 foundation |
| Haptic feedback | Phase 7 | Polish; non-blocking |
| Cosmetic customization | Phase 56 | IAP anchor point |
| Adaptive difficulty | Phase 5 | Tuning phase |
| Ads + IAP | Phase 6 | Soft launch validation |

### What NOT to Build in v1 (Defer to v1.1+)

- Multiplayer online (operational cost)
- Social/clan systems (test appetite first)
- Story mode (arcade doesn't need lore)
- Cross-saves / cloud sync (privacy concerns)
- Seasonal battle pass (risky for tone)
- Controller support (mobile-first; keyboard fallback for web dev only)

---

## Confidence Assessment

| Area | Level | Rationale & Gaps |
|------|-------|------------------|
| **Stack** |  HIGH | React + Canvas existing & validated. Capacitor path clear. Gap: Sentry integration + device profiling data (resolve Phase 2). |
| **Features** |  HIGH | Table stakes align with arcade/roguelike conventions. MVP conservative. Differentiators proven in shipped titles. Gap: None major. |
| **Architecture** |  HIGH | Layered event-driven pattern well-established. Build order dependencies clear. Gap: Synergy balance tuning requires playtesting (Phase 3). |
| **Pitfalls** |  HIGH | Monetization/performance/soft launch pitfalls well-documented in post-mortems. Concrete gates provided. Gap: None. |
| **Roadmap** |  MEDIUMHIGH | Phase ordering logical; dependencies mapped. Gap: Phase 6 soft launch execution requires team discipline (don't ship prematurely). |

**Gaps requiring Phase-level attention:**
1. **Synergy balance tuning** (Phase 3)  Theoretical design sound; balance requires 20+ playthroughs per build (35 day tuning cycle)
2. **Performance device profiling** (Phase 2+)  Current targets theoretical; need real Pixel 4a / iPhone 11 testing
3. **Event tuning / frequency weighting** (Phase 4)  Requires playtester feedback to calibrate
4. **Soft launch validation** (Phase 6)  D1/D7 retention, crash patterns, monetization funnel depend on real market

---

## Research Flags

| Phase | Flag | Reason |
|-------|------|--------|
| Phase 1 | Standard | Campaign meta-layer well-understood pattern |
| Phase 2 | **Early device profiling** | Performance critical; need real device data by phase end |
| Phase 3 | **Synergy balance playtesting** | Build tuning iterative; plan 35 day cycle with diverse playtesters |
| Phase 4 | **Event frequency A/B testing** | Event trigger weight affects replayability; tune via cohorts |
| Phase 5 | Standard | Difficulty scaling multiplicative; tune via Phase 4 telemetry |
| Phase 6 | **Soft launch gates (MANDATORY)** | Do not ship all regions without 23 week staggered rollout + monitoring |
| Phase 7 | Standard + **Cross-device QA** | Touch/haptic/layout vary by device; need real hardware validation |

---

## Key Success Metrics

- **D1 Retention:** 18% soft launch; 20% public release (monetization balanced, progression rewarding)
- **Session length:** 812 min stable (pacing right; length increasing = engagement up)
- **Frame rate:** 45fps on Pixel 4a / iPhone 11 (non-negotiable for arcade feel)
- **App store rating:** 4.0 stars after 1K+ reviews (quality at launch)
- **Crash rate:** <1% during soft launch (stability)

---

## Next Steps: Ready for Requirements Definition

Proceed with:
1. Phase 1 feature specifications (campaign schema, meta-upgrades, progression tiers)
2. Phase 2 boss encounter design (5 boss types, attack patterns, difficulty scaling)
3. Phase 3 build + synergy system design (upgrade tree, 2030 synergy rules)
4. Phase 4 event pool design (3050 event types, trigger conditions, rarity weights)
5. Phase 5 monetization policy (ad placement rules, IAP pricing, retention targets)
6. Device profiling plan (which devices, performance targets, profiling tools)

---

## Sources

**Research files synthesized:**
- STACK.md (validated architecture + mobile packaging)
- FEATURES.md (table stakes, differentiators, anti-features, MVP scope)
- ARCHITECTURE.md (component boundaries, data flow, build order patterns)
- PITFALLS.md (critical/moderate/minor pitfalls, detection gates)

**External sources in research:**
- Capacitor documentation (capacitorjs.com, 2026-03-23)
- Firebase / Google Mobile Ads (market standards for casual games)
- GDC talks (arcade game design, roguelike progression)
- Tenjin / Appfigures (mobile monetization, soft launch practices)
- Pocket Gamer / r/gamedev (shipped project post-mortems)
- Project codebase (React 18 + Canvas 2D + TypeScript validation)
