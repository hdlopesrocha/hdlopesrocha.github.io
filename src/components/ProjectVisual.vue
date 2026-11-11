<template>
  <div class="visual" :class="`v-${visual}`" aria-hidden="true">
    <!-- wireframe : vulkan engine -->
    <svg v-if="visual === 'wireframe'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--accent)" stroke-opacity="0.55" stroke-width="1">
        <path class="pv-tri" d="M20 120 L90 40 L160 120 Z" />
        <path class="pv-tri" d="M90 40 L160 120 L230 40 Z" opacity="0.7" />
        <path class="pv-tri" d="M160 120 L230 40 L300 120 Z" opacity="0.45" />
        <path d="M20 120 H300" stroke="rgba(148,178,255,0.4)" />
        <circle class="pv-node" cx="90" cy="40" r="3" fill="var(--accent)" stroke="none" />
        <circle class="pv-node" cx="230" cy="40" r="3" fill="var(--accent-2)" stroke="none" />
        <path d="M90 40 L90 14 M230 40 L230 14" stroke="rgba(148,178,255,0.4)" stroke-dasharray="3 3" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="84" y="12">vk::pipeline</text>
        <text x="224" y="12">compute</text>
      </g>
    </svg>

    <!-- gource : git history map -->
    <svg v-else-if="visual === 'gource'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-flow" fill="none" stroke="rgba(148,178,255,0.35)">
        <path d="M62 76 C 92 76 96 44 128 44" />
        <path d="M62 76 C 92 76 96 104 128 104" />
        <path d="M62 76 C 92 76 96 116 124 116" stroke-dasharray="3 4" />
      </g>
      <g class="pv-flow" fill="none" stroke="var(--accent)" stroke-opacity="0.5">
        <path d="M128 44 C 156 44 160 26 190 26" />
        <path d="M128 44 C 156 44 160 58 188 58" />
        <path d="M128 104 C 156 104 160 92 186 92" />
        <path d="M128 104 C 156 104 160 118 184 120" />
      </g>
      <g class="pv-flow" stroke="var(--accent-bright)" stroke-opacity="0.6" stroke-dasharray="2 3" fill="none">
        <path d="M42 32 L190 26" />
        <path d="M42 32 L186 92" />
      </g>
      <circle class="pv-node" cx="42" cy="32" r="5" fill="var(--accent-bright)" stroke="none" />
      <g class="pv-nodes" stroke="none">
        <circle cx="62" cy="76" r="7" fill="var(--accent)" />
        <circle cx="128" cy="44" r="5" fill="var(--accent-2)" fill-opacity="0.9" />
        <circle cx="128" cy="104" r="5" fill="var(--accent-3)" fill-opacity="0.9" />
        <circle cx="190" cy="26" r="8" fill="var(--accent-2)" fill-opacity="0.85" />
        <circle cx="188" cy="58" r="4" fill="var(--accent-2)" fill-opacity="0.55" />
        <circle cx="186" cy="92" r="6" fill="var(--accent-3)" fill-opacity="0.8" />
        <circle cx="184" cy="120" r="3.5" fill="var(--accent-3)" fill-opacity="0.55" />
        <circle cx="124" cy="116" r="4" fill="var(--accent)" fill-opacity="0.5" />
      </g>
      <g font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">
        <text x="198" y="29">src/</text>
        <text x="192" y="95">docs/</text>
      </g>
      <text x="14" y="134" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">git history → animated map</text>
    </svg>

    <!-- smoke : sdf volumetric -->
    <svg v-else-if="visual === 'smoke'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sm1" cx="40%" cy="50%" r="60%">
          <stop offset="0%" stop-color="var(--accent)" stop-color-opacity="0.5" />
          <stop offset="60%" stop-color="var(--accent-2)" stop-color-opacity="0.18" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
        <radialGradient id="sm2" cx="65%" cy="45%" r="55%">
          <stop offset="0%" stop-color="var(--accent-3)" stop-color-opacity="0.45" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      <rect class="pv-smoke-glow" width="320" height="150" fill="url(#sm1)" />
      <rect class="pv-smoke-glow" width="320" height="150" fill="url(#sm2)" />
      <g class="pv-smoke-rings" fill="none" stroke="rgba(230,241,255,0.35)">
        <ellipse cx="130" cy="75" rx="70" ry="26" stroke-dasharray="4 5" />
        <ellipse cx="130" cy="75" rx="46" ry="16" />
        <ellipse cx="130" cy="75" rx="22" ry="8" stroke="var(--accent)" stroke-opacity="0.7" />
      </g>
      <text x="14" y="138" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">sdf(p) → march → density</text>
    </svg>

    <!-- terrain : lithos predecessor -->
    <svg v-else-if="visual === 'terrain'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path class="pv-terrain" d="M0 110 L40 78 L80 95 L120 55 L165 82 L210 48 L255 90 L290 66 L320 84 L320 150 L0 150 Z" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" stroke-opacity="0.6" />
      <path class="pv-flow" d="M0 122 L60 100 L130 112 L200 88 L270 104 L320 96" fill="none" stroke="var(--accent-2)" stroke-opacity="0.5" stroke-dasharray="5 4" />
      <g class="pv-flow" stroke="rgba(148,178,255,0.25)"><path d="M120 55 V130 M210 48 V130" stroke-dasharray="2 4" /></g>
      <text x="14" y="24" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">surface-nets · octree lod</text>
    </svg>

    <!-- grid : hydrogen vulkan -->
    <svg v-else-if="visual === 'grid'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-grid" stroke="var(--accent-2)" stroke-opacity="0.4" fill="none">
        <path d="M0 110 L320 110" />
        <path d="M40 150 L120 40 M100 150 L160 40 M160 150 L200 40 M220 150 L240 40 M280 150 L280 40" opacity="0.7" />
        <path d="M0 130 L320 125 M0 95 L320 82" opacity="0.4" />
      </g>
      <rect class="pv-node" x="150" y="52" width="60" height="34" fill="var(--accent)" fill-opacity="0.12" stroke="var(--accent)" />
      <text class="pv-twinkle" x="158" y="73" font-family="monospace" font-size="10" fill="var(--accent-bright)">VK_1.3</text>
    </svg>

    <!-- terminal-wave : opencode-talk -->
    <svg v-else-if="visual === 'terminal-wave'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect x="14" y="14" width="170" height="70" rx="6" fill="rgba(5,7,13,0.8)" stroke="rgba(148,178,255,0.35)" />
      <text x="26" y="36" font-family="monospace" font-size="10" fill="var(--accent)">$ opencode talk --voice</text>
      <text x="26" y="54" font-family="monospace" font-size="10" fill="#93a1b8">▸ listening… agent ready</text>
      <text class="pv-cursor" x="26" y="70" font-family="monospace" font-size="10" fill="#e6f1ff">▊</text>
      <g stroke="var(--accent-3)" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M210 60 v30 M222 50 v50 M234 58 v34 M246 44 v62 M258 56 v38 M270 62 v26 M282 55 v40" class="eq" />
      </g>
    </svg>

    <!-- waveform : music-ai -->
    <svg v-else-if="visual === 'waveform'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path class="pv-sine" d="M0 75 Q 20 30 40 75 T 80 75 T 120 75 T 160 75 T 200 75 T 240 75 T 280 75 T 320 75" fill="none" stroke="var(--accent-3)" stroke-width="2" />
      <path class="pv-sine pv-sine-alt" d="M0 75 Q 20 55 40 75 T 80 75 T 120 75 T 160 75 T 200 75 T 240 75 T 280 75 T 320 75" fill="none" stroke="var(--accent)" stroke-opacity="0.7" stroke-width="1.4" />
      <g class="pv-bars" fill="var(--accent-3)" fill-opacity="0.5">
        <rect x="40" y="40" width="4" height="70" rx="2" /><rect x="90" y="52" width="4" height="46" rx="2" />
        <rect x="140" y="34" width="4" height="82" rx="2" /><rect x="190" y="50" width="4" height="50" rx="2" />
        <rect x="240" y="42" width="4" height="66" rx="2" />
      </g>
    </svg>

    <!-- audio3d : spring-campus music visualization (3d + webaudio) -->
    <svg v-else-if="visual === 'audio3d'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-flow" stroke="var(--accent-2)" stroke-opacity="0.4" fill="none">
        <path d="M0 118 H320" />
        <path d="M20 150 L160 118 M70 150 L160 118 M120 150 L160 118 M160 150 L160 118 M200 150 L160 118 M250 150 L160 118 M300 150 L160 118" opacity="0.55" />
      </g>
      <g class="pv-cube" fill="none" stroke="var(--accent)" stroke-opacity="0.7">
        <rect x="36" y="44" width="52" height="52" />
        <rect x="54" y="30" width="52" height="52" opacity="0.8" />
        <path d="M36 44 L54 30 M88 44 L106 30 M36 96 L54 82 M88 96 L106 82" opacity="0.8" />
      </g>
      <circle class="pv-node" cx="54" cy="30" r="3" fill="var(--accent)" stroke="none" />
      <g class="pv-bars">
        <rect x="150" y="112" width="8" height="20" rx="2" fill="var(--accent-3)" fill-opacity="0.65" />
        <rect x="164" y="98" width="8" height="34" rx="2" fill="var(--accent)" fill-opacity="0.65" />
        <rect x="178" y="84" width="8" height="48" rx="2" fill="var(--accent-3)" fill-opacity="0.65" />
        <rect x="192" y="104" width="8" height="28" rx="2" fill="var(--accent)" fill-opacity="0.65" />
        <rect x="206" y="76" width="8" height="56" rx="2" fill="var(--accent-3)" fill-opacity="0.8" />
        <rect x="220" y="92" width="8" height="40" rx="2" fill="var(--accent)" fill-opacity="0.65" />
        <rect x="234" y="68" width="8" height="64" rx="2" fill="var(--accent-3)" fill-opacity="0.8" />
        <rect x="248" y="96" width="8" height="36" rx="2" fill="var(--accent)" fill-opacity="0.65" />
        <rect x="262" y="80" width="8" height="52" rx="2" fill="var(--accent-3)" fill-opacity="0.65" />
        <rect x="276" y="108" width="8" height="24" rx="2" fill="var(--accent)" fill-opacity="0.65" />
        <rect x="290" y="88" width="8" height="44" rx="2" fill="var(--accent-3)" fill-opacity="0.65" />
      </g>
      <text x="14" y="20" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">webAudio → canvas · webgl</text>
    </svg>

    <!-- teashop : mobarrocas tea shop website -->
    <svg v-else-if="visual === 'teashop'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect x="44" y="16" width="232" height="118" rx="8" fill="rgba(5,7,13,0.8)" stroke="rgba(148,178,255,0.35)" />
      <path d="M44 40 H276" stroke="rgba(148,178,255,0.35)" />
      <circle cx="58" cy="28" r="3" fill="var(--accent)" stroke="none" opacity="0.8" />
      <circle cx="70" cy="28" r="3" fill="var(--accent-2)" stroke="none" opacity="0.8" />
      <circle cx="82" cy="28" r="3" fill="var(--accent-3)" stroke="none" opacity="0.8" />
      <rect x="96" y="22" width="150" height="12" rx="6" fill="none" stroke="rgba(148,178,255,0.3)" />
      <text x="104" y="31" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">mobarrocas · shop</text>
      <g class="pv-wobble" fill="none" stroke="var(--accent)" stroke-opacity="0.75" stroke-width="1.5">
        <path d="M120 70 h44 l-6 34 h-32 z" />
        <path d="M164 74 q16 2 12 16 q-3 12 -16 10" />
        <path d="M112 112 H176" stroke="rgba(148,178,255,0.4)" />
      </g>
      <g class="pv-steam" fill="none" stroke="var(--accent-2)" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round">
        <path d="M134 62 q-6 -8 0 -16 q6 -8 0 -14" />
        <path d="M148 62 q-6 -8 0 -16 q6 -8 0 -14" opacity="0.6" />
      </g>
      <g class="pv-twinkle" fill="none" stroke="var(--accent-bright)" stroke-opacity="0.7" stroke-width="1.5">
        <rect x="196" y="80" width="34" height="30" rx="3" />
        <path d="M203 80 q0 -12 10 -12 q10 0 10 12" />
      </g>
      <text x="203" y="99" font-family="monospace" font-size="11" fill="var(--accent-bright)">€</text>
      <text x="56" y="126" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">vue · shop · tea</text>
    </svg>

    <!-- spatial : vr -->
    <svg v-else-if="visual === 'spatial'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-orbit" fill="none" stroke="var(--accent-2)" stroke-opacity="0.6">
        <circle cx="160" cy="70" r="46" />
        <circle cx="160" cy="70" r="30" opacity="0.7" />
        <circle cx="160" cy="70" r="14" stroke="var(--accent)" />
      </g>
      <g stroke="rgba(230,241,255,0.5)">
        <path d="M114 70 H70 M250 70 H206 M160 24 V8 M160 132 V116" />
      </g>
      <path d="M120 96 Q160 118 200 96" stroke="var(--accent-3)" fill="none" stroke-width="2" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">hmd · spatial audio · 6dof</text>
    </svg>

    <!-- cards -->
    <svg v-else-if="visual === 'cards'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g>
        <rect class="pv-card pv-card-a" x="60" y="30" width="80" height="95" rx="8" fill="#0d1626" stroke="var(--accent-bright)" stroke-opacity="0.6" transform="rotate(-8 100 77)" />
        <rect class="pv-card pv-card-b" x="120" y="26" width="80" height="95" rx="8" fill="#0e1a2e" stroke="var(--accent-2)" stroke-opacity="0.6" />
        <rect class="pv-card pv-card-c" x="180" y="30" width="80" height="95" rx="8" fill="#0b1424" stroke="var(--accent)" stroke-opacity="0.6" transform="rotate(8 220 77)" />
        <text x="137" y="70" font-family="monospace" font-size="16" fill="#e6f1ff">A♠</text>
        <text x="137" y="90" font-family="monospace" font-size="8" fill="#93a1b8">generator</text>
      </g>
    </svg>

    <!-- signal : lora -->
    <svg v-else-if="visual === 'signal'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--accent-3)" stroke-opacity="0.65">
        <path d="M40 110 Q80 110 80 75 Q80 40 120 40" stroke-width="1.6" />
        <circle class="pv-node" cx="40" cy="110" r="4" fill="var(--accent-3)" stroke="none" />
        <circle class="pv-node" cx="120" cy="40" r="4" fill="var(--accent)" stroke="none" />
      </g>
      <g class="pv-signal" stroke="var(--accent)" stroke-opacity="0.5">
        <path d="M120 40 m-14 0 a14 14 0 0 1 28 0" fill="none" />
        <path d="M120 40 m-24 0 a24 24 0 0 1 48 0" fill="none" opacity="0.6" />
        <path d="M120 40 m-34 0 a34 34 0 0 1 68 0" fill="none" opacity="0.35" />
      </g>
      <text x="180" y="120" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">lora · 868mhz · ctl</text>
    </svg>

    <!-- matrix : webgl face of falling digital rain -->
    <svg v-else-if="visual === 'matrix'" ref="matrixSvg" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="150" fill="#020604" />
      <ellipse class="pv-orbit" cx="160" cy="75" rx="52" ry="62" fill="none" stroke="var(--accent)" stroke-opacity="0.35" stroke-width="1.5" />
      <g font-family="monospace" font-size="12" text-anchor="middle">
        <g class="pv-rain" fill="var(--accent)">
          <text x="120" y="34">ﾊ</text><text x="140" y="52">ﾐ</text><text x="160" y="30">ﾋ</text>
          <text x="180" y="50">ｰ</text><text x="200" y="36">ｳ</text><text x="150" y="86">ｼ</text>
          <text x="170" y="104">ﾅ</text><text x="130" y="116">ﾓ</text><text x="190" y="122">ﾊ</text>
        </g>
        <g class="pv-rain" fill="var(--accent)" fill-opacity="0.55">
          <text x="120" y="52">ﾐ</text><text x="140" y="70">ﾋ</text><text x="160" y="48">ｰ</text>
          <text x="180" y="68">ｳ</text><text x="200" y="54">ｼ</text><text x="150" y="104">ﾅ</text>
          <text x="170" y="122">ﾓ</text><text x="130" y="134">ﾊ</text><text x="190" y="140">ﾐ</text>
          <text x="110" y="90">1</text><text x="210" y="96">0</text>
        </g>
        <g class="pv-rain" fill="var(--accent)" fill-opacity="0.28">
          <text x="120" y="70">ﾋ</text><text x="140" y="88">ｰ</text><text x="160" y="66">ｳ</text>
          <text x="180" y="86">ｼ</text><text x="200" y="72">ﾅ</text><text x="150" y="122">ﾓ</text>
          <text x="100" y="60">0</text><text x="220" y="70">1</text><text x="110" y="108">ﾊ</text><text x="210" y="114">ﾐ</text>
        </g>
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">webgl · normal-mapped rain</text>
    </svg>

    <!-- blend : noise-mask texture blending -->
    <svg v-else-if="visual === 'blend'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect x="36" y="18" width="248" height="114" rx="8" fill="none" stroke="rgba(148,178,255,0.3)" />
      <path class="pv-blend" d="M36 76 Q96 96 150 70 Q204 44 284 72" fill="none" stroke="var(--accent)" stroke-opacity="0.25" stroke-width="7" />
      <path class="pv-blend" d="M36 76 Q96 96 150 70 Q204 44 284 72" fill="none" stroke="var(--accent)" stroke-width="1.8" />
      <rect class="pv-blend-box" x="52" y="30" width="70" height="30" rx="4" fill="var(--accent)" fill-opacity="0.10" stroke="var(--accent)" stroke-opacity="0.6" />
      <rect class="pv-blend-box" x="198" y="90" width="70" height="30" rx="4" fill="var(--accent-bright)" fill-opacity="0.08" stroke="var(--accent-bright)" stroke-opacity="0.55" />
      <text x="60" y="49" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.9">grass</text>
      <text x="210" y="109" font-family="monospace" font-size="9" fill="var(--accent-bright)" fill-opacity="0.9">sand</text>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">glsl · noise-mask blend</text>
    </svg>

    <!-- water : fft-driven wave mesh -->
    <svg v-else-if="visual === 'water'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-bars" fill="var(--accent)" fill-opacity="0.5">
        <rect x="40" y="30" width="5" height="34" rx="2" /><rect x="70" y="22" width="5" height="42" rx="2" />
        <rect x="100" y="36" width="5" height="28" rx="2" /><rect x="130" y="18" width="5" height="46" rx="2" />
        <rect x="160" y="30" width="5" height="34" rx="2" /><rect x="190" y="24" width="5" height="40" rx="2" />
        <rect x="220" y="34" width="5" height="30" rx="2" /><rect x="250" y="20" width="5" height="44" rx="2" />
      </g>
      <g class="pv-waves" fill="none" stroke-linecap="round">
        <path d="M0 96 Q 20 88 40 96 T 80 96 T 120 96 T 160 96 T 200 96 T 240 96 T 280 96 T 320 96" stroke="var(--accent-2)" stroke-opacity="0.8" stroke-width="2" />
        <path d="M0 108 Q 20 100 40 108 T 80 108 T 120 108 T 160 108 T 200 108 T 240 108 T 280 108 T 320 108" stroke="var(--accent)" stroke-opacity="0.5" stroke-width="1.5" />
        <path d="M0 120 Q 20 114 40 120 T 80 120 T 120 120 T 160 120 T 200 120 T 240 120 T 280 120 T 320 120" stroke="var(--accent-2)" stroke-opacity="0.3" stroke-width="1.2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft wave mesh</text>
    </svg>

    <!-- perlin : concentric noise circles -->
    <svg v-else-if="visual === 'perlin'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-rings" fill="none" stroke="var(--accent)" stroke-opacity="0.65">
        <circle cx="160" cy="72" r="14" />
        <circle cx="160" cy="72" r="24" opacity="0.8" stroke-dasharray="6 4" />
        <circle cx="160" cy="72" r="35" opacity="0.6" />
        <circle cx="160" cy="72" r="47" opacity="0.45" stroke-dasharray="3 5" />
        <circle cx="160" cy="72" r="60" opacity="0.3" />
      </g>
      <circle class="pv-node" cx="160" cy="72" r="3.5" fill="var(--accent)" stroke="none" />
      <g class="pv-bars" fill="var(--accent-2)" fill-opacity="0.55">
        <rect x="36" y="60" width="4" height="24" rx="2" /><rect x="272" y="56" width="4" height="32" rx="2" />
        <rect x="52" y="70" width="4" height="16" rx="2" /><rect x="258" y="68" width="4" height="20" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">256 perlin circles</text>
    </svg>

    <!-- sphere : fft-displaced wireframe sphere -->
    <svg v-else-if="visual === 'sphere'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-sphere" fill="none" stroke="var(--accent-2)" stroke-opacity="0.65">
        <circle cx="148" cy="72" r="44" />
        <ellipse cx="148" cy="72" rx="44" ry="16" opacity="0.8" />
        <ellipse cx="148" cy="72" rx="16" ry="44" opacity="0.8" stroke="var(--accent)" />
        <ellipse cx="148" cy="72" rx="30" ry="44" opacity="0.4" />
        <path d="M104 72 H192" opacity="0.5" />
      </g>
      <g class="pv-bars" fill="var(--accent)" fill-opacity="0.6">
        <rect x="216" y="96" width="6" height="18" rx="2" /><rect x="228" y="86" width="6" height="28" rx="2" />
        <rect x="240" y="92" width="6" height="22" rx="2" /><rect x="252" y="78" width="6" height="36" rx="2" />
        <rect x="264" y="90" width="6" height="24" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft sphere verts</text>
    </svg>

    <!-- polar : radial perlin rings -->
    <svg v-else-if="visual === 'polar'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-spin-slow" stroke="var(--accent-3)" stroke-opacity="0.6" fill="none">
        <circle cx="160" cy="72" r="20" />
        <circle cx="160" cy="72" r="34" opacity="0.7" />
        <circle cx="160" cy="72" r="48" opacity="0.45" stroke-dasharray="4 4" />
        <path d="M160 22 V122 M110 72 H210 M125 37 L195 107 M195 37 L125 107" opacity="0.3" />
      </g>
      <g class="pv-twinkle" fill="var(--accent-3)" stroke="none">
        <circle cx="160" cy="52" r="3" opacity="0.9" /><circle cx="180" cy="72" r="3" opacity="0.7" />
        <circle cx="160" cy="92" r="3" opacity="0.5" /><circle cx="140" cy="72" r="3" opacity="0.8" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">128 polar rings</text>
    </svg>

    <!-- spiral : noise-driven spiral -->
    <svg v-else-if="visual === 'spiral'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path class="pv-spiral" d="M160 72 a5 5 0 0 1 5 5 a10 10 0 0 1 -10 10 a15 15 0 0 1 -15 -15 a20 20 0 0 1 20 -20 a25 25 0 0 1 25 25 a30 30 0 0 1 -30 30 a35 35 0 0 1 -35 -35 a40 40 0 0 1 40 -40" fill="none" stroke="var(--accent-3)" stroke-opacity="0.7" stroke-width="1.6" />
      <circle class="pv-node" cx="160" cy="72" r="3" fill="var(--accent-3)" stroke="none" />
      <g class="pv-bars" fill="var(--accent-3)" fill-opacity="0.5">
        <rect x="252" y="88" width="5" height="26" rx="2" /><rect x="264" y="78" width="5" height="36" rx="2" /><rect x="276" y="92" width="5" height="22" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">noise spiral</text>
    </svg>

    <!-- radial : fft-driven radial blur -->
    <svg v-else-if="visual === 'radial'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-spin-fast" stroke="var(--accent-2)" stroke-opacity="0.55" fill="none">
        <path d="M160 72 L160 14 M160 72 L160 130 M160 72 L102 72 M160 72 L218 72 M160 72 L119 31 M160 72 L201 113 M160 72 L201 31 M160 72 L119 113" opacity="0.6" />
        <circle cx="160" cy="72" r="18" stroke="var(--accent)" />
        <circle cx="160" cy="72" r="34" opacity="0.6" stroke-dasharray="5 4" />
        <circle cx="160" cy="72" r="50" opacity="0.35" />
      </g>
      <circle class="pv-node" cx="160" cy="72" r="4" fill="var(--accent-2)" stroke="none" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">256-tap radial blur</text>
    </svg>

    <!-- ripple : fft-driven uv ripple -->
    <svg v-else-if="visual === 'ripple'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-ripple" fill="none" stroke="var(--accent)" stroke-opacity="0.65">
        <ellipse cx="160" cy="78" rx="24" ry="9" />
        <ellipse cx="160" cy="78" rx="44" ry="15" opacity="0.55" />
        <ellipse cx="160" cy="78" rx="66" ry="22" opacity="0.35" />
        <ellipse cx="160" cy="78" rx="88" ry="29" opacity="0.2" />
      </g>
      <circle class="pv-drop" cx="160" cy="40" r="5" fill="none" stroke="var(--accent-2)" stroke-opacity="0.8" />
      <path class="pv-drop" d="M160 48 V64" stroke="var(--accent-2)" stroke-opacity="0.5" stroke-dasharray="2 3" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft ripple</text>
    </svg>

    <!-- rings : spring campus -->
    <svg v-else-if="visual === 'rings'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-rings" fill="none">
        <circle cx="160" cy="72" r="52" stroke="rgba(148,178,255,0.35)" stroke-dasharray="6 5" />
        <circle cx="160" cy="72" r="36" stroke="var(--accent)" stroke-opacity="0.6" />
        <circle cx="160" cy="72" r="20" stroke="var(--accent-2)" stroke-opacity="0.7" />
        <circle cx="160" cy="72" r="5" fill="var(--accent)" stroke="none" />
      </g>
      <text x="14" y="136" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">spring-campus · 2019</text>
    </svg>

    <!-- space : infinity-edge-web — XNA 2013 game ported to WebGL2 -->
    <svg v-else-if="visual === 'space'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g class="pv-stars" fill="rgba(230,241,255,0.85)">
        <circle cx="30" cy="26" r="1.1" />
        <circle cx="74" cy="16" r="0.8" opacity="0.65" />
        <circle cx="118" cy="34" r="1" opacity="0.8" />
        <circle cx="236" cy="20" r="1.2" />
        <circle cx="284" cy="38" r="0.9" opacity="0.7" />
        <circle cx="262" cy="112" r="1" opacity="0.75" />
        <circle cx="46" cy="112" r="0.9" opacity="0.6" />
        <circle cx="198" cy="18" r="0.7" opacity="0.5" />
        <circle cx="300" cy="84" r="0.8" opacity="0.6" />
        <circle cx="16" cy="72" r="0.8" opacity="0.55" />
      </g>
      <g class="pv-orbit" fill="none">
        <circle cx="160" cy="68" r="54" stroke="var(--accent)" stroke-opacity="0.85" stroke-width="7" />
        <circle cx="160" cy="68" r="34" stroke="rgba(148,178,255,0.4)" />
        <circle cx="160" cy="68" r="19" stroke="rgba(148,178,255,0.3)" />
      </g>
      <g class="pv-ship">
        <ellipse cx="186" cy="108" rx="30" ry="8" fill="rgba(226,232,240,0.16)" />
        <ellipse cx="164" cy="112" rx="18" ry="6" fill="rgba(226,232,240,0.26)" />
        <polygon points="160,84 184,102 160,106 136,102" fill="#cbd5e1" />
        <polygon points="142,102 178,102 160,94" fill="#94a3b8" />
        <circle cx="150" cy="103" r="3.4" fill="var(--accent-2)" opacity="0.35" />
        <circle cx="170" cy="103" r="3.4" fill="var(--accent-2)" opacity="0.35" />
        <circle cx="150" cy="103" r="1.6" fill="var(--accent-2)" />
        <circle cx="170" cy="103" r="1.6" fill="var(--accent-2)" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">xna · 2013 → webgl2</text>
    </svg>

    <div class="scan" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({ visual: { type: String, default: 'grid' } })

// The Matrix rain gets its symbols replaced while the CSS animation scrolls
// them. Only the matrix variant starts this timer.
const matrixSvg = ref(null)
let matrixTimer = 0
const matrixGlyphs = ['ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ﾂ', 'ﾃ', 'ｷ', 'ｸ', '0', '1', '7', '4']

function mutateMatrix() {
  const glyphs = matrixSvg.value?.querySelectorAll('.pv-rain text')
  if (!glyphs?.length) return
  for (const glyph of glyphs) {
    if (Math.random() < 0.38) {
      glyph.textContent = matrixGlyphs[Math.floor(Math.random() * matrixGlyphs.length)]
    }
  }
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (props.visual === 'matrix' && !reduced) {
    matrixTimer = window.setInterval(mutateMatrix, 140)
  }
})
onBeforeUnmount(() => window.clearInterval(matrixTimer))
</script>

<style scoped>
.visual {
  position: relative;
  height: 150px;
  overflow: hidden;
  content-visibility: auto;
  background:
    linear-gradient(rgba(148,178,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,178,255,0.06) 1px, transparent 1px),
    radial-gradient(320px 150px at 30% 20%, var(--accent-glow), transparent 70%),
    #070b14;
  background-size: 22px 22px, 22px 22px, cover, cover;
  border-bottom: 1px solid var(--line);
}
.visual svg { width: 100%; height: 100%; display: block; }
.visual::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 68%);
  opacity: calc(0.08 + var(--energy, 0) * 0.22);
  transform: scale(calc(0.9 + var(--kick, 0) * 0.16));
  transition: opacity 70ms linear, transform 70ms linear;
}
.scan {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--accent) 8%, transparent) 50%, transparent 100%);
  background-size: 100% 46px;
}
.v-wireframe { box-shadow: inset 0 0 60px color-mix(in srgb, var(--accent) 8%, transparent); }

/* Every shape below gets its own music-driven motion. */
.pv-tri,
.pv-node,
.pv-nodes circle,
.pv-smoke-glow,
.pv-smoke-rings,
.pv-terrain,
.pv-grid,
.pv-cube,
.pv-wobble,
.pv-steam,
.pv-card,
.pv-signal,
.pv-blend,
.pv-blend-box,
.pv-orbit,
.pv-sphere,
.pv-spin-slow,
.pv-spiral,
.pv-spin-fast,
.pv-ripple,
.pv-drop,
.pv-stars,
.pv-ship,
.pv-rings,
.pv-sine,
.pv-waves,
.pv-rain text {
  transform-box: fill-box;
  transform-origin: center;
}
.pv-bars rect {
  transform-box: fill-box;
  transform-origin: center bottom;
}

@media (prefers-reduced-motion: no-preference) {
  .visual svg {
    transform-origin: 50% 50%;
    animation: pv-breathe calc(var(--motion-speed, 2.4s) * 3.2) ease-in-out infinite alternate;
  }
  .scan {
    animation: pv-scan calc(var(--motion-speed, 2.4s) * 2.6) linear infinite;
  }
  .eq {
    animation: eq calc(var(--motion-speed, 2.4s) * 0.8) ease-in-out infinite alternate;
  }

  .pv-tri {
    animation: pv-float-y calc(var(--motion-speed, 2.4s) * 2.6) ease-in-out infinite alternate;
  }
  .pv-tri:nth-of-type(2) { animation-delay: calc(var(--motion-speed, 2.4s) * -0.7); }
  .pv-tri:nth-of-type(3) { animation-delay: calc(var(--motion-speed, 2.4s) * -1.3); }

  .pv-node {
    animation: pv-node-pop calc(var(--motion-speed, 2.4s) * 1.6) ease-in-out infinite;
  }
  .pv-nodes circle {
    animation: pv-node-pop calc(var(--motion-speed, 2.4s) * 2) ease-in-out infinite;
  }
  .pv-nodes circle:nth-child(2n) { animation-delay: calc(var(--motion-speed, 2.4s) * -0.7); }
  .pv-nodes circle:nth-child(3n) { animation-delay: calc(var(--motion-speed, 2.4s) * -1.1); }

  .pv-flow path {
    stroke-dasharray: 4 6;
    animation: pv-flow calc(var(--motion-speed, 2.4s) * 2) linear infinite;
  }

  .pv-smoke-glow {
    animation: pv-smoke-glow calc(var(--motion-speed, 2.4s) * 4) ease-in-out infinite alternate;
  }
  .pv-smoke-glow:nth-of-type(2) { animation-delay: calc(var(--motion-speed, 2.4s) * -1.8); }
  .pv-smoke-rings {
    animation: pv-float-y calc(var(--motion-speed, 2.4s) * 3.4) ease-in-out infinite alternate;
  }

  .pv-terrain {
    transform-origin: center bottom;
    animation: pv-terrain calc(var(--motion-speed, 2.4s) * 3.6) ease-in-out infinite alternate;
  }
  .pv-grid {
    animation: pv-float-x calc(var(--motion-speed, 2.4s) * 5) ease-in-out infinite alternate;
  }

  .pv-cursor { animation: pv-blink 1s steps(2, jump-none) infinite; }

  .pv-sine {
    animation: pv-sine calc(var(--motion-speed, 2.4s) * 3.6) ease-in-out infinite alternate;
  }
  .pv-sine-alt {
    animation-direction: alternate-reverse;
    animation-delay: calc(var(--motion-speed, 2.4s) * -1.2);
  }
  .pv-waves {
    animation: pv-sine calc(var(--motion-speed, 2.4s) * 3.2) ease-in-out infinite alternate;
  }

  .pv-bars rect {
    animation: pv-bar calc(var(--motion-speed, 2.4s) * 1.2) ease-in-out infinite alternate;
  }
  .pv-bars rect:nth-child(2n) { animation-delay: calc(var(--motion-speed, 2.4s) * -0.4); }
  .pv-bars rect:nth-child(3n) { animation-delay: calc(var(--motion-speed, 2.4s) * -0.8); }

  .pv-cube {
    animation: pv-cube calc(var(--motion-speed, 2.4s) * 3.4) ease-in-out infinite alternate;
  }
  .pv-wobble {
    animation: pv-wobble calc(var(--motion-speed, 2.4s) * 2.8) ease-in-out infinite alternate;
  }
  .pv-steam {
    animation: pv-steam calc(var(--motion-speed, 2.4s) * 2.6) ease-in-out infinite;
  }

  .pv-card {
    animation: pv-card calc(var(--motion-speed, 2.4s) * 2.8) ease-in-out infinite alternate;
  }
  .pv-card-a { animation-delay: calc(var(--motion-speed, 2.4s) * -0.4); }
  .pv-card-b { animation-delay: calc(var(--motion-speed, 2.4s) * -0.9); }
  .pv-card-c { animation-delay: calc(var(--motion-speed, 2.4s) * -1.4); }

  .pv-signal {
    animation: pv-signal calc(var(--motion-speed, 2.4s) * 1.6) ease-in-out infinite;
  }

  .pv-rain text {
    animation: pv-rain calc(var(--motion-speed, 2.4s) * 2.4) linear infinite;
  }
  .pv-rain text:nth-child(2n) { animation-delay: calc(var(--motion-speed, 2.4s) * -0.6); }
  .pv-rain text:nth-child(3n) { animation-delay: calc(var(--motion-speed, 2.4s) * -1.2); }
  .pv-rain:nth-of-type(2) text { animation-duration: calc(var(--motion-speed, 2.4s) * 3.2); }
  .pv-rain:nth-of-type(3) text { animation-duration: calc(var(--motion-speed, 2.4s) * 4.1); }

  .pv-blend {
    animation: pv-float-x calc(var(--motion-speed, 2.4s) * 2.6) ease-in-out infinite alternate;
  }
  .pv-blend-box {
    animation: pv-node-pop calc(var(--motion-speed, 2.4s) * 2) ease-in-out infinite;
  }

  .pv-orbit {
    animation: pv-orbit calc(var(--motion-speed, 2.4s) * 3.2) ease-in-out infinite alternate;
  }
  .pv-spin-slow,
  .pv-sphere,
  .pv-spiral,
  .pv-spin-fast {
    animation: pv-spin linear infinite;
  }
  .pv-spin-slow { animation-duration: calc(var(--motion-speed, 2.4s) * 16); }
  .pv-sphere { animation-duration: calc(var(--motion-speed, 2.4s) * 22); }
  .pv-spiral { animation-duration: calc(var(--motion-speed, 2.4s) * 14); animation-direction: reverse; }
  .pv-spin-fast { animation-duration: calc(var(--motion-speed, 2.4s) * 8); }

  .pv-rings {
    animation: pv-rings calc(var(--motion-speed, 2.4s) * 2.6) ease-in-out infinite;
  }
  .pv-ripple {
    animation: pv-ripple calc(var(--motion-speed, 2.4s) * 2.4) ease-out infinite;
  }
  .pv-drop {
    animation: pv-drop calc(var(--motion-speed, 2.4s) * 2) ease-in infinite;
  }
  .pv-stars {
    animation: pv-stars calc(var(--motion-speed, 2.4s) * 3.2) ease-in-out infinite alternate;
  }
  .pv-ship {
    animation: pv-ship calc(var(--motion-speed, 2.4s) * 3) ease-in-out infinite alternate;
  }
  .pv-twinkle {
    animation: pv-twinkle calc(var(--motion-speed, 2.4s) * 1.8) ease-in-out infinite;
  }
}

@keyframes pv-breathe {
  from { transform: scale(1); }
  to { transform: scale(1.014); }
}
@keyframes pv-scan {
  from { background-position: 0 0; }
  to { background-position: 0 46px; }
}
@keyframes eq { from { transform: scaleY(0.85); } to { transform: scaleY(1.08); } }
@keyframes pv-float-x {
  from { translate: -3px 0; }
  to { translate: 3px 0; }
}
@keyframes pv-float-y {
  from { translate: 0 1px; }
  to { translate: 0 -3px; }
}
@keyframes pv-node-pop {
  0%, 100% { scale: 1; opacity: 0.65; }
  50% { scale: calc(1.12 + var(--kick, 0) * 0.3); opacity: 1; }
}
@keyframes pv-flow {
  to { stroke-dashoffset: -20; }
}
@keyframes pv-smoke-glow {
  from { scale: 0.97; opacity: 0.55; }
  to { scale: calc(1.03 + var(--kick, 0) * 0.04); opacity: 1; }
}
@keyframes pv-terrain {
  from { scale: 1.04 1; translate: -3px 1px; }
  to { scale: 1.04 1; translate: 3px -2px; }
}
@keyframes pv-blink {
  50% { opacity: 0; }
}
@keyframes pv-sine {
  from { translate: -4px 0; }
  to { translate: 4px 0; }
}
@keyframes pv-bar {
  from { scale: 1 0.45; }
  to { scale: 1 calc(0.82 + var(--kick, 0) * 0.45); }
}
@keyframes pv-cube {
  from { translate: 0 1px; rotate: -1deg; }
  to { translate: 2px -3px; rotate: 2deg; }
}
@keyframes pv-wobble {
  from { rotate: -1.5deg; }
  to { rotate: 1.5deg; }
}
@keyframes pv-steam {
  0% { translate: 0 2px; opacity: 0.25; }
  55% { opacity: 0.9; }
  100% { translate: 0 -7px; opacity: 0; }
}
@keyframes pv-card {
  from { translate: 0 3px; rotate: -3deg; scale: 0.96 1; }
  to { translate: 0 -3px; rotate: 3deg; scale: 1.04 1; }
}
@keyframes pv-signal {
  0%, 100% { scale: 0.94; opacity: 0.45; }
  50% { scale: calc(1.06 + var(--snare, 0) * 0.1); opacity: 1; }
}
@keyframes pv-rain {
  0% { translate: 0 -16px; opacity: 0; }
  16%, 82% { opacity: 1; }
  100% { translate: 0 22px; opacity: 0; }
}
@keyframes pv-orbit {
  from { scale: 0.97; }
  to { scale: calc(1.03 + var(--kick, 0) * 0.03); }
}
@keyframes pv-spin {
  to { rotate: 360deg; }
}
@keyframes pv-rings {
  0%, 100% { scale: 0.96; opacity: 0.65; }
  50% { scale: calc(1.04 + var(--kick, 0) * 0.05); opacity: 1; }
}
@keyframes pv-ripple {
  0% { scale: 0.9; opacity: 0.9; }
  100% { scale: calc(1.14 + var(--kick, 0) * 0.08); opacity: 0; }
}
@keyframes pv-drop {
  0% { translate: 0 -10px; opacity: 0; }
  20% { opacity: 1; }
  100% { translate: 0 18px; opacity: 0; }
}
@keyframes pv-stars {
  from { opacity: 0.4; translate: 0 0; }
  to { opacity: 1; translate: 0 -2px; }
}
@keyframes pv-ship {
  from { translate: -5px 2px; rotate: -3deg; }
  to { translate: 5px -2px; rotate: 3deg; }
}
@keyframes pv-twinkle {
  0%, 100% { opacity: 0.35; }
  50% { opacity: calc(0.7 + var(--snare, 0) * 0.3); }
}
</style>
