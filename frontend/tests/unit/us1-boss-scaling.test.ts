import { describe, expect, it } from 'vitest'
import { createBossForStage } from '../../src/game/entities/boss'

describe('US1 boss scaling', () => {
  it('aumenta vida e pressão de ataque em fases mais altas', () => {
    const stage1 = createBossForStage(1)
    const stage4 = createBossForStage(4)

    expect(stage4.maxHealth).toBeGreaterThan(stage1.maxHealth)
    expect(stage4.attackCooldownSeconds).toBeLessThanOrEqual(stage1.attackCooldownSeconds)
    expect(stage4.patternIds.length).toBeGreaterThanOrEqual(stage1.patternIds.length)
  })
})
