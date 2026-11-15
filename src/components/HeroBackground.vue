<template>
  <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  state as audioState,
  bandColors,
  isActive,
  palette,
  getFrequencyData
} from '../composables/useAudioReactive'
import { cloudNoise } from '../lib/perlin'
import Delaunator from 'delaunator'
import { hexToHsl } from '../lib/color'
import { sceneFx } from '../composables/useSceneFx'

const canvas = ref(null)
let raf = 0
let ctx = null
let points = []
let w = 0
let h = 0
let running = false
let resizeHandler = null
let flowParticles = []
let flowLayerCanvas = null
let flowLayerCtx = null
let glowCanvas = null
let glowCtx = null
let sceneSnapshotCanvas = null
let sceneSnapshotCtx = null
let sceneRedCanvas = null
let sceneRedCtx = null
let sceneGreenCanvas = null
let sceneGreenCtx = null
let sceneBlueCanvas = null
let sceneBlueCtx = null
let chromaticFrame = 0
let smokeMaskCanvas = null
let smokeMaskCtx = null
let smokeWorker = null
let smokeWorkerBusy = false
let smokeWorkerFailed = false
let smokeMaskReady = false
let lastSmokeRequestAt = -Infinity

const SMOKE_W = 512
const SMOKE_H = 288

const FLOW_TRAIL_CHUNKS = 14
const FLOW_ALPHA_LEVELS = 10
const FLOW_FORCE_SCALE = 0.0024
const FLOW_WALL_MARGIN = 4
const TRIANGLE_FADE = 0.12
const TRIANGLE_MAX_ALPHA = 0.18
const TRIANGLE_WEIGHT_SCALE = 0.02
const CHANNEL_PALETTE_SIZE = 5
const MATRIX_GLYPHS = ['0', '1', '7', 'ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ﾂ', 'ﾃ', 'ｷ', 'ｸ', '4']
const MATRIX_MAX_GLYPHS = 8
const MATRIX_GLYPH_TICK_MS = 110
const MATRIX_GLYPH_CELL = 32
const matrixGlyphAtlases = new Map()
const GRAPH_LIGHT = { x: -0.381, y: -0.552, z: 0.742 }
const GRAPH_HALF = (() => {
  const x = GRAPH_LIGHT.x
  const y = GRAPH_LIGHT.y
  const z = GRAPH_LIGHT.z + 1
  const length = Math.hypot(x, y, z) || 1
  return { x: x / length, y: y / length, z: z / length }
})()

// Glass material constants. The view ray travels into the surface along
// (0, 0, -1); the face normal is always oriented towards the viewer.
const GLASS_IOR = 1.5
const GLASS_ETA = 1 / GLASS_IOR
const GLASS_SPECULAR_POWER = 64
const GLASS_SPECULAR_PACE = 48
const GLASS_REFRACTION_SCALE = 150
const GLASS_MAX_REFRACTION = 120
const GLASS_DEPTH_REFERENCE = 140
const GLASS_DEPTH_INFLUENCE = 0.65

function clamp100(value) {
  return Math.min(100, Math.max(0, value))
}

function buildChannelPalette(hex) {
  const { h, s, l } = hexToHsl(hex)
  return [
    { dh: -14, ds: -4, dl: -4 },
    { dh: -7, ds: 2, dl: 4 },
    { dh: 0, ds: 0, dl: 0 },
    { dh: 8, ds: -2, dl: 8 },
    { dh: 16, ds: -5, dl: 3 }
  ].map(({ dh, ds, dl }) => ({
    h: (h + dh + 360) % 360,
    s: clamp100(s + ds),
    l: clamp100(l + dl)
  }))
}

function getMatrixGlyphAtlas(tone) {
  const key = `${tone.h.toFixed(1)}|${tone.s.toFixed(1)}|${tone.l.toFixed(1)}`
  const cached = matrixGlyphAtlases.get(key)
  if (cached) return cached

  const atlas = document.createElement('canvas')
  atlas.width = MATRIX_GLYPHS.length * MATRIX_GLYPH_CELL
  atlas.height = MATRIX_GLYPH_CELL
  const atlasCtx = atlas.getContext('2d')
  atlasCtx.font = `bold ${Math.round(MATRIX_GLYPH_CELL * 0.72)}px "JetBrains Mono", ui-monospace, monospace`
  atlasCtx.textAlign = 'center'
  atlasCtx.textBaseline = 'middle'
  atlasCtx.fillStyle = `hsl(${tone.h.toFixed(1)}, ${tone.s.toFixed(1)}%, ${Math.min(88, tone.l + 4).toFixed(1)}%)`
  for (let i = 0; i < MATRIX_GLYPHS.length; i += 1) {
    atlasCtx.fillText(
      MATRIX_GLYPHS[i],
      i * MATRIX_GLYPH_CELL + MATRIX_GLYPH_CELL / 2,
      MATRIX_GLYPH_CELL / 2
    )
  }
  matrixGlyphAtlases.set(key, atlas)
  return atlas
}

let triangleFrame = 0
let cachedTriangleTargets = null
const triangleWeights = new Map()
const triangleShapes = new Map()

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shortestHueDelta(from, to) {
  return ((to - from + 540) % 360) - 180
}

function resize() {
  const el = canvas.value
  if (!el || !ctx) return
  const rect = el.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const bitmapWidth = Math.floor(rect.width * dpr)
  const bitmapHeight = Math.floor(rect.height * dpr)
  w = rect.width
  h = rect.height
  // Mobile browsers fire resize when the address bar collapses. Avoid
  // clearing the canvas bitmap when its pixel size did not actually change.
  if (el.width === bitmapWidth && el.height === bitmapHeight) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return
  }
  el.width = bitmapWidth
  el.height = bitmapHeight
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function seed() {
  triangleWeights.clear()
  triangleShapes.clear()
  cachedTriangleTargets = null
  const count = w < 640 ? 60 : w < 1100 ? 95 : 130
  points = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    seed: Math.random()
  }))
}

function createFlowParticle(index) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.55 + Math.random() * 1.1,
    life: 90 + Math.random() * 260,
    channel: index % 4,
    colorPhase: Math.random() * CHANNEL_PALETTE_SIZE,
    vx: 0,
    vy: 0,
    history: []
  }
}

function particleTargetCount() {
  return Math.max(0, Math.round(sceneFx.particleCount))
}

function seedFlow() {
  flowParticles = Array.from(
    { length: particleTargetCount() },
    (_, index) => createFlowParticle(index)
  )
}

function syncFlowCount() {
  const target = particleTargetCount()
  if (flowParticles.length > target) {
    flowParticles.length = target
    return
  }
  for (let i = flowParticles.length; i < target; i += 1) {
    flowParticles.push(createFlowParticle(i))
  }
}

function respawnParticle(particle) {
  particle.x = FLOW_WALL_MARGIN + Math.random() * (w - 2 * FLOW_WALL_MARGIN)
  particle.y = FLOW_WALL_MARGIN + Math.random() * (h - 2 * FLOW_WALL_MARGIN)
  particle.speed = 0.55 + Math.random() * 1.1
  particle.life = 90 + Math.random() * 260
  particle.channel = Math.floor(Math.random() * 4)
  particle.colorPhase = Math.random() * CHANNEL_PALETTE_SIZE
  particle.vx = 0
  particle.vy = 0
  particle.history.length = 0
}

function ensureSmokeMask() {
  if (smokeMaskCanvas) return
  smokeMaskCanvas = document.createElement('canvas')
  smokeMaskCanvas.width = SMOKE_W
  smokeMaskCanvas.height = SMOKE_H
  smokeMaskCtx = smokeMaskCanvas.getContext('2d')
  smokeMaskCtx.imageSmoothingEnabled = true
  smokeMaskCtx.imageSmoothingQuality = 'high'
}

// The 8-octave fBm mask is too expensive for the main thread, so generate it
// in a worker while the glow and particles keep animating at full speed.
function ensureSmokeWorker() {
  if (smokeWorker || smokeWorkerFailed) return
  if (typeof Worker === 'undefined') {
    smokeWorkerFailed = true
    return
  }
  smokeWorker = new Worker(new URL('../workers/noiseMask.worker.js', import.meta.url), {
    type: 'module'
  })
  smokeWorker.onmessage = (event) => {
    const { data, width, height } = event.data
    ensureSmokeMask()
    smokeMaskCtx.putImageData(new ImageData(data, width, height), 0, 0)
    smokeMaskReady = true
    smokeWorkerBusy = false
  }
  smokeWorker.onerror = () => {
    smokeWorkerFailed = true
    smokeWorkerBusy = false
  }
}

function drawFlowField(t) {
  if (!ctx) return
  if (!flowParticles.length) seedFlow()
  const trailLength = Math.max(2, Math.round(sceneFx.trailLength))
  const particleSpeed = Math.max(0, sceneFx.particleSpeed)
  const matrixOn = sceneFx.showMatrix
  const trailsOn = sceneFx.showTrails
  const glyphSpacing = Math.max(4, sceneFx.glyphSpacing)
  const glyphTick = Math.floor(t / MATRIX_GLYPH_TICK_MS)

  const tw = Math.max(1, Math.ceil(w))
  const th = Math.max(1, Math.ceil(h))
  if (!flowLayerCanvas) {
    flowLayerCanvas = document.createElement('canvas')
    flowLayerCtx = flowLayerCanvas.getContext('2d')
  }
  if (flowLayerCanvas.width !== tw || flowLayerCanvas.height !== th) {
    flowLayerCanvas.width = tw
    flowLayerCanvas.height = th
  }
  flowLayerCtx.clearRect(0, 0, tw, th)

  const active = isActive.value
  const levels = active
    ? [audioState.bass, audioState.highMid, audioState.mid, audioState.treble]
    : [0, 0, 0, 0]
  const pulses = active
    ? [
        Math.max(audioState.kick, audioState.bass * 0.6),
        Math.max(audioState.snare, audioState.highMid * 0.6),
        audioState.mid,
        audioState.treble
      ]
    : [0, 0, 0, 0]
  const tones = palette.value.tones
  const channelPalettes = [
    buildChannelPalette(bandColors.bass),
    buildChannelPalette(bandColors.snare),
    buildChannelPalette(bandColors.voice),
    buildChannelPalette(bandColors.air)
  ]
  const noiseTime = t * 0.00011

  flowLayerCtx.save()
  flowLayerCtx.globalCompositeOperation = 'source-over'
  flowLayerCtx.lineCap = 'round'
  flowLayerCtx.lineJoin = 'round'
  const trailBuckets = new Map()

  for (const particle of flowParticles) {
    const channel = particle.channel
    const level = levels[channel]
    const pulse = pulses[channel]
    const speedScale = level * 2.8 + pulse * 1.5
    const pace = speedScale * particleSpeed
    const palette = channelPalettes[channel]

    const palettePos = (particle.colorPhase + t * 0.00025) % palette.length
    const paletteBucket = Math.round(palettePos) % palette.length

    if (pace > 0.02) particle.life -= 1
    const angle = cloudNoise(
      particle.x * FLOW_FORCE_SCALE,
      particle.y * FLOW_FORCE_SCALE,
      noiseTime
    ) * Math.PI * 2
    const targetVx = Math.cos(angle) * particle.speed * pace
    const targetVy = Math.sin(angle) * particle.speed * pace
    particle.vx += (targetVx - particle.vx) * 0.25
    particle.vy += (targetVy - particle.vy) * 0.25
    let nx = particle.x + particle.vx
    let ny = particle.y + particle.vy

    if (particle.life <= 0) {
      respawnParticle(particle)
      continue
    }

    particle.x = nx
    particle.y = ny
    if (sceneFx.showDots && !matrixOn) {
      const dotTone = palette[paletteBucket % palette.length]
      flowLayerCtx.fillStyle = `hsla(${dotTone.h.toFixed(1)}, ${dotTone.s.toFixed(1)}%, ${Math.min(86, dotTone.l + 2).toFixed(1)}%, ${(0.42 + level * 0.35 + pulse * 0.2).toFixed(2)})`
      flowLayerCtx.beginPath()
      flowLayerCtx.arc(nx, ny, 1.2 + level * 1.2 + pulse * 0.7, 0, Math.PI * 2)
      flowLayerCtx.fill()
    }
    particle.history.push({
      x: nx,
      y: ny,
      bucket: paletteBucket,
      energy: Math.min(1, Math.max(0, level * 0.65 + pulse * 0.5))
    })
    if (particle.history.length > trailLength) {
      particle.history.splice(0, particle.history.length - trailLength)
    }

    // Let particles leave the viewport. Once the whole remaining trail is
    // outside, recycle the particle at a new random position.
    const trailOutside = particle.history.every(
      (point) => point.x < 0 || point.x > w || point.y < 0 || point.y > h
    )
    if (trailOutside) {
      respawnParticle(particle)
      continue
    }
    if (particle.history.length < 2) continue

    if (trailsOn) {
      const headAlpha = Math.min(0.95, 0.3 + level * 0.5 + pulse * 0.25)
      const history = particle.history
      const width = 0.8 + level * 1.3 + pulse * 0.6
      const widthLevel = Math.max(1, Math.min(3, Math.round(width)))
      const chunkCount = Math.min(FLOW_TRAIL_CHUNKS, history.length - 1)

      for (let chunk = 0; chunk < chunkCount; chunk += 1) {
        const start = Math.floor((chunk * (history.length - 1)) / chunkCount)
        const end = Math.floor(((chunk + 1) * (history.length - 1)) / chunkCount)
        if (end <= start) continue

        const at = (chunk + 0.5) / chunkCount
        const alphaLevel = Math.round(headAlpha * Math.pow(at, 0.7) * FLOW_ALPHA_LEVELS)
        if (alphaLevel <= 0) continue

        const mid = history[Math.floor((start + end) / 2)]
        const bucketIndex = mid.bucket ?? 0
        const key = `${channel}:${bucketIndex}:${alphaLevel}:${widthLevel}`
        let bucket = trailBuckets.get(key)

        if (!bucket) {
          const tone = palette[bucketIndex % palette.length]
          bucket = {
            path: new Path2D(),
            color: `hsla(${tone.h.toFixed(1)}, ${tone.s.toFixed(1)}%, ${Math.min(86, tone.l + 2).toFixed(1)}%, 1)`,
            alpha: alphaLevel / FLOW_ALPHA_LEVELS,
            width: [0.8, 1.5, 2.2][widthLevel - 1]
          }
          trailBuckets.set(key, bucket)
        }

        bucket.path.moveTo(history[start].x, history[start].y)
        for (let i = start + 1; i <= end; i += 1) {
          bucket.path.lineTo(history[i].x, history[i].y)
        }
      }
    }
  }

  if (trailsOn) {
    for (const bucket of trailBuckets.values()) {
      flowLayerCtx.globalAlpha = bucket.alpha
      flowLayerCtx.lineWidth = bucket.width
      flowLayerCtx.strokeStyle = bucket.color
      flowLayerCtx.stroke(bucket.path)
    }
  }
  flowLayerCtx.globalAlpha = 1

  if (matrixOn) {
    for (const particle of flowParticles) {
      const history = particle.history
      if (history.length < 2) continue
      const channel = particle.channel
      const level = levels[channel]
      let distance = glyphSpacing
      let drawn = 0
      for (let i = history.length - 1; i > 0 && drawn < MATRIX_MAX_GLYPHS; i -= 1) {
        const head = history[i]
        const tail = history[i - 1]
        distance += Math.hypot(head.x - tail.x, head.y - tail.y)
        if (distance < glyphSpacing) continue
        distance = 0
        const bucket = head.bucket ?? 0
        const tone = channelPalettes[channel][bucket]
        const along = i / (history.length - 1)
        const alpha = Math.min(0.95, 0.18 + along * 0.7 + level * 0.1)
        const atlas = getMatrixGlyphAtlas(tone)
        const positionSeed = Math.round(head.x) * 73 + Math.round(head.y) * 151
        const glyphIndex = (positionSeed + glyphTick) % MATRIX_GLYPHS.length
        const glyphSize = Math.max(8, Math.min(24, Math.round(8 + (head.energy ?? 0) * 16)))
        flowLayerCtx.globalAlpha = alpha
        flowLayerCtx.drawImage(
          atlas,
          glyphIndex * MATRIX_GLYPH_CELL,
          0,
          MATRIX_GLYPH_CELL,
          MATRIX_GLYPH_CELL,
          head.x - glyphSize / 2,
          head.y - glyphSize / 2,
          glyphSize,
          glyphSize
        )
        drawn += 1
      }
    }
    flowLayerCtx.globalAlpha = 1
  }

  flowLayerCtx.restore()

  // Blurred/smoke-modulated particle render becomes the background; the
  // sharp particle pass and graph are drawn on top.
  if (sceneFx.showGlow && sceneFx.glow > 0.01) {
    const glowWidth = Math.max(1, Math.ceil(w))
    const glowHeight = Math.max(1, Math.ceil(h))
    if (!glowCanvas) {
      glowCanvas = document.createElement('canvas')
      glowCtx = glowCanvas.getContext('2d')
      glowCtx.imageSmoothingEnabled = true
      glowCtx.imageSmoothingQuality = 'high'
    }
    if (glowCanvas.width !== glowWidth || glowCanvas.height !== glowHeight) {
      glowCanvas.width = glowWidth
      glowCanvas.height = glowHeight
    }
    glowCtx.clearRect(0, 0, glowWidth, glowHeight)
    glowCtx.save()
    glowCtx.filter = `blur(${(12 + (active ? audioState.energy : 0) * 10).toFixed(1)}px)`
    glowCtx.globalCompositeOperation = 'lighter'
    glowCtx.drawImage(flowLayerCanvas, 0, 0, w, h)
    glowCtx.drawImage(flowLayerCanvas, 0, 0, w, h)
    glowCtx.restore()

    // Only cut the Perlin smoke mask into the blurred glow when enabled.
    if (sceneFx.showSmoke && sceneFx.noiseBrightness > 0.01) {
      ensureSmokeMask()
      ensureSmokeWorker()

      if (!smokeWorkerFailed) {
        const motionTime = reducedMotion() ? 1200 : t
        if (!smokeWorkerBusy && motionTime - lastSmokeRequestAt > 120) {
          lastSmokeRequestAt = motionTime
          smokeWorkerBusy = true
          const period = Math.max(1, sceneFx.noisePeriod) * 1000
          const speed = Math.max(0, sceneFx.noiseSpeed)
          smokeWorker.postMessage({
            width: SMOKE_W,
            height: SMOKE_H,
            scale: Math.max(0.1, sceneFx.noiseScale),
            drift: (motionTime / (period * 3.5)) * speed,
            noiseTime: (motionTime / period) * speed,
            octaves: sceneFx.noiseOctaves,
            amplitude: sceneFx.noiseAmplitude,
            gain: sceneFx.noiseGain,
            lacunarity: sceneFx.noiseLacunarity,
            contrast: sceneFx.noiseContrast,
            brightness: Math.max(0, sceneFx.noiseBrightness)
          })
        }
      }

      if (smokeMaskReady) {
        glowCtx.save()
        glowCtx.globalCompositeOperation = 'destination-in'
        glowCtx.filter = 'blur(2px)'
        glowCtx.drawImage(smokeMaskCanvas, 0, 0, w, h)
        glowCtx.restore()
      }
    }

    // sceneFx.glow can exceed 1 (up to 2): accumulate additive passes until
    // the requested strength is consumed.
    let remaining = Math.max(0, sceneFx.glow)
    if (remaining > 0.001) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      while (remaining > 0.001) {
        ctx.globalAlpha = Math.min(1, remaining)
        ctx.drawImage(glowCanvas, 0, 0, w, h)
        remaining -= 1
      }
      ctx.restore()
    }
  }

  if (sceneFx.showParticles) {
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(flowLayerCanvas, 0, 0, w, h)
    ctx.restore()
  }
}

function updateSceneChannel(canvas, context, color, source) {
  const width = Math.max(1, Math.floor(source.width / 3))
  const height = Math.max(1, Math.floor(source.height / 3))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.globalCompositeOperation = 'source-over'
  context.clearRect(0, 0, width, height)
  context.drawImage(source, 0, 0, width, height)
  context.globalCompositeOperation = 'multiply'
  context.fillStyle = color
  context.fillRect(0, 0, width, height)
  context.globalCompositeOperation = 'destination-in'
  context.drawImage(source, 0, 0, width, height)
  context.globalCompositeOperation = 'source-over'
}

function captureSceneSnapshot() {
  if (!ctx) return
  chromaticFrame += 1
  // RGB fringing can update at half rate; the normal-driven triangle
  // refraction still runs every frame.
  if (sceneGreenCanvas && chromaticFrame % 2 === 0) return
  const source = ctx.canvas
  if (!sceneSnapshotCanvas) {
    sceneSnapshotCanvas = document.createElement('canvas')
    sceneSnapshotCtx = sceneSnapshotCanvas.getContext('2d')
  }
  if (
    sceneSnapshotCanvas.width !== source.width ||
    sceneSnapshotCanvas.height !== source.height
  ) {
    sceneSnapshotCanvas.width = source.width
    sceneSnapshotCanvas.height = source.height
  }
  sceneSnapshotCtx.setTransform(1, 0, 0, 1, 0, 0)
  sceneSnapshotCtx.clearRect(0, 0, source.width, source.height)
  // Frosted-glass blur for the refracted triangle samples.
  const blurPx = 5 * Math.min(window.devicePixelRatio || 1, 1.5)
  sceneSnapshotCtx.filter = `blur(${blurPx.toFixed(1)}px)`
  sceneSnapshotCtx.drawImage(source, 0, 0)
  sceneSnapshotCtx.filter = 'none'

  if (!sceneRedCanvas) {
    sceneRedCanvas = document.createElement('canvas')
    sceneRedCtx = sceneRedCanvas.getContext('2d')
  }
  if (!sceneGreenCanvas) {
    sceneGreenCanvas = document.createElement('canvas')
    sceneGreenCtx = sceneGreenCanvas.getContext('2d')
  }
  if (!sceneBlueCanvas) {
    sceneBlueCanvas = document.createElement('canvas')
    sceneBlueCtx = sceneBlueCanvas.getContext('2d')
  }
  updateSceneChannel(sceneRedCanvas, sceneRedCtx, '#ff0000', sceneSnapshotCanvas)
  updateSceneChannel(sceneGreenCanvas, sceneGreenCtx, '#00ff00', sceneSnapshotCanvas)
  updateSceneChannel(sceneBlueCanvas, sceneBlueCtx, '#0000ff', sceneSnapshotCanvas)
}

function drawParticles(t) {
  const active = isActive.value
  const bass = active ? audioState.bass : 0
  const mid = active ? audioState.mid : 0
  const treble = active ? audioState.treble : 0
  const snare = active ? audioState.snare : 0
  const kick = active ? audioState.kick : 0
  const energy = active ? audioState.energy : 0
  const pace = active ? audioState.pace : 0
  const p = palette.value
  const tones = p.tones

  const maxDist = 150 + mid * 70 + bass * 30 + pace * 45
  const movement = 1 + energy * 1.8 + bass * 1.1 + pace * 1.7 + kick * 1.2 + snare * 0.15
  const wobbleRate = 1 + pace * 1.4 + energy * 0.6
  const depthScale = 50 + energy * 120 + bass * 70 + kick * 40
  const depthWave = 8 + energy * 24 + snare * 10
  const depthRate = 2200 / (1 + pace)
  const linkAlpha = 0.13 + mid * 0.24 + energy * 0.12 + pace * 0.12
  // Stable per-pair thresholds make links appear/disappear as this density
  // changes, instead of flickering randomly from frame to frame.
  const linkDensity = Math.min(
    0.99,
    0.62 + mid * 0.14 + energy * 0.12 + pace * 0.16 + kick * 0.08 + snare * 0.05
  )

  // Update the base constellation. Kick energy is applied as a render-only
  // offset below: adding it to point.x/y every frame made particles slowly
  // drift out towards the edges during sustained music.
  for (const point of points) {
    point.x += point.vx * movement
    point.y += (point.vy + Math.sin(t / (2200 / wobbleRate) + point.phase) * 0.08) * movement

    if (point.x < -10) point.x = w + 10
    if (point.x > w + 10) point.x = -10
    if (point.y < -10) point.y = h + 10
    if (point.y > h + 10) point.y = -10

    point.sx = point.x
    point.sy = point.y
    if (kick > 0.04) {
      const dx = point.x - w / 2
      const dy = point.y - h / 2
      const len = Math.hypot(dx, dy) || 1
      point.sx += (dx / len) * kick * 2.4
      point.sy += (dy / len) * kick * 2.4
    }

    // Depth is audio-reactive but does not change the projected x/y position.
    point.z =
      (point.seed - 0.5) * depthScale +
      Math.sin(t / depthRate + point.phase) * depthWave
  }

  const nodeScale = 1 + treble * 1.5 + kick * 0.8 + snare * 0.3
  const nodeSizes = points.map((point) => point.r * nodeScale * (1 + point.z / 1400))

  // Delaunay keeps the graph planar: edges never cross and its faces are
  // non-overlapping. Filtering only removes edges/faces, so planarity holds.
  let delaunay
  try {
    delaunay = Delaunator.from(points, (point) => point.sx, (point) => point.sy)
  } catch {
    delaunay = { triangles: [] }
  }

  const edgeIndex = new Map()
  const links = []
  const maxDist2 = maxDist * maxDist
  const edgeKey = (i, j) => `${Math.min(i, j)}:${Math.max(i, j)}`

  const edgeFor = (i, j) => {
    const a = Math.min(i, j)
    const b = Math.max(i, j)
    const key = edgeKey(i, j)
    const cached = edgeIndex.get(key)
    if (cached) return cached

    const p1 = points[a]
    const p2 = points[b]
    const dx = p1.sx - p2.sx
    const dy = p1.sy - p2.sy
    const d2 = dx * dx + dy * dy
    const pairSeed = (p1.seed * 3 + p2.seed * 7) % 1
    const included = d2 < maxDist2 && pairSeed < linkDensity
    const width = Math.min(3.4, 0.5 + (nodeSizes[a] + nodeSizes[b]) * 0.24)
    const edge = {
      included,
      width,
      ax: p1.sx,
      ay: p1.sy,
      bx: p2.sx,
      by: p2.sy,
      alpha: included ? (1 - Math.sqrt(d2) / maxDist) * linkAlpha : 0,
      tone: tones[a % tones.length]
    }
    edgeIndex.set(key, edge)
    if (included) links.push(edge)
    return edge
  }

  // Delaunay edges still define the planar graph connections.
  const delaunayEdgeKeys = new Set()
  const delaunayTriangles = delaunay.triangles
  for (let i = 0; i < delaunayTriangles.length; i += 3) {
    const ia = delaunayTriangles[i]
    const ib = delaunayTriangles[i + 1]
    const ic = delaunayTriangles[i + 2]
    delaunayEdgeKeys.add(edgeKey(ia, ib))
    delaunayEdgeKeys.add(edgeKey(ib, ic))
    delaunayEdgeKeys.add(edgeKey(ic, ia))
    edgeFor(ia, ib)
    edgeFor(ib, ic)
    edgeFor(ic, ia)
  }

  const orient2 = (ax, ay, bx, by, cx, cy) =>
    (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
  const segmentsCross = (a, b, c, d) => {
    const d1 = orient2(a.sx, a.sy, b.sx, b.sy, c.sx, c.sy)
    const d2 = orient2(a.sx, a.sy, b.sx, b.sy, d.sx, d.sy)
    const d3 = orient2(c.sx, c.sy, d.sx, d.sy, a.sx, a.sy)
    const d4 = orient2(c.sx, c.sy, d.sx, d.sy, b.sx, b.sy)
    return (
      ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
    )
  }
  const pointStrictlyInTriangle = (p, a, b, c) => {
    const d1 = orient2(a.sx, a.sy, b.sx, b.sy, p.sx, p.sy)
    const d2 = orient2(b.sx, b.sy, c.sx, c.sy, p.sx, p.sy)
    const d3 = orient2(c.sx, c.sy, a.sx, a.sy, p.sx, p.sy)
    return (d1 > 0 && d2 > 0 && d3 > 0) || (d1 < 0 && d2 < 0 && d3 < 0)
  }
  const trianglesOverlap = (t1, t2) => {
    const t1p = [points[t1.i], points[t1.j], points[t1.k]]
    const t2p = [points[t2.i], points[t2.j], points[t2.k]]
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (segmentsCross(t1p[i], t1p[(i + 1) % 3], t2p[j], t2p[(j + 1) % 3])) {
          return true
        }
      }
    }
    for (const point of t2p) {
      if (pointStrictlyInTriangle(point, ...t1p)) return true
    }
    for (const point of t1p) {
      if (pointStrictlyInTriangle(point, ...t2p)) return true
    }
    return false
  }

  const makeTriangle = (i, j, k) => {
    const ids = [i, j, k].sort((a, b) => a - b)
    const key = `${ids[0]}:${ids[1]}:${ids[2]}`
    const a = points[ids[0]]
    const b = points[ids[1]]
    const c = points[ids[2]]
    const ux = b.sx - a.sx
    const uy = b.sy - a.sy
    const uz = b.z - a.z
    const vx = c.sx - a.sx
    const vy = c.sy - a.sy
    const vz = c.z - a.z
    if (Math.abs(ux * vy - uy * vx) < 1e-6) return null

    let nx = uy * vz - uz * vy
    let ny = uz * vx - ux * vz
    let nz = ux * vy - uy * vx
    const nlen = Math.hypot(nx, ny, nz)
    if (nlen < 1e-6) {
      nx = 0
      ny = 0
      nz = 1
    } else {
      nx /= nlen
      ny /= nlen
      nz /= nlen
      if (nz < 0) {
        nx = -nx
        ny = -ny
        nz = -nz
      }
    }

    const ab = Math.hypot(b.sx - a.sx, b.sy - a.sy)
    const bc = Math.hypot(c.sx - b.sx, c.sy - b.sy)
    const ca = Math.hypot(a.sx - c.sx, a.sy - c.sy)
    return {
      key,
      i: ids[0],
      j: ids[1],
      k: ids[2],
      nx,
      ny,
      nz,
      score: ab + bc + ca,
      // Average audio-driven node depth, used to scale the refraction.
      avgZ: (a.z + b.z + c.z) / 3,
      cx: (a.sx + b.sx + c.sx) / 3,
      cy: (a.sy + b.sy + c.sy) / 3
    }
  }

  // One triangle per node, built from each node and its two closest points.
  const candidateTriangles = []
  const candidateKeys = new Set()
  for (let i = 0; i < points.length; i += 1) {
    const source = points[i]
    let first = -1
    let second = -1
    let firstD = Infinity
    let secondD = Infinity
    for (let j = 0; j < points.length; j += 1) {
      if (j === i) continue
      const other = points[j]
      const dx = source.sx - other.sx
      const dy = source.sy - other.sy
      const d2 = dx * dx + dy * dy
      if (d2 < firstD) {
        second = first
        secondD = firstD
        first = j
        firstD = d2
      } else if (d2 < secondD) {
        second = j
        secondD = d2
      }
    }
    if (first < 0 || second < 0) continue
    const triangle = makeTriangle(i, first, second)
    if (!triangle || candidateKeys.has(triangle.key)) continue
    // Accept only Delaunay faces: every side is a planar graph edge, so the
    // triangle cannot cross other triangulation edges or faces.
    if (
      !delaunayEdgeKeys.has(edgeKey(triangle.i, triangle.j)) ||
      !delaunayEdgeKeys.has(edgeKey(triangle.j, triangle.k)) ||
      !delaunayEdgeKeys.has(edgeKey(triangle.k, triangle.i))
    ) {
      continue
    }
    candidateKeys.add(triangle.key)
    triangle.anchor = i
    candidateTriangles.push(triangle)
  }

  const selectedTriangles = []
  const selectedKeys = new Set()
  const usedNodes = new Set()
  const rankedTriangles = [...candidateTriangles].sort((a, b) => {
    const weightA = triangleWeights.get(a.key) || 0
    const weightB = triangleWeights.get(b.key) || 0
    if (weightA !== weightB) return weightB - weightA
    if (a.score !== b.score) return a.score - b.score
    return a.key.localeCompare(b.key)
  })
  for (const triangle of rankedTriangles) {
    if (
      usedNodes.has(triangle.i) ||
      usedNodes.has(triangle.j) ||
      usedNodes.has(triangle.k)
    ) {
      continue
    }
    let overlaps = false
    for (const selected of selectedTriangles) {
      if (trianglesOverlap(triangle, selected)) {
        overlaps = true
        break
      }
    }
    if (overlaps) continue
    usedNodes.add(triangle.i)
    usedNodes.add(triangle.j)
    usedNodes.add(triangle.k)
    selectedTriangles.push(triangle)
    selectedKeys.add(triangle.key)
    triangleShapes.set(triangle.key, triangle)
  }
  // Drop shapes that are neither selected nor still fading out.
  for (const key of triangleShapes.keys()) {
    if (!selectedKeys.has(key) && !triangleWeights.has(key)) {
      triangleShapes.delete(key)
    }
  }

  // Every particle chooses its two closest triangles. Distance weights blend
  // between them, and the rendered weights are smoothed over time so a
  // particle crossing a boundary never causes a hard triangle switch.
  triangleFrame += 1
  if (triangleFrame % 4 === 0 || !cachedTriangleTargets) {
    cachedTriangleTargets = new Map()
    for (const particle of flowParticles) {
      let best = null
      let second = null
      let bestD = Infinity
      let secondD = Infinity

      for (const triangle of selectedTriangles) {
        const dx = particle.x - triangle.cx
        const dy = particle.y - triangle.cy
        const d = dx * dx + dy * dy
        if (d < bestD) {
          second = best
          secondD = bestD
          best = triangle
          bestD = d
        } else if (d < secondD) {
          second = triangle
          secondD = d
        }
      }

      if (!best) continue
      const w1 = 1 / (bestD + 2500)
      const w2 = second ? 1 / (secondD + 2500) : 0
      const total = w1 + w2
      if (total <= 0) continue

      cachedTriangleTargets.set(best.key, (cachedTriangleTargets.get(best.key) || 0) + w1 / total)
      if (second) {
        cachedTriangleTargets.set(second.key, (cachedTriangleTargets.get(second.key) || 0) + w2 / total)
      }
    }
  }

  if (sceneFx.showTriangles) {
    if (selectedTriangles.length || triangleWeights.size) captureSceneSnapshot()
    ctx.save()
    const currentKeys = selectedKeys
    const renderKeys = new Set([...currentKeys, ...triangleWeights.keys()])
    for (const key of renderKeys) {
      const triangle = triangleShapes.get(key)
      if (!triangle) {
        triangleWeights.delete(key)
        continue
      }
      const isCurrent = currentKeys.has(key)
      const target = isCurrent
        ? Math.min(
            TRIANGLE_MAX_ALPHA,
            (cachedTriangleTargets.get(key) || 0) * TRIANGLE_WEIGHT_SCALE
          )
        : 0
      const current = triangleWeights.get(key) || 0
      const next = current + (target - current) * TRIANGLE_FADE
      if (next > 0.001) triangleWeights.set(key, next)
      else {
        triangleWeights.delete(key)
        triangleShapes.delete(key)
        continue
      }
      if (next <= 0.002) continue

      const a = points[triangle.i]
      const b = points[triangle.j]
      const c = points[triangle.k]
      const tone = tones[(triangle.i + triangle.j + triangle.k) % tones.length]
      const nx = triangle.nx
      const ny = triangle.ny
      const nz = triangle.nz

      // Flat-shaded glass: the single face normal drives both the sharp
      // Blinn-Phong highlight and the refraction ray. The palette tone is the
      // glass tint; shading only changes its brightness and opacity.
      const ndotl = Math.max(
        0,
        nx * GRAPH_LIGHT.x + ny * GRAPH_LIGHT.y + nz * GRAPH_LIGHT.z
      )
      const ndoth = Math.max(
        0,
        nx * GRAPH_HALF.x + ny * GRAPH_HALF.y + nz * GRAPH_HALF.z
      )
      const specular = Math.pow(
        ndoth,
        GLASS_SPECULAR_POWER + pace * GLASS_SPECULAR_PACE
      )
      const ambient = 0.16 + energy * 0.06
      const diffuse = ndotl * (0.44 + energy * 0.16)
      const intensity = ambient + diffuse + specular * (1.5 + bass * 0.9)
      const lightL = Math.max(
        18,
        Math.min(96, tone.l * (0.58 + intensity * 0.72) + specular * 22)
      )
      const tintAlpha = Math.min(0.3, 0.045 + next * 0.95 + specular * 0.1)

      // Snell refraction from the view ray (0, 0, -1) into glass (IOR 1.5).
      // nz is oriented towards the viewer, so cosI is non-negative. Total
      // internal reflection leaves the sample unbent instead of going NaN.
      const cosI = Math.min(1, Math.max(0, nz))
      const sin2T = GLASS_ETA * GLASS_ETA * (1 - cosI * cosI)
      let sampleX = 0
      let sampleY = 0
      if (sin2T < 1 - 1e-4) {
        const bend = GLASS_ETA * cosI - Math.sqrt(1 - sin2T)
        sampleX = bend * nx
        sampleY = bend * ny
      }

      // Deeper/closer triangles refract by a different amount. avgZ is the
      // audio-reactive node depth; the fixed reference keeps the effect subtle
      // at rest and pronounced with music.
      const depthNorm = Math.max(
        -1,
        Math.min(1, triangle.avgZ / GLASS_DEPTH_REFERENCE)
      )
      const refractionScale =
        GLASS_REFRACTION_SCALE * (1 + depthNorm * GLASS_DEPTH_INFLUENCE)
      let dx = sampleX * refractionScale
      let dy = sampleY * refractionScale
      const rawOffset = Math.hypot(dx, dy)
      if (rawOffset > GLASS_MAX_REFRACTION) {
        const limit = GLASS_MAX_REFRACTION / rawOffset
        dx *= limit
        dy *= limit
      }
      // Keep the refracted sample inside the canvas, then size the zoom
      // margin for the actual displacement so no transparent gaps appear.
      const edgeX = Math.max(0, Math.min(triangle.cx, w - triangle.cx) * 0.9)
      const edgeY = Math.max(0, Math.min(triangle.cy, h - triangle.cy) * 0.9)
      dx = Math.max(-edgeX, Math.min(edgeX, dx))
      dy = Math.max(-edgeY, Math.min(edgeY, dy))
      const offset = Math.hypot(dx, dy)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(a.sx, a.sy)
      ctx.lineTo(b.sx, b.sy)
      ctx.lineTo(c.sx, c.sy)
      ctx.closePath()
      ctx.clip()

      // Chromatic dispersion: sample the red, green and blue channel maps at
      // different texture coordinates. Red and blue are split perpendicular
      // to the refraction direction while green follows the centre ray.
      const directionLength = Math.hypot(dx, dy)
      const dirX = directionLength > 0.001 ? dx / directionLength : 0.7071
      const dirY = directionLength > 0.001 ? dy / directionLength : 0.7071
      const perpX = -dirY
      const perpY = dirX
      const dispersion = 2.5 + Math.min(12, offset * 0.12)
      const channels = [
        [sceneGreenCanvas, 0],
        [sceneRedCanvas, 1],
        [sceneBlueCanvas, -1]
      ]

      ctx.save()
      for (const [canvas, shift] of channels) {
        if (!canvas) continue
        const channelScale = 1 + shift * 0.015
        const sampleX = dx * channelScale + perpX * dispersion * shift
        const sampleY = dy * channelScale + perpY * dispersion * shift
        const boundedX = Math.max(-edgeX, Math.min(edgeX, sampleX))
        const boundedY = Math.max(-edgeY, Math.min(edgeY, sampleY))
        const channelOffset = Math.hypot(boundedX, boundedY)
        const channelZoom =
          1 +
          (1 - nz) * 0.08 +
          (channelOffset * 1.8) / Math.max(1, Math.min(w, h)) +
          0.01 +
          shift * 0.002

        ctx.save()
        // Green replaces the sharp scene inside the triangle; red and blue
        // add the dispersed fringes on top.
        ctx.globalCompositeOperation = shift === 0 ? 'copy' : 'lighter'
        ctx.translate(triangle.cx - boundedX, triangle.cy - boundedY)
        ctx.scale(channelZoom, channelZoom)
        ctx.translate(-triangle.cx, -triangle.cy)
        ctx.globalAlpha = 1
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h)
        ctx.restore()
      }
      ctx.restore()

      // Flat material tint; highlights desaturate towards white while the
      // refracted scene remains visible underneath.
      const saturation = Math.max(0, tone.s * (1 - specular * 0.7))
      ctx.fillStyle = `hsla(${tone.h.toFixed(1)}, ${saturation.toFixed(1)}%, ${lightL.toFixed(1)}%, ${tintAlpha.toFixed(3)})`
      ctx.fill()
      ctx.restore()
    }

    ctx.restore()
  }

  if (sceneFx.showGraph) {
    // Simple connection lines on top.
    ctx.save()
    for (const link of links) {
      const tone = link.tone
      ctx.lineWidth = link.width
      ctx.strokeStyle = `hsla(${tone.h.toFixed(1)}, ${tone.s.toFixed(1)}%, ${Math.max(62, Math.min(78, tone.l)).toFixed(1)}%, ${link.alpha.toFixed(3)})`
      ctx.beginPath()
      ctx.moveTo(link.ax, link.ay)
      ctx.lineTo(link.bx, link.by)
      ctx.stroke()
    }
    ctx.restore()

    // Solid nodes on top.
    ctx.save()
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i]
      const radius = nodeSizes[i]
      const tone = tones[i % tones.length]
      const light = Math.max(62, Math.min(90, tone.l + treble * 8))
      ctx.fillStyle = `hsla(${tone.h.toFixed(1)}, ${tone.s.toFixed(1)}%, ${light.toFixed(1)}%, ${(0.86 + energy * 0.14).toFixed(2)})`
      ctx.beginPath()
      ctx.arc(point.sx, point.sy, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

function drawSpectrum() {
  if (!isActive.value) return
  const data = getFrequencyData()
  if (!data || !data.length) return

  const p = palette.value
  const tones = p.tones
  const energy = audioState.energy
  const barCount = w < 640 ? 36 : 72
  const gap = w < 640 ? 2 : 3
  const barWidth = w / barCount
  const maxHeight = Math.min(80, h * 0.16)

  ctx.save()
  for (let i = 0; i < barCount; i++) {
    const norm = i / barCount
    // Log-ish bin mapping: more resolution in the bass/mid range.
    const index = Math.min(
      data.length - 1,
      Math.floor(Math.pow(norm, 1.7) * data.length * 0.7)
    )
    const value = data[index] / 255
    const height = Math.pow(value, 1.35) * maxHeight * (0.6 + energy * 0.8)
    const pos = norm * (tones.length - 1)
    const toneIndex = Math.min(tones.length - 2, Math.floor(pos))
    const blend = pos - toneIndex
    const from = tones[toneIndex]
    const to = tones[toneIndex + 1]
    const hue = from.h + shortestHueDelta(from.h, to.h) * blend
    const sat = from.s + (to.s - from.s) * blend
    const light = from.l + (to.l - from.l) * blend
    ctx.fillStyle = `hsla(${hue.toFixed(1)}, ${sat.toFixed(1)}%, ${Math.min(88, light + 2).toFixed(1)}%, ${(0.08 + value * 0.38).toFixed(3)})`
    ctx.fillRect(i * barWidth + gap / 2, h - height, Math.max(1, barWidth - gap), height)
  }
  ctx.restore()
}

function frame(t) {
  if (!running) return
  const time = t || 0
  ctx.clearRect(0, 0, w, h)
  drawFlowField(time)
  drawSpectrum()
  drawParticles(time)
  raf = requestAnimationFrame(frame)
}

function drawStatic() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  drawFlowField(0)
  drawSpectrum()
  drawParticles(0)
}

function startAnimation() {
  if (running) return
  running = true
  raf = requestAnimationFrame(frame)
}

function stopAnimation() {
  running = false
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function syncAnimation() {
  if (isActive.value) {
    startAnimation()
    return
  }
  if (reducedMotion()) {
    stopAnimation()
    drawStatic()
  } else {
    startAnimation()
  }
}

function onVisibility() {
  if (document.hidden) {
    stopAnimation()
  } else {
    syncAnimation()
  }
}

function onResize() {
  resize()
  // Keep the existing scene when the viewport changes. Mobile browsers fire
  // resize while scrolling (address bar), and re-seeding there makes the
  // background look like it reloaded.
  for (const point of points) {
    point.x = ((point.x % w) + w) % w
    point.y = ((point.y % h) + h) % h
  }
  if (!running) drawStatic()
}

const unwatchAudio = watch(isActive, () => {
  syncAnimation()
})

const unwatchParticleCount = watch(
  () => sceneFx.particleCount,
  () => {
    syncFlowCount()
    if (!running) drawStatic()
  }
)

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  seed()
  resizeHandler = onResize
  window.addEventListener('resize', resizeHandler)
  document.addEventListener('visibilitychange', onVisibility)
  syncAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
  unwatchAudio()
  unwatchParticleCount()
  if (smokeWorker) {
    smokeWorker.terminate()
    smokeWorker = null
  }
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.hero-canvas {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  height: 100lvh;
  z-index: -1;
  pointer-events: none;
}
</style>
