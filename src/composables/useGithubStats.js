import { ref, onMounted } from 'vue'
import { GITHUB_USER } from '../data/projects.js'

// Lightweight runtime enrichment from the public GitHub API.
// The portfolio renders fully from local data; this only adds
// stars / forks / language / updated when the API is reachable.
const cache = new Map()

export function useGithubStats(repos) {
  const stats = ref({})
  const loading = ref(false)
  const available = ref(true)

  async function fetchOne(repo) {
    if (cache.has(repo)) return cache.get(repo)
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const json = await res.json()
    const slim = {
      stars: json.stargazers_count ?? 0,
      forks: json.forks_count ?? 0,
      language: json.language ?? null,
      description: json.description ?? null,
      updated: json.updated_at ?? null,
      openIssues: json.open_issues_count ?? 0
    }
    cache.set(repo, slim)
    return slim
  }

  onMounted(async () => {
    loading.value = true
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const results = await Promise.allSettled(
        repos.map((r) =>
          fetch(`https://api.github.com/repos/${GITHUB_USER}/${r}`, {
            headers: { Accept: 'application/vnd.github.v3+json' },
            signal: controller.signal
          }).then(async (res) => {
            if (!res.ok) throw new Error(String(res.status))
            const json = await res.json()
            return [
              r,
              {
                stars: json.stargazers_count ?? 0,
                forks: json.forks_count ?? 0,
                language: json.language ?? null,
                updated: json.updated_at ?? null
              }
            ]
          })
        )
      )
      clearTimeout(timeout)
      const next = {}
      let ok = 0
      for (const r of results) {
        if (r.status === 'fulfilled') {
          next[r.value[0]] = r.value[1]
          ok++
        }
      }
      stats.value = next
      available.value = ok > 0
    } catch {
      available.value = false
    } finally {
      loading.value = false
    }
  })

  return { stats, loading, available, fetchOne }
}

export function formatUpdated(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}
