<template>
  <div class="glass vcard">
    <div class="vc-info">
      <p class="eyebrow mono">~/vcard — save contact</p>
      <h3>{{ RESUME.fullName }}</h3>
      <p class="muted">{{ RESUME.title }}</p>
      <dl class="facts mono">
        <div><dt>phone</dt><dd>{{ RESUME.phone }}</dd></div>
        <div><dt>site</dt><dd>{{ RESUME.site }}</dd></div>
      </dl>
      <div class="vc-actions">
        <button class="btn small primary" type="button" @click="download">Download .vcf</button>
        <button class="btn small ghost" type="button" @click="copyVCard">{{ vcopied ? 'Copied ✓' : 'Copy vCard text' }}</button>
      </div>
    </div>
    <div class="vc-qr">
      <canvas ref="qrCanvas" width="180" height="180" aria-label="vCard QR code — scan to save contact"></canvas>
      <p class="mono hint">scan to save</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RESUME } from '../data/resume.js'

const qrCanvas = ref(null)
const vcopied = ref(false)

function vcardText() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Rocha;Henrique Duarte Lopes;;;',
    `FN:${RESUME.fullName}`,
    `TITLE:${RESUME.title}`,
    `TEL;TYPE=CELL,VOICE:${RESUME.phoneHref.replace('tel:', '')}`,
    `EMAIL:${RESUME.email}`,
    `URL:${RESUME.site}`,
    `ADR;TYPE=HOME:;;Castelo Branco;;;Portugal;`,
    'END:VCARD'
  ].join('\r\n')
}

function download() {
  const blob = new Blob([vcardText()], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'henrique-lopes-rocha.vcf'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

async function copyVCard() {
  try {
    await navigator.clipboard.writeText(vcardText())
    vcopied.value = true
    setTimeout(() => (vcopied.value = false), 2000)
  } catch {}
}

onMounted(async () => {
  // Lazy-load QR rendering; panel text works without it.
  try {
    const { default: QRCode } = await import('qrcode')
    await QRCode.toCanvas(qrCanvas.value, vcardText(), {
      width: 180,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#04181a', light: '#ffffff' }
    })
  } catch {}
})
</script>

<style scoped>
.vcard {
  margin-top: 2rem;
  padding: 1.4rem 1.6rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
h3 { margin: 0.4rem 0 0.2rem; font-size: 1.3rem; }
.muted { color: var(--muted); margin: 0 0 0.8rem; }
.facts { display: grid; gap: 0.3rem; margin: 0 0 1rem; font-size: 0.82rem; }
.facts div { display: flex; gap: 0.8rem; }
.facts dt { color: var(--accent); min-width: 3.2rem; }
.facts dd { margin: 0; color: var(--muted); }
.vc-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.vc-qr { display: grid; gap: 0.4rem; justify-items: center; }
.vc-qr canvas { border-radius: 12px; border: 1px solid var(--line-strong); background: #fff; }
.hint { margin: 0; color: var(--dim); font-size: 0.72rem; }
</style>
