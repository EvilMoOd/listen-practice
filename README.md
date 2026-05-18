# listen-practice

Ear training tool — play random notes via browser audio synthesis, listen with your real piano, then reveal the answers.

## Features

- **4 Instruments** — Piano, Strings, Guitar, Voice (SoundFont samples via MIDI.js CDN)
- **Scale System** — 12 root notes × 8 modes (Chromatic, Natural Major, Natural Minor, Harmonic Minor, Melodic Minor, Major/Minor Pentatonic, Major/Minor Blues)
- **Configurable** — notes per round, BPM, pitch range (full 88 keys)
- **Instant Play** — click to hear a random round, replay as many times as needed, reveal when ready
- **Mobile Friendly** — responsive design with slide-out settings drawer

## How It Works

1. **Configure** your settings (instrument, scale, pitch range, notes per round, BPM)
2. **Play** — the app picks random notes from your selected scale/range, loads SoundFont samples from CDN, and plays them
3. **Listen** — use your real piano to match what you hear
4. **Reveal** — click Show Answer to see which notes were played
5. **Next** — generate a new round and repeat

## Audio

Notes are played using [FluidR3_GM](https://github.com/gleitz/midi-js-soundfonts/tree/gh-pages/FluidR3_GM) SoundFont samples hosted on the [MIDI.js CDN](https://gleitz.github.io/midi-js-soundfonts/). Samples are loaded on demand per-note and cached for reuse. The first round may take a moment while notes are downloaded; subsequent rounds play instantly from cache.

## License

MIT
