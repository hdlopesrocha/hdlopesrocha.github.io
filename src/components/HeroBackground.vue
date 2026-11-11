<template>
  <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  state as audioState,
  isActive,
  palette,
  getFrequencyData
} from '../composables/useAudioReactive'

const canvas = ref(null)
let raf = 0
let ctx = null
let points = []
let w = 0
let h = 0
let running = false
let resizeHandler = null
let resizeObserver = null

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

function drawGrid(t) {
  ctx.clearRect(0, 0, w, h)

  const active = isActive.value
  const bass = active ? audioState.bass : 0
  const lowMid = active ? audioState.lowMid : 0
  const mid = active ? audioState.mid : 0
  const treble = active ? audioState.treble : 0
  const kick = active ? audioState.kick : 0
  const energy = active ? audioState.energy : 0
  const pace = active ? audioState.pace : 0
  const p = palette.value

  const amp = 3 + lowMid * 20 + bass * 14 + kick * 8
  const timeScale = 1 + bass * 3 + mid * 2 + pace * 2
  const alpha = 0.055 + treble * 0.08 + energy * 0.035

  ctx.save()
  ctx.strokeStyle = `hsla(${p.hue + 8}, 82%, 70%, ${alpha.toFixed(3)})`
  ctx.lineWidth = 1
  const step = 44

  ctx.beginPath()
  for (let x = 0; x <= w; x += step) {
    ctx.moveTo(x, 0)
    for (let y = 0; y <= h; y += step) {
      const warp = Math.sin(y / 90 + t / (2400 / timeScale) + x / 400) * amp
      ctx.lineTo(x + warp, y)
    }
  }
  for (let y = 0; y <= h; y += step) {
    ctx.moveTo(0, y)
    for (let x = 0; x <= w; x += step) {
      const warp = Math.cos(x / 120 + t / (3200 / timeScale)) * amp * 0.55
      ctx.lineTo(x, y + warp)
    }
  }
  ctx.stroke()
  ctx.restore()
}

function drawBlobs(t) {
  const active = isActive.value
  const bass = active ? audioState.bass : 0
  const mid = active ? audioState.mid : 0
  const treble = active ? audioState.treble : 0
  const snare = active ? audioState.snare : 0
  const kick = active ? audioState.kick : 0
  const energy = active ? audioState.energy : 0
  const pace = active ? audioState.pace : 0
  const p = palette.value
  const drift = t / (7000 / (1 + pace * 1.6 + energy * 0.35))

  const blobs = [
    {
      x: w * (0.22 + Math.sin(drift + 0.6) * 0.045 + bass * 0.02),
      y: h * (0.32 + Math.cos(drift * 1.3) * 0.035),
      r: Math.max(120, 175 + bass * 170 + kick * 70),
      hue: p.hue,
      alpha: 0.07 + bass * 0.15 + kick * 0.05
    },
    {
      x: w * (0.8 + Math.cos(drift * 0.8 + 1.2) * 0.04),
      y: h * (0.25 + Math.sin(drift * 1.7) * 0.045 + mid * 0.02),
      r: Math.max(130, 190 + mid * 170 + snare * 60),
      hue: p.hue2,
      alpha: 0.06 + mid * 0.13 + snare * 0.04
    },
    {
      x: w * (0.55 + Math.sin(drift * 1.1 + 2.4) * 0.05),
      y: h * (0.85 + Math.cos(drift + 1.7) * 0.03),
      r: Math.max(140, 195 + treble * 150 + energy * 60),
      hue: p.hue3,
      alpha: 0.05 + treble * 0.12
    }
  ]

  for (const blob of blobs) {
    const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r)
    gradient.addColorStop(0, `hsla(${blob.hue}, 88%, 62%, ${blob.alpha.toFixed(3)})`)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(blob.x - blob.r, blob.y - blob.r, blob.r * 2, blob.r * 2)
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
  const hues = [p.hue, p.hue2, p.hue3]

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

  ctx.lineWidth = 1
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    for (let j = i + 1; j < points.length; j++) {
      const other = points[j]
      const dx = point.sx - other.sx
      const dy = point.sy - other.sy
      const d2 = dx * dx + dy * dy
      const pairSeed = (point.seed * 3 + other.seed * 7) % 1
      if (d2 < maxDist * maxDist && pairSeed < linkDensity) {
        const a = (1 - Math.sqrt(d2) / maxDist) * linkAlpha
        ctx.strokeStyle = `hsla(${hues[i % 3]}, 88%, 70%, ${a.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(point.sx, point.sy)
        ctx.lineTo(other.sx, other.sy)
        ctx.stroke()
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const radius = point.r * (1 + treble * 1.5 + kick * 0.8 + snare * 0.3)
    ctx.fillStyle = `hsla(${hues[i % 3]}, 92%, ${(66 + treble * 10).toFixed(0)}%, ${(0.55 + energy * 0.35).toFixed(2)})`
    ctx.beginPath()
    ctx.arc(point.sx, point.sy, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawSpectrum() {
  if (!isActive.value) return
  const data = getFrequencyData()
  if (!data || !data.length) return

  const p = palette.value
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
    const hue = p.hue + norm * 85
    ctx.fillStyle = `hsla(${hue}, 92%, 68%, ${(0.08 + value * 0.38).toFixed(3)})`
    ctx.fillRect(i * barWidth + gap / 2, h - height, Math.max(1, barWidth - gap), height)
  }
  ctx.restore()
}

function frame(t) {
  if (!running) return
  const time = t || 0
  drawGrid(time)
  drawBlobs(time)
  drawParticles(time)
  drawSpectrum()
  raf = requestAnimationFrame(frame)
}

function drawStatic() {
  if (!ctx) return
  drawGrid(1200)

  const p = palette.value
  ctx.fillStyle = `hsla(${p.hue}, 92%, 72%, 0.6)`
  for (const point of points) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2)
    ctx.fill()
  }
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
