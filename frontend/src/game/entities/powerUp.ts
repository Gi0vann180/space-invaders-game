import type { ActivePowerUpState, TemporaryPowerUpType } from '../types'

export type PowerUpType = TemporaryPowerUpType
export type PowerUpInstance = ActivePowerUpState

export function createPowerUp(
  type: PowerUpType,
  nowMs: number,
  durationSeconds: number,
  conflictGroup: 'weapon' | 'defense'
): PowerUpInstance {
  return {
    type,
    startedAtMs: nowMs,
    conflictGroup,
    expiresAtMs: nowMs + durationSeconds * 1000
  }
}
