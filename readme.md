# Portfolio — Timothée Maire

Portfolio personnel en React 19, TypeScript, Vite et Three.js, bilingue français / anglais. C'est aussi un CV en ligne : parcours, projets, compétences et formation y sont complets.

## L'idée : un plan d'architecte

Tout le site est dessiné comme un plan : fond bleu de Prusse quadrillé, traits clairs au trait, croix de repérage aux coins des feuilles, cotes en millimètres, annotations au crayon et un cartouche en pied de page. Un second thème, « tirage papier », retourne le plan en bleu encre sur papier calque.

Le fil conducteur est le **Mercedes-Benz eCitaro**, le bus électrique produit chez Daimler Buses à Ligny-en-Barrois, où je travaille :

- dans le hero, l'eCitaro en fil de fer, en 3D, aux cotes de la fiche constructeur (12 135 × 2 550 × 3 400 mm, empattement 5 900 mm) ; il tourne lentement, suit la souris et passe en vue éclatée : pavillon et batteries de toit, packs arrière, essieu portique ZF et ses moteurs, prise CCS2 ;
- dans « À propos », mon portrait se dessine pendant que le parcours défile, en quatre calques : l'esquisse, le contour, la profondeur (hachures), puis la ressemblance (la photo) ;
- dans « À essayer », le moteur OM 936 du Citaro diesel : six cylindres en ligne dont les pistons suivent le vilebrequin, à éclater d'un bouton.

Les cotes et leurs sources sont dans `docs/ecitaro/REFERENCE.md` ; ce qui est estimé y est marqué comme tel.

Les repères de section ne sont jamais numérotés : crochets, barres obliques et cadres suffisent.

## Ce qu'on y trouve

- une intro d'ouverture (tracés de construction, nom tracé au trait, hachures), jouée une fois par session, passable au clic ou au clavier, absente si l'utilisateur préfère réduire les animations ;
- des chronologies « cotées » pour le parcours et la formation : chaque période est une ligne de cote ;
- des cartes projets avec vignette filaire, qui ouvrent une fiche détaillée ; une liste d'archives ;
- une section IA (le trajet d'une mission confiée à des agents, les techniques utilisées) et une nomenclature des compétences ;
- une ville procédurale et le moteur OM 936 en Three.js, et deux mini-jeux (2048, Wordle) ;
- une nappe filaire qui ondule derrière le contact ;
- thème et langue mémorisés localement, aucun traceur, aucune ressource externe (polices servies par le site) ;
- une version imprimable : à l'impression, le site passe en « tirage papier » et affiche tout son contenu.

Les scènes Three.js ne sont téléchargées qu'à l'approche de l'écran, mises en pause hors écran, et remplacées par un dessin SVG si WebGL manque.

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| un texte, un poste, un diplôme, un projet, un lien | `src/content.ts` (puis `node scripts/typo-fr.mjs` pour les espaces insécables du français) |
| les couleurs des deux thèmes, les polices | `src/styles/tokens.css` |
| le fond quadrillé, les feuilles, les boutons en crochets | `src/styles/base.css` |
| une section | `src/components/` et la feuille correspondante dans `src/styles/` |
| le bus en 3D, la vague, la ville, le moteur | `src/three/busScene.ts`, `waveScene.ts`, `cityScene.ts`, `engineScene.ts` |
| les cotes du bus (gabarit commun à la 3D et au dessin de secours) | `src/sketch/busSketch.ts` |
| le portrait qui se dessine | `src/components/PortraitSketch.tsx`, `About.tsx`, `src/styles/about.css` |
| les traits du portrait | `scripts/portrait-lines.mjs`, qui régénère `src/sketch/portraitPaths.ts` |
| les vignettes des projets | `src/components/Sketch.tsx` |
| l'intro du hero | `src/components/HeroName.tsx`, `Hero.tsx` et la fin de `src/styles/hero.css` |
| les mini-jeux | `src/games/` |
| l'image de partage (LinkedIn, etc.) | `public/og-image.jpg`, régénérée par `node scripts/og-image.mjs` |

Les images affichées sont des WebP générés à partir des originaux rangés dans `assets-source/` : `node assets-source/convert-images.mjs assets-source public` (avec `sharp` installé). Le portrait est recadré par `assets-source/portrait-crop.mjs`, que lit aussi le générateur de traits : la photo et le dessin se superposent exactement.

Traits du portrait : `node scripts/portrait-lines.mjs` (Playwright sert à décoder le PNG). La silhouette et le manteau sont tirés de l'image ; le visage (lunettes, yeux, nez, bouche, barbe) est écrit à la main en courbes de Bézier dans le script, la détection automatique n'y suffisant pas.

## Développement

```bash
npm install
npm run dev
```

Avant de déployer :

```bash
npm run lint
npm run build
```

Captures de contrôle (desktop 1440 px, mobile 390 px, français et anglais, deux thèmes, intro, fiche projet, portrait à chaque étape, contour seul, bus éclaté, moteur), écrites dans `docs/portrait-ecitaro/captures/` :

```bash
npx playwright install chromium
node scripts/captures.mjs http://localhost:5173
```

Image de partage (1 200 × 630, tirée du hero) : `node scripts/og-image.mjs http://localhost:5173`.

Le dossier `docs/` garde la trace des chantiers :

- `docs/refonte-blueprint/` : brief, maquette et captures de la refonte « plan d'architecte » ;
- `docs/portrait-ecitaro/` : plan et textes du portrait, de l'eCitaro et du moteur, captures finales ;
- `docs/ecitaro/` : référence sourcée de l'eCitaro et de l'OM 936, relevés de la silhouette.

Avant chaque build, le travail a été relu par un second agent (Fable 5.2) : ses propositions ont été débattues point par point, retenues, amendées ou refusées, puis vérifiées sur le résultat.

## Sécurité

La balise meta d'`index.html` porte une politique CSP sans aucune source externe. Au build, un petit plugin de `vite.config.ts` la resserre : le script de thème en ligne est autorisé par son empreinte SHA-256 au lieu de `'unsafe-inline'`, et `ws:` / `wss:` (utiles au seul rechargement à chaud) disparaissent.

Les autres en-têtes (refus de l'intégration en iframe, permissions navigateur, `X-Frame-Options`…) sont définis dans `vite.config.ts` pour les serveurs Vite **de développement et de prévisualisation seulement**. Une balise meta ne peut pas porter `frame-ancestors` : en production, l'hébergeur ou le reverse proxy doit reprendre ces en-têtes.
