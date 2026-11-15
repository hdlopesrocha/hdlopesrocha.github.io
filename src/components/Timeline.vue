<template>
  <section id="timeline" class="section" aria-labelledby="timeline-title">
    <div class="wrap">
      <div class="section-head split">
        <div class="section-head-copy">
          <p class="eyebrow mono soft-shade">{{ t('timeline.eyebrow') }}</p>
          <h2 id="timeline-title" class="soft-shade">{{ t('timeline.title') }}</h2>
          <p class="soft-shade">{{ t('timeline.intro') }}</p>
        </div>
        <SectionVisual variant="timeline" class="section-art" />
      </div>

      <ol class="chain">
        <li v-for="(step, i) in evolutionChain" :key="step.repo" class="node glass">
          <span class="idx mono" aria-hidden="true">0{{ i + 1 }}</span>
          <div>
            <a :href="projectByRepo(step.repo)?.url" target="_blank" rel="noopener noreferrer" class="mono repo-link">{{ step.repo }}</a>
            <p>{{ localize(step.note) }}</p>
          </div>
          <span v-if="i < evolutionChain.length - 1" class="arrow" aria-hidden="true">→</span>
        </li>
      </ol>

      <div class="parallel glass">
        <p class="mono parallel-title">{{ t('timeline.parallel') }}</p>
        <ul>
          <li v-for="repo in parallelRepos" :key="repo">
            <a :href="`https://github.com/hdlopesrocha/${repo}`" target="_blank" rel="noopener noreferrer" class="mono">{{ repo }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionVisual from './SectionVisual.vue'
import { evolutionChain, projectByRepo } from '../data/projects.js'
import { t, localize } from '../i18n'

const parallelRepos = ['web-gource', 'open-studio', 'vrMusic', 'music-ai', 'sdf-smoke', 'lora-control', 'card-generator', 'opencode-talk']
</script>

<style scoped>
.chain {
  list-style: none;
  margin: 0 0 1.2rem;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
}
.node {
  position: relative;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.idx { color: var(--accent); font-size: 0.8rem; }
.repo-link { color: var(--text); font-size: 0.92rem; text-decoration: none; border-bottom: 1px dashed color-mix(in srgb, var(--accent) 40%, transparent); }
.repo-link:hover { color: var(--accent); }
.node p { margin: 0.3rem 0 0; color: var(--muted); font-size: 0.86rem; }
.arrow {
  position: absolute;
  right: -1.05rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  z-index: 2;
  font-weight: 700;
}
.parallel { padding: 1.1rem 1.3rem; }
.parallel-title { margin: 0 0 0.6rem; color: var(--accent); font-size: 0.8rem; }
.parallel ul {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-wrap: wrap; gap: 0.5rem 1.2rem;
}
.parallel a { color: var(--muted); text-decoration: none; font-size: 0.86rem; }
.parallel a:hover { color: var(--text); }
@media (max-width: 900px) {
  .chain { grid-template-columns: repeat(2, 1fr); }
  .arrow { display: none; }
}
@media (max-width: 520px) {
  .chain { grid-template-columns: 1fr; }
}
</style>
