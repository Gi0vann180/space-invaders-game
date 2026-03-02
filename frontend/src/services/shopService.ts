export type ShopItemId = 'upgrade-fire-rate' | 'upgrade-speed' | 'upgrade-shield'

export type ShopItem = {
  id: ShopItemId
  name: string
  description: string
  costPoints: number
}

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'upgrade-fire-rate',
    name: 'Cadência +',
    description: 'Reduz cooldown de tiro',
    costPoints: 120
  },
  {
    id: 'upgrade-speed',
    name: 'Velocidade +',
    description: 'Aumenta velocidade da nave',
    costPoints: 100
  },
  {
    id: 'upgrade-shield',
    name: 'Escudo',
    description: 'Concede 1 vida extra',
    costPoints: 180
  }
]

export function canPurchaseShopItem(score: number, ownedItems: ShopItemId[], item: ShopItem): boolean {
  if (ownedItems.includes(item.id)) {
    return false
  }

  return score >= item.costPoints
}

export function purchaseShopItem(score: number, ownedItems: ShopItemId[], item: ShopItem): {
  score: number
  ownedItems: ShopItemId[]
} {
  if (!canPurchaseShopItem(score, ownedItems, item)) {
    return {
      score,
      ownedItems
    }
  }

  return {
    score: score - item.costPoints,
    ownedItems: [...ownedItems, item.id]
  }
}
