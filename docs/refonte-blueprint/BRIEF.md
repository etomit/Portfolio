# Brief — Refonte complète du portfolio en style « Blueprint »

Maquette de référence : `docs/refonte-blueprint/maquette-blueprint.png` (à ouvrir et étudier en premier).

> **Décision de Timothée (22 novembre 2026), prioritaire sur le reste du brief : aucun numéro.**
> Pas de `[01]`, `/02`, `/02-01` ni de compteur « 01 02 03 » nulle part (navigation, sections, projets) : il les a déjà
> fait retirer, ils font « site généré par IA ». Garder le langage du plan (crochets, barres obliques, cadres, cotes),
> mais sans chiffres : `[ Projets ]`, `/ Projets`, `/ Projets — PokéLine`.

## 1. Objectif

Refaire **complètement** le portfolio de Timothée Maire (React 19 + TypeScript + Vite + Three.js, déployé sur Railway)
en adoptant le style **plan d'architecte / blueprint** de la maquette. Le site reste bilingue FR / EN, sans traceur,
avec une CSP stricte (aucune ressource externe : polices auto-hébergées via `@fontsource`).

Le résultat doit être **un vrai CV en ligne** : toutes les données factuelles listées en section 4 doivent y figurer.
Ne jamais inventer d'expérience, de chiffre, de lien ou de diplôme. Si une donnée manque, l'omettre.

## 2. Direction artistique (tirée de la maquette)

- **Fond** : bleu de Prusse profond (~`#0a1f4d` → `#0d2a66`), grille millimétrée fine (petits carreaux + carreaux majeurs),
  léger vignettage, lueur bleue douce autour des éléments clés.
- **Traits** : blanc / bleu clair (`#cfe3ff`, `#8fb8ff`), 1px, opacités variées. Tout est dessiné « au trait ».
- **Typographie** :
  - Monospace pour la navigation, les labels, les numéros (`[01] Accueil`, `/02`, `/02-01`) — Geist Mono déjà installé.
  - Titres en display géométrique ; le nom en **lettres contour + hachures** (« VOTRE NOM » → « TIMOTHÉE MAIRE »).
  - Annotations manuscrites (style « Design / Développement / 3D / WebGL », « Modèle 3D (Three.js) ») avec flèches courbes :
    utiliser une police manuscrite auto-hébergée via `@fontsource` (ex. Caveat, Architects Daughter ou Gochi Hand).
- **Éléments de plan** : croix de repérage (⊕) aux coins des cadres, cotes avec flèches et valeurs en mm,
  cadres fins, boutons en crochets `[ Découvrir mes projets ] →`, chevron de défilement.
- **Navigation** : `/ PORTFOLIO` à gauche, `[01] Accueil  [02] Projets  [03] À propos  [04] Contact` à droite,
  soulignement de l'onglet actif. Adapter la liste aux sections réelles (Parcours, Projets, IA, Compétences, Formation, Contact).

## 2bis. Notes complémentaires (prototype GPT — inspiration seulement)

La maquette et ces notes viennent d'un prototype généré par une autre IA. **Ce n'est pas exactement la vision de Timothée** :
s'en servir pour s'orienter, pas comme un cahier des charges figé. Garder ce qui sert le propos, proposer mieux quand c'est possible.

Idées retenues du prototype :
- Fond bleu nuit quadrillé, traits cyan façon plan d'architecte, annotations manuscrites, illustrations filaires.
- Scène Three.js : rotation à la souris, mise en mouvement et **vue éclatée** de l'objet.
- Tracés SVG progressifs au défilement ; texte d'intro qui « s'écrit en direct ».
- Cartes projets interactives qui ouvrent des fiches détaillées.
- Responsive avec une interface adaptée aux petits écrans.
- Piste technique recommandée : **React Three Fiber + drei + GSAP ScrollTrigger** (ou équivalent), pour un dessin technique
  qui se construit pendant le scroll jusqu'à devenir une scène 3D complète. Tout doit être installé via npm et servi
  localement (la CSP interdit les CDN) ; prévoir une animation filaire de secours si WebGL est indisponible.
- Le prototype mentionnait « EvoTools », le workflow PAC et SQL Server côté Daimler : **le workflow PAC est confirmé** ;
  EvoTools et SQL Server ne figurent dans aucune source vérifiée → ne pas les afficher sans confirmation.

## 3. Sections et animations attendues

1. **Hero** : `PORTFOLIO` + nom en contour hachuré, cartouche « Développeur full-stack · Architecte logiciel · Créateur de jeux »,
   phrase d'accroche, bouton `[ Découvrir mes projets ] →`. À droite, **un objet 3D Three.js en wireframe bleu avec cotes**
   (la maquette montre un appareil photo ; préférer un **bus** en clin d'œil à Daimler Buses, ou un objet lié au parcours),
   rotation lente + réaction à la souris.
2. **Animation d'intro (séquence)** : 1) tracés de construction, 2) apparition du texte au trait (stroke-dashoffset SVG),
   3) remplissage / hachures, 4) résultat final. Doit être passable (clic / touche) et désactivée si `prefers-reduced-motion`.
3. **Projets** (`/02`) : grille de cartes avec vignette wireframe, puis pages / panneaux de détail (`/02-01 Expérience 3D`)
   avec tags, description et `Voir le projet ↗`.
4. **À propos** (`/03`) : buste wireframe ou équivalent, annotations manuscrites « Design / Code / 3D / Interaction ».
5. **Parcours** : timeline façon plan (cotes = dates), poste actuel mis en avant.
6. **Compétences / IA / Côté humain / Formation** : à intégrer dans le même langage visuel.
7. **Contact** (`/04`) : enveloppe wireframe, email cliquable + copie, LinkedIn, GitHub.
8. **Scroll storytelling** : un objet qui se construit au défilement (plan → volume → détails → résultat final).
9. **Arrière-plans dynamiques Three.js** : grille / vague wireframe légère, globe interactif possible.
10. **Micro-interactions** : boutons crochets qui se remplissent de hachures lumineuses au survol, transitions fluides.

Contraintes techniques :
- Garder la séparation contenu / présentation : tout le texte dans `src/content.ts` (FR + EN).
- Three.js chargé à la demande (lazy) quand la scène approche de l'écran ; fallback statique si WebGL indisponible.
- Accessibilité : contrastes AA, navigation clavier, `aria-*`, focus visibles, `prefers-reduced-motion`.
- Responsive impeccable (mobile 360 px → desktop 1920 px), pas de scroll horizontal.
- Perf : Lighthouse ≥ 90 perf / 100 a11y visé ; images WebP ; code-splitting.
- Conserver les mini-jeux (2048, Wordle) et la ville procédurale si cohérents, restylés en blueprint.
- `npm run lint` et `npm run build` doivent passer sans erreur.

## 4. Données CV (vérifiées, à utiliser telles quelles)

### Identité
- **Timothée Maire** — Développeur full-stack, Grand Est (Nancy / Ligny-en-Barrois), France
- Email : timothee.maire54300@gmail.com
- GitHub : https://github.com/etomit
- LinkedIn : https://www.linkedin.com/in/timoth%C3%A9e-maire-476bb8194/
- Langues : français (natif), anglais (professionnel)

### Expériences
| Période | Entreprise | Poste | Lieu | Détails |
|---|---|---|---|---|
| Sept. 2024 — aujourd'hui | Daimler Buses France | Développeur web | Ligny-en-Barrois | Intranet Symfony / React utilisé par **+1 200 salariés**. Modules : propositions d'amélioration continue (PAC, dépôt + votes) ; questionnaires qualité dynamiques selon client / type de véhicule / contexte de contrôle ; magasin d'outillage façon e-shop ; entreposage et suivi des déplacements de véhicules. Stack : Symfony, React, PHP, TypeScript. |
| Oct. 2023 — avr. 2024 | Nexiom SAS | Développeur d'applications | Nancy | Outil d'analyse des impressions en C# .NET + SQL ; rédaction des spécifications fonctionnelles et techniques. |
| Janv. — févr. 2023 | Kuehne + Nagel | Développeur | Limas | Portail développeurs en JavaScript / CSS, déployé avec NGINX ; cahier des charges et maquettes. |
| Août 2022 — sept. 2025 | Lidl France | Opérateur logistique | Gondreville | Préparation de commandes, chariots élévateurs, en parallèle des études. |
| Mai — juil. 2022 | Lycée Jean Prouvé | Développeur web | Nancy | Site WordPress dynamique, présenté devant le corps enseignant. |

### Formation
| Période | Niveau | Diplôme | École |
|---|---|---|---|
| 2025 — 2027 | Bac +5 | Master MAALSI — Manager en Architecture et Applications Logicielles des SI (en cours) | CESI Nancy |
| 2023 — 2025 | Bac +3 | Licence Concepteur Développeur d'Applications (CDA) — Docker, GitLab, Node.js, React, Flutter, agile | CESI Nancy |
| 2021 — 2023 | Bac +2 | BTS SIO option SLAM — C#, Python, PHP, JavaScript, BDD relationnelles | Lycée Frédéric Chopin, Nancy |
| 2018 — 2021 | Bac | Bac pro Systèmes Numériques option RISC, **mention très bien** — réseaux, Cisco, VLAN, Arduino | Lycée Jean Prouvé, Nancy |

### Compétences
- Quotidien (Daimler Buses) : Symfony, React, TypeScript, PHP
- Projets perso : Laravel, PostgreSQL, WebSocket (Reverb), Three.js, Docker, Rust, Godot, GitHub Actions
- Déjà pratiqués : C# / .NET, SQL, Node.js / Express, Python, Flutter, NGINX, WordPress, Git, Cisco / réseaux
- IA : orchestration d'équipes d'agents (Claude Code, Codex, Gemini), A2A, contrats gelés, périmètres exclusifs,
  revue croisée multi-modèles, garde-fous déterministes, reprise après panne.

### Projets
- **PokéLine** (2026) — jeu de combat Pokémon au tour par tour, solo vs IA / local / en ligne. Laravel 12, Reverb (WebSocket),
  PostgreSQL, PokeAPI, GitHub Actions. Moteur de tour côté serveur (stats niv. 100, STAB, priorités, table des 18 types),
  IA qui note chaque attaque, choix simultanés protégés par transaction SQL, 9 objets, 10 équipes / compte, victoire par abandon après 90 s.
  Jouer : https://pokeline-production.up.railway.app/ — Code : https://github.com/etomit/PokeLine
- **MonCommerce Rapide** — maquette en ligne de vitrine + click & collect pour commerces indépendants (React).
  Prévu : cartes de fidélité Apple / Google Wallet. https://moncommercerapide-production.up.railway.app/
- **Les Oubliettes de Sombrepierre** — roguelike en Rust réalisé par 8 agents IA (orchestrateur Claude Code + Codex).
- **Market Synapse** — trading en simulation : 5 modèles analysent puis débattent ; un gestionnaire de risque Python sans IA décide.
- **Renaissance** — city-builder sous Godot (en cours), agent « directeur » + agents spécialisés en parallèle.
- **Ville procédurale Three.js**, **2048** et **Wordle bilingue** — intégrés au portfolio.
- **Pokemon_battle** (févr. 2025) — app Flutter/Dart (Android, iOS, web, desktop) : Pokédex avec recherche, équipes,
  combat (critiques, échecs), historique par utilisateur, connexion. Provider, Hive, sqflite. https://github.com/etomit/Pokemon_battle
- **python_api_rest** (avr. 2025) — API REST FastAPI + SQLite (CRUD utilisateurs / tâches), architecture en couches
  models / repositories / services, hachage des mots de passe, client Tkinter. https://github.com/etomit/python_api_rest
- **nipponsocket** (juin 2025) — serveur temps réel Node.js / Express 5 / Socket.IO 4 pour le suivi de matchs
  (salles, chrono, scores, fautes), état conservé aux reconnexions avec TTL, tests `node --test`, déployé sur Railway.
  https://github.com/etomit/nipponsocket
- **30minGame** (oct. 2026) — jeu d'arcade HTML/JS sans framework, parallaxe multi-plans. https://github.com/etomit/30minGame
- **Casse-brique** (2023) — jeu Java Swing/AWT. https://github.com/etomit/Casse-brique
- **web1** (2020) — premier site HTML/CSS (projet d'art sur Bleach). Peut figurer comme « premier site ».
- Ne PAS mettre en avant `ddt4allAI` (fork sans contribution propre) ni `website-v1` (vide).
- Détails PokéLine en plus : PHP 8.2, Blade, Tailwind 4, Vite, hub 2D jouable, son 8-bit, FR/EN, PHPUnit, déploiement Railway (app + Reverb + Postgres).

### Savoir-être (appuyé sur des faits)
- Écouter avant de coder (cahiers des charges chez Kuehne + Nagel et Nexiom)
- Présenter (site présenté au corps enseignant)
- Connaître le terrain (3 ans chez Lidl)
- Mener de front études, entreprise et projets depuis 2022
- Donner une consigne claire (pilotage d'agents IA)
- Objectif : se rapprocher des clients et utilisateurs, comprendre le besoin à la source.

### Assets existants
- `public/portrait-*.webp`, `public/pokeline-*.webp`, `public/moncommerce-*.webp`, `public/og-image.jpg`, `public/favicon.svg`
- Originaux dans `assets-source/` (script `convert-images.mjs`).

## 5. Livrable et définition de « terminé »

- Travail sur la branche `claude/portfolio-blueprint-redesign-vd90od`, commits réguliers et explicites, push à la fin.
- Mettre à jour `readme.md` (nouvelle idée directrice blueprint, où modifier quoi).
- Vérifier visuellement avec Playwright (captures desktop 1440 px + mobile 390 px, thème, FR/EN) et comparer à la maquette ;
  itérer tant que l'écart est visible. Joindre les captures dans `docs/refonte-blueprint/captures/`.
- `npm run lint` + `npm run build` verts.
- Ne pas ouvrir de pull request sans demande explicite ; laisser un résumé final de ce qui a été fait et de ce qui reste.
