import { useEffect } from 'react'

type VisibilityPauseHandlers = {
  onPause: () => void
  onResume: () => void
}

export function useVisibilityPause({ onPause, onResume }: VisibilityPauseHandlers): void {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onPause()
        return
      }

      onResume()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onPause, onResume])
}
