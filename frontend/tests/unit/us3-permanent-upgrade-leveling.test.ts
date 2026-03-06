import { describe, expect, it } from 'vitest'
import {
  EMPTY_UPGRADE_LEVELS,
  MAX_UPGRADE_LEVEL,
  SHOP_CATALOG,
  purchasePermanentUpgrade
} from '../../src/services/shopService'

describe('US3 permanent upgrade leveling', () => {
  it('incrementa exatamente +1 nível por compra válida', () => {
    const item = SHOP_CATALOG.find((entry) => entry.id === 'upgrade-fire-rate')!

    const result = purchasePermanentUpgrade(500, { ...EMPTY_UPGRADE_LEVELS }, item)

    expect(result.purchased).toBe(true)
    expect(result.previousLevel).toBe(0)
    expect(result.newLevel).toBe(1)
    expect(result.upgradeLevels['upgrade-fire-rate']).toBe(1)
  })

  it('bloqueia compra ao atingir nível máximo', () => {
    const item = SHOP_CATALOG.find((entry) => entry.id === 'upgrade-fire-rate')!
    const maxedLevels = {
      ...EMPTY_UPGRADE_LEVELS,
      'upgrade-fire-rate': MAX_UPGRADE_LEVEL
    }

    const result = purchasePermanentUpgrade(9999, maxedLevels, item)

    expect(result.purchased).toBe(false)
    expect(result.reason).toBe('MAX_LEVEL_REACHED')
    expect(result.newLevel).toBe(MAX_UPGRADE_LEVEL)
  })
})
