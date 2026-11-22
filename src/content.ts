/**
 * Tout le texte du site, en français et en anglais.
 * Pour modifier un contenu (poste, projet, diplôme, lien), c'est ici que ça se passe.
 *
 * Ligne éditoriale : « je », des phrases courtes, des noms propres et des dates
 * plutôt que des adjectifs. Pas de slogan, pas de liste de qualités, aucun numéro
 * de section. Ne jamais ajouter un fait qui n'a pas été vérifié.
 */

export type Lang = 'fr' | 'en'

export const LINKS = {
  email: 'timothee.maire54300@gmail.com',
  github: 'https://github.com/etomit',
  linkedin: 'https://www.linkedin.com/in/timoth%C3%A9e-maire-476bb8194/',
  pokeline: 'https://pokeline-production.up.railway.app/',
  pokelineRepo: 'https://github.com/etomit/PokeLine',
  commerce: 'https://moncommercerapide-production.up.railway.app/',
  pokemonBattle: 'https://github.com/etomit/Pokemon_battle',
  pythonApi: 'https://github.com/etomit/python_api_rest',
  nipponsocket: 'https://github.com/etomit/nipponsocket',
  game30min: 'https://github.com/etomit/30minGame',
  breakout: 'https://github.com/etomit/Casse-brique',
  web1: 'https://github.com/etomit/web1',
} as const

export const SECTION_IDS = ['about', 'experience', 'projects', 'ai', 'skills', 'education', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

/** Vignettes filaires des cartes projets (dessinées dans components/Sketch.tsx). */
export type SketchId = 'pokeline' | 'commerce' | 'dungeon' | 'market' | 'city' | 'phone'

/**
 * Période en années décimales (2024.67 = septembre 2024), utilisée seulement pour placer
 * les cotes de la chronologie. Le texte affiché est toujours `period`.
 * `end: null` = en cours ; `planned` = date de fin prévue, pas encore atteinte.
 */
interface Span {
  start: number
  end: number | null
  planned?: boolean
}

interface Job extends Span {
  company: string
  role: string
  period: string
  location: string
  summary: string
  points: string[]
  tags: string[]
}

interface Diploma extends Span {
  period: string
  level: string
  degree: string
  school: string
  note: string
}

interface ProjectLink {
  label: string
  href: string
}

interface ProjectImage {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

interface Project {
  id: string
  name: string
  year: string
  kind: string
  summary: string
  description: string
  highlights: string[]
  note?: string
  tags: string[]
  links: ProjectLink[]
  sketch: SketchId
  image?: ProjectImage
  /** Mené avec une équipe d'agents IA. */
  agents?: boolean
  /** Dépôt privé : pas de lien public. */
  privateRepo?: boolean
}

interface ArchiveItem {
  year: string
  name: string
  text: string
  tech: string
  href: string
}

const POKELINE_IMAGE = {
  src: '/pokeline-1024.webp',
  srcSet: '/pokeline-640.webp 640w, /pokeline-1024.webp 1024w',
  width: 1024,
  height: 796,
}

const COMMERCE_IMAGE = {
  src: '/moncommerce-1600.webp',
  srcSet: '/moncommerce-800.webp 800w, /moncommerce-1600.webp 1600w',
  width: 1600,
  height: 895,
}

// ============================================================================
// FRANÇAIS — la typographie française (espaces insécables) est posée par
// scripts/typo-fr.mjs sur cette zone uniquement : relancez-le après une modification.
// ============================================================================

const jobsFr: Job[] = [
  {
    company: 'Daimler Buses France',
    role: 'Développeur web',
    period: 'Sept. 2024 — aujourd’hui',
    location: 'Ligny-en-Barrois',
    start: 2024.67,
    end: null,
    summary:
      'Je développe l’intranet de l’entreprise, en Symfony et React. Plus de 1 200 salariés s’en servent. Voici les modules sur lesquels j’ai travaillé :',
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
    start: 2023.75,
    end: 2024.33,
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
    start: 2023.0,
    end: 2023.17,
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
    start: 2022.58,
    end: 2025.75,
    summary:
      'Préparation de commandes et chariots élévateurs, en parallèle de mes études. Pas une ligne de code, mais trois ans de terrain : ça aide à comprendre ceux pour qui j’écris des logiciels aujourd’hui.',
    points: [],
    tags: ['Logistique'],
  },
  {
    company: 'Lycée Jean Prouvé',
    role: 'Développeur web',
    period: 'Mai — juil. 2022',
    location: 'Nancy',
    start: 2022.33,
    end: 2022.58,
    summary:
      'Un site web dynamique sous WordPress, pour le lycée où j’avais passé mon bac. Je l’ai présenté à la fin devant le corps enseignant.',
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
    start: 2025.67,
    end: 2027.5,
    planned: true,
  },
  {
    period: '2023 — 2025',
    level: 'Bac +3',
    degree: 'Licence Concepteur Développeur d’Applications (CDA)',
    school: 'CESI, Nancy',
    note: 'Développement logiciel, bases de données, méthodes agiles. Docker, GitLab, Node.js, React, Flutter.',
    start: 2023.67,
    end: 2025.5,
  },
  {
    period: '2021 — 2023',
    level: 'Bac +2',
    degree: 'BTS SIO, option Solutions Logicielles et Applications Métiers (SLAM)',
    school: 'Lycée Frédéric Chopin, Nancy',
    note: 'Applications en C#, Python, PHP et JavaScript. Bases de données relationnelles.',
    start: 2021.67,
    end: 2023.5,
  },
  {
    period: '2018 — 2021',
    level: 'Bac',
    degree: 'Bac pro Systèmes Numériques, option RISC',
    school: 'Lycée Jean Prouvé, Nancy',
    note: 'Mention très bien. Réseaux, équipements Cisco, VLAN, Arduino.',
    start: 2018.67,
    end: 2021.5,
  },
]

const projectsFr: Project[] = [
  {
    id: 'pokeline',
    name: 'PokéLine',
    year: '2026',
    kind: 'Jeu multijoueur',
    summary: 'Un jeu de combat Pokémon au tour par tour : seul contre une IA, à deux sur le même écran, ou en ligne.',
    description:
      'Je l’ai écrit avec Laravel 12 ; le temps réel passe par WebSocket, avec Laravel Reverb. En ligne, on se retrouve dans un salon.',
    highlights: [
      'Le serveur calcule chaque tour : statistiques au niveau 100, STAB, priorités et table des 18 types.',
      'En solo, l’IA note chaque attaque possible (immunités, efficacité, dégâts estimés) et cherche le K.O.',
      'En ligne, les deux joueurs choisissent en même temps ; une transaction SQL empêche de jouer deux fois.',
      'Neuf objets à gagner, dix équipes par compte, et la victoire si l’adversaire disparaît 90 secondes.',
      'Un hub 2D jouable, des sons 8-bit, une interface en français et en anglais, des tests PHPUnit.',
      'Déployé sur Railway en trois services : l’application, le serveur Reverb et PostgreSQL.',
    ],
    tags: ['Laravel 12', 'PHP 8.2', 'Reverb', 'PostgreSQL', 'Blade', 'Tailwind 4', 'Vite', 'PokeAPI', 'GitHub Actions'],
    links: [
      { label: 'Jouer à PokéLine', href: LINKS.pokeline },
      { label: 'Code source', href: LINKS.pokelineRepo },
    ],
    sketch: 'pokeline',
    image: { ...POKELINE_IMAGE, alt: 'Combat dans PokéLine : Florizarre affronte Métalosse dans une arène rétro' },
  },
  {
    id: 'commerce',
    name: 'MonCommerce Rapide',
    year: '',
    kind: 'Maquette de produit',
    summary: 'Une vitrine en ligne et du click & collect pour les commerces indépendants.',
    description:
      'Le client parcourt le catalogue, commande, puis choisit son créneau de retrait. Pour l’instant c’est une maquette, mais elle est en ligne et tout y est cliquable.',
    highlights: [],
    note: 'Prévu ensuite, pas encore fait : les cartes de fidélité dans Apple Wallet et Google Wallet.',
    tags: ['React', 'Click & collect'],
    links: [{ label: 'Tester la maquette', href: LINKS.commerce }],
    sketch: 'commerce',
    image: { ...COMMERCE_IMAGE, alt: 'Page d’accueil de MonCommerce Rapide, une vitrine en ligne pour commerçants' },
  },
  {
    id: 'sombrepierre',
    name: 'Les Oubliettes de Sombrepierre',
    year: '2026',
    kind: 'Roguelike en Rust',
    summary: 'Un roguelike en pixel art réalisé par une équipe d’agents IA que j’ai dirigée.',
    description:
      'Un chevalier descend un donjon tiré au sort, salle après salle, avec un boss toutes les cinq salles. Le jeu a été fait par une équipe d’agents : huit le premier jour, dix-neuf rôles en trois journées. Je tenais le rôle du client : je fixais les demandes, je tranchais, je regardais ce qui revenait.',
    highlights: [
      'Un orchestrateur sous Claude Code pose le socle et les contrats, puis lance les missions en parallèle.',
      'Des sous-agents Claude pour le pixel art (dessiné dans le code), l’équilibrage, le donjon, le duel et les menus ; Codex pour les sauvegardes, le son, l’intégration continue, la revue et les commits.',
      'Chaque agent a sa fiche de mission et sa liste de fichiers ; un modèle d’une autre famille relit le tout.',
      'La salle 100 est réellement atteignable : sur 20 000 parties jouées par le simulateur, 19,9 % y arrivent.',
    ],
    tags: ['Rust', 'macroquad', 'Claude Code', 'Codex'],
    links: [],
    sketch: 'dungeon',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'market',
    name: 'Market Synapse',
    year: '',
    kind: 'Trading en simulation',
    summary: 'Cinq modèles analysent le même marché puis débattent ; une règle sans IA décide.',
    description:
      'Aucune IA ne peut passer d’ordre : elle propose une intention, et c’est un gestionnaire de risque écrit en Python, sans IA, qui décide de l’exécuter ou non.',
    highlights: [
      'Le même instantané de marché (prix, actualités, portefeuille) part vers cinq modèles : Grok, GLM 5.2, Owl Alpha, Gemma 4 et GPT OSS.',
      'Chacun produit son analyse, puis ils débattent ; GLM 5.2 rend la décision finale.',
      'Le gestionnaire de risque valide ou refuse ; par défaut, les ordres partent vers un courtier simulé.',
      'Un tableau de bord local et des notifications Discord.',
    ],
    tags: ['Python', 'Agents IA', 'Gestion du risque'],
    links: [],
    sketch: 'market',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    year: 'En cours',
    kind: 'City-builder sous Godot',
    summary: 'Un city-builder hors ligne, construit par un agent « directeur » et des agents spécialisés.',
    description:
      'Les agents spécialisés avancent en parallèle, chacun dans sa copie du dépôt ; le directeur leur répartit le travail et consigne chaque décision qu’il prend pour que je puisse la revoir.',
    highlights: [],
    tags: ['Godot', 'C#', 'Blender', 'Agents IA'],
    links: [],
    sketch: 'city',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'pokemon-battle',
    name: 'Pokemon_battle',
    year: '2025',
    kind: 'Application Flutter',
    summary: 'Un Pokédex, des équipes et des combats, sur Android, iOS, le web et le bureau.',
    description:
      'Une application Flutter / Dart multiplateforme : un Pokédex avec recherche, la composition d’équipes, des combats avec coups critiques et échecs, et un historique par utilisateur après connexion.',
    highlights: ['Gestion d’état avec Provider ; stockage local avec Hive et sqflite.'],
    tags: ['Flutter', 'Dart', 'Provider', 'Hive', 'sqflite'],
    links: [{ label: 'Code source', href: LINKS.pokemonBattle }],
    sketch: 'phone',
  },
]

const archiveFr: ArchiveItem[] = [
  {
    year: '2026',
    name: '30minGame',
    text: 'Un jeu d’arcade en HTML et JavaScript, sans framework, avec une parallaxe sur plusieurs plans.',
    tech: 'HTML · JavaScript',
    href: LINKS.game30min,
  },
  {
    year: '2025',
    name: 'nipponsocket',
    text: 'Un serveur temps réel pour suivre des matchs : salles, chrono, scores, fautes. L’état survit aux reconnexions, testé avec node --test, déployé sur Railway.',
    tech: 'Node.js · Express 5 · Socket.IO 4',
    href: LINKS.nipponsocket,
  },
  {
    year: '2025',
    name: 'python_api_rest',
    text: 'Une API REST (utilisateurs et tâches) découpée en modèles, dépôts et services, avec hachage des mots de passe et un client Tkinter.',
    tech: 'Python · FastAPI · SQLite',
    href: LINKS.pythonApi,
  },
  {
    year: '2023',
    name: 'Casse-brique',
    text: 'Un casse-brique en Java.',
    tech: 'Java · Swing · AWT',
    href: LINKS.breakout,
  },
  {
    year: '2020',
    name: 'web1',
    text: 'Mon premier site : un projet d’art autour de Bleach.',
    tech: 'HTML · CSS',
    href: LINKS.web1,
  },
]

const fr = {
  meta: {
    title: 'Timothée Maire — Développeur full-stack',
    description:
      'Timothée Maire, développeur full-stack chez Daimler Buses France : un intranet Symfony / React utilisé par plus de 1 200 salariés, des jeux, et des projets menés avec des équipes d’agents IA.',
  },
  a11y: {
    skip: 'Aller au contenu',
    home: 'Timothée Maire — retour en haut de page',
    mainNav: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toDark: 'Passer au plan bleu (thème sombre)',
    toLight: 'Passer au tirage papier (thème clair)',
    switchLang: 'Switch the website to English',
    newTab: 'nouvel onglet',
    backToTop: 'Retour en haut de page',
    close: 'Fermer',
  },
  brand: 'Portfolio',
  nav: {
    about: 'À propos',
    experience: 'Parcours',
    projects: 'Projets',
    ai: 'IA',
    skills: 'Compétences',
    education: 'Formation',
    contact: 'Contact',
  } satisfies Record<SectionId, string>,
  hero: {
    kicker: 'Portfolio',
    nameLines: ['Timothée', 'Maire'],
    roles: ['Développeur full-stack', 'Architecte logiciel', 'Créateur de jeux'],
    greeting: 'Bonjour, moi c’est Timothée.',
    lead: 'Je suis développeur full-stack chez Daimler Buses France, où je construis depuis 2024 un intranet Symfony / React dont se servent plus de 1 200 salariés. En parallèle, je prépare un master au CESI de Nancy. Et à côté, je fais des jeux.',
    cta: 'Découvrir mes projets',
    secondary: 'Me contacter',
    annotation: ['Symfony · React', 'Three.js', 'agents IA'],
    modelNote: ['Modèle 3D (Three.js)', 'un bus, évidemment'],
    explode: 'Vue éclatée',
    assemble: 'Vue assemblée',
    dragHint: 'Glisser pour tourner',
    canvasLabel: 'Bus urbain en fil de fer, en 3D, avec ses cotes. Il tourne lentement et suit la souris.',
    sketchLabel: 'Dessin technique d’un bus urbain de 12 mètres, avec ses cotes',
    dims: { length: '12 000 mm', width: '2 550 mm', height: '3 050 mm' },
    skipIntro: 'Passer l’animation',
    scroll: 'Faire défiler',
    facts: [
      { label: 'En ce moment', value: 'Développeur web', detail: 'Daimler Buses France' },
      { label: 'En parallèle', value: 'Master MAALSI', detail: 'CESI Nancy · 2025 — 2027' },
      { label: 'Au quotidien', value: 'Symfony, React', detail: 'TypeScript, PHP' },
      { label: 'Langues', value: 'Français, anglais', detail: 'natif, professionnel' },
    ],
  },
  about: {
    title: 'À propos',
    intro: 'Le bus se dessine pendant que vous faites défiler la page. Mon parcours s’est construit dans le même ordre.',
    stages: [
      {
        note: 'le plan',
        text: 'Je suis arrivé au développement par le réseau et le matériel : un bac pro Systèmes Numériques au lycée Jean Prouvé, mention très bien, entre Cisco, VLAN et Arduino.',
      },
      {
        note: 'le volume',
        text: 'Puis le logiciel : un BTS SIO au lycée Frédéric Chopin, une licence de concepteur développeur au CESI, et mes premières missions — un site WordPress, un portail développeurs chez Kuehne + Nagel, un outil d’analyse en C# chez Nexiom.',
      },
      {
        note: 'les détails',
        text: 'Depuis septembre 2024, je développe l’intranet de Daimler Buses France à Ligny-en-Barrois, en Symfony et React. Le master MAALSI, commencé en 2025 au CESI de Nancy, avance en même temps.',
      },
      {
        note: 'le rendu',
        text: 'À côté, je fais des jeux et je dirige des équipes d’agents IA. Ce que je cherche maintenant : être davantage au contact des clients et des utilisateurs, là où se décide ce qu’on construit.',
      },
    ],
    portraitAlt: 'Portrait de Timothée Maire',
    portraitCaption: 'Timothée Maire · Grand Est',
    sketchLabel: 'Dessin technique d’un bus qui se construit en quatre étapes : le plan, le volume, les détails, le rendu',
  },
  experience: {
    title: 'Parcours',
    intro:
      'Ma première mission, en 2022 : un site WordPress pour mon ancien lycée. Depuis : un portail développeurs chez Kuehne + Nagel, un outil d’analyse chez Nexiom, puis l’intranet de Daimler Buses France. Et, pendant trois ans, la préparation de commandes chez Lidl.',
    chartLabel: 'Chronologie des postes, de 2022 à aujourd’hui',
    current: 'En poste',
    today: 'aujourd’hui',
    jobs: jobsFr,
  },
  projects: {
    title: 'Projets',
    intro: 'Ce qui est en ligne s’ouvre et se joue d’ici. Les projets menés avec des agents IA sont signalés ; leurs dépôts sont privés.',
    open: 'Ouvrir la fiche',
    sheetPath: 'Projets',
    highlightsTitle: 'Dans le détail',
    agentsBadge: 'Mené avec des agents IA',
    privateRepo: 'Dépôt privé',
    archiveTitle: 'Archives',
    archiveIntro: 'Des projets plus anciens ou plus petits, du premier site en 2020 à un serveur temps réel.',
    archiveLink: 'Voir le code',
    items: projectsFr,
    archive: archiveFr,
    playground: {
      title: 'À essayer sans quitter la page',
      launch: 'Jouer',
      city: {
        name: 'Ville procédurale',
        description:
          'Une petite ville tirée au hasard, dessinée en WebGL avec Three.js. Faites-la tourner à la souris ou au doigt, puis reconstruisez-la. Le bus qui fait le tour du quartier, vous l’aurez compris, est un clin d’œil.',
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
  ai: {
    title: 'IA',
    intro:
      'Sur mes projets personnels, je ne code plus seul : je dirige des équipes d’agents. L’un orchestre, les autres ont chacun leur périmètre, et un modèle d’une autre famille relit le tout. Sombrepierre et Renaissance sont faits comme ça. Market Synapse reprend l’idée à l’exécution : cinq modèles débattent, une règle sans IA décide.',
    flowTitle: 'Le trajet d’une mission',
    flow: [
      {
        name: 'Socle et contrats',
        text: 'L’orchestrateur écrit d’abord ce dont tout le monde dépend, et les points de contact du code sont figés.',
      },
      {
        name: 'Missions en parallèle',
        text: 'Chaque agent reçoit une fiche : un rôle, une liste de fichiers, des critères de réussite.',
      },
      {
        name: 'Vérification',
        text: 'Tests, analyse statique, captures d’écran regardées : un agent ne dit pas « terminé » sans preuve.',
      },
      {
        name: 'Intégration, puis revue croisée',
        text: 'L’orchestrateur réunit le tout ; un modèle d’une autre famille relit ensuite. Si un contrat casse, la mission repart.',
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
        text: 'Avant de lancer qui que ce soit, les points de contact sont figés : on peut ajouter, jamais renommer. Chaque mission a sa liste de fichiers, le reste est en lecture seule.',
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
  skills: {
    title: 'Compétences',
    intro:
      'Je préfère une interface lisible à un effet, et un outil qu’on adopte à une démo qui impressionne. Avant de choisir une techno, je regarde ce que font vraiment les gens : qui a le droit de faire quoi, qui valide, ce qu’il faut pouvoir retrouver six mois plus tard.',
    tableCaption: 'Nomenclature des outils, rangés par contexte d’usage',
    tableHead: ['Contexte', 'Outils'],
    groups: [
      { label: 'Tous les jours, chez Daimler Buses', items: ['Symfony', 'React', 'TypeScript', 'PHP'] },
      { label: 'Sur mes projets', items: ['Laravel', 'PostgreSQL', 'WebSocket (Reverb)', 'Three.js', 'Docker', 'Rust', 'Godot', 'GitHub Actions'] },
      { label: 'Déjà pratiqués, en entreprise ou en formation', items: ['C# / .NET', 'SQL', 'Node.js / Express', 'Python', 'Flutter', 'NGINX', 'WordPress', 'Git', 'Cisco / réseaux'] },
      { label: 'IA', items: ['Claude Code', 'Codex', 'Gemini', 'orchestration d’équipes d’agents'] },
      { label: 'Langues', items: ['Français (natif)', 'anglais (professionnel)'] },
    ],
    peopleTitle: 'Côté humain',
    peopleIntro:
      'C’est la direction que je veux donner à la suite : être de plus en plus au contact des clients et des utilisateurs, pour comprendre le besoin à la source plutôt que de le recevoir déjà traduit.',
    people: [
      {
        name: 'Écouter avant de coder',
        text: 'Chez Kuehne + Nagel comme chez Nexiom, j’ai commencé par le cahier des charges ou les spécifications, avant la première ligne de code.',
      },
      {
        name: 'Présenter',
        text: 'Le site du lycée Jean Prouvé, je l’ai présenté devant son corps enseignant. Expliquer un outil à des gens dont ce n’est pas le métier fait partie du travail.',
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
    intro: 'Du bac pro au master, tout s’est passé à Nancy : lycée Jean Prouvé, lycée Frédéric Chopin, puis le CESI.',
    chartLabel: 'Chronologie des diplômes, de 2018 à 2027',
    planned: 'prévu',
    items: diplomasFr,
  },
  contact: {
    title: 'Écrivez-moi.',
    text: 'Une question, une proposition ? Le plus simple reste l’email.',
    copy: 'Copier l’adresse',
    copied: 'Adresse copiée',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    location: 'Grand Est, France · Nancy et Ligny-en-Barrois',
    envelopeLabel: 'Enveloppe dessinée au trait',
    titleBlock: [
      { label: 'Dessiné par', value: 'Timothée Maire' },
      { label: 'Échelle', value: '1:1' },
      { label: 'Feuille', value: 'Portfolio' },
      { label: 'Outils', value: 'React, TypeScript, Three.js' },
      { label: 'Traceurs', value: 'aucun' },
    ],
    dateLabel: 'Date',
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

// ============================================================================
// FIN DU FRANÇAIS
// ============================================================================

export type Content = typeof fr

const jobsEn: Job[] = [
  {
    company: 'Daimler Buses France',
    role: 'Web developer',
    period: 'Sept. 2024 — today',
    location: 'Ligny-en-Barrois',
    start: 2024.67,
    end: null,
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
    start: 2023.75,
    end: 2024.33,
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
    start: 2023.0,
    end: 2023.17,
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
    start: 2022.58,
    end: 2025.75,
    summary:
      'Order picking and forklifts, alongside my studies. Not a single line of code, but three years on the warehouse floor: it helps me understand the people I write software for today.',
    points: [],
    tags: ['Logistics'],
  },
  {
    company: 'Lycée Jean Prouvé',
    role: 'Web developer',
    period: 'May — Jul. 2022',
    location: 'Nancy',
    start: 2022.33,
    end: 2022.58,
    summary:
      'A dynamic WordPress website for the school where I had taken my baccalauréat. I presented it to the teaching staff at the end.',
    points: [],
    tags: ['WordPress'],
  },
]

const diplomasEn: Diploma[] = [
  {
    period: '2025 — 2027',
    level: 'Bac +5',
    degree: 'Master’s degree in Information Systems Architecture and Software Applications (MAALSI)',
    school: 'CESI, Nancy',
    note: 'In progress. Enterprise and IS architecture, strategy, project management.',
    start: 2025.67,
    end: 2027.5,
    planned: true,
  },
  {
    period: '2023 — 2025',
    level: 'Bac +3',
    degree: 'Bachelor’s degree in Application Design and Development (CDA)',
    school: 'CESI, Nancy',
    note: 'Software development, databases, agile methods. Docker, GitLab, Node.js, React, Flutter.',
    start: 2023.67,
    end: 2025.5,
  },
  {
    period: '2021 — 2023',
    level: 'Bac +2',
    degree: 'BTS SIO, Software Solutions and Business Applications track (SLAM)',
    school: 'Lycée Frédéric Chopin, Nancy',
    note: 'Applications in C#, Python, PHP and JavaScript. Relational databases.',
    start: 2021.67,
    end: 2023.5,
  },
  {
    period: '2018 — 2021',
    level: 'Bac',
    degree: 'Vocational baccalauréat in Digital Systems (RISC)',
    school: 'Lycée Jean Prouvé, Nancy',
    note: 'Highest honours. Networks, Cisco equipment, VLAN, Arduino.',
    start: 2018.67,
    end: 2021.5,
  },
]

const projectsEn: Project[] = [
  {
    id: 'pokeline',
    name: 'PokéLine',
    year: '2026',
    kind: 'Multiplayer game',
    summary: 'A turn-based Pokémon battle game: alone against an AI, with a friend on the same screen, or online.',
    description:
      'I wrote it with Laravel 12; the real-time part runs over WebSocket, with Laravel Reverb. Online, players meet in a lobby.',
    highlights: [
      'The server resolves every turn: level-100 stats, STAB, move priority and the full 18-type chart.',
      'In solo mode the AI scores every possible move (immunities, effectiveness, estimated damage) and goes for the K.O.',
      'Online, both players choose at the same time; a SQL transaction stops anyone from acting twice.',
      'Nine items to win, ten teams per account, and a win if your opponent vanishes for 90 seconds.',
      'A playable 2D hub, 8-bit sounds, a French and English interface, PHPUnit tests.',
      'Deployed on Railway as three services: the app, the Reverb server and PostgreSQL.',
    ],
    tags: ['Laravel 12', 'PHP 8.2', 'Reverb', 'PostgreSQL', 'Blade', 'Tailwind 4', 'Vite', 'PokeAPI', 'GitHub Actions'],
    links: [
      { label: 'Play PokéLine', href: LINKS.pokeline },
      { label: 'Source code', href: LINKS.pokelineRepo },
    ],
    sketch: 'pokeline',
    image: { ...POKELINE_IMAGE, alt: 'A PokéLine battle: Venusaur faces Metagross in a retro arena' },
  },
  {
    id: 'commerce',
    name: 'MonCommerce Rapide',
    year: '',
    kind: 'Product prototype',
    summary: 'An online storefront with click and collect for independent shops.',
    description:
      'The customer browses the catalogue, orders, then picks a collection slot. It is a prototype for now, but it is live and everything in it is clickable.',
    highlights: [],
    note: 'Planned next, not built yet: loyalty cards in Apple Wallet and Google Wallet.',
    tags: ['React', 'Click & collect'],
    links: [{ label: 'Try the prototype', href: LINKS.commerce }],
    sketch: 'commerce',
    image: { ...COMMERCE_IMAGE, alt: 'MonCommerce Rapide home page, an online storefront for shopkeepers' },
  },
  {
    id: 'sombrepierre',
    name: 'Les Oubliettes de Sombrepierre',
    year: '2026',
    kind: 'Roguelike in Rust',
    summary: 'A pixel-art roguelike built by a team of AI agents that I directed.',
    description:
      'A knight descends a randomly generated dungeon, room after room, with a boss every fifth room. The game was made by a team of agents: eight on the first day, nineteen roles over three working days. I played the client: I set the requests, made the calls and looked at what came back.',
    highlights: [
      'An orchestrator running in Claude Code lays the foundation and the contracts, then launches the missions in parallel.',
      'Claude sub-agents for pixel art (drawn in code), balancing, the dungeon, the duel and the menus; Codex for saves, sound, continuous integration, review and commits.',
      'Every agent has a mission brief and its own list of files; a model from another family reviews everything.',
      'Room 100 can really be reached: out of 20,000 games played by the simulator, 19.9% get there.',
    ],
    tags: ['Rust', 'macroquad', 'Claude Code', 'Codex'],
    links: [],
    sketch: 'dungeon',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'market',
    name: 'Market Synapse',
    year: '',
    kind: 'Paper trading',
    summary: 'Five models analyse the same market, then debate; a rule with no AI in it decides.',
    description:
      'No AI can place an order: it proposes an intent, and a risk manager written in Python, with no AI in it, decides whether to execute.',
    highlights: [
      'The same market snapshot (prices, news, portfolio) goes to five models: Grok, GLM 5.2, Owl Alpha, Gemma 4 and GPT OSS.',
      'Each one writes its analysis, then they debate; GLM 5.2 makes the final call.',
      'The risk manager approves or refuses; by default, orders go to a simulated broker.',
      'A local dashboard and Discord notifications.',
    ],
    tags: ['Python', 'AI agents', 'Risk management'],
    links: [],
    sketch: 'market',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    year: 'In progress',
    kind: 'City-builder in Godot',
    summary: 'An offline city-builder, built by a “director” agent and specialised agents.',
    description:
      'The specialised agents work in parallel, each in its own copy of the repository; the director hands out the work and logs every decision it takes so that I can review it.',
    highlights: [],
    tags: ['Godot', 'C#', 'Blender', 'AI agents'],
    links: [],
    sketch: 'city',
    agents: true,
    privateRepo: true,
  },
  {
    id: 'pokemon-battle',
    name: 'Pokemon_battle',
    year: '2025',
    kind: 'Flutter app',
    summary: 'A Pokédex, teams and battles, on Android, iOS, the web and desktop.',
    description:
      'A cross-platform Flutter / Dart app: a searchable Pokédex, team building, battles with critical hits and misses, and a per-user history after signing in.',
    highlights: ['State management with Provider; local storage with Hive and sqflite.'],
    tags: ['Flutter', 'Dart', 'Provider', 'Hive', 'sqflite'],
    links: [{ label: 'Source code', href: LINKS.pokemonBattle }],
    sketch: 'phone',
  },
]

const archiveEn: ArchiveItem[] = [
  {
    year: '2026',
    name: '30minGame',
    text: 'An arcade game in plain HTML and JavaScript, no framework, with multi-layer parallax.',
    tech: 'HTML · JavaScript',
    href: LINKS.game30min,
  },
  {
    year: '2025',
    name: 'nipponsocket',
    text: 'A real-time server to follow matches: rooms, clock, scores, fouls. State survives reconnections; tested with node --test, deployed on Railway.',
    tech: 'Node.js · Express 5 · Socket.IO 4',
    href: LINKS.nipponsocket,
  },
  {
    year: '2025',
    name: 'python_api_rest',
    text: 'A REST API (users and tasks) split into models, repositories and services, with password hashing and a Tkinter client.',
    tech: 'Python · FastAPI · SQLite',
    href: LINKS.pythonApi,
  },
  {
    year: '2023',
    name: 'Casse-brique',
    text: 'A breakout game in Java.',
    tech: 'Java · Swing · AWT',
    href: LINKS.breakout,
  },
  {
    year: '2020',
    name: 'web1',
    text: 'My first website: an art project about Bleach.',
    tech: 'HTML · CSS',
    href: LINKS.web1,
  },
]

const en: Content = {
  meta: {
    title: 'Timothée Maire — Full-stack developer',
    description:
      'Timothée Maire, full-stack developer at Daimler Buses France: a Symfony / React intranet used by more than 1,200 employees, games, and projects built with teams of AI agents.',
  },
  a11y: {
    skip: 'Skip to content',
    home: 'Timothée Maire — back to top',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toDark: 'Switch to blueprint (dark theme)',
    toLight: 'Switch to paper print (light theme)',
    switchLang: 'Passer le site en français',
    newTab: 'new tab',
    backToTop: 'Back to top',
    close: 'Close',
  },
  brand: 'Portfolio',
  nav: {
    about: 'About',
    experience: 'Work',
    projects: 'Projects',
    ai: 'AI',
    skills: 'Skills',
    education: 'Education',
    contact: 'Contact',
  },
  hero: {
    kicker: 'Portfolio',
    nameLines: ['Timothée', 'Maire'],
    roles: ['Full-stack developer', 'Software architect', 'Game maker'],
    greeting: 'Hi, I’m Timothée.',
    lead: 'I’m a full-stack developer at Daimler Buses France, where since 2024 I have been building a Symfony / React intranet used by more than 1,200 employees. Alongside the job I am studying for a master’s degree at CESI Nancy. And on the side, I make games.',
    cta: 'See my projects',
    secondary: 'Get in touch',
    annotation: ['Symfony · React', 'Three.js', 'AI agents'],
    modelNote: ['3D model (Three.js)', 'a bus, of course'],
    explode: 'Exploded view',
    assemble: 'Assembled view',
    dragHint: 'Drag to rotate',
    canvasLabel: 'Wireframe city bus in 3D, with its dimensions. It turns slowly and follows the mouse.',
    sketchLabel: 'Technical drawing of a 12-metre city bus, with its dimensions',
    // Séparateur de milliers à l'espace fine (norme SI) : les cotes sont les mêmes dans les deux langues.
    dims: { length: '12 000 mm', width: '2 550 mm', height: '3 050 mm' },
    skipIntro: 'Skip the animation',
    scroll: 'Scroll down',
    facts: [
      { label: 'Right now', value: 'Web developer', detail: 'Daimler Buses France' },
      { label: 'Alongside', value: 'Master’s degree (MAALSI)', detail: 'CESI Nancy · 2025 — 2027' },
      { label: 'Every day', value: 'Symfony, React', detail: 'TypeScript, PHP' },
      { label: 'Languages', value: 'French, English', detail: 'native, professional' },
    ],
  },
  about: {
    title: 'About',
    intro: 'The bus draws itself as you scroll. My path was built in the same order.',
    stages: [
      {
        note: 'the plan',
        text: 'I came to software through networks and hardware: a vocational baccalauréat in digital systems at Lycée Jean Prouvé, with highest honours, among Cisco, VLANs and Arduino.',
      },
      {
        note: 'the volume',
        text: 'Then software: a BTS SIO at Lycée Frédéric Chopin, a bachelor’s degree in application development at CESI, and my first assignments — a WordPress site, a developer portal at Kuehne + Nagel, a C# analysis tool at Nexiom.',
      },
      {
        note: 'the details',
        text: 'Since September 2024 I have been building the Daimler Buses France intranet in Ligny-en-Barrois, with Symfony and React. The MAALSI master’s degree, started in 2025 at CESI Nancy, runs alongside it.',
      },
      {
        note: 'the render',
        text: 'On the side, I make games and run teams of AI agents. What I am looking for now: more contact with clients and users, where the decisions about what to build are made.',
      },
    ],
    portraitAlt: 'Portrait of Timothée Maire',
    portraitCaption: 'Timothée Maire · Grand Est',
    sketchLabel: 'Technical drawing of a bus built in four steps: the plan, the volume, the details, the render',
  },
  experience: {
    title: 'Work',
    intro:
      'My first assignment, in 2022: a WordPress site for my former school. Since then: a developer portal at Kuehne + Nagel, an analysis tool at Nexiom, then the Daimler Buses France intranet. And, for three years, picking orders at Lidl.',
    chartLabel: 'Timeline of my jobs, from 2022 to today',
    current: 'Current',
    today: 'today',
    jobs: jobsEn,
  },
  projects: {
    title: 'Projects',
    intro: 'What is live opens and plays from here. Projects built with AI agents are marked; their repositories are private.',
    open: 'Open the sheet',
    sheetPath: 'Projects',
    highlightsTitle: 'In detail',
    agentsBadge: 'Built with AI agents',
    privateRepo: 'Private repository',
    archiveTitle: 'Archive',
    archiveIntro: 'Older or smaller projects, from my first website in 2020 to a real-time server.',
    archiveLink: 'See the code',
    items: projectsEn,
    archive: archiveEn,
    playground: {
      title: 'Things to try without leaving the page',
      launch: 'Play',
      city: {
        name: 'Procedural city',
        description:
          'A small random city drawn in WebGL with Three.js. Drag to rotate it with a mouse or a finger, then rebuild it. The bus doing laps around the block is, as you may have guessed, a nod.',
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
  ai: {
    title: 'AI',
    intro:
      'On my own projects I no longer code alone: I run teams of agents. One orchestrates, the others each own a scope, and a model from another family reviews everything. Sombrepierre and Renaissance are built that way. Market Synapse applies the same idea at run time: five models debate, a rule with no AI in it decides.',
    flowTitle: 'How a mission travels',
    flow: [
      {
        name: 'Foundation and contracts',
        text: 'The orchestrator first writes what everyone depends on, and the touch points in the code are frozen.',
      },
      {
        name: 'Missions in parallel',
        text: 'Each agent gets a brief: a role, a list of files, success criteria.',
      },
      {
        name: 'Verification',
        text: 'Tests, static analysis, screenshots actually looked at: no agent says “done” without proof.',
      },
      {
        name: 'Integration, then cross-review',
        text: 'The orchestrator brings everything together, then a model from another family reviews it. If a contract breaks, the mission goes back.',
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
        text: 'Before anyone starts, the touch points are frozen: you may add, never rename. Each mission has its list of files; everything else is read-only.',
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
  skills: {
    title: 'Skills',
    intro:
      'I would rather ship a readable interface than an effect, and a tool people adopt than a demo that impresses. Before picking a technology I look at what people actually do: who is allowed to do what, who approves it, and what must still be traceable six months later.',
    tableCaption: 'Bill of materials: tools grouped by where I use them',
    tableHead: ['Context', 'Tools'],
    groups: [
      { label: 'Every day, at Daimler Buses', items: ['Symfony', 'React', 'TypeScript', 'PHP'] },
      { label: 'On my own projects', items: ['Laravel', 'PostgreSQL', 'WebSocket (Reverb)', 'Three.js', 'Docker', 'Rust', 'Godot', 'GitHub Actions'] },
      { label: 'Used before, at work or in training', items: ['C# / .NET', 'SQL', 'Node.js / Express', 'Python', 'Flutter', 'NGINX', 'WordPress', 'Git', 'Cisco / networking'] },
      { label: 'AI', items: ['Claude Code', 'Codex', 'Gemini', 'running teams of agents'] },
      { label: 'Languages', items: ['French (native)', 'English (professional)'] },
    ],
    peopleTitle: 'People',
    peopleIntro:
      'This is where I want to go next: more and more contact with clients and users, to understand the need at its source rather than receive it already translated.',
    people: [
      {
        name: 'Listening before coding',
        text: 'At Kuehne + Nagel and at Nexiom alike, I started with the requirements or the specifications, before the first line of code.',
      },
      {
        name: 'Presenting',
        text: 'I presented the Jean Prouvé school website to its teaching staff. Explaining a tool to people whose job is something else is part of the work.',
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
    intro: 'From the vocational baccalauréat to the master’s, it all happened in Nancy: Lycée Jean Prouvé, Lycée Frédéric Chopin, then CESI.',
    chartLabel: 'Timeline of my degrees, from 2018 to 2027',
    planned: 'planned',
    items: diplomasEn,
  },
  contact: {
    title: 'Email me.',
    text: 'A question, an offer? Email is the easiest way.',
    copy: 'Copy address',
    copied: 'Address copied',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    location: 'Grand Est, France · Nancy and Ligny-en-Barrois',
    envelopeLabel: 'Line drawing of an envelope',
    titleBlock: [
      { label: 'Drawn by', value: 'Timothée Maire' },
      { label: 'Scale', value: '1:1' },
      { label: 'Sheet', value: 'Portfolio' },
      { label: 'Tools', value: 'React, TypeScript, Three.js' },
      { label: 'Trackers', value: 'none' },
    ],
    dateLabel: 'Date',
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

export type ProjectItem = Project
