# Domain Pitfalls

**Domain:** Android-first mobile adaptation of an existing browser shooter
**Researched:** 2026-03-09
**Overall confidence:** MEDIUM-HIGH

## Critical Pitfalls

### Pitfall 1: Treating the mobile port as a packaging task instead of a game redesign
**What goes wrong:** Teams assume the browser loop is already "the game" and spend roadmap effort on wrappers, exports, and store assets before fixing whether the core 30 to 90 second play loop actually feels good on touch, short sessions, and phone-sized screens.
**Why it happens:** The prototype already works in a browser, so there is a false sense that shipping is mostly technical conversion.
**Consequences:** The team reaches beta with a functioning build that still feels like a cramped desktop game on glass. Retention collapses even if the build is stable.
**Warning signs:** Early builds still use desktop pacing, tiny HUD elements, keyboard-era dodge expectations, or progression screens that feel acceptable only on large monitors.
**Prevention strategy:** Put "mobile core feel" ahead of platform plumbing in the roadmap. Require a vertical slice where a new player can install, understand controls, survive early waves, upgrade, and replay entirely on phone without external explanation. Treat session length, restart speed, readability, and thumb reach as first-class acceptance criteria.
**Which phase should address it:** Phase 1 - Mobile core loop validation.

### Pitfall 2: Shipping desktop-style controls into a touch-first action game
**What goes wrong:** The web prototype's input model is copied directly, producing controls that are too precise, too cramped, or too dependent on hover, drag, or simultaneous gestures that feel unreliable on phones.
**Why it happens:** Browser shooters are usually tuned around keyboard precision or mouse movement. Touch support is added late as a thin compatibility layer.
**Consequences:** Missed taps, finger occlusion, accidental inputs, player fatigue, and immediate churn. The game can be technically playable but subjectively unfair.
**Warning signs:** Small tap targets, important information hidden behind hover-like affordances, drag controls fighting scroll behavior, or QA notes such as "works if you already know what the button does" and "my thumb covers the ship/enemy."
**Prevention strategy:** Redesign controls for one-handed and two-thumb play, not for pointer parity. Lock in larger hit areas, low-ambiguity gestures, explicit feedback on press, and a fallback control scheme if the first choice underperforms. Test on real low-to-mid Android phones, not only desktop emulation.
**Which phase should address it:** Phase 1 - Input and UX foundation.

### Pitfall 3: Ignoring performance and thermal behavior until late content polish
**What goes wrong:** The game feels fine during short desktop tests, but on Android it drops frames after a minute, overheats devices, throttles, and accumulates slow sessions.
**Why it happens:** Web prototypes are often validated on powerful desktop hardware and short play bursts. Mobile thermal limits and frame pacing are discovered only after art and effects are layered on.
**Consequences:** Jank during combat, battery complaints, lower store visibility risk, and device-specific bad reviews that are expensive to unwind late.
**Warning signs:** Frame rate is measured only informally, performance tests are under one minute, combat effects spike frame time, or devices get warm during repeated runs.
**Prevention strategy:** Add a performance budget phase early. Define target device tiers, acceptable frame-time thresholds, and soak-test scenarios. Track FPS, slow-session proxies, and thermal degradation from the first mobile slice. Cut expensive effects before they become content dependencies.
**Which phase should address it:** Phase 1 - Performance budget and rendering discipline; revisit in Phase 3 - Optimization and certification.

### Pitfall 4: Underestimating low-memory behavior on cheaper Android devices
**What goes wrong:** Asset-heavy builds survive on the dev phone but get killed or relaunched on low-RAM devices during gameplay, app switching, ads, or resume.
**Why it happens:** Solo teams test on one or two good devices and assume crashes are the main stability problem. In practice, low-memory kills and memory churn also destroy UX.
**Consequences:** Lost runs, broken resume flows, negative reviews framed as "the game closes randomly," and extra support load without obvious stack traces.
**Warning signs:** Large atlases/audio bundles loaded all at once, no memory profiling snapshots, no resume-state recovery, or bugs that happen mostly after backgrounding the app.
**Prevention strategy:** Budget memory per device tier. Load only what early play actually needs, stream or defer noncritical assets, and design the game to survive process death and resume cleanly. Profile memory before content expansion, not after.
**Which phase should address it:** Phase 1 - Runtime architecture and asset-loading rules; verify again in Phase 3 - Device hardening.

### Pitfall 5: Letting scope creep hide inside "polish"
**What goes wrong:** The roadmap uses vague buckets like polish, juice, meta progression, events, cloud save, social features, controller support, and accessibility, but each bucket quietly contains weeks of work.
**Why it happens:** Browser projects often reach a stage where the next needs feel like finishing touches. On mobile, those finishing touches are often product systems.
**Consequences:** Endless milestone slippage, half-implemented features, and a product that is broader but not more shippable.
**Warning signs:** Backlog items are phrased as nouns instead of testable outcomes, or the plan keeps adding adjacent systems before the install-to-first-session path is stable.
**Prevention strategy:** Split roadmap items into measurable user outcomes. Force every proposed feature to answer: does this improve day-1 retention, technical quality, or store readiness enough to justify its cost? Default to cutting backend, multiplayer, live ops, and account systems unless they unlock a specific near-term publishability goal.
**Which phase should address it:** Phase 0 - Roadmap framing and cuts.

### Pitfall 6: Adding backend or account complexity too early
**What goes wrong:** Teams add login, cloud inventory, remote config, custom leaderboards, or authoritative progression before proving the offline/local product loop.
**Why it happens:** Existing progression systems make it tempting to preserve every web-era mechanic exactly, including server-shaped assumptions.
**Consequences:** Time disappears into auth, sync conflict handling, moderation, data recovery, and cost management while the actual moment-to-moment game remains under-tested.
**Warning signs:** Core progression cannot function without a network request, or roadmap discussions repeatedly depend on "later we'll need a server for this."
**Prevention strategy:** Make local-first progression the default. Use backend only when a clearly ranked release goal truly requires it. For an Android-first solo project, prefer local saves plus optional platform services later over custom backend now.
**Which phase should address it:** Phase 0 - Product scope decisions.

### Pitfall 7: Building an economy and progression loop that is too web-arcade shallow or too F2P-complex
**What goes wrong:** The game either keeps the prototype's thin reward structure, causing rapid boredom, or overcorrects into currencies, daily systems, missions, and stores that a solo developer cannot balance or support.
**Why it happens:** Prototype progression usually exists, but not at mobile product depth. Teams then jump from "not enough loop" to "full service-game loop."
**Consequences:** Poor retention on one side, unsustainable maintenance burden on the other.
**Warning signs:** Sessions end without a meaningful next goal, upgrades are obvious and linear, or monetization discussions require multiple currencies before the basic mastery loop is fun.
**Prevention strategy:** Plan a compact meta loop: clear unlock cadence, a few high-impact upgrade choices, and one short-term plus one medium-term goal for the player. Avoid daily chores, timers, guilds, or live economy design unless the product already has traction.
**Which phase should address it:** Phase 2 - Meta loop and retention design.

### Pitfall 8: Overbuilding monetization before validating player trust
**What goes wrong:** Ads or IAP are inserted early in awkward places, damaging the loop and sometimes violating user expectations or ad policy norms.
**Why it happens:** Low-cost solo projects feel immediate pressure to monetize, and ads seem easier than improving retention.
**Consequences:** Review damage, poor session continuity, policy risk around disruptive ad placement, and a game that feels cheap before it feels good.
**Warning signs:** Interstitials are proposed before a stable retention target exists, revive/reward loops are not clearly player-initiated, or monetization is compensating for weak progression pacing.
**Prevention strategy:** Delay monetization decisions until the early loop and session flow are already validated. Prefer monetization that aligns with the game rhythm, such as optional rewarded moments after value is demonstrated. Make policy review part of the release checklist before SDK integration.
**Which phase should address it:** Phase 3 - Monetization and compliance.

### Pitfall 9: Treating device compatibility as "it runs on my phone"
**What goes wrong:** The build works on one reference device, but breaks across aspect ratios, densities, refresh rates, GPU/driver combinations, and low-end hardware.
**Why it happens:** Browser development hides much of the Android device matrix until packaging and native behavior enter the picture.
**Consequences:** UI clipping, unreadable HUD, poor performance clusters on specific models, and wasted time on late reactive exclusions.
**Warning signs:** No explicit device tier list, no matrix for aspect ratios and RAM classes, and no rules for degrading visuals on weaker phones.
**Prevention strategy:** Define supported device tiers early and test against them intentionally. Separate "must support" from "best effort." Build configurable quality levels, safe-area aware layouts, and content scaling rules before final art lock.
**Which phase should address it:** Phase 1 - Device support strategy; deepen in Phase 3 - Compatibility pass.

### Pitfall 10: Neglecting app lifecycle, offline, and interruption handling
**What goes wrong:** Incoming calls, app switches, notification interruptions, lost connectivity, or process death leave the game in a broken state.
**Why it happens:** Browser prototypes often assume a continuously active tab and stable session. Mobile users do not play that way.
**Consequences:** Lost progress, duplicated rewards, stuck audio, blank resumes, and player distrust.
**Warning signs:** No pause/resume design, no explicit save checkpoints, audio continues after backgrounding, or testers report that returning to the app feels random.
**Prevention strategy:** Treat pause, resume, restart, and process death as core gameplay scenarios. Decide exactly what is persisted at run start, wave transitions, upgrade screens, and app backgrounding. If any online dependency remains, define graceful offline behavior explicitly.
**Which phase should address it:** Phase 1 - App lifecycle contract; verify again in Phase 3 - Release hardening.

### Pitfall 11: Leaving release operations until the end
**What goes wrong:** The team finishes "the game" and only then discovers store listing work, review issues, test-track requirements, app signing details, or rollout mechanics.
**Why it happens:** Prototype-minded teams separate development from publishing, but on mobile the release process is part of the product.
**Consequences:** Missed launch windows, rushed assets, rejected submissions, and no safe process for first updates.
**Warning signs:** No publishing checklist, no closed-test plan, no store asset pipeline, and no owner for policy declarations or review prep.
**Prevention strategy:** Add release operations as a first-class phase, not an epilogue. Create the Play Console path early, plan closed/internal testing, define pre-review checks, and reserve time for staged rollout and issue response.
**Which phase should address it:** Phase 2 - Release pipeline setup; execute in Phase 4 - Launch readiness.

### Pitfall 12: Mistaking visual polish for product readiness
**What goes wrong:** Teams spend late effort on particles, shaders, and animation layers while onboarding, difficulty curve, performance, and store conversion remain weak.
**Why it happens:** Visual changes are visible and emotionally satisfying, especially for solo developers, while product fixes are harder to showcase.
**Consequences:** The game screenshots improve faster than the shipped experience.
**Warning signs:** Changelog volume is dominated by cosmetic work while crash handling, balancing, tutorials, and settings remain unresolved.
**Prevention strategy:** Gate polish work behind metrics and checklist exits: input readability, first-session comprehension, stable frame pacing, save reliability, settings coverage, and release readiness. Treat juice as a multiplier on a working product, not a substitute for one.
**Which phase should address it:** Phase 2 - Productization gates; enforce again in Phase 4 - Final stabilization.

## Moderate Pitfalls

### Pitfall 13: Shipping without a settings surface sized for mobile reality
**What goes wrong:** Audio, vibration, sensitivity, graphics quality, and accessibility-affecting options are missing or too hidden.
**Warning signs:** Testers ask repeatedly how to mute, reduce effects, or change control feel.
**Prevention strategy:** Include a compact but essential settings surface before broad testing. Prioritize volume, haptics, control layout/sensitivity, performance-quality mode, and notification/privacy items if used.
**Which phase should address it:** Phase 2 - Player comfort and settings.

### Pitfall 14: Relying on a single monetization or retention bet
**What goes wrong:** The project assumes one ad format, one progression gimmick, or one unlock structure will carry the whole product.
**Warning signs:** Roadmap language such as "this should fix retention" attached to one feature.
**Prevention strategy:** Validate loop health with a few distinct retention supports working together: satisfying run cadence, clear unlock goals, light collection/progression, and one non-intrusive monetization path later.
**Which phase should address it:** Phase 2 - Retention tuning.

### Pitfall 15: No plan for post-launch triage under solo-dev constraints
**What goes wrong:** The first public release succeeds enough to generate crashes, device complaints, and balance feedback, but there is no small-team process for prioritizing fixes.
**Warning signs:** No severity rubric, no crash dashboard habit, and no rule for when to hotfix versus defer.
**Prevention strategy:** Define a minimal post-launch operating model before launch: dashboards to check, thresholds that trigger action, and a narrow first-update backlog.
**Which phase should address it:** Phase 4 - Launch and post-launch readiness.

## Minor Pitfalls

### Pitfall 16: Overcommitting to controller, tablet, or PC extras before phone quality is locked
**What goes wrong:** Nice-to-have platform extras absorb time before the Android phone experience is strong.
**Warning signs:** Roadmap debates about gamepad or cross-platform parity happen before touch usability is signed off.
**Prevention strategy:** Keep Android phone as the quality bar. Treat controller, tablet, and PC-specific improvements as stretch work after launch-critical issues are closed.
**Which phase should address it:** Phase 0 - Scope discipline.

### Pitfall 17: Copying browser-era UX text and information density into a small-screen product
**What goes wrong:** Menus, upgrade descriptions, and combat UI remain too text-dense or too tiny.
**Warning signs:** Players need to stop and parse multiple small labels during active play.
**Prevention strategy:** Rewrite UI for glanceability. Short labels, strong iconography, fewer simultaneous stats, and larger hierarchy should be planned before final UI art.
**Which phase should address it:** Phase 1 - HUD and menu redesign.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 0 - Roadmap framing | Calling backend, cloud sync, live ops, or multiplayer "later maybe" without cutting them explicitly | Record these as out-of-scope unless a later milestone is funded by evidence |
| Phase 1 - Mobile core loop | Reusing browser controls and screen layouts | Validate one complete phone-first vertical slice on real devices |
| Phase 1 - Technical base | No budgets for FPS, memory, install size, and resume behavior | Define budgets and device tiers before expanding content |
| Phase 2 - Productization | Expanding meta systems faster than retention evidence supports | Add only the smallest progression systems that strengthen replay intent |
| Phase 2 - Release setup | Leaving console/testing work to the end | Open Play workflow early and plan test-track operations |
| Phase 3 - Optimization | Optimizing globally instead of by worst device clusters | Use device-tier profiling and issue grouping |
| Phase 3 - Monetization/compliance | Forcing ads into weak session flow | Monetize only after the loop is trusted and policy-reviewed |
| Phase 4 - Launch | Full rollout without staged monitoring or triage | Launch with staged rollout, vitals monitoring, and a prepared hotfix plan |

## What Roadmap Planning Should Prevent Early

- A roadmap that starts with export/store work before proving the touch-first loop.
- Any milestone that bundles "polish" with undefined UX, economy, and technical work.
- Any dependency on backend, accounts, or multiplayer for MVP progression.
- A content plan that grows assets before budgets exist for performance, memory, and size.
- A launch plan that does not reserve time for testing tracks, pre-review issues, and staged rollout.

## Sources

- Android vitals overview and thresholds: https://developer.android.com/games/optimize/vitals
- Android game slow sessions guidance: https://developer.android.com/games/optimize/vitals/slow-session
- Android low memory killers guidance: https://developer.android.com/games/optimize/vitals/lmk
- Android device compatibility overview: https://developer.android.com/guide/practices/compatibility
- Android game size guidance: https://developer.android.com/games/optimize/game-size
- Google Play app setup and bundle guidance: https://support.google.com/googleplay/android-developer/answer/9859152
- Google Play pre-review checks: https://support.google.com/googleplay/android-developer/answer/14807773
- Google Play staged rollouts: https://support.google.com/googleplay/android-developer/answer/6346149
- Google Play testing requirements for new personal accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play Better Ads Experiences policy overview: https://support.google.com/googleplay/android-developer/answer/12271244

## Confidence Notes

- HIGH confidence on Android technical quality, compatibility, size, and release-process risks because these are grounded in current Android/Google Play documentation.
- MEDIUM confidence on loop-design and solo-dev scoping pitfalls because they synthesize official platform constraints with established product-pattern analysis rather than a single official source.
