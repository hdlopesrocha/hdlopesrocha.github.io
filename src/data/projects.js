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
  experimental: { label: 'Experimental', class: 'cat-experimental' }
}

export const projects = [
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
    name: 'lora-control',
    repo: 'lora-control',
    url: 'https://github.com/hdlopesrocha/lora-control',
    description: 'LoRa / control-related project: low-power radio signalling and device control.',
    category: 'hardware',
    technologies: ['LoRa', 'Controllers', 'Signals'],
    featured: false,
    visual: 'signal',
    timeline: 'parallel'
  },
  {
    name: 'ist168621',
    repo: 'ist168621',
    url: 'https://github.com/hdlopesrocha/ist168621',
    description:
      'IST student-number archive: thesis drafts, WebRTC experiments, presentations and project documents from the university years.',
    category: 'experimental',
    technologies: ['WebRTC', 'JavaScript', 'Academic', 'Archive'],
    featured: false,
    visual: 'rings',
    timeline: 'parallel',
    year: '2015'
  },
  {
    name: 'spring-campus-2019',
    repo: 'spring-campus-2019',
    url: 'https://github.com/hdlopesrocha/spring-campus-2019',
    pages: 'https://hdlopesrocha.github.io/spring-campus-2019/dist/spring/',
    description: 'Older project from the Spring Campus 2019 period.',
    category: 'experimental',
    technologies: ['Spring Campus', '2019', 'Experiment'],
    featured: false,
    visual: 'rings',
    timeline: 'main',
    year: '2019'
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
