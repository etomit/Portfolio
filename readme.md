# Portfolio — Timothée Maire

Portfolio personnel en React 19, TypeScript, Vite et Three.js, bilingue français / anglais. C'est aussi un CV en ligne : parcours, projets, compétences et formation y sont complets.

## L'idée : un plan d'architecte

Tout le site est dessiné comme un plan : fond bleu de Prusse quadrillé, traits clairs au trait, croix de repérage aux coins des feuilles, cotes en millimètres, annotations au crayon et un cartouche en pied de page. Un second thème, « tirage papier », retourne le plan en bleu encre sur papier calque.

Le fil conducteur est un **bus** (clin d'œil à Daimler Buses) :

- dans le hero, un bus urbain de 12 m en fil de fer, en 3D, avec ses cotes ; il tourne lentement, suit la souris et passe en vue éclatée ;
- dans « À propos », le même bus se dessine pendant le défilement — le plan, le volume, les détails, le rendu — en même temps que le parcours se lit.

Les repères de section ne sont jamais numérotés : crochets, barres obliques et cadres suffisent.

## Ce qu'on y trouve

- une intro d'ouverture (tracés de construction, nom tracé au trait, hachures), jouée une fois par session, passable au clic ou au clavier, absente si l'utilisateur préfère réduire les animations ;
- des chronologies « cotées » pour le parcours et la formation : chaque période est une ligne de cote ;
- des cartes projets avec vignette filaire, qui ouvrent une fiche détaillée ; une liste d'archives ;
- une section IA (le trajet d'une mission confiée à des agents, les techniques utilisées) et une nomenclature des compétences ;
- une ville procédurale en Three.js et deux mini-jeux (2048, Wordle) ;
- une nappe filaire qui ondule derrière le contact ;
- thème et langue mémorisés localement, aucun traceur, aucune ressource externe (polices servies par le site).

Les scènes Three.js ne sont téléchargées qu'à l'approche de l'écran, mises en pause hors écran, et remplacées par un dessin SVG si WebGL manque.

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| un texte, un poste, un diplôme, un projet, un lien | `src/content.ts` (puis `node scripts/typo-fr.mjs` pour les espaces insécables du français) |
| les couleurs des deux thèmes, les polices | `src/styles/tokens.css` |
| le fond quadrillé, les feuilles, les boutons en crochets | `src/styles/base.css` |
| une section | `src/components/` et la feuille correspondante dans `src/styles/` |
| le bus en 3D, la vague, la ville | `src/three/busScene.ts`, `waveScene.ts`, `cityScene.ts` |
| le bus en dessin technique | `src/sketch/busSketch.ts` |
| les vignettes des projets | `src/components/Sketch.tsx` |
| l'intro du hero | `src/components/HeroName.tsx`, `Hero.tsx` et la fin de `src/styles/hero.css` |
| les mini-jeux | `src/games/` |

Les images affichées sont des WebP générés à partir des originaux rangés dans `assets-source/` : `node assets-source/convert-images.mjs assets-source public` (avec `sharp` installé).

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

Captures de contrôle (desktop 1440 px, mobile 390 px, français et anglais, deux thèmes, intro, fiche projet), écrites dans `docs/refonte-blueprint/captures/` :

```bash
npx playwright install chromium
node scripts/captures.mjs http://localhost:5173
```

Le brief et la maquette de cette refonte sont dans `docs/refonte-blueprint/`.

## Sécurité

La balise meta d'`index.html` porte une politique CSP sans aucune source externe. Au build, un petit plugin de `vite.config.ts` la resserre : le script de thème en ligne est autorisé par son empreinte SHA-256 au lieu de `'unsafe-inline'`, et `ws:` / `wss:` (utiles au seul rechargement à chaud) disparaissent.

Les autres en-têtes (refus de l'intégration en iframe, permissions navigateur, `X-Frame-Options`…) sont définis dans `vite.config.ts` pour les serveurs Vite **de développement et de prévisualisation seulement**. Une balise meta ne peut pas porter `frame-ancestors` : en production, l'hébergeur ou le reverse proxy doit reprendre ces en-têtes.
