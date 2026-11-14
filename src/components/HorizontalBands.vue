<template>
  <span
    class="horizontal-bands"
    :style="{
      '--band-gap': `${gap}px`,
      '--band-opacity': opacity,
      '--band-color': color
    }"
    aria-hidden="true"
  ></span>
</template>

<script setup>
defineProps({
  gap: { type: Number, default: 3 },
  opacity: { type: Number, default: 0.3 },
  color: { type: String, default: 'var(--accent)' }
})
</script>

<style scoped>
.horizontal-bands {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 calc(var(--band-gap) - 1px),
    color-mix(in srgb, var(--band-color) 24%, transparent) calc(var(--band-gap) - 1px) var(--band-gap)
  );
  opacity: var(--band-opacity);
  mix-blend-mode: screen;
}
</style>
