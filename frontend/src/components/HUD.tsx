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
      <div className="ui-shell mx-auto flex w-full max-w-5xl flex-col gap-2 rounded-[24px] px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="ui-chip min-w-[100px] px-3 py-2">
              <span className="text-base leading-none">✦</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-amber-100/60">Score</span>
                <span className="text-sm font-bold text-amber-200 sm:text-base">{score.toLocaleString()}</span>
              </div>
            </div>

            <div className="ui-chip min-w-[92px] px-3 py-2">
              <span className="text-base leading-none">❤</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-rose-100/60">Vidas</span>
                <span className="text-sm font-bold text-rose-200 sm:text-base">{lives}</span>
              </div>
            </div>

            <div className="ui-chip min-w-[92px] px-3 py-2">
              <span className="text-base leading-none">⚡</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-cyan-100/60">Fase</span>
                <span className="text-sm font-bold text-cyan-100 sm:text-base">{stage}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-slate-400">Recorde</span>
              <span className="text-sm font-bold text-slate-100">{highScore.toLocaleString()}</span>
            </div>
            {statusLabel ? (
              <span className="ui-chip px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-100">
                {statusLabel}
              </span>
            ) : null}
          </div>
        </div>

        {typeof bossHealth === 'number' && typeof bossMaxHealth === 'number' && bossMaxHealth > 0 ? (
          <div className="ui-shell rounded-[20px] px-3 py-3 text-xs text-orange-100 sm:px-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-300">Boss ativo</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  {bossHealth.toLocaleString()} / {bossMaxHealth.toLocaleString()}
                </p>
              </div>
              <p className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-200">
                Resistência crítica
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-900/90">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-300 transition-[width] duration-150"
                style={{ width: `${Math.max(0, Math.min(100, (bossHealth / bossMaxHealth) * 100))}%` }}
              />
            </div>
          </div>
        ) : null}

        {captionsEnabled ? (
          <p className="mx-auto w-full max-w-5xl text-center text-[10px] tracking-[0.22em] text-slate-400">
            ← → mover &nbsp;·&nbsp; Espaço atirar &nbsp;·&nbsp; P pausar
          </p>
        ) : null}
      </div>
    </div>
  )
}
