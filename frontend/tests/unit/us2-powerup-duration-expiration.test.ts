import { describe, expect, it } from 'vitest'
import { addOrRefreshPowerUp, removeExpiredPowerUps } from '../../src/game/systems/powerUpSystem'

describe('US2 power-up duration and expiration', () => {
  it('ativa e expira power-up pelo tempo configurado', () => {
    const now = 5_000
    const active = addOrRefreshPowerUp([], 'laser', now)

    expect(active).toHaveLength(1)
    expect(active[0].expiresAtMs).toBeGreaterThan(now)

    const afterExpiry = removeExpiredPowerUps(active, active[0].expiresAtMs + 1)
    expect(afterExpiry).toHaveLength(0)
  })
})
