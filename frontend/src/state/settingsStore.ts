export type GameSettings = {
  audioEnabled: boolean
  vibrationEnabled: boolean
  inputSensitivity: number
  highContrast: boolean
  captionsEnabled: boolean
  telemetryConsent: boolean
}

type SettingsListener = (settings: GameSettings) => void

const defaultSettings: GameSettings = {
  audioEnabled: true,
  vibrationEnabled: true,
  inputSensitivity: 1,
  highContrast: false,
  captionsEnabled: true,
  telemetryConsent: false
}

class SettingsStore {
  private settings: GameSettings = defaultSettings
  private listeners = new Set<SettingsListener>()

  getState(): GameSettings {
    return this.settings
  }

  setState(partial: Partial<GameSettings>): void {
    this.settings = {
      ...this.settings,
      ...partial
    }
    this.listeners.forEach((listener) => listener(this.settings))
  }

  subscribe(listener: SettingsListener): () => void {
    this.listeners.add(listener)
    listener(this.settings)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const settingsStore = new SettingsStore()
