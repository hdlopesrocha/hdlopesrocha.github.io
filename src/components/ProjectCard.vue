<template>
  <article class="card glass" :class="{ featured: project.featured, primary: project.primary }">
    <ProjectVisual :visual="project.visual" />
    <div class="body">
      <div class="top">
        <span class="cat tag" :class="categoryClass">{{ categoryLabel }}</span>
        <span v-if="project.featured" class="feat tag mono">★ {{ t('card.featured') }}</span>
        <span v-if="created" class="year mono" :title="dateTitle">{{ created.slice(0, 4) }}</span>
      </div>
      <h3>
        <a :href="project.url" target="_blank" rel="noopener noreferrer">{{ projectName }}</a>
      </h3>
      <p class="desc">{{ description }}</p>
      <ul class="tech" :aria-label="t('card.technologies')">
        <li v-for="tech in visibleTech" :key="tech" class="tag">{{ tech }}</li>
        <li v-if="project.technologies.length > maxTech" class="tag more">+{{ project.technologies.length - maxTech }}</li>
      </ul>
      <div class="meta mono">
        <span v-if="stat" :title="t('card.stars')">★ {{ stat.stars }}</span>
        <span v-if="stat" :title="t('card.forks')">⑂ {{ stat.forks }}</span>
        <span v-if="stat && stat.language">{{ stat.language }}</span>
        <span v-if="updated" :title="stat ? t('card.updatedLive') : t('card.updatedCached')">{{ t('card.updatedShort') }} {{ formatUpdated(updated) }}</span>
      </div>
      <div class="actions">
        <a class="btn small primary" :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="t('card.openGithub', { name: projectName })">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          {{ t('card.github') }}
        </a>
        <a
          v-if="project.pages"
          class="btn small ghost"
          :href="project.pages"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('card.openSite', { name: projectName })"
          :title="t('card.liveSite')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M1.5 8h13M8 1.5c-4.5 4.5-4.5 8.5 0 13M8 1.5c4.5 4.5 4.5 8.5 0 13"/></svg>
          {{ t('card.live') }}
        </a>
        <a
          v-if="project.video"
          class="btn small ghost"
          :href="project.video"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('card.watchDemo', { name: projectName })"
          :title="t('card.demoVideo')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.5 3.5v9l7-4.5z"/></svg>
          {{ t('card.demo') }}
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
import { t, localize } from '../i18n'

const props = defineProps({
  project: { type: Object, required: true },
  stat: { type: Object, default: null },
  maxTech: { type: Number, default: 6 }
})

const projectName = computed(() => localize(props.project.name))
const description = computed(() => localize(props.project.description))
const categoryLabel = computed(() => localize(CATEGORIES[props.project.category]?.label ?? props.project.category))
const categoryClass = computed(() => CATEGORIES[props.project.category]?.class ?? '')
const visibleTech = computed(() => props.project.technologies.slice(0, props.maxTech))
// Local date stamps keep every card dated even if the GitHub API is rate-limited.
const created = computed(() => props.project.created ?? null)
const updated = computed(() => props.stat?.updated || props.project.updated || null)
const dateTitle = computed(() => {
  if (!created.value) return ''
  const lastPush = updated.value
    ? t('card.lastPush', { date: updated.value.slice(0, 10) })
    : ''
  return t('card.created', { date: created.value }) + lastPush
})
</script>

<style scoped>
.card {
  --blur-opacity: 0.86;
  --blur-radius: 28px;
  --blur-saturation: 1.08;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 0;
}
.card:hover, .card:focus-within {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent),
    0 0 34px color-mix(in srgb, var(--accent) 8%, transparent);
}
.card.featured {
  --blur-opacity: 0.74;
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
}
.card.primary {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 8%, transparent), rgba(5, 7, 13, var(--blur-opacity, 0.74)));
}
.body { padding: 1.1rem 1.15rem 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; flex: 1; }
.top { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.feat { border-color: color-mix(in srgb, var(--accent) 60%, transparent); color: #04211d; background: var(--accent-bright); font-weight: 700; }
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
