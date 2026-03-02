export type PowerUpType = 'double-shot' | 'shield' | 'speed'

export type PowerUpInstance = {
  type: PowerUpType
  expiresAtMs: number
}

export function createPowerUp(type: PowerUpType, nowMs: number, durationSeconds: number): PowerUpInstance {
  return {
    type,
    expiresAtMs: nowMs + durationSeconds * 1000
  }
}
