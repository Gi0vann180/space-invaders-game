import { describe, expect, it } from 'vitest'
import { EMPTY_UPGRADE_LEVELS, SHOP_CATALOG, purchaseShopItem } from '../../src/services/shopService'

describe('US3 upgrade increment', () => {
  it('incrementa exatamente +1 nível por compra válida', () => {
    const speed = SHOP_CATALOG.find((item) => item.id === 'upgrade-speed')!
    const first = purchaseShopItem(1000, { ...EMPTY_UPGRADE_LEVELS }, speed)

    expect(first.purchased).toBe(true)
    expect(first.upgradeLevels['upgrade-speed']).toBe(1)

    const second = purchaseShopItem(first.score + 1000, first.upgradeLevels, speed)
    expect(second.upgradeLevels['upgrade-speed']).toBe(2)
  })
})
