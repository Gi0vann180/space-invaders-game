import { describe, expect, it } from 'vitest'
import { getStageConfig } from '../../src/game/config/stages'

describe('US2 offensive pressure scaling', () => {
  it('aumenta pressão ofensiva entre fases', () => {
    const early = getStageConfig(1)
    const later = getStageConfig(4)

    expect(later.enemyProjectileSpeed).toBeGreaterThan(early.enemyProjectileSpeed)
    expect(later.maxConcurrentEnemyProjectiles).toBeGreaterThanOrEqual(early.maxConcurrentEnemyProjectiles)
    expect(later.enemyFireIntervalSeconds).toBeLessThan(early.enemyFireIntervalSeconds)
  })
})
