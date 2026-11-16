// Central project catalogue. Cards are rendered dynamically from this file.
// Keep descriptions conservative: only what can be inferred from the repo
// name / brief, without inventing private implementation details.
// created / updated (ISO dates) mirror each repo's GitHub created_at / pushed_at;
// they are the fallback date stamps when the live GitHub API is unreachable.
// Human-readable text is localized as { en, pt } and resolved with localize().

export const GITHUB_USER = 'hdlopesrocha'
export const GITHUB_PROFILE = 'https://github.com/hdlopesrocha'

export const CATEGORIES = {
  graphics: { label: { en: 'Graphics', pt: 'Gráficos' }, class: 'cat-graphics' },
  ai: { label: { en: 'AI', pt: 'IA' }, class: 'cat-ai' },
  vr: { label: { en: 'VR', pt: 'VR' }, class: 'cat-vr' },
  web: { label: { en: 'Web', pt: 'Web' }, class: 'cat-web' },
  hardware: { label: { en: 'Hardware', pt: 'Hardware' }, class: 'cat-hardware' },
  thesis: { label: { en: 'Thesis', pt: 'Tese' }, class: 'cat-thesis' },
  experimental: { label: { en: 'Experimental', pt: 'Experimental' }, class: 'cat-experimental' }
}

export const projects = [
  {
    name: 'opencode-talk',
    repo: 'opencode-talk',
    url: 'https://github.com/hdlopesrocha/opencode-talk',
    pages: 'https://hdlopesrocha.github.io/opencode-talk/',
    description: {
      en: 'Two-way voice for OpenCode: talk to the agent (speech-to-text) and let it talk back (text-to-speech) — plus remote session control from Telegram, XMPP and Nostr.',
      pt: 'Voz bidireccional para o OpenCode: fale com o agente (fala-para-texto) e deixe-o responder (texto-para-fala) — além de controlo remoto de sessões via Telegram, XMPP e Nostr.'
    },
    category: 'ai',
    technologies: ['OpenCode Plugin', 'Two-way Voice', 'Whisper STT', 'Neural TTS', 'TypeScript', 'Telegram', 'XMPP', 'Nostr DMs', 'Session API'],
    featured: true,
    visual: 'terminal-wave',
    timeline: 'parallel',
    created: '2026-10-07',
    updated: '2026-10-11'
  },
  {
    name: 'vulkan-engine',
    repo: 'vulkan-engine',
    url: 'https://github.com/hdlopesrocha/vulkan-engine',
    description: {
      en: 'Main real-time graphics engine experiment: Vulkan rendering, GPU-driven pipelines and procedural world techniques.',
      pt: 'Principal experiência de motor gráfico em tempo real: renderização Vulkan, pipelines orientados pela GPU e técnicas de mundos procedurais.'
    },
    longDescription: {
      en: 'Flagship engine project exploring modern Vulkan rendering — compute shaders, indirect rendering, SDF and volumetric ideas, octrees, procedural terrain and Surface Nets-style meshing.',
      pt: 'Projecto principal de motor, explorando renderização Vulkan moderna — compute shaders, renderização indirecta, ideias SDF e volumétricas, octrees, terreno procedural e malhas ao estilo Surface Nets.'
    },
    category: 'graphics',
    technologies: ['Vulkan', 'C++20', 'GPU', 'Ray Tracing', 'SDF', 'Octrees', 'Procedural Terrain', 'Surface Nets', 'Compute Shaders', 'Indirect Rendering'],
    featured: true,
    primary: true,
    visual: 'wireframe',
    timeline: 'main',
    created: '2025-12-06',
    updated: '2026-10-12'
  },
  {
    name: 'web-gource',
    repo: 'web-gource',
    url: 'https://github.com/hdlopesrocha/web-gource',
    pages: 'https://hdlopesrocha.github.io/web-gource/',
    video: 'https://www.youtube.com/watch?v=qsaNWbTsbjA',
    description: {
      en: 'Browser-based, WebGL-powered reimplementation of Gource: paste a public Git repository URL and watch its history grow into an animated 2D map — directories branching like trees, files as size-scaled circles and authors flying between the files they touch.',
      pt: 'Reimplementação do Gource no navegador com WebGL: cole o URL de um repositório Git público e veja o histórico crescer num mapa 2D animado — pastas a ramificar como árvores, ficheiros como círculos dimensionados e autores a voar entre os ficheiros que tocam.'
    },
    longDescription: {
      en: 'Commit history is read straight from the provider’s REST API in the browser — nothing is cloned, uploaded or built on a server — then rendered by an independently written Three.js renderer with add / modify / delete / rename activity bursts.',
      pt: 'O histórico de commits é lido directamente da API REST do fornecedor no navegador — nada é clonado, enviado ou compilado num servidor — e depois renderizado por um renderizador Three.js escrito de raiz, com surtos de actividade de adição / modificação / eliminação / renomeação.'
    },
    technologies: ['Three.js', 'WebGL', 'TypeScript', 'Vue 3', 'Vite', 'GitHub API'],
    category: 'vr',
    featured: true,
    visual: 'gource',
    timeline: 'parallel',
    created: '2026-10-11',
    updated: '2026-10-12'
  },
  {
    name: 'open-studio',
    repo: 'open-studio',
    url: 'https://github.com/hdlopesrocha/open-studio',
    description: {
      en: 'Private, password-protected AI studio running entirely on your own machine: chat, music, video, voice, subtitles, images, documents and media tools — every model in Docker, behind one gateway, one shared file tree and one global job system.',
      pt: 'Estúdio de IA privado e protegido por palavra-passe, a correr inteiramente na sua máquina: chat, música, vídeo, voz, legendas, imagens, documentos e ferramentas multimédia — todos os modelos em Docker, atrás de um gateway, uma árvore de ficheiros partilhada e um sistema global de tarefas.'
    },
    longDescription: {
      en: 'A single Vue 3 app sits behind an authentication gateway that routes requests to containerised services for chat, ACE-Step music and DJ mixing, video pipelines, OmniVoice / Piper speech, Whisper subtitles, Diffusers images, PDF and document tools, translation, summaries, FFmpeg and yt-dlp. Every long task runs through a persistent job hub with per-component queues, live SSE progress and cancellation, while all services share one file tree.',
      pt: 'Uma única app Vue 3 fica atrás de um gateway de autenticação que encaminha pedidos para serviços contentorizados de chat, música ACE-Step e mistura DJ, pipelines de vídeo, voz OmniVoice / Piper, legendas Whisper, imagens Diffusers, ferramentas de PDF e documentos, tradução, resumos, FFmpeg e yt-dlp. Cada tarefa longa passa por um centro de tarefas persistente com filas por componente, progresso SSE em directo e cancelamento, enquanto todos os serviços partilham uma árvore de ficheiros.'
    },
    category: 'ai',
    technologies: ['Docker', 'Vue 3', 'Python', 'Local LLMs', 'Ollama', 'ACE-Step', 'Whisper', 'Piper TTS', 'Diffusers', 'FFmpeg', 'yt-dlp', 'QVAC'],
    featured: true,
    visual: 'studio',
    timeline: 'parallel',
    created: '2026-11-11',
    updated: '2026-11-13'
  },
  {
    name: 'infinity-edge-web',
    repo: 'infinity-edge-web',
    url: 'https://github.com/hdlopesrocha/infinity-edge-web',
    pages: 'https://hdlopesrocha.github.io/infinity-edge-web/',
    description: {
      en: 'AI-assisted XNA → web migration of Infinity Edge (2013): the original XNA 4.0 game — C# simulation, 13 AIs, CTF / time-trial rules, compiled XNB models, textures and sounds — running in the browser on Vue 3 + TypeScript + raw WebGL2, now with WebXR VR, a six-stage WebGL2 pipeline, zoom blur and a full GL HUD.',
      pt: 'Migração assistida por IA de XNA → web do Infinity Edge (2013): o jogo original em XNA 4.0 — simulação em C#, 13 IAs, regras de CTF / contra-relógio, modelos XNB compilados, texturas e sons — a correr no navegador com Vue 3 + TypeScript + WebGL2 puro, agora com VR WebXR, um pipeline WebGL2 de seis fases, desfoque de zoom e um HUD GL completo.'
    },
    longDescription: {
      en: 'The 2013 Windows Phone XNA sources and the compiled content-pipeline output were ported piece by piece: an XNB model converter, BasicEffect-exact GLSL shaders, the level / menu XML data and the original physics and AI — rendered by a hand-written WebGL2 engine (no Three.js, no game framework). Now includes WebXR immersive VR (with a split-screen fallback, gyro + drag-look, tap-to-recenter, gaze-dwell menu clicks), a six-stage framebuffer pipeline (sky / models / billboards / blur / UI / final) with zoom blur and deferred depth test, a per-eye WebGL HUD, missile-lock warnings, 16 px UI padding, and HTTPS dev serving.',
      pt: 'Os fontes XNA de 2013 para Windows Phone e a saída compilada do pipeline de conteúdos foram portados peça a peça: um conversor de modelos XNB, shaders GLSL fiéis ao BasicEffect, os dados XML de níveis / menus e a física e IA originais — renderizados por um motor WebGL2 escrito à mão (sem Three.js, sem framework de jogos). Inclui agora VR imersivo WebXR (com uma alternativa de ecrã dividido, giroscópio + arrasto, toque para recentrar, cliques de menu por fixação do olhar), um pipeline de framebuffer de seis fases (céu / modelos / billboards / desfoque / interface / final) com desfoque de zoom e teste de profundidade diferido, um HUD WebGL por olho, avisos de bloqueio de mísseis, 16 px de margem na interface e servidor de desenvolvimento HTTPS.'
    },
    category: 'vr',
    technologies: ['XNA → Web', 'AI-assisted port', 'WebGL2', 'GLSL', 'TypeScript', 'Vue 3', 'Vite', 'XNB Conversion', 'Game AI', 'WebXR VR'],
    featured: true,
    visual: 'space',
    timeline: 'parallel',
    created: '2026-10-14',
    updated: '2026-10-17'
  },
  {
    name: 'lora-control',
    repo: 'lora-control',
    url: 'https://github.com/hdlopesrocha/lora-control',
    pages: 'https://hdlopesrocha.github.io/lora-control/',
    description: {
      en: 'ESP32 LoRa relay control: server node schedules remote relays over 868 MHz with .ics calendar uploads, web dashboard, OLED status and SHA-256 authenticated packets — docs site in Vue 3 + Vite.',
      pt: 'Controlo de relés LoRa com ESP32: o nó servidor agenda relés remotos a 868 MHz com carregamento de calendários .ics, painel web, estado em OLED e pacotes autenticados com SHA-256 — site de documentação em Vue 3 + Vite.'
    },
    category: 'hardware',
    technologies: ['ESP32', 'LoRa', 'Arduino', 'Relays', '.ics Scheduling', 'SHA-256', 'OLED', 'Vue 3'],
    featured: false,
    visual: 'signal',
    timeline: 'parallel',
    created: '2024-08-17',
    updated: '2026-10-11'
  },
  {
    name: 'sdf-smoke',
    repo: 'sdf-smoke',
    url: 'https://github.com/hdlopesrocha/sdf-smoke',
    pages: 'https://hdlopesrocha.github.io/sdf-smoke/',
    description: {
      en: 'Experimental volumetric smoke built on signed distance fields and ray marching.',
      pt: 'Fumo volumétrico experimental construído com campos de distância com sinal e ray marching.'
    },
    category: 'experimental',
    technologies: ['SDF', 'Ray Marching', 'Procedural Effects', 'Real-time', 'GPU'],
    featured: true,
    visual: 'smoke',
    timeline: 'parallel',
    created: '2026-10-05',
    updated: '2026-10-06'
  },
  {
    name: 'hydrogen-vulkan',
    repo: 'hydrogen-vulkan',
    url: 'https://github.com/hdlopesrocha/hydrogen-vulkan',
    description: {
      en: 'Earlier Vulkan graphics project and rendering experiment.',
      pt: 'Projecto gráfico Vulkan anterior e experiência de renderização.'
    },
    category: 'graphics',
    technologies: ['Vulkan', 'GPU', 'Real-time'],
    featured: false,
    visual: 'grid',
    timeline: 'main',
    created: '2021-06-30',
    updated: '2024-12-08'
  },
  {
    name: 'lithos-engine',
    repo: 'lithos-engine',
    url: 'https://github.com/hdlopesrocha/lithos-engine',
    description: {
      en: 'Earlier OpenGL engine project and predecessor to the Vulkan engine; procedural / SDF origins.',
      pt: 'Projecto anterior de motor OpenGL e predecessor do motor Vulkan; origens procedurais / SDF.'
    },
    category: 'graphics',
    technologies: ['OpenGL', 'Real-time Graphics', 'Procedural', 'SDF', 'Engine'],
    featured: false,
    visual: 'terrain',
    timeline: 'main',
    created: '2024-12-09',
    updated: '2025-12-24'
  },
  {
    name: 'music-ai',
    repo: 'music-ai',
    url: 'https://github.com/hdlopesrocha/music-ai',
    pages: 'https://hdlopesrocha.github.io/music-ai/',
    description: {
      en: 'AI and music experiment: generative / interactive musical ideas.',
      pt: 'Experiência de IA e música: ideias musicais generativas / interactivas.'
    },
    category: 'ai',
    technologies: ['AI', 'Music', 'Generative'],
    featured: false,
    visual: 'waveform',
    timeline: 'parallel',
    created: '2026-10-04',
    updated: '2026-10-04'
  },
  {
    name: 'vrMusic',
    repo: 'vrMusic',
    url: 'https://github.com/hdlopesrocha/vrMusic',
    pages: 'https://hdlopesrocha.github.io/vrMusic/',
    video: 'https://www.youtube.com/watch?v=DSdHLLsvcnM',
    description: {
      en: 'Virtual-reality music project: immersive, interactive musical experience.',
      pt: 'Projecto de música em realidade virtual: experiência musical imersiva e interactiva.'
    },
    category: 'vr',
    technologies: ['VR', 'Interactive Music', 'Immersive'],
    featured: false,
    visual: 'spatial',
    timeline: 'parallel',
    created: '2020-04-15',
    updated: '2025-09-18'
  },
  {
    name: 'card-generator',
    repo: 'card-generator',
    url: 'https://github.com/hdlopesrocha/card-generator',
    pages: 'https://hdlopesrocha.github.io/card-generator/',
    description: {
      en: 'Web-based card generation tool.',
      pt: 'Ferramenta web de geração de cartões.'
    },
    category: 'web',
    technologies: ['Web', 'JavaScript', 'Generative UI'],
    featured: false,
    visual: 'cards',
    timeline: 'parallel',
    created: '2026-09-30',
    updated: '2026-10-07'
  },
  {
    name: 'spring-campus-2019',
    repo: 'spring-campus-2019',
    url: 'https://github.com/hdlopesrocha/spring-campus-2019',
    pages: 'https://hdlopesrocha.github.io/spring-campus-2019/dist/spring/',
    description: {
      en: 'HTML presentation about WebGL and the WebAudio API, delivered for CERN at TUHH Hamburg — Spring Campus 2019, with live music-visualization demos.',
      pt: 'Apresentação HTML sobre WebGL e a WebAudio API, apresentada para o CERN na TUHH Hamburgo — Spring Campus 2019, com demos ao vivo de visualização musical.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'Web Audio', 'HTML', 'Presentation', 'CERN', 'TUHH'],
    featured: false,
    visual: 'audio3d',
    timeline: 'main',
    created: '2019-05-13',
    updated: '2025-09-18'
  },
  {
    name: 'spring-webgl',
    repo: 'spring-webgl',
    url: 'https://github.com/hdlopesrocha/spring-webgl',
    pages: 'https://hdlopesrocha.github.io/spring-webgl/',
    description: {
      en: 'Audio-reactive WebGL water: an uploaded sound file drives a simplex-noise wave mesh through FFT frequency data, with diffuse and specular shading.',
      pt: 'Água WebGL reactiva ao áudio: um ficheiro de som carregado alimenta uma malha de ondas de ruído simplex através de dados de frequência FFT, com sombreamento difuso e especular.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'JavaScript', 'Simplex Noise'],
    featured: false,
    visual: 'water',
    timeline: 'main',
    created: '2019-06-02',
    updated: '2019-09-18'
  },
  {
    name: 'water-perlin-music',
    repo: 'water-perlin-music',
    url: 'https://github.com/hdlopesrocha/water-perlin-music',
    pages: 'https://hdlopesrocha.github.io/water-perlin-music/',
    description: {
      en: '2D canvas of 256 Perlin-noise circles pulsing to the FFT spectrum of an uploaded mp3.',
      pt: 'Canvas 2D com 256 círculos de ruído Perlin a pulsar ao ritmo do espectro FFT de um mp3 carregado.'
    },
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'perlin',
    timeline: 'main',
    created: '2019-04-01',
    updated: '2019-04-01'
  },
  {
    name: 'music-sphere',
    repo: 'music-sphere',
    url: 'https://github.com/hdlopesrocha/music-sphere',
    pages: 'https://hdlopesrocha.github.io/music-sphere/',
    description: {
      en: 'Rotating WebGL sphere whose vertices breathe with an mp3’s frequency and waveform data, plus live spectrum charts.',
      pt: 'Esfera WebGL em rotação cujos vértices respiram com os dados de frequência e forma de onda de um mp3, além de gráficos de espectro em directo.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'Web Audio', 'JavaScript'],
    featured: false,
    visual: 'sphere',
    timeline: 'main',
    created: '2019-09-16',
    updated: '2019-09-16'
  },
  {
    name: 'polar-perlin-music',
    repo: 'polar-perlin-music',
    url: 'https://github.com/hdlopesrocha/polar-perlin-music',
    pages: 'https://hdlopesrocha.github.io/polar-perlin-music/',
    description: {
      en: '128 polar Perlin rings on 2D canvas, warped in real time by the spectrum of an uploaded mp3.',
      pt: '128 anéis Perlin polares em canvas 2D, deformados em tempo real pelo espectro de um mp3 carregado.'
    },
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'polar',
    timeline: 'main',
    created: '2019-03-31',
    updated: '2019-03-31'
  },
  {
    name: 'spiral-viz',
    repo: 'spiral-viz',
    url: 'https://github.com/hdlopesrocha/spiral-viz',
    pages: 'https://hdlopesrocha.github.io/spiral-viz/',
    description: {
      en: 'Noise-driven 2D spiral visualizer with live time-domain and frequency charts from an uploaded track.',
      pt: 'Visualizador de espiral 2D com ruído, com gráficos em directo de domínio temporal e frequência a partir de uma faixa carregada.'
    },
    category: 'experimental',
    technologies: ['Canvas 2D', 'Web Audio', 'Perlin Noise', 'JavaScript'],
    featured: false,
    visual: 'spiral',
    timeline: 'main',
    created: '2019-09-16',
    updated: '2019-09-16'
  },
  {
    name: 'texture-blend',
    repo: 'texture-blend',
    url: 'https://github.com/hdlopesrocha/texture-blend',
    pages: 'https://hdlopesrocha.github.io/texture-blend/',
    description: {
      en: 'Fullscreen WebGL shader blending grass, sand and dirt textures through an animated simplex-noise mask.',
      pt: 'Shader WebGL de ecrã inteiro que mistura texturas de erva, areia e terra através de uma máscara animada de ruído simplex.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Simplex Noise', 'JavaScript'],
    featured: false,
    visual: 'blend',
    timeline: 'main',
    created: '2019-09-18',
    updated: '2019-09-18'
  },
  {
    name: 'radial-blur',
    repo: 'radial-blur',
    url: 'https://github.com/hdlopesrocha/radial-blur',
    pages: 'https://hdlopesrocha.github.io/radial-blur/',
    description: {
      en: '256-tap WebGL radial blur whose radius is driven by an mp3’s FFT bins mapped from the image center.',
      pt: 'Desfoque radial WebGL de 256 amostras cujo raio é guiado pelas bandas FFT de um mp3, mapeadas a partir do centro da imagem.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'JavaScript'],
    featured: false,
    visual: 'radial',
    timeline: 'main',
    created: '2019-06-12',
    updated: '2019-06-12'
  },
  {
    name: 'ripple-viz',
    repo: 'ripple-viz',
    url: 'https://github.com/hdlopesrocha/ripple-viz',
    pages: 'https://hdlopesrocha.github.io/ripple-viz/',
    description: {
      en: 'WebGL ripple effect distorting a background image with noise whose wavelength follows an mp3’s spectrum.',
      pt: 'Efeito de ondulação WebGL que distorce uma imagem de fundo com ruído cujo comprimento de onda segue o espectro de um mp3.'
    },
    category: 'experimental',
    technologies: ['WebGL', 'GLSL', 'Web Audio', 'Simplex Noise'],
    featured: false,
    visual: 'ripple',
    timeline: 'main',
    created: '2019-06-08',
    updated: '2019-06-08'
  },
  {
    name: 'matrix-face',
    repo: 'matrix-face',
    url: 'https://github.com/hdlopesrocha/matrix-face',
    pages: 'https://hdlopesrocha.github.io/matrix-face/',
    description: {
      en: 'WebGL experiment rendering a face formed by Matrix-style digital rain, lit through a normal map with custom GLSL shaders.',
      pt: 'Experiência WebGL que renderiza um rosto formado por chuva digital ao estilo Matrix, iluminado através de um mapa de normais com shaders GLSL personalizados.'
    },
    category: 'graphics',
    technologies: ['WebGL', 'GLSL', 'JavaScript', 'Normal Maps'],
    featured: false,
    visual: 'matrix',
    timeline: 'parallel',
    created: '2021-02-19',
    updated: '2021-02-20'
  },
  {
    name: 'mobarrocas',
    repo: 'mobarrocas',
    url: 'https://github.com/hdlopesrocha/mobarrocas',
    pages: 'https://hdlopesrocha.github.io/mobarrocas/',
    description: {
      en: 'Website for “Aromas de Guidintesta”: Vue 3 + Bootstrap site with client-side routing, deployed to GitHub Pages.',
      pt: 'Site para “Aromas de Guidintesta”: site em Vue 3 + Bootstrap com routing no cliente, publicado no GitHub Pages.'
    },
    category: 'web',
    technologies: ['Vue 3', 'vue-router', 'Bootstrap', 'JavaScript'],
    featured: false,
    visual: 'teashop',
    timeline: 'parallel',
    created: '2022-12-20',
    updated: '2026-10-11'
  },
  {
    name: {
      en: 'Master Thesis — Interactive Multi-User Video Chat',
      pt: 'Tese de Mestrado — Videochat Interactivo Multiusador'
    },
    repo: 'ist168621',
    url: 'https://github.com/hdlopesrocha/ist168621',
    video: 'https://www.youtube.com/watch?v=TWfbcBKbseA',
    description: {
      en: 'Master thesis (IST, 2015): interactive multi-user video chat with recording, content overlay and collaborative text editor — Kurento mixing, QR detection and operational transforms via ot.js.',
      pt: 'Tese de mestrado (IST, 2015): videochat interactivo multiusador com gravação, sobreposição de conteúdo e editor de texto colaborativo — mistura Kurento, detecção de QR e transformações operacionais via ot.js.'
    },
    category: 'thesis',
    technologies: ['Kurento', 'WebRTC', 'JavaScript', 'ot.js', 'QR Detection'],
    featured: true,
    visual: 'rings',
    timeline: 'thesis',
    created: '2015-02-28',
    updated: '2017-02-22'
  }
]

// Evolution chain shown in the timeline section.
export const evolutionChain = [
  {
    repo: 'spring-campus-2019',
    note: { en: 'Origin · 2019 event project', pt: 'Origem · projecto de evento de 2019' }
  },
  {
    repo: 'hydrogen-vulkan',
    note: { en: 'First Vulkan experiments · 2021', pt: 'Primeiras experiências Vulkan · 2021' }
  },
  {
    repo: 'lithos-engine',
    note: { en: 'OpenGL engine · 2024 predecessor', pt: 'Motor OpenGL · predecessor de 2024' }
  },
  {
    repo: 'vulkan-engine',
    note: { en: 'Current main engine · 2025', pt: 'Motor principal actual · 2025' }
  }
]

export function projectByRepo(repo) {
  return projects.find((p) => p.repo === repo)
}
