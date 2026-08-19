# Portfolio — Timothée Maire

Portfolio personnel construit avec React, TypeScript et Vite. L’interface présente le parcours, les compétences et les projets de Timothée Maire, notamment PokéLine et Mon CommerceRapide.

## Fonctionnalités

- thème clair/sombre mémorisé localement ;
- contenu français/anglais selon la langue du navigateur ;
- navigation active et progression de lecture ;
- animations d’entrée, cartes en perspective et mode réduit respecté ;
- projets filtrables et mini-jeux 2048/Wordle intégrés ;
- mise en avant de PokéLine avec capture réelle et liens explicites ;
- aucun formulaire de connexion, tracker ou chargement d’image tiers.

## Développement

```bash
npm install
npm run dev
```

Contrôles avant déploiement :

```bash
npm run lint
npm run build
npm run preview
```

## Sécurité et confiance

Le site applique une politique CSP, refuse l’intégration dans une iframe, limite les permissions navigateur et décrit explicitement toutes les destinations externes. Les en-têtes sont configurés dans `vite.config.ts` pour les serveurs Vite de développement et de prévisualisation. En production, ils doivent aussi être conservés par la couche d’hébergement ou le reverse proxy.
