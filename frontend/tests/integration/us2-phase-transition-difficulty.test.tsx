import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'

describe('US2 phase transition difficulty', () => {
  it('entra em boss fight ao limpar inimigos na campanha 1..5', () => {
    const progression = evaluateStageProgression(2, 0, false, false)

    expect(progression.enterBossFight).toBe(true)
    expect(progression.enterShop).toBe(false)
    expect(progression.nextStage).toBe(2)
  })

  it('apos boss derrotado avanca para loja com proxima fase configurada', () => {
    const progression = evaluateStageProgression(2, 0, true, true)

    expect(progression.enterShop).toBe(true)
    expect(progression.nextStage).toBe(3)
    expect(progression.nextStageConfig.stage).toBe(3)
    expect(progression.nextStageConfig.enemySpeedMultiplier).toBeGreaterThan(1)
  })
})
