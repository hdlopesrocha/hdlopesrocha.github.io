import { computed, ref, watchEffect } from 'vue'
import en from './en.js'
import pt from './pt.js'

// Tiny dependency-free i18n layer. Content stays in src/data with { en, pt }
// objects and is resolved through localize(); UI labels live in the message
// dictionaries and are resolved through t(). The URL hash (#en / #pt) can
// force a locale and stays in sync with the language switch.
const STORAGE_KEY = 'hdlopesrocha.locale'
const SUPPORTED = ['en', 'pt']
const DICTS = { en, pt }

export const LOCALES = [
  { id: 'en', label: 'English', flag: '/flags/gb.svg', htmlLang: 'en' },
  { id: 'pt', label: 'Português (Portugal)', flag: '/flags/pt.svg', htmlLang: 'pt-PT' }
]

function localeFromHash() {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '').toLowerCase()
  return SUPPORTED.includes(hash) ? hash : null
}

function rememberLocale(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* non-fatal: the switch still works for this session */
  }
}

function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED.includes(saved)) return saved
  } catch {
    /* storage can be unavailable in private modes */
  }
  try {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
    if (languages.some((lang) => typeof lang === 'string' && /^pt(-|$)/i.test(lang))) return 'pt'
  } catch {
    /* no navigator (e.g. tests) */
  }
  return 'en'
}

// A language hash (`/#pt` or `/#en`) wins over storage and browser language.
const initialHashLocale = localeFromHash()

export const locale = ref(initialHashLocale ?? detectLocale())
if (initialHashLocale) rememberLocale(initialHashLocale)

export const localeInfo = computed(
  () => LOCALES.find((item) => item.id === locale.value) ?? LOCALES[0]
)
export const dateLocale = computed(() => (locale.value === 'pt' ? 'pt-PT' : 'en-GB'))

function updateLocaleHash(id) {
  if (typeof window === 'undefined') return
  const hash = `#${id}`
  if (window.location.hash === hash) return
  const url = `${window.location.pathname}${window.location.search}${hash}`
  try {
    // Keep the current scroll position: replaceState does not jump to an anchor.
    window.history.replaceState(null, '', url)
  } catch {
    window.location.hash = hash
  }
}

export function setLocale(id, { updateHash = true } = {}) {
  if (!SUPPORTED.includes(id)) return
  locale.value = id
  rememberLocale(id)
  if (updateHash) updateLocaleHash(id)
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const fromHash = localeFromHash()
    if (fromHash) setLocale(fromHash, { updateHash: false })
  })
}

function read(dict, key) {
  let node = dict
  for (const part of key.split('.')) {
    if (node == null || typeof node !== 'object' || !(part in node)) return undefined
    node = node[part]
  }
  return node
}

export function t(key, vars) {
  let value = read(DICTS[locale.value], key)
  if (value === undefined) value = read(en, key)
  if (value === undefined) return key
  if (typeof value === 'function') return value(vars)
  if (typeof value === 'string' && vars) {
    return value.replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] === undefined ? `{${name}}` : String(vars[name])
    )
  }
  return value
}

export function localize(text) {
  if (text == null) return ''
  if (typeof text === 'string') return text
  return text[locale.value] ?? text.en ?? ''
}

function setMeta(selector, value) {
  if (typeof document === 'undefined') return
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute('content', value)
}

if (typeof document !== 'undefined') {
  watchEffect(() => {
    document.documentElement.lang = localeInfo.value.htmlLang
    document.title = t('meta.title')
    setMeta('meta[name="description"]', t('meta.description'))
    setMeta('meta[property="og:title"]', t('meta.title'))
    setMeta('meta[property="og:description"]', t('meta.description'))
    setMeta('meta[name="twitter:title"]', t('meta.title'))
    setMeta('meta[name="twitter:description"]', t('meta.description'))
  })
}
