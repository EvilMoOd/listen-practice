import { describe, it, expect } from 'vitest'
import { midiToPitch, pitchNameToMidi, allMidiInRange } from '../pitch'

describe('midiToPitch', () => {
  it('converts middle C (C4) correctly', () => {
    const pitch = midiToPitch(60)
    expect(pitch).toEqual({ midi: 60, name: 'C', octave: 4, fullName: 'C4' })
  })

  it('converts A4 (440Hz) correctly', () => {
    const pitch = midiToPitch(69)
    expect(pitch).toEqual({ midi: 69, name: 'A', octave: 4, fullName: 'A4' })
  })

  it('handles sharps correctly', () => {
    expect(midiToPitch(61).name).toBe('C#')
    expect(midiToPitch(61).fullName).toBe('C#4')
  })
})

describe('pitchNameToMidi', () => {
  it('converts C4 to MIDI 60', () => {
    expect(pitchNameToMidi('C', 4)).toBe(60)
  })

  it('converts A4 to MIDI 69', () => {
    expect(pitchNameToMidi('A', 4)).toBe(69)
  })

  it('converts C#4 to MIDI 61', () => {
    expect(pitchNameToMidi('C#', 4)).toBe(61)
  })
})

describe('allMidiInRange', () => {
  it('returns inclusive range', () => {
    expect(allMidiInRange(60, 63)).toEqual([60, 61, 62, 63])
  })

  it('returns single note when start equals end', () => {
    expect(allMidiInRange(60, 60)).toEqual([60])
  })
})
