# Domain Pitfalls: Mobile Arcade Shooter (Web → App Store)

**Domain:** Casual mobile arcade shooter with campaign progression  
**Context:** Turning web-based prototype into app store-ready game  
**Researched:** March 2026

---

## Critical Pitfalls

Mistakes that cause rewrites, store rejections, or fatal retention drops.

### Pitfall 1: Monetization Too Aggressive Too Early

**What goes wrong:**
- Ad placement breaks core gameplay loop (interrupts mid-session or blocks shooter reticle)
- IAP prices tuned for console market (too high for casual mobile)
- Paywalls force unfair power gaps → new players quit before hour 1
- Revenue optimization overrides retention — short-term money damages long-term viability

**Why it happens:**
- Team prioritizes launch money over player satisfaction
- No soft launch phase to test monetization impact on D1/D7 retention
- Monetization added late (after gameplay done) rather than designed alongside core loop

**Consequences:**
- App store rating craters (1-2 stars) due to "aggressive ads" reviews
- D1 retention below 15% (industry avg for casual is 25-35%)
- Feature request floods demand "remove ads" or "make fair"
- Algorithm deprioritizes = new installs dry up

**Prevention:**
- **Design monetization INTO core loop from day 1** — not bolted on at end
  - Ads placed during natural pauses (between waves, after death, shop screen)
  - Never interrupt active gameplay
  - IAP feels like optional progression, not mandatory to progress
- **Establish monetization guardrails in design doc:**
  - Max ad frequency (e.g., 1 video ad per 5-min session)
  - IAP prices: $0.99–$4.99 (casual market standard), no $99 bundles
  - F2P progress curve: free players can reach 50%+ of end content
- **Soft launch 2–3 weeks before store launch** in secondary market
  - Monitor D1, D7, D14 retention vs. control (build without monetization)
  - Measure session length: should stay 8–12 min for arcade
  - Track "ad skip" rates: if >40% skip, placement is too aggressive
- **Phase:** Introduce during Phase 3 (Monetization System)

**Detection:**
- Session length drops >3 min after ads enabled
- D1 retention <20% (hard sign monetization killed on-boarding)
- App store reviews consistently mention "ads ruin gameplay"
- P1 ad network reports low video completion (<50%)

---

### Pitfall 2: Performance Degradation on Mobile Devices

**What goes wrong:**
- Prototype runs smooth on desktop dev machine but stutters/crashes on mid-range Android/iOS
- Canvas rendering too expensive; FPS drops to 20fps on iPhone 11 or Pixel 4a
- Memory leaks from web architecture patterns → app drowns RAM over 20-min session
- Thermal throttling: game heats device, crashes or gets force-closed by OS
- Battery drain: 10% drain per session turns off 60% of players

**Why it happens:**
- Web codebase assumes unlimited CPU/GPU; canvas loop not optimized for mobile power budgets
- No device-profiling strategy early (only tested on flagship phones)
- Assets (sprites, audio) not compressed for mobile
- Physics/collision ticks every frame instead of fixed timestep

**Consequences:**
- Crashes dominate app store reviews ("game freezes", "won't launch on my phone")
- Players uninstall within 5 min; D1 retention catastrophic
- Store algorithm penalizes app for crashes; deprioritized in search
- Forced downgrade to "lite" version with features cut = competitive disadvantage

**Prevention:**
- **Profile on tier-2 devices by Milestone 2 end**
  - Regularly test on: iPhone 11, Pixel 4a, Galaxy A50 (reputable mid-range)
  - Establish performance baseline: 60fps @ 60% CPU, <120MB RAM, <2°C heat rise
  - Use DevTools: Chrome Mobile Throttling, Android Profiler
- **Optimize canvas architecture early:**
  - Implement object pooling for bullets, enemies, effects (no GC churn mid-frame)
  - Batch render calls; use dirty-rect optimization to redraw only changed regions
  - Cap particle count; disable off-screen rendering
- **Asset optimization before launch:**
  - All sprites: WebP or JPEG, <1MB per frame
  - Audio: MP3 @ 64kb/s (mono for SFX, stereo for music)
  - Compress all assets into build; target <50MB app size
- **Establish thermal/battery budget:**
  - Cap frame rate at 60fps even on 120fps devices
  - Reduce rendering resolution on low-end devices (dynamic scaling at 720p→480p)
  - Dim screen brightness after 10 min idle
- **Phases:** Ongoing from Phase 2 (Mobile UX) through Phase 6 (Soft Launch)

**Detection:**
- Frame drops below 30fps on Pixel 4a or iPhone 11
- Memory usage >150MB sustained after 15 min
- App crashes on 2+ consecutive 15-min sessions
- Battery drain >15% per session

---

### Pitfall 3: Soft Launch Phase Skipped or Too Short

**What goes wrong:**
- Team publishes directly to all regions without testing market response
- Day 1 discovers critical bugs from "real world" usage patterns (smurf players, rapid-fire events)
- App store algorithm penalizes high crash rate on launch day → buried in search
- Can't iterate quickly; store approval takes 24–72h per update
- Revenue estimates way off because test players aren't representative of real market

**Why it happens:**
- Time pressure: team wants to "ship and iterate"
- Underestimating soft launch value; thought internal testing sufficient
- Tool/process gap: team unfamiliar with soft launch mechanics (regional rollout, staged builds)

**Consequences:**
- Launch review bomb: 1-star reviews from day 1 bugs (can't recover for 6+ months)
- Algorithmic suppression: store assumes low quality
- Players who leave on day 1 rarely return (only 5-10% re-engage after bad first impression)
- Revenue + retention targets miss by 30–40%

**Prevention:**
- **Mandatory 2–3 week soft launch window before official release**
  - Phase 1 (Days 1–7): Canada or Australia region only; max 5K installs/day
    - Monitor crash rate, hang frequency, critical bugs
    - Target: <1% crash rate, <5% error logs
  - Phase 2 (Days 8–14): Expand to UK; add A/B test for monetization
    - Test D1/D7 retention; session length; LTV forecast
  - Phase 3 (Days 15–21): All English regions; full rollout prep
- **Establish soft launch gates:** Hard-fail if any of these are true:
  - Crash rate >2% in any 24h window
  - D1 retention <18%
  - Critical networking issue or balance exploit found
  - Unplayable device crash on tier-2 hardware
- **Capture soft launch data:**
  - Daily cohort retention (D1, D3, D7)
  - Monetization funnel (ad impressions, IAP conversion)
  - Top 10 crash/error logs
  - Player feedback: review sentiment, common complaints
- **Phase:** Phase 6 (Soft Launch)

**Detection:**
- No regional rollout process defined in store approval plan
- Launch date 3 months away with soft launch not yet scheduled
- Test data from <1000 unique players
- High variance in metrics from internal (QA) testing

---

### Pitfall 4: Progression System Doesn't Reward Retention

**What goes wrong:**
- Campaign phases don't scale difficulty meaningfully; players hit a brick wall at phase 3
- Synergy/build system (if present) too shallow; all builds feel identical
- Shop gear progression doesn't provide satisfying power upgrades
- No sense of "growing stronger" between runs → feels like grinding, not progression
- Daily/weekly challenges copy-pasted from generic template; feel disconnected from game

**Why it happens:**
- Design focus on content volume, not progression pacing
- Balance tuning rushed; didn't playtest with real progression curves
- Each phase designed in isolation; no holistic difficulty curve

**Consequences:**
- Players hit "progression wall" around hour 2–3; abandon game
- D7 retention collapses (normal range 15–25%, yours 8–12%)
- Live ops content doesn't drive re-engagement (events feel tacked-on)
- Whales emerge quickly (overpowered IAP) → casual players feel powerless

**Prevention:**
- **Design progression explicitly in game design doc (Phase 1)**
  - Define clear milestone targets per phase:
    - Phase 1–2: Every session unlocks 1–2 new mechanics or cosmetics
    - Phase 3–4: Gear progression every 3–5 runs; synergy synergies unlock
    - Phase 5+: Build variety explodes; no two runs identical
  - Scaling difficulty: each phase boss +15–20% health, +1 new attack pattern
  - Progression reward loops: kill X enemies → unlock cosmetic → feel of growth
- **Synergy system design (if included):**
  - Guarantee every run discovers ≥2 synergies player didn't know about
  - Visual feedback: synergy activates → screen effect, audio cue
  - Balance: synergies feel powerful but not game-breaking
- **Playtest progression curve:**
  - Session 1: Learn controls, beat phase 1 → feel empowered
  - Session 5: Unlock new gear tier, attempt phase 3 → struggle but possible
  - Session 15: Master one build, experiment with synergies → choice/agency
  - Session 30: Attempt hard mode, cosmetic rewards diversify
- **Tuning gates per phase:**
  - Phase: 1–2: Ensure D7 retention ≥20%
  - Phase 3: Difficulty curve validated (no sudden skill spike)
  - Phase 5: Player retention should increase, not plateau (new content drives re-engagement)
- **Phases:** Phase 3–5 (Progression & Mechanics tuning)

**Detection:**
- Session length drops sharply after phase 2 completion
- No cosmetic/gear unlocks for 3+ sessions
- Player feedback: "feels grindy", "all runs same", "hit wall"

---

## Moderate Pitfalls

### Pitfall 5: Touch Controls Not Designed Mobile-First

**What goes wrong:**
- Reticle too small; misses are frustrating (especially on older eyes, small hands)
- Gesture conflicts: swiping to move sometimes triggers browser back-swipe
- No haptic feedback; taps feel unresponsive (vs. console/desktop where tactile)
- Control scheme copy-pasted from web; requires TWO hands, impossible on 1-handed play
- No one-handed mode; 50% of mobile players play one-handed

**Prevention:**
- Reticle size ≥2cm at 5" screen; scale with device size
- Movement: circle drag from center OR two-thumb arcade style (both valid)
- Haptic on hit/power-up; optional (players with old iPhone can disable)
- Pressure sensitivity: light tap = move, hard tap = hold = charge shot
- One-handed mode: all controls map to right half of screen

---

### Pitfall 6: Network/Sync Failures Cascade Into Data Loss

**What goes wrong:**
- Player loses signal mid-run; game freezes or crashes
- Progress not saved to cloud; player loses 10 min of effort
- Sync conflict: device offline, local save != cloud save, merge fails
- Player rage-quits; never returns

**Prevention:**
- Auto-save every 30 sec (IndexedDB + cloud async)
- Graceful offline mode: game pauses, retries sync in background
- Conflict resolution: cloud always wins; local wipe + resync
- Toast notification: "saved to cloud" every 1 min to build trust

---

### Pitfall 7: Initial App Store Launch Quality Too Low

**What goes wrong:**
- App icon muddy/small font; unrecognizable vs. competitors
- Screenshots don't show gameplay; show UI only
- Description text: generic, no "why play this"
- No translations for major markets (Spanish, French, German, Chinese)
- Builds submitted with debug logging enabled; console errors visible

**Prevention:**
- Quality gate before store submission:
  - 5 different screenshots: action shot, progression screen, shop, difficulty/boss, cosmetics unlock
  - Icon: test at 1024×1024, then scale down; ensure readable at app store size
  - Description: 1–2 lines hook (e.g., "Survive 5 bosses, build crazy synergies, dominate leaderboards")
  - Translations: English (US/UK), Spanish, French, German, Chinese (simplified + trad), Japanese
  - Build check: no console.log, no network errors on startup

---

### Pitfall 8: No Analytics Infrastructure → Can't Debug Issues

**What goes wrong:**
- Player reports "game broken", no trace of what happened
- D1 retention is 18% but no idea which cohort (version, device, region) is dropping
- A/B test monetization strategy with no data
- Crash logs hidden; can't prioritize bug fixes

**Prevention:**
- Instrument early (Phase 2–3):
  - Event tracking: session start/end, phase completed, IAP purchased, ad watched
  - Device telemetry: device model, OS version, network type, battery %
  - Crash logging SDK (Sentry, Bugsnag)
  - Heat maps: where do players tap most? (reticle area? shop?)
  - Cohort analysis: track D1/D7/P30 by version, device tier, install source
- Phase detection gates:
  - Phase 4: Analytics dashboard live; can slice D1 by device/version
  - Phase 6: Soft launch data aggregated in live dashboard

---

## Minor Pitfalls

### Pitfall 9: Cosmetics Priced Too High or Too Low

**Narrative:** Cosmetics seem frivolous; easy to underprice. But cosmetics are often 40–60% of F2P revenue.
- Too high (e.g., $4.99 for skin): players never buy; feels predatory
- Too low (e.g., $0.99): low margin; doesn't scale revenue
- No cosmetic drop randomization; players can predict what's coming

**Prevention:**
- Cosmetic pricing: $1.99–$2.99 for skins, $4.99 for season pass/battle pass
- Rare drops: 10% chance per 3 runs; RNG keeps players engaged ("chasing skins")
- Cosmetic stat: purely visual; no gameplay advantage (preserve fairness)

---

### Pitfall 10: Difficulty Spike at Boss Transitions

**Narrative:** Boss introduced but neither tuned for player skill progression nor telegraphed in tutorial.

**Prevention:**
- Tutorial boss: easy, teaches one new mechanic
- Each phase boss: 1–2 attack patterns harder than previous
- Audio/visual telegraph: 1.5 sec warning before boss attack (red flash, audio cue)

---

### Pitfall 11: Update Cadence Too Slow (Soft Launch → Launch Gap)

**Narrative:** Soft launch bug fixes take 5 days per update cycle. Players get stale content impression.

**Prevention:**
- Hotfix process: critical bugs patched within 24h (store approval expedite)
- Content calendar: new cosmetics/events every 2 weeks during soft → maintain momentum
- Live dashboard: monitor retention/crashes in real-time; iterate fast

---

## Phase-Specific Warning Map

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|----------------|-----------|
| Phase 2 (Mobile UX) | Touch controls | Pitfall #5 | Test on actual devices; one-handed mode |
| Phase 2–3 | Performance | Pitfall #2 | Profile on mid-range phones weekly |
| Phase 3 (Monetization) | Ads/IAP balance | Pitfall #1 | Soft launch gates on D1/D7 retention |
| Phase 3–4 | Progression design | Pitfall #4 | Playtest curve; ensure phase unlocks feel rewarding |
| Phase 4–5 | Analytics | Pitfall #8 | Instrumentation live before content push |
| Phase 5 (Polish) | App store quality | Pitfall #7 | Asset review gate; translations ready 2 weeks before launch |
| Phase 6 (Soft Launch) | Regional rollout | Pitfall #3 | Schedule soft launch 4 weeks before store submission |
| Phase 6 | Network resilience | Pitfall #6 | Test offline/sync under poor connectivity |

---

## Early Warning Signs

**Check these weekly to catch pitfalls before they escalate:**

1. **Performance**: Frame rate on Pixel 4a or iPhone 11 (should be ≥45fps, ideally 60fps)
2. **Retention**: If available, measure D1 after major changes (target ≥20% for casual arcade)
3. **Crash logs**: Any new error pattern emerging? Investigate top 3 immediately
4. **Cosmetic sales**: If running any IAP feature test, track conversion rate (target ≥2–3%)
5. **Session length**: Stays 8–12 min? If trending down, progression might be too slow
6. **Review drift**: Watch for "ads too aggressive" or "too hard" mention uptick
7. **Device coverage**: List all devices tested this week; ensure ≥5 different models across tiers

---

## Sources

- **Mobile monetization insights:** Tenjin blog (unit economics, IAA/IAP balance)
- **Soft launch best practices:** Appfigures, Apptopia mobile app analytics reports
- **Performance optimization:** Unity Mobile Optimization Guide, Canvas profiling tools
- **Arcade game design:** GDC talks on difficulty scaling and progression in roguelikes
- **Community validation:** r/gamedev, Pocket Gamer forums — recurring themes from shipped projects
