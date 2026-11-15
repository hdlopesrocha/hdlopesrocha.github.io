// English UI strings. Content (projects, CV, …) lives in src/data and is
// localized there with { en, pt } objects.
export default {
  meta: {
    title: 'Henrique Lopes Rocha — Graphics, Vulkan, AI & VR',
    description:
      'Portfolio and CV of Henrique Lopes Rocha, Telecommunications and Informatics engineer (ex-CERN): real-time graphics, Vulkan and GPU programming, SDF rendering, AI experiments, VR and creative computing.'
  },
  language: {
    label: 'Language',
    switchTo: 'Switch to {language}'
  },
  skip: 'Skip to projects',
  nav: {
    brandHome: 'Henrique Lopes Rocha — home',
    primary: 'Primary',
    footer: 'Footer',
    home: 'Home',
    projects: 'Projects',
    evolution: 'Evolution',
    about: 'About',
    cv: 'CV',
    contact: 'Contact',
    contactAria: 'Contact details',
    tip: 'Tip',
    tipSats: 'Tip sats',
    tipAria: 'Tip some sats over Lightning',
    github: 'GitHub',
    toggleMenu: 'Toggle navigation menu'
  },
  hero: {
    eyebrow: 'real-time · gpu · procedural · experimental',
    avatarAlt: 'Portrait avatar of Henrique Lopes Rocha',
    subtitle: 'Telecommunications & Informatics Engineer · ex-CERN · Vulkan · AI · VR',
    lede: 'A collection of projects exploring real-time graphics, GPU programming, signed distance fields, procedural generation, AI, virtual reality and experimental software.'
  },
  projects: {
    eyebrow: '~/projects — {count} repos',
    title: 'Projects in graphics, AI & beyond',
    filterLabel: 'Filter projects by category',
    filterAll: 'all',
  },
  card: {
    featured: 'featured',
    technologies: 'Technologies',
    stars: 'Stars',
    forks: 'Forks',
    updatedShort: 'upd',
    updatedLive: 'Last push (live GitHub data)',
    updatedCached: 'Last push (cached catalogue data)',
    created: 'Created {date}',
    lastPush: ' · last push {date}',
    openGithub: 'Open {name} on GitHub',
    openSite: 'Open {name} live site',
    liveSite: 'Live site (GitHub Pages)',
    watchDemo: 'Watch {name} demo video',
    demoVideo: 'Demo video',
    github: 'GitHub',
    live: 'Live',
    demo: 'Demo'
  },
  timeline: {
    eyebrow: '~/evolution — how the engines connect',
    title: 'One lineage, many side quests',
    intro:
      'Core rendering lineage from 2019 experiments to the current Vulkan engine, plus parallel tracks in AI, VR, web and hardware.',
    parallel: '// parallel experiments'
  },
  about: {
    eyebrow: '~/about — {name}',
    ledeBefore:
      'MSc in Telecommunications and Informatics Engineering (IST Lisbon). Previously building recruitment, planning and warehouse software at ',
    ledeStrong: 'CERN',
    ledeAfter:
      ', full-stack and mobile work at Bullray-CIT, and real-time video-chat research at IST/INESC. Nowadays focused on Vulkan engines, SDF rendering, AI tooling, VR music and creative computing.',
    offScreen: 'Off-screen: {interests}',
    cvEn: 'CV · English (PDF)',
    fullResume: 'Full résumé',
    github: 'GitHub',
    interestsTitle: '$ interests --list',
    interests: [
      'C++ & Vulkan',
      'Real-time rendering',
      'GPU programming',
      'Signed Distance Fields',
      'Procedural generation',
      'AI tooling & agents',
      'Virtual Reality',
      'Web development',
      'Experimental software'
    ]
  },
  resume: {
    eyebrow: '~/cv — experience & education',
    title: 'Résumé',
    intro:
      'Software engineer (MSc, IST Lisbon) — previously at CERN, Bullray-CIT and IST/INESC. Full CV as PDF, in English:',
    cvEn: 'CV · English (PDF)',
    latex: 'LaTeX source',
    experience: 'Experience',
    education: 'Education',
    masterThesis: '// master thesis',
    masterThesisNote:
      ' — interactive multi-user video chat with recording, content overlay and collaborative text editor.',
    watchDemo: 'Watch demo',
    skills: 'Skills',
    programming: 'programming',
    databases: 'databases',
    languagesSoft: 'languages & soft skills',
    earlierApps: 'Earlier applications',
    earlierNote: '(from the CV — pre-GitHub era)',
    video: 'Video'
  },
  contact: {
    eyebrow: '~/contact — direct line',
    title: 'Chat over Nostr',
    ledeBefore: 'This is a live, ',
    ledeStrong: 'end-to-end encrypted',
    ledeAfter:
      " chat (NIP-04 DMs) running straight from your browser to my relays — no account, no backend, no middleman. Your chat identity is generated locally and kept only in this browser's storage. Replies from the site owner appear in the thread automatically.",
    npubLabel: 'my npub — dm me from any client',
    copyNpub: 'Copy npub',
    copied: 'Copied ✓'
  },
  chat: {
    chattingAs: 'chatting as',
    storedOnly: '(stored only in this browser)',
    copyMine: 'Copy my npub',
    copied: 'Copied ✓',
    check: 'Check',
    conversation: 'Conversation with site owner',
    empty:
      'No messages yet — say hello below. Replies from the site owner appear here automatically while this tab is open.',
    owner: 'owner ✓',
    messageLabel: 'Message to site owner',
    placeholder: 'Type a message… (encrypted end-to-end)',
    send: 'Send',
    status: {
      starting: '// starting…',
      listening: '// listening on {live}/{total} relays (dm + gift-wrap)',
      rechecking: '// re-checking relays…',
      slowDown: '// slow down — try again in {seconds}s',
      sent: '// ✓ sent via {ok}/{total} relays — replies appear above',
      noRelay: '// ✗ no relay accepted it — check connection and retry',
      sendFailed: '// ✗ send failed in this browser',
      connecting: '// connecting to relays…',
      stillConnecting: '// still connecting — messages you send still go through; press ↻ Check'
    }
  },
  donate: {
    eyebrow: '~/donate — lightning',
    title: 'Tip some sats',
    intro:
      'Pick an amount and an invoice is generated on the spot via Lightning Address (LNURL-pay) — pay it from any Lightning wallet. No account, no backend.',
    copy: 'Copy',
    copied: 'Copied ✓',
    amountLabel: 'Donation amount in sats',
    customAmount: 'Custom amount in sats',
    custom: 'custom',
    sats: 'sats',
    comment: 'Comment',
    commentHint: '(optional, shown with payment)',
    commentPlaceholder: 'thanks for the pixels',
    talkingToWallet: 'Talking to wallet…',
    generate: 'Generate {amount} sat invoice',
    qrLabel: 'Lightning invoice QR code',
    copyInvoice: 'Copy invoice',
    openWallet: 'Open in wallet',
    expires:
      "Invoices expire — pay promptly. Payment can't be detected from here; thank you either way.",
    status: {
      idle: '// pick an amount — invoice appears here',
      min: '// enter at least 1 sat',
      fetching: '// fetching lnurl params…',
      range: '// wallet allows {min}–{max} sats',
      generating: '// generating invoice…',
      ready: '// invoice for {amount} sats — scan or open in wallet',
      unreachable:
        '// wallet unreachable — send to the address above from any Lightning wallet instead'
    }
  },
  vcard: {
    eyebrow: '~/vcard — save contact',
    basedIn: 'based in',
    phone: 'phone',
    email: 'email',
    site: 'site',
    github: 'github',
    youtube: 'youtube',
    soundcloud: 'soundcloud',
    nostr: 'nostr',
    telegram: 'telegram',
    lnurl: 'lnurl',
    copy: 'Copy',
    copyLocation: 'Copy location',
    copyPhone: 'Copy phone',
    copySite: 'Copy site URL',
    copyNpub: 'Copy npub',
    copyLightning: 'Copy lightning address',
    locationCopied: 'Location copied',
    phoneCopied: 'Phone copied',
    siteCopied: 'Site copied',
    npubCopied: 'npub copied',
    lightningCopied: 'Lightning address copied',
    download: 'Download .vcf',
    copyText: 'Copy vCard text',
    copied: 'Copied ✓',
    hint: 'scan to save · click to download',
    downloadAria: 'Download contact as .vcf file',
    downloadTitle: 'Click to download .vcf'
  },
  footer: {
    tagline: 'Graphics · Vulkan · AI · VR — experimental portfolio served from GitHub Pages.',
    built: "// built with vue + vite · no backend · base: '/'",
    rights: '© {year} Henrique Lopes Rocha'
  },
  audio: {
    mic: {
      requesting: 'Requesting mic…',
      live: 'Mic live',
      use: 'Use microphone'
    },
    source: {
      mic: 'microphone · live',
      file: 'audio file',
      none: 'no audio source'
    },
    changeAudio: 'Change audio',
    uploadAudio: 'Upload audio',
    pauseAudio: 'Pause audio',
    playAudio: 'Play audio',
    stopAudio: 'Stop audio',
    cta: 'Turn sound into motion — use your microphone, load an MP3, or try the demo track.',
    tryDemo: 'Try demo track',
    demoLoading: 'Loading demo…',
    sceneControls: 'Background scene controls',
    filterControls: 'Band-pass filter controls',
    bandPass: 'band-pass',
    on: 'on',
    off: 'off',
    presets: {
      bass: 'BASS',
      snare: 'SNARE',
      voice: 'VOICE',
      melody: 'MELODY'
    },
    scene: {
      title: 'scene',
      glowStrength: 'glow strength',
      particles: 'particles',
      count: 'count · {count}',
      trailLength: 'trail length · {length}',
      particleSpeed: 'particle speed · {speed}×',
      symbolSpacing: 'symbol spacing · {spacing} px',
      perlinNoise: 'perlin noise',
      octaves: 'octaves · {count}',
      lacunarity: 'lacunarity · {value}',
      amplitude: 'amplitude · {value}',
      gain: 'gain · {value}',
      contrast: 'contrast · {value}',
      brightness: 'brightness · {value}',
      period: 'period · {value} s',
      scale: 'scale · {value}',
      speed: 'speed · {value}×'
    },
    sceneToggles: {
      showGraph: 'graph',
      showTriangles: 'triangles',
      showGlow: 'glow',
      showParticles: 'particles',
      showTrails: 'trails',
      showDots: 'dots',
      showMatrix: 'matrix',
      showSmoke: 'noise'
    },
    freq: 'freq · {hz} Hz',
    q: 'Q · {value}',
    chooseColor: 'Choose a colour for {label}',
    colorAria: '{label} colour',
    meters: {
      bass: 'bass / kick',
      snare: 'snare',
      voice: 'voice',
      melody: 'melody'
    },
    errors: {
      micDenied: 'Microphone permission was denied. Allow it in your browser settings and try again.',
      micNotFound: 'No microphone was found on this device.',
      micInUse: 'The microphone is already in use by another app.',
      micSettings: 'The selected microphone does not support the requested audio settings.',
      micStart: 'Could not start the microphone.',
      secureOrigin:
        'Microphone access needs a secure origin (HTTPS or localhost) and a modern browser.',
      badFile: 'That file does not look like audio. Try MP3, WAV, OGG, M4A or FLAC.',
      loadFailed: 'Could not load that audio file{detail}',
      playbackBlocked: 'The browser blocked playback. Press play again to resume.',
      audioLoaded: 'Audio loaded. Press play to start it.',
      demoFailed: 'Could not load the demo track. Use your microphone or choose an MP3 file instead.'
    }
  },
  video: {
    stopExport: 'Stop export and save video',
    noFile: 'Export video (load a music file first)',
    ready: 'Export animated background with music',
    recording: 'recording {elapsed} · keep this tab visible · click export to stop',
    notices: {
      saved: 'Saved {filename} ({duration}) — H.264 {width}×{height} + {audio} 48 kHz{color}.',
      savedWebm:
        'Saved {filename} ({duration}) — MP4 export was unavailable, so this is a WebM fallback.',
      recordingWebm:
        'WebCodecs MP4 export is not available in this browser — recording WebM instead.'
    },
    errors: {
      encoderFinish: 'The encoder could not finish the video{detail}',
      mp4Finalize: 'The MP4 could not be finalized{detail}',
      saveFailed: 'The video was encoded but could not be saved{detail}',
      audioEncode: 'The audio track could not be encoded{detail}',
      audioCapture: 'Audio capture failed{detail}',
      backgroundCapture: 'The animated background could not be captured{detail}',
      frameEncode: 'The video frame could not be encoded{detail}',
      videoMux: 'The video could not be muxed{detail}',
      videoEncode: 'Video encoding failed{detail}',
      audioMux: 'The audio could not be muxed{detail}',
      audioEncodeFailed: 'Audio encoding failed{detail}',
      noPixels: 'The animated background canvas has no drawable pixels.',
      noExportCanvas: 'Could not create the export canvas.',
      noTrack: 'Could not capture the selected music track.',
      audioProcess: 'The audio track could not be processed{detail}',
      trackStart: 'The selected track could not start from the beginning.',
      unsupported:
        'This browser supports neither WebCodecs MP4 export nor WebM recording, so video export is unavailable.',
      browserChose: 'The browser chose {mime}.',
      unknownContainer: 'an unknown container',
      webmRecorder: 'The browser could not create a WebM recorder.',
      noVideoData: 'The recorder produced no video data. Try exporting again.',
      badContainer: 'The browser produced {container} instead of WebM, so nothing was saved.',
      unknownFormat: 'an unrecognised format',
      saveRecordedFailed: 'The video was recorded but could not be saved{detail}',
      exportFailed: 'Video export failed{detail}',
      loadMusicFirst: 'Load a music file first — microphone audio is not exported as a track.',
      noCanvas: 'The animated background canvas is not available to capture.',
      mp4Start: 'The MP4 export could not start.',
      exportStart: 'Video export could not start.',
      webcodecsUnavailable: 'WebCodecs MP4 export is unavailable in this browser.',
      stopCleanly: 'Video export could not stop cleanly{detail}',
      emptyFile: 'the muxer produced an empty file',
      noVideoTrack: 'The animated background did not provide a video track.'
    }
  }
}
