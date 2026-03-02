import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'
import { SHOP_CATALOG, purchaseShopItem } from '../../src/services/shopService'

describe('US2 progression and shop flow', () => {
  it('entra na loja ao concluir fase e permite compra válida', () => {
    const progression = evaluateStageProgression(1, 0)
    expect(progression.enterShop).toBe(true)
    expect(progression.nextStage).toBe(2)

    const speedUpgrade = SHOP_CATALOG.find((item) => item.id === 'upgrade-speed')
    expect(speedUpgrade).toBeDefined()

    const purchase = purchaseShopItem(150, [], speedUpgrade!)
    expect(purchase.ownedItems).toContain('upgrade-speed')
    expect(purchase.score).toBe(50)
  })
})
