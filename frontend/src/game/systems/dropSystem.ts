import { RARE_DROP_CHANCE_PERCENT } from '../config/gameplay'
import { createRareDrop, isDropExpired, type RareDropEntity } from '../entities/dropItem'
import type { DropFeedbackSnapshot, TemporaryPowerUpType } from '../types'

const SPECIAL_SHOTS: Array<Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>> = ['laser', 'homing-missile']
const DROP_FEEDBACK_DURATION_MS = 1800

export function shouldSpawnRareDrop(seed: number, chancePercent = RARE_DROP_CHANCE_PERCENT): boolean {
  const normalized = Math.abs(seed) % 100
  return normalized < chancePercent
}

export function pickRandomSpecialShot(seed: number): Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'> {
  const index = Math.abs(seed) % SPECIAL_SHOTS.length
  return SPECIAL_SHOTS[index]
}

export function resolveCollectedSpecialShot(
  pickedShot: Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>,
  activeWeapon: TemporaryPowerUpType | null
): Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'> {
  if (activeWeapon !== pickedShot) {
    return pickedShot
  }

  return pickedShot === 'laser' ? 'homing-missile' : 'laser'
}

export function createCollectedDropFeedback(
  shotType: Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>,
  nowMs: number
): DropFeedbackSnapshot {
  return {
    shotType,
    visibleUntilMs: nowMs + DROP_FEEDBACK_DURATION_MS
  }
}

export function resolveVisibleDropFeedback(
  feedback: DropFeedbackSnapshot | null,
  nowMs: number
): DropFeedbackSnapshot | null {
  if (!feedback) {
    return null
  }

  return feedback.visibleUntilMs > nowMs ? feedback : null
}

export function spawnRareDrop(input: {
  enemyId: string
  x: number
  y: number
  nowMs: number
  seed: number
}): RareDropEntity {
  return createRareDrop({
    enemyId: input.enemyId,
    x: input.x,
    y: input.y,
    nowMs: input.nowMs,
    grantedShotType: pickRandomSpecialShot(input.seed)
  })
}

export function removeExpiredDrops(drops: RareDropEntity[], nowMs: number): RareDropEntity[] {
  return drops.filter((drop) => !isDropExpired(drop, nowMs))
}

export function stepDrops(drops: RareDropEntity[], deltaSeconds: number, canvasHeight: number): RareDropEntity[] {
  return drops
    .map((drop) => ({
      ...drop,
      y: drop.y + drop.speedY * deltaSeconds
    }))
    .filter((drop) => drop.y <= canvasHeight)
}
