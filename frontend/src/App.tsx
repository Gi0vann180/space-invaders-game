import { useCallback, useEffect, useRef, useState } from 'react'
import { GameOverlay } from './components/GameOverlay'
import { HUD } from './components/HUD'
import { SettingsPanel } from './components/SettingsPanel'
import { ShopScreen } from './components/ShopScreen'
import {
  continueToNextStage,
  pauseGame,
  restartRound,
  resumeGame,
  startGame,
  startRound,
  stopGame
} from './game/engine'
import { useVisibilityPause } from './hooks/useVisibilityPause'
import { setTelemetryConsent } from './lib/telemetry'
import { getPersistedUpgrades, savePersistedUpgrades } from './services/shopPersistenceService'
import { loadSettings, saveSettings } from './services/settingsService'
import type { ShopItemId } from './services/shopService'
import { gameStore } from './state/gameStore'
import { settingsStore, type GameSettings } from './state/settingsStore'
import type { GameSessionState } from './game/types'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<GameSessionState>(gameStore.getState())
  const [settings, setSettings] = useState<GameSettings>(settingsStore.getState())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [ownedUpgrades, setOwnedUpgrades] = useState<ShopItemId[]>([])

  const handlePrimaryOverlayAction = useCallback(() => {
    if (gameState.status === 'idle') {
      startRound()
      return
    }

    if (gameState.status === 'paused') {
      resumeGame()
      return
    }

    if (gameState.status === 'game-over') {
      restartRound()
    }
  }, [gameState.status])

  useVisibilityPause({
    onPause: pauseGame,
    onResume: () => {
      if (gameStore.getState().status === 'paused') {
        resumeGame()
      }
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    startGame(canvas)

    const unsubscribe = gameStore.subscribe((state) => {
      setGameState(state)
    })
    const unsubscribeSettings = settingsStore.subscribe((nextSettings) => {
      setSettings(nextSettings)
    })

    void getPersistedUpgrades().then((upgrades) => {
      setOwnedUpgrades(upgrades)
      gameStore.setState({ activeUpgrades: upgrades })
    })

    void loadSettings().then((savedSettings) => {
      if (!savedSettings) {
        return
      }

      settingsStore.setState(savedSettings)
      setTelemetryConsent(savedSettings.telemetryConsent)
    })

    return () => {
      unsubscribe()
      unsubscribeSettings()
      stopGame()
    }
  }, [])

  const handleSettingsChange = (partial: Partial<GameSettings>) => {
    settingsStore.setState(partial)
    const nextSettings = settingsStore.getState()
    setTelemetryConsent(nextSettings.telemetryConsent)
    void saveSettings(nextSettings)
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center ${
        settings.highContrast ? 'high-contrast' : ''
      }`}
    >
      <div className="w-full max-w-3xl p-4">
        <div className="bg-slate-900/60 rounded-lg p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Space Invaders — Modern UI</h1>
            <button
              className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600"
              onClick={() => setIsSettingsOpen(true)}
              type="button"
            >
              Configurações
            </button>
          </div>
          <div className="relative overflow-hidden rounded bg-black">
            <HUD
              score={gameState.score}
              lives={gameState.lives}
              stage={gameState.stage}
              highScore={gameState.highScore}
              captionsEnabled={settings.captionsEnabled}
              statusLabel={gameState.status === 'running' ? undefined : gameState.status}
            />
            <canvas ref={canvasRef} width={800} height={480} className="w-full h-auto rounded bg-black" />
            <GameOverlay status={gameState.status} onPrimaryAction={handlePrimaryOverlayAction} />
            {gameState.status === 'shop' ? (
              <ShopScreen
                score={gameState.score}
                ownedItems={ownedUpgrades}
                onPurchase={(nextScore, nextOwnedItems) => {
                  setOwnedUpgrades(nextOwnedItems)
                  gameStore.setState({
                    score: nextScore,
                    activeUpgrades: nextOwnedItems
                  })
                }}
                onContinue={() => {
                  void savePersistedUpgrades(ownedUpgrades)
                  continueToNextStage(ownedUpgrades)
                }}
              />
            ) : null}
            <SettingsPanel
              isOpen={isSettingsOpen}
              onChange={handleSettingsChange}
              onClose={() => setIsSettingsOpen(false)}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
