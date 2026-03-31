type HUDProps = {
  score: number
  lives: number
  stage: number
  highScore: number
  bossHealth?: number
  bossMaxHealth?: number
  captionsEnabled?: boolean
  statusLabel?: string
}

export function HUD({
  score,
  lives,
  stage,
  highScore,
  bossHealth,
  bossMaxHealth,
  captionsEnabled = true,
  statusLabel
}: HUDProps) {
  return (
    <div className="mb-3 px-1 pt-1 pb-0">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/90 px-3 py-2 shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1">
            <span className="text-sm leading-none">⭐</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-500/70">Score</span>
              <span className="text-sm font-bold text-amber-300">{score.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-rose-500/25 bg-rose-500/10 px-2.5 py-1">
            <span className="text-sm leading-none">❤️</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-rose-500/70">Vidas</span>
              <span className="text-sm font-bold text-rose-300">{lives}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1">
            <span className="text-sm leading-none">⚡</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-cyan-500/70">Fase</span>
              <span className="text-sm font-bold text-cyan-300">{stage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Recorde</span>
            <span className="text-xs font-bold text-slate-300">{highScore.toLocaleString()}</span>
          </div>
          {statusLabel ? (
            <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
              {statusLabel}
            </span>
          ) : null}
        </div>
      </div>

      {typeof bossHealth === 'number' && typeof bossMaxHealth === 'number' && bossMaxHealth > 0 ? (
        <div className="mx-auto mt-1.5 w-full max-w-3xl rounded-md border border-orange-400/30 bg-slate-950/90 px-3 py-2 text-xs text-orange-200">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="font-bold uppercase tracking-[0.24em] text-orange-400">⚠ Boss</p>
            <p className="font-medium text-orange-200">{bossHealth}/{bossMaxHealth}</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-[width] duration-150"
              style={{ width: `${Math.max(0, Math.min(100, (bossHealth / bossMaxHealth) * 100))}%` }}
            />
          </div>
        </div>
      ) : null}

      {captionsEnabled ? (
        <p className="mx-auto mt-1 w-full max-w-3xl text-center text-[10px] text-slate-600">← → mover &nbsp;·&nbsp; Espaço atirar &nbsp;·&nbsp; P pausar</p>
      ) : null}
    </div>
  )
}
