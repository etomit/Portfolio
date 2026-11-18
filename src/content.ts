/**
 * Tout le texte du site, en français et en anglais.
 * Pour modifier un contenu (poste, projet, diplôme…), c'est ici que ça se passe.
 *
 * Ligne éditoriale : « je », des phrases courtes, des noms propres et des dates
 * plutôt que des adjectifs. Pas de slogan, pas de liste de qualités.
 */

export type Lang = 'fr' | 'en'

export const LINKS = {
  email: 'timothee.maire54300@gmail.com',
  github: 'https://github.com/etomit',
  linkedin: 'https://www.linkedin.com/in/timoth%C3%A9e-maire-476bb8194/',
  pokeline: 'https://pokeline-production.up.railway.app/',
  pokelineRepo: 'https://github.com/etomit/PokeLine',
  commerce: 'https://moncommercerapide-production.up.railway.app/',
} as const

export const SECTION_IDS = ['experience', 'projects', 'ai', 'skills', 'people', 'education', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

interface Job {
  company: string
  role: string
  period: string
  location: string
  /** Une à trois phrases : ce qui a été construit, et pour qui. */
  summary: string
  /** Détail facultatif, quand un poste couvre plusieurs chantiers distincts. */
  points: string[]
  tags: string[]
}

interface Diploma {
  period: string
  level: string
  degree: string
  school: string
  note: string
}

const jobsFr: Job[] = [
  {
    company: 'Daimler Buses France',
    role: 'Développeur web',
    period: 'Sept. 2024 — aujourd’hui',
    location: 'Ligny-en-Barrois',
    summary:
      'Je développe l’intranet de l’entreprise, en Symfony et React. Plus de 1 200 salariés s’en servent. Voici les modules sur lesquels j’ai travaillé :',
    points: [
      'Les propositions d’amélioration continue (PAC) : chacun dépose une idée, les autres votent.',
      'Des questionnaires qualité qui changent selon le client, le type de véhicule et le contexte du contrôle.',
      'Le magasin d’outillage, construit comme une boutique en ligne.',
      'L’entreposage et le suivi des déplacements de véhicules.',
    ],
    tags: ['Symfony', 'React', 'PHP', 'TypeScript'],
  },
  {
    company: 'Nexiom SAS',
    role: 'Développeur d’applications',
    period: 'Oct. 2023 — avr. 2024',
    location: 'Nancy',
    summary:
      'Un outil d’analyse des impressions, écrit en C# .NET sur une base SQL. J’en ai aussi rédigé les spécifications fonctionnelles et techniques.',
    points: [],
    tags: ['C#', '.NET', 'SQL'],
  },
  {
    company: 'Kuehne + Nagel',
    role: 'Développeur',
    period: 'Janv. — févr. 2023',
    location: 'Limas',
    summary:
      'Un portail destiné aux développeurs, en JavaScript et CSS, déployé avec NGINX. Avant de coder, j’ai écrit le cahier des charges et dessiné les maquettes.',
    points: [],
    tags: ['JavaScript', 'CSS', 'NGINX'],
  },
  {
    company: 'Lidl France',
    role: 'Opérateur logistique',
    period: 'Août 2022 — sept. 2025',
    location: 'Gondreville',
    summary:
      'Préparation de commandes (viandes, frais, sec), containers isothermes et chariots élévateurs, en parallèle de mes études. Pas une ligne de code, mais trois ans de terrain : ça aide à comprendre ceux pour qui j’écris des logiciels aujourd’hui.',
    points: [],
    tags: ['Logistique'],
  },
  {
    company: 'Lycée Jean Prouvé',
    role: 'Développeur web',
    period: 'Mai — juil. 2022',
    location: 'Nancy',
    summary:
      'Un site web dynamique sous WordPress, pour le lycée où j’avais passé mon bac. Je l’ai présenté à la fin devant tout le corps enseignant.',
    points: [],
    tags: ['WordPress'],
  },
]

const jobsEn: Job[] = [
  {
    company: 'Daimler Buses France',
    role: 'Web developer',
    period: 'Sept. 2024 — today',
    location: 'Ligny-en-Barrois',
    summary:
      'I work on the company intranet, built with Symfony and React. More than 1,200 employees use it. These are the modules I have worked on:',
    points: [
      'Continuous improvement proposals (PAC): anyone can submit an idea, everyone else votes.',
      'Quality questionnaires that change with the customer, the vehicle type and the inspection context.',
      'The tool store, built like an online shop.',
      'Vehicle storage and movement tracking.',
    ],
    tags: ['Symfony', 'React', 'PHP', 'TypeScript'],
  },
  {
    company: 'Nexiom SAS',
    role: 'Application developer',
    period: 'Oct. 2023 — Apr. 2024',
    location: 'Nancy',
    summary:
      'A print analysis tool written in C# .NET on a SQL database. I also wrote its functional and technical specifications.',
    points: [],
    tags: ['C#', '.NET', 'SQL'],
  },
  {
    company: 'Kuehne + Nagel',
    role: 'Developer',
    period: 'Jan. — Feb. 2023',
    location: 'Limas',
    summary:
      'A portal for developers, in JavaScript and CSS, deployed with NGINX. Before writing any code I wrote the requirements and drew the mockups.',
    points: [],
    tags: ['JavaScript', 'CSS', 'NGINX'],
  },
  {
    company: 'Lidl France',
    role: 'Logistics operator',
    period: 'Aug. 2022 — Sept. 2025',
    location: 'Gondreville',
    summary:
      'Order picking (meat, fresh, dry goods), insulated containers and forklifts, alongside my studies. Not a single line of code, but three years on the warehouse floor: it helps me understand the people I write software for today.',
    points: [],
    tags: ['Logistics'],
  },
  {
    company: 'Lycée Jean Prouvé',
    role: 'Web developer',
    period: 'May — Jul. 2022',
    location: 'Nancy',
    summary:
      'A dynamic WordPress website for the school where I had taken my baccalauréat. I presented it to the entire teaching staff at the end.',
    points: [],
    tags: ['WordPress'],
  },
]

const diplomasFr: Diploma[] = [
  {
    period: '2025 — 2027',
    level: 'Bac +5',
    degree: 'Master MAALSI — Manager en Architecture et Applications Logicielles des Systèmes d’Information',
    school: 'CESI, Nancy',
    note: 'En cours. Architecture d’entreprise et des SI, stratégie, pilotage de projets.',
  },
  {
    period: '2023 — 2025',
    level: 'Bac +3',
    degree: 'Licence Concepteur Développeur d’Applications (CDA)',
    school: 'CESI, Nancy',
    note: 'Développement logiciel, bases de données, méthodes agiles. Docker, GitLab, Node.js, React, Flutter.',
  },
  {
    period: '2021 — 2023',
    level: 'Bac +2',
    degree: 'BTS SIO, option Solutions Logicielles et Applications Métiers (SLAM)',
    school: 'Lycée Frédéric Chopin, Nancy',
    note: 'Applications en C#, Python, PHP et JavaScript. Bases de données relationnelles.',
  },
  {
    period: '2018 — 2021',
    level: 'Bac',
    degree: 'Bac pro Systèmes Numériques, option RISC',
    school: 'Lycée Jean Prouvé, Nancy',
    note: 'Mention très bien. Réseaux, équipements Cisco, VLAN, Arduino.',
  },
]

const diplomasEn: Diploma[] = [
  {
    period: '2025 — 2027',
    level: 'Bac +5',
    degree: 'Master’s degree in Information Systems Architecture and Software Applications (MAALSI)',
    school: 'CESI, Nancy',
    note: 'In progress. Enterprise and IS architecture, strategy, project management.',
  },
  {
    period: '2023 — 2025',
    level: 'Bac +3',
    degree: 'Bachelor’s degree in Application Design and Development (CDA)',
    school: 'CESI, Nancy',
    note: 'Software development, databases, agile methods. Docker, GitLab, Node.js, React, Flutter.',
  },
  {
    period: '2021 — 2023',
    level: 'Bac +2',
    degree: 'BTS SIO, Software Solutions and Business Applications track (SLAM)',
    school: 'Lycée Frédéric Chopin, Nancy',
    note: 'Applications in C#, Python, PHP and JavaScript. Relational databases.',
  },
  {
    period: '2018 — 2021',
    level: 'Bac',
    degree: 'Vocational baccalauréat in Digital Systems (RISC)',
    school: 'Lycée Jean Prouvé, Nancy',
    note: 'Highest honours. Networks, Cisco equipment, VLAN, Arduino.',
  },
]

const fr = {
  meta: {
    title: 'Timothée Maire — Développeur full-stack',
    description:
      'Timothée Maire, développeur full-stack chez Daimler Buses France. Un intranet Symfony / React utilisé par plus de 1 200 salariés, et des projets personnels en ligne : PokéLine, MonCommerce Rapide, une scène Three.js et deux mini-jeux.',
  },
  a11y: {
    skip: 'Aller au contenu',
    home: 'Timothée Maire — retour en haut de page',
    mainNav: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toDark: 'Passer au thème sombre',
    toLight: 'Passer au thème clair',
    switchLang: 'Switch the website to English',
    newTab: 'nouvel onglet',
    backToTop: 'Retour en haut de page',
    close: 'Fermer',
  },
  nav: {
    experience: 'Parcours',
    projects: 'Projets',
    ai: 'IA',
    skills: 'Outils',
    people: 'Côté humain',
    education: 'Formation',
    contact: 'Contact',
  } satisfies Record<SectionId, string>,
  hero: {
    stop: 'Grand Est, France',
    titleLead: 'Bonjour, moi c’est',
    titleName: 'Timothée.',
    titleRest: 'Je suis développeur full-stack chez Daimler Buses France.',
    lead: 'Depuis 2024, j’y développe un intranet Symfony / React dont se servent plus de 1 200 salariés : on y propose des améliorations, on y remplit les contrôles qualité des véhicules, on y commande son outillage. En parallèle, je prépare un master au CESI de Nancy. Et à côté, je fais des jeux.',
    primary: 'Voir les projets',
    secondary: 'M’écrire',
    portraitAlt: 'Portrait de Timothée Maire',
    portraitCaption: 'Timothée Maire',
    portraitPlace: 'Grand Est, FR',
    facts: [
      { label: 'En ce moment', value: 'Développeur web', detail: 'Daimler Buses France' },
      { label: 'En parallèle', value: 'Master MAALSI', detail: 'CESI Nancy · 2025 — 2027' },
      { label: 'Au quotidien', value: 'Symfony, React', detail: 'TypeScript, PHP' },
      { label: 'Langues', value: 'Français, anglais', detail: 'natif, professionnel' },
    ],
  },
  experience: {
    title: 'Parcours',
    intro:
      'J’ai commencé en 2022 par un site WordPress pour mon ancien lycée. Depuis : un portail développeurs chez Kuehne + Nagel, un outil d’analyse chez Nexiom, puis l’intranet de Daimler Buses France. Et, pendant trois ans, la préparation de commandes chez Lidl.',
    current: 'En poste',
    jobs: jobsFr,
  },
  projects: {
    title: 'Projets',
    intro: 'Tout ce qui suit est en ligne. Vous pouvez ouvrir, cliquer, jouer : rien n’est une capture d’écran d’un projet abandonné.',
    pokeline: {
      label: 'Jeu multijoueur · 2026',
      name: 'PokéLine',
      description:
        'Un jeu de combat Pokémon au tour par tour. On y joue seul contre une IA, à deux sur le même écran, ou en ligne dans un salon. Je l’ai écrit avec Laravel 12 ; le temps réel passe par WebSocket.',
      highlights: [
        'Le serveur calcule chaque tour : statistiques au niveau 100, STAB, priorités et table des 18 types.',
        'En solo, l’IA note chaque attaque possible (immunités, efficacité, dégâts estimés) et cherche le K.O.',
        'En ligne, les deux joueurs choisissent en même temps ; une transaction SQL empêche de jouer deux fois.',
        'Neuf objets à gagner, dix équipes par compte, et la victoire si l’adversaire disparaît 90 secondes.',
      ],
      tags: ['Laravel 12', 'Reverb', 'PostgreSQL', 'PokeAPI', 'GitHub Actions'],
      play: 'Jouer à PokéLine',
      source: 'Code source',
      alt: 'Combat dans PokéLine : Florizarre affronte Métalosse dans une arène rétro',
    },
    commerce: {
      label: 'Maquette de produit · en ligne',
      name: 'MonCommerce Rapide',
      description:
        'Une vitrine en ligne et du click & collect pour les commerces indépendants : le client parcourt le catalogue, commande, puis choisit son créneau de retrait. Pour l’instant c’est une maquette, mais elle est en ligne et tout y est cliquable.',
      roadmap: 'Prévu ensuite, pas encore fait : les cartes de fidélité dans Apple Wallet et Google Wallet.',
      tags: ['React', 'Click & collect'],
      action: 'Tester la maquette',
      alt: 'Page d’accueil de MonCommerce Rapide, une vitrine en ligne pour commerçants',
    },
    playground: {
      title: 'À essayer sans quitter la page',
      launch: 'Jouer',
      city: {
        name: 'Ville procédurale',
        description:
          'Une petite ville tirée au hasard, rendue en WebGL avec Three.js. Faites-la tourner à la souris ou au doigt, puis reconstruisez-la. Le bus qui fait le tour du quartier est un clin d’œil à mon employeur.',
        tech: 'Three.js · WebGL',
        rebuild: 'Reconstruire la ville',
        canvasLabel: 'Scène 3D interactive : une ville générée aléatoirement, à faire pivoter',
        hint: 'Glisser pour faire pivoter',
        loading: 'Chargement de la scène…',
        unsupported: 'WebGL n’est pas disponible sur cet appareil.',
      },
      g2048: {
        name: '2048',
        description: 'Le 2048, refait en React. Flèches du clavier ou glissement du doigt.',
        tech: 'React · TypeScript',
      },
      wordle: {
        name: 'Wordle bilingue',
        description:
          'Un Wordle en français et en anglais. Le dictionnaire est maison, donc incomplet : si un mot est refusé à tort, c’est ma faute.',
        tech: 'React · TypeScript',
      },
    },
  },
  skills: {
    title: 'Outils',
    intro:
      'Je préfère une interface lisible à un effet, et un outil qu’on adopte à une démo qui impressionne. Avant de choisir une techno, je regarde ce que font vraiment les gens : qui a le droit de faire quoi, qui valide, ce qu’il faut pouvoir retrouver six mois plus tard.',
    groups: [
      { label: 'Tous les jours, chez Daimler Buses', items: ['Symfony', 'React', 'TypeScript', 'PHP'] },
      { label: 'Sur mes projets', items: ['Laravel', 'PostgreSQL', 'WebSocket', 'Three.js', 'Docker'] },
      { label: 'Déjà pratiqués, en entreprise ou en formation', items: ['.NET', 'SQL', 'Node.js', 'Python', 'Flutter', 'NGINX', 'WordPress', 'Git'] },
    ],
  },
  ai: {
    title: 'IA',
    intro:
      'Sur mes projets personnels, je ne code plus seul : je dirige des équipes d’agents. L’un orchestre, les autres ont chacun leur périmètre, et un modèle d’une autre famille relit le tout. Mon travail consiste à découper, à écrire les consignes et à vérifier ce qui revient.',
    projectsTitle: 'Trois projets menés avec des agents',
    projects: [
      {
        name: 'Les Oubliettes de Sombrepierre',
        status: 'Roguelike en Rust',
        text: 'Un jeu réalisé par huit agents : un orchestrateur sous Claude Code, des sous-agents pour le pixel art, l’équilibrage, le donjon et les menus, et Codex pour le combat, les sauvegardes, la revue et les commits. Chaque agent a sa fiche de mission et sa liste de fichiers.',
      },
      {
        name: 'Market Synapse',
        status: 'Trading en simulation',
        text: 'Cinq modèles reçoivent le même instantané de marché, l’analysent chacun de leur côté, puis débattent ; l’un d’eux tranche. Aucune IA ne peut passer d’ordre : elle propose une intention, et c’est un gestionnaire de risque écrit en Python, sans IA, qui décide de l’exécuter ou non.',
      },
      {
        name: 'Renaissance',
        status: 'City-builder sous Godot, en cours',
        text: 'Un agent « directeur » répartit le travail entre des agents spécialisés qui avancent en parallèle, chacun dans sa copie du dépôt, et consigne chaque décision qu’il prend pour que je puisse la revoir.',
      },
    ],
    techniquesTitle: 'Ce que j’utilise pour que ça tienne',
    techniques: [
      {
        name: 'Agent à agent (A2A)',
        text: 'Les agents se passent le travail sans passer par moi : l’orchestrateur confie une mission, l’agent rend un rapport, un autre le relit.',
      },
      {
        name: 'Contrats gelés, périmètres exclusifs',
        text: 'Avant de lancer qui que ce soit, les points de contact du code sont figés : on peut ajouter, jamais renommer. Chaque mission a sa liste de fichiers, le reste est en lecture seule.',
      },
      {
        name: 'Revue croisée',
        text: 'Ce qu’un modèle écrit, un modèle d’une autre famille le relit. Ces revues trouvent de vrais défauts.',
      },
      {
        name: 'Voir pour croire',
        text: 'Le jeu sait se jouer tout seul et produire des captures d’écran. Un agent d’interface doit les regarder avant de dire que c’est terminé.',
      },
      {
        name: 'Garde-fous sans IA',
        text: 'Ce qui engage quelque chose passe par une règle déterministe, jamais par le modèle qui propose.',
      },
      {
        name: 'Prévoir la panne',
        text: 'Un quota tombe toujours en pleine tâche. Une fiche de mission écrite et un état sur le disque permettent à un autre agent de reprendre.',
      },
    ],
    note: 'Au quotidien, je me sers de Claude Code, Codex et Gemini pour explorer une base de code, prototyper, tester et documenter plus vite. Les choix d’architecture et la relecture finale, je les garde.',
  },
  people: {
    title: 'Côté humain',
    intro:
      'C’est la direction que je veux donner à la suite : être de plus en plus au contact des clients et des utilisateurs, pour comprendre le besoin à la source plutôt que de le recevoir déjà traduit.',
    items: [
      {
        name: 'Écouter avant de coder',
        text: 'Chez Kuehne + Nagel comme chez Nexiom, j’ai commencé par le cahier des charges ou les spécifications, avant la première ligne de code.',
      },
      {
        name: 'Présenter',
        text: 'Mon premier site, je l’ai présenté devant tout le corps enseignant d’un lycée. Expliquer un outil à des gens dont ce n’est pas le métier fait partie du travail.',
      },
      {
        name: 'Connaître le terrain',
        text: 'Trois ans de préparation de commandes chez Lidl, en parallèle de mes études : le travail en équipe, et le point de vue de celui qui utilise l’outil plutôt que de celui qui le conçoit.',
      },
      {
        name: 'Mener de front',
        text: 'Depuis 2022, j’avance en même temps sur les études, l’entreprise et mes projets personnels.',
      },
      {
        name: 'Donner une consigne claire',
        text: 'Diriger des agents IA demande la même chose que travailler avec des collègues : un objectif net, un périmètre, et une relecture.',
      },
    ],
  },
  education: {
    title: 'Formation',
    intro: 'Je suis arrivé au développement par le réseau et le matériel : un bac pro en systèmes numériques, puis un BTS, une licence, et maintenant un master.',
    items: diplomasFr,
  },
  contact: {
    stop: 'Terminus, tout le monde descend',
    title: 'Écrivez-moi.',
    text: 'Une question, une proposition ? Le plus simple reste l’email.',
    copy: 'Copier l’adresse',
    copied: 'Adresse copiée',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    location: 'Grand Est, France',
    footer: 'Timothée Maire',
    rights: 'Construit avec React, TypeScript et Three.js. Aucun traceur.',
  },
  games: {
    score: 'Score',
    best: 'Meilleur',
    newGame: 'Nouvelle partie',
    won: 'Gagné !',
    lost: 'Perdu',
    retry: 'Rejouer',
    hint2048: 'Flèches du clavier ou glissement du doigt pour déplacer les tuiles.',
    wordleHint: 'Trouvez le mot de 5 lettres en 6 essais.',
    wordleUnknown: 'Mot absent de la liste',
    wordleAnswer: 'Le mot était',
    enter: 'Entrée',
    backspace: 'Effacer',
  },
}

export type Content = typeof fr

const en: Content = {
  meta: {
    title: 'Timothée Maire — Full-stack developer',
    description:
      'Timothée Maire, full-stack developer at Daimler Buses France. A Symfony / React intranet used by more than 1,200 employees, and live personal projects: PokéLine, MonCommerce Rapide, a Three.js scene and two mini-games.',
  },
  a11y: {
    skip: 'Skip to content',
    home: 'Timothée Maire — back to top',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
    switchLang: 'Passer le site en français',
    newTab: 'new tab',
    backToTop: 'Back to top',
    close: 'Close',
  },
  nav: {
    experience: 'Work',
    projects: 'Projects',
    ai: 'AI',
    skills: 'Tools',
    people: 'People',
    education: 'Education',
    contact: 'Contact',
  },
  hero: {
    stop: 'Grand Est, France',
    titleLead: 'Hi, I’m',
    titleName: 'Timothée.',
    titleRest: 'I’m a full-stack developer at Daimler Buses France.',
    lead: 'Since 2024 I have been building a Symfony / React intranet there, used by more than 1,200 employees: they suggest improvements, fill in vehicle quality checks and order their tools on it. Alongside the job I am studying for a master’s degree at CESI Nancy. And on the side, I make games.',
    primary: 'See the projects',
    secondary: 'Email me',
    portraitAlt: 'Portrait of Timothée Maire',
    portraitCaption: 'Timothée Maire',
    portraitPlace: 'Grand Est, FR',
    facts: [
      { label: 'Right now', value: 'Web developer', detail: 'Daimler Buses France' },
      { label: 'Alongside', value: 'Master’s degree (MAALSI)', detail: 'CESI Nancy · 2025 — 2027' },
      { label: 'Every day', value: 'Symfony, React', detail: 'TypeScript, PHP' },
      { label: 'Languages', value: 'French, English', detail: 'native, professional' },
    ],
  },
  experience: {
    title: 'Work',
    intro:
      'I started in 2022 with a WordPress site for my former school. Since then: a developer portal at Kuehne + Nagel, an analysis tool at Nexiom, then the Daimler Buses France intranet. And, for three years, picking orders at Lidl.',
    current: 'Current',
    jobs: jobsEn,
  },
  projects: {
    title: 'Projects',
    intro: 'Everything below is live. You can open it, click around and play: none of it is a screenshot of an abandoned project.',
    pokeline: {
      label: 'Multiplayer game · 2026',
      name: 'PokéLine',
      description:
        'A turn-based Pokémon battle game. You can play alone against an AI, with a friend on the same screen, or online in a lobby. I wrote it with Laravel 12; the real-time part runs over WebSocket.',
      highlights: [
        'The server resolves every turn: level-100 stats, STAB, move priority and the full 18-type chart.',
        'In solo mode the AI scores every possible move (immunities, effectiveness, estimated damage) and goes for the K.O.',
        'Online, both players choose at the same time; a SQL transaction stops anyone from acting twice.',
        'Nine items to win, ten teams per account, and a win if your opponent vanishes for 90 seconds.',
      ],
      tags: ['Laravel 12', 'Reverb', 'PostgreSQL', 'PokeAPI', 'GitHub Actions'],
      play: 'Play PokéLine',
      source: 'Source code',
      alt: 'A PokéLine battle: Venusaur faces Metagross in a retro arena',
    },
    commerce: {
      label: 'Product prototype · live',
      name: 'MonCommerce Rapide',
      description:
        'An online storefront with click and collect for independent shops: the customer browses the catalogue, orders, then picks a collection slot. It is a prototype for now, but it is live and everything in it is clickable.',
      roadmap: 'Planned next, not built yet: loyalty cards in Apple Wallet and Google Wallet.',
      tags: ['React', 'Click & collect'],
      action: 'Try the prototype',
      alt: 'MonCommerce Rapide home page, an online storefront for shopkeepers',
    },
    playground: {
      title: 'Things to try without leaving the page',
      launch: 'Play',
      city: {
        name: 'Procedural city',
        description:
          'A small random city rendered in WebGL with Three.js. Drag to rotate it with a mouse or a finger, then rebuild it. The bus doing laps around the block is a nod to my employer.',
        tech: 'Three.js · WebGL',
        rebuild: 'Rebuild the city',
        canvasLabel: 'Interactive 3D scene: a randomly generated city you can rotate',
        hint: 'Drag to rotate',
        loading: 'Loading the scene…',
        unsupported: 'WebGL is not available on this device.',
      },
      g2048: {
        name: '2048',
        description: '2048, rebuilt in React. Arrow keys or a swipe.',
        tech: 'React · TypeScript',
      },
      wordle: {
        name: 'Bilingual Wordle',
        description:
          'A Wordle in French and English. The dictionary is home-made, so it is incomplete: if a real word gets rejected, that one is on me.',
        tech: 'React · TypeScript',
      },
    },
  },
  skills: {
    title: 'Tools',
    intro:
      'I would rather ship a readable interface than an effect, and a tool people adopt than a demo that impresses. Before picking a technology I look at what people actually do: who is allowed to do what, who approves it, and what must still be traceable six months later.',
    groups: [
      { label: 'Every day, at Daimler Buses', items: ['Symfony', 'React', 'TypeScript', 'PHP'] },
      { label: 'On my own projects', items: ['Laravel', 'PostgreSQL', 'WebSocket', 'Three.js', 'Docker'] },
      { label: 'Used before, at work or in training', items: ['.NET', 'SQL', 'Node.js', 'Python', 'Flutter', 'NGINX', 'WordPress', 'Git'] },
    ],
  },
  ai: {
    title: 'AI',
    intro:
      'On my own projects I no longer code alone: I run teams of agents. One orchestrates, the others each own a scope, and a model from another family reviews everything. My job is to split the work, write the briefs and check what comes back.',
    projectsTitle: 'Three projects built with agents',
    projects: [
      {
        name: 'Les Oubliettes de Sombrepierre',
        status: 'Roguelike in Rust',
        text: 'A game built by eight agents: an orchestrator running in Claude Code, sub-agents for pixel art, balancing, the dungeon and the menus, and Codex for combat, saves, review and commits. Every agent has a mission brief and its own list of files.',
      },
      {
        name: 'Market Synapse',
        status: 'Paper trading',
        text: 'Five models receive the same market snapshot, analyse it separately, then debate; one of them makes the call. No AI can place an order: it proposes an intent, and a risk manager written in Python, with no AI in it, decides whether to execute.',
      },
      {
        name: 'Renaissance',
        status: 'City-builder in Godot, in progress',
        text: 'A “director” agent hands work to specialised agents running in parallel, each in its own copy of the repository, and logs every decision it takes so that I can review it.',
      },
    ],
    techniquesTitle: 'What I use to make it hold together',
    techniques: [
      {
        name: 'Agent to agent (A2A)',
        text: 'Agents hand work to each other without going through me: the orchestrator assigns a mission, the agent returns a report, another one reviews it.',
      },
      {
        name: 'Frozen contracts, exclusive scopes',
        text: 'Before anyone starts, the touch points in the code are frozen: you may add, never rename. Each mission has its list of files; everything else is read-only.',
      },
      {
        name: 'Cross-review',
        text: 'What one model writes, a model from another family reviews. Those reviews find real defects.',
      },
      {
        name: 'Seeing is believing',
        text: 'The game can play itself and produce screenshots. An interface agent has to look at them before calling the work done.',
      },
      {
        name: 'Guardrails without AI',
        text: 'Anything with consequences goes through a deterministic rule, never through the model that proposes it.',
      },
      {
        name: 'Planning for failure',
        text: 'A quota always runs out mid-task. A written brief and state on disk let another agent pick the work up.',
      },
    ],
    note: 'Day to day I use Claude Code, Codex and Gemini to explore a codebase, prototype, test and document faster. Architecture choices and the final review stay with me.',
  },
  people: {
    title: 'People',
    intro:
      'This is where I want to go next: more and more contact with clients and users, to understand the need at its source rather than receive it already translated.',
    items: [
      {
        name: 'Listening before coding',
        text: 'At Kuehne + Nagel and at Nexiom alike, I started with the requirements or the specifications, before the first line of code.',
      },
      {
        name: 'Presenting',
        text: 'I presented my first website to the entire teaching staff of a school. Explaining a tool to people whose job is something else is part of the work.',
      },
      {
        name: 'Knowing the shop floor',
        text: 'Three years picking orders at Lidl alongside my studies: teamwork, and the point of view of the person who uses the tool rather than the one who designs it.',
      },
      {
        name: 'Keeping several things moving',
        text: 'Since 2022 I have been moving forward on studies, a job and my own projects at the same time.',
      },
      {
        name: 'Giving a clear brief',
        text: 'Running AI agents takes the same thing as working with colleagues: a sharp goal, a scope and a review.',
      },
    ],
  },
  education: {
    title: 'Education',
    intro: 'I came to software through networks and hardware: a vocational baccalauréat in digital systems, then a BTS, a bachelor’s degree, and now a master’s.',
    items: diplomasEn,
  },
  contact: {
    stop: 'Last stop, all change',
    title: 'Email me.',
    text: 'A question, an offer? Email is the easiest way.',
    copy: 'Copy address',
    copied: 'Address copied',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    location: 'Grand Est, France',
    footer: 'Timothée Maire',
    rights: 'Built with React, TypeScript and Three.js. No trackers.',
  },
  games: {
    score: 'Score',
    best: 'Best',
    newGame: 'New game',
    won: 'You won!',
    lost: 'Game over',
    retry: 'Play again',
    hint2048: 'Use the arrow keys or swipe to move the tiles.',
    wordleHint: 'Find the 5-letter word in 6 tries.',
    wordleUnknown: 'Not in the word list',
    wordleAnswer: 'The word was',
    enter: 'Enter',
    backspace: 'Delete',
  },
}

export const content: Record<Lang, Content> = { fr, en }
