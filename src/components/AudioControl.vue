<template>
  <div class="audio-control">
    <div class="audio-actions">
      <button
        type="button"
        class="btn audio-btn"
        :class="{ primary: isMic }"
        :disabled="state.status === 'requesting'"
        :aria-pressed="isMic ? 'true' : 'false'"
        @click="toggleMic"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
        </svg>
        <span>{{ micLabel }}</span>
        <span v-if="isMic" class="live-dot" aria-hidden="true"></span>
      </button>

      <label class="btn ghost audio-btn file-label" :class="{ active: isFile }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
        </svg>
        <span>{{ isFile ? 'Change audio' : 'Upload MP3' }}</span>
        <input
          class="sr-only"
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.opus"
          @change="onFile"
        />
      </label>

      <button v-if="isActive" type="button" class="btn ghost audio-btn stop-btn" @click="stop">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
        <span>Stop</span>
      </button>
    </div>

    <div v-if="isActive" class="audio-panel glass">
      <div class="panel-head">
        <span
          class="live-dot"
          aria-hidden="true"
          :style="{ transform: `scale(${1 + state.kick * 0.55})`, opacity: 0.5 + state.energy * 0.5 }"
        ></span>
        <span class="source mono" :title="state.sourceName">{{ sourceLabel }}</span>
        <button
          v-if="isFile"
          type="button"
          class="mini-btn mono"
          :aria-label="state.playing ? 'Pause audio' : 'Play audio'"
          @click="togglePlayback"
        >
          {{ state.playing ? 'pause' : 'play' }}
        </button>
      </div>

      <div class="meters">
        <div
          v-for="meter in meters"
          :key="meter.key"
          class="meter"
          role="meter"
          :aria-label="meter.label"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="percent(state[meter.key])"
        >
          <span class="meter-label mono">{{ meter.label }}</span>
          <span class="meter-track">
            <span
              class="meter-fill"
              :style="{ transform: `scaleX(${state[meter.key]})`, background: meter.color }"
            ></span>
          </span>
        </div>
      </div>
    </div>

    <p v-if="state.error" class="audio-error" role="alert">{{ state.error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  state,
  isActive,
  isMic,
  isFile,
  toggleMic,
  loadTrack,
  togglePlayback,
  stop
} from '../composables/useAudioReactive'

const meters = [
  { key: 'bass', label: 'bass / kick', color: 'var(--accent)' },
  { key: 'highMid', label: 'snare', color: 'var(--accent-2)' },
  { key: 'mid', label: 'voice', color: 'var(--accent-3)' },
  { key: 'treble', label: 'air', color: 'linear-gradient(90deg, var(--accent-2), var(--accent-3))' }
]

const micLabel = computed(() => {
  if (state.status === 'requesting') return 'Requesting mic…'
  if (isMic.value) return 'Mic live'
  return 'Use microphone'
})

const sourceLabel = computed(() => {
  if (isMic.value) return 'microphone · live'
  return state.sourceName || 'audio file'
})

function percent(value) {
  return Math.round((value || 0) * 100)
}

async function onFile(event) {
  const file = event.target.files?.[0]
  if (file) await loadTrack(file)
  event.target.value = ''
}
</script>

<style scoped>
.audio-control { margin-top: 1rem; }
.audio-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}
.audio-btn {
  background: rgba(167, 139, 250, 0.06);
  border-color: rgba(167, 139, 250, 0.28);
}
.audio-btn:hover { border-color: var(--accent-3); }
.audio-btn:disabled { opacity: 0.6; cursor: progress; transform: none; }
.audio-btn.primary {
  background: linear-gradient(135deg, var(--accent-bright), var(--accent-2-bright));
  border-color: transparent;
  color: #04211d;
}
.file-label { cursor: pointer; }
.file-label.active { border-color: var(--accent-2); }
.file-label:focus-within { outline: 2px solid var(--accent); outline-offset: 3px; }
.stop-btn { color: var(--muted); }

.live-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
  transition: opacity 80ms linear;
}
@media (prefers-reduced-motion: no-preference) {
  .audio-btn.primary .live-dot { animation: audio-pulse 1.4s ease-in-out infinite; }
  @keyframes audio-pulse {
    0%, 100% { box-shadow: 0 0 4px var(--accent); }
    50% { box-shadow: 0 0 14px var(--accent); }
  }
}

.audio-panel {
  margin-top: 0.9rem;
  max-width: 620px;
  padding: 0.75rem 0.95rem 0.85rem;
}
.panel-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.79rem;
}
.source {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--text);
}
.mini-btn {
  flex: none;
  padding: 0.18rem 0.55rem;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  background: rgba(148, 178, 255, 0.06);
  color: var(--accent);
  cursor: pointer;
  font-size: 0.7rem;
  line-height: 1.4;
}
.mini-btn:hover { border-color: var(--accent); }

.meters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem 0.8rem;
  margin-top: 0.7rem;
}
.meter { display: flex; flex-direction: column; gap: 0.3rem; }
.meter-label {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dim);
  white-space: nowrap;
}
.meter-track {
  display: block;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(148, 178, 255, 0.12);
}
.meter-fill {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 70ms linear;
  will-change: transform;
}
.audio-error {
  margin: 0.65rem 0 0;
  max-width: 620px;
  color: #fca5a5;
  font-size: 0.84rem;
}

@media (max-width: 600px) {
  .meters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .audio-actions .audio-btn { flex: 1 1 auto; justify-content: center; }
}
</style>
