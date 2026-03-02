import type { GameStatus } from '../game/types'

type GameOverlayProps = {
  status: GameStatus
  onPrimaryAction: () => void
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

export function GameOverlay({ status, onPrimaryAction }: GameOverlayProps) {
  const copy = getOverlayCopy(status)

  if (!copy) {
    return null
  }

  return (
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
  )
}
