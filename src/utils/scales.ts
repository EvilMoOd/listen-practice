export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const
export type RootNote = (typeof ROOT_NOTES)[number]

export const MODES = [
  { label: 'Chromatic', pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { label: 'Natural Major', pattern: [0, 2, 4, 5, 7, 9, 11] },
  { label: 'Natural Minor', pattern: [0, 2, 3, 5, 7, 8, 10] },
  { label: 'Harmonic Minor', pattern: [0, 2, 3, 5, 7, 8, 11] },
  { label: 'Melodic Minor', pattern: [0, 2, 3, 5, 7, 9, 11] },
  { label: 'Major Pentatonic', pattern: [0, 2, 4, 7, 9] },
  { label: 'Minor Pentatonic', pattern: [0, 3, 5, 7, 10] },
  { label: 'Major Blues', pattern: [0, 2, 3, 4, 7, 9] },
  { label: 'Minor Blues', pattern: [0, 3, 5, 6, 7, 10] },
] as const

export function getNotesInScale(startMidi: number, endMidi: number, rootPitchClass: number, pattern: readonly number[]): number[] {
  const scalePcs = new Set(pattern.map((interval) => (rootPitchClass + interval) % 12))
  const result: number[] = []
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (scalePcs.has(midi % 12)) {
      result.push(midi)
    }
  }
  return result
}
