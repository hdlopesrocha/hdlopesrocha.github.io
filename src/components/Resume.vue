<template>
  <section id="resume" class="section" aria-labelledby="resume-title">
    <div class="wrap">
      <div class="section-head split">
        <div class="section-head-copy">
          <p class="eyebrow mono soft-shade">{{ t('resume.eyebrow') }}</p>
          <h2 id="resume-title" class="soft-shade">{{ t('resume.title') }}</h2>
          <p class="soft-shade">
            {{ t('resume.intro') }}
          </p>
          <div class="cv-actions">
            <a class="btn primary small" :href="RESUME.cvEn" target="_blank" rel="noopener noreferrer">{{ t('resume.cvEn') }}</a>
            <a class="btn small ghost" href="https://github.com/hdlopesrocha/cv" target="_blank" rel="noopener noreferrer">{{ t('resume.latex') }}</a>
          </div>
        </div>
        <SectionVisual variant="resume" class="section-art" />
      </div>

      <h3 class="sub soft-shade">{{ t('resume.experience') }}</h3>
      <div class="orgs">
        <article v-for="org in experience" :key="localize(org.org)" class="glass org">
          <header>
            <h4>{{ localize(org.org) }}</h4>
            <p v-if="org.place" class="mono place">{{ localize(org.place) }}</p>
            <a v-if="org.link" class="tag link mono" :href="org.link" target="_blank" rel="noopener noreferrer">↗ {{ localize(org.linkLabel) }}</a>
          </header>
          <ol>
            <li v-for="r in org.roles" :key="localize(r.title) + '|' + localize(r.period)">
              <div class="role-head">
                <span class="mono period">{{ localize(r.period) }}</span>
                <strong>{{ localize(r.title) }}</strong>
              </div>
              <p>{{ localize(r.detail) }}</p>
              <div class="meta">
                <span v-for="tag in r.tags" :key="tag" class="tag">{{ tag }}</span>
                <a v-if="r.link" class="tag link mono" :href="r.link" target="_blank" rel="noopener noreferrer">↗ {{ localize(r.linkLabel) }}</a>
              </div>
            </li>
          </ol>
        </article>
      </div>

      <h3 class="sub soft-shade">{{ t('resume.education') }}</h3>
      <div class="edu-grid">
        <article v-for="e in education" :key="e.period + localize(e.degree)" class="glass edu">
          <p class="mono period">{{ e.period }}</p>
          <h4>{{ localize(e.degree) }}</h4>
          <p class="school">{{ localize(e.school) }}</p>
          <p class="muted">{{ localize(e.detail) }}</p>
          <p v-if="e.link" class="links">
            <a :href="e.link" target="_blank" rel="noopener noreferrer">↗ {{ localize(e.linkLabel) }}</a>
          </p>
        </article>
      </div>

      <div class="thesis glass">
        <p class="mono thesis-title">{{ t('resume.masterThesis') }}</p>
        <p>
          <a :href="thesis?.url" target="_blank" rel="noopener noreferrer" class="mono repo-link">{{ thesisName }}</a>
          <span class="mono repo-id">(ist168621 · IST, 2015)</span>{{ t('resume.masterThesisNote') }}
          <a :href="thesis?.video" target="_blank" rel="noopener noreferrer">{{ t('resume.watchDemo') }}</a>
        </p>
      </div>

      <h3 class="sub soft-shade">{{ t('resume.skills') }}</h3>
      <div class="skills-grid">
        <div class="glass skill">
          <p class="mono label">{{ t('resume.programming') }}</p>
          <ul><li v-for="s in skills.programming" :key="s">{{ s }}</li></ul>
        </div>
        <div class="glass skill">
          <p class="mono label">{{ t('resume.databases') }}</p>
          <ul><li v-for="s in skills.databases" :key="s">{{ s }}</li></ul>
        </div>
        <div class="glass skill">
          <p class="mono label">{{ t('resume.languagesSoft') }}</p>
          <ul>
            <li v-for="l in languages" :key="localize(l.name)">{{ localize(l.name) }} — {{ localize(l.level) }}</li>
          </ul>
          <ul class="soft"><li v-for="s in skills.soft" :key="localize(s)">{{ localize(s) }}</li></ul>
        </div>
      </div>

      <h3 class="sub soft-shade">{{ t('resume.earlierApps') }} <span class="muted small">{{ t('resume.earlierNote') }}</span></h3>
      <ol class="apps">
        <li v-for="a in earlyApps" :key="a.name" class="glass app">
          <span class="mono period">{{ a.year }}</span>
          <div>
            <strong>{{ a.name }}</strong>
            <p>{{ localize(a.detail) }}</p>
            <p v-if="a.link || a.video" class="links">
              <a v-if="a.link" :href="a.link" target="_blank" rel="noopener noreferrer">↗ {{ localize(a.linkLabel) }}</a>
              <a v-if="a.video" :href="a.video" target="_blank" rel="noopener noreferrer">↗ {{ t('resume.video') }}</a>
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SectionVisual from './SectionVisual.vue'
import { RESUME, experience, education, skills, languages, earlyApps } from '../data/resume.js'
import { projectByRepo } from '../data/projects.js'
import { t, localize } from '../i18n'

const thesis = computed(() => projectByRepo('ist168621'))
const thesisName = computed(() => localize(thesis.value?.name))
</script>

<style scoped>
.cv-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1rem; }
.sub { margin: 2.6rem 0 1.1rem; font-size: 1.25rem; letter-spacing: -0.01em; }
.sub .small { font-size: 0.8rem; font-weight: 400; }
.muted { color: var(--muted); }
.orgs { display: grid; gap: 1rem; }
.org { padding: 1.2rem 1.4rem; }
.org header { display: flex; align-items: baseline; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.6rem; }
.org h4, .edu h4 { margin: 0; font-size: 1.05rem; }
.place { margin: 0; color: var(--dim); font-size: 0.78rem; }
.org ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
.org li + li { border-top: 1px solid var(--line); padding-top: 1rem; }
.role-head { display: flex; gap: 0.8rem; align-items: baseline; flex-wrap: wrap; }
.period { color: var(--accent); font-size: 0.78rem; white-space: nowrap; }
.org p { margin: 0.3rem 0 0.5rem; color: var(--muted); font-size: 0.9rem; }
.meta { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag.link { text-decoration: none; border-color: color-mix(in srgb, var(--tag-color, var(--accent)) 45%, transparent); color: color-mix(in srgb, var(--tag-color, var(--accent)) 55%, white); }
.edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.edu { padding: 1.2rem 1.4rem; }
.school { margin: 0.2rem 0; font-weight: 600; }
.edu .muted { margin: 0; font-size: 0.88rem; }
.thesis { margin-top: 1rem; padding: 1.1rem 1.3rem; border-color: color-mix(in srgb, var(--accent) 35%, transparent); }
.thesis-title { margin: 0 0 0.6rem; color: var(--accent); font-size: 0.8rem; }
.thesis p { margin: 0; color: var(--muted); font-size: 0.9rem; }
.repo-link { color: var(--text); font-size: 0.92rem; text-decoration: none; border-bottom: 1px dashed color-mix(in srgb, var(--accent) 40%, transparent); }
.repo-link:hover { color: var(--accent); }
.repo-id { color: var(--dim); font-size: 0.78rem; margin-left: 0.5rem; }
.thesis a:last-child { color: var(--accent); text-decoration: none; white-space: nowrap; }
.thesis a:last-child:hover { text-decoration: underline; }
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
.skill { padding: 1.2rem 1.4rem; }
.label { margin: 0 0 0.6rem; color: var(--accent); font-size: 0.78rem; }
.skill ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.35rem 1rem; }
.skill li { font-size: 0.88rem; color: #c3d0e6; }
.soft { margin-top: 0.6rem !important; }
.apps { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7rem; }
.app { padding: 0.9rem 1.2rem; display: flex; gap: 1rem; align-items: baseline; }
.app strong { font-size: 0.95rem; }
.app p { margin: 0.2rem 0 0; color: var(--muted); font-size: 0.86rem; }
.links { display: flex; gap: 1rem; }
.links a { color: var(--accent); font-size: 0.82rem; text-decoration: none; }
</style>
