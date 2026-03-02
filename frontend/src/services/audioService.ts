type SoundId = 'shoot' | 'hit' | 'game-over'

const frequencyMap: Record<SoundId, number> = {
  shoot: 440,
  hit: 220,
  'game-over': 160
}

export function supportsVibration(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
}

export function vibrate(durationMs: number, enabled: boolean): void {
  if (!enabled || !supportsVibration()) {
    return
  }

  navigator.vibrate(durationMs)
}

export function playTone(soundId: SoundId, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') {
    return
  }

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) {
    return
  }

  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'square'
  oscillator.frequency.value = frequencyMap[soundId]
  gain.gain.value = 0.03

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 0.08)
}
