import { describe, expect, it } from 'vitest'
import { addOrRefreshPowerUp } from '../../src/game/systems/powerUpSystem'

describe('US2 power-up conflict resolution', () => {
  it('substitui power-up de arma ativo quando outro de arma é ativado', () => {
    const now = 1_000
    const withLaser = addOrRefreshPowerUp([], 'laser', now)
    const withHoming = addOrRefreshPowerUp(withLaser, 'homing-missile', now + 500)

    expect(withHoming).toHaveLength(1)
    expect(withHoming[0].type).toBe('homing-missile')
    expect(withHoming[0].conflictGroup).toBe('weapon')
  })
})
