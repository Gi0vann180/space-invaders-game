import { describe, expect, it } from 'vitest'
import { MAX_UPGRADE_LEVEL } from '../../src/game/systems/upgradeSystem'
import { getStageConfig } from '../../src/game/config/stages'

describe('Foundations progression types', () => {
  it('mantém constantes e configuração base válidas', () => {
    expect(MAX_UPGRADE_LEVEL).toBe(10)

    const stage1 = getStageConfig(1)
    expect(stage1.enemyFireIntervalSeconds).toBeGreaterThan(0)
    expect(stage1.maxConcurrentEnemyProjectiles).toBeGreaterThan(0)
  })
})
