import { describe, expect, it } from 'vitest'
import { createRareDrop, isDropExpired } from '../../src/game/entities/dropItem'
import { pickRandomSpecialShot, shouldSpawnRareDrop } from '../../src/game/systems/dropSystem'

describe('Foundation drop types', () => {
  it('cria drop raro com tempo de expiracao coerente', () => {
    const drop = createRareDrop({
      enemyId: 'enemy-10',
      x: 100,
      y: 120,
      nowMs: 5_000,
      grantedShotType: 'laser'
    })

    expect(drop.expiresAtMs).toBeGreaterThan(drop.spawnedAtMs)
    expect(drop.grantedShotType).toBe('laser')
  })

  it('valida expiracao de drop por timestamp', () => {
    const drop = createRareDrop({
      enemyId: 'enemy-11',
      x: 100,
      y: 120,
      nowMs: 1_000,
      grantedShotType: 'homing-missile'
    })

    expect(isDropExpired(drop, drop.expiresAtMs - 1)).toBe(false)
    expect(isDropExpired(drop, drop.expiresAtMs)).toBe(true)
  })

  it('rolagem de raridade e sorteio de tiro sao deterministas por seed', () => {
    expect(shouldSpawnRareDrop(3)).toBe(true)
    expect(shouldSpawnRareDrop(95)).toBe(false)
    expect(pickRandomSpecialShot(2)).toBe('laser')
    expect(pickRandomSpecialShot(3)).toBe('homing-missile')
  })
})
