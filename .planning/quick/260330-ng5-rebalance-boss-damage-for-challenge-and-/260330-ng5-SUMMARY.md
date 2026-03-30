---
phase: quick
plan: 260330-ng5
subsystem: game-engine, ui
tags: [canvas, projectile, boss, hud, layout, tailwind]

provides:
  - "createBossProjectile factory with 2x damage for boss encounters"
  - "HUD positioned in normal document flow above game canvas"
affects: [boss-encounters, ui-layout]

tech-stack:
  added: []
  patterns:
    - "Dedicated projectile factory per entity type (player, enemy, boss)"

key-files:
  created: []
  modified:
    - frontend/src/game/entities/projectile.ts
    - frontend/src/game/systems/bossAttackSystem.ts
    - frontend/src/components/HUD.tsx
    - frontend/src/App.tsx

key-decisions:
  - "Boss projectile damage set to 2 (double regular enemy) without stage scaling to keep lint clean"
  - "HUD moved to normal flow as sibling before canvas container, not overlay"

requirements-completed: []

duration: 5min
completed: 2026-03-30
---

# Quick 260330-ng5: Rebalance Boss Damage and Move HUD Above Canvas

**Boss projectiles deal 2 damage per hit (2x regular enemies) and HUD renders above canvas in normal document flow**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-30T20:07:12Z
- **Completed:** 2026-03-30T20:11:55Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Boss encounters now feel distinctly more dangerous with 2 damage per hit vs 1 for regular enemies
- All three boss attack patterns (line-5, targeted-2, burst-3) use the new createBossProjectile factory
- HUD no longer overlaps gameplay area -- sits in normal document flow between title bar and canvas
- Full validate (typecheck + lint + test) passes clean with 83/83 tests

## Task Commits

Each task was committed atomically:

1. **Task 1: Create boss projectile with higher damage and update boss attack system** - `d6b571c` (feat)
2. **Task 1 lint fix: Remove unused stage param** - `e997a90` (fix)
3. **Task 2: Move HUD outside the canvas container** - `c7c622f` (feat)

## Files Created/Modified
- `frontend/src/game/entities/projectile.ts` - Added createBossProjectile factory (damage:2, size 6x14, id prefix b-)
- `frontend/src/game/systems/bossAttackSystem.ts` - Replaced all createEnemyProjectile calls with createBossProjectile
- `frontend/src/components/HUD.tsx` - Removed absolute positioning, changed header to div, added mb-3 spacing
- `frontend/src/App.tsx` - Moved HUD component outside canvas container div, placed before it as sibling

## Decisions Made
- Removed the `stage` parameter from createBossProjectile because ESLint `no-unused-vars` rule (with --max-warnings=0) rejects unused params even with underscore prefix. The parameter can be re-added when stage-based damage scaling is implemented.
- Boss projectile uses `origin: 'enemy'` and `kind: 'default'` to maintain compatibility with existing collision detection systems.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed unused stage parameter from createBossProjectile**
- **Found during:** Task 2 verification (lint check)
- **Issue:** Plan specified a `stage: number` parameter for future scaling, but ESLint no-unused-vars with --max-warnings=0 rejects it
- **Fix:** Removed the stage parameter entirely from createBossProjectile and all call sites in bossAttackSystem.ts
- **Files modified:** frontend/src/game/entities/projectile.ts, frontend/src/game/systems/bossAttackSystem.ts
- **Verification:** npm run lint passes clean
- **Committed in:** e997a90

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor signature change to pass lint. No functional impact -- base damage of 2 is the immediate fix as planned.

## Issues Encountered
None

## Known Stubs
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Boss damage rebalancing is complete and ready for playtesting
- HUD layout fix eliminates visual conflict for all future UI work

---
*Quick task: 260330-ng5*
*Completed: 2026-03-30*
