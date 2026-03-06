import { describe, expect, it } from 'vitest'
import { getStageConfig } from '../../src/game/config/stages'

describe('US2 stage difficulty monotonic', () => {
  it('não reduz pressão ofensiva ao avançar fases', () => {
    const stage1 = getStageConfig(1)
    const stage2 = getStageConfig(2)
    const stage5 = getStageConfig(5)

    expect(stage2.enemySpeedMultiplier).toBeGreaterThanOrEqual(stage1.enemySpeedMultiplier)
    expect(stage2.enemyProjectileSpeed).toBeGreaterThanOrEqual(stage1.enemyProjectileSpeed)
    expect(stage2.maxConcurrentEnemyProjectiles).toBeGreaterThanOrEqual(stage1.maxConcurrentEnemyProjectiles)
    expect(stage2.enemyFireIntervalSeconds).toBeLessThanOrEqual(stage1.enemyFireIntervalSeconds)

    expect(stage5.enemySpeedMultiplier).toBeGreaterThanOrEqual(stage2.enemySpeedMultiplier)
    expect(stage5.enemyProjectileSpeed).toBeGreaterThanOrEqual(stage2.enemyProjectileSpeed)
    expect(stage5.maxConcurrentEnemyProjectiles).toBeGreaterThanOrEqual(stage2.maxConcurrentEnemyProjectiles)
    expect(stage5.enemyFireIntervalSeconds).toBeLessThanOrEqual(stage2.enemyFireIntervalSeconds)
  })
})
