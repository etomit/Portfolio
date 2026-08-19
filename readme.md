# Portfolio — Timothée Maire

Portfolio personnel construit avec React, TypeScript et Vite. L’interface est structurée pour les recruteurs et présente le profil, l’expérience, les compétences et quatre projets personnels lançables de Timothée Maire.

## Fonctionnalités

- thème clair/sombre mémorisé localement ;
- contenu français/anglais selon la langue du navigateur ;
- navigation active et progression de lecture ;
- animations d’entrée, cartes en perspective et mode réduit respecté ;
- PokéLine et MonCommerce Rapide accessibles en ligne ;
- mini-jeux 2048 et Wordle intégrés directement au portfolio ;
- logos locaux pour les technologies et présentation des usages de Claude Code, Codex et Gemini ;
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
