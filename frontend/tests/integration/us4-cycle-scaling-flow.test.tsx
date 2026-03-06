import { describe, expect, it } from 'vitest'
import { getStageConfig } from '../../src/game/config/stages'

describe('US4 cycle scaling flow', () => {
  it('ciclo mais avancado aplica maior pressao de combate', () => {
    const cycle1BossStage = getStageConfig(10)
    const cycle2BossStage = getStageConfig(20)

    expect(cycle2BossStage.enemySpeedMultiplier).toBeGreaterThan(cycle1BossStage.enemySpeedMultiplier)
    expect(cycle2BossStage.enemyProjectileSpeed).toBeGreaterThan(cycle1BossStage.enemyProjectileSpeed)
    expect(cycle2BossStage.bossHealth).toBeGreaterThan(cycle1BossStage.bossHealth)
  })
})
