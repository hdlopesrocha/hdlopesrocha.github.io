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

const canvas = ref(null)
let raf = 0
let ctx = null
let points = []
let w = 0
let h = 0
let running = false
let resizeHandler = null
let resizeObserver = null
let flowParticles = []
let flowLayerCanvas = null
let flowLayerCtx = null

const FLOW_COUNT = 1200
const FLOW_PATH_LENGTH = 72
const FLOW_COLOR_STOPS = 8
const FLOW_FORCE_SCALE = 0.0024
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
  const rect = el.parentElement.getBoundingClientRect()
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
    history: []
  }))
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

  for (const particle of flowParticles) {
    const channel = particle.channel
    const level = levels[channel]
    const pulse = pulses[channel]
    const speedScale = level * 2.8 + pulse * 1.5
    const palette = channelPalettes[channel]

    const palettePos = (particle.colorPhase + t * 0.00025) % palette.length
    const paletteIndex = Math.floor(palettePos)
    const paletteMix = palettePos - paletteIndex
    const from = palette[paletteIndex]
    const to = palette[(paletteIndex + 1) % palette.length]
    const color = {
      h: (from.h + shortestHueDelta(from.h, to.h) * paletteMix + 360) % 360,
      s: from.s + (to.s - from.s) * paletteMix,
      l: from.l + (to.l - from.l) * paletteMix
    }

    if (speedScale > 0.02) particle.life -= 1
    const angle = cloudNoise(
      particle.x * FLOW_FORCE_SCALE,
      particle.y * FLOW_FORCE_SCALE,
      noiseTime
    ) * Math.PI * 2
    const nx = particle.x + Math.cos(angle) * particle.speed * speedScale
    const ny = particle.y + Math.sin(angle) * particle.speed * speedScale

    if (
      particle.life <= 0 ||
      nx < -6 ||
      nx > w + 6 ||
      ny < -6 ||
      ny > h + 6
    ) {
      particle.x = Math.random() * w
      particle.y = Math.random() * h
      particle.life = 90 + Math.random() * 260
      particle.history.length = 0
      continue
    }

    particle.x = nx
    particle.y = ny
    particle.history.push({
      x: nx,
      y: ny,
      h: color.h,
      s: color.s,
      l: Math.min(88, color.l + 2 + level * 4)
    })
    if (particle.history.length > FLOW_PATH_LENGTH) particle.history.shift()
    if (particle.history.length < 2) continue

    const headAlpha = Math.min(0.95, 0.3 + level * 0.5 + pulse * 0.25)
    const history = particle.history
    const tail = history[0]
    const head = history[history.length - 1]
    const gradient = flowLayerCtx.createLinearGradient(tail.x, tail.y, head.x, head.y)
    for (let stop = 0; stop < FLOW_COLOR_STOPS; stop += 1) {
      const at = stop / (FLOW_COLOR_STOPS - 1)
      const point = history[Math.round(at * (history.length - 1))]
      const alpha = headAlpha * Math.pow(at, 0.7)
      gradient.addColorStop(
        at,
        `hsla(${point.h.toFixed(1)}, ${point.s.toFixed(1)}%, ${Math.min(86, point.l + 2).toFixed(1)}%, ${alpha.toFixed(3)})`
      )
    }
    flowLayerCtx.lineWidth = 0.8 + level * 1.3 + pulse * 0.6
    flowLayerCtx.strokeStyle = gradient
    flowLayerCtx.beginPath()
    flowLayerCtx.moveTo(tail.x, tail.y)
    for (let i = 1; i < history.length; i += 1) {
      flowLayerCtx.lineTo(history[i].x, history[i].y)
    }
    flowLayerCtx.stroke()
  }
  flowLayerCtx.restore()

  // Blurred particle render becomes the background; the sharp pass and the
  // graph are drawn on top of it.
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.filter = `blur(${(12 + (active ? audioState.energy : 0) * 10).toFixed(1)}px)`
  ctx.globalAlpha = 0.85
  ctx.drawImage(flowLayerCanvas, 0, 0, w, h)
  ctx.filter = 'none'
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(flowLayerCanvas, 0, 0, w, h)
  ctx.restore()
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

function onContainerResize() {
  // The hero grows/shrinks when the audio panel or errors appear. Resize the
  // canvas bitmap too, otherwise the graph and spectrum stay anchored to the
  // old hero height and visually drift out of the section.
  resize()
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
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onContainerResize)
    resizeObserver.observe(canvas.value.parentElement)
  }
  document.addEventListener('visibilitychange', onVisibility)
  syncAnimation()
})

onBeforeUnmount(() => {
  stopAnimation()
  unwatchAudio()
  resizeObserver?.disconnect()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
