import { ref, computed } from 'vue'
import { MODES, ROOT_NOTES, type RootNote } from '../utils/scales'

export const INSTRUMENTS = [
  { label: 'Piano', program: 0 },
  { label: 'Strings', program: 48 },
  { label: 'Guitar', program: 24 },
  { label: 'Voice', program: 54 },
] as const

export type Instrument = (typeof INSTRUMENTS)[number]['label']

export function useSettings() {
  const instrument = ref<Instrument>('Piano')
  const notesCount = ref(3)
  const bpm = ref(60)
  const rangeStart = ref(60)  // C4
  const rangeEnd = ref(72)    // C5
  const rootNote = ref<RootNote>('C')
  const modeIndex = ref(1) // Natural Major

  const rootPitchClass = computed(() => ROOT_NOTES.indexOf(rootNote.value))

  const scalePattern = computed(() => MODES[modeIndex.value].pattern)

  const scaleLabel = computed(() => {
    if (modeIndex.value === 0) return 'Chromatic'
    return `${rootNote.value} ${MODES[modeIndex.value].label}`
  })

  const settingsSummary = computed(() => {
    return `${instrument.value} · ${scaleLabel.value} · ${rangeStart.value}–${rangeEnd.value}`
  })

  return {
    instrument,
    notesCount,
    bpm,
    rangeStart,
    rangeEnd,
    rootNote,
    rootPitchClass,
    modeIndex,
    scalePattern,
    scaleLabel,
    settingsSummary,
    ROOT_NOTES,
    MODES,
  }
}
