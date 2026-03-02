import { describe, expect, it } from 'vitest'
import { addOrRefreshPowerUp, removeExpiredPowerUps } from '../../src/game/systems/powerUpSystem'

describe('US2 power-up stacking', () => {
  it('permite coexistência de tipos diferentes e refresh do mesmo tipo', () => {
    const now = 1_000
    const withSpeed = addOrRefreshPowerUp([], 'speed', now, 5)
    const withTwoTypes = addOrRefreshPowerUp(withSpeed, 'shield', now, 4)

    expect(withTwoTypes).toHaveLength(2)

    const refreshedSpeed = addOrRefreshPowerUp(withTwoTypes, 'speed', now + 3_000, 5)
    expect(refreshedSpeed).toHaveLength(2)

    const speed = refreshedSpeed.find((item) => item.type === 'speed')
    expect(speed?.expiresAtMs).toBe(9_000)
  })

  it('remove power-ups expirados', () => {
    const now = 10_000
    const list = [
      { type: 'speed' as const, expiresAtMs: 11_000 },
      { type: 'shield' as const, expiresAtMs: 9_000 }
    ]

    const active = removeExpiredPowerUps(list, now)
    expect(active).toHaveLength(1)
    expect(active[0].type).toBe('speed')
  })
})
