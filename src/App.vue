<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SettingsDrawer from './components/SettingsDrawer.vue'
import Player from './components/Player.vue'
import AnswerPanel from './components/AnswerPanel.vue'
import { useAudioEngine } from './composables/useAudioEngine'
import { useNoteGenerator } from './composables/useNoteGenerator'

const audio = useAudioEngine()
const notes = useNoteGenerator()

const settingsDrawerRef = ref<InstanceType<typeof SettingsDrawer> | null>(null)
const drawerOpen = ref(false)
const answerVisible = ref(false)

onMounted(() => audio.init())

const notesCount = computed(() => settingsDrawerRef.value?.settings.notesCount.value ?? 3)
const bpm = computed(() => settingsDrawerRef.value?.settings.bpm.value ?? 60)
const settingsSummary = computed(() => settingsDrawerRef.value?.settings.settingsSummary.value ?? '')

const round = computed(() => notes.currentRound.value)
const loadingNotes = ref(false)

function playCurrentRound() {
  answerVisible.value = false
  audio.stopAll()

  const settings = settingsDrawerRef.value!.settings
  const duration = (60 / settings.bpm.value) * 1000

  if (!round.value) return

  audio.setInstrument(settings.instrument.value)
  loadingNotes.value = true

  // Preload all unique notes silently first
  const neededNotes = new Set(round.value.notes.map(n => n.midi))
  const preloadPromises = Array.from(neededNotes).map(midi =>
    audio.preloadNote(midi)
  )

  // Then replay with proper timing
  Promise.all(preloadPromises).then(() => {
    loadingNotes.value = false
    audio.isPlaying.value = true
    for (let i = 0; i < round.value!.notes.length; i++) {
      const note = round.value!.notes[i]
      const delay = i * duration
      setTimeout(() => audio.playNote(note.midi, duration * 0.8), delay)
    }

    const totalTime = round.value!.notes.length * duration
    setTimeout(() => {
      audio.isPlaying.value = false
    }, totalTime)
  })
}

function handlePlay() {
  if (!notes.currentRound.value) {
    generateNewRound()
  }
  playCurrentRound()
}

function generateNewRound() {
  const settings = settingsDrawerRef.value!.settings
  notes.generate(
    settings.rangeStart.value,
    settings.rangeEnd.value,
    settings.rootPitchClass.value,
    settings.scalePattern.value,
    settings.notesCount.value,
  )
}

function handleNext() {
  answerVisible.value = false
  generateNewRound()
  playCurrentRound()
}
</script>

<template>
  <div class="app">
    <div v-if="audio.loading.value" class="loading-screen">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Loading instruments...</p>
        <p class="loading-progress">Loading...</p>
      </div>
    </div>

    <template v-else>
      <div class="settings-summary" @click="drawerOpen = true">
        <span class="summary-text">{{ settingsSummary }}</span>
        <div class="gear-btn">&#9881;</div>
      </div>

      <div class="main-content">
        <Player
          :is-playing="audio.isPlaying.value"
        :is-loading="loadingNotes"
          :error="audio.error.value"
          :notes-count="notesCount"
          :bpm="bpm"
          @play="handlePlay"
          @show-answer="answerVisible = true"
        />

        <AnswerPanel
          :visible="answerVisible"
          :notes="round?.notes ?? null"
          @next="handleNext"
        />
      </div>

      <SettingsDrawer
        ref="settingsDrawerRef"
        :open="drawerOpen"
        @close="drawerOpen = false"
      />
    </template>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  gap: 24px;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: var(--text);
}

.loading-progress {
  font-size: 14px;
  color: var(--text);
  opacity: 0.6;
}

.settings-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--accent-bg);
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.gear-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
}

.summary-text {
  font-size: 13px;
  color: var(--text);
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

@media (max-width: 640px) {
  .app {
    padding: 40px 16px;
  }

  .settings-summary {
    top: 12px;
    right: 12px;
  }
}
</style>
