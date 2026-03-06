import type { UpgradeLevels } from '../services/shopService'

export type Vector2 = {
  x: number
  y: number
}

export type InputSnapshot = {
  horizontal: -1 | 0 | 1
  fire: boolean
  pause: boolean
}

export type GameStatus = 'idle' | 'running' | 'paused' | 'shop' | 'game-over'

export type BossEncounterState = {
  active: boolean
  bossId: string | null
  health: number
  maxHealth: number
}

export type TemporaryPowerUpType = 'laser' | 'homing-missile' | 'shield'

export type ActivePowerUpState = {
  type: TemporaryPowerUpType
  startedAtMs: number
  expiresAtMs: number
  conflictGroup: 'weapon' | 'defense'
}

export type RareDropSnapshot = {
  id: string
  x: number
  y: number
  width: number
  height: number
  grantedShotType: Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>
  expiresAtMs: number
}

export type ProgressProfileSnapshot = {
  highestUnlockedStage: number
  totalRuns: number
}

export type RunModifierOptionSnapshot = {
  modifierId: string
  label: string
  category: 'offense' | 'defense' | 'utility'
  applicable: boolean
}

export type RunModifierOfferSnapshot = {
  runId: string
  stageNumber: number
  options: RunModifierOptionSnapshot[]
  guaranteedApplicableOption: true
  selectedModifierId: string | null
}

export interface Player {
  id: string
  position: Vector2
  lives: number
  score: number
}

export interface Enemy {
  id: string
  position: Vector2
  health: number
  points: number
}

export interface Projectile {
  id: string
  origin: 'player' | 'enemy'
  position: Vector2
  velocity: Vector2
  damage: number
}

export interface GameSessionState {
  status: GameStatus
  score: number
  lives: number
  stage: number
  highScore: number
  activeUpgrades: string[]
  upgradeLevels: UpgradeLevels
  activePowerUps: ActivePowerUpState[]
  activeDrops: RareDropSnapshot[]
  bossEncounter: BossEncounterState
  progressionProfile: ProgressProfileSnapshot
  runModifierOffer: RunModifierOfferSnapshot | null
  input: InputSnapshot
}

export const EMPTY_INPUT: InputSnapshot = {
  horizontal: 0,
  fire: false,
  pause: false
}
