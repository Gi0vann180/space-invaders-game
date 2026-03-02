import { EMPTY_INPUT, type GameSessionState } from '../game/types'

type GameStoreListener = (state: GameSessionState) => void

const initialState: GameSessionState = {
  status: 'idle',
  score: 0,
  lives: 3,
  stage: 1,
  highScore: 0,
  activeUpgrades: [],
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
    this.state = initialState
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
