// Strings da interface em português de Portugal, com ortografia pré-AO90.
// O conteúdo (projectos, CV, …) está em src/data e é localizado lá com
// objectos { en, pt }.
export default {
  meta: {
    title: 'Henrique Lopes Rocha — Gráficos, Vulkan, IA e VR',
    description:
      'Portefólio e currículo de Henrique Lopes Rocha, engenheiro de Telecomunicações e Informática (ex-CERN): gráficos em tempo real, Vulkan e programação de GPU, renderização SDF, experiências de IA, VR e computação criativa.'
  },
  language: {
    label: 'Idioma',
    switchTo: 'Mudar para {language}'
  },
  skip: 'Saltar para os projectos',
  nav: {
    brandHome: 'Henrique Lopes Rocha — início',
    primary: 'Principal',
    footer: 'Rodapé',
    home: 'Início',
    projects: 'Projectos',
    evolution: 'Evolução',
    about: 'Sobre',
    cv: 'CV',
    contact: 'Contacto',
    contactAria: 'Dados de contacto',
    tip: 'Apoiar',
    tipSats: 'Apoiar com sats',
    tipAria: 'Apoiar com alguns sats via Lightning',
    github: 'GitHub',
    toggleMenu: 'Abrir ou fechar o menu de navegação'
  },
  hero: {
    eyebrow: 'tempo real · gpu · procedural · experimental',
    avatarAlt: 'Avatar de Henrique Lopes Rocha',
    subtitle: 'Engenheiro de Telecomunicações e Informática · ex-CERN · Vulkan · IA · VR',
    lede: 'Uma colecção de projectos que exploram gráficos em tempo real, programação de GPU, campos de distância com sinal, geração procedural, IA, realidade virtual e software experimental.'
  },
  projects: {
    eyebrow: '~/projectos — {count} repositórios',
    title: 'Projectos em gráficos, IA e muito mais',
    filterLabel: 'Filtrar projectos por categoria',
    filterAll: 'todos',
  },
  card: {
    featured: 'destaque',
    technologies: 'Tecnologias',
    stars: 'Estrelas',
    forks: 'Forks',
    updatedShort: 'actual.',
    updatedLive: 'Último push (dados do GitHub em directo)',
    updatedCached: 'Último push (dados em cache do catálogo)',
    created: 'Criado em {date}',
    lastPush: ' · último push {date}',
    openGithub: 'Abrir {name} no GitHub',
    openSite: 'Abrir o site de {name}',
    liveSite: 'Site em directo (GitHub Pages)',
    watchDemo: 'Ver o vídeo de demonstração de {name}',
    demoVideo: 'Vídeo de demonstração',
    github: 'GitHub',
    live: 'Site',
    demo: 'Demo'
  },
  timeline: {
    eyebrow: '~/evolução — como os motores se ligam',
    title: 'Uma linhagem, muitas aventuras paralelas',
    intro:
      'A linhagem principal de renderização, desde as experiências de 2019 até ao motor Vulkan actual, além de trilhos paralelos em IA, VR, web e hardware.',
    parallel: '// experiências paralelas'
  },
  about: {
    eyebrow: '~/sobre — {name}',
    ledeBefore:
      'Mestrado em Engenharia de Telecomunicações e Informática (IST Lisboa). Anteriormente, desenvolvimento de software de recrutamento, planeamento e armazém no ',
    ledeStrong: 'CERN',
    ledeAfter:
      ', trabalho full-stack e móvel na Bullray-CIT, e investigação em videochat em tempo real no IST/INESC. Actualmente focado em motores Vulkan, renderização SDF, ferramentas de IA, música em VR e computação criativa.',
    offScreen: 'Além do ecrã: {interests}',
    cvEn: 'CV · Inglês (PDF)',
    fullResume: 'Currículo completo',
    github: 'GitHub',
    interestsTitle: '$ interests --list',
    interests: [
      'C++ e Vulkan',
      'Renderização em tempo real',
      'Programação de GPU',
      'Campos de distância com sinal',
      'Geração procedural',
      'Ferramentas e agentes de IA',
      'Realidade virtual',
      'Desenvolvimento web',
      'Software experimental'
    ]
  },
  resume: {
    eyebrow: '~/cv — experiência e formação',
    title: 'Currículo',
    intro:
      'Engenheiro de software (Mestrado, IST Lisboa) — anteriormente no CERN, Bullray-CIT e IST/INESC. CV completo em PDF, em inglês:',
    cvEn: 'CV · Inglês (PDF)',
    latex: 'Código LaTeX',
    experience: 'Experiência',
    education: 'Formação',
    masterThesis: '// tese de mestrado',
    masterThesisNote:
      ' — videochat interactivo multiusador com gravação, sobreposição de conteúdo e editor de texto colaborativo.',
    watchDemo: 'Ver demonstração',
    skills: 'Competências',
    programming: 'programação',
    databases: 'bases de dados',
    languagesSoft: 'línguas e soft skills',
    earlierApps: 'Aplicações anteriores',
    earlierNote: '(do CV — era pré-GitHub)',
    video: 'Vídeo'
  },
  contact: {
    eyebrow: '~/contacto — linha directa',
    title: 'Converse por Nostr',
    ledeBefore: 'Este é um chat ao vivo, ',
    ledeStrong: 'cifrado ponto a ponto',
    ledeAfter:
      ' (DMs NIP-04) que corre directamente do seu navegador para os meus relays — sem conta, sem backend, sem intermediários. A sua identidade de chat é gerada localmente e guardada apenas no armazenamento deste navegador. As respostas do dono do site aparecem aqui automaticamente.',
    npubLabel: 'o meu npub — envie-me mensagem de qualquer cliente',
    copyNpub: 'Copiar npub',
    copied: 'Copiado ✓'
  },
  chat: {
    chattingAs: 'a conversar como',
    storedOnly: '(guardado apenas neste navegador)',
    copyMine: 'Copiar o meu npub',
    copied: 'Copiado ✓',
    check: 'Verificar',
    conversation: 'Conversa com o dono do site',
    empty:
      'Ainda não há mensagens — diga olá abaixo. As respostas do dono do site aparecem aqui automaticamente enquanto este separador estiver aberto.',
    owner: 'dono ✓',
    messageLabel: 'Mensagem para o dono do site',
    placeholder: 'Escreva uma mensagem… (cifrada ponto a ponto)',
    send: 'Enviar',
    status: {
      starting: '// a iniciar…',
      listening: '// à escuta em {live}/{total} relays (dm + gift-wrap)',
      rechecking: '// a reverificar relays…',
      slowDown: '// devagar — tente novamente em {seconds}s',
      sent: '// ✓ enviado via {ok}/{total} relays — as respostas aparecem acima',
      noRelay: '// ✗ nenhum relay aceitou — verifique a ligação e tente novamente',
      sendFailed: '// ✗ o envio falhou neste navegador',
      connecting: '// a ligar aos relays…',
      stillConnecting:
        '// ainda a ligar — as mensagens que enviar seguem na mesma; prima ↻ Verificar'
    }
  },
  donate: {
    eyebrow: '~/donativo — lightning',
    title: 'Ofereça alguns sats',
    intro:
      'Escolha um montante e é gerada na hora uma fatura via Lightning Address (LNURL-pay) — pague-a a partir de qualquer carteira Lightning. Sem conta, sem backend.',
    copy: 'Copiar',
    copied: 'Copiado ✓',
    amountLabel: 'Montante do donativo em sats',
    customAmount: 'Montante personalizado em sats',
    custom: 'personalizado',
    sats: 'sats',
    comment: 'Comentário',
    commentHint: '(opcional, mostrado com o pagamento)',
    commentPlaceholder: 'obrigado pelos pixels',
    talkingToWallet: 'A contactar a carteira…',
    generate: 'Gerar fatura de {amount} sats',
    qrLabel: 'Código QR da fatura Lightning',
    copyInvoice: 'Copiar fatura',
    openWallet: 'Abrir na carteira',
    expires:
      'As faturas expiram — pague rapidamente. O pagamento não pode ser detectado daqui; obrigado de qualquer forma.',
    status: {
      idle: '// escolha um montante — a fatura aparece aqui',
      min: '// introduza pelo menos 1 sat',
      fetching: '// a obter parâmetros lnurl…',
      range: '// a carteira permite {min}–{max} sats',
      generating: '// a gerar fatura…',
      ready: '// fatura de {amount} sats — leia o QR ou abra na carteira',
      unreachable:
        '// carteira inacessível — envie para o endereço acima a partir de qualquer carteira Lightning'
    }
  },
  vcard: {
    eyebrow: '~/vcard — guardar contacto',
    basedIn: 'localização',
    phone: 'telefone',
    email: 'e-mail',
    site: 'site',
    github: 'github',
    youtube: 'youtube',
    soundcloud: 'soundcloud',
    nostr: 'nostr',
    telegram: 'telegram',
    lnurl: 'lnurl',
    copy: 'Copiar',
    copyLocation: 'Copiar localização',
    copyPhone: 'Copiar telefone',
    copySite: 'Copiar URL do site',
    copyNpub: 'Copiar npub',
    copyLightning: 'Copiar endereço lightning',
    locationCopied: 'Localização copiada',
    phoneCopied: 'Telefone copiado',
    siteCopied: 'Site copiado',
    npubCopied: 'npub copiado',
    lightningCopied: 'Endereço lightning copiado',
    download: 'Descarregar .vcf',
    copyText: 'Copiar texto vCard',
    copied: 'Copiado ✓',
    hint: 'leia para guardar · clique para descarregar',
    downloadAria: 'Descarregar contacto como ficheiro .vcf',
    downloadTitle: 'Clique para descarregar .vcf'
  },
  footer: {
    tagline: 'Gráficos · Vulkan · IA · VR — portefólio experimental servido a partir do GitHub Pages.',
    built: "// feito com vue + vite · sem backend · base: '/'",
    rights: '© {year} Henrique Lopes Rocha'
  },
  audio: {
    mic: {
      requesting: 'A pedir microfone…',
      live: 'Microfone activo',
      use: 'Usar microfone'
    },
    source: {
      mic: 'microfone · em directo',
      file: 'ficheiro de áudio',
      none: 'sem fonte de áudio'
    },
    changeAudio: 'Mudar áudio',
    uploadAudio: 'Carregar áudio',
    pauseAudio: 'Pausar áudio',
    playAudio: 'Reproduzir áudio',
    stopAudio: 'Parar áudio',
    cta: 'Transforme o som em movimento — use o microfone, carregue um MP3 ou experimente a faixa de demonstração.',
    tryDemo: 'Experimentar demo',
    demoLoading: 'A carregar demo…',
    sceneControls: 'Controlos da cena de fundo',
    filterControls: 'Controlos do filtro passa-banda',
    bandPass: 'passa-banda',
    on: 'ligado',
    off: 'desligado',
    presets: {
      bass: 'GRAVES',
      snare: 'CAIXA',
      voice: 'VOZ',
      melody: 'MELODIA'
    },
    scene: {
      title: 'cena',
      glowStrength: 'intensidade do brilho',
      particles: 'partículas',
      count: 'quantidade · {count}',
      trailLength: 'comprimento do rasto · {length}',
      particleSpeed: 'velocidade das partículas · {speed}×',
      symbolSpacing: 'espaçamento dos símbolos · {spacing} px',
      perlinNoise: 'ruído perlin',
      octaves: 'oitavas · {count}',
      lacunarity: 'lacunaridade · {value}',
      amplitude: 'amplitude · {value}',
      gain: 'ganho · {value}',
      contrast: 'contraste · {value}',
      brightness: 'brilho · {value}',
      period: 'período · {value} s',
      scale: 'escala · {value}',
      speed: 'velocidade · {value}×'
    },
    sceneToggles: {
      showGraph: 'grafo',
      showTriangles: 'triângulos',
      showGlow: 'brilho',
      showParticles: 'partículas',
      showTrails: 'rastos',
      showDots: 'pontos',
      showMatrix: 'matriz',
      showSmoke: 'ruído'
    },
    freq: 'freq · {hz} Hz',
    q: 'Q · {value}',
    chooseColor: 'Escolher uma cor para {label}',
    colorAria: 'cor de {label}',
    meters: {
      bass: 'graves / bumbo',
      snare: 'caixa',
      voice: 'voz',
      melody: 'melodia'
    },
    errors: {
      micDenied:
        'A permissão do microfone foi negada. Autorize-a nas definições do navegador e tente novamente.',
      micNotFound: 'Não foi encontrado nenhum microfone neste dispositivo.',
      micInUse: 'O microfone já está a ser usado por outra aplicação.',
      micSettings: 'O microfone seleccionado não suporta as definições de áudio pedidas.',
      micStart: 'Não foi possível iniciar o microfone.',
      secureOrigin:
        'O acesso ao microfone exige uma origem segura (HTTPS ou localhost) e um navegador moderno.',
      badFile: 'Esse ficheiro não parece ser áudio. Tente MP3, WAV, OGG, M4A ou FLAC.',
      loadFailed: 'Não foi possível carregar esse ficheiro de áudio{detail}',
      playbackBlocked: 'O navegador bloqueou a reprodução. Prima play novamente para retomar.',
      audioLoaded: 'Áudio carregado. Prima play para o iniciar.',
      demoFailed: 'Não foi possível carregar a faixa de demonstração. Use o microfone ou escolha um ficheiro MP3.'
    }
  },
  video: {
    stopExport: 'Parar a exportação e guardar o vídeo',
    noFile: 'Exportar vídeo (carregue primeiro um ficheiro de música)',
    ready: 'Exportar fundo animado com música',
    recording:
      'a gravar {elapsed} · mantenha este separador visível · clique em exportar para parar',
    notices: {
      saved: 'Guardado {filename} ({duration}) — H.264 {width}×{height} + {audio} 48 kHz{color}.',
      savedWebm:
        'Guardado {filename} ({duration}) — a exportação MP4 não estava disponível, pelo que este é um ficheiro WebM alternativo.',
      recordingWebm:
        'A exportação MP4 via WebCodecs não está disponível neste navegador — a gravar em WebM.'
    },
    errors: {
      encoderFinish: 'O codificador não conseguiu terminar o vídeo{detail}',
      mp4Finalize: 'Não foi possível finalizar o MP4{detail}',
      saveFailed: 'O vídeo foi codificado, mas não foi possível guardá-lo{detail}',
      audioEncode: 'Não foi possível codificar a faixa de áudio{detail}',
      audioCapture: 'A captura de áudio falhou{detail}',
      backgroundCapture: 'Não foi possível capturar o fundo animado{detail}',
      frameEncode: 'Não foi possível codificar o fotograma de vídeo{detail}',
      videoMux: 'Não foi possível multiplexar o vídeo{detail}',
      videoEncode: 'A codificação de vídeo falhou{detail}',
      audioMux: 'Não foi possível multiplexar o áudio{detail}',
      audioEncodeFailed: 'A codificação de áudio falhou{detail}',
      noPixels: 'O canvas do fundo animado não tem pixels desenháveis.',
      noExportCanvas: 'Não foi possível criar o canvas de exportação.',
      noTrack: 'Não foi possível capturar a faixa de música seleccionada.',
      audioProcess: 'Não foi possível processar a faixa de áudio{detail}',
      trackStart: 'A faixa seleccionada não conseguiu começar do início.',
      unsupported:
        'Este navegador não suporta exportação MP4 via WebCodecs nem gravação WebM, por isso a exportação de vídeo não está disponível.',
      browserChose: 'O navegador escolheu {mime}.',
      unknownContainer: 'um contentor desconhecido',
      webmRecorder: 'O navegador não conseguiu criar um gravador WebM.',
      noVideoData: 'O gravador não produziu dados de vídeo. Tente exportar novamente.',
      badContainer: 'O navegador produziu {container} em vez de WebM, por isso nada foi guardado.',
      unknownFormat: 'um formato desconhecido',
      saveRecordedFailed: 'O vídeo foi gravado, mas não foi possível guardá-lo{detail}',
      exportFailed: 'A exportação de vídeo falhou{detail}',
      loadMusicFirst:
        'Carregue primeiro um ficheiro de música — o áudio do microfone não é exportado como faixa.',
      noCanvas: 'O canvas do fundo animado não está disponível para captura.',
      mp4Start: 'Não foi possível iniciar a exportação MP4.',
      exportStart: 'Não foi possível iniciar a exportação de vídeo.',
      webcodecsUnavailable:
        'A exportação MP4 via WebCodecs não está disponível neste navegador.',
      stopCleanly: 'A exportação de vídeo não parou de forma limpa{detail}',
      emptyFile: 'o multiplexador produziu um ficheiro vazio',
      noVideoTrack: 'O fundo animado não forneceu uma faixa de vídeo.'
    }
  }
}
