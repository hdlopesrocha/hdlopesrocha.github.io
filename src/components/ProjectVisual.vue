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

    <!-- audio3d : spring-campus music visualization (3d + webaudio) -->
    <svg v-else-if="visual === 'audio3d'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(56,189,248,0.4)" fill="none">
        <path d="M0 118 H320" />
        <path d="M20 150 L160 118 M70 150 L160 118 M120 150 L160 118 M160 150 L160 118 M200 150 L160 118 M250 150 L160 118 M300 150 L160 118" opacity="0.55" />
      </g>
      <g fill="none" stroke="rgba(45,212,191,0.7)">
        <rect x="36" y="44" width="52" height="52" />
        <rect x="54" y="30" width="52" height="52" opacity="0.8" />
        <path d="M36 44 L54 30 M88 44 L106 30 M36 96 L54 82 M88 96 L106 82" opacity="0.8" />
      </g>
      <circle cx="54" cy="30" r="3" fill="#2dd4bf" stroke="none" />
      <g>
        <rect x="150" y="112" width="8" height="20" rx="2" fill="rgba(167,139,250,0.65)" />
        <rect x="164" y="98" width="8" height="34" rx="2" fill="rgba(45,212,191,0.65)" />
        <rect x="178" y="84" width="8" height="48" rx="2" fill="rgba(167,139,250,0.65)" />
        <rect x="192" y="104" width="8" height="28" rx="2" fill="rgba(45,212,191,0.65)" />
        <rect x="206" y="76" width="8" height="56" rx="2" fill="rgba(167,139,250,0.8)" />
        <rect x="220" y="92" width="8" height="40" rx="2" fill="rgba(45,212,191,0.65)" />
        <rect x="234" y="68" width="8" height="64" rx="2" fill="rgba(167,139,250,0.8)" />
        <rect x="248" y="96" width="8" height="36" rx="2" fill="rgba(45,212,191,0.65)" />
        <rect x="262" y="80" width="8" height="52" rx="2" fill="rgba(167,139,250,0.65)" />
        <rect x="276" y="108" width="8" height="24" rx="2" fill="rgba(45,212,191,0.65)" />
        <rect x="290" y="88" width="8" height="44" rx="2" fill="rgba(167,139,250,0.65)" />
      </g>
      <text x="14" y="20" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">webAudio → canvas · webgl</text>
    </svg>

    <!-- teashop : mobarrocas tea shop website -->
    <svg v-else-if="visual === 'teashop'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect x="44" y="16" width="232" height="118" rx="8" fill="rgba(5,7,13,0.8)" stroke="rgba(148,178,255,0.35)" />
      <path d="M44 40 H276" stroke="rgba(148,178,255,0.35)" />
      <circle cx="58" cy="28" r="3" fill="#2dd4bf" stroke="none" opacity="0.8" />
      <circle cx="70" cy="28" r="3" fill="#38bdf8" stroke="none" opacity="0.8" />
      <circle cx="82" cy="28" r="3" fill="#a78bfa" stroke="none" opacity="0.8" />
      <rect x="96" y="22" width="150" height="12" rx="6" fill="none" stroke="rgba(148,178,255,0.3)" />
      <text x="104" y="31" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">mobarrocas · shop</text>
      <g fill="none" stroke="rgba(45,212,191,0.75)" stroke-width="1.5">
        <path d="M120 70 h44 l-6 34 h-32 z" />
        <path d="M164 74 q16 2 12 16 q-3 12 -16 10" />
        <path d="M112 112 H176" stroke="rgba(148,178,255,0.4)" />
      </g>
      <g fill="none" stroke="rgba(56,189,248,0.7)" stroke-width="1.5" stroke-linecap="round">
        <path d="M134 62 q-6 -8 0 -16 q6 -8 0 -14" />
        <path d="M148 62 q-6 -8 0 -16 q6 -8 0 -14" opacity="0.6" />
      </g>
      <g fill="none" stroke="rgba(251,191,36,0.7)" stroke-width="1.5">
        <rect x="196" y="80" width="34" height="30" rx="3" />
        <path d="M203 80 q0 -12 10 -12 q10 0 10 12" />
      </g>
      <text x="203" y="99" font-family="monospace" font-size="11" fill="#fde68a">€</text>
      <text x="56" y="126" font-family="monospace" font-size="8" fill="rgba(147,161,184,0.9)">vue · shop · tea</text>
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

    <!-- matrix : webgl face of falling digital rain -->
    <svg v-else-if="visual === 'matrix'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="150" fill="#020604" />
      <ellipse cx="160" cy="75" rx="52" ry="62" fill="none" stroke="rgba(34,197,94,0.35)" stroke-width="1.5" />
      <g font-family="monospace" font-size="12" text-anchor="middle">
        <g fill="#4ade80">
          <text x="120" y="34">ﾊ</text><text x="140" y="52">ﾐ</text><text x="160" y="30">ﾋ</text>
          <text x="180" y="50">ｰ</text><text x="200" y="36">ｳ</text><text x="150" y="86">ｼ</text>
          <text x="170" y="104">ﾅ</text><text x="130" y="116">ﾓ</text><text x="190" y="122">ﾊ</text>
        </g>
        <g fill="rgba(34,197,94,0.55)">
          <text x="120" y="52">ﾐ</text><text x="140" y="70">ﾋ</text><text x="160" y="48">ｰ</text>
          <text x="180" y="68">ｳ</text><text x="200" y="54">ｼ</text><text x="150" y="104">ﾅ</text>
          <text x="170" y="122">ﾓ</text><text x="130" y="134">ﾊ</text><text x="190" y="140">ﾐ</text>
          <text x="110" y="90">1</text><text x="210" y="96">0</text>
        </g>
        <g fill="rgba(34,197,94,0.28)">
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
      <path d="M36 76 Q96 96 150 70 Q204 44 284 72" fill="none" stroke="rgba(45,212,191,0.25)" stroke-width="7" />
      <path d="M36 76 Q96 96 150 70 Q204 44 284 72" fill="none" stroke="#2dd4bf" stroke-width="1.8" />
      <rect x="52" y="30" width="70" height="30" rx="4" fill="rgba(45,212,191,0.10)" stroke="rgba(45,212,191,0.6)" />
      <rect x="198" y="90" width="70" height="30" rx="4" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.55)" />
      <text x="60" y="49" font-family="monospace" font-size="9" fill="rgba(153,246,228,0.9)">grass</text>
      <text x="210" y="109" font-family="monospace" font-size="9" fill="rgba(253,230,138,0.9)">sand</text>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">glsl · noise-mask blend</text>
    </svg>

    <!-- water : fft-driven wave mesh -->
    <svg v-else-if="visual === 'water'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="rgba(45,212,191,0.5)">
        <rect x="40" y="30" width="5" height="34" rx="2" /><rect x="70" y="22" width="5" height="42" rx="2" />
        <rect x="100" y="36" width="5" height="28" rx="2" /><rect x="130" y="18" width="5" height="46" rx="2" />
        <rect x="160" y="30" width="5" height="34" rx="2" /><rect x="190" y="24" width="5" height="40" rx="2" />
        <rect x="220" y="34" width="5" height="30" rx="2" /><rect x="250" y="20" width="5" height="44" rx="2" />
      </g>
      <g fill="none" stroke-linecap="round">
        <path d="M0 96 Q 20 88 40 96 T 80 96 T 120 96 T 160 96 T 200 96 T 240 96 T 280 96 T 320 96" stroke="rgba(56,189,248,0.8)" stroke-width="2" />
        <path d="M0 108 Q 20 100 40 108 T 80 108 T 120 108 T 160 108 T 200 108 T 240 108 T 280 108 T 320 108" stroke="rgba(45,212,191,0.5)" stroke-width="1.5" />
        <path d="M0 120 Q 20 114 40 120 T 80 120 T 120 120 T 160 120 T 200 120 T 240 120 T 280 120 T 320 120" stroke="rgba(56,189,248,0.3)" stroke-width="1.2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft wave mesh</text>
    </svg>

    <!-- perlin : concentric noise circles -->
    <svg v-else-if="visual === 'perlin'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(45,212,191,0.65)">
        <circle cx="160" cy="72" r="14" />
        <circle cx="160" cy="72" r="24" opacity="0.8" stroke-dasharray="6 4" />
        <circle cx="160" cy="72" r="35" opacity="0.6" />
        <circle cx="160" cy="72" r="47" opacity="0.45" stroke-dasharray="3 5" />
        <circle cx="160" cy="72" r="60" opacity="0.3" />
      </g>
      <circle cx="160" cy="72" r="3.5" fill="#2dd4bf" stroke="none" />
      <g fill="rgba(56,189,248,0.55)">
        <rect x="36" y="60" width="4" height="24" rx="2" /><rect x="272" y="56" width="4" height="32" rx="2" />
        <rect x="52" y="70" width="4" height="16" rx="2" /><rect x="258" y="68" width="4" height="20" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">256 perlin circles</text>
    </svg>

    <!-- sphere : fft-displaced wireframe sphere -->
    <svg v-else-if="visual === 'sphere'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(56,189,248,0.65)">
        <circle cx="148" cy="72" r="44" />
        <ellipse cx="148" cy="72" rx="44" ry="16" opacity="0.8" />
        <ellipse cx="148" cy="72" rx="16" ry="44" opacity="0.8" stroke="#2dd4bf" />
        <ellipse cx="148" cy="72" rx="30" ry="44" opacity="0.4" />
        <path d="M104 72 H192" opacity="0.5" />
      </g>
      <g fill="rgba(45,212,191,0.6)">
        <rect x="216" y="96" width="6" height="18" rx="2" /><rect x="228" y="86" width="6" height="28" rx="2" />
        <rect x="240" y="92" width="6" height="22" rx="2" /><rect x="252" y="78" width="6" height="36" rx="2" />
        <rect x="264" y="90" width="6" height="24" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft sphere verts</text>
    </svg>

    <!-- polar : radial perlin rings -->
    <svg v-else-if="visual === 'polar'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(167,139,250,0.6)" fill="none">
        <circle cx="160" cy="72" r="20" />
        <circle cx="160" cy="72" r="34" opacity="0.7" />
        <circle cx="160" cy="72" r="48" opacity="0.45" stroke-dasharray="4 4" />
        <path d="M160 22 V122 M110 72 H210 M125 37 L195 107 M195 37 L125 107" opacity="0.3" />
      </g>
      <g fill="#a78bfa" stroke="none">
        <circle cx="160" cy="52" r="3" opacity="0.9" /><circle cx="180" cy="72" r="3" opacity="0.7" />
        <circle cx="160" cy="92" r="3" opacity="0.5" /><circle cx="140" cy="72" r="3" opacity="0.8" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">128 polar rings</text>
    </svg>

    <!-- spiral : noise-driven spiral -->
    <svg v-else-if="visual === 'spiral'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <path d="M160 72 a5 5 0 0 1 5 5 a10 10 0 0 1 -10 10 a15 15 0 0 1 -15 -15 a20 20 0 0 1 20 -20 a25 25 0 0 1 25 25 a30 30 0 0 1 -30 30 a35 35 0 0 1 -35 -35 a40 40 0 0 1 40 -40" fill="none" stroke="rgba(244,114,182,0.7)" stroke-width="1.6" />
      <circle cx="160" cy="72" r="3" fill="#f472b6" stroke="none" />
      <g fill="rgba(244,114,182,0.5)">
        <rect x="252" y="88" width="5" height="26" rx="2" /><rect x="264" y="78" width="5" height="36" rx="2" /><rect x="276" y="92" width="5" height="22" rx="2" />
      </g>
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">noise spiral</text>
    </svg>

    <!-- radial : fft-driven radial blur -->
    <svg v-else-if="visual === 'radial'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(56,189,248,0.55)" fill="none">
        <path d="M160 72 L160 14 M160 72 L160 130 M160 72 L102 72 M160 72 L218 72 M160 72 L119 31 M160 72 L201 113 M160 72 L201 31 M160 72 L119 113" opacity="0.6" />
        <circle cx="160" cy="72" r="18" stroke="#2dd4bf" />
        <circle cx="160" cy="72" r="34" opacity="0.6" stroke-dasharray="5 4" />
        <circle cx="160" cy="72" r="50" opacity="0.35" />
      </g>
      <circle cx="160" cy="72" r="4" fill="#38bdf8" stroke="none" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">256-tap radial blur</text>
    </svg>

    <!-- ripple : fft-driven uv ripple -->
    <svg v-else-if="visual === 'ripple'" viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="rgba(45,212,191,0.65)">
        <ellipse cx="160" cy="78" rx="24" ry="9" />
        <ellipse cx="160" cy="78" rx="44" ry="15" opacity="0.55" />
        <ellipse cx="160" cy="78" rx="66" ry="22" opacity="0.35" />
        <ellipse cx="160" cy="78" rx="88" ry="29" opacity="0.2" />
      </g>
      <circle cx="160" cy="40" r="5" fill="none" stroke="rgba(56,189,248,0.8)" />
      <path d="M160 48 V64" stroke="rgba(56,189,248,0.5)" stroke-dasharray="2 3" />
      <text x="14" y="140" font-family="monospace" font-size="9" fill="rgba(147,161,184,0.9)">fft ripple</text>
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
