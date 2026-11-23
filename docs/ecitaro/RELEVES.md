# eCitaro solo : relevés sur image pour le modèle 3D et le dessin

Relevés du 23/11/2026, pour `src/three/busScene.ts` et `src/sketch/busSketch.ts`. Les cotes chiffrées restent celles de `REFERENCE.md` ; ce fichier ne donne que des **positions** et des **formes**.

Chaque ligne porte l'une des deux mentions :
- **relevé sur image** : mesuré en pixels sur une vue officielle, puis mis à l'échelle ;
- **estimé** : déduit, faute de vue lisible ou de document.

## Images utilisées

- [V3] vignette « 3 doors », profil droit, avant à droite (1 660 × 520 px) :
  https://www.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/vignetten/ecitaro-3-doors-pdf-vignette.jpg
- [V2] vignette « 2 doors », même cadrage :
  https://www.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/vignetten/ecitaro-2-doors-pdf-vignette.jpg

Les deux sont des vues de profil dessinées (pas des photos). La vignette « 3 doors » est lisible : **le modèle a trois portes**.

## Échelle et contrôle

- Arrière à x ≈ 5 px, nez du pare-chocs à x ≈ 1 098 px : 1 093 px pour 12 135 mm, soit **90,07 px/m**. Sol (bas des pneus) à y ≈ 350 px.
- Contrôle sur les cotes sourcées :

| Mesure sur [V3] | Relevé | Fiche |
|---|---|---|
| Centre roue avant – centre roue arrière | 530 px = 5,88 m | 5,900 m |
| Porte-à-faux avant | 255 px = 2,83 m | 2,805 m |
| Porte-à-faux arrière | 308 px = 3,42 m | 3,430 m |
| Diamètre de roue | 88 px = 0,98 m | rayon de 0,48 m dans le modèle |

L'écart reste sous 2,5 cm sur l'empattement : la vignette est fidèle aux cotes.

## Positions en proportion de la longueur

Distance depuis l'avant, puis abscisse dans la scène 3D (origine au centre, avant vers +x : x = 6,0675 − d).

| Élément | d depuis l'avant | Part de la longueur | x scène | Mention |
|---|---|---|---|---|
| Porte 1, cadre | 0,51 – 1,91 m | 4,2 – 15,7 % | 5,56 – 4,16 | relevé sur image [V3] |
| Porte 2, cadre | 5,61 – 7,03 m | 46,2 – 57,9 % | 0,46 – −0,96 | relevé sur image [V3] |
| Porte 3, cadre | 9,60 – 11,02 m | 79,1 – 90,8 % | −3,54 – −4,96 | relevé sur image [V3] |
| Essieu avant | 2,84 m | 23,4 % | 3,24 | relevé sur image, modèle à 3,2625 (fiche) |
| Essieu arrière | 8,72 m | 71,9 % | −2,65 | relevé sur image, modèle à −2,6375 (fiche) |

- Les cadres relevés font 1,40 à 1,42 m de large. Le modèle garde une **ouverture de 1,25 m** centrée sur chaque cadre : portes 1 et 2 sourcées (fiche), **porte 3 estimée** à 1,25 m (même cadre que les deux autres sur [V3]).
- Ouvertures retenues (x scène) : porte 1 [4,23 ; 5,48], porte 2 [−0,875 ; 0,375], porte 3 [−4,87 ; −3,62].
- La porte 2 est un peu en arrière du milieu de l'empattement (milieu à d = 5,76 m). Sur [V2], elle est plus en avant (d ≈ 6,4 à 7,8 m) : les deux implantations existent.

## Vitrage (flanc droit)

| Élément | Relevé | Mention |
|---|---|---|
| Bas des vitres latérales | 1,31 m du sol | relevé sur image [V3] |
| Haut des vitres et des portes | 2,28 m (vitres), 2,30 m (portes) | relevé sur image [V3] |
| Bande noire au-dessus des vitres | jusqu'à ≈ 3,02 m : le vitrage se prolonge visuellement jusqu'au toit | relevé sur image [V3], cohérent avec REFERENCE §3 |
| Vitres, x scène | [−5,68 ; −5,07], [−3,40 ; −1,87], [−1,68 ; −1,09], [0,54 ; 2,29], [2,55 ; 4,01] | relevé sur image [V3] |
| Première vitre à l'arrière | coupée au montant d'angle ; ramenée à [−5,50 ; −5,05] dans le modèle | relevé sur image, ajusté |
| Courbe du vitrage au-dessus de la porte 1 | non visible : les hauts de porte et de vitre sont alignés sur [V3] | relevé sur image |
| Passages de roue en relief | ils montent presque jusqu'au bas des vitres | relevé sur image [V3] |
| Flanc gauche | 7 vitres égales et la vitre du conducteur | **estimé** (pas de vue de gauche) |

## Toit et îlot

| Élément | Relevé | Mention |
|---|---|---|
| Sommet de l'îlot | 3,31 m sur [V3] ; le modèle prend 3,40 m (fiche) | relevé sur image, coté d'après la fiche |
| Partie plate de l'îlot | de d ≈ 2,42 m à d ≈ 11,5 m (x scène 3,65 à −5,45) | relevé sur image [V3] |
| Avant de l'îlot | descend en pente douce de d ≈ 2,4 m jusqu'au haut du pare-brise (d ≈ 0,4 m, ≈ 2,9 m du sol) | relevé sur image [V3] |
| Arrière de l'îlot | arrondi serré, raccordé au montant d'angle | relevé sur image [V3] |
| Joints visibles dans l'îlot | d ≈ 2,4, 6,7 et 9,4 m (segments) | relevé sur image [V3] |
| Pavillon sous l'îlot | 2,80 m, non coté | **estimé** |
| 3 packs du toit et climatisation sous l'îlot | packs entre x −5,1 et 1,0, climatisation entre 1,4 et 3,4 | **estimé** |

## Face avant et face arrière

| Élément | Relevé | Mention |
|---|---|---|
| Recul du haut du pare-brise | ≈ 0,32 m entre le pare-chocs et le haut du vitrage | relevé sur image [V3] |
| Pare-brise | monte jusqu'à ≈ 2,6 m et englobe la girouette | relevé sur image [V3], REFERENCE §3 |
| Rétroviseur | bras en corne de bélier, haut du bras à ≈ 2,58 m, miroir entre ≈ 2,0 et 2,44 m, ≈ 0,25 m devant le nez | relevé sur image [V3] |
| Panneau noir, phares LED, montants A0 | position en hauteur seulement (panneau ≈ 0,5 – 0,92 m) | **estimé** d'après REFERENCE §3 |
| Feux arrière | dans les montants d'angle, ≈ 0,86 – 1,58 m du sol | relevé sur image [V3] (hauteur), forme **estimée** |
| Lunette arrière et barres noires vers le toit | ≈ 1,62 – 2,30 m | **estimé** |

## Porte-à-faux arrière

- 2 packs de batteries dans l'ancien compartiment moteur, derrière la porte 3 : x de −5,85 à −5,0, empilés entre 0,62 et 1,47 m. **Estimé** : aucune vue ne montre le compartiment.
- La porte 3 et les packs se partagent le porte-à-faux (porte jusqu'à x = −4,87, packs à partir de −5,0).

## Roues

- Roues arrière jumelées conservées. La jante arrière de [V3] a un voile profond, compatible avec des roues jumelées ; REFERENCE §3 écrit « pneus simples ». **Non tranché.**

## Ce qui reste approximatif

- Flanc gauche, intérieur des faces avant et arrière, forme exacte des phares.
- Emplacement des packs du toit, de la climatisation et des packs arrière.
- Prise CCS2 : au-dessus de la roue avant droite (sourcé), entre le passage de roue et le bas des vitres (position fine **estimée**).
