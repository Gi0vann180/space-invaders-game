import { describe, expect, it } from 'vitest'
import { pickRandomSpecialShot } from '../../src/game/systems/dropSystem'

describe('US3 random special shot', () => {
  it('sorteia somente tiros especiais permitidos', () => {
    const a = pickRandomSpecialShot(0)
    const b = pickRandomSpecialShot(1)

    expect(['laser', 'homing-missile']).toContain(a)
    expect(['laser', 'homing-missile']).toContain(b)
  })

  it('mantem determinismo por seed', () => {
    expect(pickRandomSpecialShot(10)).toBe(pickRandomSpecialShot(10))
  })
})
