import { createPowerUp, type PowerUpInstance, type PowerUpType } from '../entities/powerUp'
import { MAX_UPGRADE_LEVEL, type ShopItemId } from '../../services/shopService'
import { POWER_UPS } from '../config/powerups'

function hasPowerUpConfig(type: string): type is PowerUpType {
  return Object.prototype.hasOwnProperty.call(POWER_UPS, type)
}

export function addOrRefreshPowerUp(
  activePowerUps: PowerUpInstance[],
  type: PowerUpType,
  nowMs: number,
  durationSeconds?: number
): PowerUpInstance[] {
  if (!hasPowerUpConfig(type)) {
    return activePowerUps
  }

  const config = POWER_UPS[type]
  const configuredDuration = durationSeconds ?? config.durationSeconds
  const nextPowerUp = createPowerUp(type, nowMs, configuredDuration, config.conflictGroup)
  const filteredByConflict = activePowerUps.filter((powerUp) => powerUp.conflictGroup !== config.conflictGroup)
  const sameTypeIndex = filteredByConflict.findIndex((powerUp) => powerUp.type === type)

  if (sameTypeIndex === -1) {
    return [...filteredByConflict, nextPowerUp]
  }

  const next = [...filteredByConflict]
  next[sameTypeIndex] = nextPowerUp
  return next
}

export function removeExpiredPowerUps(activePowerUps: PowerUpInstance[], nowMs: number): PowerUpInstance[] {
  return activePowerUps.filter((powerUp) => powerUp.expiresAtMs > nowMs)
}

export function hasActivePowerUp(activePowerUps: PowerUpInstance[], type: PowerUpType): boolean {
  return activePowerUps.some((powerUp) => powerUp.type === type)
}

export function getActiveWeaponPowerUp(activePowerUps: PowerUpInstance[]): PowerUpType | null {
  if (hasActivePowerUp(activePowerUps, 'laser')) {
    return 'laser'
  }

  if (hasActivePowerUp(activePowerUps, 'homing-missile')) {
    return 'homing-missile'
  }

  return null
}

export function getScaledUpgradeEffect(upgradeId: ShopItemId, level: number): number {
  const safeLevel = Math.max(0, Math.min(MAX_UPGRADE_LEVEL, level))

  if (upgradeId === 'upgrade-speed') {
    return safeLevel * 20
  }

  if (upgradeId === 'upgrade-fire-rate') {
    return safeLevel * 0.02
  }

  return safeLevel
}
