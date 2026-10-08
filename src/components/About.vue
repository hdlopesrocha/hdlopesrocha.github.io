<template>
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow mono">~/about — {{ RESUME.fullName }}</p>
        <h2 id="about-title">{{ RESUME.title }}</h2>
        <p class="lede">
          MSc in Telecommunications and Informatics Engineering (IST Lisbon).
          Previously building recruitment, planning and warehouse software at
          <strong>CERN</strong>, full-stack and mobile work at Bullray-CIT, and
          real-time video-chat research at IST/INESC. Nowadays focused on Vulkan
          engines, SDF rendering, AI tooling, VR music and creative computing.
        </p>
        <dl class="facts mono">
          <div><dt>based in</dt><dd>{{ RESUME.location }}</dd></div>
          <div><dt>email</dt><dd><a :href="`mailto:${RESUME.email}`">{{ RESUME.email }}</a></dd></div>
          <div><dt>phone</dt><dd><a :href="RESUME.phoneHref">{{ RESUME.phone }}</a></dd></div>
          <div><dt>languages</dt><dd>portuguese · english · french</dd></div>
          <div><dt>video</dt><dd><a :href="RESUME.youtube" target="_blank" rel="noopener noreferrer">youtube/hdlopesrocha ↗</a></dd></div>
        </dl>
        <p class="muted">Off-screen: {{ interests }}</p>
        <div class="actions">
          <a class="btn primary" :href="RESUME.cvEn" target="_blank" rel="noopener noreferrer">CV · English (PDF)</a>
          <a class="btn" href="#resume">Full résumé</a>
          <a class="btn ghost" href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <div class="glass interests grid-overlay">
        <p class="mono interests-title">$ interests --list</p>
        <ul>
          <li v-for="i in interestsList" :key="i">{{ i }}</li>
        </ul>
        <p class="mono stack">c++ · vulkan · glsl · compute · vue · webaudio · lora</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RESUME, interests } from '../data/resume.js'

const interestsList = [
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
h2 { margin: 0.5rem 0 1rem; font-size: clamp(1.5rem, 3vw, 2.1rem); letter-spacing: -0.02em; line-height: 1.15; }
.lede { font-size: 1.02rem; }
.lede strong { color: var(--accent); }
.facts { display: grid; gap: 0.35rem; margin: 1.2rem 0; font-size: 0.82rem; }
.facts div { display: flex; gap: 0.8rem; }
.facts dt { color: var(--accent); min-width: 5.5rem; }
.facts dd { margin: 0; color: var(--muted); overflow-wrap: anywhere; }
.facts a { color: var(--text); }
.muted { color: var(--muted); }
.actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.5rem; }
.interests { padding: 1.4rem 1.5rem; }
.interests-title { color: var(--accent); font-size: 0.82rem; margin: 0 0 0.8rem; }
.interests ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; }
.interests li { padding-left: 1.3rem; position: relative; color: #c3d0e6; font-size: 0.93rem; }
.interests li::before { content: "▸"; position: absolute; left: 0; color: var(--accent); }
.stack { color: var(--dim); font-size: 0.78rem; margin: 1rem 0 0; }
@media (max-width: 860px) {
  .about-grid { grid-template-columns: 1fr; }
}
</style>
