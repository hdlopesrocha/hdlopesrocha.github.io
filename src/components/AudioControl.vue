<template>
  <div class="audio-control">
    <div class="audio-panel glass">
      <div class="panel-head">
        <span
          class="live-dot"
          aria-hidden="true"
          :style="{ transform: `scale(${1 + state.kick * 0.55})`, opacity: 0.5 + state.energy * 0.5 }"
        ></span>
        <span class="source mono" :title="state.sourceName">{{ sourceLabel }}</span>
        <div class="transport">
          <button
            type="button"
            class="icon-btn"
            :class="{ active: isMic }"
            :disabled="state.status === 'requesting' || videoExporting"
            :aria-pressed="isMic ? 'true' : 'false'"
            :aria-label="micLabel"
            :title="micLabel"
            @click="toggleMic"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
            </svg>
          </button>
          <label
            class="icon-btn file-icon"
            :class="{ active: isFile, disabled: videoExporting }"
            :title="isFile ? t('audio.changeAudio') : t('audio.uploadAudio')"
            :aria-label="isFile ? t('audio.changeAudio') : t('audio.uploadAudio')"
            :aria-disabled="videoExporting ? 'true' : undefined"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
            </svg>
            <input
              class="sr-only"
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.oga,.m4a,.aac,.flac,.opus"
              :disabled="videoExporting"
              @change="onFile"
            />
          </label>
          <button
            v-if="isFile"
            type="button"
            class="icon-btn"
            :disabled="videoExporting"
            :aria-label="state.playing ? t('audio.pauseAudio') : t('audio.playAudio')"
            :title="state.playing ? t('audio.pauseAudio') : t('audio.playAudio')"
            @click="togglePlayback"
          >
            <svg v-if="state.playing" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn export-btn"
            :class="{ recording: videoExporting }"
            :disabled="!isFile"
            :aria-label="videoExportLabel"
            :title="videoExportLabel"
            @click="toggleExport"
          >
            <svg v-if="videoExporting" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="6" width="12" height="12" rx="2.5" />
              <path d="M15 10.5 21 7v10l-6-3.5" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="{ active: showScene }"
            :aria-pressed="showScene ? 'true' : 'false'"
            :aria-label="t('audio.sceneControls')"
            :title="t('audio.sceneControls')"
            @click="toggleScenePanel"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
              <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn"
            :class="{ active: showFilters }"
            :aria-pressed="showFilters ? 'true' : 'false'"
            :aria-label="t('audio.filterControls')"
            :title="t('audio.filterControls')"
            @click="toggleFilterPanel"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h13M21 17h-1" />
              <circle cx="15" cy="7" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="19" cy="17" r="2" />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn stop-btn"
            :disabled="!isActive || videoExporting"
            :aria-label="t('audio.stopAudio')"
            :title="t('audio.stopAudio')"
            @click="stop"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>
      </div>

      <p v-if="!isActive" class="audio-cta">
        <span>{{ t('audio.cta') }}</span>
        <button
          type="button"
          class="demo-btn mono"
          :disabled="demoLoading || videoExporting || state.status === 'requesting'"
          @click="loadDemo"
        >
          <span v-if="!demoLoading" aria-hidden="true">▶</span>
          {{ demoLoading ? t('audio.demoLoading') : t('audio.tryDemo') }}
        </button>
      </p>

      <div v-if="showFilters" class="filter-box blur-surface">
        <div class="filter-box-head">
          <span class="mono filter-title">{{ t('audio.bandPass') }}</span>
          <button
            type="button"
            class="filter-power mono"
            :class="{ on: filterState.enabled }"
            :aria-pressed="filterState.enabled ? 'true' : 'false'"
            @click="setFilterEnabled(!filterState.enabled)"
          >
            {{ filterState.enabled ? t('audio.on') : t('audio.off') }}
          </button>
        </div>
        <div class="filter-presets">
          <button
            v-for="preset in FILTER_PRESETS"
            :key="preset.id"
            type="button"
            class="filter-preset mono"
            :class="{ active: filterState.preset === preset.id }"
            @click="applyFilterPreset(preset.id)"
          >
            {{ t('audio.presets.' + preset.id) }}
          </button>
        </div>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.freq', { hz: Math.round(filterState.frequency) }) }}</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            :value="freqToSlider(filterState.frequency)"
            @input="setFilterFrequency(sliderToFreq(Number($event.target.value)))"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.q', { value: filterState.q.toFixed(1) }) }}</span>
          <input
            type="range"
            min="0.3"
            max="12"
            step="0.1"
            :value="filterState.q"
            @input="setFilterQ(Number($event.target.value))"
          />
        </label>
      </div>

      <div v-if="showScene" class="filter-box scene-box blur-surface">
        <div class="filter-box-head">
          <span class="mono filter-title">{{ t('audio.scene.title') }}</span>
          <span class="mono scene-glow-value">{{ Math.round(sceneFx.glow * 100) }}%</span>
        </div>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.glowStrength') }}</span>
          <input
            type="range"
            min="0"
            max="300"
            step="1"
            :value="Math.round(sceneFx.glow * 100)"
            :disabled="!sceneFx.showGlow"
            @input="sceneFx.glow = Number($event.target.value) / 100"
          />
        </label>
        <div class="filter-presets">
          <button
            v-for="item in sceneToggles"
            :key="item.key"
            type="button"
            class="filter-preset mono"
            :class="{ active: sceneFx[item.key] }"
            @click="toggleScene(item.key)"
          >
            {{ t(item.labelKey) }}
          </button>
        </div>
        <div class="scene-divider mono">{{ t('audio.scene.particles') }}</div>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.count', { count: sceneFx.particleCount }) }}</span>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            :value="sceneFx.particleCount"
            :disabled="!sceneFx.showParticles"
            @input="sceneFx.particleCount = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.trailLength', { length: sceneFx.trailLength }) }}</span>
          <input
            type="range"
            min="8"
            max="160"
            step="4"
            :value="sceneFx.trailLength"
            :disabled="!sceneFx.showParticles"
            @input="sceneFx.trailLength = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.particleSpeed', { speed: sceneFx.particleSpeed.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="3"
            step="0.05"
            :value="sceneFx.particleSpeed"
            :disabled="!sceneFx.showParticles"
            @input="sceneFx.particleSpeed = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.symbolSpacing', { spacing: sceneFx.glyphSpacing }) }}</span>
          <input
            type="range"
            min="4"
            max="64"
            step="1"
            :value="sceneFx.glyphSpacing"
            :disabled="!sceneFx.showParticles || !sceneFx.showMatrix"
            @input="sceneFx.glyphSpacing = Number($event.target.value)"
          />
        </label>
        <div class="scene-divider mono">{{ t('audio.scene.perlinNoise') }}</div>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.octaves', { count: sceneFx.noiseOctaves }) }}</span>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            :value="sceneFx.noiseOctaves"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseOctaves = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.lacunarity', { value: sceneFx.noiseLacunarity.toFixed(2) }) }}</span>
          <input
            type="range"
            min="1.2"
            max="4"
            step="0.05"
            :value="sceneFx.noiseLacunarity"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseLacunarity = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.amplitude', { value: sceneFx.noiseAmplitude.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="sceneFx.noiseAmplitude"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseAmplitude = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.gain', { value: sceneFx.noiseGain.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="sceneFx.noiseGain"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseGain = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.contrast', { value: sceneFx.noiseContrast.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="sceneFx.noiseContrast"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseContrast = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.brightness', { value: sceneFx.noiseBrightness.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            :value="sceneFx.noiseBrightness"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseBrightness = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.period', { value: sceneFx.noisePeriod.toFixed(1) }) }}</span>
          <input
            type="range"
            min="1"
            max="30"
            step="0.5"
            :value="sceneFx.noisePeriod"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noisePeriod = Number($event.target.value)"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.scale', { value: formatScale(sceneFx.noiseScale) }) }}</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            :value="scaleToSlider(sceneFx.noiseScale)"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseScale = sliderToScale(Number($event.target.value))"
          />
        </label>
        <label class="filter-slider">
          <span class="mono">{{ t('audio.scene.speed', { value: sceneFx.noiseSpeed.toFixed(2) }) }}</span>
          <input
            type="range"
            min="0"
            max="4"
            step="0.05"
            :value="sceneFx.noiseSpeed"
            :disabled="!sceneFx.showSmoke"
            @input="sceneFx.noiseSpeed = Number($event.target.value)"
          />
        </label>
      </div>

      <div class="meters">
        <div
          v-for="meter in meters"
          :key="meter.key"
          class="meter"
          :style="{ '--band-color': bandColors[meter.colorKey] }"
        >
          <label class="meter-label mono" :title="t('audio.chooseColor', { label: t(meter.labelKey) })">
            <input
              class="meter-dot"
              type="color"
              :value="bandColors[meter.colorKey]"
              :aria-label="t('audio.colorAria', { label: t(meter.labelKey) })"
              @input="setBandColor(meter.colorKey, $event.target.value)"
            />
            <span>{{ t(meter.labelKey) }}</span>
          </label>
          <span
            class="meter-track"
            role="meter"
            :aria-label="t(meter.labelKey)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="percent(state[meter.key])"
          >
            <span
              class="meter-fill"
              :style="{ transform: `scaleX(${state[meter.key]})`, background: bandColors[meter.colorKey] }"
            ></span>
          </span>
        </div>
      </div>
    </div>

    <p v-if="videoExporting" class="export-status mono">
      <span class="recording-line">
        <span class="record-dot" aria-hidden="true"></span>
        {{ t('video.recording', { elapsed: videoExportElapsed }) }}
      </span>
      <span v-if="videoExportNotice" class="export-note">{{ videoExportNotice }}</span>
    </p>
    <p v-else-if="videoExportError" class="audio-error" role="alert">{{ videoExportError }}</p>
    <p v-else-if="videoExportNotice" class="export-status mono" role="status">{{ videoExportNotice }}</p>
    <p v-if="state.error" class="audio-error" role="alert">{{ state.error }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  state,
  bandColors,
  FILTER_PRESETS,
  filterState,
  isActive,
  isMic,
  isFile,
  setBandColor,
  setFilterEnabled,
  setFilterFrequency,
  setFilterQ,
  applyFilterPreset,
  toggleMic,
  loadTrack,
  togglePlayback,
  stop
} from '../composables/useAudioReactive'
import { sceneFx } from '../composables/useSceneFx'
import { useVideoExport } from '../composables/useVideoExport'
import { t } from '../i18n'

const {
  exporting: videoExporting,
  elapsedLabel: videoExportElapsed,
  notice: videoExportNotice,
  error: videoExportError,
  exportLabel: videoExportLabel,
  toggleExport
} = useVideoExport()

const DEMO_TRACK_URL = `${import.meta.env.BASE_URL}audio.mp3`
const demoLoading = ref(false)

async function loadDemo() {
  if (demoLoading.value || videoExporting.value || state.status === 'requesting') return
  demoLoading.value = true
  try {
    const response = await fetch(DEMO_TRACK_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const blob = await response.blob()
    const file = new File([blob], 'demo.mp3', { type: blob.type || 'audio/mpeg' })
    await loadTrack(file)
  } catch {
    state.error = t('audio.errors.demoFailed')
  } finally {
    demoLoading.value = false
  }
}

const meters = [
  { key: 'bass', colorKey: 'bass', labelKey: 'audio.meters.bass' },
  { key: 'highMid', colorKey: 'snare', labelKey: 'audio.meters.snare' },
  { key: 'mid', colorKey: 'voice', labelKey: 'audio.meters.voice' },
  { key: 'treble', colorKey: 'air', labelKey: 'audio.meters.melody' }
]

const showFilters = ref(false)
const showScene = ref(false)
const sceneToggles = [
  { key: 'showGraph', labelKey: 'audio.sceneToggles.showGraph' },
  { key: 'showTriangles', labelKey: 'audio.sceneToggles.showTriangles' },
  { key: 'showGlow', labelKey: 'audio.sceneToggles.showGlow' },
  { key: 'showParticles', labelKey: 'audio.sceneToggles.showParticles' },
  { key: 'showTrails', labelKey: 'audio.sceneToggles.showTrails' },
  { key: 'showDots', labelKey: 'audio.sceneToggles.showDots' },
  { key: 'showMatrix', labelKey: 'audio.sceneToggles.showMatrix' },
  { key: 'showSmoke', labelKey: 'audio.sceneToggles.showSmoke' }
]

function toggleFilterPanel() {
  showFilters.value = !showFilters.value
  if (showFilters.value) showScene.value = false
}

function toggleScenePanel() {
  showScene.value = !showScene.value
  if (showScene.value) showFilters.value = false
}

function toggleScene(key) {
  sceneFx[key] = !sceneFx[key]
  if (key === 'showMatrix' && sceneFx.showMatrix) sceneFx.showDots = false
  if (key === 'showDots' && sceneFx.showDots) sceneFx.showMatrix = false
}

const FILTER_MIN = 60
const FILTER_MAX = 12000
const SCALE_MIN = 0.5
const SCALE_MAX = 8096

function freqToSlider(hz) {
  return Math.round((100 * Math.log(hz / FILTER_MIN)) / Math.log(FILTER_MAX / FILTER_MIN))
}

function sliderToFreq(value) {
  return Math.round(FILTER_MIN * Math.pow(FILTER_MAX / FILTER_MIN, value / 100))
}

function scaleToSlider(value) {
  return Math.round((100 * Math.log(value / SCALE_MIN)) / Math.log(SCALE_MAX / SCALE_MIN))
}

function sliderToScale(value) {
  return SCALE_MIN * Math.pow(SCALE_MAX / SCALE_MIN, value / 100)
}

function formatScale(value) {
  return value >= 100 ? Math.round(value).toString() : value.toFixed(2)
}

const micLabel = computed(() => {
  if (state.status === 'requesting') return t('audio.mic.requesting')
  if (isMic.value) return t('audio.mic.live')
  return t('audio.mic.use')
})

const sourceLabel = computed(() => {
  if (isMic.value) return t('audio.source.mic')
  if (isFile.value) return state.sourceName || t('audio.source.file')
  return t('audio.source.none')
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
.transport {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: auto;
  flex: none;
}
.file-icon { cursor: pointer; }
.stop-btn { color: var(--muted); }

.icon-btn {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
.icon-btn:hover,
.icon-btn.active {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 60%, transparent);
  background: rgba(5, 7, 13, 0.72);
}
.icon-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.icon-btn.stop-btn:hover { color: #fca5a5; border-color: #fca5a5; }
.file-icon.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.export-btn.recording,
.export-btn.recording:hover {
  color: #f87171;
  border-color: color-mix(in srgb, #f87171 70%, transparent);
  background: rgba(248, 113, 113, 0.12);
}
@media (prefers-reduced-motion: no-preference) {
  .export-btn.recording { animation: export-recording 1.15s ease-in-out infinite; }
  @keyframes export-recording {
    0%, 100% { box-shadow: 0 0 0 rgba(248, 113, 113, 0); }
    50% { box-shadow: 0 0 12px rgba(248, 113, 113, 0.45); }
  }
}

.filter-box {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.65rem;
  padding: 0.6rem 0.7rem;
  border: 1px solid var(--line);
  border-radius: 8px;
}
.filter-box-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
}
.filter-title {
  color: var(--accent);
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.filter-power,
.filter-preset {
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(148, 178, 255, 0.05);
  color: var(--muted);
  cursor: pointer;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.16rem 0.55rem;
  transition: all 0.15s ease;
}
.filter-power.on,
.filter-preset.active {
  color: var(--text);
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 16%, transparent);
}
.filter-power:hover,
.filter-preset:hover { color: var(--text); border-color: var(--accent); }
.filter-presets { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.filter-slider {
  display: grid;
  gap: 0.25rem;
  color: var(--dim);
  font-size: 0.62rem;
}
.filter-slider input {
  width: 100%;
  accent-color: var(--accent);
  cursor: pointer;
}
.filter-slider input:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.scene-glow-value {
  color: var(--dim);
  font-size: 0.62rem;
}
.scene-divider {
  margin-top: 0.15rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--line);
  color: var(--accent);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

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
  max-width: var(--hero-copy-width, 640px);
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
.audio-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin: 0.65rem 0 0;
  padding-top: 0.6rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.4;
}
.audio-cta > span { flex: 1; min-width: 15rem; }
.demo-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  color: var(--accent);
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.demo-btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  border-color: var(--accent);
}
.demo-btn:disabled { opacity: 0.55; cursor: wait; }
.meters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem 0.8rem;
  margin-top: 0.7rem;
}
.meter { display: flex; flex-direction: column; gap: 0.3rem; }
.meter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--band-color) 72%, var(--text));
  white-space: nowrap;
  cursor: pointer;
}
.meter-dot {
  width: 11px;
  height: 11px;
  flex: none;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}
.meter-dot::-webkit-color-swatch-wrapper { padding: 0; }
.meter-dot::-webkit-color-swatch { border: 0; border-radius: 50%; }
.meter-dot::-moz-color-swatch { border: 0; border-radius: 50%; }
.meter-dot:hover { border-color: var(--text); }
.meter-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
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
.export-status {
  display: grid;
  gap: 0.2rem;
  margin: 0.65rem 0 0;
  max-width: 620px;
  color: var(--dim);
  font-size: 0.68rem;
  line-height: 1.45;
}
.recording-line {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: color-mix(in srgb, #f87171 75%, var(--text));
}
.record-dot {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 50%;
  background: #f87171;
  box-shadow: 0 0 8px #f87171;
}
@media (prefers-reduced-motion: no-preference) {
  .record-dot { animation: export-dot 1.15s ease-in-out infinite; }
  @keyframes export-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
}
.export-note { color: var(--muted); }

@media (max-width: 600px) {
  .meters { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .panel-head { flex-wrap: wrap; }
  .transport { margin-left: 0; width: 100%; justify-content: flex-end; }
}
</style>
