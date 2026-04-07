type CampaignMapProps = {
  highestUnlockedStage: number
  currentStage: number
  completedStages: number[]
  onSelectStage: (stage: number) => void
}

const STAGES = [1, 2, 3, 4, 5] as const

const STAGE_ICONS = ['⚡', '🔥', '💥', '☄️', '👾'] as const

function getStageState(stage: number, highestUnlockedStage: number, completedStages: number[]): 'locked' | 'unlocked' | 'completed' {
  if (completedStages.includes(stage)) {
    return 'completed'
  }

  if (stage > highestUnlockedStage) {
    return 'locked'
  }

  return 'unlocked'
}

export function CampaignMap({ highestUnlockedStage, currentStage, completedStages, onSelectStage }: CampaignMapProps) {
  return (
    <section className="ui-shell mb-5 rounded-[28px] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="ui-chip mb-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100/90">
            Campaign Map
          </p>
          <h2 className="ui-display text-base font-bold uppercase tracking-[0.24em] text-slate-50 sm:text-lg">Campanha</h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            Escolha onde começar a próxima run e acompanhe o ritmo da progressão.
          </p>
        </div>
        <span className="ui-chip px-3 py-1 text-xs font-semibold text-cyan-100">
          {completedStages.length} / {STAGES.length} concluídas
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAGES.map((stage, index) => {
          const stageState = getStageState(stage, highestUnlockedStage, completedStages)
          const isLocked = stageState === 'locked'
          const isCompleted = stageState === 'completed'
          const isCurrent = stage === currentStage
          const isUnlocked = stageState === 'unlocked'

          return (
            <div key={stage} className="relative">
              {index < STAGES.length - 1 ? (
                <span
                  className={[
                    'pointer-events-none absolute right-[-9px] top-1/2 hidden h-px w-[18px] -translate-y-1/2 md:block',
                    isCompleted ? 'bg-cyan-500/50' : 'bg-slate-700'
                  ].join(' ')}
                />
              ) : null}

              <button
                className={[
                  'group flex min-h-[110px] w-full flex-col items-center justify-center gap-2 rounded-[22px] border px-3 py-4 text-center transition-all duration-200',
                  isCompleted
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.16)] hover:shadow-[0_0_24px_rgba(34,211,238,0.24)]'
                    : '',
                  isUnlocked && !isCurrent
                    ? 'border-indigo-400/30 bg-indigo-400/10 text-indigo-100 hover:border-indigo-300/60 hover:bg-indigo-400/15 hover:shadow-[0_0_18px_rgba(129,140,248,0.18)]'
                    : '',
                  isLocked ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-500' : '',
                  isCurrent
                    ? 'border-fuchsia-300/50 bg-gradient-to-b from-fuchsia-400/20 to-indigo-400/15 text-white shadow-[0_0_22px_rgba(167,139,250,0.24)] ring-1 ring-fuchsia-300/45'
                    : ''
                ].join(' ')}
                type="button"
                disabled={isLocked}
                onClick={() => onSelectStage(stage)}
                title={isLocked ? 'Derrote o chefe da fase anterior para desbloquear' : `Iniciar da fase ${stage}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-lg leading-none shadow-inner">
                  {isLocked ? '🔒' : isCompleted ? '✓' : STAGE_ICONS[index]}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-inherit">Fase {stage}</span>
                {isCurrent && !isLocked ? (
                  <span className="ui-chip px-2.5 py-1 text-[10px] font-semibold text-fuchsia-100">Selecionada</span>
                ) : isCompleted ? (
                  <span className="ui-chip px-2.5 py-1 text-[10px] font-semibold text-cyan-100">Concluída</span>
                ) : isUnlocked ? (
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-indigo-200 opacity-0 transition-opacity group-hover:opacity-100">
                    Jogar →
                  </span>
                ) : (
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">Bloqueada</span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
