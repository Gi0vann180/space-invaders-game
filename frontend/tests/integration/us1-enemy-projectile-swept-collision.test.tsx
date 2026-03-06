import { describe, expect, it } from 'vitest'
import { createPlayer } from '../../src/game/entities/player'
import { resolveEnemyProjectileHitsPlayer } from '../../src/game/systems/collisionSystem'
import type { ProjectileEntity } from '../../src/game/entities/projectile'

describe('US1 enemy projectile swept collision', () => {
  it('contabiliza dano quando projétil cruza a nave entre frames', () => {
    const player = createPlayer(800, 480)
    const deltaSeconds = 0.1

    const projectileAfterStep: ProjectileEntity = {
      id: 'enemy-fast-shot',
      origin: 'enemy',
      kind: 'default',
      x: player.x + 10,
      y: player.y + player.height + 8,
      width: 4,
      height: 12,
      speedY: 300,
      speedX: 0
    }

    const result = resolveEnemyProjectileHitsPlayer(player, [projectileAfterStep], deltaSeconds)

    expect(result.playerHitCount).toBe(1)
    expect(result.projectiles).toHaveLength(0)
  })
})
