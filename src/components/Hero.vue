<template>
  <section id="home" class="section" aria-labelledby="hero-title">
    <div class="hero-fade" aria-hidden="true"></div>
    <div class="wrap hero-inner">
      <p class="eyebrow mono hero-shade"><span class="dot" aria-hidden="true"></span> {{ t('hero.eyebrow') }}</p>
      <div class="title-row hero-shade">
        <img
          class="avatar"
          src="https://avatars.githubusercontent.com/u/6792581?v=4&s=192"
          :alt="t('hero.avatarAlt')"
          width="96"
          height="96"
          loading="eager"
          @error="avatarGone = true"
          v-if="!avatarGone"
        />
        <h1 id="hero-title">Henrique Lopes Rocha</h1>
      </div>
      <p class="subtitle hero-shade">{{ t('hero.subtitle') }}</p>
      <p class="lede hero-shade">
        {{ t('hero.lede') }}
      </p>
      <AudioControl />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AudioControl from './AudioControl.vue'
import { t } from '../i18n'

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
.hero-inner { position: relative; --hero-copy-width: 640px; }
.hero-shade {
  position: relative;
  isolation: isolate;
  width: fit-content;
  max-width: 100%;
}
.hero-shade::before {
  content: "";
  position: absolute;
  inset: -0.2rem -0.55rem;
  z-index: -1;
  pointer-events: none;
}
.eyebrow { display: flex; align-items: center; gap: 0.6rem; margin: 0 0 1rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px var(--accent); }
.title-row { display: flex; align-items: center; gap: 1.4rem; }
.avatar {
  width: 96px;
  height: 96px;
  flex: none;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow: 0 0 34px color-mix(in srgb, var(--accent) 22%, transparent);
  background: var(--panel-solid);
  transform: scale(calc(1 + var(--kick, 0) * 0.018));
  will-change: transform;
  transition: transform 80ms linear;
}
h1 {
  margin: 0;
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  text-shadow: 0 0 40px color-mix(in srgb, var(--accent) 18%, transparent);
}
.subtitle {
  margin: 0.9rem 0 0;
  font-size: clamp(1rem, 2.4vw, 1.3rem);
  color: var(--accent);
  font-family: var(--font-mono);
}
.lede { max-width: var(--hero-copy-width, 640px); color: var(--muted); font-size: 1.06rem; }
@media (max-width: 600px) {
  .hero { padding: 4.5rem 0 3rem; min-height: unset; }
  .title-row { gap: 1rem; }
  .avatar { width: 64px; height: 64px; }
}
</style>
