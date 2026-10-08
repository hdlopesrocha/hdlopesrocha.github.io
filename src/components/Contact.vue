<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow mono">~/contact — direct line</p>
        <h2 id="contact-title">Say hello over Nostr</h2>
        <p class="lede">
          This form sends an <strong>end-to-end encrypted</strong> direct message (NIP-04)
          straight from your browser to my relays — no account, no backend, no middleman.
          A one-use sender key is generated locally and discarded after sending.
        </p>
        <div class="glass npub-box">
          <p class="mono label">my npub — dm me from any client</p>
          <code class="mono npub">{{ NOSTR_RECIPIENT_NPUB }}</code>
          <button class="btn small ghost" type="button" @click="copyNpub">
            {{ copied ? 'Copied ✓' : 'Copy npub' }}
          </button>
        </div>
        <p class="muted small">Prefer GitHub? <a href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer">hdlopesrocha</a> works too.</p>
      </div>

      <form class="glass form" @submit.prevent="send" novalidate>
        <div class="field">
          <label for="contact-name">Name <span class="muted">(optional)</span></label>
          <input
            id="contact-name"
            v-model="name"
            type="text"
            name="name"
            autocomplete="name"
            :maxlength="CONTACT_LIMITS.nameMax"
            placeholder="satoshi"
          />
        </div>
        <!-- honeypot: real users never fill this -->
        <div class="hp" aria-hidden="true">
          <label>Website <input v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" /></label>
        </div>
        <div class="field">
          <label for="contact-message">Message</label>
          <textarea
            id="contact-message"
            v-model="message"
            name="message"
            rows="5"
            required
            :maxlength="CONTACT_LIMITS.messageMax"
            placeholder="Hey — loved the vulkan-engine SDF work…"
          ></textarea>
          <p class="count mono">{{ message.length }}/{{ CONTACT_LIMITS.messageMax }}</p>
        </div>
        <button class="btn primary" type="submit" :disabled="sending">
          {{ sending ? 'Encrypting & publishing…' : 'Send via Nostr' }}
        </button>
        <p class="status mono" role="status" aria-live="polite" :class="statusKind">{{ status }}</p>
      </form>
    </div>
    <div class="wrap donate-wrap">
      <Donate />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Donate from './Donate.vue'
import {
  NOSTR_RECIPIENT_HEX,
  NOSTR_RECIPIENT_NPUB,
  NOSTR_RELAYS,
  CONTACT_LIMITS
} from '../data/contact.js'

const name = ref('')
const message = ref('')
const honeypot = ref('')
const sending = ref(false)
const status = ref('// relays: ' + NOSTR_RELAYS.length + ' configured — nothing sent yet')
const statusKind = ref('')
const copied = ref(false)

const COOLDOWN_KEY = 'nostr-contact-last'

async function copyNpub() {
  try {
    await navigator.clipboard.writeText(NOSTR_RECIPIENT_NPUB)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    status.value = '// clipboard blocked — select the npub above and copy manually'
    statusKind.value = 'err'
  }
}

function publishToRelay(url, event, timeoutMs = 9000) {
  return new Promise((resolve) => {
    let ws
    try {
      ws = new WebSocket(url)
    } catch {
      resolve(false)
      return
    }
    const timer = setTimeout(() => {
      try {
        ws.close()
      } catch {}
      resolve(false)
    }, timeoutMs)
    ws.onopen = () => ws.send(JSON.stringify(['EVENT', event]))
    ws.onmessage = (m) => {
      try {
        const d = JSON.parse(m.data)
        if (d[0] === 'OK' && d[1] === event.id) {
          clearTimeout(timer)
          ws.close()
          resolve(d[2] === true)
        }
      } catch {}
    }
    ws.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
  })
}

async function send() {
  statusKind.value = ''
  // honeypot: pretend success, send nothing
  if (honeypot.value) {
    status.value = '// ✓ delivered via 2 relays'
    message.value = ''
    return
  }
  const text = message.value.trim()
  if (text.length < CONTACT_LIMITS.messageMin) {
    status.value = `// message too short (min ${CONTACT_LIMITS.messageMin} chars)`
    statusKind.value = 'err'
    return
  }
  const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
  const wait = CONTACT_LIMITS.cooldownMs - (Date.now() - last)
  if (wait > 0) {
    status.value = `// slow down — try again in ${Math.ceil(wait / 1000)}s`
    statusKind.value = 'err'
    return
  }
  sending.value = true
  status.value = '// generating one-use key… encrypting (nip-04)…'
  try {
    // Lazy-load the Nostr stack only when someone actually sends.
    const [{ generateSecretKey, getPublicKey, finalizeEvent }, { encrypt }] = await Promise.all([
      import('nostr-tools/pure'),
      import('nostr-tools/nip04')
    ])
    const secret = generateSecretKey()
    getPublicKey(secret) // sender pubkey (ephemeral, never displayed)
    const body = (name.value.trim() ? `From ${name.value.trim()} via hdlopesrocha.github.io:\n\n` : 'Via hdlopesrocha.github.io:\n\n') + text
    const content = encrypt(secret, NOSTR_RECIPIENT_HEX, body)
    const event = finalizeEvent(
      {
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', NOSTR_RECIPIENT_HEX]],
        content
      },
      secret
    )
    status.value = `// publishing to ${NOSTR_RELAYS.length} relays…`
    const results = await Promise.all(NOSTR_RELAYS.map((r) => publishToRelay(r, event)))
    const ok = results.filter(Boolean).length
    if (ok > 0) {
      status.value = `// ✓ delivered via ${ok}/${NOSTR_RELAYS.length} relays — sender key discarded`
      statusKind.value = 'ok'
      message.value = ''
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
    } else {
      status.value = '// ✗ no relay accepted it — check connection and retry'
      statusKind.value = 'err'
    }
  } catch {
    status.value = '// ✗ send failed in this browser — dm the npub above from any Nostr client instead'
    statusKind.value = 'err'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
h2 { margin: 0.5rem 0 1rem; font-size: clamp(1.7rem, 3.4vw, 2.5rem); letter-spacing: -0.02em; line-height: 1.1; }
.lede { color: var(--muted); }
.npub-box { padding: 1.1rem 1.2rem; margin-top: 1.2rem; display: grid; gap: 0.7rem; }
.label { margin: 0; color: var(--accent); font-size: 0.76rem; }
.npub { color: var(--text); font-size: 0.78rem; word-break: break-all; user-select: all; }
.muted { color: var(--muted); }
.small { font-size: 0.88rem; }
.form { padding: 1.4rem; display: grid; gap: 1rem; }
.field { display: grid; gap: 0.45rem; }
.field label { font-size: 0.9rem; font-weight: 600; }
.field input, .field textarea {
  background: rgba(5, 7, 13, 0.7);
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  color: var(--text);
  padding: 0.7rem 0.85rem;
  font: inherit;
  font-size: 0.93rem;
  resize: vertical;
}
.field input:focus, .field textarea:focus { border-color: var(--accent); outline: none; }
.count { margin: 0; text-align: right; color: var(--dim); font-size: 0.72rem; }
.hp { position: absolute; left: -9999px; opacity: 0; height: 0; overflow: hidden; }
.status { margin: 0; font-size: 0.8rem; color: var(--dim); min-height: 1.4em; }
.status.ok { color: var(--accent); }
.status.err { color: #f87171; }
.btn:disabled { opacity: 0.65; cursor: wait; transform: none; }
@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
