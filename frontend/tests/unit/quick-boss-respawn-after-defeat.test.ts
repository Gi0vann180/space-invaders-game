import { describe, it, expect } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'

describe('boss respawn after defeat', () => {
  // Stage 1 is a boss stage (CAMPAIGN_BOSS_STAGE_MAX = 5, stages 1-5 are boss stages)
  const bossStage = 1

  it('enters shop when boss is defeated (bossActive=false, bossDefeated=true)', () => {
    const result = evaluateStageProgression(bossStage, 0, false, true)
    expect(result.enterShop).toBe(true)
    expect(result.enterBossFight).toBe(false)
    expect(result.nextStage).toBe(bossStage + 1)
  })

  it('spawns boss when not active and not defeated (bossActive=false, bossDefeated=false)', () => {
    const result = evaluateStageProgression(bossStage, 0, false, false)
    expect(result.enterShop).toBe(false)
    expect(result.enterBossFight).toBe(true)
  })

  it('stays in fight when boss is active and not defeated (bossActive=true, bossDefeated=false)', () => {
    const result = evaluateStageProgression(bossStage, 0, true, false)
    expect(result.enterShop).toBe(false)
    expect(result.enterBossFight).toBe(false)
  })

  it('enters shop when boss just died but still referenced (bossActive=true, bossDefeated=true)', () => {
    const result = evaluateStageProgression(bossStage, 0, true, true)
    expect(result.enterShop).toBe(true)
    expect(result.enterBossFight).toBe(false)
    expect(result.nextStage).toBe(bossStage + 1)
  })
})
