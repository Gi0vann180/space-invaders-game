import { describe, expect, it } from 'vitest'
import { createEnemyGrid } from '../../src/game/entities/enemy'
import { emitEnemyProjectiles, stepEnemies, type WaveState } from '../../src/game/systems/waveSystem'

describe('US1 enemy fire', () => {
  it('emite projétil inimigo quando cooldown permite e respeita limite por fase', () => {
    const wave: WaveState = {
      stage: 1,
      enemies: createEnemyGrid(1),
      boss: null,
      direction: 1
    }

    const advancedWave = stepEnemies(wave, 1, 800)
    const firstShot = emitEnemyProjectiles(advancedWave, [], 400)
    expect(firstShot.projectiles.filter((p) => p.origin === 'enemy')).toHaveLength(1)
    expect(firstShot.wave.enemies.some((enemy) => enemy.fireTimer > 0)).toBe(true)

    const secondShot = emitEnemyProjectiles(firstShot.wave, firstShot.projectiles, 400)
    expect(secondShot.projectiles.filter((p) => p.origin === 'enemy')).toHaveLength(1)
  })
})
