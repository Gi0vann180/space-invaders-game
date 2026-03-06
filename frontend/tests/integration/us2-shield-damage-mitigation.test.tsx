import { describe, expect, it } from 'vitest'
import { createPlayer } from '../../src/game/entities/player'
import { resolveEnemyProjectileHitsPlayer } from '../../src/game/systems/collisionSystem'

describe('US2 shield damage mitigation', () => {
  it('escudo ativo impede perda de vida por projétil inimigo', () => {
    const player = createPlayer(800, 480)

    const hitWithoutShield = resolveEnemyProjectileHitsPlayer(
      player,
      [
        {
          id: 'enemy-hit',
          origin: 'enemy',
          kind: 'default',
          x: player.x + 5,
          y: player.y + 3,
          width: 4,
          height: 12,
          speedY: 220,
          speedX: 0
        }
      ],
      0,
      false
    )

    const hitWithShield = resolveEnemyProjectileHitsPlayer(
      player,
      [
        {
          id: 'enemy-hit-2',
          origin: 'enemy',
          kind: 'default',
          x: player.x + 5,
          y: player.y + 3,
          width: 4,
          height: 12,
          speedY: 220,
          speedX: 0
        }
      ],
      0,
      true
    )

    expect(hitWithoutShield.playerHitCount).toBe(1)
    expect(hitWithShield.playerHitCount).toBe(0)
  })
})
