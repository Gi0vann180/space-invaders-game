import { describe, expect, it } from 'vitest'
import { resolveBossProjectileCollisions } from '../../src/game/systems/collisionSystem'
import { createBossForStage } from '../../src/game/entities/boss'

describe('US2 boss defeat threshold', () => {
  it('derrota boss quando vida chega a zero', () => {
    const boss = {
      ...createBossForStage(10),
      x: 100,
      y: 100,
      width: 50,
      height: 40,
      health: 1,
      maxHealth: 1
    }

    const result = resolveBossProjectileCollisions(boss, [
      {
        id: 'shot-1',
        origin: 'player',
        kind: 'default',
        x: 110,
        y: 110,
        width: 4,
        height: 12,
        speedY: -420,
        speedX: 0,
        damage: 1
      }
    ])

    expect(result.bossDefeated).toBe(true)
    expect(result.boss).toBeNull()
  })
})
