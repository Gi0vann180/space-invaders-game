# Feature Landscape

**Domain:** Android-first arcade shooter / modern Space Invaders-inspired release
**Researched:** 2026-03-09
**Confidence:** MEDIUM-HIGH
**Scope note:** This file assumes the current foundation already exists: playable run, stages, shop, upgrades, power-ups, settings, and optional leaderboard sync. Recommendations below focus on player-facing features and product qualities needed to make that foundation feel polished and mobile-ready.

## Recommendation Summary

For this project, table stakes are not "more systems". They are tighter touch controls, clearer combat readability, better short-session pacing, stronger onboarding-through-play, and a progression wrapper that makes novelty arrive at the right cadence. The strongest differentiators are the ones that deepen mastery and discovery without turning the game into a heavy live-service economy.

Do **not** chase feature parity with the most monetized mobile shooters. Market leaders commonly pile on PvP, co-op, guilds, VIP tracks, skin churn, event calendars, and currency layers, but player reviews also show those same systems create fatigue, confusion, unfairness, and ad frustration. For this game, polish should mean "easy to enter, satisfying to master, always revealing something new" rather than "always selling the next menu".

## Table Stakes For Mobile Arcade Polish

Features users expect in a polished Android release. Missing these makes the game feel amateur or tiring even if the core loop is already fun.

| Feature Cluster | Why Expected | Complexity | Dependencies | Why It Matters For This Project |
| --- | --- | --- | --- | --- |
| Touch-first control pass | Mobile shooters are expected to feel instantly readable and responsive with drag controls, generous hit perception, and no fighting against the finger. | Med | Input system tuning, collision tuning, camera/UI safe areas | Weak controls are one of the current pain points; this is the highest-leverage fix. |
| Onboarding that teaches by play | Players expect to understand movement, weapon cadence, power-up value, and danger states without reading dense text. | Med | Control pass, combat readability, first-session scripting | Matches the vision of learning by playing instead of reading menus. |
| Fast session loop and low-friction retry | Mobile action games are expected to get players from failure back into action quickly, with clear run length and no dead menu time. | Med | Results flow, save state, reward flow | Reduces repetition fatigue and supports casual play sessions. |
| Combat readability and telegraphing | Players expect bullets, hazards, pickups, and boss tells to be easy to parse on small screens. | Med | VFX cleanup, audio cues, UI scale pass | Mobile frustration often comes from unreadable deaths, not raw difficulty. |
| Clear progression framing | Players expect to know what unlocked, why it matters, and what they are working toward next. | Med | Reward presentation, unlock data, shop UX cleanup | Existing progression loses value if the player cannot see the next interesting goal. |
| Novelty cadence across runs | Even casual shooters are expected to introduce new enemy patterns, modifiers, miniboss behavior, or ship interactions often enough to avoid sameness. | High | Content authoring pipeline, progression gating | Directly addresses the repetitive loop pain point. |
| End-of-run clarity and reward integrity | Players expect clean results screens, transparent rewards, visible progress on goals, and no ambiguity about what was earned or lost. | Low-Med | Telemetry hooks, progression UI, economy messaging | Prevents the run/shop/upgrades loop from feeling muddy or manipulative. |
| Mid-session resilience | Android players expect pause/resume, state restore after interruptions, and not losing progress on app switching, lock, or crash. | Med | Save system, app lifecycle handling | Official Android quality guidance treats state continuity as baseline quality. |
| Mobile accessibility and comfort options | Players expect at least readable UI, large enough touch targets, screen-shake control, audio sliders, and reduced visual overload options. | Low-Med | UI pass, options menu, VFX/audio toggles | Broadens audience reach and reduces fatigue on long play. |
| Fair ad and offer pressure envelope | Mobile players tolerate monetization, but polished products avoid deceptive "no ads", long chains of offers, or interruptions before the core session loop lands. | Med | Economy design, ad placement rules, UI flow | Reviews in genre leaders show monetization friction destroys goodwill quickly. |

## Differentiators That Fit This Product Vision

These are the features most likely to make this game feel authored and memorable instead of like a generic mobile shooter.

| Feature Cluster | Value Proposition | Complexity | Dependencies | Recommendation |
| --- | --- | --- | --- | --- |
| Discovery-driven unlock map | Unlock ships, modifiers, stage branches, enemy intel, or advanced systems through play patterns and mastery rather than only currency spend. | High | Progression framing, content gating, onboarding | Strong fit. This directly supports novelty and learning-by-playing. |
| Build identities with readable tradeoffs | Make each ship or loadout feel like a distinct playstyle with obvious strengths, not just larger numbers. | Med-High | Control tuning, combat readability, rebalance pass | Strong fit. Gives arcade fans expressive mastery without menu bloat. |
| Short-form daily or rotating challenge runs | Add one constrained, fast, remix-style challenge that refreshes a stage, modifiers, or scoring rules. | Med | Novelty cadence, results flow, reward rules | Good post-v1 or late-v1 differentiator if core loop is already polished. |
| Mastery objectives that surface technique | Add optional goals like perfect dodge chains, no-hit segment clears, weapon-specific feats, or boss pattern reads. | Med | Combat readability, telemetry, achievement hooks | Strong fit. Encourages practice and replay without needing PvP. |
| In-world enemy and boss knowledge unlocks | Reveal hints, weak points, pattern notes, or lore fragments as the player survives encounters. | Med | Discovery unlock framework, UI shell | Good fit if kept lightweight; makes repetition feel like study and progress. |
| Streak-based rewards for skill, not grind | Reward consistency, clean clears, and risk-taking instead of pure time spent or ad consumption. | Med | Results flow, scoring integrity, progression tuning | Strong fit. Reinforces arcade identity for both casuals and enthusiasts. |
| Deliberate audiovisual identity pass | Signature screen transitions, impact timing, ship silhouettes, and boss introductions can make the game feel premium without huge content scope. | Med | Readability pass, asset polish | Strong fit for release quality; polish can differentiate more than extra systems. |

## Anti-Features And Scope Traps

These are tempting because the genre leaders use them, but they are poor fits for this milestone.

| Anti-Feature | Why Avoid | What To Do Instead |
| --- | --- | --- |
| Real-time PvP | Hard to balance, netcode-heavy, fairness-sensitive, and will expose control and progression issues before the core loop is fixed. | Use asynchronous score attack, ghost comparison, or curated challenge ladders. |
| Guilds, clans, and co-op live features | Adds social backend, moderation, retention obligations, and event pressure with weak payoff for a polish-focused milestone. | Keep leaderboard sync optional and lightweight. |
| Multi-currency economy with VIP layers | Creates confusion, storefront fatigue, and a perception that progress is manipulated. | Use one soft currency plus a very restrained premium layer, if needed at all. |
| Ship shard gacha or character-collector meta | Pushes the game toward collection compulsion instead of skillful discovery and readable builds. | Unlock ships through progression milestones and mastery goals. |
| Energy timers or aggressive cooldown gates | Undercuts arcade flow and makes short sessions feel artificially blocked. | Let players retry freely; pace progression through challenge, not waiting. |
| Constant event calendar from day one | Requires content ops discipline and usually turns menus into the main game. | Ship one or two curated rotating challenges only after the base experience is solid. |
| Story-heavy campaign delivery | Dialogue, cutscenes, and exposition can slow the loop and dilute the "learn by playing" goal. | Keep fiction atmospheric and sparse through bosses, unlock text, and visual worldbuilding. |
| Forced ads after every run or deceptive no-ads messaging | Player reviews in leading genre games consistently punish this. It destroys trust even when the action is good. | Keep ads opt-in and tied to clear value; avoid blocking the retry loop. |
| Endless parallel progression systems | Miniships, pets, companions, relic grids, equipment trees, and skins all at once create menu labor. | Pick one or two deep systems and make them legible. |

## Feature Dependencies

Core dependency chain:

```text
Touch-first control pass
  -> Combat readability and telegraphing
  -> Onboarding that teaches by play
  -> Mastery objectives and skill-based rewards

Fast session loop
  -> End-of-run clarity
  -> Fair reward integrity
  -> Daily/remix challenge viability

Clear progression framing
  -> Discovery-driven unlock map
  -> Build identities with readable tradeoffs
  -> Novelty cadence landing at the right moments

Mid-session resilience
  -> Reliable mobile retention
  -> Cross-device or cloud-save quality if sync remains enabled
```

Important sequencing note:

- Do not add high-complexity differentiators before the control pass, readability pass, and reward-flow cleanup are stable.
- Do not add social or PvP features before progression fairness and short-session pacing are proven.
- Do not scale content production before there is a reliable novelty cadence template for enemies, bosses, and stage modifiers.

## MVP Recommendation

For a polished Android-first v1, prioritize in this order:

1. Touch-first control pass with comfort options
2. Combat readability and telegraphing cleanup
3. Onboarding that teaches by play in the first sessions
4. Fast retry loop plus clearer end-of-run rewards
5. Progression framing that shows the next meaningful unlock
6. A reliable novelty cadence across the early/mid game
7. One identity-level differentiator: discovery-driven unlocks **or** mastery objectives

Defer to post-v1:

- Daily/remix challenge runs: valuable, but only once the base loop is genuinely replayable.
- Expanded achievements/social surface: useful for retention, but not before the core experience is trustworthy.
- Broad live-ops/event structure: only after content production and economy pacing are stable.

## Confidence And Evidence Notes

- **HIGH confidence:** Mobile quality expectations around state restore, responsiveness, readability, accessibility basics, startup speed, and stable navigation are directly supported by Android quality guidance.
- **MEDIUM confidence:** Table-stakes feature patterns such as bosses, long-tail progression, recurring events, ship collection, and leaderboard visibility are strongly supported by current top-down mobile shooter listings on Google Play.
- **MEDIUM confidence:** The anti-feature list is informed both by genre-leading game structures and by repeated player complaints in public reviews, especially around ad pressure, confusing progression, long levels, and paywall-like event friction.
- **LOW-MEDIUM confidence:** Some differentiators are product-fit recommendations rather than universal market requirements; they are opinionated because they align with this project's stated vision.

## Sources

- Android Developers. Core app quality guidelines. Last updated 2026-02-26. https://developer.android.com/docs/quality-guidelines/core-app-quality
- Android Developers. Quality checklist for Google Play Games Services. Last updated 2026-03-04. https://developer.android.com/games/pgs/quality
- Google Play listing. Galaxiga: Galaxy Arcade Game. Accessed 2026-03-09. https://play.google.com/store/apps/details?id=com.os.space.force.galaxy.alien
- Google Play listing. Space shooter - Galaxy attack. Accessed 2026-03-09. https://play.google.com/store/apps/details?id=com.game.space.shooter2
