import { describe, expect, it } from 'vitest'
import { createDropFixture } from '../fixtures/drop-fixtures'
import { createPlayer } from '../../src/game/entities/player'
import { resolvePlayerDropCollisions } from '../../src/game/systems/collisionSystem'
import { removeExpiredDrops } from '../../src/game/systems/dropSystem'

describe('US3 drop lifecycle', () => {
  it('coleta drop ao colidir com jogador e remove da lista', () => {
    const player = createPlayer(800, 480)
    const drop = createDropFixture({ x: player.x + 2, y: player.y + 2 })

    const result = resolvePlayerDropCollisions(player, [drop])
    expect(result.drops).toHaveLength(0)
    expect(result.collectedShots).toHaveLength(1)
  })

  it('remove drop expirado por tempo', () => {
    const drop = createDropFixture({ expiresAtMs: 2000 })
    const active = removeExpiredDrops([drop], 1999)
    const expired = removeExpiredDrops([drop], 2000)

    expect(active).toHaveLength(1)
    expect(expired).toHaveLength(0)
  })
})
