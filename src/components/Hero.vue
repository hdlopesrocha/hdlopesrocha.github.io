<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <HeroBackground />
    <div class="hero-fade" aria-hidden="true"></div>
    <div class="wrap hero-inner">
      <p class="eyebrow mono"><span class="dot" aria-hidden="true"></span> real-time · gpu · procedural · experimental</p>
      <div class="title-row">
        <img
          class="avatar"
          src="https://avatars.githubusercontent.com/u/6792581?v=4&s=192"
          alt="Portrait avatar of Henrique Lopes Rocha"
          width="96"
          height="96"
          loading="eager"
          @error="avatarGone = true"
          v-if="!avatarGone"
        />
        <h1 id="hero-title">Henrique Lopes Rocha</h1>
      </div>
      <p class="subtitle">Telecommunications &amp; Informatics Engineer · ex-CERN · Vulkan · AI · VR</p>
      <p class="lede">
        A collection of projects exploring real-time graphics, GPU programming, signed
        distance fields, procedural generation, AI, virtual reality and experimental software.
      </p>
      <div class="actions">
        <a class="btn primary" href="https://github.com/hdlopesrocha" target="_blank" rel="noopener noreferrer" aria-label="Visit Henrique Lopes Rocha on GitHub">
          <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          GitHub
        </a>
        <a class="btn" href="#projects">View projects</a>
        <a class="btn ghost" href="https://github.com/hdlopesrocha/cv/blob/master/cv.pdf" target="_blank" rel="noopener noreferrer">CV (PDF)</a>
        <a class="btn ghost" href="#contact">Contact</a>
      </div>
      <dl class="hero-meta mono">
        <div><dt>focus</dt><dd>vulkan · sdf · ray-marching · compute</dd></div>
        <div><dt>also</dt><dd>ai agents · vr · web · procedural audio</dd></div>
        <div><dt>repos</dt><dd>10 curated experiments ↓</dd></div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import HeroBackground from './HeroBackground.vue'

const avatarGone = ref(false)
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 6.5rem 0 4.5rem;
  border-bottom: 1px solid var(--line);
  min-height: 88vh;
  display: flex;
  align-items: center;
}
.hero-fade {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(5,7,13,0.25), rgba(5,7,13,0) 35%, rgba(5,7,13,0.55) 100%);
}
.hero-inner { position: relative; }
.eyebrow { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 1rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px var(--accent); }
.title-row { display: flex; align-items: center; gap: 1.4rem; }
.avatar {
  width: 96px;
  height: 96px;
  flex: none;
  border-radius: 50%;
  border: 2px solid rgba(45, 212, 191, 0.55);
  box-shadow: 0 0 34px rgba(45, 212, 191, 0.22);
  background: var(--panel-solid);
}
h1 {
  margin: 0;
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  text-shadow: 0 0 40px rgba(45,212,191,0.18);
}
.subtitle {
  margin: 0.9rem 0 0;
  font-size: clamp(1rem, 2.4vw, 1.3rem);
  color: var(--accent);
  font-family: var(--font-mono);
}
.lede { max-width: 640px; color: var(--muted); font-size: 1.06rem; }
.actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.8rem; }
.hero-meta {
  display: flex; flex-wrap: wrap; gap: 1.5rem 2.5rem;
  margin: 2.6rem 0 0; padding: 1.1rem 1.3rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(9, 13, 22, 0.6);
  font-size: 0.8rem;
}
.hero-meta div { display: flex; gap: 0.7rem; margin: 0; }
.hero-meta dt { color: var(--accent); }
.hero-meta dd { margin: 0; color: var(--muted); }
@media (max-width: 600px) {
  .hero { padding: 4.5rem 0 3rem; min-height: unset; }
  .title-row { gap: 1rem; }
  .avatar { width: 64px; height: 64px; }
}
</style>
