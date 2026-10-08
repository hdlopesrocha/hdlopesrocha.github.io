<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow mono">~/projects — 10 repos</p>
        <h2 id="projects-title">Experiments in graphics, AI &amp; beyond</h2>
        <p>
          Each card links to the live repository. Live star / language data loads
          progressively when the GitHub API is reachable — the catalogue below always renders regardless.
        </p>
      </div>

      <div class="filters" role="group" aria-label="Filter projects by category">
        <button
          v-for="f in filters"
          :key="f.id"
          class="chip mono"
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

      <p v-if="!available" class="fallback mono" role="status">
        // github api unreachable — showing cached catalogue data
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../data/projects.js'
import { useGithubStats } from '../composables/useGithubStats.js'

const filters = [
  { id: 'all', label: 'all' },
  { id: 'graphics', label: 'graphics' },
  { id: 'ai', label: 'ai' },
  { id: 'vr', label: 'vr' },
  { id: 'web', label: 'web' },
  { id: 'hardware', label: 'hardware' },
  { id: 'experimental', label: 'experimental' }
]
const activeFilter = ref('all')
const filtered = computed(() =>
  activeFilter.value === 'all' ? projects : projects.filter((p) => p.category === activeFilter.value)
)

const { stats, available } = useGithubStats(projects.map((p) => p.repo))
</script>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.6rem; }
.chip {
  background: transparent;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.chip:hover { color: var(--text); border-color: var(--accent); }
.chip.active { background: rgba(45,212,191,0.14); border-color: var(--accent); color: var(--text); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
}
@media (max-width: 420px) {
  .grid { grid-template-columns: 1fr; }
}
.fallback { color: var(--dim); font-size: 0.8rem; margin-top: 1.2rem; }
</style>
