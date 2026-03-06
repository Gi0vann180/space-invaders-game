import type { PlayerEntity } from '../entities/player'
import { MAX_UPGRADE_LEVEL, type ShopItemId, type UpgradeLevels } from '../../services/shopService'
import { getScaledUpgradeEffect } from './powerUpSystem'

export { MAX_UPGRADE_LEVEL }

export function applyPlayerUpgrades(player: PlayerEntity, upgradeLevels: UpgradeLevels): PlayerEntity {
  const next = { ...player }

  const speedLevel = Math.min(MAX_UPGRADE_LEVEL, upgradeLevels['upgrade-speed'] ?? 0)
  const fireRateLevel = Math.min(MAX_UPGRADE_LEVEL, upgradeLevels['upgrade-fire-rate'] ?? 0)

  if (speedLevel > 0) {
    next.speed += getScaledUpgradeEffect('upgrade-speed', speedLevel)
  }

  if (fireRateLevel > 0) {
    next.fireCooldown = Math.max(0.08, next.fireCooldown - getScaledUpgradeEffect('upgrade-fire-rate', fireRateLevel))
  }

  return next
}

export function getShieldLevel(upgradeLevels: UpgradeLevels): number {
  return getScaledUpgradeEffect('upgrade-shield', upgradeLevels['upgrade-shield'] ?? 0)
}

export function hasShieldUpgrade(upgradeLevels: UpgradeLevels): boolean {
  return getShieldLevel(upgradeLevels) > 0
}

export function getUpgradeLevel(upgradeLevels: UpgradeLevels, upgradeId: ShopItemId): number {
  return Math.min(MAX_UPGRADE_LEVEL, upgradeLevels[upgradeId] ?? 0)
}
