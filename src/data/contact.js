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
