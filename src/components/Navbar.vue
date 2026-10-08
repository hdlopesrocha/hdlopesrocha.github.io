<template>
  <header class="nav" :class="{ scrolled }">
    <div class="wrap nav-inner">
      <a href="#home" class="brand" aria-label="Henrique Lopes Rocha — home">
        <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="12" fill="#0b1220" />
          <circle cx="32" cy="32" r="15.5" fill="none" stroke="#155e63" stroke-width="2" />
          <circle cx="32" cy="32" r="10" fill="none" stroke="#2dd4bf" stroke-width="2.4" />
          <path d="M24 22v20M40 22v20M24 32h16" stroke="#e6f1ff" stroke-width="3.4" stroke-linecap="round" fill="none" />
        </svg>
        <span class="brand-text mono">hdlopesrocha<span class="caret">_</span></span>
      </a>

      <nav class="links" aria-label="Primary">
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#timeline">Evolution</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a
          href="https://github.com/hdlopesrocha"
          target="_blank"
          rel="noopener noreferrer"
          class="gh-link"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
          GitHub
        </a>
      </nav>

      <button
        class="menu-btn"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        @click="open = !open"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
    <div v-if="open" id="mobile-menu" class="mobile wrap">
      <a href="#home" @click="open = false">Home</a>
      <a href="#projects" @click="open = false">Projects</a>
      <a href="#timeline" @click="open = false">Evolution</a>
      <a href="#about" @click="open = false">About</a>
      <a href="#contact" @click="open = false">Contact</a>
      <a href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer" @click="open = false">GitHub ↗</a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const open = ref(false)
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 12
  if (window.innerWidth > 820) open.value = false
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid transparent;
  background: rgba(5, 7, 13, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.nav.scrolled { border-bottom-color: var(--line); }
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;
}
.brand { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; }
.brand-text { font-size: 0.95rem; color: var(--text); }
.caret { color: var(--accent); animation: blink 1.6s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.links { display: flex; align-items: center; gap: 1.4rem; }
.links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
}
.links a:hover { color: var(--text); }
.gh-link {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border: 1px solid var(--line-strong);
  padding: 0.4rem 0.8rem; border-radius: 7px;
  color: var(--text) !important;
}
.menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  padding: 0.6rem;
  cursor: pointer;
}
.menu-btn span { display: block; width: 20px; height: 2px; background: var(--text); }
.mobile {
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
}
.mobile a {
  padding: 0.7rem 0.2rem;
  border-top: 1px solid var(--line);
  text-decoration: none;
  color: var(--text);
}
@media (max-width: 820px) {
  .links { display: none; }
  .menu-btn { display: flex; }
}
</style>
