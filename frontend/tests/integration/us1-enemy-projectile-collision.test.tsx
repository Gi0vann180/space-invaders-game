import { describe, expect, it } from 'vitest'
import { createPlayer } from '../../src/game/entities/player'
import { resolveEnemyProjectileHitsPlayer } from '../../src/game/systems/collisionSystem'
import type { ProjectileEntity } from '../../src/game/entities/projectile'

describe('US1 enemy projectile collision', () => {
  it('remove projétil inimigo e contabiliza dano no jogador', () => {
    const player = createPlayer(800, 480)
    const projectiles: ProjectileEntity[] = [
      {
        id: 'enemy-shot-1',
        origin: 'enemy',
        kind: 'default',
        x: player.x + 4,
        y: player.y + 2,
        width: 4,
        height: 12,
        speedY: 220,
        speedX: 0
      },
      {
        id: 'player-shot',
        origin: 'player',
        kind: 'default',
        x: player.x,
        y: player.y,
        width: 4,
        height: 12,
        speedY: -440,
        speedX: 0
      }
    ]

    const result = resolveEnemyProjectileHitsPlayer(player, projectiles)

    expect(result.playerHitCount).toBe(1)
    expect(result.projectiles).toHaveLength(1)
    expect(result.projectiles[0].origin).toBe('player')
  })
})
