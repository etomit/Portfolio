import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'fr' | 'en'

const translations = {
  fr: {
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Éducation',
      projects: 'Projets',
      contact: 'Contact',
    },
    hero: {
      greeting: 'Salut, je suis',
      title: 'Développeur Web FullStack',
      description:
        "Développeur passionné par la création d'applications web performantes et évolutives. Du front-end intuitif au back-end robuste, je donne vie à vos idées grâce au code.",
      cta: 'Me Contacter',
      available: 'Disponible',
      yearsXp: "ans d'exp.",
      missions: 'missions',
      techs: 'technos',
    },
    about: {
      title: 'À PROPOS',
      frontend: {
        title: 'Développeur Frontend',
        desc: "Je crée des interfaces responsives, accessibles et optimisées pour une expérience utilisateur fluide.",
      },
      backend: {
        title: 'Développeur Backend',
        desc: "J'architecture des APIs et des systèmes back-end performants avec .NET, Node.js et Laravel.",
      },
      uiux: {
        title: 'Intégration & Architecture',
        desc: "Je conçois et intègre des systèmes d'information robustes en suivant les bonnes pratiques.",
      },
    },
    experience: {
      title: 'EXPÉRIENCE',
      current: 'POSTE ACTUEL',
      contractor: 'EN ALTERNANCE',
      internship: 'STAGE',
      parttime: 'TEMPS PARTIEL',
      jobs: [
        {
          company: 'Daimler Buses France',
          role: 'Développeur web',
          period: 'Sept. 2024 — Actuel',
          location: 'Ligny-en-Barrois',
          type: 'current',
          tasks: [
            "Développement d'un intranet Symfony/React pour 1200+ employés",
            "Module de gestion des Propositions d'Amélioration Continue (PAC) avec système de vote",
            "Module de gestion du magasin d'outillage (interface e-commerce)",
            "Module d'entreposage et de gestion des déplacements de véhicules",
          ],
          tags: ['Symfony', 'React', 'PHP', 'TypeScript'],
        },
        {
          company: 'Nexiom SAS',
          role: "Développeur d'applications",
          period: 'Oct. 2023 — Avr. 2024',
          location: 'Nancy',
          type: 'contractor',
          tasks: [
            "Outil d'analyse des impressions en C# .NET avec base SQL",
            'Rédaction des spécifications fonctionnelles et techniques',
          ],
          tags: ['C#', '.NET', 'SQL'],
        },
        {
          company: 'Kuehne + Nagel',
          role: 'Développeur',
          period: 'Janv. 2023 — Févr. 2023',
          location: 'Limas',
          type: 'contractor',
          tasks: [
            'Portail développeurs JavaScript/CSS avec déploiement NGINX',
            'Cahier des charges et maquettes Front-End',
          ],
          tags: ['JavaScript', 'CSS', 'NGINX'],
        },
        {
          company: 'Lidl France',
          role: 'Opérateur logistique',
          period: 'Août 2022 — Sept. 2025',
          location: 'Gondreville',
          type: 'parttime',
          tasks: [
            'Préparation de commandes dans les secteurs viandes, volailles, frais, masses, sec et autres',
            'Préparation de commandes avec conservation dans des containers isothermes (rayon frais)',
            'Transport de palettes sur des chariots élévateurs',
          ],
          tags: ['Logistique'],
        },
        {
          company: 'Lycée Jean Prouvé',
          role: 'Développeur web',
          period: 'Mai 2022 — Juil. 2022',
          location: 'Nancy',
          type: 'contractor',
          tasks: [
            "Développement d'un site web dynamique avec WordPress",
            'Présentation devant tout le corps enseignant',
          ],
          tags: ['WordPress'],
        },
      ],
    },
    skills: {
      title: 'COMPÉTENCES',
      frontend: 'FRONT-END',
      backend: 'BACK-END',
      databases: 'BASES DE DONNÉES',
      tools: 'OUTILS & DEVOPS',
      languages: 'LANGUES PARLÉES',
    },
    education: {
      title: 'ÉDUCATION',
      items: [
        {
          school: 'CESI, Nancy',
          degree: 'Master Manager en Architecture et Applications Logicielles des Systèmes d’Information (MAALSI)',
          period: '2025 — 2027',
          level: 'Bac +5',
          tasks: [
            "Stratégie d'entreprise et pilotage de projets",
            'Communication professionnelle',
            "Architecture d'entreprise et SI",
          ],
        },
        {
          school: 'CESI, Nancy',
          degree: "Licence en Concepteur Développeur d’Applications (CDA) - Alternance",
          period: '2023 — 2025',
          level: 'Bac +3',
          tasks: [
            'Développement logiciel et bases de données',
            'Méthodologies agiles',
            'Technologies : Docker, GitLab, Node.js, React, Flutter',
          ],
        },
        {
          school: 'Lycée Frédéric Chopin, Nancy',
          degree: 'BTS Services Informatiques aux Organisations option Solutions Logicielles et Applications Métiers (SIO SLAM)',
          period: '2021 — 2023',
          level: 'Bac +2',
          tasks: [
            'Applications C#, Python, PHP, JavaScript',
            'Bases de données relationnelles',
          ],
        },
        {
          school: 'Lycée Jean Prouvé, Nancy',
          degree: 'Bac Pro Systèmes Numériques Option Réseaux informatiques et systèmes communicants (SN RISC)',
          period: '2018 — 2021',
          level: 'Bac',
          tasks: [
            'Mention très bien',
            'Réseaux, équipements Cisco, VLAN, Arduino',
          ],
        },
      ],
    },
    contact: {
      title: 'CONTACT',
      subtitle: 'Travaillons ensemble',
      description:
        "Vous avez un projet en tête ? N'hésitez pas à me contacter, je serai ravi d'échanger.",
      email: 'Email',
      phone: 'Téléphone',
      location: 'Localisation',
      locationValue: 'Grand Est, France',
    },
    projects: {
      title: 'PROJETS',
      playNow: 'Jouer',
      techLabel: 'Technologies',
      game2048Title: '2048',
      game2048Desc: 'Le classique jeu de puzzle. Combinez les tuiles pour atteindre 2048 !',
      wordleTitle: 'Wordle',
      wordleDesc: 'Devinez le mot en 6 essais. Les couleurs vous indiquent si vos lettres sont bien placées.',
    },
    games: {
      score: 'SCORE',
      best: 'MEILLEUR',
      newGame: 'Nouvelle partie',
      won: '🎉 Félicitations !',
      lost: '😞 Perdu !',
      retry: 'Rejouer',
      hint2048: 'Utilisez les flèches du clavier ou swipez pour déplacer les tuiles.',
      wordleSubFr: 'Trouvez le mot de 5 lettres en 6 essais.',
      wordleSubEn: 'Find the 5-letter word in 6 tries.',
    },
    lang: {
      french: 'FR',
      english: 'EN',
    },
  },
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      greeting: 'Hi, I am',
      title: 'FullStack Web Developer',
      description:
        'Passionate developer focused on building high-performance, scalable web applications. From intuitive front-ends to robust back-ends, I bring your ideas to life through code.',
      cta: 'Contact Me',
      available: 'Available',
      yearsXp: 'yrs exp.',
      missions: 'missions',
      techs: 'technologies',
    },
    about: {
      title: 'ABOUT',
      frontend: {
        title: 'Frontend Developer',
        desc: 'I build responsive, accessible, and optimized interfaces for a smooth user experience.',
      },
      backend: {
        title: 'Backend Developer',
        desc: 'I design performant APIs and back-end systems using .NET, Node.js and Laravel.',
      },
      uiux: {
        title: 'Integration & Architecture',
        desc: 'I design and integrate robust information systems following best practices.',
      },
    },
    experience: {
      title: 'EXPERIENCE',
      current: 'CURRENT',
      contractor: 'APPRENTICESHIP',
      internship: 'INTERNSHIP',
      parttime: 'PART-TIME',
      jobs: [
        {
          company: 'Daimler Buses France',
          role: 'Web Developer',
          period: 'Sept. 2024 — Present',
          location: 'Ligny-en-Barrois',
          type: 'current',
          tasks: [
            'Development of an intranet with Symfony/React for 1200+ employees',
            'Continuous Improvement Proposals (PAC) management module with voting system',
            'Tool store management module (e-commerce interface)',
            'Vehicle storage and movement management modules',
          ],
          tags: ['Symfony', 'React', 'PHP', 'TypeScript'],
        },
        {
          company: 'Nexiom SAS',
          role: 'Application Developer',
          period: 'Oct. 2023 — Apr. 2024',
          location: 'Nancy',
          type: 'contractor',
          tasks: [
            'Print analysis tool in C# .NET with SQL database',
            'Writing functional and technical specifications',
          ],
          tags: ['C#', '.NET', 'SQL'],
        },
        {
          company: 'Kuehne + Nagel',
          role: 'Intern Developer',
          period: 'Jan. 2023 — Feb. 2023',
          location: 'Limas',
          type: 'internship',
          tasks: [
            'Developer portal in JavaScript/CSS with NGINX deployment',
            'Technical specifications and Front-End mockups',
          ],
          tags: ['JavaScript', 'CSS', 'NGINX'],
        },
        {
          company: 'Lidl France',
          role: 'Logistics Operator',
          period: 'Aug. 2022 — Sept. 2025',
          location: 'Gondreville',
          type: 'parttime',
          tasks: [
            'Order preparation across meat, poultry, fresh, dry goods and other sectors',
            'Order preparation with cold chain management in insulated containers (fresh aisle)',
            'Pallet transport using forklift trucks',
          ],
          tags: ['Logistics'],
        },
        {
          company: 'Lycée Jean Prouvé',
          role: 'Web Developer',
          period: 'May 2022 — Jul. 2022',
          location: 'Nancy',
          type: 'internship',
          tasks: [
            'Development of a dynamic website with WordPress',
            'Presentation to the entire teaching staff',
          ],
          tags: ['WordPress'],
        },
      ],
    },
    skills: {
      title: 'SKILLS',
      frontend: 'FRONT-END',
      backend: 'BACK-END',
      databases: 'DATABASES',
      tools: 'TOOLS & DEVOPS',
      languages: 'SPOKEN LANGUAGES',
    },
    education: {
      title: 'EDUCATION',
      items: [
        {
          school: 'CESI, Nancy',
          degree: "Master's in IS Architecture & Applications",
          period: '2025 — 2027',
          level: 'Bac +5',
          tasks: [
            'Business strategy and project management',
            'Professional communication',
            'Enterprise architecture and IS',
          ],
        },
        {
          school: 'CESI, Nancy',
          degree: 'Bachelor in Application Design & Development',
          period: '2023 — 2025',
          level: 'Bac +3',
          tasks: [
            'Software development and databases',
            'Agile methodologies',
            'Technologies: Docker, GitLab, Node.js, React, Flutter',
          ],
        },
        {
          school: 'Lycée Frédéric Chopin, Nancy',
          degree: 'BTS SIO SLAM',
          period: '2021 — 2023',
          level: 'Bac +2',
          tasks: [
            'C#, Python, PHP, JavaScript applications',
            'Relational databases',
          ],
        },
        {
          school: 'Lycée Jean Prouvé, Nancy',
          degree: 'Vocational Bac - Digital Systems RISC',
          period: '2018 — 2021',
          level: 'Bac',
          tasks: [
            'Highest honors',
            'Networks, Cisco equipment, VLAN, Arduino',
          ],
        },
      ],
    },
    contact: {
      title: 'CONTACT',
      subtitle: "Let's work together",
      description:
        "Have a project in mind? Feel free to reach out — I'd love to discuss it.",
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      locationValue: 'Grand Est, France',
    },
    projects: {
      title: 'PROJECTS',
      playNow: 'Play',
      techLabel: 'Technologies',
      game2048Title: '2048',
      game2048Desc: 'The classic puzzle game. Combine tiles to reach 2048!',
      wordleTitle: 'Wordle',
      wordleDesc: 'Guess the word in 6 tries. Colors tell you if your letters are in the right spot.',
    },
    games: {
      score: 'SCORE',
      best: 'BEST',
      newGame: 'New Game',
      won: '🎉 You won!',
      lost: '😞 Game over!',
      retry: 'Play again',
      hint2048: 'Use arrow keys or swipe to move tiles.',
      wordleSubFr: 'Trouvez le mot de 5 lettres en 6 essais.',
      wordleSubEn: 'Find the 5-letter word in 6 tries.',
    },
    lang: {
      french: 'FR',
      english: 'EN',
    },
  },
}

type Translations = typeof translations.fr

interface I18nContextType {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nContextType>({
  lang: 'fr',
  t: translations.fr,
  setLang: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')
  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}