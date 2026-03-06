import type { TemporaryPowerUpType } from '../types'

export type PowerUpConfig = {
  type: TemporaryPowerUpType
  durationSeconds: number
  conflictGroup: 'weapon' | 'defense'
}

export const POWER_UPS: Record<TemporaryPowerUpType, PowerUpConfig> = {
  laser: {
    type: 'laser',
    durationSeconds: 7,
    conflictGroup: 'weapon'
  },
  'homing-missile': {
    type: 'homing-missile',
    durationSeconds: 7,
    conflictGroup: 'weapon'
  },
  shield: {
    type: 'shield',
    durationSeconds: 6,
    conflictGroup: 'defense'
  }
}

export const AUTO_POWERUP_CYCLE: TemporaryPowerUpType[] = ['laser', 'homing-missile', 'shield']
