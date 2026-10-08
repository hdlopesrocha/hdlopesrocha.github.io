<template>
  <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
let raf = 0
let ctx = null
let points = []
let w = 0
let h = 0
let running = true

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
  el.style.width = `${w}px`
  el.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function seed() {
  const count = w < 640 ? 34 : w < 1100 ? 55 : 72
  points = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2
  }))
}

function drawGrid(t) {
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.strokeStyle = 'rgba(148,178,255,0.07)'
  ctx.lineWidth = 1
  const step = 44
  ctx.beginPath()
  for (let x = 0; x <= w; x += step) {
    ctx.moveTo(x, 0)
    // subtle sine warp to feel like a math field
    for (let y = 0; y <= h; y += step) {
      const warp = Math.sin(y / 90 + t / 2400 + x / 400) * 5
      ctx.lineTo(x + warp, y)
    }
  }
  for (let y = 0; y <= h; y += step) {
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
  }
  ctx.stroke()
  ctx.restore()
}

function frame(t) {
  if (!running) return
  drawGrid(t || 0)
  // isosurface-ish glow blobs (cheap radial gradients, static positions drift slowly)
  const blobs = [
    { x: w * 0.22, y: h * 0.32, r: 180, c: 'rgba(45,212,191,0.10)' },
    { x: w * 0.8, y: h * 0.25, r: 200, c: 'rgba(56,189,248,0.09)' },
    { x: w * 0.55, y: h * 0.85, r: 220, c: 'rgba(167,139,250,0.08)' }
  ]
  for (const b of blobs) {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
    g.addColorStop(0, b.c)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2)
  }

  // particles + links
  const maxDist = 130
  ctx.lineWidth = 1
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    p.x += p.vx
    p.y += p.vy + Math.sin((t || 0) / 2200 + p.phase) * 0.08
    if (p.x < -10) p.x = w + 10
    if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10
    for (let j = i + 1; j < points.length; j++) {
      const q = points[j]
      const dx = p.x - q.x
      const dy = p.y - q.y
      const d2 = dx * dx + dy * dy
      if (d2 < maxDist * maxDist) {
        const a = (1 - Math.sqrt(d2) / maxDist) * 0.22
        ctx.strokeStyle = `rgba(94,234,212,${a.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }
  }
  ctx.fillStyle = 'rgba(153,246,228,0.75)'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
  raf = requestAnimationFrame(frame)
}

function drawStatic() {
  drawGrid(1200)
  ctx.fillStyle = 'rgba(153,246,228,0.6)'
  for (const p of points) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function onVisibility() {
  if (document.hidden) {
    running = false
    cancelAnimationFrame(raf)
  } else if (!reducedMotion()) {
    running = true
    raf = requestAnimationFrame(frame)
  }
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  seed()
  window.addEventListener('resize', () => {
    resize()
    seed()
    if (reducedMotion()) drawStatic()
  })
  document.addEventListener('visibilitychange', onVisibility)
  if (reducedMotion()) {
    drawStatic()
  } else {
    raf = requestAnimationFrame(frame)
  }
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  display: block;
}
</style>
