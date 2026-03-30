import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CampaignMap } from './components/CampaignMap'
import { GameOverlay } from './components/GameOverlay'
import { HUD } from './components/HUD'
import { SettingsPanel } from './components/SettingsPanel'
import { ShopScreen } from './components/ShopScreen'
import { playAudioCue, unlockAudio } from './services/audioService'
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
import { getPersistedProgressProfile, resolveInterruptedRunSnapshot } from './services/shopPersistenceService'
import { loadSettings, saveSettings } from './services/settingsService'
import { EMPTY_UPGRADE_LEVELS, listActiveUpgrades, type UpgradeLevels } from './services/shopService'
import { applyRunModifierSelection, type RunModifierId } from './game/systems/runModifierSystem'
import { isBossStage } from './game/config/gameplay'
import { gameStore } from './state/gameStore'
import { settingsStore, type GameSettings } from './state/settingsStore'
import type { GameSessionState } from './game/types'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [gameState, setGameState] = useState<GameSessionState>(gameStore.getState())
  const [settings, setSettings] = useState<GameSettings>(settingsStore.getState())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [upgradeLevels, setUpgradeLevels] = useState<UpgradeLevels>({ ...EMPTY_UPGRADE_LEVELS })
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false)
  const [showInterruptedRunPrompt, setShowInterruptedRunPrompt] = useState(false)

  const completedStages = useMemo(() => {
    const completedUntil = Math.max(0, Math.min(5, gameState.progressionProfile.lastCompletedStage ?? 0))
    return Array.from({ length: completedUntil }, (_, index) => index + 1)
  }, [gameState.progressionProfile.lastCompletedStage])

  if (typeof window !== 'undefined') {
    ;(window as Window & { __GAME_STORE__?: typeof gameStore }).__GAME_STORE__ = gameStore
  }

  const primeAudioFromGesture = useCallback(() => {
    unlockAudio(settingsStore.getState().audioEnabled)
  }, [])

  const handlePrimaryOverlayAction = useCallback(() => {
    primeAudioFromGesture()

    if (gameState.status === 'idle') {
      startRound()
      return
    }

    if (gameState.status === 'paused') {
      resumeGame()
      return
    }

    if (gameState.status === 'game-over') {
      setUpgradeLevels({ ...EMPTY_UPGRADE_LEVELS })
      restartRound()
    }
  }, [gameState.status, primeAudioFromGesture])

  useVisibilityPause({
    onPause: pauseGame,
    onResume: () => {
      if (gameStore.getState().status === 'paused') {
        resumeGame()
      }
    }
  })

  useEffect(() => {
    if (gameState.status === 'shop') {
      setShowCompletionOverlay(true)
    }
  }, [gameState.status])

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

    void getPersistedProgressProfile().then((profile) => {
      const levels = { ...EMPTY_UPGRADE_LEVELS }
      const fallbackStage = gameStore.getState().stage
      const interruptedRun = resolveInterruptedRunSnapshot(profile.interruptedRun, fallbackStage)

      setUpgradeLevels(levels)
      gameStore.setState({
        upgradeLevels: levels,
        activeUpgrades: listActiveUpgrades(levels),
        progressionProfile: {
          highestUnlockedStage: profile.highestUnlockedStage,
          totalRuns: profile.totalRuns,
          lastAttemptedStage: profile.lastAttemptedStage,
          lastCompletedStage: profile.lastCompletedStage,
          interruptedRun
        }
      })

      if (interruptedRun) {
        setShowInterruptedRunPrompt(true)
      }
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

  const handleResumeInterruptedRun = () => {
    primeAudioFromGesture()
    setShowInterruptedRunPrompt(false)

    if (gameStore.getState().status === 'paused') {
      resumeGame()
      return
    }

    startRound()
  }

  const handleRestartInterruptedRun = () => {
    primeAudioFromGesture()
    setShowInterruptedRunPrompt(false)
    restartRound()
  }

  const handleSelectStage = (stage: number) => {
    if (stage > gameState.progressionProfile.highestUnlockedStage) {
      return
    }

    gameStore.setState({
      stage,
      progressionProfile: {
        ...gameState.progressionProfile,
        lastAttemptedStage: stage,
        interruptedRun: null
      }
    })
  }

  const handleShopConfirmClick = useCallback(() => {
    primeAudioFromGesture()
    playAudioCue('shop-confirm', settingsStore.getState().audioEnabled)
  }, [primeAudioFromGesture])

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center ${
        settings.highContrast ? 'high-contrast' : ''
      }`}
    >
      <div className="w-full max-w-5xl p-4">
        <CampaignMap
          highestUnlockedStage={gameState.progressionProfile.highestUnlockedStage}
          currentStage={gameState.stage}
          completedStages={completedStages}
          onSelectStage={handleSelectStage}
        />

        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/70 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.55)]">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Space Invaders - Modern UI</h1>
            <button
              className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600"
              onClick={() => setIsSettingsOpen(true)}
              type="button"
            >
              Configuracoes
            </button>
          </div>
          <HUD
            score={gameState.score}
            lives={gameState.lives}
            stage={gameState.stage}
            highScore={gameState.highScore}
            bossHealth={gameState.bossEncounter.active ? gameState.bossEncounter.health : undefined}
            bossMaxHealth={gameState.bossEncounter.active ? gameState.bossEncounter.maxHealth : undefined}
            captionsEnabled={settings.captionsEnabled}
            highestUnlockedStage={gameState.progressionProfile.highestUnlockedStage}
            completedCount={completedStages.length}
            statusLabel={
              gameState.status === 'running'
                ? isBossStage(gameState.stage)
                  ? 'boss na fase'
                  : undefined
                : gameState.status
            }
          />
          <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-black shadow-[0_0_60px_rgba(14,165,233,0.12)]">
            <canvas ref={canvasRef} width={800} height={480} className="w-full h-auto rounded-2xl bg-black" />
            <GameOverlay
              status={gameState.status}
              activePowerUps={gameState.activePowerUps}
              dropFeedback={gameState.dropFeedback}
              bossEncounter={gameState.bossEncounter}
              bossHealth={gameState.bossEncounter.active ? gameState.bossEncounter.health : undefined}
              bossMaxHealth={gameState.bossEncounter.active ? gameState.bossEncounter.maxHealth : undefined}
              nowMs={Date.now()}
              showCompletion={showCompletionOverlay && gameState.status === 'shop'}
              showInterruptedRunPrompt={showInterruptedRunPrompt}
              onPrimaryAction={handlePrimaryOverlayAction}
              onContinueStage={() => {
                primeAudioFromGesture()
                setShowCompletionOverlay(false)
                continueToNextStage(gameStore.getState().upgradeLevels)
              }}
              onResumeInterruptedRun={handleResumeInterruptedRun}
              onRestartInterruptedRun={handleRestartInterruptedRun}
            />
            {gameState.status === 'shop' ? (
              <ShopScreen
                score={gameState.score}
                lives={gameState.lives}
                upgradeLevels={upgradeLevels}
                runModifierOffer={gameState.runModifierOffer}
                onConfirmClick={handleShopConfirmClick}
                onSelectRunModifier={(modifierId) => {
                  const nextUpgradeLevels = applyRunModifierSelection(upgradeLevels, modifierId as RunModifierId)
                  setUpgradeLevels(nextUpgradeLevels)
                  gameStore.setState({
                    upgradeLevels: nextUpgradeLevels,
                    activeUpgrades: listActiveUpgrades(nextUpgradeLevels),
                    runModifierOffer: gameState.runModifierOffer
                      ? {
                          ...gameState.runModifierOffer,
                          selectedModifierId: modifierId
                        }
                      : null
                  })
                }}
                onPurchase={(nextScore, nextUpgradeLevels) => {
                  setUpgradeLevels(nextUpgradeLevels)
                  gameStore.setState({
                    score: nextScore,
                    upgradeLevels: nextUpgradeLevels,
                    activeUpgrades: listActiveUpgrades(nextUpgradeLevels)
                  })
                }}
                onPurchaseExtraLife={(nextScore, nextLives) => {
                  gameStore.setState({
                    score: nextScore,
                    lives: nextLives
                  })
                }}
                onContinue={() => {
                  primeAudioFromGesture()
                  setShowCompletionOverlay(false)
                  continueToNextStage(gameStore.getState().upgradeLevels)
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
