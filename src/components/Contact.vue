<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="wrap contact-grid">
      <div>
        <p class="eyebrow mono soft-shade">{{ t('contact.eyebrow') }}</p>
        <h2 id="contact-title" class="soft-shade">{{ t('contact.title') }}</h2>
        <p class="lede soft-shade">
          {{ t('contact.ledeBefore') }}<strong>{{ t('contact.ledeStrong') }}</strong>{{ t('contact.ledeAfter') }}
        </p>
        <div class="glass npub-box">
          <p class="mono label">{{ t('contact.npubLabel') }}</p>
          <code class="mono npub">{{ NOSTR_RECIPIENT_NPUB }}</code>
          <button class="btn small ghost" type="button" @click="copyNpub">
            {{ copied ? t('contact.copied') : t('contact.copyNpub') }}
          </button>
        </div>
        <SectionVisual variant="contact" class="contact-art" />
      </div>

      <Chat />
    </div>
    <div class="wrap vcard-wrap">
      <VCard />
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
import SectionVisual from './SectionVisual.vue'
import VCard from './VCard.vue'
import { NOSTR_RECIPIENT_NPUB } from '../data/contact.js'
import { t } from '../i18n'

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
.contact-art { margin-top: 1.2rem; }
.label { margin: 0; color: var(--accent); font-size: 0.76rem; }
.npub { color: var(--text); font-size: 0.78rem; word-break: break-all; user-select: all; }
.muted { color: var(--muted); }
.small { font-size: 0.88rem; }
@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
