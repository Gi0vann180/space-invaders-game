# Research Summary: Space Invaders Futurista Mobile

**Domain:** Casual mobile arcade shooter (Space Invaders-style)  
**Market Position:** Free-to-play with cosmetic monetization, offline-playable, short-session focus  
**Researched:** 2026-03-23  
**Overall Confidence:** HIGH

## Executive Summary

Your project targets the right market at the right time. Mobile arcade games remain viable (49% of gaming revenue in 2025), and casual arcade shooters specifically benefit from low barrier-to-entry, roguelike synergy systems, and strong visual pacing. The competitive landscape is fragmented — few true "Space Invaders + roguelike" hybrids dominate, leaving room for differentiation through art direction (your neon/cyber aesthetic is a natural advantage).

**Core insight:** Table stakes are low (responsive controls, smooth performance, clear progression). Differentiation comes from your synergy/build system, dynamic events, and uncompromising visual polish. Monetization (Ads + cosmetic IAP) is expected and accepted if core gameplay stays free and fair.

**Risk concentration:** Two areas can kill this project:
1. **Energy/stamina walls** — DO NOT gate free play. This is the #1 retention killer for arcade games. Monetize cosmetics instead.
2. **Performance on mid-range devices** — Casual players use 2-3 year old phones. One stuttering boss fight = uninstall. Budget optimization heavily.

## Key Findings

**Stack:** React + TypeScript frontend, dedicated game engine (canvas/loop), IndexedDB persistence. Solid for mobile web; App Store/Play Store wrappers needed.

**Features:** Table stakes are straightforward (touch controls, pause, high scores, visual feedback). Differentiation hinges on synergy/build system, dynamic events, unique visual style, and boss design. Must avoid energy systems, pay-to-win, and monetization walls.

**Architecture:** Separation of UI, engine, and systems (you have this) is essential. Roguelike architecture (session-based runs, persistent state) supports player engagement without multiplayer complexity.

**Critical pitfall:** Casual games fail when they add "soft walls" (energy that refills, time-gated content). Your target audience (commuters, casual players) will drop instantly. Design for sustainable indefinite play.

## Implications for Roadmap

Based on research, recommended phase structure:

### Phase Structure (Recommended Ordering)

1. **Phase 1: Visual + Audio Polish (1.5-2 weeks)**
   - Addresses: Hit feedback (screen shake, particles), boss design, sound design
   - Why first: Core loop exists but feels "raw" — visual polish is force multiplier for retention
   - Avoids pitfall: Poor feedback loops → player engagement flat
   - Deliverable: Core gameplay feels arcade-crisp; players perceive "quality game"

2. **Phase 2: Boss Encounters & Phase Progression (1.5-2 weeks)**
   - Addresses: Campaign structure, difficulty curve, memorable moments
   - Why here: Builds on polished core loop; creates clear win/loss conditions
   - Avoids pitfall: Flat progression → boredom
   - Deliverable: 5 distinct boss fights; 3-4 playable phases with escalating challenge

3. **Phase 3: Build Synergy System (2-3 weeks)**
   - Addresses: Replayability, roguelike loop, "one more run" addiction
   - Why here: Roguelike system layers on stable core; enables dynamic variety
   - Avoids pitfall: Runs feel repetitive → no long-term engagement
   - Deliverable: Weapon combos, upgrade synergies; 10+ distinct builds viable

4. **Phase 4: Dynamic Events & Content Variation (1-2 weeks)**
   - Addresses: Pattern-breaking, skilled player engagement, memorable sessions
   - Why here: Multiplies replayability of synergy system; keeps veteran players interested
   - Avoids pitfall: Experienced players hit ceiling (seen all patterns)
   - Deliverable: 5-8 dynamic events that alter game state; event-synergy interactions

5. **Phase 5: Monetization & Mobile Packaging (2-3 weeks)**
   - Addresses: App Store/Play Store readiness, cosmetic IAP, ad integration
   - Why here: Only after core gameplay locked; monetization changes break balance easily
   - Avoids pitfall: Monetization pressure creates pay-to-win → player backlash
   - Deliverable: 3-5 cosmetic tiers, ad placements (death screen + shop only), build signed APK/IPA

6. **Phase 6: Performance & Device Optimization (1.5-2 weeks)**
   - Addresses: Mid-range device stability, boot time, memory management
   - Why here: Near end, not beginning (premature optimization); measure on real devices
   - Avoids pitfall: Stuttering on common devices = immediate uninstalls
   - Deliverable: 60fps target on Snapdragon 695 + iPhone 11; <2s cold boot

7. **Phase 7: QA & Soft Launch (1-2 weeks)**
   - Addresses: Crash recovery, save state integrity, edge cases
   - Why here: Final gates before public release; catch regressions
   - Avoids pitfall: Soft launch = feature-locked; fixes only for critical bugs
   - Deliverable: Zero crash data for 1000+ sessions; cloud sync optional

### Phase Ordering Rationale

1. **Quality over features:** Polish core before adding complexity. Polished core loop with 1 boss > feature-rich but janky.
2. **Content before systems:** Boss structure defines campaign shape. Systems (synergy, events) layer on solid structure.
3. **Monetization late:** Never balance for monetization first. Nail gameplay, then monetize it (not vice versa).
4. **Performance last:** Optimization is measurable only after features freeze. Premature perf work = waste.

### Research Flags for Phases

- **Phase 1 (Visual Polish):** Low risk; straightforward and measurable (frame drops, particle performance).
- **Phase 2 (Boss Encounters):** Medium risk; boss difficulty curve is hardest aspect. Playtest extensively.
- **Phase 3 (Synergy System):** High risk; balance-sensitive. Needs design iteration loop. Plan for 2+ weeks.
- **Phase 4 (Dynamic Events):** Medium risk; events must feel organic, not chaotic. Test with target demographic.
- **Phase 5 (Monetization):** High risk; wrong implementation destroys retention. Test ad placement before launch.
- **Phase 6 (Performance):** Low risk but time-intensive. Profile early; don't guess.
- **Phase 7 (QA):** Low risk if phases 1-6 solid. Mostly regression testing.

## Confidence Assessment

| Area | Confidence | Reasoning |
|------|------------|-----------|
| **Stack** | HIGH | React + TypeScript + IndexedDB is proven stack. App wrappers (Capacitor, React Native) well-documented. |
| **Features** | HIGH | Market data clear (49% mobile gaming revenue); casual arcade monetization patterns established. Table stakes vs differentiators well-researched. |
| **Architecture** | HIGH | Roguelike architecture validated by successes (Hades, Roguebook, Isaac). Your UI/engine separation is correct. |
| **Pitfalls** | HIGH | Energy/stamina, pay-to-win, monetization walls = documented killers. Sourced from post-mortems, game dev forums, market failures. |
| **Monetization Model** | MEDIUM | Ads + cosmetic IAP works for casual tier, but execution tricky. Ad placement and cosmetic pricing need player testing. |

## Gaps to Address

- **Cosmetic pricing strategy:** How many cosmetics? What price tiers? Test with target demographic.
- **Ad network selection:** Which ad networks have lowest impact on gameplay? Requires comparison testing.
- **Leaderboard backend:** Cloud leaderboards optional for v1; flag for Phase 7.
- **Controller support:** Scope unclear — mobile controller optional or must-have? Defer to Phase 6.
- **Accessibility:** Colorblind modes, button size, text scaling. Add as Phase 7 enhancement.
- **Localization:** English v1? Plan for multi-language in Phase 7 if international launch planned.

## Next Steps

1. **Use this research to finalize roadmap:** Phases 1-7 in recommended order. Adjust durations based on team size.
2. **Plan Phase 1 UAT:** Define "visual polish complete" — specific metrics (FPS target, particle count, sound design checklist).
3. **Validate feature scope:** Review FEATURES.md with target players (casual arcade fans); confirm table stakes align.
4. **Prototype monetization:** Before Phase 5, design cosmetic tiers + test ad placement on prototype build.
5. **Stress-test target devices:** Borrow Snapdragon 695 + iPhone 11; measure real device performance early.
