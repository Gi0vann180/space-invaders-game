import type { ActivePowerUpState, GameStatus } from '../game/types'

type GameOverlayProps = {
  status: GameStatus
  activePowerUps?: ActivePowerUpState[]
  bossHealth?: number
  bossMaxHealth?: number
  nowMs?: number
  showCompletion?: boolean
  showInterruptedRunPrompt?: boolean
  onPrimaryAction: () => void
  onContinueStage?: () => void
  onResumeInterruptedRun?: () => void
  onRestartInterruptedRun?: () => void
}

function getOverlayCopy(status: GameStatus): { title: string; buttonLabel: string } | null {
  if (status === 'idle') {
    return {
      title: 'Pronto para jogar?',
      buttonLabel: 'Iniciar rodada'
    }
  }

  if (status === 'paused') {
    return {
      title: 'Jogo pausado',
      buttonLabel: 'Continuar'
    }
  }

  if (status === 'game-over') {
    return {
      title: 'Game Over',
      buttonLabel: 'Reiniciar'
    }
  }

  return null
}

export function GameOverlay({
  status,
  activePowerUps = [],
  bossHealth,
  bossMaxHealth,
  nowMs = Date.now(),
  showCompletion = false,
  showInterruptedRunPrompt = false,
  onPrimaryAction,
  onContinueStage,
  onResumeInterruptedRun,
  onRestartInterruptedRun
}: GameOverlayProps) {
  const copy = getOverlayCopy(status)
  const hasActivePowerUps = activePowerUps.length > 0

  return (
    <>
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-100 backdrop-blur">
        <p className="font-medium">Power-ups ativos</p>
        {hasActivePowerUps ? (
          <ul>
            {activePowerUps.map((powerUp) => {
              const remainingSeconds = Math.max(0, Math.ceil((powerUp.expiresAtMs - nowMs) / 1000))
              return (
                <li key={powerUp.type} className="text-slate-300">
                  {powerUp.type}: {remainingSeconds}s
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-slate-400">Nenhum</p>
        )}
      </div>

      {typeof bossHealth === 'number' && typeof bossMaxHealth === 'number' && bossMaxHealth > 0 ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-orange-200 backdrop-blur">
          <p className="font-medium">Boss HP: {bossHealth}/{bossMaxHealth}</p>
        </div>
      ) : null}

      {showInterruptedRunPrompt ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/65">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900/95 p-6 text-center shadow-xl">
            <h2 className="mb-4 text-[28px] font-semibold leading-tight text-white">Run interrompida encontrada</h2>
            <p className="mb-6 text-base font-normal text-slate-200">Reiniciar fase: Reiniciar agora? O progresso da run atual sera perdido.</p>
            <div className="flex items-center justify-center gap-4">
              <button
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                onClick={onResumeInterruptedRun}
                type="button"
              >
                Continuar
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                onClick={onRestartInterruptedRun}
                type="button"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCompletion ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/65">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900/95 p-6 text-center shadow-xl">
            <h2 className="mb-3 text-[28px] font-semibold leading-tight text-white">FASE COMPLETADA</h2>
            <p className="mb-6 text-base font-normal text-slate-200">Recompensa aplicada. Voce desbloqueou a proxima fase da campanha.</p>
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              onClick={onContinueStage}
              type="button"
            >
              Proxima fase
            </button>
          </div>
        </div>
      ) : null}

      {copy ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-black/65">
          <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-6 text-center shadow-xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">{copy.title}</h2>
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              onClick={onPrimaryAction}
              type="button"
            >
              {copy.buttonLabel}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
