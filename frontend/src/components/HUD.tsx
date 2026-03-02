type HUDProps = {
  score: number
  lives: number
  stage: number
  highScore: number
  captionsEnabled?: boolean
  statusLabel?: string
}

export function HUD({ score, lives, stage, highScore, captionsEnabled = true, statusLabel }: HUDProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
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
      {captionsEnabled ? (
        <p className="mx-auto mt-2 w-full max-w-3xl text-center text-xs text-slate-300">Legenda: use ←/→ para mover e espaço para atirar.</p>
      ) : null}
    </header>
  )
}
