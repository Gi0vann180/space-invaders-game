# Feature Landscape

**Domain:** Mobile arcade shooter game (Space Invaders-style)  
**Market:** Casual/mid-core audience on iOS/Android  
**Researched:** 2026-03-23  
**Confidence:** HIGH (verified against market trends, app store patterns, monetization models)

## Table Stakes

Features that users expect. Missing = product feels incomplete or abandoned.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Responsive touch controls** | Mobile baseline — no keyboard/mouse | Low | Tap to shoot, swipe/drag to move; must be low-latency |
| **Quick play sessions (3-15min)** | Commute/casual play pattern | Medium | Core loop must complete in focused bursts; can save mid-session |
| **High score / leaderboard tracking** | Arcade game DNA | Low | Persist locally; optional cloud sync for social |
| **Visual feedback on all actions** | Players expect immediate response | Medium | Hit impacts (screen shake, flash), explosions, score popups, particle effects |
| **Smooth performance on mid-range devices** | Market reality — most users on 2-3yr-old phones | High | Target 60fps, aggressive memory management, asset optimization |
| **Resume/pause mid-game** | Mobile interruption reality | Low | Must survive app backgrounding without data loss |
| **Sound effects + music** | Arcade feel requires audio | Low-Medium | Mutable, accessible toggle in settings |
| **Stable monetization (Ads + IAP)** | Expected on free mobile games | Low | App Store/Play Store standard without breaking gameplay |
| **Offline playable** | User expectation — casual games are offline | Medium | No mandatory server dependency for core loop |
| **Crash recovery** | Frustration killer | Medium | Auto-save state before major events; resume without progress loss |

## Differentiators

Features that set your product apart. Not expected, but valued by players who stick around.

| Feature | Value Proposition | Complexity | Gameplay Impact | Notes |
|---------|-------------------|------------|-----------------|-------|
| **Build synergy system** | Roguelike meta-progression — each run feels different | High | Increases replayability 10x+ | Combine weapons/builds dynamically; "holy grail" moments when synergies pop |
| **Unique neon/cyber visual style** | Stand out in App Store crowded market | High | Attracts players, defines brand identity | Screen-space distortion, glow effects, cyberpunk HUD; worth the polish investment |
| **Dynamic event system mid-run** | Breaks pattern, creates memorable moments | Medium-High | Keeps experienced players engaged after 20+ runs | Random events: gravity shifts, screen warp, enemy wave mutations, power-up storms |
| **Boss fights with unique mechanics** | Arcade staple, tests skill progression | Medium | Bookends each phase; creates challenge peaks | Each boss should feel distinct: zig-zag patterns, shield mechanics, split forms |
| **Phase/campaign progression** | Long-term engagement hook | Medium | Unlocks content progressively; shows clear goal | Beat all phases = campaign victory; acts as natural stopping point for session |
| **Powerful upgrade progression** | Satisfying power fantasy | Low-Medium | Makes player feel earned strength | Persistent build choices, visible stat gains, upgrade tree visual feedback |
| **Haptic feedback on key events** | Modern mobile affordance | Low | Increases tactile immersion | Vibration on hits, boss defeats, power-up triggers (iOS + modern Android) |
| **Cosmetic customization** | Player expression + IAP anchor point | Medium | No gameplay advantage, purely cosmetic | Ship skins, weapon trails, HUD themes; natural monetization vector |
| **Double-tap quick restart** | Arcade flow — fast retry after death | Low | Reduces friction, encourages risky plays | Critical for "one more run" addiction loop |
| **Visual attack preview** | Clarity + accessibility | Low-Medium | Shows enemy patterns before they fire | Subtle glow/trail on incoming attacks; builds habit of reading patterns |

## Anti-Features

Features to explicitly NOT build. These destroy retention.

| Anti-Feature | Why Avoid | What to Do Instead | Risk Level |
|--------------|-----------|-------------------|------------|
| **Energy/stamina system limiting free plays** | Primary retention killer for arcade games — halts progression, drives uninstalls | Allow unlimited free plays; monetize cosmetics/qol instead | CRITICAL |
| **Mandatory ads interrupting core loop** | Breaks immersion, triggers immediate uninstall; players paid $0, not prepared for ads mid-combat | Ads at natural breaks: death screen, level complete, shop menu | CRITICAL |
| **Pay-to-win mechanics** | Creates unfair advantage, kills session fairness, community backlash | Cosmetics only; power comes from skill/runs (roguelike fair) | HIGH |
| **Confusing/hidden monetization** | App Store review flags, negative reviews, user trust loss | Transparent pricing; show exactly what IAP is before purchase | HIGH |
| **Excessive notifications/popups** | Attention taxation fatigue; users disable notifications entirely | Only critical notifications (friend achievements, limited events); user controls | MEDIUM |
| **Requires always-online for offline game** | Breaks casual use case; frustration on flights/subways | Offline-first architecture; optional cloud features only | HIGH |
| **Unbalanced difficulty curve** | Too hard early = instant uninstall; too easy late = boring | Gradual difficulty ramp; phases scale with player skill; generous early game | MEDIUM |
| **Loading/boot slowness** | First impression killer; cold start under 2s expected | Boot optimization critical; stream assets in background | MEDIUM |
| **No controller support** | PC/console players expect gamepad option | Support both touch + gamepad input (even on mobile) | LOW |
| **Aggressive monetization wall at progression** | Feels like paygate; blocks content progression without spending | IAP is optional; players earn through skill/time; speed-up only | CRITICAL |

## Feature Dependencies

Layering order matters — some features enable others.

```
Core Loop (shooting, movement, collision) 
  ↓
  ├─ Phase progression (unlocks new enemies)
  │   ↓
  │   └─ Boss fights (end of phase climax)
  │
  ├─ High score tracking (reason to retry)
  │   ↓
  │   └─ Leaderboards (social comparison)
  │
  └─ Visual feedback (makes core loop feel good)
      ↓
      └─ Sound design (reinforces feedback)

Build synergy system (unlocked after 5+ runs)
  ↓
  └─ Dynamic events (modify synergy interactions)
      ↓
      └─ Double-tap restart (retry quickly with new builds)

Cosmetic customization
  ↓
  └─ IAP system (monetize cosmetics)

Campaign progression
  ↓
  └─ Offline persistence (saves state between sessions)
```

## Complexity Tiers

**Tier 1 (Week 1):** Core loop, touch controls, high score, pause/resume  
**Tier 2 (Week 2-3):** Phase progression, visual feedback, sound, boss fights  
**Tier 3 (Week 4-5):** Build synergy system, dynamic events, haptic feedback  
**Tier 4 (Week 6+):** Cosmetics, leaderboard backend, monetization polish  

## MVP Recommendation

**Phase 1 (Playable MVP):**
1. ✓ Core shooting loop + touch controls (exists)
2. ✓ Phase/wave progression with increasing difficulty (exists)
3. **Add:** Visual feedback polish (screen shake, hit flashes, particle effects)
4. **Add:** Sound design (arcade-style SFX + loop music)
5. **Add:** Boss fights (3-5 unique encounters)
6. High score persistence + local leaderboard

**Phase 2 (Soft Launch):**
7. Build synergy system (weapon/upgrade combos)
8. Dynamic events (random modifiers, difficulty spikes)
9. Haptic feedback integration
10. Pause/resume robustness

**Phase 3 (Public Release):**
11. Cosmetic customization (3-5 ship skins, weapon trails)
12. Monetization (ad-supported; IAP for cosmetics only)
13. Social features (optional leaderboard cloud sync)
14. Performance optimization per device tier

## Defer (Post-v1 / "999. Backlog")

- Multiplayer online (high complexity, operational cost)
- Social/clan systems (time-sinks; defer to v1.1)
- Story mode / narrative campaigns (arcade doesn't need lore)
- Cross-saves (cloud sync backend, privacy concerns)
- Seasonal battle pass (viable but risky for tone; test player appetite first)
- AR/3D physical-world integration (overengineering for this genre)

## Sources

- **Wikipedia: Mobile game** (monetization models, market trends, App Store distribution)
- **Project context (PROJECT.md):** Confirms casual audience, mobile-first focus, Ads + IAP model, neon/cyber aesthetic
- **Arcade game conventions:** Derived from Space Invaders DNA, roguelike trend analysis, mobile arcade resurgence (2024-2026)
- **Market data:** Mobile games = 49% of global gaming revenue (2025); free-to-play + cosmetics dominant for casual tier
- **Player psychology:** Session-based play, immediate feedback loops, roguelike replayability, cosmetic monetization acceptance
