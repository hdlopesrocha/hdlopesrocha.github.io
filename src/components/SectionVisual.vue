<template>
  <div class="section-visual" :class="`sv-${variant}`" aria-hidden="true">
    <!-- evolution / timeline -->
    <svg v-if="variant === 'timeline'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sv-timeline-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="38%" stop-color="var(--accent-2)" />
          <stop offset="70%" stop-color="var(--accent-3)" />
          <stop offset="100%" stop-color="var(--accent-4)" />
        </linearGradient>
      </defs>
      <g class="sv-dash-branches" fill="none" stroke="rgba(148,178,255,0.28)" stroke-dasharray="3 4">
        <path d="M124 55 C 152 34 180 30 208 24" />
        <path d="M194 88 C 220 112 246 118 280 126" />
        <path d="M86 76 C 102 102 126 110 150 116" />
      </g>
      <path
        class="sv-dash"
        d="M22 108 C 66 108 74 55 124 55 S 194 108 298 108"
        fill="none"
        stroke="url(#sv-timeline-line)"
        stroke-width="2"
        stroke-opacity="0.8"
      />
      <g class="sv-pulse-nodes">
        <circle cx="22" cy="108" r="5" fill="var(--accent)" />
        <circle cx="86" cy="76" r="4" fill="var(--accent-2)" />
        <circle cx="124" cy="55" r="6" fill="var(--accent-bright)" />
        <circle cx="194" cy="88" r="4" fill="var(--accent-2)" />
        <circle cx="298" cy="108" r="5" fill="var(--accent-3)" />
        <circle cx="208" cy="24" r="3" fill="var(--accent-2)" />
        <circle cx="280" cy="126" r="3" fill="var(--accent-3)" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="16" y="128">2019</text>
        <text x="110" y="42">engine</text>
        <text x="268" y="128">now</text>
      </g>
      <text x="14" y="20" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.85">evolution · one lineage</text>
    </svg>

    <!-- about / interests constellation -->
    <svg v-else-if="variant === 'about'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(148,178,255,0.22)" stroke-dasharray="2 5" fill="none">
        <path d="M160 16 V134 M46 75 H274" />
      </g>
      <g fill="none">
        <circle cx="160" cy="75" r="16" stroke="var(--accent)" />
        <circle class="sv-spin" cx="160" cy="75" r="34" stroke="var(--accent-2)" stroke-opacity="0.65" stroke-dasharray="6 4" />
        <circle cx="160" cy="75" r="52" stroke="var(--accent-3)" stroke-opacity="0.4" />
      </g>
      <circle class="sv-pulse-core" cx="160" cy="75" r="4.5" fill="var(--accent-bright)" />
      <g class="sv-twinkle">
        <circle cx="194" cy="75" r="3" fill="var(--accent-2)" />
        <circle cx="126" cy="75" r="3" fill="var(--accent-3)" />
        <circle cx="160" cy="41" r="3" fill="var(--accent)" />
        <circle cx="160" cy="109" r="3" fill="var(--accent-2)" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="206" y="48">gpu</text>
        <text x="92" y="48">sdf</text>
        <text x="206" y="108">ai</text>
        <text x="92" y="108">vr</text>
      </g>
      <text x="14" y="20" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.85">about · creative engineering</text>
      <text x="14" y="140" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">graphics · ai · vr · web</text>
    </svg>

    <!-- resume / career stack -->
    <svg v-else-if="variant === 'resume'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="sv-float-a" transform="rotate(-5 105 78)">
        <rect x="54" y="24" width="94" height="104" rx="6" fill="var(--panel-solid)" stroke="var(--accent)" stroke-opacity="0.65" />
        <path d="M70 44 H130 M70 56 H120 M70 68 H126 M70 80 H108" stroke="var(--accent-2)" stroke-opacity="0.5" />
        <circle cx="72" cy="103" r="3" fill="var(--accent-2)" />
        <path d="M79 103 l3 3 l5 -7" fill="none" stroke="var(--accent-bright)" stroke-width="1.5" />
        <circle cx="72" cy="116" r="3" fill="var(--accent-3)" />
        <path d="M79 116 l3 3 l5 -7" fill="none" stroke="var(--accent-bright)" stroke-width="1.5" opacity="0.7" />
      </g>
      <g class="sv-float-b" transform="rotate(4 166 78)">
        <rect x="128" y="28" width="88" height="98" rx="6" fill="var(--panel-solid)" stroke="var(--accent-2)" stroke-opacity="0.55" />
        <path d="M142 48 H200 M142 60 H190 M142 72 H198" stroke="var(--accent)" stroke-opacity="0.4" />
        <rect x="142" y="90" width="34" height="10" rx="5" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-opacity="0.5" />
      </g>
      <g stroke="var(--line-strong)" stroke-dasharray="3 4" fill="none">
        <path d="M246 32 V120" />
      </g>
      <g class="sv-twinkle">
        <circle cx="246" cy="40" r="4" fill="var(--accent-2)" />
        <circle cx="246" cy="76" r="4" fill="var(--accent)" />
        <circle cx="246" cy="112" r="4" fill="var(--accent-3)" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="258" y="43">cern</text>
        <text x="258" y="79">ist</text>
        <text x="258" y="115">now</text>
      </g>
      <text x="14" y="20" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.85">cv · experience &amp; education</text>
      <text x="14" y="140" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">cern → bullray → ist → now</text>
    </svg>

    <!-- contact / encrypted channel -->
    <svg v-else viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="sv-float-a">
        <rect x="26" y="34" width="122" height="38" rx="9" fill="var(--accent)" fill-opacity="0.10" stroke="var(--accent)" stroke-opacity="0.7" />
        <path d="M38 48 H126 M38 60 H104" stroke="var(--accent-bright)" stroke-opacity="0.55" />
      </g>
      <g class="sv-float-b">
        <rect x="150" y="86" width="120" height="36" rx="9" fill="var(--accent-2)" fill-opacity="0.10" stroke="var(--accent-2)" stroke-opacity="0.7" />
        <path d="M162 99 H250 M162 110 H224" stroke="var(--accent-2)" stroke-opacity="0.55" />
      </g>
      <g class="sv-signal" fill="none" stroke="var(--accent-3)" stroke-opacity="0.55" stroke-linecap="round">
        <path d="M214 38 a16 16 0 0 1 0 24" />
        <path d="M226 30 a28 28 0 0 1 0 40" />
        <path d="M238 22 a40 40 0 0 1 0 56" />
      </g>
      <g class="sv-pulse-core" fill="none" stroke="var(--accent-bright)" stroke-opacity="0.8">
        <rect x="272" y="90" width="16" height="13" rx="2" />
        <path d="M276 90 v-4 a4 4 0 0 1 8 0 v4" />
      </g>
      <path d="M26 128 H294" stroke="rgba(148,178,255,0.3)" stroke-dasharray="2 5" />
      <circle cx="26" cy="128" r="3" fill="var(--accent)" />
      <circle cx="294" cy="128" r="3" fill="var(--accent-3)" />
      <text x="14" y="20" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.85">contact · encrypted channel</text>
      <text x="14" y="140" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">nostr · nip-04 · no backend</text>
    </svg>

    <HorizontalBands :gap="3" :opacity="0.3" />
  </div>
</template>

<script setup>
import HorizontalBands from './HorizontalBands.vue'

defineProps({
  variant: {
    type: String,
    default: 'timeline',
    validator: (value) => ['timeline', 'about', 'resume', 'contact'].includes(value)
  }
})
</script>

<style scoped>
.section-visual {
  position: relative;
  height: 150px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    linear-gradient(rgba(148, 178, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 178, 255, 0.055) 1px, transparent 1px),
    radial-gradient(320px 160px at 30% 20%, var(--accent-glow), transparent 72%),
    #070b14;
  background-size: 22px 22px, 22px 22px, cover, cover;
  box-shadow: inset 0 0 50px color-mix(in srgb, var(--accent) 5%, transparent);
}
.section-visual svg {
  display: block;
  width: 100%;
  height: 100%;
}

.sv-spin,
.sv-pulse-nodes,
.sv-pulse-core,
.sv-signal {
  transform-box: view-box;
}
.sv-spin { transform-origin: 160px 75px; }
.sv-pulse-nodes { transform-origin: 160px 75px; }
.sv-pulse-core { transform-origin: 160px 75px; }
.sv-signal { transform-origin: 214px 50px; }

@media (prefers-reduced-motion: no-preference) {
  .section-visual svg {
    transform-origin: 50% 52%;
    animation: sv-breathe calc(var(--motion-speed, 2.4s) * 3.5) ease-in-out infinite alternate;
  }
  .sv-dash {
    stroke-dasharray: 9 7;
    animation: sv-dash calc(var(--motion-speed, 2.4s) * 1.6) linear infinite;
  }
  .sv-dash-branches {
    animation: sv-dash calc(var(--motion-speed, 2.4s) * 2.8) linear infinite reverse;
  }
  .sv-spin {
    animation: sv-spin calc(var(--motion-speed, 2.4s) * 10) linear infinite;
  }
  .sv-pulse-nodes,
  .sv-pulse-core {
    animation: sv-pulse calc(var(--motion-speed, 2.4s) * 1.4) ease-in-out infinite;
  }
  .sv-twinkle {
    animation: sv-twinkle calc(var(--motion-speed, 2.4s) * 1.8) ease-in-out infinite;
  }
  .sv-float-a {
    animation: sv-float-a calc(var(--motion-speed, 2.4s) * 3) ease-in-out infinite alternate;
  }
  .sv-float-b {
    animation: sv-float-b calc(var(--motion-speed, 2.4s) * 4) ease-in-out infinite alternate;
  }
  .sv-signal {
    animation: sv-signal calc(var(--motion-speed, 2.4s) * 1.2) ease-in-out infinite;
  }
}

@keyframes sv-breathe {
  from { transform: scale(1); }
  to { transform: scale(1.012); }
}
@keyframes sv-dash {
  to { stroke-dashoffset: -32; }
}
@keyframes sv-spin {
  to { rotate: 360deg; }
}
@keyframes sv-pulse {
  0%, 100% { scale: 1; }
  50% { scale: calc(1.02 + var(--kick, 0) * 0.08); }
}
@keyframes sv-twinkle {
  0%, 100% { opacity: 0.35; }
  50% { opacity: calc(0.7 + var(--snare, 0) * 0.3); }
}
@keyframes sv-float-a {
  from { translate: 0 0; }
  to { translate: 0 -4px; }
}
@keyframes sv-float-b {
  from { translate: 0 2px; }
  to { translate: 0 -2px; }
}
@keyframes sv-signal {
  0%, 100% { scale: 1; opacity: 0.7; }
  50% { scale: calc(1.02 + var(--snare, 0) * 0.08); opacity: 1; }
}
</style>
