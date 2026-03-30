import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { playAudioCue, resetAudioServiceForTests, resolveSoundId, type AudioCue, unlockAudio } from '../../src/services/audioService'

class MockGainNode {
  gain = {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn()
  }

  connect = vi.fn()
}

class MockOscillatorNode {
  type: OscillatorType = 'sine'
  frequency = { value: 0 }
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class MockAudioContext {
  static instances: MockAudioContext[] = []

  currentTime = 0
  state: AudioContextState = 'running'
  destination = {} as AudioDestinationNode
  resume = vi.fn().mockResolvedValue(undefined)
  createOscillator = vi.fn(() => new MockOscillatorNode())
  createGain = vi.fn(() => new MockGainNode())

  constructor() {
    MockAudioContext.instances.push(this)
  }
}

describe('audio service', () => {
  beforeEach(() => {
    resetAudioServiceForTests()
    MockAudioContext.instances = []
    vi.stubGlobal('window', {
      AudioContext: MockAudioContext
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    resetAudioServiceForTests()
  })

  it('mapeia cues compactos para tons esperados', () => {
    const expectations: Array<[AudioCue, ReturnType<typeof resolveSoundId>]> = [
      ['shot-fired', 'shoot'],
      ['enemy-hit', 'enemy-hit'],
      ['enemy-destroyed', 'enemy-destroyed'],
      ['rare-drop-collected', 'drop-collected'],
      ['game-over', 'game-over'],
      ['shop-confirm', 'shop-confirm'],
      ['boss-hit', 'boss-hit'],
      ['boss-victory', 'boss-victory'],
      ['boss-defeat', 'boss-defeat']
    ]

    for (const [cue, soundId] of expectations) {
      expect(resolveSoundId(cue)).toBe(soundId)
    }
  })

  it('reutiliza um unico audio context para reduzir latencia e evitar silenciar cues', () => {
    playAudioCue('enemy-hit', true)
    playAudioCue('boss-hit', true)
    playAudioCue('rare-drop-collected', true)

    expect(MockAudioContext.instances).toHaveLength(1)
    expect(MockAudioContext.instances[0]?.createOscillator).toHaveBeenCalledTimes(4)
  })

  it('tenta resumir contextos suspensos antes de tocar', () => {
    playAudioCue('shot-fired', true)

    const context = MockAudioContext.instances[0]
    if (!context) {
      throw new Error('Mock audio context was not created')
    }

    context.state = 'suspended'
    playAudioCue('boss-victory', true)

    expect(context.resume).toHaveBeenCalledTimes(1)
  })

  it('desbloqueia o audio antecipadamente em gestos do usuario', () => {
    unlockAudio(true)

    expect(MockAudioContext.instances).toHaveLength(1)
    expect(MockAudioContext.instances[0]?.resume).not.toHaveBeenCalled()
    expect(MockAudioContext.instances[0]?.createOscillator).toHaveBeenCalledTimes(1)

    MockAudioContext.instances[0]!.state = 'suspended'
    unlockAudio(true)

    expect(MockAudioContext.instances[0]?.resume).toHaveBeenCalledTimes(1)
  })

  it('aquece o contexto antes de tocar apos resume pendente', async () => {
    unlockAudio(true)

    const context = MockAudioContext.instances[0]
    if (!context) {
      throw new Error('Mock audio context was not created')
    }

    context.state = 'suspended'
    const oscillatorCallsBefore = context.createOscillator.mock.calls.length

    playAudioCue('enemy-destroyed', true)
    await Promise.resolve()

    expect(context.resume).toHaveBeenCalledTimes(1)
    expect(context.createOscillator.mock.calls.length).toBeGreaterThan(oscillatorCallsBefore)
  })
})