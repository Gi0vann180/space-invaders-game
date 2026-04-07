import type { ActivePowerUpState, BossEncounterState, DropFeedbackSnapshot, GameStatus } from '../game/types'

type GameOverlayProps = {
  status: GameStatus
  activePowerUps?: ActivePowerUpState[]
  dropFeedback?: DropFeedbackSnapshot | null
  bossEncounter?: BossEncounterState | null
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

function getShotLabel(shotType: DropFeedbackSnapshot['shotType']): string {
  if (shotType === 'laser') {
    return 'Laser'
  }

  return 'Missil teleguiado'
}

function getBossOutcomeCopy(status: GameStatus, bossEncounter?: BossEncounterState | null): string | null {
  if (!bossEncounter?.profile) {
    return null
  }

  if (status === 'game-over' && bossEncounter.lifecycle === 'defeat') {
    return `Derrota contra ${bossEncounter.profile.displayName} na tentativa ${Math.max(1, bossEncounter.attempt)}.`
  }

  if (status === 'shop' && bossEncounter.lifecycle === 'victory') {
    return `Boss derrotado: ${bossEncounter.profile.displayName}.`
  }

  return null
}

export function GameOverlay({
  status,
  activePowerUps = [],
  dropFeedback = null,
  bossEncounter = null,
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
  const shouldShowDropFeedback = Boolean(dropFeedback && dropFeedback.visibleUntilMs > nowMs)
  const bossOutcomeCopy = getBossOutcomeCopy(status, bossEncounter)
  const bossDisplayName = bossEncounter?.profile?.displayName
  const primaryButtonClass = 'ui-button-primary rounded-full px-4 py-2 text-sm font-semibold'
  const secondaryButtonClass = 'ui-button-secondary rounded-full px-4 py-2 text-sm font-semibold'

  return (
    <>
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 w-[min(16rem,calc(100vw-1.5rem))] ui-shell rounded-[18px] px-3 py-2 text-xs text-slate-100 sm:w-auto">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/70">Power-ups ativos</p>
        {hasActivePowerUps ? (
          <ul className="space-y-1">
            {activePowerUps.map((powerUp) => {
              const remainingSeconds = Math.max(0, Math.ceil((powerUp.expiresAtMs - nowMs) / 1000))
              return (
                <li key={powerUp.type} className="flex items-center justify-between gap-3 text-slate-200">
                  <span className="font-medium capitalize">{powerUp.type}</span>
                  <span className="ui-chip px-2 py-0.5 text-[10px] font-semibold text-cyan-100">{remainingSeconds}s</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-slate-400">Nenhum ativo</p>
        )}
      </div>

      {shouldShowDropFeedback ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 ui-shell rounded-full px-4 py-2 text-xs font-semibold text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
          Drop raro coletado: {getShotLabel(dropFeedback!.shotType)} equipado
        </div>
      ) : null}

      {typeof bossHealth === 'number' && typeof bossMaxHealth === 'number' && bossMaxHealth > 0 ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 w-[min(16rem,calc(100vw-1.5rem))] ui-shell rounded-[18px] px-3 py-2 text-xs text-orange-100 sm:w-auto">
          {bossDisplayName ? <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-300">{bossDisplayName}</p> : null}
          <p className="mt-1 font-medium text-slate-100">Boss HP: {bossHealth}/{bossMaxHealth}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900/90">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-200 transition-[width] duration-150"
              style={{ width: `${Math.max(0, Math.min(100, (bossHealth / bossMaxHealth) * 100))}%` }}
            />
          </div>
        </div>
      ) : null}

      {showInterruptedRunPrompt ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="ui-shell-strong w-full max-w-lg rounded-[28px] p-6 text-center shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
            <p className="ui-chip mx-auto mb-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
              Run interrompida
            </p>
            <h2 className="text-[1.6rem] font-bold leading-tight text-white sm:text-[1.85rem]">Continuar de onde parou?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              A run atual foi salva no estado anterior. Continuar retoma o fluxo; reiniciar descarta o progresso momentâneo.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                className={secondaryButtonClass}
                onClick={onResumeInterruptedRun}
                type="button"
              >
                Continuar
              </button>
              <button
                className="rounded-full border border-rose-400/30 bg-rose-500/12 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
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
        <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="ui-shell-strong w-full max-w-lg rounded-[28px] p-6 text-center shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
            <p className="ui-chip mx-auto mb-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-100/90">
              Fase concluída
            </p>
            <h2 className="text-[1.6rem] font-bold leading-tight text-white sm:text-[1.85rem]">Nova fase desbloqueada</h2>
            {bossOutcomeCopy ? <p className="mb-2 text-sm font-medium text-emerald-300">{bossOutcomeCopy}</p> : null}
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-300">
              Recompensa aplicada. Você avançou para a próxima etapa da campanha.
            </p>
            <button
              className={primaryButtonClass}
              onClick={onContinueStage}
              type="button"
            >
              Proxima fase
            </button>
          </div>
        </div>
      ) : null}

      {copy ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="ui-shell-strong rounded-[28px] p-6 text-center shadow-[0_28px_90px_rgba(2,6,23,0.7)]">
            <p className="ui-chip mx-auto mb-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
              Status da run
            </p>
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-[1.8rem]">{copy.title}</h2>
            {bossOutcomeCopy ? <p className="mb-4 text-sm font-medium text-rose-300">{bossOutcomeCopy}</p> : null}
            <button
              className={primaryButtonClass}
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
