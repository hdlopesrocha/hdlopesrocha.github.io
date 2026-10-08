<template>
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow mono">~/about — developer profile</p>
        <h2 id="about-title">Graphics enthusiast, engine tinkerer</h2>
        <p class="lede">
          I build experimental software around real-time rendering, GPU programming and
          creative computing — from Vulkan engines and SDF ray marching to AI tooling,
          VR music and small hardware controllers.
        </p>
        <p class="muted">
          This site curates public repositories as a working notebook: each project is an
          iteration on rendering, interaction or generation. No employment claims here —
          just code, pixels and signal.
        </p>
        <div class="actions">
          <a class="btn primary" href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer">GitHub profile</a>
          <a class="btn" href="#projects">Browse the code</a>
        </div>
      </div>
      <div class="glass interests grid-overlay">
        <p class="mono interests-title">$ interests --list</p>
        <ul>
          <li v-for="i in interests" :key="i">{{ i }}</li>
        </ul>
        <p class="mono stack">c++ · vulkan · glsl · compute · vue · webaudio · lora</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const interests = [
  'C++ & Vulkan',
  'Real-time rendering',
  'GPU programming',
  'Signed Distance Fields',
  'Procedural generation',
  'AI tooling & agents',
  'Virtual Reality',
  'Web development',
  'Experimental software'
]
</script>

<style scoped>
.about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2.5rem; align-items: start; }
h2 { margin: 0.5rem 0 1rem; font-size: clamp(1.7rem, 3.4vw, 2.5rem); letter-spacing: -0.02em; line-height: 1.1; }
.lede { color: var(--text); font-size: 1.04rem; }
.muted { color: var(--muted); }
.actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.5rem; }
.interests { padding: 1.4rem 1.5rem; }
.interests-title { color: var(--accent); font-size: 0.82rem; margin: 0 0 0.8rem; }
.interests ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.interests li {
  padding-left: 1.3rem;
  position: relative;
  color: #c3d0e6;
  font-size: 0.93rem;
}
.interests li::before { content: "▸"; position: absolute; left: 0; color: var(--accent); }
.stack { color: var(--dim); font-size: 0.78rem; margin: 1rem 0 0; }
@media (max-width: 860px) {
  .about-grid { grid-template-columns: 1fr; }
}
</style>
