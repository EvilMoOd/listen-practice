import { ref } from 'vue'
import { type Instrument } from './useSettings'

// MIDI.js SoundFont MP3 files hosted on GitHub Pages CDN
const INSTRUMENT_MAP: Record<Instrument, string> = {
  Piano: 'acoustic_grand_piano',
  Strings: 'string_ensemble_1',
  Guitar: 'acoustic_guitar_steel',
  Voice: 'choir_aahs',
}

const CDN_BASE = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/'

interface CachedNote {
  buffer: AudioBuffer
  midiNote: number
}

interface Voice {
  source: AudioBufferSourceNode
  gainNode: GainNode
}

export function useAudioEngine() {
  const ctx = ref<AudioContext | null>(null)
  const error = ref('')
  const isPlaying = ref(false)
  const currentInstrument = ref<Instrument>('Piano')
  const activeVoices = new Map<number, Voice>()
  const bufferCache = new Map<string, Map<number, CachedNote>>()
  const loading = ref(true)

  function getCtx(): AudioContext {
    if (!ctx.value || ctx.value.state === 'closed') {
      ctx.value = new AudioContext()
    }
    if (ctx.value.state === 'suspended') {
      ctx.value.resume()
    }
    return ctx.value
  }

  async function loadNote(instrument: string, midi: number): Promise<CachedNote | null> {
    const c = getCtx()
    if (!bufferCache.has(instrument)) {
      bufferCache.set(instrument, new Map())
    }
    const cache = bufferCache.get(instrument)!
    if (cache.has(midi)) return cache.get(midi)!

    // CDN uses flats for sharps: C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
    const noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    const noteName = noteNames[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    const url = `${CDN_BASE}${instrument}-mp3/${noteName}${octave}.mp3`

    try {
      const resp = await fetch(url)
      if (!resp.ok) return null
      const arrayBuffer = await resp.arrayBuffer()
      const buffer = await c.decodeAudioData(arrayBuffer)
      const entry = { buffer, midiNote: midi }
      cache.set(midi, entry)
      return entry
    } catch {
      return null
    }
  }

  async function preloadNote(midi: number): Promise<void> {
    getCtx()
    const sfName = INSTRUMENT_MAP[currentInstrument.value]
    await loadNote(sfName, midi)
  }

  async function init() {
    loading.value = true
    getCtx()
    loading.value = false
  }

  function setInstrument(instrument: Instrument) {
    currentInstrument.value = instrument
  }

  async function playNote(midi: number, durationMs: number): Promise<void> {
    const c = getCtx()
    const sfName = INSTRUMENT_MAP[currentInstrument.value]
    const duration = durationMs / 1000

    let cached = bufferCache.get(sfName)?.get(midi) ?? null

    if (!cached) {
      cached = await loadNote(sfName, midi)
    }

    if (!cached) {
      const cache = bufferCache.get(sfName)
      if (cache && cache.size > 0) {
        cached = cache.values().next().value ?? null
      }
    }

    if (!cached) {
      error.value = `Could not load ${sfName}`
      return
    }

    const gainNode = c.createGain()
    const source = c.createBufferSource()
    source.buffer = cached.buffer

    const midiDiff = midi - cached.midiNote
    const rate = Math.pow(2, midiDiff / 12)
    source.playbackRate.value = Math.min(rate, Math.max(rate, 0.25), 4)

    const attack = 0.005
    const release = Math.min(0.3, duration * 0.3)
    gainNode.gain.setValueAtTime(0, c.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.6, c.currentTime + attack)
    gainNode.gain.setValueAtTime(0.6, c.currentTime + duration - release)
    gainNode.gain.linearRampToValueAtTime(0, c.currentTime + duration)

    source.connect(gainNode)
    gainNode.connect(c.destination)
    source.start(c.currentTime)
    source.stop(c.currentTime + duration + 0.05)

    const voice: Voice = { source, gainNode }
    activeVoices.set(midi, voice)
    source.onended = () => activeVoices.delete(midi)
  }

  function stopAll() {
    const c = getCtx()
    if (!c) return
    const now = c.currentTime
    for (const voice of activeVoices.values()) {
      voice.gainNode.gain.cancelScheduledValues(now)
      voice.gainNode.gain.setValueAtTime(0, now)
      try { voice.source.stop(now + 0.01) } catch { /* already stopped */ }
    }
    activeVoices.clear()
  }

  return { error, isPlaying, loading, init, setInstrument, preloadNote, playNote, stopAll }
}
