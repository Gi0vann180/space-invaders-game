import type { UpgradeLevels } from '../services/shopService'
import type { BossAttackPatternId } from './entities/boss'
import type { BossFeedbackPreset, BossMovementModel } from './config/bossProfiles'

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

export type BossEncounterLifecycle = 'idle' | 'active' | 'victory' | 'defeat'

export type BossEncounterProfileSnapshot = {
  profileId: string
  displayName: string
  movementModel: BossMovementModel
  feedbackPreset: BossFeedbackPreset
  telegraphMs: number
  patternIds: BossAttackPatternId[]
}

export type BossEncounterState = {
  active: boolean
  lifecycle: BossEncounterLifecycle
  bossId: string | null
  profile: BossEncounterProfileSnapshot | null
  stage: number | null
  attempt: number
  startedAtMs: number | null
  endedAtMs: number | null
  outcome: 'none' | 'in-progress' | 'victory' | 'defeat'
  damageTaken: number
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

export type DropFeedbackSnapshot = {
  shotType: Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>
  visibleUntilMs: number
}

export type ProgressProfileSnapshot = {
  highestUnlockedStage: number
  totalRuns: number
  lastAttemptedStage: number | null
  lastCompletedStage: number | null
  interruptedRun: {
    stage: number
    atStatus: 'running' | 'paused'
    savedAt: string
  } | null
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
  dropFeedback: DropFeedbackSnapshot | null
  bossEncounter: BossEncounterState
  progressionProfile: ProgressProfileSnapshot
  input: InputSnapshot
}

export const EMPTY_INPUT: InputSnapshot = {
  horizontal: 0,
  fire: false,
  pause: false
}
