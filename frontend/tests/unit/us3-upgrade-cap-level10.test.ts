import { describe, expect, it } from 'vitest'
import {
  EMPTY_UPGRADE_LEVELS,
  MAX_UPGRADE_LEVEL,
  SHOP_CATALOG,
  canPurchaseShopItem,
  purchaseShopItem
} from '../../src/services/shopService'

describe('US3 upgrade level cap', () => {
  it('bloqueia compra ao atingir nível 10', () => {
    const speed = SHOP_CATALOG.find((item) => item.id === 'upgrade-speed')!
    const maxed = {
      ...EMPTY_UPGRADE_LEVELS,
      'upgrade-speed': MAX_UPGRADE_LEVEL
    }

    expect(canPurchaseShopItem(9999, maxed, speed)).toBe(false)

    const result = purchaseShopItem(9999, maxed, speed)
    expect(result.purchased).toBe(false)
    expect(result.upgradeLevels['upgrade-speed']).toBe(MAX_UPGRADE_LEVEL)
    expect(result.score).toBe(9999)
  })
})
