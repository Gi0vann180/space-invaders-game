# Architecture Patterns

**Domain:** Mobile-first arcade shooter with campaign progression, boss encounters, and build synergies  
**Researched:** 2026-03-23  
**Status:** Research for Phase 1+ roadmap (architecture evolution)  
**Confidence:** HIGH (validated against current codebase structure)

---

## Recommended Architecture

**Overall Pattern:** Layered event-driven game architecture with explicit separation of concerns:

```
┌────────────────────────────────────────────────────────┐
│         UI Layer (React Components)                    │
│  - Campaign map, run lobby, HUD, overlays, settings   │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│    Game Loop & Event Bus (engine.ts)                  │
│  - Tick orchestration, event publishing               │
│  - Run lifecycle (start → waves → boss → rewards)     │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│    Domain Systems Layer (game/systems/)               │
│  - Wave/enemy progression                            │
│  - Boss encounter state                              │
│  - Build/synergy evaluation                          │
│  - Dynamic event generation & triggers               │
│  - Collision detection & damage                      │
│  - Item drops & persistence                          │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│    Data Structures & Rules (game/types, config/)      │
│  - Campaign definitions (phases, bosses, events)      │
│  - Build tree (upgrade nodes & synergy weights)       │
│  - Entity definitions (projectiles, enemies, items)   │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│    Persistence & Services (services/, lib/)           │
│  - Campaign progress, run state, settings (IndexedDB) │
│  - Leaderboard, telemetry, media preload              │
└────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### 1. Campaign Layer (`game/campaign/`)
**Responsibility:** Long-term progression outside of individual runs  
**State owner:** Persistent campaign progress (unlocked phases, completed bosses, total meta-upgrades)  
**Communicates with:** Run launcher, meta-progression UI, persistence service  

**Key Abstractions:**
- `CampaignState` – which phases/bosses unlocked, meta-upgrade levels (shared across runs)
- `PhaseDefinition` – enemies per wave, boss type, event pool, difficulty multiplier
- `BossDefinition` – health, attack patterns, phase transitions, unique event spawns

**Why separate:** Campaign meta-progression need not update every frame; decoupling from run state simplifies persistence and allows offline campaign map browsing.

---

### 2. Run/Session Layer (`game/runtime/`)
**Responsibility:** Active playthrough state during a single game session  
**State owner:** Mutable run session (player position, enemy positions, score, current build state)  
**Communicates with:** Engine loop, domain systems, run completion callback  

**Key Abstractions:**
- `RunSession` – timestamp started, current level index, player state, enemy list, item inventory, score multiplier
- `RunBuildState` – selected upgrades for this run, active synergies (derived from build choices + events)
- `RunEventState` – events triggered so far, event counter for triggering new ones at thresholds

**Why separate:** Run state is ephemeral; clearing it on death/victory is atomic and simple. Combining with campaign state causes complex cascades on run end.

---

### 3. Build System (`game/builds/`)
**Responsibility:** Manage upgrade tree, synergy logic, and build evaluation per-run  
**State owner:** Upgrade selection tree, synergy graph, modifier calculations  
**Communicates with:** Run session, UI (build picker), event system (event-granted upgrades)  

**Key Abstractions:**
- `UpgradeNode` – ID, cost, prerequisites, synergy tags, stat modifiers (damage %, attack speed, etc.)
- `SynergyRule` – trigger condition (e.g., "3x fire damage upgrades"), bonus multiplier (e.g., +50% fire damage)
- `BuildSnapshot` – resolved upgrades, active synergies, calculated stat deltas

**Why separate:** Synergy evaluation is deterministic and testable. Isolating build logic allows unit testing without simulation. Enables run-specific build state without polluting campaign progress.

---

### 4. Event System (`game/events/`)
**Responsibility:** Generate and evaluate dynamic encounters and conditions during runs  
**State owner:** Event pool, triggered event history, spawn evaluation rules  
**Communicates with:** Run session, build system, systems layer (wave/boss)  

**Key Abstractions:**
- `EventDefinition` – trigger (e.g., "score >= 5000"), effect type (spawn rare enemy, grant random upgrade, modify enemy speed)
- `DynamicEventPool` – weighted list of events drawable per phase
- `EventEvaluator` – determine which events to spawn each tick based on score, wave count, build state

**Why separate:** Events are orthogonal to core mechanics; isolating allows rapid iteration on event tuning without touching wave/collision systems. Event triggers can reference both run progress (score) and build state for cascading variation.

---

### 5. Domain Systems (`game/systems/`)
**Responsibility:** Isolated gameplay rules for wave progression, collision, damage, drops  
**State owner:** None (pure transformation functions)  
**Communicates with:** Engine loop, run session  

**Key Systems:**

#### `waveSystem.ts`
- Updates enemy positions/states
- Evaluates wave completion (all enemies destroyed)
- Depends on: Current wave definition, run score multiplier

#### `bossSystem.ts`
- Boss-specific behavior (phase transitions, attack patterns, vulnerability windows)
- Tracks boss health and phase state
- Depends on: Boss definition, build modifiers (damage taken multiplier)

#### `collisionSystem.ts`
- Detects projectile-enemy, player-enemy, player-item collisions
- Applies damage and status effects
- Emits collision events for UI/audio feedback
- Depends on: Collision configs, synergy modifiers

#### `dropSystem.ts`
- Spawns items on enemy death
- Evaluates drop pools (which items possible given current run state)
- Depends on: Item rarity weights, build state (some builds increase rare drop rates)

#### `progressionSystem.ts`
- Determines if wave/boss defeated, advance progression
- Triggers shop/reward screen between waves
- Decides next wave/phase/victory
- Depends on: Campaign definition, run state

---

### 6. Persistence & Services (`services/`, `lib/`)
**Responsibility:** Local storage, API calls, telemetry  
**State owner:** IndexedDB schema, API responses  
**Communicates with:** App.tsx (lifecycle hooks), engine (telemetry events)  

**Dependencies:**
- `campaignPersistenceService` – save/load campaign progress
- `runSessionService` – persist/restore active run (for resume after app close)
- `leaderboardApi` – submit scores, fetch rankings
- `assetPreloadService` – eagerly load boss sprites, event animations
- `settingsService` – controller sensitivity, audio volume, language

**Why separate:** All I/O is async; isolating allows graceful failure (e.g., leaderboard down doesn't block run). Easy to mock for testing.

---

### 7. Input & Control (`game/input/`)
**Responsibility:** Map touch/keyboard to player actions  
**State owner:** Current input state (pressed keys/touch position)  
**Communicates with:** Player entity update (position/shoot), engine loop  

**Key Abstractions:**
- `InputManager` – track held keys, touch position, buttonspresses
- `ControlScheme` – mobile-specific (touch drag to move, tap to shoot) vs. web (keyboard + mouse)

**Why mobile-first control:** Default to touch-drag (absolute position) + tap; only add keyboard fallback for web dev iteration, not required for store build.

---

## Data Flow

### Main Game Loop Tick (per 16ms on 60fps)

```
1. Input.read()
   └─ Get current player position, shoot state

2. Systems.update() [in order—order matters!]
   ├─ waveSystem.update(wave, input, buildState)
   │  └─ Emit "wave-complete" event if all enemies dead
   ├─ bossSystem.update(boss, collisions, buildState)
   │  └─ Emit "boss-phase-change" or "boss-died" if phase transition/phase end
   ├─ collisionSystem.update(entities, projectiles)
   │  └─ Emit "collision" events with {attacker, defender, damage}
   ├─ dropSystem.update(entities, collisions)
   │  └─ Emit "item-spawned" events
   └─ progressionSystem.update(wave, boss, entities)
      └─ Emit "stage-complete" or "next-wave" as needed

3. EventEvaluator.tick(runScore, waveCount, buildState)
   └─ If trigger conditions met (e.g., score >= next threshold), emit "dynamic-event-triggered"
      └─ Dynamic events may add items, spawn rare enemies, or grant temporary bonuses

4. Engine collects all events
   └─ Update GameSessionState (player pos, enemies, items, score, UI state)

5. Store.setState(gameSessionState)
   └─ React subscribe listeners re-render HUD, overlays

6. Canvas.render(gameSessionState)
   └─ Draw entities, effects, HUD overlay
```

### Campaign → Run Transition

```
user clicks "play phase 5"
  ↓
Campaign.getPhaseDefinition(5)
  ↓
RunSession.create(phaseDefinition, campaignBuildState)
  ├─ Load meta-upgrades (e.g., "permanently +10% HP")
  ├─ Copy campaign build levels into run state
  └─ Reset wave counter, score, enemy list
  ↓
Engine.startRun(runSession)
```

### Upgrade Selection Flow

```
Player completes first wave → shop appears
  ↓
BuildUI calls buildSystem.getAvailableUpgrades(runBuildState, numChoices)
  ├─ Filter upgrades by prerequisites
  ├─ Exclude already-picked
  └─ Weight rare upgrades lower
  ↓
Player clicks upgrade → BuildSystem.selectUpgrade(upgradeId)
  ├─ Add to RunBuildState.selected
  ├─ Recalculate synergies via SynergyEvaluator
  ├─ Update RunBuildState.modifiers (damage +15%, attack speed +20%)
  └─ Emit "build-updated"
  ↓
Engine applied modifiers to next wave spawn
```

### Event Trigger & Effect Flow

```
EventEvaluator.tick() detects score >= 2500 for first time
  ↓
EventSystem.triggerEvent({type: "rare-enemy-spawn", rarity: 3})
  ├─ Emit event to UI (optional screen effect)
  ├─ Call waveSystem.spawnRareEnemy(rarity, buildState)
  └─ Add to RunEventState.history
  ↓
Next wave spawns with +1 rare enemy; collision/loot systems handle rest
```

---

## Suggested Build Order

**Build order prioritizes:**
1. Foundations: Can't build X without Y
2. Value: Unblocks maximum downstream features
3. Testability: Each phase has clear unit/integration test surface

### Phase A: Foundation (Pre-Existing, ~✓)

- [x] Game loop with engine orchestration
- [x] Player movement & collision
- [x] Wave spawn and progression
- [x] Basic drop system
- [x] Store/persistence scaffolding

**Why:** This is your current brownfield state. Don't rebuild—extend from here.

---

### Phase 1: Campaign Meta-Layer

**Build:**
- Campaign state schema (which phases unlocked, boss progress, meta-upgrades)
- Campaign persistence (load/save from IndexedDB)
- Campaign UI (phase selection map, meta-upgrade shop)
- Integrate with run launcher (pass campaign state → run creation)

**Why:** Enables multiple playthroughs with persistent unlocks. Foundation for meta-progression monetization (meta-upgrade IAP). Blocks all downstream phases; campaigns define what runs are possible.

**Dependencies:** None (builds on existing run system)

**Downstream:** Phases 2, 3, 4, 5

---

### Phase 2: Boss Encounters & Phase Transitions

**Build:**
- Boss state machine (phases, health thresholds, attack pattern selection)
- Boss-specific collision tweaks (hit zones, phase damage multipliers)
- Boss victory/defeat handling (drop loot, award score multiplier for next wave, show victory screen)
- Integrate into progressionSystem (boss triggers shop after victory)

**Why:** Core campaign feature—bosses are the milestone in "phase campaign." Required for dramatic difficulty curve and player retention hooks.

**Dependencies:** Phase 1 (campaign definitions include boss specs)

**Downstream:** Phases 3, 4

---

### Phase 3: Build System & Synergies

**Build:**
- Upgrade tree (node structure, prerequisites, stat effects)
- Synergy rule engine (detect active synergies, calculate bonuses)
- Build evaluation (apply active upgrades to entity stats each tick)
- Build UI (upgrade picker with synergy preview)
- Persist run builds (save/load run state with selected upgrades)

**Why:** Enables varied runs and emergent gameplay. High replayability driver. Required for events to reference build state (dynamic events depend on this).

**Dependencies:** Phase 1 (campaign meta-upgrades) and Phase 2 (boss difficulty modulation via build)

**Downstream:** Phases 4, 5

---

### Phase 4: Dynamic Events

**Build:**
- Event definition schema (trigger, effect, rarity weight)
- Event evaluator (detect trigger conditions each tick)
- Event effects executor (rare enemy spawn, grant upgrade, modify boss speed, etc.)
- Event UI (visual feedback for event trigger—screen flash, notification)
- Integrate into campaign/phase definitions (event pools vary per phase)

**Why:** Transforms runs from deterministic to chaotic/replayable. High engagement driver. Requires build state awareness (some events reference player build to e.g., spawn fire enemies if player has fire synergy).

**Dependencies:** Phase 1 (event definitions live in campaign) + Phase 3 (build state awareness)

**Downstream:** Phase 5

---

### Phase 5: Advanced Difficulty & Modifiers

**Build:**
- Difficulty settings (easy/normalhard) with scaling modifiers
- Run modifiers (challenge runs: "no upgrades," "bosses have +50% HP")
- Adaptive difficulty (scale enemy stats based on player run victories count)
- Leaderboard segregation (separate scores by difficulty/modifiers)

**Why:** Enables progression for casual and hardcore players. Required for IAP engagement (unlock challenge modifiers). Prevents soft-lock where difficulty plateau causes abandonment.

**Dependencies:** Phases 1–4 (all difficulty scales apply to existing systems)

**Downstream:** Phase 6 (monetization integration)

---

### Phase 6: Monetization Integration

**Build:**
- Ad placement (reward ads: "+50% score for next wave", optional skippable)
- IAP shop (meta-upgrades, cosmetics, challenge modifiers, ad removal)
- Telemetry (track spend, retention by monetization band, event conversion)
- Graceful ad failure (if ad load fails, still playable)

**Why:** Hybrids (ads + IAP) proven to maximize ARPU in casual mobile. Does not block core gameplay.

**Dependencies:** Phases 1–5 (monetization hooks call existing systems)

**Downstream:** Store release

---

### Phase 7: Mobile-First UX Polish

**Build:**
- Touch optimization (larger hit zones, haptic feedback on collision)
- Responsive layout (landscape-only, handle notches/safe areas on iOS)
- Session resumption (restore run if app closed unexpectedly)
- Audio optimization (mute audio on app pause, preload on game start)

**Why:** Last mile before release. Moves needle on retention significantly, but non-blocking (game plays but feels rough). Requires live playtesting on devices.

**Dependencies:** Phases 1–6 (applies polish to all systems)

**Downstream:** Store release

---

## Patterns to Follow

### Pattern 1: Immutable State Snapshots per Tick

**What:** Each system returns a new state object rather than mutating input.  
**When:** Collision, drop, enemy update—anywhere determinism matters.  
**Example:**

```typescript
// ❌ Bad: mutates input
function updateWave(wave: Wave): void {
  wave.enemies.forEach(e => e.x += e.vx);
  wave.projectiles = wave.projectiles.filter(p => p.alive);
}

// ✅ Good: returns new state
function updateWave(wave: Wave, deltaTime: number): Wave {
  return {
    ...wave,
    enemies: wave.enemies.map(e => ({
      ...e,
      x: e.x + e.vx * deltaTime
    })).filter(e => e.health > 0),
    projectiles: wave.projectiles.map(p => ({
      ...p,
      x: p.x + p.vx * deltaTime
    })).filter(p => p.isAlive)
  };
}
```

**Benefit:** Enables undo/replay for debugging, deterministic replay for replays/analytics, and purely functional testing.

---

### Pattern 2: Event-Driven System Communication

**What:** Systems emit events; engine/run collects and broadcasts via event bus.  
**When:** Collision triggers UI feedback, event spawn triggers build recalculation, boss death triggers shop.  
**Example:**

```typescript
type GameEvent =
  | { type: "collision"; damage: number; position: [x, y] }
  | { type: "enemy-spawned"; id: string; rarity: number }
  | { type: "boss-phase-change"; newPhase: number }
  | { type: "event-triggered"; eventId: string };

function gameLoop(tick: number) {
  const events: GameEvent[] = [];
  
  const newWaveState = waveSystem.update(waveState, events);
  const newBossState = bossSystem.update(bossState, events);
  
  events.forEach(event => {
    if (event.type === "collision") {
      audioSystem.playHitSound(event.position);
      vfxSystem.spawnImpactEffect(event.position);
    }
  });
  
  store.setState({ waveState: newWaveState, bossState: newBossState });
}
```

**Benefit:** Systems remain loosely coupled. UI/audio/VFX easily subscribe. Easy to add telemetry by listening to event stream. Simplifies replay (replay events instead of resimulating).

---

### Pattern 3: Config-Driven Definitions

**What:** Game data (enemies, boss patterns, events) lives in config objects, not hardcoded.  
**When:** Tuning difficulty, adding new waves, defining synergies.  
**Example:**

```typescript
// ❌ Bad: hardcoded wave
const wave1 = createWave([
  { type: "shooter", count: 3, speed: 50 },
  { type: "drone", count: 2, speed: 30 }
]);

// ✅ Good: config-driven
const WAVE_DEFINITIONS: Record<number, WaveConfig> = {
  1: {
    enemies: [
      { type: "shooter", count: 3, speed: 50, spacing: 80 },
      { type: "drone", count: 2, speed: 30, spacing: 100 }
    ],
    duration: 30000,
    spawnRate: 0.05
  }
};

const waveState = waveSystem.spawn(WAVE_DEFINITIONS[currentWaveIndex]);
```

**Benefit:** Non-programmers (designers) can tune via JSON/YAML. A/B test variants without rebuilds. Enables server-side balance patches (send updated configs).

---

### Pattern 4: Synergy as Stateless Function

**What:** Build synergies are pure functions: (upgrades[]) → modifiers{}  
**When:** Applying build bonuses to entities, checking synergy triggers.  
**Example:**

```typescript
function evaluateSynergies(selectedUpgradeIds: string[], gameDefinitions: GameDefinitions): Modifiers {
  const selectedUpgrades = selectedUpgradeIds.map(id => gameDefinitions.upgrades[id]);
  const modifiers: Modifiers = { damageMult: 1, attackSpeedMult: 1, armorMult: 1 };
  
  // Fire synergy: 3+ fire upgrades → +50% fire damage
  const fireUpgrades = selectedUpgrades.filter(u => u.tags.includes("fire"));
  if (fireUpgrades.length >= 3) {
    modifiers.fireElementMult = 1.5;
  }
  
  // Crit chain: 2+ crit upgrades → crit hits also restore 10% ammo
  const critUpgrades = selectedUpgrades.filter(u => u.tags.includes("crit"));
  if (critUpgrades.length >= 2) {
    modifiers.critAmmoRestore = 0.1;
  }
  
  return modifiers;
}
```

**Benefit:** Trivial to test. Easy to preview synergies in UI ("select this upgrade and get +50% fire damage if you also have X"). Deterministic for replays.

---

### Pattern 5: Layer Persistence Calls

**What:** Never call persistence (IndexedDB, API) from hot-path systems; always thru a services layer.  
**When:** Saving campaign, posting leaderboard, loading assets.  
**Example:**

```typescript
// ❌ Bad: I/O in game loop
function progressionSystem.completeRun(runState) {
  // ... 
  await campaignService.saveCampaignProgress(newProgress); // BLOCKS GAME LOOP!
}

// ✅ Good: emit event, queue save async
function progressionSystem.completeRun(runState): GameEvent {
  return { type: "run-completed", runState };
}

function gameLoop() {
  const events = systems.update();
  const runCompleteEvent = events.find(e => e.type === "run-completed");
  if (runCompleteEvent) {
    // Fire and forget—don't wait
    campaignService.saveCampaignProgress(runCompleteEvent.runState).catch(err => {
      console.warn("Save failed:", err);
      // Fallback: save to localStorage, retry on next session
    });
  }
}
```

**Benefit:** Game loop never stalls on network. Graceful fallback if persistence fails. Analytics can log events without blocking.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Cross-System Mutation

**What:** Systems mutate each other's state directly.  
**Why bad:** Hard to reason about, creates hidden dependencies, breaks replay/undo, causes cascading bugs.  
**Instead:** Emit events; let engine coordinate updates.

```typescript
// ❌ Bad
waveSystem.enemies.forEach(e => {
  buildModifier = buildSystem.getModifier(e.type);
  e.health *= buildModifier.healthMult; // 😱 mutation across systems!
});

// ✅ Good
const modifiers = buildSystem.evaluateSynergies(runState.selectedUpgrades);
const newWaveState = waveSystem.applyModifiers(waveState, modifiers);
```

---

### Anti-Pattern 2: God Object Engine

**What:** Engine becomes 10,000-line file that handles everything.  
**Why bad:** Unmaintainable, untestable, single point of failure.  
**Instead:** Split systems explicitly; engine coordinates, not executes.

```typescript
// ❌ Bad: 🗑️ god object
class Engine {
  update() {
    // 2000 lines of wave logic
    // 2000 lines of boss logic
    // 2000 lines of collision logic
    // ...
  }
}

// ✅ Good: thin coordinator
class Engine {
  update() {
    const waveEvents = waveSystem.update(this.waveState);
    const bossEvents = bossSystem.update(this.bossState, waveEvents);
    const collisionEvents = collisionSystem.update(this.entities, waveEvents, bossEvents);
    this.eventBus.emit(waveEvents, bossEvents, collisionEvents);
  }
}
```

---

### Anti-Pattern 3: Hard-Coded Boss Patterns

**What:** Each boss has its own monolithic state machine.  
**Why bad:** Hard to test, hard to reuse patterns, hard to tune difficulty.  
**Instead:** Boss patterns defined as data; engine evaluates.

```typescript
// ❌ Bad
class BossEncounter {
  update() {
    if (this.phase === 1 && this.healthPercent < 0.5) {
      this.phase = 2;
      this.attackType = "spiral"; // hardcoded
      this.attackRate = 0.8;
    }
  }
}

// ✅ Good
const BOSS_DEFINITIONS = {
  boss_1: {
    phases: [
      { hp: 1.0, attackType: "beam", rate: 0.5 },
      { hp: 0.5, attackType: "spiral", rate: 0.8 },
      { hp: 0.2, attackType: "barrage", rate: 1.2 }
    ]
  }
};

function bossSystem.update(boss, definition) {
  const phaseConfig = definition.phases.find(p => boss.healthPercent <= p.hp);
  return { ...boss, attackType: phaseConfig.attackType, attackRate: phaseConfig.rate };
}
```

---

### Anti-Pattern 4: Synchronous API Calls

**What:** Wait for network in game loop (leaderboard POST, asset fetch, A/B config fetch).  
**Why bad:** Stuttering UI, poor UX, unresponsive game.  
**Instead:** Load async in background; cache defaults locally.

```typescript
// ❌ Bad
function startGame() {
  const abtTestVariant = fetch("/api/ab-test/difficulty").then(r => r.json()); // BLOCKS!
  applyDifficulty(abtestVariant);
}

// ✅ Good
async function initializeAsync() {
  try {
    const config = await fetch("/api/ab-test/difficulty").then(r => r.json());
    settingsService.setABTestVariant(config);
  } catch (e) {
    settingsService.setABTestVariant(settingsService.getCachedDefault());
  }
}

function startGame() {
  const variant = settingsService.getABTestVariant(); // always have a value
  applyDifficulty(variant);
}

// Init async in background on app load
window.addEventListener("load", initializeAsync);
```

---

### Anti-Pattern 5: Events Without Serialization

**What:** Events contain functions, circular refs, or unmatchable types.  
**Why bad:** Can't log to analytics (JSON.stringify fails), can't replay, can't remote debug.  
**Instead:** Events are pure data; emit side-effects via handlers.

```typescript
// ❌ Bad
const event = {
  type: "collision",
  callback: () => audioSystem.playSound(), // 😱 can't serialize
  entity: playerEntity // circular refs possible
};

// ✅ Good
const event = {
  type: "collision",
  damage: 10,
  playerPosition: [100, 200],
  enemyId: "e_42"
};

eventBus.on("collision", (event) => {
  audioSystem.playSound(event.damage);
  vfxSystem.spawnEffect(event.playerPosition);
});
```

---

## Scalability Considerations

| Concern | At 100K runs/month | At 1M runs/month | At 10M runs/month |
|---------|-------------------|------------------|-------------------|
| **Leaderboard:** Single IndexedDB vs. server-authoritative | IndexedDB sufficient + monthly server export | Need server-authoritative w/ regional shards | Regional Redis + Postgres archive |
| **Event Pool:** Hardcoded events in binary vs. server config | Hardcoded works; minor patches reload app | Server-driven event pools via config API | A/B tested event variants, per-region pools |
| **Build Balance:** Manual JSON tuning vs. data-driven system | Manual suffices; tune in config between releases | Build telemetry system; auto-flag imbalanced builds | Real-time auto-scaling (reduce overpowered build rewards) |
| **Asset Delivery:** Bundle all sprites vs. lazy-load | Bundle ~5MB of sprites in binary | Selective lazy-load per campaign; CDN-backed | Cloud-hosted asset updates, delta patches |
| **Campaign Definition:** 10 phases hardcoded | 20 phases in JSON config file | 50+ phases in server config; dynamic chapter unlocks | Procedural campaign generation with content guardrails |

---

## Next Phase: Practical Integration Steps

To implement this architecture incrementally without breaking current code:

1. **Phase 1 start:** Add `game/campaign/` module with `CampaignState` type and `campaignStore`. Don't touch engine loop yet.
2. **Phase 2 start:** Create `game/events/` module similarly; wire into event bus after waveSystem.update().
3. **Phase 3 start:** Refactor `game/systems/` functions to accept modifiers; create `buildSystem` to calculate them via SynergyEvaluator.
4. **Each phase:** Add integration tests in `tests/integration/` *before* wiring into engine. Verify in isolation first.
5. **Testing boundary:** All systems remain pure functions with clear input/output, making test coverage high and reliable.

---

## Sources & Rationale

**Patterns (HIGH confidence):** 
- Validated against current codebase (canvas loop, systems, store, persistence separation already follows core principles)
- Alignment with established game dev best practices (event bus for loose coupling, immutable state snapshots for determinism, config-driven definitions for balance tuning)
- Rogue-lite / synergy systems reference: Hades (supergiant games), Slay the Spire (roguelike deckbuilding as analogue for build synergies), Risk of Rain 2 (dynamic events + build scaling)

**Mobile arcade shooters:** Space Invaders-like structure remains unchanged; this architecture scales it vertically (more content, adaptive difficulty, build depth) without architectural break.

**Build ordering:** Ordered by foundational dependency analysis—Phase 1 (campaign) must exist before bosses can be selected; Phase 3 (builds) must exist before events reference build state; Phase 5–6 build on Phases 1–4.

---

