# Plan : portrait qui se dessine, bus eCitaro, deux motorisations, textes sans répétitions

Branche : `claude/portfolio-ecitaro-portrait`, partie de `main` après la fusion de la refonte « blueprint » (PR #8).

## Demandes de Timothée (23 novembre 2026)

1. Sa photo se dessine au fur et à mesure, « avec les lignes », et elle est placée ailleurs pour qu'elle se dessine au défilement.
2. Le texte se répète (« je parle plusieurs fois du MAALSI, etc. »).
3. Le bus prend le design du **Mercedes-Benz eCitaro**, avec ses vraies dimensions : c'est le modèle produit dans son usine.
4. Ajouter un moteur de bus Citaro, « si possible ».

## Décisions déjà prises par Timothée (non négociables)

- **Photo** : dans « À propos », elle **remplace le bus** dans la colonne de dessin. Elle se dessine en quatre calques, synchronisés avec les quatre étapes du parcours.
- **Moteur** : **les deux**.
  - La chaîne électrique de l'eCitaro dans la vue éclatée du bus 3D.
  - Le diesel OM 936 du Citaro thermique, présenté à part.
- **Règles déjà en vigueur** :
  - aucun numéro de section ou d'élément ;
  - le cartouche du hero garde « Développeur full-stack · Architecte logiciel · Créateur de jeux » ;
  - EvoTools et SQL Server ne sont affichés nulle part ; ddt4allAI et website-v1 ne sont pas mis en avant ;
  - ne jamais inventer de fait ;
  - texte en « je » et « vous », sans slogans.

## Sources

- `docs/ecitaro/REFERENCE.md` : cotes, motorisations, repères de design de l'eCitaro, et OM 936. Les chiffres du site viennent **uniquement** de ce fichier.
- `docs/portrait-ecitaro/TEXTES.md` : relevé des répétitions et textes proposés (46 chaînes).
- `docs/refonte-blueprint/BRIEF.md` : la direction « plan d'architecte », toujours valable.

---

## 1. Le portrait qui se dessine (« À propos »)

### Mise en page
- La vignette actuelle en haut de la colonne de texte disparaît. La photo n'apparaît qu'une fois, dans le dessin.
- La colonne de droite, collante, est celle du bus aujourd'hui. Elle montre le portrait et, dessous, la légende des quatre calques.
- Le mécanisme de défilement d'`About.tsx` ne change pas : il écrit l'avancement de chaque étape dans les variables CSS `--s1` à `--s4` du dessin.

### Les quatre calques
Les notes d'étape proposées sont « l'esquisse / le contour / la profondeur / le regard » (voir `TEXTES.md`).
1. **Tracés de construction** :
   - axe vertical ;
   - ovale de la tête ;
   - lignes des yeux, du nez, de la bouche et des épaules ;
   - cadre de mise au carreau, avec repères aux coins (croix de repérage du site) et une cote.
   Calculés à partir de quelques repères mesurés une fois sur la photo source et écrits dans le script.
2. **Contour** :
   - silhouette, tirée de la transparence de la photo (fond déjà détouré) ;
   - grandes lignes intérieures : monture des lunettes, cheveux, col, revers, fermeture éclair, boutons.
   Elles sont tirées d'une détection de bords, chaînées en polylignes, filtrées par longueur et simplifiées.
3. **Ombres** : hachures à 45° dans les tons moyens, croisées à −45° dans les tons sombres, découpées selon la luminance.
4. **Photo** : la photo existante (`portrait-520/900.webp`), révélée par un masque qui descend, puis teintée par le thème comme aujourd'hui.

### Animation
- Calques 1 et 2 : `pathLength="1"` et `stroke-dashoffset: calc(1 - var(--sN))`, comme le dessin du bus actuel (`BusSketch`).
- Calque 3 : révélé par un `clipPath` qui balaie en diagonale selon `--s3`.
- Calque 4 : masque et opacité selon `--s4`. Une fois la photo là, les traits restent en surimpression légère, comme un calque posé sur un tirage.

### Génération
- Script hors ligne `scripts/portrait-lines.mjs`. Il lit `assets-source/profile.png` (2160 × 2880, fond transparent).
- Il recadre exactement comme `portrait-*.webp`, pour que traits et photo se superposent.
- Il écrit `src/sketch/portraitPaths.ts` : les chemins SVG de chaque calque, dans le repère de la photo recadrée.
- Décodage avec `sharp` (nouvelle dépendance de développement, déjà nécessaire à `assets-source/convert-images.mjs`). Les algorithmes (bords, chaînage, simplification, hachures) sont en JS simple dans le script.
- Objectif de poids : chemins sous 60 kB bruts, environ 20 kB gzip. Au-delà, on simplifie davantage.

### Accessibilité, mouvement réduit, impression
- La photo garde un texte alternatif ; le SVG des traits est `aria-hidden`.
- Mouvement réduit : tout est dessiné et la photo est visible d'emblée.
- Impression : traits et photo visibles. La photo n'est plus en `loading="lazy"`, sinon elle reste vide si on imprime sans avoir défilé ; si `eager` coûte trop au premier affichage, on la charge à l'approche.

---

## 2. Le bus devient un eCitaro

### Faits retenus (détails et sources dans `REFERENCE.md`)

| Point | Valeur | Commentaire |
| --- | --- | --- |
| Longueur | 12 135 mm | aujourd'hui « 12 000 mm » |
| Largeur | 2 550 mm | sans rétroviseurs |
| Hauteur | 3 400 mm | avec les batteries de toit ; aujourd'hui « 3 050 mm » |
| Empattement | 5 900 mm | |
| Porte-à-faux avant | 2 805 mm | |
| Porte-à-faux arrière | 3 430 mm | |
| Plancher | 370 mm, entrée à 320 mm | |
| Pneus | 275/70 R22,5 | |
| Portes | 2 ou 3 | portes 1 et 2 de 1 250 mm |
| Batteries | NMC4 de 111 kWh par pack, 4 à 6 packs | 2 dans l'ancien compartiment moteur, jusqu'à 4 sur le toit |
| Recharge | prise CCS2 au-dessus de la roue avant droite | pantographe en option au droit de l'essieu avant |
| Production | Ligny-en-Barrois, 2ᵉ site depuis juin 2024 | après Mannheim |

### Incertitudes

- **L'essieu de 2026 est discuté** :
  - fiche officielle 04/2026 : ZF AxTrax 2 LF, 440/360 kW ;
  - profils Daimler 2025 : ZF AxTrax AVE, 2 × 140 kW ;
  - presse de novembre 2026 : l'AxTrax 2 LF arrive avec la génération 2028.
  Dans tous les cas, c'est un essieu portique avec un moteur près de chaque moyeu.
  **Proposition** : nommer « essieu portique électrique ZF, un moteur à chaque roue » sans chiffre de puissance, ou citer la fiche 04/2026 en la datant.
- **Positions non chiffrées** : portes le long du bus, début et fin du carénage de toit, courbe du vitrage. On les estime à partir des vues officielles, et on ne cote que les dimensions sourcées.

- **Cotes** : celles de l'eCitaro solo de 12 m, tirées de `REFERENCE.md`, dans la scène 3D (`src/three/busScene.ts`) et le dessin technique (`src/sketch/busSketch.ts`). Les libellés `hero.dims` passent aux vraies valeurs.
- **Silhouette**, d'après les repères de `REFERENCE.md` :
  - face avant ;
  - ligne de vitrage avec la courbe au-dessus de la porte avant et la fin du vitrage à l'arrière ;
  - carénages de toit (batteries, climatisation) ;
  - arrière ;
  - portes et leur position ;
  - empattement et porte-à-faux.
  Même langage graphique qu'aujourd'hui : fil de fer, maillage fin, cotes.
- **Dessin technique** (`busSketch.ts`) : il ne sert plus dans « À propos ». Il reste le dessin de secours du hero (sans WebGL) et la version imprimée. Il est redessiné avec la même silhouette.
- **Pas de logo** : la marque est nommée dans le texte, l'étoile n'est pas dessinée.
- **Texte** : la note manuscrite du hero (« Modèle 3D (Three.js), un bus, évidemment ») peut nommer l'eCitaro et dire que c'est le bus produit dans l'usine où Timothée travaille. Cette information vient de lui, le 23 novembre 2026. Formulation à valider.

## 3. La chaîne électrique dans la vue éclatée

- Quand on éclate le bus :
  - les packs de batteries du toit se soulèvent ;
  - le pack arrière, s'il existe selon `REFERENCE.md`, recule ;
  - l'essieu moteur électrique descend sous l'essieu arrière, avec ses moteurs mis en avant (couleur d'accent).
- Chaque pièce porte une étiquette, comme les cotes actuelles (sprites sur canevas) : nom et un chiffre clé (puissance, capacité), sourcés.
- Les flancs restent en place, comme aujourd'hui, pour que l'intérieur se lise.

## 4. Le diesel OM 936, à part

- **Proposition** : une carte « À essayer », à côté de la ville procédurale. Elle contient :
  - une petite scène Three.js chargée à l'approche (`src/three/engineScene.ts` et `src/components/EngineCard.tsx`, sur le modèle de `CityCard`) ;
  - le 6 cylindres en ligne en fil de fer, qui tourne lentement ;
  - un bouton qui l'éclate : culasse, pistons, vilebrequin, turbo ;
  - deux lignes de texte : ce que c'est, où il se trouve dans le Citaro thermique, et que l'eCitaro le remplace par l'essieu électrique.
- **Alternative** : un bouton « Citaro diesel » dans la vue éclatée du hero, qui remplace la chaîne électrique par l'OM 936 dans sa tour arrière. C'est plus parlant, mais plus lourd dans le hero.

## 5. Textes

- Appliquer `TEXTES.md` après débat : 23 chaînes par langue.
- Remplacer les notes et la légende du dessin par celles du portrait.
- Relancer `node scripts/typo-fr.mjs`.

## 6. Vérification et livraison

- `npm run lint` et `npm run build` passent.
- Captures dans `docs/portrait-ecitaro/captures/` : desktop 1440 et mobile 390, FR et EN, deux thèmes. Cadrages : « À propos » à chaque calque, hero, vue éclatée, carte du moteur.
- Image de partage régénérée (le bus du hero change).
- Points à contrôler :
  - pas de débordement de 360 à 1920 px ;
  - mouvement réduit ;
  - impression ;
  - LCP du hero inchangé ;
  - poids ajouté (chemins du portrait, scène du moteur).
- Commits par morceau, push. Pas de PR sans demande de Timothée.

## Questions ouvertes pour la relecture

1. Où placer l'OM 936 : carte « À essayer » ou bouton dans la vue éclatée ?
2. La génération des traits du portrait (bords, chaînage, hachures) : approche, poids, rendu « crayon » crédible ?
3. Les notes d'étape : « le regard » ou « la ressemblance » ?
4. Hero : le paragraphe d'une phrase de `TEXTES.md` suffit-il pour un premier contact ?
5. Ce qui manque ou ce qui est en trop, à n'importe quel endroit.

---

## Décisions après relecture A2A (Fable 5.2, 23 novembre 2026)

Bilan : 14 propositions, 10 acceptées, 4 amendées. Le relecteur a concédé les 4 amendements ; aucun désaccord n'est consigné.

- **R-01 — mise en page d'« À propos »** :
  - grille 7fr texte / 5fr dessin, texte limité à 62ch ;
  - portrait en `aspect-ratio: 1000/1170`, hauteur au plus `min(560px, 100svh − 96px − légende − 24px)` ;
  - espace calculé sous la dernière étape, pour que le calque 4 finisse avant que le dessin ne décroche ;
  - contrôle à 1366×768 et 1440×900.
- **R-02 — source et décodage** : `assets-source/profile-optimized.png`, recadrage partagé {left 40, top 270, 1000 × 1170}, viewBox `0 0 1000 1170`. Décodage par Playwright (canvas, `getImageData`). Pas de `sharp`.
- **R-03 — essai du calque 2 en premier** : différence de gaussiennes sur la luminance floutée, chaînage, Bézier, 120 traits au plus, liste d'exclusion manuelle.
  - Critères fixés avant l'essai :
    - traits superposés à la photo à 50 % d'opacité, sans décalage visible ;
    - lunettes, yeux et bouche lisibles à 216 px de large ;
    - aucun trait isolé sur la joue ou le front ;
    - 120 traits au plus.
  - Validation en revue A2A sur captures. Après deux itérations ratées : repli sur des traits du visage écrits à la main à partir des repères.
  - Le résumé final montre le calque 2 seul à Timothée et dit quel procédé a été retenu.
- **R-04 — tracé** : un `<path>` par trait pour les calques 1 et 2, tracés l'un après l'autre (`--a` début, `--b` durée dans le calque). Calque 3 : un chemin fusionné sous un `clipPath`. Pas de `non-scaling-stroke`.
- **R-05 — hachures** : deux chemins entrelacés (lignes paires et impaires), un seul affiché sur mobile. Seuils par centiles de luminance dans la silhouette. Espacement croissant vers le bas, extrémités irrégulières. Trait ≥ 1 px à l'écran.
- **R-06 — poids** : 35 kB bruts au plus (coordonnées entières, commandes relatives). Chemins en lot différé, boîte réservée. Photo en `loading="eager"` avec `fetchpriority="low"`, `sizes` corrigé.
- **R-07 — chaîne électrique** :
  - 3 packs sur le toit et 2 à l'arrière ([P25b]). Sprite : « Batteries NMC4 · 111 kWh par pack ». La liste DOM précise : « Ici, 3 packs sur le toit et 2 à l'arrière ; 4 à 6 selon la configuration. »
  - Essieu : « Essieu portique ZF · un moteur par roue », sans kW. Roues arrière et essieu forment une seule pièce.
  - Prise CCS2 au-dessus de la roue avant droite.
- **R-08 — cotes** : hauteur de 3 400 mm au sommet de l'îlot de toit, pavillon non coté. Essieux à x = +3,2625 et −2,6375 (longueur 12,135, origine au centre). `WHEEL_R` reste à 0,48. Cadrages recalculés.
- **R-09 — portes** :
  - on relève les vignettes officielles « 2 doors / 3 doors » avant de modéliser ;
  - 3 portes si la vignette est lisible, sinon 2 ;
  - porte 3 à 1,25 m, consignée « estimée » ;
  - la porte 3 et les 2 packs arrière se partagent le porte-à-faux arrière, positions consignées « estimées » dans REFERENCE ;
  - sources publiques uniquement.
- **R-10 — OM 936** : compléter REFERENCE §5 (alésage et course, suralimentation) depuis des sources officielles, sinon un « schéma de principe » qui n'étiquette que les chiffres sourcés. Texte : « Dans l'eCitaro, deux packs de batteries prennent sa place ; les moteurs sont dans l'essieu. »
- **R-11 — nouveaux faits accessibles** :
  - libellés accessibles avec « Mercedes-Benz eCitaro » et les trois cotes ;
  - liste DOM des pièces en vue éclatée, lisible, traduite et imprimable ;
  - mention en label mono : « d'après la fiche constructeur (04/2026), dessin personnel » ;
  - le fait « usine » dit une fois, dans `about.stages[2]`, avec le verbe « produit ».
- **R-12 — « À propos »** :
  - `about.sketchLabel` supprimé ;
  - `portraitCaption` (« Timothée Maire ») dans le cartouche du cadre ;
  - impression étendue au portrait et à son masque ;
  - la cote du calque 1 n'a que des graduations, sans valeur.
- **R-13 et R-14 — textes** : voir les arbitrages de `TEXTES.md` §4. Les trois « pourquoi » vont dans le résumé final pour Timothée.
- **Questions ouvertes, toutes retenues** :
  - OM 936 dans une carte « À essayer » ;
  - note « la ressemblance / the likeness » ;
  - hero en une phrase ;
  - ordre de travail : textes, puis portrait (essai d'abord), puis bus, puis moteur.
