import { RARE_DROP_CHANCE_PERCENT } from '../config/gameplay'
import { createRareDrop, isDropExpired, type RareDropEntity } from '../entities/dropItem'
import type { TemporaryPowerUpType } from '../types'

const SPECIAL_SHOTS: Array<Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>> = ['laser', 'homing-missile']

export function shouldSpawnRareDrop(seed: number, chancePercent = RARE_DROP_CHANCE_PERCENT): boolean {
  const normalized = Math.abs(seed) % 100
  return normalized < chancePercent
}

export function pickRandomSpecialShot(seed: number): Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'> {
  const index = Math.abs(seed) % SPECIAL_SHOTS.length
  return SPECIAL_SHOTS[index]
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
