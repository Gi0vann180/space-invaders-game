import { createPowerUp, type PowerUpInstance, type PowerUpType } from '../entities/powerUp'

export function addOrRefreshPowerUp(
  activePowerUps: PowerUpInstance[],
  type: PowerUpType,
  nowMs: number,
  durationSeconds: number
): PowerUpInstance[] {
  const nextPowerUp = createPowerUp(type, nowMs, durationSeconds)
  const sameTypeIndex = activePowerUps.findIndex((powerUp) => powerUp.type === type)

  if (sameTypeIndex === -1) {
    return [...activePowerUps, nextPowerUp]
  }

  const next = [...activePowerUps]
  next[sameTypeIndex] = nextPowerUp
  return next
}

export function removeExpiredPowerUps(activePowerUps: PowerUpInstance[], nowMs: number): PowerUpInstance[] {
  return activePowerUps.filter((powerUp) => powerUp.expiresAtMs > nowMs)
}
