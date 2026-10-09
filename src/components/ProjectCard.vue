<template>
  <article class="card glass" :class="{ featured: project.featured, primary: project.primary }">
    <ProjectVisual :visual="project.visual" />
    <div class="body">
      <div class="top">
        <span class="cat tag" :class="categoryClass">{{ categoryLabel }}</span>
        <span v-if="project.featured" class="feat tag mono">★ featured</span>
        <span v-if="project.year" class="year mono">{{ project.year }}</span>
      </div>
      <h3>
        <a :href="project.url" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
      </h3>
      <p class="desc">{{ project.description }}</p>
      <ul class="tech" aria-label="Technologies">
        <li v-for="t in visibleTech" :key="t" class="tag">{{ t }}</li>
        <li v-if="project.technologies.length > maxTech" class="tag more">+{{ project.technologies.length - maxTech }}</li>
      </ul>
      <div class="meta mono" v-if="stat">
        <span title="Stars">★ {{ stat.stars }}</span>
        <span title="Forks">⑂ {{ stat.forks }}</span>
        <span v-if="stat.language">{{ stat.language }}</span>
        <span v-if="stat.updated">upd {{ formatUpdated(stat.updated) }}</span>
      </div>
      <div class="actions">
        <a class="btn small primary" :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="`Open ${project.name} on GitHub`">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          GitHub
        </a>
        <a
          v-if="project.pages"
          class="btn small ghost"
          :href="project.pages"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Open ${project.name} live site`"
          title="Live site (GitHub Pages)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13M8 1.5c-4.5 4.5-4.5 8.5 0 13M8 1.5c4.5 4.5 4.5 8.5 0 13"/></svg>
          Live
        </a>
        <span class="repo mono">{{ project.repo }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import ProjectVisual from './ProjectVisual.vue'
import { CATEGORIES } from '../data/projects.js'
import { formatUpdated } from '../composables/useGithubStats.js'

const props = defineProps({
  project: { type: Object, required: true },
  stat: { type: Object, default: null },
  maxTech: { type: Number, default: 6 }
})

const categoryLabel = computed(() => CATEGORIES[props.project.category]?.label ?? props.project.category)
const categoryClass = computed(() => CATEGORIES[props.project.category]?.class ?? '')
const visibleTech = computed(() => props.project.technologies.slice(0, props.maxTech))
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 0;
}
.card:hover, .card:focus-within {
  transform: translateY(-4px);
  border-color: rgba(45, 212, 191, 0.45);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(45,212,191,0.15), 0 0 34px rgba(45,212,191,0.08);
}
.card.featured { border-color: rgba(45, 212, 191, 0.35); }
.card.primary {
  border-color: rgba(45, 212, 191, 0.55);
  background: linear-gradient(180deg, rgba(20,184,166,0.10), rgba(13,19,32,0.85));
}
.body { padding: 1.1rem 1.15rem 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; flex: 1; }
.top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.feat { border-color: rgba(45,212,191,0.6); color: #04211d; background: var(--accent); font-weight: 700; }
.year { margin-left: auto; color: var(--dim); font-size: 0.75rem; }
h3 { margin: 0; font-size: 1.15rem; letter-spacing: -0.01em; }
h3 a { text-decoration: none; }
h3 a:hover { color: var(--accent); }
.desc { margin: 0; color: var(--muted); font-size: 0.93rem; }
.tech { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0; padding: 0; }
.more { opacity: 0.7; }
.meta { display: flex; flex-wrap: wrap; gap: 0.9rem; font-size: 0.76rem; color: var(--dim); }
.actions { display: flex; align-items: center; gap: 0.8rem; margin-top: auto; padding-top: 0.4rem; }
.repo { color: var(--dim); font-size: 0.76rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
