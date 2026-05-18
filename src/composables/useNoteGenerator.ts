import { ref } from 'vue'
import { getNotesInScale } from '../utils/scales'
import { midiToPitch, type Pitch } from '../utils/pitch'

export interface NoteRound {
  notes: Pitch[]
}

export function useNoteGenerator() {
  const currentRound = ref<NoteRound | null>(null)

  function generate(
    rangeStart: number,
    rangeEnd: number,
    rootPitchClass: number,
    scalePattern: readonly number[],
    count: number,
  ): NoteRound {
    const available = getNotesInScale(rangeStart, rangeEnd, rootPitchClass, scalePattern)
    if (available.length === 0) {
      throw new Error('No notes available in the selected range and scale')
    }

    const notes: Pitch[] = []
    for (let i = 0; i < count; i++) {
      const randomMidi = available[Math.floor(Math.random() * available.length)]
      notes.push(midiToPitch(randomMidi))
    }

    currentRound.value = { notes }
    return currentRound.value
  }

  return { currentRound, generate }
}
