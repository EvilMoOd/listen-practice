<script setup lang="ts">
import { type Pitch } from '../utils/pitch'

const props = defineProps<{
  visible: boolean
  notes: Pitch[] | null
}>()

const emit = defineEmits<{
  next: []
}>()
</script>

<template>
  <Transition name="answer">
    <div v-if="visible && notes" class="answer-panel">
      <div class="answer-notes">
        <div v-for="(note, i) in notes" :key="i" class="note-chip">
          <span class="note-name">{{ note.fullName }}</span>
        </div>
      </div>
      <button class="next-btn" @click="emit('next')">
        Next
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.answer-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(100, 200, 100, 0.1);
  border-radius: 12px;
  min-width: 200px;
}

@media (prefers-color-scheme: dark) {
  .answer-panel {
    background: rgba(100, 200, 100, 0.08);
  }
}

.answer-notes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.note-chip {
  padding: 8px 16px;
  background: rgba(100, 200, 100, 0.2);
  border-radius: 8px;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
  color: #2d7d2d;
}

@media (prefers-color-scheme: dark) {
  .note-chip {
    color: #6dd66d;
  }
}

.next-btn {
  padding: 12px 32px;
  font-size: 15px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.1s;
}

.next-btn:hover {
  transform: scale(1.02);
}

.answer-enter-active,
.answer-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.answer-enter-from,
.answer-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
