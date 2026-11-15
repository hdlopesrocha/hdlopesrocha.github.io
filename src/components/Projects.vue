<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow mono soft-shade">{{ t('projects.eyebrow', { count: projects.length }) }}</p>
        <h2 id="projects-title" class="soft-shade">{{ t('projects.title') }}</h2>
      </div>

      <div class="filters" role="group" :aria-label="t('projects.filterLabel')">
        <button
          v-for="f in filters"
          :key="f.id"
          class="chip mono blur-surface"
          :class="{ active: activeFilter === f.id }"
          :aria-pressed="activeFilter === f.id ? 'true' : 'false'"
          @click="activeFilter = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="grid">
        <ProjectCard
          v-for="p in filtered"
          :key="p.repo"
          :project="p"
          :stat="stats[p.repo] || null"
        />
      </div>


    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from './ProjectCard.vue'
import { projects, CATEGORIES } from '../data/projects.js'
import { useGithubStats } from '../composables/useGithubStats.js'
import { t, localize } from '../i18n'

const filters = computed(() => [
  { id: 'all', label: t('projects.filterAll') },
  ...Object.entries(CATEGORIES).map(([id, category]) => ({
    id,
    label: localize(category.label)
  }))
])
const activeFilter = ref('all')
const filtered = computed(() =>
  activeFilter.value === 'all' ? projects : projects.filter((p) => p.category === activeFilter.value)
)

const { stats, available } = useGithubStats(projects.map((p) => p.repo))
</script>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.6rem; }
.chip {
  border: 1px solid var(--line-strong);
  color: var(--muted);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.chip:hover { color: var(--text); border-color: var(--accent); }
.chip.active { background: color-mix(in srgb, var(--accent) 14%, transparent); border-color: var(--accent); color: var(--text); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
}
@media (max-width: 420px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
