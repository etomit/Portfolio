# Portfolio — Timothée Maire

Portfolio personnel en React, TypeScript et Vite, bilingue français / anglais.

## L'idée

Une ligne longe toute la page, comme un plan de ligne de bus : chaque section est un arrêt, un petit bus reste à hauteur du regard pendant le défilement, et le bloc de contact est le terminus. C'est un clin d'œil à Daimler Buses, et c'est ce qui remplace les habituels repères numérotés.

Les textes suivent une ligne éditoriale simple : « je », des phrases courtes, des noms propres et des dates plutôt que des adjectifs. Pas de slogan, pas de liste de qualités.

## Ce qu'on y trouve

- le parcours, sous forme d'accordéon (le poste actuel est ouvert par défaut) ;
- PokéLine et MonCommerce Rapide, avec capture et lien vers la version en ligne ;
- une section IA : les projets menés avec des équipes d'agents et les techniques utilisées (agent à agent, contrats gelés, revue croisée…) ;
- une section « Côté humain » : le savoir-être, appuyé sur des faits du parcours ;
- une ville procédurale en Three.js, chargée seulement quand elle approche de l'écran ;
- deux mini-jeux (2048 et Wordle), chargés seulement quand on les ouvre ;
- thème clair / sombre et langue mémorisés localement ;
- aucun traceur, aucune requête vers un service tiers : les polices sont servies par le site.

## Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| un texte, un poste, un diplôme, un lien | `src/content.ts` |
| les couleurs, les polices | `src/styles/tokens.css` |
| la ligne de bus et les arrêts | `src/styles/base.css` (bloc « La ligne ») |
| une section | `src/components/` et la feuille du même nom dans `src/styles/` |
| la scène 3D | `src/three/cityScene.ts` |
| les mini-jeux | `src/games/` |

Les images affichées sont des WebP générés à partir des originaux rangés dans `assets-source/` (hors du site publié). Pour les régénérer : installer `sharp`, puis `node assets-source/convert-images.mjs assets-source public`.

## Développement

```bash
npm install
npm run dev
```

Avant de déployer :

```bash
npm run lint
npm run build
npm run preview
```

## Sécurité

Le site applique une politique CSP stricte (aucune source externe), refuse l'intégration en iframe et limite les permissions navigateur. Les en-têtes sont définis dans `vite.config.ts` pour les serveurs Vite de développement et de prévisualisation ; en production, ils doivent être repris par l'hébergeur ou le reverse proxy.
