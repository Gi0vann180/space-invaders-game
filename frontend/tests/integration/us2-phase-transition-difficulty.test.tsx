import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'

describe('US2 phase transition difficulty', () => {
  it('retorna configuração da próxima fase ao concluir a atual', () => {
    const progression = evaluateStageProgression(2, 0)

    expect(progression.enterShop).toBe(true)
    expect(progression.nextStage).toBe(3)
    expect(progression.nextStageConfig.stage).toBe(3)
    expect(progression.nextStageConfig.enemySpeedMultiplier).toBeGreaterThan(1)
  })
})
