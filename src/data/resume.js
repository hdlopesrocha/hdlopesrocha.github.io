// Factual CV data, transcribed from https://github.com/hdlopesrocha/cv (cv.tex).
// Nothing here is invented — dates, roles, grades and links come from the CV.
// Human-readable text is localized as { en, pt } and resolved with localize().

export const RESUME = {
  fullName: 'Henrique Duarte Lopes Rocha',
  title: {
    en: 'Telecommunications and Informatics Engineer',
    pt: 'Engenheiro de Telecomunicações e Informática'
  },
  location: 'Castelo Branco, Portugal',
  email: 'hdlopesrocha@protonmail.com',
  phone: '(+351) 938781922',
  phoneHref: 'tel:+351938781922',
  github: 'https://github.com/hdlopesrocha',
  youtube: 'https://www.youtube.com/user/hdlopesrocha',
  soundcloud: 'https://soundcloud.com/hdlopesrocha',
  telegram: '@hdlopesrocha',
  telegramUrl: 'https://t.me/hdlopesrocha',
  site: 'https://hdlopesrocha.github.io/',
  cvEn: 'https://github.com/hdlopesrocha/cv/blob/master/cv.pdf'
}

export const experience = [
  {
    org: 'CERN',
    place: {
      en: 'European Organization for Nuclear Research',
      pt: 'Organização Europeia para a Investigação Nuclear'
    },
    link: 'https://indico.cern.ch/event/844444/attachments/1909261/3154346/IST_CERN_Collaboration_Agreement_Visita_dos_Professor_Arlindo_Oliveira___Nuno_Roma_4th_of_September_2019.pdf',
    linkLabel: { en: 'IST–CERN agreement (PDF)', pt: 'Acordo IST–CERN (PDF)' },
    roles: [
      {
        period: '2019 –',
        title: {
          en: 'Full-Stack Development & Support — FAP-BC-UI',
          pt: 'Desenvolvimento e Suporte Full-Stack — FAP-BC-UI'
        },
        detail: {
          en: 'Maintenance, development and support of recruitment and document-management applications.',
          pt: 'Manutenção, desenvolvimento e suporte de aplicações de recrutamento e gestão documental.'
        },
        tags: ['Vue', 'React', 'Elastic Search', 'Prometheus', 'OracleHR', 'Activiti']
      },
      {
        period: { en: 'Sep 2019 · 4 days', pt: 'set 2019 · 4 dias' },
        title: {
          en: 'Speaker — CERN Spring Campus, Hamburg University of Technology',
          pt: 'Orador — CERN Spring Campus, Universidade Técnica de Hamburgo'
        },
        detail: {
          en: 'Talks: “Exploring Music Using the WebAudio API” and “Visualizing Music in 2D and 3D Using the Canvas API and WebGL”.',
          pt: 'Palestras: “Exploring Music Using the WebAudio API” e “Visualizing Music in 2D and 3D Using the Canvas API and WebGL”.'
        },
        tags: ['WebAudio', 'Canvas', 'WebGL'],
        link: 'https://hdlopesrocha.github.io/spring-campus-2019/dist/spring/',
        linkLabel: { en: 'Talk demos', pt: 'Demos das palestras' }
      },
      {
        period: { en: '2018 · 6 months', pt: '2018 · 6 meses' },
        title: {
          en: 'Full-Stack & Database Development — IMPACT',
          pt: 'Desenvolvimento Full-Stack e de Bases de Dados — IMPACT'
        },
        detail: {
          en: 'Maintenance and optimization of an intervention management, planning and coordination tool.',
          pt: 'Manutenção e optimização de uma ferramenta de gestão, planeamento e coordenação de intervenções.'
        },
        tags: ['Grails', 'HazelCast']
      },
      {
        period: { en: 'Apr 2018 · 4 days', pt: 'abr 2018 · 4 dias' },
        title: {
          en: 'Speaker — CERN Spring Campus, Riga Technical University',
          pt: 'Orador — CERN Spring Campus, Universidade Técnica de Riga'
        },
        detail: {
          en: 'Talks: “Real-time communications between web browsers using WebRTC” and “Collision detection for massive object counts in 3D”.',
          pt: 'Palestras: “Real-time communications between web browsers using WebRTC” e “Collision detection for massive object counts in 3D”.'
        },
        tags: ['WebRTC', '3D', 'Collision detection']
      },
      {
        period: { en: '2018 · 6 months', pt: '2018 · 6 meses' },
        title: {
          en: 'Full-Stack & Mobile Development — DigiWare',
          pt: 'Desenvolvimento Full-Stack e Móvel — DigiWare'
        },
        detail: {
          en: 'Work-delivery tool for a warehouse at CERN.',
          pt: 'Ferramenta de entrega de trabalho para um armazém no CERN.'
        },
        tags: ['SpringBoot', 'Ionic', 'Angular', 'Hibernate', 'Oracle DB']
      },
      {
        period: { en: '2017 · 2 months', pt: '2017 · 2 meses' },
        title: {
          en: 'Front-end & Business Intelligence — APT',
          pt: 'Front-end e Business Intelligence — APT'
        },
        detail: {
          en: 'Cost-analysis tool for CERN activities.',
          pt: 'Ferramenta de análise de custos para actividades do CERN.'
        },
        tags: ['Grails', 'GWT', 'Pentaho']
      },
      {
        period: { en: '2016–2018 · 2 years', pt: '2016–2018 · 2 anos' },
        title: {
          en: 'Applications Development — PLAN',
          pt: 'Desenvolvimento de Aplicações — PLAN'
        },
        detail: {
          en: 'Planning tool for CERN activities, built with Event Sourcing (ES) and CQRS patterns.',
          pt: 'Ferramenta de planeamento para actividades do CERN, construída com padrões Event Sourcing (ES) e CQRS.'
        },
        tags: ['SpringBoot', 'Handlebars', 'Hibernate', 'Oracle DB', 'ES', 'CQRS']
      },
      {
        period: { en: '2016 · 2 months', pt: '2016 · 2 meses' },
        title: {
          en: 'Full-Stack Development — PM-Support calendar',
          pt: 'Desenvolvimento Full-Stack — calendário PM-Support'
        },
        detail: {
          en: 'Calendar application for support time management.',
          pt: 'Aplicação de calendário para gestão de tempo de suporte.'
        },
        tags: ['SpringBoot', 'JIRA', 'Thymeleaf', 'Polymer']
      }
    ]
  },
  {
    org: 'Bullray-CIT',
    place: 'Portugal',
    roles: [
      {
        period: { en: '2016 · 7 months', pt: '2016 · 7 meses' },
        title: { en: 'Applications Development', pt: 'Desenvolvimento de Aplicações' },
        detail: {
          en: 'UI for a bank security device synced with servers: microcontroller sensor data over USB, JavaFX interface, network-camera discovery.',
          pt: 'Interface para um dispositivo de segurança bancário sincronizado com servidores: dados de sensores de microcontrolador via USB, interface JavaFX, descoberta de câmaras de rede.'
        },
        tags: ['JavaFX', 'USB', 'nmap']
      },
      {
        period: { en: '2015 · 2 months', pt: '2015 · 2 meses' },
        title: { en: 'Android Development', pt: 'Desenvolvimento Android' },
        detail: {
          en: 'Optimization and bug fixes for an Android app uploading GPS, camera and microphone data in background.',
          pt: 'Optimização e correcção de erros numa app Android que envia dados de GPS, câmara e microfone em segundo plano.'
        },
        tags: ['Android']
      },
      {
        period: { en: '2015 · 2 months', pt: '2015 · 2 meses' },
        title: { en: 'Systems Development', pt: 'Desenvolvimento de Sistemas' },
        detail: {
          en: 'Streaming server for authenticated video receiving/recording; evaluated FFServer, nginx-rtmp and Wowza, shipped Kurento with WebRTC.',
          pt: 'Servidor de streaming para recepção/gravação de vídeo autenticada; avaliados FFServer, nginx-rtmp e Wowza, implementado Kurento com WebRTC.'
        },
        tags: ['Kurento', 'WebRTC', 'Streaming']
      },
      {
        period: { en: '2015–2016 · 20 months', pt: '2015–2016 · 20 meses' },
        title: { en: 'Full-Stack Web Development', pt: 'Desenvolvimento Web Full-Stack' },
        detail: {
          en: 'Incident-handling server with real-time monitoring over WebSockets.',
          pt: 'Servidor de gestão de incidentes com monitorização em tempo real via WebSockets.'
        },
        tags: ['PlayFramework', 'MongoDB', 'Maven', 'jQuery', 'Bootstrap']
      },
      {
        period: { en: '2014 · 4 months', pt: '2014 · 4 meses' },
        title: { en: 'Full-Stack Web Development', pt: 'Desenvolvimento Web Full-Stack' },
        detail: {
          en: 'Chat-application architecture with message sync over HTTP long polling.',
          pt: 'Arquitectura de aplicação de chat com sincronização de mensagens por HTTP long polling.'
        },
        tags: ['Android', 'PlayFramework', 'MongoDB']
      }
    ]
  },
  {
    org: 'IST / INESC',
    place: { en: 'Instituto Superior Técnico, Lisbon', pt: 'Instituto Superior Técnico, Lisboa' },
    roles: [
      {
        period: { en: '2015 · 1 year', pt: '2015 · 1 ano' },
        title: {
          en: 'Master Thesis — interactive multi-user video chat',
          pt: 'Tese de Mestrado — videochat interactivo multiusador'
        },
        detail: {
          en: 'Recording, content overlay and collaborative text editor; Kurento mixing + QR detection, operational transforms via ot.js.',
          pt: 'Gravação, sobreposição de conteúdo e editor de texto colaborativo; mistura Kurento + detecção de QR, transformações operacionais via ot.js.'
        },
        tags: ['Kurento', 'WebRTC', 'ot.js', 'JavaScript'],
        link: 'https://www.youtube.com/watch?v=TWfbcBKbseA',
        linkLabel: { en: 'Watch demo', pt: 'Ver demonstração' }
      },
      {
        period: { en: '2014 · 6 months', pt: '2014 · 6 meses' },
        title: {
          en: 'Scientific Initiation Scholarship — INESC',
          pt: 'Bolsa de Iniciação Científica — INESC'
        },
        detail: {
          en: 'Frontend development for the Bimk project.',
          pt: 'Desenvolvimento front-end para o projecto Bimk.'
        },
        tags: ['PlayFramework', 'Revit API', 'Git']
      },
      {
        period: { en: '2013 · 6 months', pt: '2013 · 6 meses' },
        title: {
          en: 'Scientific Initiation Scholarship — CEG-IST',
          pt: 'Bolsa de Iniciação Científica — CEG-IST'
        },
        detail: {
          en: 'Decision-analysis software (MACBETH) in WPF, with a judgement-suggestion algorithm over lpsolve.',
          pt: 'Software de análise de decisão (MACBETH) em WPF, com um algoritmo de sugestão de juízos sobre lpsolve.'
        },
        tags: ['WPF', 'C#', 'lpsolve']
      }
    ]
  },
  {
    org: { en: 'Earlier', pt: 'Anteriores' },
    place: '',
    roles: [
      {
        period: { en: '2013 · 2 weeks', pt: '2013 · 2 semanas' },
        title: { en: 'Summer Work — LCG', pt: 'Trabalho de Verão — LCG' },
        detail: {
          en: 'Frontend for decision-analysis software.',
          pt: 'Front-end para software de análise de decisão.'
        },
        tags: ['ASP.NET']
      },
      {
        period: '2012',
        title: {
          en: 'Pizza Night Competition — 2nd place, Windows Phone',
          pt: 'Competição Pizza Night — 2.º lugar, Windows Phone'
        },
        detail: {
          en: 'Microsoft Lisbon Experience, with the game Infinity Edge.',
          pt: 'Microsoft Lisbon Experience, com o jogo Infinity Edge.'
        },
        tags: ['Windows Phone', 'XNA']
      }
    ]
  }
]

export const education = [
  {
    period: '2013–2016',
    degree: { en: 'Master of Science', pt: 'Mestrado' },
    school: 'Instituto Superior Técnico — Taguspark',
    detail: {
      en: 'Telecommunications and Informatics Engineering · final grade 16/20',
      pt: 'Engenharia de Telecomunicações e Informática · nota final 16/20'
    },
    link: 'https://fenix.tecnico.ulisboa.pt/cursos/merc/dissertacao/1691203502342257',
    linkLabel: { en: 'Master thesis (Fenix)', pt: 'Tese de mestrado (Fenix)' }
  },
  {
    period: '2009–2014',
    degree: { en: 'Bachelor of Science', pt: 'Licenciatura' },
    school: 'Instituto Superior Técnico — Taguspark',
    detail: {
      en: 'Communication Networks Engineering · final grade 13.2/20',
      pt: 'Engenharia de Redes de Comunicação · nota final 13.2/20'
    },
    link: 'https://conselhopedagogico.tecnico.ulisboa.pt/premios-e-projetos/quadro-e-diplomas-de-merito/quadro-de-merito-academico-20132014/#leti',
    linkLabel: {
      en: 'Academic merit board 2013/2014',
      pt: 'Quadro de mérito académico 2013/2014'
    }
  }
]

export const skills = {
  programming: [
    'Java',
    'Vue',
    'Angular',
    'React',
    'C',
    'C++ (OpenGL/Vulkan)',
    'C#',
    'Python',
    'TypeScript / JavaScript',
    'GLSL / HLSL',
    'WebGL / WebRTC',
    'Spring Boot',
    'SQL & NoSQL'
  ],
  databases: ['Oracle', 'PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'Neo4j', 'SQLite'],
  soft: [
    { en: 'Time Management', pt: 'Gestão de tempo' },
    { en: 'Problem-Solving', pt: 'Resolução de problemas' },
    { en: 'Team Player', pt: 'Espírito de equipa' },
    { en: 'Self Confidence', pt: 'Autoconfiança' },
    { en: 'Adaptability', pt: 'Adaptabilidade' }
  ]
}

export const languages = [
  { name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'native', pt: 'nativo' } },
  { name: { en: 'English', pt: 'Inglês' }, level: { en: 'fluent', pt: 'fluente' } },
  { name: { en: 'French', pt: 'Francês' }, level: { en: 'A2', pt: 'A2' } }
]

// Pre-GitHub-era applications from the CV. Only vrMusic has a live repo;
// the rest are listed as text (original store links are long dead).
export const earlyApps = [
  {
    year: '2015',
    name: 'Bomb Raider',
    detail: {
      en: 'Single/multiplayer Android game; OpenGL ES rendering, WiFi-Direct multiplayer.',
      pt: 'Jogo Android para um/múltiplos jogadores; renderização OpenGL ES, multijogador por WiFi-Direct.'
    },
    video: 'https://www.youtube.com/watch?v=_ceeTe4TS1U'
  },
  {
    year: '2013',
    name: 'OpenGlobe',
    detail: {
      en: 'Earth-surface modeling from GPS and topographic data, plus satellite prediction from ephemeris data.',
      pt: 'Modelação da superfície terrestre a partir de dados GPS e topográficos, além de previsão de satélites a partir de dados de efemérides.'
    },
    video: 'https://www.youtube.com/watch?v=f1tAC4ZhqkQ'
  },
  {
    year: '2012',
    name: 'Infinity Edge',
    detail: {
      en: 'First-person spaceship shooter for Windows Phone 7 in XNA/HLSL — 2nd place, Pizza Night competition.',
      pt: 'Jogo de nave espacial em primeira pessoa para Windows Phone 7 em XNA/HLSL — 2.º lugar, competição Pizza Night.'
    },
    video: 'https://www.youtube.com/watch?v=3gUKui7O9TY'
  },
  {
    year: '2011',
    name: 'Era of Empires',
    detail: {
      en: '3D environment generator and real-time-strategy engine in OpenGL.',
      pt: 'Gerador de ambientes 3D e motor de estratégia em tempo real em OpenGL.'
    },
    video: 'https://www.youtube.com/watch?v=ly_NmJW4YTY'
  }
]

export const interests = {
  en: 'Game development, 3D & design tools, web design, network security, jogging, kayaking, karate, yoga, cycling, wild camping and crypto-currencies.',
  pt: 'Desenvolvimento de jogos, ferramentas 3D e de design, web design, segurança de redes, corrida, canoagem, karaté, ioga, ciclismo, campismo selvagem e criptomoedas.'
}
