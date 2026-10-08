<template>
  <footer class="footer">
    <div class="wrap foot-inner">
      <div>
        <p class="mono brand">hdlopesrocha<span class="caret">_</span></p>
        <p class="muted">Graphics · Vulkan · AI · VR — experimental portfolio served from GitHub Pages.</p>
      </div>
      <nav aria-label="Footer">
        <a href="#home">Home</a>
        <a href="#projects">Projects</a>
        <a href="#timeline">Evolution</a>
        <a href="#about">About</a>
        <a href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </nav>
    </div>
    <div class="wrap base mono">
      <span>// built with vue + vite · no backend · base: '/'</span>
      <span>© {{ year }} Hugo Lopes Rocha</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer { border-top: 1px solid var(--line); margin-top: 4rem; padding: 2.5rem 0 1.5rem; background: rgba(9,13,22,0.6); }
.foot-inner { display: flex; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
.brand { margin: 0 0 0.4rem; color: var(--text); }
.caret { color: var(--accent); }
.muted { color: var(--muted); font-size: 0.9rem; margin: 0; max-width: 420px; }
nav { display: flex; gap: 1.2rem; flex-wrap: wrap; align-items: start; }
nav a { color: var(--muted); text-decoration: none; font-size: 0.9rem; }
nav a:hover { color: var(--text); }
.base { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; margin-top: 2rem; padding-top: 1.2rem; border-top: 1px solid var(--line); color: var(--dim); font-size: 0.76rem; }
</style>
