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
      className={`relative isolate min-h-screen overflow-hidden text-white ${
        settings.highContrast ? 'high-contrast' : ''
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.16),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(167,139,250,0.14),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.16),rgba(2,6,23,0.72))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:linear-gradient(180deg,rgba(0,0,0,0.9),transparent_82%)]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-3 py-4 sm:px-4 lg:px-6">
        <div className="w-full">
        {(gameState.status === 'idle' || gameState.status === 'game-over') ? (
          <CampaignMap
            highestUnlockedStage={gameState.progressionProfile.highestUnlockedStage}
            currentStage={gameState.stage}
            completedStages={completedStages}
            onSelectStage={handleSelectStage}
          />
        ) : null}

        <div className="ui-shell-strong relative overflow-hidden rounded-[28px] p-3 sm:p-4 lg:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1 pt-1">
            <div>
              <p className="ui-chip mb-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-100/90">
                Futuristic Arcade
              </p>
              <h1 className="ui-display text-[1.2rem] font-bold uppercase tracking-[0.26em] text-slate-50 sm:text-[1.35rem]">
                Space Invaders
              </h1>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                Campanha, builds e chefes em uma interface limpa, mais cinematográfica e pronta para mobile.
              </p>
            </div>
            <button
              className="ui-button-secondary rounded-full px-4 py-2 text-sm font-semibold"
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
            statusLabel={
              gameState.status === 'running'
                ? isBossStage(gameState.stage)
                  ? 'boss na fase'
                  : undefined
                : gameState.status
            }
          />
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_0_80px_rgba(14,165,233,0.16)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%)]" />
            <canvas ref={canvasRef} width={800} height={480} className="relative z-0 h-auto w-full bg-black" />
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
          </div>
        </div>
        {gameState.status === 'shop' ? (
          <ShopScreen
            score={gameState.score}
            lives={gameState.lives}
            upgradeLevels={upgradeLevels}
            onConfirmClick={handleShopConfirmClick}
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
  )
}
