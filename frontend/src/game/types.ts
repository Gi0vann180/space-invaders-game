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
  input: InputSnapshot
}

export const EMPTY_INPUT: InputSnapshot = {
  horizontal: 0,
  fire: false,
  pause: false
}
