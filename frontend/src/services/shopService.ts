export type ShopItemId = 'upgrade-fire-rate' | 'upgrade-speed' | 'upgrade-shield'

export type UpgradeLevels = Record<ShopItemId, number>

export type PermanentUpgradePurchaseResult =
  | {
      purchased: true
      score: number
      previousLevel: number
      newLevel: number
      upgradeLevels: UpgradeLevels
    }
  | {
      purchased: false
      score: number
      previousLevel: number
      newLevel: number
      reason: 'MAX_LEVEL_REACHED' | 'INSUFFICIENT_SCORE'
      upgradeLevels: UpgradeLevels
    }

export const MAX_UPGRADE_LEVEL = 10

export const EMPTY_UPGRADE_LEVELS: UpgradeLevels = {
  'upgrade-fire-rate': 0,
  'upgrade-speed': 0,
  'upgrade-shield': 0
}

export type ShopItem = {
  id: ShopItemId
  name: string
  description: string
  baseCostPoints: number
  levelCostStep: number
}

export const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'upgrade-fire-rate',
    name: 'Cadência +',
    description: 'Reduz cooldown de tiro',
    baseCostPoints: 90,
    levelCostStep: 20
  },
  {
    id: 'upgrade-speed',
    name: 'Velocidade +',
    description: 'Aumenta velocidade da nave',
    baseCostPoints: 80,
    levelCostStep: 18
  },
  {
    id: 'upgrade-shield',
    name: 'Escudo',
    description: 'Concede 1 vida extra',
    baseCostPoints: 140,
    levelCostStep: 30
  }
]

export function getUpgradeLevel(upgradeLevels: UpgradeLevels, itemId: ShopItemId): number {
  return upgradeLevels[itemId] ?? 0
}

export function getUpgradePurchaseCost(item: ShopItem, currentLevel: number): number {
  return item.baseCostPoints + currentLevel * item.levelCostStep
}

export function canPurchaseShopItem(score: number, upgradeLevels: UpgradeLevels, item: ShopItem): boolean {
  const currentLevel = getUpgradeLevel(upgradeLevels, item.id)
  if (currentLevel >= MAX_UPGRADE_LEVEL) {
    return false
  }

  return score >= getUpgradePurchaseCost(item, currentLevel)
}

export function purchaseShopItem(score: number, upgradeLevels: UpgradeLevels, item: ShopItem): {
  score: number
  upgradeLevels: UpgradeLevels
  purchased: boolean
} {
  if (!canPurchaseShopItem(score, upgradeLevels, item)) {
    return {
      score,
      upgradeLevels,
      purchased: false
    }
  }

  const currentLevel = getUpgradeLevel(upgradeLevels, item.id)
  const purchaseCost = getUpgradePurchaseCost(item, currentLevel)
  const nextLevel = Math.min(MAX_UPGRADE_LEVEL, currentLevel + 1)

  return {
    score: score - purchaseCost,
    upgradeLevels: {
      ...upgradeLevels,
      [item.id]: nextLevel
    },
    purchased: true
  }
}

export function purchasePermanentUpgrade(
  score: number,
  upgradeLevels: UpgradeLevels,
  item: ShopItem
): PermanentUpgradePurchaseResult {
  const currentLevel = getUpgradeLevel(upgradeLevels, item.id)
  if (currentLevel >= MAX_UPGRADE_LEVEL) {
    return {
      purchased: false,
      score,
      previousLevel: currentLevel,
      newLevel: currentLevel,
      reason: 'MAX_LEVEL_REACHED',
      upgradeLevels
    }
  }

  const purchaseCost = getUpgradePurchaseCost(item, currentLevel)
  if (score < purchaseCost) {
    return {
      purchased: false,
      score,
      previousLevel: currentLevel,
      newLevel: currentLevel,
      reason: 'INSUFFICIENT_SCORE',
      upgradeLevels
    }
  }

  const nextLevel = Math.min(MAX_UPGRADE_LEVEL, currentLevel + 1)
  return {
    purchased: true,
    score: score - purchaseCost,
    previousLevel: currentLevel,
    newLevel: nextLevel,
    upgradeLevels: {
      ...upgradeLevels,
      [item.id]: nextLevel
    }
  }
}

export function listActiveUpgrades(upgradeLevels: UpgradeLevels): ShopItemId[] {
  return (Object.keys(upgradeLevels) as ShopItemId[]).filter((itemId) => upgradeLevels[itemId] > 0)
}
