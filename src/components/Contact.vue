<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow mono">~/contact — direct line</p>
        <h2 id="contact-title">Chat over Nostr</h2>
        <p class="lede">
          This is a live, <strong>end-to-end encrypted</strong> chat (NIP-04 DMs) running
          straight from your browser to my relays — no account, no backend, no middleman.
          Your chat identity is generated locally and kept only in this browser's storage.
          Replies from the site owner appear in the thread automatically.
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

      <Chat />
    </div>
    <div class="wrap donate-wrap">
      <Donate />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Chat from './Chat.vue'
import Donate from './Donate.vue'
import { NOSTR_RECIPIENT_NPUB } from '../data/contact.js'

const copied = ref(false)

async function copyNpub() {
  try {
    await navigator.clipboard.writeText(NOSTR_RECIPIENT_NPUB)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<style scoped>
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
h2 { margin: 0.5rem 0 1rem; font-size: clamp(1.7rem, 3.4vw, 2.5rem); letter-spacing: -0.02em; line-height: 1.1; }
.lede { color: var(--muted); }
.npub-box { padding: 1.1rem 1.2rem; margin-top: 1.2rem; display: grid; gap: 0.7rem; justify-items: start; }
.label { margin: 0; color: var(--accent); font-size: 0.76rem; }
.npub { color: var(--text); font-size: 0.78rem; word-break: break-all; user-select: all; }
.muted { color: var(--muted); }
.small { font-size: 0.88rem; }
@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
