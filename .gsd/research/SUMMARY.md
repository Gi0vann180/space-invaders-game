# Project Research Summary

**Project:** Space Invaders-inspired browser shooter to Android-first mobile release
**Domain:** Mobile arcade shooter productization on top of an existing web game
**Researched:** 2026-03-09
**Confidence:** HIGH

## Executive Summary

This project should be treated as a productization effort, not a rewrite and not a simple packaging task. The research is consistent: keep the current React + TypeScript + Vite + Canvas stack as the source of truth, wrap it in a thin Capacitor Android shell, and focus the first roadmap phases on mobile core feel. For this game category, experts do not win by adding more systems early. They win by making touch controls readable, retries fast, progression legible, and interruptions survivable on real Android devices.

The recommended approach is to harden the current architecture around four clear boundaries: app shell, game runtime, profile/progression domain, and platform-mobile adapters. That enables the team to add Android lifecycle handling, haptics, splash/readiness gates, safe-area behavior, and release tooling without leaking native concerns into gameplay code. Product-side priorities are equally clear: touch-first controls, combat readability, onboarding-through-play, faster session loops, cleaner rewards, and a stronger novelty cadence across runs.

The main risks are also aligned across the research. The biggest failure mode is shipping a technically packaged build that still feels like a cramped desktop game on glass. Secondary risks are late discovery of performance and memory problems on lower-tier Android devices, uncontrolled scope creep hidden inside "polish", and premature expansion into backend, PvP, live ops, or complex monetization. Those risks are best mitigated by sequencing the roadmap around mobile loop validation first, platform/repository boundaries second, content/progression expansion third, and release hardening before launch.

## Key Findings

### Recommended Stack

The stack recommendation is conservative for good reason: the existing web game already has the right core shape for this milestone. The lowest-risk path is to preserve the current React shell for menus and overlays, keep gameplay in the imperative Canvas runtime, and ship inside Capacitor as an Android App Bundle through Google Play.

**Core technologies:**
- React UI shell: menus, HUD, overlays, settings, and shop remain in the web layer because they already fit this codebase.
- TypeScript: keeps gameplay, progression, and mobile edge-case work maintainable as the product surface expands.
- Vite: remains the build boundary that produces the web bundle synced into the native shell.
- Canvas runtime: stays authoritative for simulation and rendering; a rewrite into another engine is not justified for v1.
- Capacitor + Android shell: adds the native packaging and lifecycle hooks needed for a real mobile product with minimal rewrite.
- Capacitor plugins for App, Haptics, Splash Screen, and Status Bar: these are the highest-value native integrations for feel and lifecycle correctness.
- IndexedDB behind repositories: acceptable for local-first progression in v1, but it needs a migration-safe abstraction boundary.
- Sentry for React + Capacitor: the recommended observability layer for Android-specific crashes and regressions.
- Google Play AAB + Play App Signing + testing tracks: the standard release path and should be planned early, not appended at the end.

Critical version and policy constraints:
- Target Android 15 / API 35+ for new Play submission.
- Keep Android minimum aligned with Capacitor support baseline, currently API 24+.
- Publish as AAB and use Play App Signing.

### Expected Features

The strongest research conclusion is that launch quality depends more on interaction quality than on adding breadth. The table stakes are touch-first control tuning, combat readability, onboarding by play, fast retry loops, clear results and rewards, progression framing, resilience across app interruptions, and basic mobile comfort/accessibility options. The product should feel authored and premium through clarity, responsiveness, and cadence, not through menu sprawl.

**Must have (table stakes):**
- Touch-first control pass with comfort options and forgiving hit perception.
- Combat readability and telegraphing cleanup for small screens.
- Onboarding that teaches movement, danger, and rewards through play.
- Fast retry flow with low-friction session restarts.
- Clear end-of-run rewards and progression framing.
- Pause/resume and state continuity across app interruptions.
- Basic accessibility and comfort settings such as readable UI, audio sliders, shake reduction, and touch target sizing.

**Should have (competitive differentiators):**
- Discovery-driven unlock map tied to mastery and play patterns.
- Distinct ship/build identities with readable tradeoffs instead of pure stat inflation.
- Mastery objectives and skill-based rewards that reinforce arcade identity.
- A deliberate audiovisual identity pass that increases premium feel without exploding scope.

**Defer (v2+ or late-v1):**
- Daily or rotating challenge runs until the base loop is reliably replayable.
- Broader social surface beyond lightweight leaderboards.
- Live-ops calendars, event churn, and multi-currency economy layers.
- Real-time PvP, co-op, guilds, shard/gacha systems, energy timers, or backend-heavy retention systems.

### Architecture Approach

The architecture research is the highest-confidence area and gives a clean roadmap backbone. The project should preserve the current web-first runtime, then formalize a stable session facade between React and the engine, split volatile run state from persistent profile state, isolate IndexedDB behind repositories, and introduce a platform adapter layer for Capacitor-specific behavior. The Android shell remains thin and owns packaging, lifecycle bridging, system UI, splash, haptics, and release plumbing only.

**Major components:**
1. App shell: React-owned screens, HUD, overlays, settings, safe-area layout, and navigation.
2. Game session facade: stable command/query bridge between UI and runtime, including pause/resume and progression-related actions.
3. Game runtime: fixed loop, rendering, input, combat, stage flow, economy resolution, and performance policy.
4. Progression/profile domain: durable unlocks, currencies, upgrades, settings, and player-facing state separate from active run state.
5. Persistence and network adapters: IndexedDB repositories, optional leaderboard sync, telemetry, and asset-loading infrastructure.
6. Platform-mobile layer: Capacitor app lifecycle, back handling, haptics, splash readiness, and system UI integration.

### Critical Pitfalls

1. **Treating the port as packaging instead of redesigning the phone experience**: prevent this by making mobile core feel the acceptance gate before store/export work dominates the roadmap.
2. **Shipping desktop-style controls into a touch-first action game**: redesign for thumb ergonomics, larger targets, strong tactile/visual feedback, and real-device validation.
3. **Ignoring performance, thermal, and low-memory behavior until late**: define device tiers, frame budgets, memory budgets, and soak-test scenarios in the first technical phase.
4. **Letting scope creep hide inside vague “polish” buckets**: require measurable user outcomes for each phase and cut backend, multiplayer, live ops, and heavy monetization from MVP.
5. **Neglecting app lifecycle and interruption handling**: treat pause, resume, process death, backgrounding, and offline continuity as core gameplay scenarios, not QA edge cases.

## Implications for Roadmap

Based on the combined research, the roadmap should be dependency-driven and mobile-first. The correct sequence is not content first and not store work first. It is: prove the touch-based core loop on real devices, stabilize boundaries that make mobile behavior safe to add, then deepen progression/content, and only after that complete release hardening and monetization/compliance work.

### Phase 1: Mobile Core Loop Validation
**Rationale:** The largest product risk is shipping a build that is technically mobile but still feels like a desktop prototype.
**Delivers:** Touch-first controls, HUD/readability pass, onboarding by play, fast retry flow, small-screen UX rewrite, first-session validation on real Android devices.
**Addresses:** Touch controls, combat readability, onboarding, fast session loop, end-of-run clarity, comfort settings.
**Avoids:** Packaging-first failure, desktop-control carryover, glanceability issues, and shallow phone-session pacing.

### Phase 2: Architecture Hardening And Android Shell
**Rationale:** Once the core loop feels right, the team needs stable seams so Android lifecycle and persistence changes do not spread coupling through the codebase.
**Delivers:** Game session facade, separation of session/profile/app state, repository boundary over IndexedDB, Capacitor integration, platform-mobile adapters, splash/readiness gating, back-button policy, haptics, status/system UI handling.
**Uses:** React, TypeScript, Vite, Canvas runtime, Capacitor, IndexedDB abstraction, Sentry.
**Implements:** App shell, game-session, persistence, and platform-mobile architecture components.
**Avoids:** Native conditionals leaking everywhere, direct UI-to-engine mutation, brittle save schema growth, and lifecycle regressions.

### Phase 3: Performance, Resilience, And Device Hardening
**Rationale:** Android-first quality depends on stable frame pacing and interruption survival across a device matrix, not just on one dev phone.
**Delivers:** Device tiers, quality policy, frame/memory budgets, asset-loading rules, pause/resume/process-death recovery, soak testing, low-memory resilience, compatibility validation across aspect ratios and lower-end phones.
**Addresses:** Mid-session resilience, mobile comfort, stable startup, fair run continuity.
**Avoids:** Thermal regressions, low-memory kills, compatibility blind spots, and “works on my phone” release failure.

### Phase 4: Progression Framing, Novelty Cadence, And Identity Layer
**Rationale:** Deeper retention systems only make sense after input, architecture, and technical stability are trustworthy.
**Delivers:** Clearer unlock framing, better run-result communication, improved reward integrity, novelty cadence across early/mid game, one identity-level differentiator such as discovery-driven unlocks or mastery objectives, and distinct ship/build tradeoffs.
**Addresses:** Progression clarity, novelty cadence, build identity, mastery reinforcement.
**Avoids:** Overbuilt F2P meta, shallow replay loop, and menu labor caused by too many parallel systems.

### Phase 5: Release Pipeline, Compliance, And Launch Readiness
**Rationale:** Mobile release operations are part of the product and should be validated before launch, not after feature completion.
**Delivers:** Play Console setup, internal and closed testing tracks, signed AAB workflow, store assets, pre-review checks, staged rollout plan, crash/vitals monitoring, minimal post-launch triage process, and monetization review only if the core loop has earned trust.
**Addresses:** Store readiness, testing flow, operational visibility, safe rollout.
**Avoids:** Submission delays, policy surprises, uncontrolled public launch, and premature monetization damage.

### Phase Ordering Rationale

- Input and readability come first because every later progression or content decision depends on whether the action feels fair and understandable on touch.
- Facade, repository, and platform boundaries come before bigger meta systems because they reduce coupling and make lifecycle/save work tractable.
- Performance and resume resilience must be proven before content scale-up, otherwise art and effects become liabilities tied to unstable budgets.
- Progression/novelty work should start only after the game is trustworthy on mobile, so retention systems amplify a solid loop instead of compensating for weak feel.
- Release and monetization decisions belong after technical and experiential trust is established, because poor session quality plus early monetization is a known review killer.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Touch-control scheme validation may need targeted prototype comparison if the current input model is strongly desktop-shaped.
- **Phase 3:** Device-tier, memory, and thermal strategy may need an explicit compatibility matrix based on the actual intended supported phone range.
- **Phase 5:** Monetization and policy details need focused research if ads, billing, or Play Games Services become part of the launch scope.

Phases with standard patterns (likely skip deeper research):
- **Phase 2:** Capacitor shell setup, lifecycle bridging, status bar, splash, and haptics are well-documented and should be executed from established patterns.
- **Phase 5 release pipeline:** AAB generation, Play App Signing, test tracks, and staged rollout are standard platform workflows.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strongly grounded in official Capacitor, Android, and Google Play guidance, with a clear low-rewrite recommendation. |
| Features | MEDIUM-HIGH | Table stakes are well supported by Android/mobile norms; differentiators are opinionated but fit the project vision well. |
| Architecture | HIGH | Research maps directly onto the current codebase shape and established hybrid-game patterns. |
| Pitfalls | MEDIUM-HIGH | Technical and release risks are strongly documented; product and scoping risks are synthesis-based but credible and consistent. |

**Overall confidence:** HIGH

### Gaps to Address

- Control model choice: the research establishes that touch-first control is mandatory, but the exact control scheme still needs validation against the current gameplay pace and enemy patterns.
- Supported device matrix: the target low-end, mid-range, and high-refresh Android profiles are not yet explicitly defined and should drive performance budgets.
- Current codebase seam quality: architecture direction is clear, but planning should confirm how much of the facade/repository/platform split already exists versus needing extraction.
- Monetization scope: the research strongly argues for restraint, but if launch goals require ads or purchases, that scope needs separate compliance and trust validation.
- Content cadence capacity: novelty cadence is important, but planning should confirm what content-authoring throughput is realistic for the team before committing to large progression surfaces.

## Sources

### Primary (HIGH confidence)
- Android Developers core app quality guidelines — mobile quality expectations, state continuity, responsiveness, accessibility.
- Android Developers game optimization and vitals guidance — slow sessions, memory pressure, compatibility, size, and device quality risks.
- Capacitor official docs — Android shell architecture, build/sync workflow, App/Haptics/Splash/StatusBar integration.
- Google Play official docs — AAB, signing, testing tracks, pre-review checks, staged rollout, and target API requirements.
- Sentry official docs — React and Capacitor observability setup.

### Secondary (MEDIUM confidence)
- Google Play genre listings for mobile space shooters — expectations around feature surface, progression norms, and category conventions.
- Codebase-informed architectural reading — current runtime/UI/store split suggests hardening seams rather than rewriting the stack.

### Tertiary (LOW confidence)
- Product-fit differentiators such as discovery-driven unlocks and mastery objectives — strong recommendations, but they still need validation against the actual balance and content pipeline.

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
