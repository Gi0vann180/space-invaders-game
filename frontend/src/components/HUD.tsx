type HUDProps = {
  score: number
  lives: number
  stage: number
  highScore: number
  bossHealth?: number
  bossMaxHealth?: number
  captionsEnabled?: boolean
  statusLabel?: string
  highestUnlockedStage?: number
  completedCount?: number
}

export function HUD({
  score,
  lives,
  stage,
  highScore,
  bossHealth,
  bossMaxHealth,
  captionsEnabled = true,
  statusLabel,
  highestUnlockedStage,
  completedCount
}: HUDProps) {
  return (
    <div className="mb-3 p-3 sm:p-4">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2 text-xs text-slate-100 shadow-lg backdrop-blur sm:text-sm">
        <div className="flex items-center gap-3 sm:gap-5">
          <p className="font-medium">Score: {score}</p>
          <p className="font-medium">Lives: {lives}</p>
          <p className="font-medium">Stage: {stage}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-slate-300">Best: {highScore}</p>
          {statusLabel ? <p className="text-indigo-300">{statusLabel}</p> : null}
        </div>
      </div>
      {typeof highestUnlockedStage === 'number' ? (
        <div className="mx-auto mt-2 flex w-full max-w-3xl items-center justify-between rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-200 sm:text-sm">
          <p className="font-semibold">Fase mais alta desbloqueada: {highestUnlockedStage}</p>
          <p className="font-semibold">Fases concluidas: {completedCount ?? 0}</p>
        </div>
      ) : null}
      {typeof bossHealth === 'number' && typeof bossMaxHealth === 'number' && bossMaxHealth > 0 ? (
        <div className="mx-auto mt-2 w-full max-w-3xl rounded-md border border-orange-400/30 bg-slate-900/80 px-3 py-2 text-xs text-orange-200 sm:text-sm">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="font-semibold uppercase tracking-[0.24em] text-orange-300">Boss</p>
            <p className="font-medium">{bossHealth}/{bossMaxHealth}</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-[width] duration-150"
              style={{ width: `${Math.max(0, Math.min(100, (bossHealth / bossMaxHealth) * 100))}%` }}
            />
          </div>
        </div>
      ) : null}
      {captionsEnabled ? (
        <p className="mx-auto mt-2 w-full max-w-3xl text-center text-xs text-slate-300">Legenda: use / para mover e espa�o para atirar.</p>
      ) : null}
    </div>
  )
}
