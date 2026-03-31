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
    <section className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold uppercase tracking-widest text-cyan-400">Campanha</h2>
          <p className="mt-0.5 text-xs text-slate-400">Escolha a fase de início da próxima rodada</p>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {completedStages.length} / {STAGES.length} concluídas
        </span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
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
                  'group flex h-24 w-full flex-col items-center justify-center gap-1 rounded-lg border px-2 py-3 text-center transition-all duration-200',
                  isCompleted
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : '',
                  isUnlocked && !isCurrent
                    ? 'border-indigo-500/40 bg-indigo-500/8 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/15 hover:shadow-[0_0_14px_rgba(99,102,241,0.2)]'
                    : '',
                  isLocked ? 'cursor-not-allowed border-slate-700/50 bg-slate-900/60 text-slate-600' : '',
                  isCurrent
                    ? 'border-indigo-400 bg-indigo-500/20 text-indigo-100 shadow-[0_0_18px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/60'
                    : ''
                ].join(' ')}
                type="button"
                disabled={isLocked}
                onClick={() => onSelectStage(stage)}
                title={isLocked ? 'Derrote o chefe da fase anterior para desbloquear' : `Iniciar da fase ${stage}`}
              >
                <span className="text-lg leading-none">
                  {isLocked ? '🔒' : isCompleted ? '✓' : STAGE_ICONS[index]}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">Fase {stage}</span>
                {isCurrent && !isLocked ? (
                  <span className="text-[10px] font-semibold text-indigo-300">SELECIONADA</span>
                ) : isCompleted ? (
                  <span className="text-[10px] font-semibold text-cyan-400">CONCLUÍDA</span>
                ) : isUnlocked ? (
                  <span className="text-[10px] text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">JOGAR →</span>
                ) : (
                  <span className="text-[10px] text-slate-600">BLOQUEADA</span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
