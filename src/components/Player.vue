<script setup lang="ts">
defineProps<{
  isPlaying: boolean
  isLoading: boolean
  error: string
  notesCount: number
  bpm: number
}>()

const emit = defineEmits<{
  play: []
  showAnswer: []
}>()
</script>

<template>
  <div class="player">
    <div class="player-status">
      <span class="status-badge" :class="{ playing: isPlaying }">
        {{ isLoading ? 'Loading notes...' : isPlaying ? 'Playing...' : 'Ready' }}
      </span>
      <span class="status-info">{{ notesCount }} notes &middot; {{ bpm }} BPM</span>
    </div>

    <div v-if="error" class="player-error">
      {{ error }}
    </div>

    <button
      class="play-btn"
      :disabled="isPlaying || isLoading"
      @click="emit('play')"
    >
      {{ isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Play' }}
    </button>

    <button class="answer-btn" @click="emit('showAnswer')">
      Show Answer
    </button>
  </div>
</template>

<style scoped>
.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.player-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.status-badge {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.status-badge.playing {
  color: var(--accent);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-info {
  font-size: 13px;
  color: var(--text);
}

.player-error {
  padding: 12px 16px;
  background: #ffe0e0;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  max-width: 300px;
}

@media (prefers-color-scheme: dark) {
  .player-error {
    background: rgba(255, 80, 80, 0.15);
  }
}

.error-hint {
  font-size: 12px;
  margin-top: 6px;
  color: var(--text);
}

.play-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 500;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
  min-width: 180px;
}

.play-btn:hover:not(:disabled) {
  transform: scale(1.02);
}

.play-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.answer-btn {
  padding: 12px 32px;
  font-size: 15px;
  background: transparent;
  border: 2px solid var(--accent);
  border-radius: 10px;
  color: var(--accent);
  cursor: pointer;
  transition: all 0.15s;
}

.answer-btn:hover {
  background: var(--accent-bg);
}
</style>
