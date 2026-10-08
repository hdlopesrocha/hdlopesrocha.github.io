<template>
  <section id="resume" class="section" aria-labelledby="resume-title">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow mono">~/cv — experience &amp; education</p>
        <h2 id="resume-title">Résumé</h2>
        <p>
          Software engineer (MSc, IST Lisbon) — previously at CERN, Bullray-CIT and IST/INESC.
          Full CV as PDF, in English and French:
        </p>
        <div class="cv-actions">
          <a class="btn primary small" :href="RESUME.cvEn" target="_blank" rel="noopener noreferrer">CV · English (PDF)</a>
          <a class="btn small" :href="RESUME.cvFr" target="_blank" rel="noopener noreferrer">CV · Français (PDF)</a>
          <a class="btn small ghost" href="https://github.com/hdlopesrocha/cv" target="_blank" rel="noopener noreferrer">LaTeX source</a>
        </div>
      </div>

      <h3 class="sub">Experience</h3>
      <div class="orgs">
        <article v-for="org in experience" :key="org.org" class="glass org">
          <header>
            <h4>{{ org.org }}</h4>
            <p v-if="org.place" class="mono place">{{ org.place }}</p>
          </header>
          <ol>
            <li v-for="r in org.roles" :key="r.title + r.period">
              <div class="role-head">
                <span class="mono period">{{ r.period }}</span>
                <strong>{{ r.title }}</strong>
              </div>
              <p>{{ r.detail }}</p>
              <div class="meta">
                <span v-for="t in r.tags" :key="t" class="tag">{{ t }}</span>
                <a v-if="r.link" class="tag link mono" :href="r.link" target="_blank" rel="noopener noreferrer">↗ {{ r.linkLabel }}</a>
              </div>
            </li>
          </ol>
        </article>
      </div>

      <h3 class="sub">Education</h3>
      <div class="edu-grid">
        <article v-for="e in education" :key="e.degree" class="glass edu">
          <p class="mono period">{{ e.period }}</p>
          <h4>{{ e.degree }}</h4>
          <p class="school">{{ e.school }}</p>
          <p class="muted">{{ e.detail }}</p>
        </article>
      </div>

      <h3 class="sub">Skills</h3>
      <div class="skills-grid">
        <div class="glass skill">
          <p class="mono label">programming</p>
          <ul><li v-for="s in skills.programming" :key="s">{{ s }}</li></ul>
        </div>
        <div class="glass skill">
          <p class="mono label">databases</p>
          <ul><li v-for="s in skills.databases" :key="s">{{ s }}</li></ul>
        </div>
        <div class="glass skill">
          <p class="mono label">languages &amp; soft skills</p>
          <ul>
            <li v-for="l in languages" :key="l.name">{{ l.name }} — {{ l.level }}</li>
          </ul>
          <ul class="soft"><li v-for="s in skills.soft" :key="s">{{ s }}</li></ul>
        </div>
      </div>

      <h3 class="sub">Earlier applications <span class="muted small">(from the CV — pre-GitHub era)</span></h3>
      <ol class="apps">
        <li v-for="a in earlyApps" :key="a.name" class="glass app">
          <span class="mono period">{{ a.year }}</span>
          <div>
            <strong>{{ a.name }}</strong>
            <p>{{ a.detail }}</p>
            <p v-if="a.link || a.video" class="links">
              <a v-if="a.link" :href="a.link" target="_blank" rel="noopener noreferrer">↗ {{ a.linkLabel }}</a>
              <a v-if="a.video" :href="a.video" target="_blank" rel="noopener noreferrer">↗ Video</a>
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { RESUME, experience, education, skills, languages, earlyApps } from '../data/resume.js'
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
.tag.link { text-decoration: none; border-color: rgba(45,212,191,0.45); color: #99f6e4; }
.edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.edu { padding: 1.2rem 1.4rem; }
.school { margin: 0.2rem 0; font-weight: 600; }
.edu .muted { margin: 0; font-size: 0.88rem; }
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
