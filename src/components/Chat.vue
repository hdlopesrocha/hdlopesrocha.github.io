<template>
  <div class="glass chat">
    <div class="chat-head">
      <div>
        <p class="mono label">chatting as <span class="dim">(stored only in this browser)</span></p>
        <code class="mono me" :title="meNpub">{{ shortId(meNpub) }}</code>
      </div>
      <div class="head-actions">
        <button class="btn small ghost" type="button" @click="copyMine">{{ mineCopied ? 'Copied ✓' : 'Copy my npub' }}</button>
        <button class="btn small ghost" type="button" @click="refresh" :disabled="refreshing">↻ {{ refreshing ? '…' : 'Check' }}</button>
      </div>
    </div>

    <div ref="msgsEl" class="msgs" role="log" aria-live="polite" aria-label="Conversation with site owner">
      <div v-if="!messages.length" class="empty">
        No messages yet — say hello below. Replies from the site owner appear here automatically while this tab is open.
      </div>
      <div v-for="m in messages" :key="m.id" class="msg" :class="m.dir">
        <p v-if="m.dir === 'in' && m.from" class="mono sender" :class="{ owner: m.from === NOSTR_RECIPIENT_HEX }">
          {{ m.from === NOSTR_RECIPIENT_HEX ? 'owner ✓' : shortNpub(m.from) }}
        </p>
        <p>{{ m.text }}</p>
        <time class="mono" :dateTime="new Date(m.at * 1000).toISOString()">{{ fmtTime(m.at) }}</time>
      </div>
    </div>

    <form class="input-row" @submit.prevent="send">
      <label class="sr-only" for="chat-input">Message to site owner</label>
      <input
        id="chat-input"
        v-model="draft"
        type="text"
        autocomplete="off"
        maxlength="1000"
        placeholder="Type a message… (encrypted end-to-end)"
      />
      <button class="btn primary small" type="submit" :disabled="sending || !draft.trim()">
        {{ sending ? '…' : 'Send' }}
      </button>
    </form>
    <p class="status mono" role="status" :class="statusKind">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  NOSTR_RECIPIENT_HEX,
  NOSTR_SEND_RELAYS,
  NOSTR_READ_RELAYS,
  NOSTR_READ_KINDS,
  CHAT_SECRET_KEY,
  CHAT_HISTORY_KEY,
  CHAT_LASTSEEN_KEY,
  CHAT_SEND_COOLDOWN_MS,
  CHAT_MESSAGE_MAX
} from '../data/contact.js'

const hexToBytes = (h) => Uint8Array.from(h.match(/../g).map((b) => parseInt(b, 16)))
const bytesToHex = (b) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
const randHex = (n) => bytesToHex(crypto.getRandomValues(new Uint8Array(n)))

const messages = ref([])
const draft = ref('')
const sending = ref(false)
const refreshing = ref(false)
const status = ref('// starting…')
const statusKind = ref('')
const meNpub = ref('')
const mineCopied = ref(false)
const msgsEl = ref(null)

let nostr = null // { generateSecretKey, getPublicKey, finalizeEvent, encrypt, decrypt, npubEncode }
let meHex = ''
let mePub = ''
let mounted = false
const sockets = new Map() // url -> { ws, live, retryTimer }
const liveCount = ref(0)

function shortId(npub) {
  return npub ? npub.slice(0, 12) + '…' + npub.slice(-6) : '…'
}
function shortNpub(hex) {
  try {
    const n = nostr.npubEncode(hex)
    return n.slice(0, 12) + '…' + n.slice(-6)
  } catch {
    return String(hex).slice(0, 12) + '…'
  }
}
function fmtTime(ts) {
  return new Date(ts * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function scrollDown() {
  nextTick(() => {
    if (msgsEl.value) msgsEl.value.scrollTop = msgsEl.value.scrollHeight
  })
}
function persist() {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.value.slice(-100)))
  } catch {}
}
function getLastSeen() {
  return Number(localStorage.getItem(CHAT_LASTSEEN_KEY) || 0) || Math.floor(Date.now() / 1000) - 7 * 86400
}
function setLastSeen(ts) {
  try {
    localStorage.setItem(CHAT_LASTSEEN_KEY, String(ts))
  } catch {}
}
function updateStatus() {
  status.value = `// listening on ${liveCount.value}/${NOSTR_READ_RELAYS.length} relays (dm + gift-wrap)`
}

async function copyMine() {
  try {
    await navigator.clipboard.writeText(meNpub.value)
    mineCopied.value = true
    setTimeout(() => (mineCopied.value = false), 2000)
  } catch {}
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

function handleIncoming(url, ev) {
  // Accept replies from any sender (owner may reply from another identity),
  // badged in the UI. NIP-04 DMs + NIP-17 gift wraps supported.
  let sender = ''
  let text = ''
  let at = 0
  const nowSec = Math.floor(Date.now() / 1000)
  try {
    if (ev.kind === 4) {
      sender = ev.pubkey
      text = nostr.decrypt(hexToBytes(meHex), sender, ev.content)
      at = Math.min(ev.created_at, nowSec)
    } else if (ev.kind === 1059) {
      // Gift wraps carry randomized timestamps; the rumor inside holds the real time.
      const rumor = nostr.unwrapEvent(ev, hexToBytes(meHex))
      if (!rumor || rumor.kind !== 14) return
      if (!rumor.tags.some((t) => t[0] === 'p' && t[1] === mePub)) return
      sender = rumor.pubkey
      text = rumor.content
      at = Math.min(rumor.created_at, nowSec)
    } else {
      return
    }
  } catch {
    return
  }
  if (!text || !at) return
  // Self-heal: already-seen ids get their time/sender corrected (e.g. entries
  // stored before rumor-time handling existed), then skip.
  const existing = messages.value.find((m) => m.id === ev.id)
  if (existing) {
    if (existing.at !== at || existing.from !== sender) {
      existing.at = at
      existing.from = sender
      messages.value.sort((a, b) => a.at - b.at)
      persist()
    }
    return
  }
  messages.value.push({ id: ev.id, dir: 'in', text, at, from: sender })
  messages.value.sort((a, b) => a.at - b.at)
  persist()
  if (at > getLastSeen()) setLastSeen(at)
  scrollDown()
}

function connect(url) {
  if (!mounted || sockets.has(url)) return
  const subId = 'chat' + randHex(4)
  const entry = { ws: null, live: false, retryTimer: 0 }
  sockets.set(url, entry)
  let ws
  try {
    ws = new WebSocket(url)
  } catch {
    scheduleRetry(url)
    return
  }
  entry.ws = ws
  ws.onopen = () => {
    if (!mounted) return ws.close()
    // NOTE: kind-4 uses since:lastSeen, but gift wraps (1059) carry NIP-59
    // randomized timestamps (±2 days), so they must be fetched WITHOUT since
    // or recent wraps get excluded by the time filter. Dedupe by id covers overlap.
    ws.send(
      JSON.stringify([
        'REQ',
        subId,
        { kinds: [4], '#p': [mePub], since: getLastSeen(), limit: 50 },
        { kinds: [1059], '#p': [mePub], limit: 50 }
      ])
    )
  }
  ws.onmessage = (m) => {
    let d
    try {
      d = JSON.parse(m.data)
    } catch {
      return
    }
    if (d[0] === 'EVENT' && d[1] === subId && d[2] && NOSTR_READ_KINDS.includes(d[2].kind)) handleIncoming(url, d[2])
    else if (d[0] === 'EOSE' && d[1] === subId && !entry.live) {
      entry.live = true
      liveCount.value++
      updateStatus()
    }
  }
  const dead = () => {
    if (entry.live) {
      entry.live = false
      liveCount.value = Math.max(0, liveCount.value - 1)
      updateStatus()
    }
    sockets.delete(url)
    scheduleRetry(url)
  }
  ws.onclose = dead
  ws.onerror = () => {
    try {
      ws.close()
    } catch {}
  }
}

function scheduleRetry(url) {
  if (!mounted || sockets.has(url)) return
  // Delete the placeholder BEFORE reconnecting: connect() refuses when the
  // url is already in the map, otherwise the retry silently never runs.
  const t = setTimeout(() => {
    sockets.delete(url)
    connect(url)
  }, 25000)
  sockets.set(url, { ws: null, live: false, retryTimer: t })
}

function disconnectAll() {
  for (const [url, e] of sockets) {
    clearTimeout(e.retryTimer)
    try {
      e.ws && e.ws.close()
    } catch {}
    sockets.delete(url)
  }
  liveCount.value = 0
}

async function refresh() {
  if (refreshing.value) return
  refreshing.value = true
  status.value = '// re-checking relays…'
  disconnectAll()
  NOSTR_READ_RELAYS.forEach(connect)
  setTimeout(() => {
    refreshing.value = false
    updateStatus()
  }, 6000)
}

async function send() {
  const text = draft.value.trim()
  if (!text || sending.value) return
  statusKind.value = ''
  const last = Number(localStorage.getItem('nostr-chat-lastsent') || 0)
  const wait = CHAT_SEND_COOLDOWN_MS - (Date.now() - last)
  if (wait > 0) {
    status.value = `// slow down — try again in ${Math.ceil(wait / 1000)}s`
    statusKind.value = 'err'
    return
  }
  sending.value = true
  try {
    const content = nostr.encrypt(hexToBytes(meHex), NOSTR_RECIPIENT_HEX, text)
    const event = nostr.finalizeEvent(
      {
        kind: 4,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', NOSTR_RECIPIENT_HEX]],
        content
      },
      hexToBytes(meHex)
    )
    const results = await Promise.all(NOSTR_SEND_RELAYS.map((r) => publishToRelay(r, event)))
    const ok = results.filter(Boolean).length
    if (ok > 0) {
      messages.value.push({ id: event.id, dir: 'out', text: text.slice(0, CHAT_MESSAGE_MAX), at: event.created_at, from: mePub })
      persist()
      draft.value = ''
      scrollDown()
      try {
        localStorage.setItem('nostr-chat-lastsent', String(Date.now()))
      } catch {}
      status.value = `// ✓ sent via ${ok}/${NOSTR_SEND_RELAYS.length} relays — replies appear above`
      statusKind.value = ''
    } else {
      status.value = '// ✗ no relay accepted it — check connection and retry'
      statusKind.value = 'err'
    }
  } catch {
    status.value = '// ✗ send failed in this browser'
    statusKind.value = 'err'
  } finally {
    sending.value = false
  }
}

function initIdentity() {
  let hex = ''
  try {
    hex = localStorage.getItem(CHAT_SECRET_KEY) || ''
  } catch {}
  if (!/^[0-9a-f]{64}$/i.test(hex)) {
    hex = randHex(32)
    try {
      localStorage.setItem(CHAT_SECRET_KEY, hex)
    } catch {}
  }
  meHex = hex.toLowerCase()
  mePub = nostr.getPublicKey(hexToBytes(meHex))
  meNpub.value = nostr.npubEncode(mePub)
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY)
    messages.value = raw ? JSON.parse(raw) : []
    messages.value.sort((a, b) => a.at - b.at)
  } catch {
    messages.value = []
  }
}

onMounted(async () => {
  mounted = true
  const [pure, nip04, nip19, nip59] = await Promise.all([
    import('nostr-tools/pure'),
    import('nostr-tools/nip04'),
    import('nostr-tools/nip19'),
    import('nostr-tools/nip59')
  ])
  nostr = {
    generateSecretKey: pure.generateSecretKey,
    getPublicKey: pure.getPublicKey,
    finalizeEvent: pure.finalizeEvent,
    encrypt: nip04.encrypt,
    decrypt: nip04.decrypt,
    npubEncode: nip19.npubEncode,
    unwrapEvent: nip59.unwrapEvent
  }
  initIdentity()
  status.value = '// connecting to relays…'
  NOSTR_READ_RELAYS.forEach(connect)
  scrollDown()
  setTimeout(() => {
    if (mounted && liveCount.value === 0) {
      status.value = '// still connecting — messages you send still go through; press ↻ Check'
    }
  }, 12000)
})

onBeforeUnmount(() => {
  mounted = false
  disconnectAll()
})
</script>

<style scoped>
.chat { padding: 1.4rem; display: grid; gap: 1rem; }
.chat-head { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; align-items: end; }
.label { margin: 0 0 0.3rem; color: var(--accent); font-size: 0.76rem; }
.dim { color: var(--dim); }
.me { font-size: 0.82rem; color: var(--text); }
.head-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.msgs {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 340px;
  overflow-y: auto;
  padding: 0.9rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(5, 7, 13, 0.55);
}
.empty { color: var(--dim); font-size: 0.88rem; text-align: center; padding: 1.5rem 1rem; }
.msg { max-width: 82%; padding: 0.55rem 0.8rem; border-radius: 10px; }
.msg p { margin: 0; font-size: 0.92rem; overflow-wrap: anywhere; }
.sender { font-size: 0.68rem !important; opacity: 0.65; margin-bottom: 0.15rem !important; }
.sender.owner { color: var(--accent); opacity: 1; }
.msg time { font-size: 0.68rem; opacity: 0.6; }
.msg.out { align-self: flex-end; background: linear-gradient(135deg, #14b8a6, #0ea5e9); color: #03181a; }
.msg.out time { opacity: 0.7; }
.msg.in { align-self: flex-start; background: rgba(148, 178, 255, 0.1); border: 1px solid var(--line-strong); }
.input-row { display: flex; gap: 0.6rem; }
.input-row input {
  flex: 1;
  min-width: 0;
  background: rgba(5, 7, 13, 0.7);
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  color: var(--text);
  padding: 0.7rem 0.85rem;
  font: inherit;
  font-size: 0.93rem;
}
.input-row input:focus { border-color: var(--accent); outline: none; }
.status { margin: 0; font-size: 0.78rem; color: var(--dim); min-height: 1.4em; }
.status.err { color: #f87171; }
</style>
