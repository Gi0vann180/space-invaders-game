import type { BossAttackPatternId, BossEntity } from '../../src/game/entities/boss'

export function makeBossFixture(partial: Partial<BossEntity> = {}): BossEntity {
  return {
    id: 'boss-stage-1',
    stage: 1,
    x: 320,
    y: 64,
    width: 96,
    height: 56,
    health: 18,
    maxHealth: 18,
    points: 300,
    attackCooldownSeconds: 1,
    attackTimer: 0,
    patternIds: ['burst-3'],
    patternCursor: 0,
    ...partial
  }
}

export function makePatternCycle(patternIds: BossAttackPatternId[]): BossAttackPatternId[] {
  return [...patternIds]
}
