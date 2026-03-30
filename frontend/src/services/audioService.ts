type SoundId =
  | 'shoot'
  | 'enemy-hit'
  | 'enemy-destroyed'
  | 'drop-collected'
  | 'game-over'
  | 'shop-confirm'
  | 'boss-hit'
  | 'boss-victory'
  | 'boss-defeat'

type ToneConfig = {
  frequency: number
  type: OscillatorType
  durationSeconds: number
  gain: number
}

const toneMap: Record<SoundId, ToneConfig> = {
  shoot: { frequency: 520, type: 'square', durationSeconds: 0.09, gain: 0.065 },
  'enemy-hit': { frequency: 260, type: 'square', durationSeconds: 0.08, gain: 0.06 },
  'enemy-destroyed': { frequency: 190, type: 'triangle', durationSeconds: 0.14, gain: 0.07 },
  'drop-collected': { frequency: 880, type: 'sine', durationSeconds: 0.18, gain: 0.075 },
  'game-over': { frequency: 150, type: 'sawtooth', durationSeconds: 0.28, gain: 0.08 },
  'shop-confirm': { frequency: 640, type: 'triangle', durationSeconds: 0.11, gain: 0.055 },
  'boss-hit': { frequency: 320, type: 'sawtooth', durationSeconds: 0.12, gain: 0.07 },
  'boss-victory': { frequency: 720, type: 'triangle', durationSeconds: 0.26, gain: 0.085 },
  'boss-defeat': { frequency: 120, type: 'sawtooth', durationSeconds: 0.3, gain: 0.09 }
}

let sharedAudioContext: AudioContext | null = null
let audioUnlocked = false

export type AudioCue =
  | 'shot-fired'
  | 'enemy-hit'
  | 'enemy-destroyed'
  | 'rare-drop-collected'
  | 'game-over'
  | 'shop-confirm'
  | 'boss-hit'
  | 'boss-victory'
  | 'boss-defeat'

export function resolveSoundId(cue: AudioCue): SoundId {
  switch (cue) {
    case 'shot-fired':
      return 'shoot'
    case 'enemy-hit':
      return 'enemy-hit'
    case 'enemy-destroyed':
      return 'enemy-destroyed'
    case 'rare-drop-collected':
      return 'drop-collected'
    case 'game-over':
      return 'game-over'
    case 'shop-confirm':
      return 'shop-confirm'
    case 'boss-hit':
      return 'boss-hit'
    case 'boss-victory':
      return 'boss-victory'
    case 'boss-defeat':
      return 'boss-defeat'
  }
}

function getAudioContextCtor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
}

function getSharedAudioContext(): AudioContext | null {
  const AudioContextCtor = getAudioContextCtor()
  if (!AudioContextCtor) {
    return null
  }

  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContextCtor()
  }

  return sharedAudioContext
}

function warmUpAudioContext(context: AudioContext): void {
  if (audioUnlocked) {
    return
  }

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const startAt = context.currentTime
  const stopAt = startAt + 0.01

  oscillator.type = 'sine'
  oscillator.frequency.value = 1
  gain.gain.setValueAtTime(0.0001, startAt)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(startAt)
  oscillator.stop(stopAt)

  audioUnlocked = true
}

function scheduleTone(context: AudioContext, soundId: SoundId): void {
  const tone = toneMap[soundId]
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const startAt = context.currentTime
  const attackAt = startAt + 0.01
  const sustainUntil = startAt + tone.durationSeconds * 0.65
  const releaseAt = startAt + tone.durationSeconds

  oscillator.type = tone.type
  oscillator.frequency.value = tone.frequency
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.linearRampToValueAtTime(tone.gain, attackAt)
  gain.gain.setValueAtTime(tone.gain * 0.9, sustainUntil)
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(startAt)
  oscillator.stop(releaseAt)
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

  const context = getSharedAudioContext()
  if (!context) {
    return
  }

  if (context.state === 'running') {
    warmUpAudioContext(context)
    scheduleTone(context, soundId)
    return
  }

  void context
    .resume()
    .then(() => {
      warmUpAudioContext(context)
      scheduleTone(context, soundId)
    })
    .catch(() => {
      // Ignore resume failures; gesture unlock should establish playback separately.
    })
}

export function playAudioCue(cue: AudioCue, enabled: boolean): void {
  playTone(resolveSoundId(cue), enabled)
}

export function unlockAudio(enabled: boolean): void {
  if (!enabled) {
    return
  }

  const context = getSharedAudioContext()
  if (!context) {
    return
  }

  if (context.state === 'running') {
    warmUpAudioContext(context)
    return
  }

  void context
    .resume()
    .then(() => {
      warmUpAudioContext(context)
    })
    .catch(() => {
      // Ignore resume failures; audio will remain disabled until the browser allows it.
    })
}

export function resetAudioServiceForTests(): void {
  sharedAudioContext = null
  audioUnlocked = false
}
