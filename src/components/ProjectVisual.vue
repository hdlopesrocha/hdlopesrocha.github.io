<template>
  <div class="visual" :class="`v-${visual}`" aria-hidden="true">
    <!-- wireframe : vulkan engine -->
    <svg v-if="visual === 'wireframe'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(45,212,191,0.55)" stroke-width="1">
        <path d="M20 120 L90 40 L160 120 Z" />
        <path d="M90 40 L160 120 L230 40 Z" opacity="0.7" />
        <path d="M160 120 L230 40 L300 120 Z" opacity="0.45" />
        <path d="M20 120 H300" stroke="rgba(148,178,255,0.4)" />
        <circle cx="90" cy="40" r="3" fill="#2dd4bf" stroke="none" />
        <circle cx="230" cy="40" r="3" fill="#38bdf8" stroke="none" />
        <path d="M90 40 L90 14 M230 40 L230 14" stroke="rgba(148,178,255,0.4)" stroke-dasharray="3 3" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="84" y="12">vk::pipeline</text>
        <text x="224" y="12">compute</text>
      </g>
    </svg>

    <!-- smoke : sdf volumetric -->
    <svg v-else-if="visual === 'smoke'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sm1" cx="40%" cy="50%" r="60%">
          <stop offset="0%" stop-color="rgba(45,212,191,0.5)" />
          <stop offset="60%" stop-color="rgba(56,189,248,0.18)" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
        <radialGradient id="sm2" cx="65%" cy="45%" r="55%">
          <stop offset="0%" stop-color="rgba(167,139,250,0.45)" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      <rect width="320" height="150" fill="url(#sm1)" />
      <rect width="320" height="150" fill="url(#sm2)" />
      <g fill="none" stroke="rgba(230,241,255,0.35)">
        <ellipse cx="130" cy="75" rx="70" ry="26" stroke-dasharray="4 5" />
        <ellipse cx="130" cy="75" rx="46" ry="16" />
        <ellipse cx="130" cy="75" rx="22" ry="8" stroke="rgba(45,212,191,0.7)" />
      </g>
      <text x="14" y="138" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">sdf(p) → march → density</text>
    </svg>

    <!-- terrain : lithos predecessor -->
    <svg v-else-if="visual === 'terrain'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path d="M0 110 L40 78 L80 95 L120 55 L165 82 L210 48 L255 90 L290 66 L320 84 L320 150 L0 150 Z" fill="rgba(45,212,191,0.12)" stroke="rgba(45,212,191,0.6)" />
      <path d="M0 122 L60 100 L130 112 L200 88 L270 104 L320 96" fill="none" stroke="rgba(56,189,248,0.5)" stroke-dasharray="5 4" />
      <g stroke="rgba(148,178,255,0.25)"><path d="M120 55 V130 M210 48 V130" stroke-dasharray="2 4" /></g>
      <text x="14" y="24" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">surface-nets · octree lod</text>
    </svg>

    <!-- grid : hydrogen vulkan -->
    <svg v-else-if="visual === 'grid'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(56,189,248,0.4)" fill="none">
        <path d="M0 110 L320 110" />
        <path d="M40 150 L120 40 M100 150 L160 40 M160 150 L200 40 M220 150 L240 40 M280 150 L280 40" opacity="0.7" />
        <path d="M0 130 L320 125 M0 95 L320 82" opacity="0.4" />
      </g>
      <rect x="150" y="52" width="60" height="34" fill="rgba(45,212,191,0.12)" stroke="#2dd4bf" />
      <text x="158" y="73" font-family="monospace" font-size="10" fill="#99f6e4">VK_1.3</text>
    </svg>

    <!-- terminal-wave : opencode-talk -->
    <svg v-else-if="visual === 'terminal-wave'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect x="14" y="14" width="170" height="70" rx="6" fill="rgba(5,7,13,0.8)" stroke="rgba(148,178,255,0.35)" />
      <text x="26" y="36" font-family="monospace" font-size="10" fill="#2dd4bf">$ opencode talk --voice</text>
      <text x="26" y="54" font-family="monospace" font-size="10" fill="#93a1b8">▸ listening… agent ready</text>
      <text x="26" y="70" font-family="monospace" font-size="10" fill="#e6f1ff">▊</text>
      <g stroke="#a78bfa" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M210 60 v30 M222 50 v50 M234 58 v34 M246 44 v62 M258 56 v38 M270 62 v26 M282 55 v40" class="eq" />
      </g>
    </svg>

    <!-- waveform : music-ai -->
    <svg v-else-if="visual === 'waveform'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path d="M0 75 Q 20 30 40 75 T 80 75 T 120 75 T 160 75 T 200 75 T 240 75 T 280 75 T 320 75" fill="none" stroke="#a78bfa" stroke-width="2" />
      <path d="M0 75 Q 20 55 40 75 T 80 75 T 120 75 T 160 75 T 200 75 T 240 75 T 280 75 T 320 75" fill="none" stroke="rgba(45,212,191,0.7)" stroke-width="1.4" />
      <g fill="rgba(167,139,250,0.5)">
        <rect x="40" y="40" width="4" height="70" rx="2" /><rect x="90" y="52" width="4" height="46" rx="2" />
        <rect x="140" y="34" width="4" height="82" rx="2" /><rect x="190" y="50" width="4" height="50" rx="2" />
        <rect x="240" y="42" width="4" height="66" rx="2" />
      </g>
    </svg>

    <!-- spatial : vr -->
    <svg v-else-if="visual === 'spatial'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(56,189,248,0.6)">
        <circle cx="160" cy="70" r="46" />
        <circle cx="160" cy="70" r="30" opacity="0.7" />
        <circle cx="160" cy="70" r="14" stroke="#2dd4bf" />
      </g>
      <g stroke="rgba(230,241,255,0.5)">
        <path d="M114 70 H70 M250 70 H206 M160 24 V8 M160 132 V116" />
      </g>
      <path d="M120 96 Q160 118 200 96" stroke="#a78bfa" fill="none" stroke-width="2" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">hmd · spatial audio · 6dof</text>
    </svg>

    <!-- cards -->
    <svg v-else-if="visual === 'cards'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g>
        <rect x="60" y="30" width="80" height="95" rx="8" fill="#0d1626" stroke="rgba(251,191,36,0.6)" transform="rotate(-8 100 77)" />
        <rect x="120" y="26" width="80" height="95" rx="8" fill="#0e1a2e" stroke="rgba(56,189,248,0.6)" />
        <rect x="180" y="30" width="80" height="95" rx="8" fill="#0b1424" stroke="rgba(45,212,191,0.6)" transform="rotate(8 220 77)" />
        <text x="137" y="70" font-family="monospace" font-size="16" fill="#e6f1ff">A♠</text>
        <text x="137" y="90" font-family="monospace" font-size="8" fill="#93a1b8">generator</text>
      </g>
    </svg>

    <!-- signal : lora -->
    <svg v-else-if="visual === 'signal'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(244,114,182,0.65)">
        <path d="M40 110 Q80 110 80 75 Q80 40 120 40" stroke-width="1.6" />
        <circle cx="40" cy="110" r="4" fill="#f472b6" stroke="none" />
        <circle cx="120" cy="40" r="4" fill="#2dd4bf" stroke="none" />
      </g>
      <g stroke="rgba(45,212,191,0.5)">
        <path d="M120 40 m-14 0 a14 14 0 0 1 28 0" fill="none" />
        <path d="M120 40 m-24 0 a24 24 0 0 1 48 0" fill="none" opacity="0.6" />
        <path d="M120 40 m-34 0 a34 34 0 0 1 68 0" fill="none" opacity="0.35" />
      </g>
      <text x="180" y="120" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">lora · 868mhz · ctl</text>
    </svg>

    <!-- rings : spring campus -->
    <svg v-else-if="visual === 'rings'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none">
        <circle cx="160" cy="72" r="52" stroke="rgba(148,178,255,0.35)" stroke-dasharray="6 5" />
        <circle cx="160" cy="72" r="36" stroke="rgba(45,212,191,0.6)" />
        <circle cx="160" cy="72" r="20" stroke="rgba(56,189,248,0.7)" />
        <circle cx="160" cy="72" r="5" fill="#2dd4bf" stroke="none" />
      </g>
      <text x="14" y="136" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">spring-campus · 2019</text>
    </svg>

    <div class="scan" aria-hidden="true"></div>
  </div>
</template>

<script setup>
defineProps({ visual: { type: String, default: 'grid' } })
</script>

<style scoped>
.visual {
  position: relative;
  height: 150px;
  overflow: hidden;
  background:
    linear-gradient(rgba(148,178,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,178,255,0.06) 1px, transparent 1px),
    radial-gradient(320px 150px at 30% 20%, rgba(45,212,191,0.10), transparent 70%),
    #070b14;
  background-size: 22px 22px, 22px 22px, cover, cover;
  border-bottom: 1px solid var(--line);
}
.visual svg { width: 100%; height: 100%; display: block; }
.scan {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(45,212,191,0.06) 50%, transparent 100%);
  background-size: 100% 46px;
}
.v-wireframe { box-shadow: inset 0 0 60px rgba(45,212,191,0.08); }
@media (prefers-reduced-motion: no-preference) {
  .eq { animation: eq 1.6s ease-in-out infinite alternate; }
  @keyframes eq { from { transform: scaleY(0.85); } to { transform: scaleY(1.08); } }
}
</style>
