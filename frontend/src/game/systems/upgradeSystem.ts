import type { PlayerEntity } from '../entities/player'
import type { ShopItemId } from '../../services/shopService'

export function applyPlayerUpgrades(player: PlayerEntity, upgrades: ShopItemId[]): PlayerEntity {
  const next = { ...player }

  if (upgrades.includes('upgrade-speed')) {
    next.speed += 40
  }

  if (upgrades.includes('upgrade-fire-rate')) {
    next.fireCooldown = Math.max(0.1, next.fireCooldown - 0.07)
  }

  return next
}

export function hasShieldUpgrade(upgrades: ShopItemId[]): boolean {
  return upgrades.includes('upgrade-shield')
}
