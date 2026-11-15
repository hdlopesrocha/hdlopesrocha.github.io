<template>
  <div id="donate" class="glass donate">
    <div class="donate-info">
      <p class="eyebrow mono">{{ t('donate.eyebrow') }}</p>
      <h3>{{ t('donate.title') }}</h3>
      <p class="muted">
        {{ t('donate.intro') }}
      </p>
      <p class="mono addr-row">
        <code class="addr">{{ LIGHTNING_ADDRESS }}</code>
        <button class="btn small ghost" type="button" @click="copyAddr">
          {{ addrCopied ? t('donate.copied') : t('donate.copy') }}
        </button>
      </p>
      <div class="amounts" role="group" :aria-label="t('donate.amountLabel')">
        <button
          v-for="p in DONATE_PRESETS_SATS"
          :key="p"
          type="button"
          class="chip mono"
          :class="{ active: sats === p && !customActive }"
          :aria-pressed="sats === p && !customActive ? 'true' : 'false'"
          @click="pickPreset(p)"
        >
          {{ p.toLocaleString(dateLocale) }}
        </button>
        <label class="custom mono">
          <input
            v-model.number="customSats"
            type="number"
            min="1"
            max="100000"
            step="1"
            inputmode="numeric"
            :aria-label="t('donate.customAmount')"
            :placeholder="t('donate.custom')"
            @input="customActive = true"
          />
          <span>{{ t('donate.sats') }}</span>
        </label>
      </div>
      <div class="field">
        <label for="donate-comment">{{ t('donate.comment') }} <span class="muted">{{ t('donate.commentHint') }}</span></label>
        <input
          id="donate-comment"
          v-model="comment"
          type="text"
          maxlength="200"
          :placeholder="t('donate.commentPlaceholder')"
        />
      </div>
      <button class="btn primary" type="button" :disabled="loading" @click="generate">
        {{ loading ? t('donate.talkingToWallet') : t('donate.generate', { amount: displaySats.toLocaleString(dateLocale) }) }}
      </button>
      <p class="status mono" role="status" aria-live="polite" :class="statusKind">{{ statusText }}</p>
    </div>

    <div v-if="invoice" class="invoice">
      <canvas ref="qrCanvas" width="220" height="220" :aria-label="t('donate.qrLabel')"></canvas>
      <code class="mono bolt11">{{ invoice }}</code>
      <div class="inv-actions">
        <button class="btn small" type="button" @click="copyInvoice">{{ invCopied ? t('donate.copied') : t('donate.copyInvoice') }}</button>
        <a class="btn small primary" :href="`lightning:${invoice}`">{{ t('donate.openWallet') }}</a>
      </div>
      <p class="muted small">{{ t('donate.expires') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { LIGHTNING_ADDRESS, LNURLP_ENDPOINT, DONATE_PRESETS_SATS, DONATE_DEFAULT_SATS } from '../data/donate.js'
import { t, dateLocale } from '../i18n'

const sats = ref(DONATE_DEFAULT_SATS)
const customSats = ref('')
const customActive = ref(false)
const comment = ref('')
const invoice = ref('')
const loading = ref(false)
const statusKey = ref('donate.status.idle')
const statusVars = ref({})
const statusText = computed(() => t(statusKey.value, statusVars.value))
const statusKind = ref('')
const addrCopied = ref(false)
const invCopied = ref(false)
const qrCanvas = ref(null)

const displaySats = computed(() => {
  if (customActive.value && Number.isFinite(customSats.value) && customSats.value > 0) {
    return Math.floor(customSats.value)
  }
  return sats.value
})

function pickPreset(p) {
  sats.value = p
  customSats.value = ''
  customActive.value = false
}

async function copyText(text, flag) {
  try {
    await navigator.clipboard.writeText(text)
    flag.value = true
    setTimeout(() => (flag.value = false), 2000)
    return true
  } catch {
    return false
  }
}
function copyAddr() {
  copyText(LIGHTNING_ADDRESS, addrCopied)
}
function copyInvoice() {
  copyText(invoice.value, invCopied)
}

async function generate() {
  statusKind.value = ''
  const amountSats = displaySats.value
  if (!Number.isFinite(amountSats) || amountSats < 1) {
    statusKey.value = 'donate.status.min'
    statusKind.value = 'err'
    return
  }
  loading.value = true
  invoice.value = ''
  statusKey.value = 'donate.status.fetching'
  statusKind.value = ''
  try {
    const paramsRes = await fetch(LNURLP_ENDPOINT)
    if (!paramsRes.ok) throw new Error('lnurl params failed')
    const params = await paramsRes.json()
    if (params.tag !== 'payRequest' || !params.callback) throw new Error('not payable')
    const msats = amountSats * 1000
    if (msats < params.minSendable || msats > params.maxSendable) {
      statusKey.value = 'donate.status.range'
      statusVars.value = {
        min: Math.ceil(params.minSendable / 1000),
        max: Math.floor(params.maxSendable / 1000)
      }
      statusKind.value = 'err'
      return
    }
    statusKey.value = 'donate.status.generating'
    const cbUrl = new URL(params.callback)
    cbUrl.searchParams.set('amount', String(msats))
    const c = comment.value.trim().slice(0, 200)
    if (c && params.commentAllowed) cbUrl.searchParams.set('comment', c)
    const invRes = await fetch(cbUrl.toString())
    if (!invRes.ok) throw new Error('invoice failed')
    const inv = await invRes.json()
    if (!inv.pr || !inv.pr.toLowerCase().startsWith('lnbc')) throw new Error('bad invoice')
    invoice.value = inv.pr
    statusKey.value = 'donate.status.ready'
    statusVars.value = { amount: amountSats.toLocaleString(dateLocale.value) }
    await nextTick()
    // Lazy-load QR rendering only when an invoice exists.
    const { default: QRCode } = await import('qrcode')
    await QRCode.toCanvas(qrCanvas.value, inv.pr, {
      width: 220,
      margin: 1,
      color: { dark: '#04181a', light: '#ffffff' }
    })
  } catch {
    statusKey.value = 'donate.status.unreachable'
    statusKind.value = 'err'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.donate {
  margin-top: 2rem;
  scroll-margin-top: 84px;
  padding: 1.6rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
h3 { margin: 0.4rem 0 0.6rem; font-size: 1.4rem; letter-spacing: -0.01em; }
.muted { color: var(--muted); }
.small { font-size: 0.84rem; }
.addr-row { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
.addr { font-size: 0.85rem; color: var(--accent); user-select: all; }
.amounts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; align-items: center; }
.chip {
  background: transparent;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
}
.chip:hover { color: var(--text); border-color: var(--accent); }
.chip.active { background: rgba(251,191,36,0.12); border-color: var(--warn); color: var(--text); }
.custom { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--dim); font-size: 0.8rem; }
.custom input {
  width: 7rem;
  background: rgba(5,7,13,0.7);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--text);
  padding: 0.4rem 0.8rem;
  font: inherit;
}
.field { display: grid; gap: 0.45rem; margin-bottom: 1rem; }
.field label { font-size: 0.9rem; font-weight: 600; }
.field input {
  background: rgba(5,7,13,0.7);
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  color: var(--text);
  padding: 0.7rem 0.85rem;
  font: inherit;
  font-size: 0.93rem;
}
.field input:focus, .custom input:focus { border-color: var(--warn); outline: none; }
.status { margin: 0.8rem 0 0; font-size: 0.8rem; color: var(--dim); min-height: 1.4em; }
.status.err { color: #f87171; }
.invoice { display: grid; gap: 0.9rem; justify-items: center; text-align: center; }
.invoice canvas { border-radius: 12px; border: 1px solid var(--line-strong); background: #fff; }
.bolt11 {
  font-size: 0.7rem;
  color: var(--muted);
  word-break: break-all;
  max-height: 5.5em;
  overflow: hidden;
  user-select: all;
}
.inv-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
.btn:disabled { opacity: 0.65; cursor: wait; transform: none; }
@media (max-width: 860px) {
  .donate { grid-template-columns: 1fr; }
}
</style>
