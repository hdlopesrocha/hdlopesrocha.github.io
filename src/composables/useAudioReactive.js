import { computed, reactive } from 'vue'

/**
 * Music-reactive audio engine.
 *
 * One shared Web Audio graph powers the whole page:
 *   mic / <audio> -> AnalyserNode (FFT) -> (file audio also -> speakers)
 *
 * The analyser is split into perceptually useful bands (kick/bass, drums,
 * voice, snare presence, air) and a few smoothed descriptors (energy,
 * spectral centroid, beat impulses). HeroBackground and the UI read from the
 * same state, so palette + animation stay perfectly in sync.
 */

const FFT_SIZE = 2048
const BASE_HUE = 173
const BASE_HUE_2 = 209
const BASE_HUE_3 = 269
const ANALYSIS_INTERVAL = 33 // ~30 Hz UI updates; the FFT itself is 2048 bins
const AUDIO_EXTENSIONS = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm)$/i

const BANDS = {
  bass: { range: [30, 140], gain: 1.2 }, // kick drum / sub
  lowMid: { range: [140, 400], gain: 1.7 }, // toms / body
  mid: { range: [400, 2000], gain: 2.2 }, // voice / melody
  highMid: { range: [2000, 5000], gain: 2.8 }, // snare crack / presence
  treble: { range: [5000, 12000], gain: 3.4 } // hats / cymbals / air
}

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
  pace: 0,
  hue: BASE_HUE,
  hue2: BASE_HUE_2,
  hue3: BASE_HUE_3
})

export const isActive = computed(() => state.status === 'mic' || state.status === 'file')
export const isMic = computed(() => state.status === 'mic')
export const isFile = computed(() => state.status === 'file')

function wrapHue(value) {
  return ((value % 360) + 360) % 360
}

export const palette = computed(() => {
  const active = isActive.value
  const hue = active ? wrapHue(state.hue) : BASE_HUE
  const hue2 = active ? wrapHue(state.hue2) : BASE_HUE_2
  const hue3 = active ? wrapHue(state.hue3) : BASE_HUE_3
  const kick = active ? state.kick : 0
  const snare = active ? state.snare : 0
  const mid = active ? state.mid : 0
  const treble = active ? state.treble : 0
  const energy = active ? state.energy : 0

  const sat1 = Math.min(100, Math.round(88 + kick * 10 + snare * 4))
  const light1 = Math.round(58 + treble * 8 + energy * 5)
  const sat2 = Math.min(100, Math.round(90 + snare * 8 + mid * 4))
  const light2 = Math.round(64 + mid * 5 + treble * 6)
  const sat3 = Math.min(100, Math.round(88 + treble * 8 + energy * 3))
  const light3 = Math.round(68 + treble * 7 + energy * 3)

  return {
    hue,
    hue2,
    hue3,
    accent: `hsl(${hue.toFixed(1)}, ${sat1}%, ${light1}%)`,
    accent2: `hsl(${hue2.toFixed(1)}, ${sat2}%, ${light2}%)`,
    accent3: `hsl(${hue3.toFixed(1)}, ${sat3}%, ${light3}%)`,
    accentBright: `hsl(${hue.toFixed(1)}, ${Math.min(100, sat1 + 2)}%, ${Math.round(74 + kick * 4 + treble * 4)}%)`,
    accent2Bright: `hsl(${hue2.toFixed(1)}, ${Math.min(100, sat2 + 2)}%, ${Math.round(72 + mid * 4 + treble * 4)}%)`,
    accentGlow: `hsla(${hue.toFixed(1)}, 92%, 64%, ${(0.09 + energy * 0.05 + kick * 0.03).toFixed(3)})`,
    accent2Glow: `hsla(${hue2.toFixed(1)}, 92%, 64%, ${(0.08 + mid * 0.05 + snare * 0.03).toFixed(3)})`,
    accent3Glow: `hsla(${hue3.toFixed(1)}, 90%, 64%, ${(0.07 + treble * 0.06 + energy * 0.02).toFixed(3)})`
  }
})

const CSS_PALETTE_VARS = [
  '--accent',
  '--accent-2',
  '--accent-3',
  '--accent-bright',
  '--accent-2-bright',
  '--accent-glow',
  '--accent-2-glow',
  '--accent-3-glow',
  '--kick',
  '--snare',
  '--energy',
  '--pace',
  '--motion-speed'
]
let lastPaletteSync = 0
let lastMotionSync = 0

/**
 * Push the music palette into the document root so the whole page — not just
 * the hero — shares the same live accent colours and ambient glows.
 */
function syncDocumentPalette(force = false) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  if (!isActive.value) {
    if (root.dataset.audioPalette === 'on') {
      CSS_PALETTE_VARS.forEach((name) => root.style.removeProperty(name))
      delete root.dataset.audioPalette
    }
    return
  }

  const now = performance.now()
  if (!force && now - lastPaletteSync < 50) return
  lastPaletteSync = now

  const p = palette.value
  root.style.setProperty('--accent', p.accent)
  root.style.setProperty('--accent-2', p.accent2)
  root.style.setProperty('--accent-3', p.accent3)
  root.style.setProperty('--accent-bright', p.accentBright)
  root.style.setProperty('--accent-2-bright', p.accent2Bright)
  root.style.setProperty('--accent-glow', p.accentGlow)
  root.style.setProperty('--accent-2-glow', p.accent2Glow)
  root.style.setProperty('--accent-3-glow', p.accent3Glow)
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
  root.dataset.audioPalette = 'on'
}

let audioCtx = null
let analyser = null
let sourceNode = null
let fileSource = null
let audioEl = null
let micStream = null
let objectUrl = ''
let freqData = null
let timeData = null
let rafId = 0
let lastAnalysed = 0
let smoothHue = BASE_HUE
let smoothHue2 = BASE_HUE_2
let smoothHue3 = BASE_HUE_3
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
    analyser.smoothingTimeConstant = 0.6
    analyser.minDecibels = -95
    analyser.maxDecibels = -12

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
    const rate = target > current ? 0.45 : 0.09
    smoothed[key] = current + (target - current) * rate
  }
  smoothedEnergy += (energyRaw - smoothedEnergy) * (energyRaw > smoothedEnergy ? 0.4 : 0.08)

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
  if (kickDrive > kickAvg * 1.3 + 0.015 && kickDrive > 0.05 && raw.bass > 0.08 && now - lastKickAt > 180) {
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
  if (snareDrive > snareAvg * 1.3 + 0.012 && snareDrive > 0.04 && now - lastSnareAt > 120) {
    snareHit = true
    lastSnareAt = now
  }
  snareAvg += (snareDrive - snareAvg) * 0.08

  // Each layer of the spectrum owns a different part of the palette:
  // bass/kick moves the main accent, voice/snare moves the second hue and
  // treble/air sweeps the third. Wider targets + faster smoothing make the
  // whole page visibly react to the music instead of only drifting slowly.
  const nextKick = kickHit ? 1 : state.kick * 0.86
  const nextSnare = snareHit ? 1 : state.snare * 0.84

  const targetHue = BASE_HUE + centroid * 180 + smoothed.bass * 55 + nextKick * 30
  smoothHue += (targetHue - smoothHue) * 0.11

  const targetHue2 = smoothHue + 40 + smoothed.mid * 25 + nextSnare * 20
  smoothHue2 += (targetHue2 - smoothHue2) * 0.14

  const targetHue3 = smoothHue + 100 + smoothed.treble * 30 + smoothed.highMid * 10
  smoothHue3 += (targetHue3 - smoothHue3) * 0.14

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
  state.hue = smoothHue
  state.hue2 = smoothHue2
  state.hue3 = smoothHue3
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
  smoothHue = BASE_HUE
  smoothHue2 = BASE_HUE_2
  smoothHue3 = BASE_HUE_3
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
  state.hue = BASE_HUE
  state.hue2 = BASE_HUE_2
  state.hue3 = BASE_HUE_3
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
    sourceNode.connect(analyser)

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
    // Analyser first, then the speakers, so the FFT sees the raw track.
    fileSource.connect(analyser)
    fileSource.connect(audioCtx.destination)

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
