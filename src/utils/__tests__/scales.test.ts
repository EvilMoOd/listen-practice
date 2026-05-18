import { describe, it, expect } from 'vitest'
import { getNotesInScale, MODES, ROOT_NOTES } from '../scales'

describe('getNotesInScale', () => {
  it('returns C major notes from C4 to C5', () => {
    const notes = getNotesInScale(60, 72, 0, [0, 2, 4, 5, 7, 9, 11])
    expect(notes).toEqual([60, 62, 64, 65, 67, 69, 71, 72])
  })

  it('returns chromatic notes when pattern is all 12 semitones', () => {
    const notes = getNotesInScale(60, 63, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(notes).toEqual([60, 61, 62, 63])
  })

  it('returns only pentatonic notes', () => {
    const notes = getNotesInScale(60, 72, 0, [0, 2, 4, 7, 9])
    expect(notes).toEqual([60, 62, 64, 67, 69, 72])
  })
})

describe('MODES', () => {
  it('has expected modes', () => {
    const labels = MODES.map(m => m.label)
    expect(labels).toContain('Chromatic')
    expect(labels).toContain('Natural Major')
    expect(labels).toContain('Major Blues')
    expect(labels).toContain('Minor Blues')
  })
})

describe('ROOT_NOTES', () => {
  it('has 12 root notes', () => {
    expect(ROOT_NOTES).toHaveLength(12)
    expect(ROOT_NOTES[0]).toBe('C')
  })
})
