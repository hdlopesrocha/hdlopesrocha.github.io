// Central project catalogue. Cards are rendered dynamically from this file.
// Keep descriptions conservative: only what can be inferred from the repo
// name / brief, without inventing private implementation details.

export const GITHUB_USER = 'hdlopesrocha'
export const GITHUB_PROFILE = 'https://github.com/hdlopesrocha'

export const CATEGORIES = {
  graphics: { label: 'Graphics', class: 'cat-graphics' },
  ai: { label: 'AI', class: 'cat-ai' },
  vr: { label: 'VR', class: 'cat-vr' },
  web: { label: 'Web', class: 'cat-web' },
  hardware: { label: 'Hardware', class: 'cat-hardware' },
  thesis: { label: 'Thesis', class: 'cat-thesis' },
  experimental: { label: 'Experimental', class: 'cat-experimental' }
}

export const projects = [
  {
    name: 'opencode-talk',
    repo: 'opencode-talk',
    url: 'https://github.com/hdlopesrocha/opencode-talk',
    pages: 'https://hdlopesrocha.github.io/opencode-talk/',
    description:
      'Two-way voice for OpenCode: talk to the agent (speech-to-text) and let it talk back (text-to-speech) — plus remote session control from Telegram, XMPP and Nostr.',
    category: 'ai',
    technologies: ['OpenCode Plugin', 'Two-way Voice', 'Whisper STT', 'Neural TTS', 'TypeScript', 'Telegram', 'XMPP', 'Nostr DMs', 'Session API'],
    featured: true,
    visual: 'terminal-wave',
    timeline: 'parallel'
  },
  {
    name: 'vulkan-engine',
    repo: 'vulkan-engine',
    url: 'https://github.com/hdlopesrocha/vulkan-engine',
    description:
      'Main real-time graphics engine experiment: Vulkan rendering, GPU-driven pipelines and procedural world techniques.',
    longDescription:
      'Flagship engine project exploring modern Vulkan rendering — compute shaders, indirect rendering, SDF and volumetric ideas, octrees, procedural terrain and Surface Nets-style meshing.',
    category: 'graphics',
    technologies: ['Vulkan', 'C++20', 'GPU', 'Ray Tracing', 'SDF', 'Octrees', 'Procedural Terrain', 'Surface Nets', 'Compute Shaders', 'Indirect Rendering'],
    featured: true,
    primary: true,
    visual: 'wireframe',
    timeline: 'main'
  },
  {
    name: 'lora-control',
    repo: 'lora-control',
    url: 'https://github.com/hdlopesrocha/lora-control',
    pages: 'https://hdlopesrocha.github.io/lora-control/',
    description:
      'ESP32 LoRa relay control: server node schedules remote relays over 868 MHz with .ics calendar uploads, web dashboard, OLED status and SHA-256 authenticated packets — docs site in Vue 3 + Vite.',
    category: 'hardware',
    technologies: ['ESP32', 'LoRa', 'Arduino', 'Relays', '.ics Scheduling', 'SHA-256', 'OLED', 'Vue 3'],
    featured: false,
    visual: 'signal',
    timeline: 'parallel'
  },
  {
    name: 'sdf-smoke',
    repo: 'sdf-smoke',
    url: 'https://github.com/hdlopesrocha/sdf-smoke',
    pages: 'https://hdlopesrocha.github.io/sdf-smoke/',
    description:
      'Experimental volumetric smoke built on signed distance fields and ray marching.',
    category: 'graphics',
    technologies: ['SDF', 'Ray Marching', 'Procedural Effects', 'Real-time', 'GPU'],
    featured: true,
    visual: 'smoke',
    timeline: 'parallel'
  },
  {
    name: 'hydrogen-vulkan',
    repo: 'hydrogen-vulkan',
    url: 'https://github.com/hdlopesrocha/hydrogen-vulkan',
    description: 'Earlier Vulkan graphics project and rendering experiment.',
    category: 'graphics',
    technologies: ['Vulkan', 'GPU', 'Real-time'],
    featured: false,
    visual: 'grid',
    timeline: 'main'
  },
  {
    name: 'lithos-engine',
    repo: 'lithos-engine',
    url: 'https://github.com/hdlopesrocha/lithos-engine',
    description:
      'Earlier OpenGL engine project and predecessor to the Vulkan engine; procedural / SDF origins.',
    category: 'graphics',
    technologies: ['OpenGL', 'Real-time Graphics', 'Procedural', 'SDF', 'Engine'],
    featured: false,
    visual: 'terrain',
    timeline: 'main'
  },
  {
    name: 'music-ai',
    repo: 'music-ai',
    url: 'https://github.com/hdlopesrocha/music-ai',
    pages: 'https://hdlopesrocha.github.io/music-ai/',
    description: 'AI and music experiment: generative / interactive musical ideas.',
    category: 'ai',
    technologies: ['AI', 'Music', 'Generative'],
    featured: false,
    visual: 'waveform',
    timeline: 'parallel'
  },
  {
    name: 'vrMusic',
    repo: 'vrMusic',
    url: 'https://github.com/hdlopesrocha/vrMusic',
    pages: 'https://hdlopesrocha.github.io/vrMusic/',
    video: 'https://www.youtube.com/watch?v=DSdHLLsvcnM',
    description: 'Virtual-reality music project: immersive, interactive musical experience.',
    category: 'vr',
    technologies: ['VR', 'Interactive Music', 'Immersive'],
    featured: false,
    visual: 'spatial',
    timeline: 'parallel'
  },
  {
    name: 'card-generator',
    repo: 'card-generator',
    url: 'https://github.com/hdlopesrocha/card-generator',
    pages: 'https://hdlopesrocha.github.io/card-generator/',
    description: 'Web-based card generation tool.',
    category: 'web',
    technologies: ['Web', 'JavaScript', 'Generative UI'],
    featured: false,
    visual: 'cards',
    timeline: 'parallel'
  },
  {
    name: 'spring-campus-2019',
    repo: 'spring-campus-2019',
    url: 'https://github.com/hdlopesrocha/spring-campus-2019',
    pages: 'https://hdlopesrocha.github.io/spring-campus-2019/dist/spring/',
    description:
      'HTML presentation about WebGL and the WebAudio API, delivered for CERN at TUHH Hamburg — Spring Campus 2019, with live music-visualization demos.',
    category: 'experimental',
    technologies: ['WebGL', 'Web Audio', 'HTML', 'Presentation', 'CERN', 'TUHH'],
    featured: false,
    visual: 'audio3d',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'spring-webgl',
    repo: 'spring-webgl',
    url: 'https://github.com/hdlopesrocha/spring-webgl',
    pages: 'https://hdlopesrocha.github.io/spring-webgl/',
    description:
      'Audio-reactive WebGL water: an uploaded sound file drives a simplex-noise wave mesh through FFT frequency data, with diffuse and specular shading.',
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'JavaScript', 'Simplex Noise'],
    featured: false,
    visual: 'water',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'water-perlin-music',
    repo: 'water-perlin-music',
    url: 'https://github.com/hdlopesrocha/water-perlin-music',
    pages: 'https://hdlopesrocha.github.io/water-perlin-music/',
    description:
      '2D canvas of 256 Perlin-noise circles pulsing to the FFT spectrum of an uploaded mp3.',
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'perlin',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'music-sphere',
    repo: 'music-sphere',
    url: 'https://github.com/hdlopesrocha/music-sphere',
    pages: 'https://hdlopesrocha.github.io/music-sphere/',
    description:
      'Rotating WebGL sphere whose vertices breathe with an mp3’s frequency and waveform data, plus live spectrum charts.',
    category: 'experimental',
    technologies: ['WebGL', 'Web Audio', 'JavaScript'],
    featured: false,
    visual: 'sphere',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'polar-perlin-music',
    repo: 'polar-perlin-music',
    url: 'https://github.com/hdlopesrocha/polar-perlin-music',
    pages: 'https://hdlopesrocha.github.io/polar-perlin-music/',
    description:
      '128 polar Perlin rings on 2D canvas, warped in real time by the spectrum of an uploaded mp3.',
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'polar',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'spiral-viz',
    repo: 'spiral-viz',
    url: 'https://github.com/hdlopesrocha/spiral-viz',
    pages: 'https://hdlopesrocha.github.io/spiral-viz/',
    description:
      'Noise-driven 2D spiral visualizer with live time-domain and frequency charts from an uploaded track.',
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'spiral',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'texture-blend',
    repo: 'texture-blend',
    url: 'https://github.com/hdlopesrocha/texture-blend',
    pages: 'https://hdlopesrocha.github.io/texture-blend/',
    description:
      'Fullscreen WebGL shader blending grass, sand and dirt textures through an animated simplex-noise mask.',
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Simplex Noise', 'JavaScript'],
    featured: false,
    visual: 'blend',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'radial-blur',
    repo: 'radial-blur',
    url: 'https://github.com/hdlopesrocha/radial-blur',
    pages: 'https://hdlopesrocha.github.io/radial-blur/',
    description:
      '256-tap WebGL radial blur whose radius is driven by an mp3’s FFT bins mapped from the image center.',
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'JavaScript'],
    featured: false,
    visual: 'radial',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'ripple-viz',
    repo: 'ripple-viz',
    url: 'https://github.com/hdlopesrocha/ripple-viz',
    pages: 'https://hdlopesrocha.github.io/ripple-viz/',
    description:
      'WebGL ripple effect distorting a background image with noise whose wavelength follows an mp3’s spectrum.',
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'Simplex Noise'],
    featured: false,
    visual: 'ripple',
    timeline: 'main',
    year: '2019'
  },
  {
    name: 'matrix-face',
    repo: 'matrix-face',
    url: 'https://github.com/hdlopesrocha/matrix-face',
    pages: 'https://hdlopesrocha.github.io/matrix-face/',
    description:
      'WebGL experiment rendering a face formed by Matrix-style digital rain, lit through a normal map with custom GLSL shaders.',
    category: 'graphics',
    technologies: ['WebGL', 'GLSL', 'JavaScript', 'Normal Maps'],
    featured: false,
    visual: 'matrix',
    timeline: 'parallel'
  },
  {
    name: 'mobarrocas',
    repo: 'mobarrocas',
    url: 'https://github.com/hdlopesrocha/mobarrocas',
    pages: 'https://hdlopesrocha.github.io/mobarrocas/',
    description:
      'Website for “Aromas de Guidintesta”: Vue 3 + Bootstrap site with client-side routing, deployed to GitHub Pages.',
    category: 'web',
    technologies: ['Vue 3', 'vue-router', 'Bootstrap', 'JavaScript'],
    featured: false,
    visual: 'teashop',
    timeline: 'parallel',
    year: '2022'
  },
  {
    name: 'Master Thesis — Interactive Multi-User Video Chat',
    repo: 'ist168621',
    url: 'https://github.com/hdlopesrocha/ist168621',
    video: 'https://www.youtube.com/watch?v=TWfbcBKbseA',
    description:
      'Master thesis (IST, 2015): interactive multi-user video chat with recording, content overlay and collaborative text editor — Kurento mixing, QR detection and operational transforms via ot.js.',
    category: 'thesis',
    technologies: ['Kurento', 'WebRTC', 'JavaScript', 'ot.js', 'QR Detection'],
    featured: true,
    visual: 'rings',
    timeline: 'thesis',
    year: '2015'
  }
]

// Evolution chain shown in the timeline section.
export const evolutionChain = [
  { repo: 'spring-campus-2019', note: 'Origin · 2019 event project' },
  { repo: 'hydrogen-vulkan', note: 'First Vulkan experiments · 2021' },
  { repo: 'lithos-engine', note: 'OpenGL engine · 2024 predecessor' },
  { repo: 'vulkan-engine', note: 'Current main engine · 2025' }
]

export function projectByRepo(repo) {
  return projects.find((p) => p.repo === repo)
}
