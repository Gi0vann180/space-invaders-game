import { RARE_DROP_LIFETIME_MS } from '../config/gameplay'
import type { TemporaryPowerUpType } from '../types'

export type RareDropEntity = {
  id: string
  x: number
  y: number
  width: number
  height: number
  speedY: number
  sourceEnemyId: string
  spawnedAtMs: number
  expiresAtMs: number
  grantedShotType: Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>
}

export function createRareDrop(input: {
  enemyId: string
  x: number
  y: number
  nowMs: number
  grantedShotType: RareDropEntity['grantedShotType']
}): RareDropEntity {
  return {
    id: `drop-${input.enemyId}-${input.nowMs}`,
    sourceEnemyId: input.enemyId,
    x: input.x,
    y: input.y,
    width: 12,
    height: 12,
    speedY: 120,
    spawnedAtMs: input.nowMs,
    expiresAtMs: input.nowMs + RARE_DROP_LIFETIME_MS,
    grantedShotType: input.grantedShotType
  }
}

export function isDropExpired(drop: RareDropEntity, nowMs: number): boolean {
  return nowMs >= drop.expiresAtMs
}
