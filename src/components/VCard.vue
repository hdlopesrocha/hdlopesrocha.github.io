<template>
  <div class="glass vcard">
    <div class="vc-info">
      <p class="eyebrow mono">~/vcard — save contact</p>
      <h3>{{ RESUME.fullName }}</h3>
      <p class="muted">{{ RESUME.title }}</p>
      <dl class="facts mono">
        <div>
          <dt>based in</dt>
          <dd class="copyable">
            <span>{{ RESUME.location }}</span>
            <button
              type="button"
              class="copy-btn"
              :class="{ ok: copiedKey === 'location' }"
              @click="copyText('location', RESUME.location)"
              :aria-label="copiedKey === 'location' ? 'Location copied' : 'Copy location'"
              title="Copy"
            >{{ copiedKey === 'location' ? '✓' : '⧉' }}</button>
          </dd>
        </div>
        <div>
          <dt>phone</dt>
          <dd class="copyable">
            <a :href="RESUME.phoneHref">{{ RESUME.phone }}</a>
            <button
              type="button"
              class="copy-btn"
              :class="{ ok: copiedKey === 'phone' }"
              @click="copyText('phone', RESUME.phone)"
              :aria-label="copiedKey === 'phone' ? 'Phone copied' : 'Copy phone'"
              title="Copy"
            >{{ copiedKey === 'phone' ? '✓' : '⧉' }}</button>
          </dd>
        </div>
        <div><dt>email</dt><dd><a :href="`mailto:${RESUME.email}`">{{ RESUME.email }}</a></dd></div>
        <div>
          <dt>site</dt>
          <dd class="copyable">
            <a :href="RESUME.site" target="_blank" rel="noopener noreferrer">{{ RESUME.site }}</a>
            <button
              type="button"
              class="copy-btn"
              :class="{ ok: copiedKey === 'site' }"
              @click="copyText('site', RESUME.site)"
              :aria-label="copiedKey === 'site' ? 'Site copied' : 'Copy site URL'"
              title="Copy"
            >{{ copiedKey === 'site' ? '✓' : '⧉' }}</button>
          </dd>
        </div>
        <div><dt>github</dt><dd><a href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer">hdlopesrocha ↗</a></dd></div>
        <div><dt>youtube</dt><dd><a :href="RESUME.youtube" target="_blank" rel="noopener noreferrer">hdlopesrocha ↗</a></dd></div>
        <div>
          <dt>nostr</dt>
          <dd class="copyable">
            <span class="break">{{ NOSTR_RECIPIENT_NPUB }}</span>
            <button
              type="button"
              class="copy-btn"
              :class="{ ok: copiedKey === 'nostr' }"
              @click="copyText('nostr', NOSTR_RECIPIENT_NPUB)"
              :aria-label="copiedKey === 'nostr' ? 'npub copied' : 'Copy npub'"
              title="Copy npub"
            >{{ copiedKey === 'nostr' ? '✓' : '⧉' }}</button>
          </dd>
        </div>
        <div><dt>telegram</dt><dd><a :href="RESUME.telegramUrl" target="_blank" rel="noopener noreferrer">{{ RESUME.telegram }} ↗</a></dd></div>
        <div>
          <dt>lnurl</dt>
          <dd class="copyable">
            <span>{{ LIGHTNING_ADDRESS }}</span>
            <button
              type="button"
              class="copy-btn"
              :class="{ ok: copiedKey === 'lnurl' }"
              @click="copyText('lnurl', LIGHTNING_ADDRESS)"
              :aria-label="copiedKey === 'lnurl' ? 'Lightning address copied' : 'Copy lightning address'"
              title="Copy"
            >{{ copiedKey === 'lnurl' ? '✓' : '⧉' }}</button>
          </dd>
        </div>
      </dl>
      <div class="vc-actions">
        <button class="btn small primary" type="button" @click="download">Download .vcf</button>
        <button class="btn small ghost" type="button" @click="copyVCard">{{ vcopied ? 'Copied ✓' : 'Copy vCard text' }}</button>
      </div>
    </div>
    <div class="vc-qr">
      <button type="button" class="qr-btn" @click="download" aria-label="Download contact as .vcf file" title="Click to download .vcf">
        <canvas ref="qrCanvas" width="280" height="280" aria-hidden="true"></canvas>
      </button>
      <p class="mono hint">scan to save · click to download</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RESUME } from '../data/resume.js'
import { NOSTR_RECIPIENT_NPUB } from '../data/contact.js'
import { LIGHTNING_ADDRESS } from '../data/donate.js'

const qrCanvas = ref(null)
const vcopied = ref(false)
const copiedKey = ref(null)
let copyTimer = null

function vcardText() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Rocha;Henrique;;;',
    `FN:${RESUME.fullName}`,
    `TITLE:${RESUME.title}`,
    `TEL;TYPE=CELL,VOICE:${RESUME.phoneHref.replace('tel:', '')}`,
    `EMAIL:${RESUME.email}`,
    `URL:${RESUME.site}`,
    `URL:${RESUME.github}`,
    `URL:${RESUME.youtube}`,
    `ADR;TYPE=HOME:;;;Castelo Branco;;;Portugal`,
    `IMPP;TYPE=HOME:nostr:${NOSTR_RECIPIENT_NPUB}`,
    `IMPP;TYPE=HOME:${RESUME.telegramUrl}`,
    `IMPP;TYPE=HOME:lnurl:${LIGHTNING_ADDRESS}`,
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

async function copyText(key, text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    copiedKey.value = key
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copiedKey.value = null), 1500)
  } catch {}
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
      width: 280,
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
.facts dd.break { word-break: break-all; }
.facts a { color: var(--text); }
.facts dd.copyable { display: flex; align-items: center; gap: 0.45rem; min-width: 0; }
.facts dd.copyable span.break { word-break: break-all; }
.copy-btn {
  flex: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  color: var(--dim);
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.copy-btn:hover { color: var(--text); border-color: var(--accent); }
.copy-btn.ok { color: var(--accent); border-color: var(--accent); }
.vc-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.vc-qr { display: grid; gap: 0.4rem; justify-items: center; }
.qr-btn { background: none; border: none; padding: 0; cursor: pointer; border-radius: 12px; line-height: 0; }
.qr-btn:hover canvas, .qr-btn:focus-visible canvas { box-shadow: 0 0 0 2px var(--accent), 0 0 26px rgba(45,212,191,0.3); }
.vc-qr canvas { border-radius: 12px; border: 1px solid var(--line-strong); background: #fff; }
.hint { margin: 0; color: var(--dim); font-size: 0.72rem; }
</style>
