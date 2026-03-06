import { describe, expect, it } from 'vitest'
import { getCycleDifficultyMultiplier } from '../../src/game/config/gameplay'
import { getStageConfig } from '../../src/game/config/stages'

describe('US4 cycle difficulty multiplier', () => {
  it('aumenta multiplicador entre ciclos', () => {
    expect(getCycleDifficultyMultiplier(1)).toBe(1)
    expect(getCycleDifficultyMultiplier(11)).toBeGreaterThan(1)
    expect(getCycleDifficultyMultiplier(21)).toBeGreaterThan(getCycleDifficultyMultiplier(11))
  })

  it('escala parametros de combate em ciclos avancados', () => {
    const stage11 = getStageConfig(11)
    const stage21 = getStageConfig(21)

    expect(stage21.enemySpeedMultiplier).toBeGreaterThan(stage11.enemySpeedMultiplier)
    expect(stage21.bossHealth).toBeGreaterThan(stage11.bossHealth)
  })
})
