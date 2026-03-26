type CampaignMapProps = {
  highestUnlockedStage: number
  currentStage: number
  completedStages: number[]
  onSelectStage: (stage: number) => void
}

const STAGES = [1, 2, 3, 4, 5] as const

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
    <section className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Mapa da campanha</h2>
        <p className="text-sm font-semibold text-indigo-300">Fase atual: {currentStage}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {STAGES.map((stage, index) => {
          const stageState = getStageState(stage, highestUnlockedStage, completedStages)
          const isLocked = stageState === 'locked'
          const isCompleted = stageState === 'completed'
          const isCurrent = stage === currentStage

          return (
            <div key={stage} className="relative">
              {index < STAGES.length - 1 ? (
                <span className="pointer-events-none absolute right-[-18px] top-1/2 hidden h-[2px] w-9 -translate-y-1/2 bg-slate-600 md:block" />
              ) : null}

              <button
                className={[
                  'flex h-28 w-full flex-col items-center justify-center rounded-lg border px-4 py-3 text-center transition',
                  isCompleted ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100' : '',
                  stageState === 'unlocked' ? 'border-indigo-400 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20' : '',
                  isLocked ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-400' : '',
                  isCurrent ? 'ring-2 ring-indigo-500' : ''
                ].join(' ')}
                type="button"
                disabled={isLocked}
                onClick={() => onSelectStage(stage)}
              >
                <span className="text-sm font-semibold">Fase {stage}</span>
                <span className="mt-2 text-sm font-normal">
                  {isCompleted ? 'Concluida' : stageState === 'unlocked' ? 'Desbloqueada' : 'Bloqueada'}
                </span>
                {isLocked ? (
                  <span className="mt-2 text-xs font-semibold text-slate-300">Derrote o chefe da fase anterior para desbloquear</span>
                ) : null}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
