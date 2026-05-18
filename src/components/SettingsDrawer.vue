<script setup lang="ts">
import { useSettings, INSTRUMENTS } from '../composables/useSettings'
import { midiToPitch } from '../utils/pitch'

const { instrument, notesCount, bpm, rangeStart, rangeEnd, rootNote, rootPitchClass, modeIndex, scalePattern, scaleLabel, settingsSummary, ROOT_NOTES, MODES } = useSettings()
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function formatMidi(midi: number): string {
  return midiToPitch(midi).fullName
}

function isInstrumentActive(label: string): boolean {
  return instrument.value === label
}

function selectInstrument(label: string) {
  instrument.value = label as (typeof INSTRUMENTS)[number]['label']
}

// Piano 88 keys: A0 (21) to C8 (108)
const PIANO_KEYS: number[] = []
for (let i = 21; i <= 108; i++) PIANO_KEYS.push(i)

function onRangeStartChange() {
  if (rangeEnd.value < rangeStart.value) {
    rangeEnd.value = rangeStart.value
  }
}

defineExpose({ settings: { instrument, notesCount, bpm, rangeStart, rangeEnd, rootNote, rootPitchClass, modeIndex, scalePattern, scaleLabel, settingsSummary, ROOT_NOTES, MODES } })
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="drawer-overlay" @click="emit('close')"></div>
    </Transition>
    <Transition name="drawer">
      <div v-if="open" class="drawer-panel" @click="emit('close')">
        <div class="drawer-inner" @click.stop>
          <div class="drawer-header">
            <h2>Settings</h2>
            <button class="close-btn" @click="emit('close')">&times;</button>
          </div>

          <div class="drawer-body">
            <!-- Instrument -->
            <div class="setting-group">
              <label class="setting-label">Instrument</label>
              <div class="instrument-buttons">
                <button
                  v-for="inst in INSTRUMENTS"
                  :key="inst.label"
                  :class="['inst-btn', { active: isInstrumentActive(inst.label) }]"
                  @click="selectInstrument(inst.label)"
                >
                  {{ inst.label }}
                </button>
              </div>
            </div>

            <!-- Notes per round -->
            <div class="setting-group">
              <label class="setting-label">Notes per round: {{ notesCount }}</label>
              <input type="range" min="1" max="7" v-model.number="notesCount" />
            </div>

            <!-- BPM -->
            <div class="setting-group">
              <label class="setting-label">BPM: {{ bpm }}</label>
              <input type="range" min="30" max="180" v-model.number="bpm" />
            </div>

            <!-- Pitch Range -->
            <div class="setting-group">
              <label class="setting-label">Pitch Range</label>
              <div class="range-inputs">
                <select v-model.number="rangeStart" @change="onRangeStartChange">
                  <option v-for="m in PIANO_KEYS" :key="m" :value="m">{{ formatMidi(m) }}</option>
                </select>
                <span>&mdash;</span>
                <select v-model.number="rangeEnd">
                  <option v-for="m in PIANO_KEYS" :key="m" :value="m" :disabled="m < rangeStart">{{ formatMidi(m) }}</option>
                </select>
              </div>
            </div>

            <!-- Root Note -->
            <div class="setting-group">
              <label class="setting-label">Root Note</label>
              <select v-model="rootNote">
                <option v-for="note in ROOT_NOTES" :key="note" :value="note">{{ note }}</option>
              </select>
            </div>

            <!-- Mode -->
            <div class="setting-group">
              <label class="setting-label">Mode</label>
              <select v-model.number="modeIndex">
                <option v-for="(mode, i) in MODES" :key="i" :value="i">{{ mode.label }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
}

.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 101;
  display: flex;
}

.drawer-inner {
  width: min(360px, 85vw);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.drawer-header h2 {
  font-size: 18px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--text);
  line-height: 1;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text);
  margin-bottom: 8px;
}

.instrument-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.inst-btn {
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
}

.inst-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.range-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.range-inputs select {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  font-family: var(--mono);
  font-size: 13px;
}

input[type="range"] {
  width: 100%;
}
</style>
