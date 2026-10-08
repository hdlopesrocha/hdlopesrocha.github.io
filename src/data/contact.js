// Contact-form Nostr configuration. All values here are public.
// The recipient hex pubkey corresponds to npub1vllnekxk2gqhmahcspn90n95a2plr3ldc2t8jk9r23vlj550lzzqfycvmr
export const NOSTR_RECIPIENT_HEX =
  '67ff3cd8d652017df6f8806657ccb4ea83f1c7edc2967958a35459f9528ff884'
export const NOSTR_RECIPIENT_NPUB =
  'npub1vllnekxk2gqhmahcspn90n95a2plr3ldc2t8jk9r23vlj550lzzqfycvmr'

export const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band'
]

export const CONTACT_LIMITS = {
  nameMax: 80,
  messageMin: 3,
  messageMax: 1000,
  cooldownMs: 5 * 60 * 1000
}

// Chat (replaces the one-shot form): persistent visitor identity in
// localStorage, live NIP-04 thread with the site owner.
// Sends go wide (owner reads anywhere); reads use relays proven to allow
// unauthenticated kind-4 subscriptions (damus/nostr.wine gate them behind a
// broken/absent NIP-42 setup).
export const NOSTR_SEND_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band'
]
export const NOSTR_READ_RELAYS = ['wss://nos.lol', 'wss://relay.snort.social', 'wss://relay.primal.net']
export const NOSTR_READ_KINDS = [4, 1059] // NIP-04 DMs + NIP-17 gift wraps

export const CHAT_SECRET_KEY = 'nostr-chat-secret'
export const CHAT_HISTORY_KEY = 'nostr-chat-history'
export const CHAT_LASTSEEN_KEY = 'nostr-chat-lastseen'
export const CHAT_SEND_COOLDOWN_MS = 20 * 1000
export const CHAT_MESSAGE_MAX = 1000
