import { EMPTY_INPUT, type GameSessionState } from '../game/types'
import { EMPTY_UPGRADE_LEVELS } from '../services/shopService'

type GameStoreListener = (state: GameSessionState) => void

const initialState: GameSessionState = {
  status: 'idle',
  score: 0,
  lives: 3,
  stage: 1,
  highScore: 0,
  activeUpgrades: [],
  upgradeLevels: { ...EMPTY_UPGRADE_LEVELS },
  activePowerUps: [],
  activeDrops: [],
  dropFeedback: null,
  bossEncounter: {
    active: false,
    lifecycle: 'idle',
    bossId: null,
    profile: null,
    stage: null,
    attempt: 0,
    startedAtMs: null,
    endedAtMs: null,
    outcome: 'none',
    damageTaken: 0,
    health: 0,
    maxHealth: 0
  },
  progressionProfile: {
    highestUnlockedStage: 1,
    totalRuns: 0,
    lastAttemptedStage: null,
    lastCompletedStage: null,
    interruptedRun: null
  },
  input: EMPTY_INPUT
}

class GameStore {
  private state: GameSessionState = initialState
  private listeners = new Set<GameStoreListener>()

  getState(): GameSessionState {
    return this.state
  }

  setState(partial: Partial<GameSessionState>): void {
    this.state = {
      ...this.state,
      ...partial
    }

    this.listeners.forEach((listener) => listener(this.state))
  }

  reset(): void {
    this.state = {
      ...initialState,
      highScore: this.state.highScore,
      progressionProfile: this.state.progressionProfile,
      activeDrops: []
    }
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: GameStoreListener): () => void {
    this.listeners.add(listener)
    listener(this.state)

    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const gameStore = new GameStore()

