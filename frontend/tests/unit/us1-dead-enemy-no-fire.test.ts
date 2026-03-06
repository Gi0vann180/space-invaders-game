import { describe, expect, it } from 'vitest'
import { emitEnemyProjectiles, type WaveState } from '../../src/game/systems/waveSystem'

describe('US1 dead enemy no fire', () => {
  it('não emite projétil quando não há inimigos vivos', () => {
    const wave: WaveState = {
      stage: 2,
      enemies: [],
      boss: null,
      direction: 1
    }

    const result = emitEnemyProjectiles(wave, [], 400)
    expect(result.projectiles).toHaveLength(0)
  })
})
