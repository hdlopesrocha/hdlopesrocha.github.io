<template>
  <div class="lang-switch" role="group" :aria-label="t('language.label')">
    <button
      v-for="item in LOCALES"
      :key="item.id"
      type="button"
      class="lang-btn mono"
      :class="{ active: locale === item.id }"
      :aria-pressed="locale === item.id ? 'true' : 'false'"
      :aria-label="item.label"
      :title="t('language.switchTo', { language: item.label })"
      :lang="item.htmlLang"
      @click="setLocale(item.id)"
    >
      <img class="flag" :src="item.flag" alt="" aria-hidden="true" width="24" height="16" />
    </button>
  </div>
</template>

<script setup>
import { t, locale, setLocale, LOCALES } from '../i18n'
</script>

<style scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(5, 7, 13, 0.55);
}
.lang-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--muted);
  line-height: 0;
  padding: 0.22rem 0.3rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.lang-btn:hover { background: rgba(148, 178, 255, 0.12); }
.lang-btn.active {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
}
.flag {
  display: block;
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(230, 241, 255, 0.22);
}
.lang-btn:focus-visible { outline-offset: 1px; }
</style>
