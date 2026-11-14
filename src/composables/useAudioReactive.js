import { computed, reactive } from 'vue'
import { hexToHsl } from '../lib/color'

/**
 * Music-reactive audio engine.
 *
 * One shared Web Audio graph powers the whole page:
 *   mic / <audio> -> AnalyserNode (FFT) -> (file audio also -> speakers)
 *
 * The analyser is split into perceptually useful bands (kick/bass, drums,
 * voice, snare presence, melody) and a few smoothed descriptors (energy,
 * spectral centroid, beat impulses). HeroBackground and the UI read from the
 * same state, so palette + animation stay perfectly in sync.
 */

const FFT_SIZE = 2048
const ANALYSIS_INTERVAL = 16 // ~60 Hz updates; one analysis per animation frame
const AUDIO_EXTENSIONS = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm)$/i

const BANDS = {
  bass: { range: [30, 160], gain: 1.25 }, // kick drum / sub
  lowMid: { range: [160, 320], gain: 1.8 }, // snare body / low voice
  mid: { range: [300, 3000], gain: 2.4 }, // human voice formants
  highMid: { range: [2000, 8000], gain: 3.0 }, // snare crack / presence
  treble: { range: [1000, 5000], gain: 2.6 } // melody / lead harmonics
}

// The four editable components define the weights of their colours. Those
// weights produce one shared main colour x; every palette slot derives from x.
export const state = reactive({
  status: 'idle', // idle | requesting | mic | file | error
  playing: false,
  sourceName: '',
  error: '',
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0,
  energy: 0,
  kick: 0,
  snare: 0,
  centroid: 0,
  pace: 0
})

export const isActive = computed(() => state.status === 'mic' || state.status === 'file')
export const isMic = computed(() => state.status === 'mic')
export const isFile = computed(() => state.status === 'file')

export const FILTER_PRESETS = [
  { id: 'bass', label: 'BASS', frequency: 90, q: 0.9 },
  { id: 'snare', label: 'SNARE', frequency: 3200, q: 1.2 },
  { id: 'voice', label: 'VOICE', frequency: 800, q: 1.1 },
  { id: 'melody', label: 'MELODY', frequency: 2500, q: 0.9 }
]

export const filterState = reactive({
  enabled: false,
  preset: null,
  frequency: 120,
  q: 1
})

function applyFilter() {
  if (!filterNode || !audioCtx) return
  filterNode.type = filterState.enabled ? 'bandpass' : 'allpass'
  const now = audioCtx.currentTime
  filterNode.frequency.setTargetAtTime(filterState.frequency, now, 0.03)
  filterNode.Q.setTargetAtTime(filterState.q, now, 0.03)
}

export function setFilterEnabled(enabled) {
  filterState.enabled = enabled
  applyFilter()
}

export function setFilterFrequency(frequency) {
  filterState.frequency = Math.min(12000, Math.max(60, frequency))
  filterState.preset = null
  applyFilter()
}

export function setFilterQ(q) {
  filterState.q = Math.min(12, Math.max(0.3, q))
  filterState.preset = null
  applyFilter()
}

export function applyFilterPreset(id) {
  const preset = FILTER_PRESETS.find((item) => item.id === id)
  if (!preset) return
  filterState.enabled = true
  filterState.preset = preset.id
  filterState.frequency = preset.frequency
  filterState.q = preset.q
  applyFilter()
}

// Editable colours for the four meter bands. These are UI preferences rather
// than analysis data, so they live outside the transient `state` object and
// survive reloads in localStorage.
export const DEFAULT_BAND_COLORS = Object.freeze({
  bass: '#1a5eff',
  snare: '#00ffff',
  voice: '#04ff60',
  air: '#ffff00'
})
export const bandColors = reactive({ ...DEFAULT_BAND_COLORS })

const BAND_COLORS_KEY = 'hdlr-audio-band-colors'
const HEX_COLOR = /^#[0-9a-f]{6}$/i

function readSavedBandColors() {
  try {
    const saved = JSON.parse(localStorage.getItem(BAND_COLORS_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return
    for (const key of Object.keys(DEFAULT_BAND_COLORS)) {
      if (typeof saved[key] === 'string' && HEX_COLOR.test(saved[key])) {
        bandColors[key] = saved[key]
      }
    }
  } catch {
    /* localStorage can be unavailable (private mode, blocked storage) */
  }
}

readSavedBandColors()

export function setBandColor(key, value) {
  if (!(key in DEFAULT_BAND_COLORS) || !HEX_COLOR.test(value)) return
  bandColors[key] = value
  syncDocumentPalette(true)
  try {
    localStorage.setItem(BAND_COLORS_KEY, JSON.stringify(bandColors))
  } catch {
    /* preference simply won't persist */
  }
}

export function resetBandColors() {
  Object.assign(bandColors, DEFAULT_BAND_COLORS)
  syncDocumentPalette(true)
  try {
    localStorage.removeItem(BAND_COLORS_KEY)
  } catch {
    /* preference simply won't persist */
  }
}

/**
 * The four component levels act as weights for their respective colours.
 * Mixing happens in HSL: hue is averaged on the unit circle, saturation and
 * lightness are weighted too. This weighted colour is the main/base colour;
 * every other palette slot is then derived from the same hue x.
 */
function mixWeightedColor(colors, weights) {
  let sin = 0
  let cos = 0
  let saturation = 0
  let lightness = 0
  let weightSum = 0

  for (let i = 0; i < colors.length; i += 1) {
    const { h, s, l } = hexToHsl(colors[i])
    const weight = weights[i] || 0
    const angle = (h * Math.PI) / 180
    sin += Math.sin(angle) * weight
    cos += Math.cos(angle) * weight
    saturation += s * weight
    lightness += l * weight
    weightSum += weight
  }

  if (weightSum === 0) return { h: 173, s: 78, l: 56 }
  const hue = ((Math.atan2(sin / weightSum, cos / weightSum) * 180) / Math.PI + 360) % 360
  return {
    h: hue,
    s: saturation / weightSum,
    l: lightness / weightSum
  }
}

function tuneTone(base, satBoost, lightBoost) {
  return {
    h: base.h,
    s: clamp(base.s + satBoost, 0, 100),
    l: clamp(base.l + lightBoost, 0, 100)
  }
}

function hslColor(tone, satBoost = 0, lightBoost = 0) {
  return `hsl(${tone.h.toFixed(1)}, ${clamp(tone.s + satBoost, 0, 100).toFixed(1)}%, ${clamp(tone.l + lightBoost, 0, 100).toFixed(1)}%)`
}

function hslaColor(tone, alpha, satBoost = 0, lightBoost = 0) {
  return `hsla(${tone.h.toFixed(1)}, ${clamp(tone.s + satBoost, 0, 100).toFixed(1)}%, ${clamp(tone.l + lightBoost, 0, 100).toFixed(1)}%, ${alpha.toFixed(3)})`
}

export const palette = computed(() => {
  const active = isActive.value
  const kick = active ? state.kick : 0
  const snare = active ? state.snare : 0
  const mid = active ? state.mid : 0
  const treble = active ? state.treble : 0
  const energy = active ? state.energy : 0
  const centroid = active ? state.centroid : 0

  // BASS / SNARE / VOICE / AIR levels are the weights of their respective
  // colours. The weighted mix is the main/base colour; the rest of the
  // palette is derived from the same hue x.
  const levels = [
    active ? state.bass : 0,
    active ? state.highMid : 0,
    active ? state.mid : 0,
    active ? state.treble : 0
  ]
  const floor = 0.1
  const rawWeights = levels.map((level) => floor + level)
  const weightSum = rawWeights.reduce((sum, weight) => sum + weight, 0)
  const weights = rawWeights.map((weight) => weight / weightSum)
  const base = mixWeightedColor(
    [bandColors.bass, bandColors.snare, bandColors.voice, bandColors.air],
    weights
  )

  const slots = [
    tuneTone(base, kick * 4 + snare * 1.5, kick * 3 + energy * 2),
    tuneTone(
      { h: (base.h + 36) % 360, s: clamp(base.s + 4, 0, 100), l: clamp(base.l + 4, 0, 100) },
      snare * 4 + mid,
      snare * 3 + mid * 2
    ),
    tuneTone(
      { h: (base.h + 72) % 360, s: clamp(base.s, 0, 100), l: clamp(base.l + 8, 0, 100) },
      mid * 4 + energy,
      mid * 3 + treble * 2
    ),
    tuneTone(
      { h: (base.h + 108) % 360, s: clamp(base.s - 4, 0, 100), l: clamp(base.l + 12, 0, 100) },
      treble * 5 + centroid * 3,
      treble * 4 + energy * 2
    )
  ]

  const tones = slots
  const accents = tones.map((tone) => hslColor(tone))
  const brights = [
    hslColor(slots[0], 4, 15 + treble * 4),
    hslColor(slots[1], 4, 15 + mid * 4),
    hslColor(slots[2], 4, 12 + mid * 4),
    hslColor(slots[3], 4, 12 + treble * 4)
  ]
  const glows = [
    hslaColor(slots[0], 0.09 + energy * 0.05 + kick * 0.03),
    hslaColor(slots[1], 0.08 + mid * 0.05 + snare * 0.03),
    hslaColor(slots[2], 0.07 + treble * 0.06 + energy * 0.02),
    hslaColor(slots[3], 0.06 + treble * 0.07 + energy * 0.02)
  ]

  return {
    base,
    weights,
    tones,
    accents,
    brights,
    glows,
    accent: accents[0],
    accent2: accents[1],
    accent3: accents[2],
    accent4: accents[3],
    accentBright: brights[0],
    accent2Bright: brights[1],
    accent3Bright: brights[2],
    accent4Bright: brights[3],
    accentGlow: glows[0],
    accent2Glow: glows[1],
    accent3Glow: glows[2],
    accent4Glow: glows[3]
  }
})

let lastPaletteSync = 0
let lastMotionSync = 0

/**
 * Push the shared palette into the document root so every section uses the
 * same four colours. The component levels weight the four picks into one base
 * colour x; all slots are offsets from x and stay active with or without audio.
 */
function syncDocumentPalette(force = false) {
  if (typeof document === 'undefined') return

  const now = performance.now()
  if (!force && now - lastPaletteSync < 16) return
  lastPaletteSync = now

  const root = document.documentElement
  const p = palette.value
  for (let i = 0; i < p.accents.length; i += 1) {
    const slot = i + 1
    root.style.setProperty(`--palette-${slot}`, p.accents[i])
    root.style.setProperty(`--palette-${slot}-bright`, p.brights[i])
    root.style.setProperty(`--palette-${slot}-glow`, p.glows[i])
  }
  root.style.setProperty('--accent', p.accent)
  root.style.setProperty('--accent-2', p.accent2)
  root.style.setProperty('--accent-3', p.accent3)
  root.style.setProperty('--accent-4', p.accent4)
  root.style.setProperty('--accent-bright', p.accentBright)
  root.style.setProperty('--accent-2-bright', p.accent2Bright)
  root.style.setProperty('--accent-3-bright', p.accent3Bright)
  root.style.setProperty('--accent-4-bright', p.accent4Bright)
  root.style.setProperty('--accent-glow', p.accentGlow)
  root.style.setProperty('--accent-2-glow', p.accent2Glow)
  root.style.setProperty('--accent-3-glow', p.accent3Glow)
  root.style.setProperty('--accent-4-glow', p.accent4Glow)
  root.style.setProperty('--kick', state.kick.toFixed(3))
  root.style.setProperty('--snare', state.snare.toFixed(3))
  root.style.setProperty('--energy', state.energy.toFixed(3))
  root.style.setProperty('--pace', state.pace.toFixed(3))
  // Updating animation-duration every frame makes CSS animations jump phase.
  // A few updates per second is enough for smooth speed changes.
  if (force || now - lastMotionSync > 150) {
    const motionSpeed = Math.max(0.35, 2.2 - state.pace * 1.3 - state.energy * 0.6)
    root.style.setProperty('--motion-speed', `${motionSpeed.toFixed(2)}s`)
    lastMotionSync = now
  }
}

let audioCtx = null
let analyser = null
let filterNode = null
let monitorGain = null
let sourceNode = null
let fileSource = null
let audioEl = null
let micStream = null
let objectUrl = ''
let freqData = null
let timeData = null
let rafId = 0
let lastAnalysed = 0
let smoothedEnergy = 0
let kickAvg = 0
let snareAvg = 0
let lastKickAt = 0
let lastSnareAt = 0
let kickTimes = []
let tempoPace = 0

const smoothed = {
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0
}

// Previous raw band levels, used for onset (spectral-rise) detection.
const previousBands = {
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

async function ensureContext() {
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) throw new Error('Web Audio is not supported in this browser.')

    audioCtx = new AudioCtor()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = FFT_SIZE
    analyser.smoothingTimeConstant = 0.35
    analyser.minDecibels = -95
    analyser.maxDecibels = -12

    filterNode = audioCtx.createBiquadFilter()
    filterNode.type = filterState.enabled ? 'bandpass' : 'allpass'
    filterNode.frequency.value = filterState.frequency
    filterNode.Q.value = filterState.q

    monitorGain = audioCtx.createGain()
    monitorGain.gain.value = 0
    filterNode.connect(analyser)
    filterNode.connect(monitorGain)
    monitorGain.connect(audioCtx.destination)

    freqData = new Uint8Array(analyser.frequencyBinCount)
    timeData = new Uint8Array(analyser.fftSize)
  }

  if (audioCtx.state === 'suspended') await audioCtx.resume()
  return audioCtx
}

function bandLevel([fromHz, toHz], gain) {
  if (!audioCtx || !freqData) return 0

  const nyquist = audioCtx.sampleRate / 2
  const bins = freqData.length
  const from = Math.max(1, Math.floor((fromHz / nyquist) * bins))
  const to = Math.min(bins - 1, Math.ceil((toHz / nyquist) * bins))
  if (to <= from) return 0

  let sum = 0
  for (let i = from; i <= to; i += 1) sum += freqData[i]

  const avg = sum / (to - from + 1) / 255
  return clamp(Math.pow(avg * gain, 0.9))
}

function analyse(now) {
  analyser.getByteFrequencyData(freqData)
  analyser.getByteTimeDomainData(timeData)

  // Loudness from the time domain is steadier than summing FFT bins.
  let sumSquares = 0
  for (let i = 0; i < timeData.length; i += 1) {
    const sample = (timeData[i] - 128) / 128
    sumSquares += sample * sample
  }
  const energyRaw = clamp(Math.sqrt(sumSquares / timeData.length) * 3.4)

  const raw = {}
  for (const key of Object.keys(BANDS)) {
    raw[key] = bandLevel(BANDS[key].range, BANDS[key].gain)
  }

  // Spectral centroid → slow hue drift (bass = teal/green, air = violet/pink).
  const nyquist = audioCtx.sampleRate / 2
  const binHz = nyquist / freqData.length
  let magnitude = 0
  let weighted = 0
  for (let i = 1; i < freqData.length; i += 1) {
    const hz = i * binHz
    if (hz > 10000) break
    const value = freqData[i]
    magnitude += value
    weighted += hz * value
  }
  const centroidHz = magnitude > 0 ? weighted / magnitude : 0
  const centroid = clamp(Math.pow(centroidHz / 6000, 0.55))

  // Asymmetric smoothing: fast attack for punch, slow release for calm motion.
  for (const key of Object.keys(smoothed)) {
    const target = raw[key]
    const current = smoothed[key]
    const rate = target > current ? 0.55 : 0.12
    smoothed[key] = current + (target - current) * rate
  }
  smoothedEnergy += (energyRaw - smoothedEnergy) * (energyRaw > smoothedEnergy ? 0.5 : 0.12)

  // Onset detection uses positive spectral rises, not the raw level: a
  // sustained bass note should not retrigger the kick on every frame.
  const rises = {}
  for (const key of Object.keys(previousBands)) {
    rises[key] = Math.max(0, raw[key] - previousBands[key])
    previousBands[key] = raw[key]
  }

  // Kick / bass drum: low-frequency attack above its local flux average.
  const kickDrive = rises.bass * 1.25 + rises.lowMid * 0.2
  let kickHit = false
  if (kickDrive > kickAvg * 1.3 + 0.012 && kickDrive > 0.05 && raw.bass > 0.08 && now - lastKickAt > 180) {
    kickHit = true
    lastKickAt = now
    kickTimes.push(now)
    if (kickTimes.length > 16) kickTimes.shift()
  }
  kickAvg += (kickDrive - kickAvg) * 0.08

  // Estimate pace from the spacing of recent kicks. This is only used for
  // motion/connection density, not for a displayed BPM, so a smoothed median
  // is robust enough even when a few onsets are missed.
  kickTimes = kickTimes.filter((time) => now - time < 8000)
  let paceTarget = 0
  if (kickTimes.length >= 4) {
    const intervals = []
    for (let i = 1; i < kickTimes.length; i += 1) {
      const delta = kickTimes[i] - kickTimes[i - 1]
      if (delta >= 250 && delta <= 1200) intervals.push(delta)
    }
    if (intervals.length >= 2) {
      intervals.sort((a, b) => a - b)
      const median = intervals[Math.floor(intervals.length / 2)]
      const bpm = 60000 / median
      paceTarget = clamp((bpm - 70) / 100)
    }
  }
  tempoPace += (paceTarget - tempoPace) * (paceTarget > tempoPace ? 0.12 : 0.03)

  // Snare / clap: noisy attack in the presence band.
  const snareDrive = Math.max(rises.highMid, rises.mid * 0.35, rises.treble * 0.5)
  let snareHit = false
  if (snareDrive > snareAvg * 1.3 + 0.01 && snareDrive > 0.04 && now - lastSnareAt > 120) {
    snareHit = true
    lastSnareAt = now
  }
  snareAvg += (snareDrive - snareAvg) * 0.08

  // The four component levels weight the four picks into one base colour;
  // these slots are all derived from the resulting hue x. Audio also
  // modulates their brightness and glow, but the palette stays shared.
  const nextKick = kickHit ? 1 : state.kick * 0.92
  const nextSnare = snareHit ? 1 : state.snare * 0.9

  state.bass = smoothed.bass
  state.lowMid = smoothed.lowMid
  state.mid = smoothed.mid
  state.highMid = smoothed.highMid
  state.treble = smoothed.treble
  state.energy = smoothedEnergy
  state.kick = nextKick
  state.snare = nextSnare
  state.centroid = centroid
  state.pace = tempoPace
  syncDocumentPalette()
}

function tick(now) {
  rafId = requestAnimationFrame(tick)
  if (!analyser) return
  if (now - lastAnalysed < ANALYSIS_INTERVAL) return
  lastAnalysed = now
  analyse(now)
}

function startLoop() {
  if (rafId) cancelAnimationFrame(rafId)
  lastAnalysed = 0
  rafId = requestAnimationFrame(tick)
}

function resetLevels() {
  for (const key of Object.keys(smoothed)) smoothed[key] = 0
  for (const key of Object.keys(previousBands)) previousBands[key] = 0
  smoothedEnergy = 0
  kickAvg = 0
  snareAvg = 0
  lastKickAt = 0
  lastSnareAt = 0
  kickTimes = []
  tempoPace = 0

  state.bass = 0
  state.lowMid = 0
  state.mid = 0
  state.highMid = 0
  state.treble = 0
  state.energy = 0
  state.kick = 0
  state.snare = 0
  state.centroid = 0
  state.pace = 0
}

function teardown() {
  if (fileSource) {
    try { fileSource.disconnect() } catch { /* already disconnected */ }
    fileSource = null
  }
  if (sourceNode) {
    try { sourceNode.disconnect() } catch { /* already disconnected */ }
    sourceNode = null
  }
  if (monitorGain && audioCtx) {
    monitorGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01)
  }
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop())
    micStream = null
  }
  if (audioEl) {
    audioEl.pause()
    audioEl.removeAttribute('src')
    audioEl.load()
    audioEl = null
  }
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = ''
  }
}

export function stop() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  teardown()
  resetLevels()
  state.status = 'idle'
  state.playing = false
  state.sourceName = ''
  state.error = ''
  syncDocumentPalette(true)
}

function describeMicError(error) {
  switch (error?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Microphone permission was denied. Allow it in your browser settings and try again.'
    case 'NotFoundError':
      return 'No microphone was found on this device.'
    case 'NotReadableError':
      return 'The microphone is already in use by another app.'
    case 'OverconstrainedError':
      return 'The selected microphone does not support the requested audio settings.'
    default:
      return error?.message || 'Could not start the microphone.'
  }
}

async function startMic() {
  stop()
  state.status = 'requesting'

  if (!navigator.mediaDevices?.getUserMedia) {
    state.status = 'error'
    state.error = 'Microphone access needs a secure origin (HTTPS or localhost) and a modern browser.'
    return
  }

  let stream = null
  try {
    // Create/resume the context while the click's user activation is fresh;
    // some browsers block audio started after the permission prompt resolves.
    await ensureContext()
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    })

    micStream = stream
    sourceNode = audioCtx.createMediaStreamSource(stream)
    sourceNode.connect(filterNode)
    monitorGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01)

    resetLevels()
    state.status = 'mic'
    state.playing = true
    state.sourceName = 'microphone'
    state.error = ''
    startLoop()
    syncDocumentPalette(true)
  } catch (error) {
    if (stream) stream.getTracks().forEach((track) => track.stop())
    state.status = 'error'
    state.error = describeMicError(error)
  }
}

export async function toggleMic() {
  if (state.status === 'mic') {
    stop()
    return
  }
  if (state.status === 'requesting') return
  await startMic()
}

export async function loadTrack(file) {
  if (!file) return

  const looksLikeAudio =
    file.type.startsWith('audio/') || AUDIO_EXTENSIONS.test(file.name)
  if (!looksLikeAudio) {
    stop()
    state.status = 'error'
    state.error = 'That file does not look like audio. Try MP3, WAV, OGG, M4A or FLAC.'
    return
  }

  stop()

  try {
    await ensureContext()

    objectUrl = URL.createObjectURL(file)
    audioEl = new Audio(objectUrl)
    audioEl.preload = 'auto'
    audioEl.loop = false
    audioEl.addEventListener('ended', () => {
      state.playing = false
    })

    fileSource = audioCtx.createMediaElementSource(audioEl)
    // Source -> filter -> analyser -> monitor gain -> speakers.
    fileSource.connect(filterNode)
    monitorGain.gain.setTargetAtTime(1, audioCtx.currentTime, 0.01)

    resetLevels()
    state.status = 'file'
    state.sourceName = file.name
    state.playing = false
    state.error = ''
    startLoop()
    syncDocumentPalette(true)

    try {
      await audioEl.play()
      state.playing = true
    } catch {
      state.error = 'Audio loaded. Press play to start it.'
    }
  } catch (error) {
    teardown()
    resetLevels()
    state.status = 'error'
    state.error = `Could not load that audio file${error?.message ? `: ${error.message}` : '.'}`
  }
}

export async function togglePlayback() {
  if (!audioEl || !audioCtx) return

  state.error = ''
  if (audioEl.paused) {
    try {
      await audioCtx.resume()
      await audioEl.play()
      state.playing = true
    } catch {
      state.error = 'The browser blocked playback. Press play again to resume.'
    }
  } else {
    audioEl.pause()
    state.playing = false
  }
}

/** Latest FFT magnitudes (0-255 per bin), or null when the engine is idle. */
export function getFrequencyData() {
  return isActive.value ? freqData : null
}

// Apply the saved band colours immediately on first load, before any audio
// source exists, so the whole page starts with the user's theme.
syncDocumentPalette(true)
