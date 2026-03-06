import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'
import { EMPTY_UPGRADE_LEVELS, SHOP_CATALOG, purchaseShopItem } from '../../src/services/shopService'

describe('US2 progression and shop flow', () => {
  it('entra na loja ao concluir fase e permite compra válida', () => {
    const progression = evaluateStageProgression(1, 0)
    expect(progression.enterShop).toBe(true)
    expect(progression.nextStage).toBe(2)

    const speedUpgrade = SHOP_CATALOG.find((item) => item.id === 'upgrade-speed')
    expect(speedUpgrade).toBeDefined()

    const purchase = purchaseShopItem(150, { ...EMPTY_UPGRADE_LEVELS }, speedUpgrade!)
    expect(purchase.upgradeLevels['upgrade-speed']).toBe(1)
    expect(purchase.score).toBeLessThan(150)
  })
})
