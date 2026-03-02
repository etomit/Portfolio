import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'fr' | 'en'

const translations = {
  fr: {
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      skills: 'Compétences',
      education: 'Éducation',
      contact: 'Contact',
    },
    hero: {
      greeting: 'Salut, je suis',
      title: 'Développeur Web FullStack',
      description:
        "Développeur passionné par la création d'applications web performantes et évolutives. Du front-end intuitif au back-end robuste, je donne vie à vos idées grâce au code.",
      cta: 'Me Contacter',
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
      jobs: [
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
          role: 'Développeur Stagiaire',
          period: 'Janv. 2023 — Févr. 2023',
          location: 'Limas',
          type: 'internship',
          tasks: [
            'Portail développeurs JavaScript/CSS avec déploiement NGINX',
            'Cahier des charges et maquettes Front-End',
          ],
          tags: ['JavaScript', 'CSS', 'NGINX'],
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
          degree: 'Mastère Manager en Architecture & Applications SI',
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
          degree: "Bachelor Concepteur Développeur d'Application",
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
          degree: 'BTS SIO SLAM',
          period: '2021 — 2023',
          level: 'Bac +2',
          tasks: [
            'Applications C#, Python, PHP, JavaScript',
            'Bases de données relationnelles',
          ],
        },
        {
          school: 'Lycée Jean Prouvé, Nancy',
          degree: 'Bac Pro Systèmes Numériques RISC',
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
      contact: 'Contact',
    },
    hero: {
      greeting: 'Hi, I am',
      title: 'FullStack Web Developer',
      description:
        'Passionate developer focused on building high-performance, scalable web applications. From intuitive front-ends to robust back-ends, I bring your ideas to life through code.',
      cta: 'Contact Me',
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
      jobs: [
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