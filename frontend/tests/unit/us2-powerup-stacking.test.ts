import { describe, expect, it } from 'vitest'
import { addOrRefreshPowerUp, removeExpiredPowerUps } from '../../src/game/systems/powerUpSystem'

describe('US2 power-up stacking', () => {
  it('permite coexistência de tipos diferentes e refresh do mesmo tipo', () => {
    const now = 1_000
    const withLaser = addOrRefreshPowerUp([], 'laser', now, 5)
    const withTwoTypes = addOrRefreshPowerUp(withLaser, 'shield', now, 4)

    expect(withTwoTypes).toHaveLength(2)

    const refreshedLaser = addOrRefreshPowerUp(withTwoTypes, 'laser', now + 3_000, 5)
    expect(refreshedLaser).toHaveLength(2)

    const laser = refreshedLaser.find((item) => item.type === 'laser')
    expect(laser?.expiresAtMs).toBe(9_000)
  })

  it('remove power-ups expirados', () => {
    const now = 10_000
    const list = [
      { type: 'laser' as const, startedAtMs: 8_000, conflictGroup: 'weapon' as const, expiresAtMs: 11_000 },
      { type: 'shield' as const, startedAtMs: 8_000, conflictGroup: 'defense' as const, expiresAtMs: 9_000 }
    ]

    const active = removeExpiredPowerUps(list, now)
    expect(active).toHaveLength(1)
    expect(active[0].type).toBe('laser')
  })
})
