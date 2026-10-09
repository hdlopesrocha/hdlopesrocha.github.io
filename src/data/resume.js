// Factual CV data, transcribed from https://github.com/hdlopesrocha/cv (cv.tex).
// Nothing here is invented — dates, roles, grades and links come from the CV.

export const RESUME = {
  fullName: 'Henrique Duarte Lopes Rocha',
  title: 'Telecommunications and Informatics Engineer',
  location: 'Castelo Branco, Portugal',
  email: 'hdlopesrocha@protonmail.com',
  phone: '(+351) 938781922',
  phoneHref: 'tel:+351938781922',
  github: 'https://github.com/hdlopesrocha',
  youtube: 'https://www.youtube.com/user/hdlopesrocha',
  site: 'https://hdlopesrocha.github.io/',
  cvEn: 'https://github.com/hdlopesrocha/cv/blob/master/cv.pdf',
  cvFr: 'https://github.com/hdlopesrocha/cv/blob/master/french.pdf'
}

export const experience = [
  {
    org: 'CERN',
    place: 'European Organization for Nuclear Research',
    roles: [
      {
        period: '2019 –',
        title: 'Full-Stack Development & Support — FAP-BC-UI',
        detail:
          'Maintenance, development and support of recruitment and document-management applications.',
        tags: ['Vue', 'React', 'Elastic Search', 'Prometheus', 'OracleHR', 'Activiti']
      },
      {
        period: 'Sep 2019 · 4 days',
        title: 'Speaker — CERN Spring Campus, Hamburg University of Technology',
        detail:
          'Talks: “Exploring Music Using the WebAudio API” and “Visualizing Music in 2D and 3D Using the Canvas API and WebGL”.',
        tags: ['WebAudio', 'Canvas', 'WebGL'],
        link: 'https://hdlopesrocha.github.io/spring-campus-2019/dist/spring/',
        linkLabel: 'Talk demos'
      },
      {
        period: '2018 · 6 months',
        title: 'Full-Stack & Database Development — IMPACT',
        detail: 'Maintenance and optimization of an intervention management, planning and coordination tool.',
        tags: ['Grails', 'HazelCast']
      },
      {
        period: 'Apr 2018 · 4 days',
        title: 'Speaker — CERN Spring Campus, Riga Technical University',
        detail:
          'Talks: “Real-time communications between web browsers using WebRTC” and “Collision detection for massive object counts in 3D”.',
        tags: ['WebRTC', '3D', 'Collision detection']
      },
      {
        period: '2018 · 6 months',
        title: 'Full-Stack & Mobile Development — DigiWare',
        detail: 'Work-delivery tool for a warehouse at CERN.',
        tags: ['SpringBoot', 'Ionic', 'Angular', 'Hibernate', 'Oracle DB']
      },
      {
        period: '2017 · 2 months',
        title: 'Front-end & Business Intelligence — APT',
        detail: 'Cost-analysis tool for CERN activities.',
        tags: ['Grails', 'GWT', 'Pentaho']
      },
      {
        period: '2016–2018 · 2 years',
        title: 'Applications Development — PLAN',
        detail:
          'Planning tool for CERN activities, built with Event Sourcing (ES) and CQRS patterns.',
        tags: ['SpringBoot', 'Handlebars', 'Hibernate', 'Oracle DB', 'ES', 'CQRS']
      },
      {
        period: '2016 · 2 months',
        title: 'Full-Stack Development — PM-Support calendar',
        detail: 'Calendar application for support time management.',
        tags: ['SpringBoot', 'JIRA', 'Thymeleaf', 'Polymer']
      }
    ]
  },
  {
    org: 'Bullray-CIT',
    place: 'Portugal',
    roles: [
      {
        period: '2016 · 7 months',
        title: 'Applications Development',
        detail:
          'UI for a bank security device synced with servers: microcontroller sensor data over USB, JavaFX interface, network-camera discovery.',
        tags: ['JavaFX', 'USB', 'nmap']
      },
      {
        period: '2015 · 2 months',
        title: 'Android Development',
        detail: 'Optimization and bug fixes for an Android app uploading GPS, camera and microphone data in background.',
        tags: ['Android']
      },
      {
        period: '2015 · 2 months',
        title: 'Systems Development',
        detail: 'Streaming server for authenticated video receiving/recording; evaluated FFServer, nginx-rtmp and Wowza, shipped Kurento with WebRTC.',
        tags: ['Kurento', 'WebRTC', 'Streaming']
      },
      {
        period: '2015–2016 · 20 months',
        title: 'Full-Stack Web Development',
        detail: 'Incident-handling server with real-time monitoring over WebSockets.',
        tags: ['PlayFramework', 'MongoDB', 'Maven', 'jQuery', 'Bootstrap']
      },
      {
        period: '2014 · 4 months',
        title: 'Full-Stack Web Development',
        detail: 'Chat-application architecture with message sync over HTTP long polling.',
        tags: ['Android', 'PlayFramework', 'MongoDB']
      }
    ]
  },
  {
    org: 'IST / INESC',
    place: 'Instituto Superior Técnico, Lisbon',
    roles: [
      {
        period: '2015 · 1 year',
        title: 'Master Thesis — interactive multi-user video chat',
        detail:
          'Recording, content overlay and collaborative text editor; Kurento mixing + QR detection, operational transforms via ot.js.',
        tags: ['Kurento', 'WebRTC', 'ot.js', 'JavaScript'],
        link: 'https://www.youtube.com/watch?v=TWfbcBKbseA',
        linkLabel: 'Watch demo'
      },
      {
        period: '2014 · 6 months',
        title: 'Scientific Initiation Scholarship — INESC',
        detail: 'Frontend development for the Bimk project.',
        tags: ['PlayFramework', 'Revit API', 'Git']
      },
      {
        period: '2013 · 6 months',
        title: 'Scientific Initiation Scholarship — CEG-IST',
        detail:
          'Decision-analysis software (MACBETH) in WPF, with a judgement-suggestion algorithm over lpsolve.',
        tags: ['WPF', 'C#', 'lpsolve']
      }
    ]
  },
  {
    org: 'Earlier',
    place: '',
    roles: [
      {
        period: '2013 · 2 weeks',
        title: 'Summer Work — LCG',
        detail: 'Frontend for decision-analysis software.',
        tags: ['ASP.NET']
      },
      {
        period: '2012',
        title: 'Pizza Night Competition — 2nd place, Windows Phone',
        detail: 'Microsoft Lisbon Experience, with the game Infinity Edge.',
        tags: ['Windows Phone', 'XNA']
      }
    ]
  }
]

export const education = [
  {
    period: '2013–2016',
    degree: 'Master of Science',
    school: 'Instituto Superior Técnico — Taguspark',
    detail: 'Telecommunications and Informatics Engineering · final grade 16/20'
  },
  {
    period: '2009–2014',
    degree: 'Bachelor of Science',
    school: 'Instituto Superior Técnico — Taguspark',
    detail: 'Communication Networks Engineering · final grade 13.2/20'
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
  soft: ['Time Management', 'Problem-Solving', 'Team Player', 'Self Confidence', 'Adaptability']
}

export const languages = [
  { name: 'Portuguese', level: 'native' },
  { name: 'English', level: 'fluent' },
  { name: 'French', level: 'A2' }
]

// Pre-GitHub-era applications from the CV. Only vrMusic has a live repo;
// the rest are listed as text (original store links are long dead).
export const earlyApps = [
  {
    year: '2020',
    name: 'VR music visualizer',
    detail: 'VR music visualizer using WebXR and WebGL.',
    link: 'https://hdlopesrocha.github.io/vrMusic/',
    linkLabel: 'Live demo',
    video: 'https://www.youtube.com/watch?v=DSdHLLsvcnM'
  },
  {
    year: '2015',
    name: 'Bomb Raider',
    detail: 'Single/multiplayer Android game; OpenGL ES rendering, WiFi-Direct multiplayer.'
  },
  { year: '2013', name: 'OpenGlobe', detail: 'Earth-surface modeling from GPS and topographic data, plus satellite prediction from ephemeris data.' },
  {
    year: '2012',
    name: 'Infinity Edge',
    detail: 'First-person spaceship shooter for Windows Phone 7 in XNA/HLSL — 2nd place, Pizza Night competition.'
  },
  {
    year: '2011',
    name: 'Era of Empires',
    detail: '3D environment generator and real-time-strategy engine in OpenGL.'
  }
]

export const interests =
  'Game development, 3D & design tools, web design, network security, jogging, kayaking, karate, yoga, cycling, wild camping and crypto-currencies.'
