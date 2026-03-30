import { describe, expect, it } from 'vitest'
import { createBossForStage } from '../../src/game/entities/boss'
import { getStageConfig } from '../../src/game/config/stages'

describe('Foundations boss/powerups types', () => {
  it('stage config expõe parâmetros de chefe', () => {
    const stage = getStageConfig(1)

    expect(stage.bossHealth).toBeGreaterThan(0)
    expect(stage.bossAttackIntervalSeconds).toBeGreaterThan(0)
    expect(stage.bossPatternIds.length).toBeGreaterThan(0)
  })

  it('cria chefe com dados coerentes da fase', () => {
    const boss = createBossForStage(2)

    expect(boss.id).toContain('boss-stage-2')
    expect(boss.profileId).toBe('phase-2-volt-weaver')
    expect(boss.displayName).toBe('Volt Weaver')
    expect(boss.health).toBe(boss.maxHealth)
    expect(boss.patternIds.length).toBeGreaterThan(0)
  })
})
