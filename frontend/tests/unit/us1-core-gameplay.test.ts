import { describe, expect, it } from 'vitest'
import { createPlayer, movePlayer, tickPlayer, tryConsumeShot } from '../../src/game/entities/player'
import { resolvePlayerProjectileCollisions } from '../../src/game/systems/collisionSystem'
import type { EnemyEntity } from '../../src/game/entities/enemy'
import type { ProjectileEntity } from '../../src/game/entities/projectile'

describe('US1 core gameplay', () => {
  it('move player dentro dos limites e dispara com cooldown', () => {
    const player = createPlayer(800, 480)
    const movedLeft = movePlayer(player, -1, 1, 800)
    expect(movedLeft.x).toBeGreaterThanOrEqual(0)

    const [afterShot, firstShot] = tryConsumeShot(player)
    expect(firstShot).toBe(true)

    const [, secondShot] = tryConsumeShot(afterShot)
    expect(secondShot).toBe(false)

    const cooledDown = tickPlayer(afterShot, 1)
    const [, thirdShot] = tryConsumeShot(cooledDown)
    expect(thirdShot).toBe(true)
  })

  it('remove inimigo e projétil quando há colisão', () => {
    const enemies: EnemyEntity[] = [
      {
        id: 'enemy-1',
        x: 100,
        y: 80,
        width: 36,
        height: 24,
        health: 1,
        points: 10,
        fireCooldownSeconds: 1.8,
        fireTimer: 0
      }
    ]

    const projectiles: ProjectileEntity[] = [
      {
        id: 'p-1',
        origin: 'player',
        kind: 'default',
        x: 100,
        y: 80,
        width: 4,
        height: 12,
        speedY: -400,
        speedX: 0,
        damage: 1
      }
    ]

    const result = resolvePlayerProjectileCollisions(enemies, projectiles)

    expect(result.enemies).toHaveLength(0)
    expect(result.projectiles).toHaveLength(0)
    expect(result.defeatedEnemyCount).toBe(1)
  })
})
