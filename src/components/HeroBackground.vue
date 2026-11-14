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
let smokeMaskCanvas = null
let smokeMaskCtx = null
let smokeWorker = null
let smokeWorkerBusy = false
let smokeWorkerFailed = false
let smokeMaskReady = false
let lastSmokeRequestAt = -Infinity

const SMOKE_W = 512
const SMOKE_H = 288

const FLOW_COUNT = 1200
const FLOW_PATH_LENGTH = 72
const FLOW_TRAIL_CHUNKS = 14
const FLOW_ALPHA_LEVELS = 10
const FLOW_FORCE_SCALE = 0.0024
const FLOW_WALL_MARGIN = 4
const TRIANGLE_FADE = 0.12
const TRIANGLE_MAX_ALPHA = 0.18
const TRIANGLE_WEIGHT_SCALE = 0.02
const CHANNEL_PALETTE_SIZE = 5

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

let triangleFrame = 0
let cachedTriangleTargets = null
const triangleWeights = new Map()

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
  w = rect.width
  h = rect.height
  el.width = Math.floor(w * dpr)
  el.height = Math.floor(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function seed() {
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

function seedFlow() {
  const count = w < 640 ? 600 : FLOW_COUNT
  flowParticles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.55 + Math.random() * 1.1,
    life: 90 + Math.random() * 260,
    channel: i % 4,
    colorPhase: Math.random() * CHANNEL_PALETTE_SIZE,
    vx: 0,
    vy: 0,
    history: []
  }))
}

function respawnParticle(particle) {
  particle.x = FLOW_WALL_MARGIN + Math.random() * (w - 2 * FLOW_WALL_MARGIN)
  particle.y = FLOW_WALL_MARGIN + Math.random() * (h - 2 * FLOW_WALL_MARGIN)
  particle.life = 90 + Math.random() * 260
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
    const palette = channelPalettes[channel]

    const palettePos = (particle.colorPhase + t * 0.00025) % palette.length
    const paletteBucket = Math.round(palettePos) % palette.length

    if (speedScale > 0.02) particle.life -= 1
    const angle = cloudNoise(
      particle.x * FLOW_FORCE_SCALE,
      particle.y * FLOW_FORCE_SCALE,
      noiseTime
    ) * Math.PI * 2
    const targetVx = Math.cos(angle) * particle.speed * speedScale
    const targetVy = Math.sin(angle) * particle.speed * speedScale
    particle.vx += (targetVx - particle.vx) * 0.25
    particle.vy += (targetVy - particle.vy) * 0.25
    let nx = particle.x + particle.vx
    let ny = particle.y + particle.vy

    if (particle.life <= 0) {
      respawnParticle(particle)
      continue
    }

    // Wrap across the viewport edges with modulo. Clear the trail when a
    // wrap happens so it does not draw a streak across the whole screen.
    const wrappedX = nx < 0 || nx >= w
    const wrappedY = ny < 0 || ny >= h
    nx = ((nx % w) + w) % w
    ny = ((ny % h) + h) % h
    if (wrappedX || wrappedY) particle.history.length = 0

    particle.x = nx
    particle.y = ny
    if (sceneFx.showDots) {
      const dotTone = palette[paletteBucket % palette.length]
      flowLayerCtx.fillStyle = `hsla(${dotTone.h.toFixed(1)}, ${dotTone.s.toFixed(1)}%, ${Math.min(86, dotTone.l + 2).toFixed(1)}%, ${(0.42 + level * 0.35 + pulse * 0.2).toFixed(2)})`
      flowLayerCtx.beginPath()
      flowLayerCtx.arc(nx, ny, 1.2 + level * 1.2 + pulse * 0.7, 0, Math.PI * 2)
      flowLayerCtx.fill()
    }
    particle.history.push({ x: nx, y: ny, bucket: paletteBucket })
    if (particle.history.length > FLOW_PATH_LENGTH) particle.history.shift()
    if (particle.history.length < 2) continue

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

  for (const bucket of trailBuckets.values()) {
    flowLayerCtx.globalAlpha = bucket.alpha
    flowLayerCtx.lineWidth = bucket.width
    flowLayerCtx.strokeStyle = bucket.color
    flowLayerCtx.stroke(bucket.path)
  }
  flowLayerCtx.globalAlpha = 1
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
  }

  const links = []
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    for (let j = i + 1; j < points.length; j++) {
      const other = points[j]
      const dx = point.sx - other.sx
      const dy = point.sy - other.sy
      const d2 = dx * dx + dy * dy
      const pairSeed = (point.seed * 3 + other.seed * 7) % 1
      if (d2 < maxDist * maxDist && pairSeed < linkDensity) {
        links.push({
          a: i,
          b: j,
          ax: point.sx,
          ay: point.sy,
          bx: other.sx,
          by: other.sy,
          alpha: (1 - Math.sqrt(d2) / maxDist) * linkAlpha,
          tone: tones[i % tones.length]
        })
      }
    }
  }

  const adjacency = Array.from({ length: points.length }, () => new Set())
  for (const link of links) {
    adjacency[link.a].add(link.b)
    adjacency[link.b].add(link.a)
  }

  const triangles = []
  for (let i = 0; i < points.length; i += 1) {
    const neighbors = [...adjacency[i]].filter((j) => j > i).sort((a, b) => a - b)
    for (let m = 0; m < neighbors.length; m += 1) {
      const j = neighbors[m]
      const jNeighbors = adjacency[j]
      for (let n = m + 1; n < neighbors.length; n += 1) {
        const k = neighbors[n]
        if (jNeighbors.has(k)) {
          const a = points[i]
          const b = points[j]
          const c = points[k]
          triangles.push({
            key: `${i}:${j}:${k}`,
            i,
            j,
            k,
            cx: (a.sx + b.sx + c.sx) / 3,
            cy: (a.sy + b.sy + c.sy) / 3
          })
        }
      }
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

      for (const triangle of triangles) {
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
    ctx.save()
    const currentKeys = new Set()
    for (const triangle of triangles) {
      currentKeys.add(triangle.key)
      const target = Math.min(
        TRIANGLE_MAX_ALPHA,
        (cachedTriangleTargets.get(triangle.key) || 0) * TRIANGLE_WEIGHT_SCALE
      )
      const current = triangleWeights.get(triangle.key) || 0
      const next = current + (target - current) * TRIANGLE_FADE
      if (next > 0.001) triangleWeights.set(triangle.key, next)
      else triangleWeights.delete(triangle.key)
      if (next <= 0.002) continue

      const a = points[triangle.i]
      const b = points[triangle.j]
      const c = points[triangle.k]
      const tone = tones[(triangle.i + triangle.j + triangle.k) % tones.length]
      ctx.fillStyle = `hsla(${tone.h.toFixed(1)}, ${tone.s.toFixed(1)}%, ${Math.max(62, Math.min(84, tone.l + 4)).toFixed(1)}%, ${next.toFixed(3)})`
      ctx.beginPath()
      ctx.moveTo(a.sx, a.sy)
      ctx.lineTo(b.sx, b.sy)
      ctx.lineTo(c.sx, c.sy)
      ctx.closePath()
      ctx.fill()
    }

    // Fade out weights for triangles that no longer exist.
    for (const [key, value] of triangleWeights) {
      if (currentKeys.has(key)) continue
      const next = value * (1 - TRIANGLE_FADE)
      if (next > 0.001) triangleWeights.set(key, next)
      else triangleWeights.delete(key)
    }
    ctx.restore()
  }

  if (sceneFx.showGraph) {
    // Simple connection lines on top.
    ctx.save()
    ctx.lineWidth = 1
    for (const link of links) {
      const tone = link.tone
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
      const radius = point.r * (1 + treble * 1.5 + kick * 0.8 + snare * 0.3)
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
  drawParticles(time)
  drawSpectrum()
  raf = requestAnimationFrame(frame)
}

function drawStatic() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  drawFlowField(0)
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
  seed()
  seedFlow()
  if (!running) drawStatic()
}

const unwatchAudio = watch(isActive, () => {
  syncAnimation()
})

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
  z-index: -1;
  pointer-events: none;
}
</style>
