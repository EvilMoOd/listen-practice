const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export interface Pitch {
  midi: number
  name: string
  octave: number
  fullName: string
}

export function midiToPitch(midi: number): Pitch {
  const name = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  return { midi, name, octave, fullName: `${name}${octave}` }
}

export function pitchNameToMidi(name: string, octave: number): number {
  const idx = NOTE_NAMES.indexOf(name as (typeof NOTE_NAMES)[number])
  if (idx === -1) throw new Error(`Invalid pitch name: ${name}`)
  return (octave + 1) * 12 + idx
}

export function allMidiInRange(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
