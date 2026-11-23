# Mercedes-Benz eCitaro solo (12 m) : référence pour la modélisation

Recherche faite le 23/11/2026. Elle couvre la génération en production, dérivée du Citaro C2 et lancée en 2018. Une nouvelle génération sur plateforme électrique dédiée est annoncée pour 2028 (voir §6).

Abréviations des sources (URL complètes en §8) :
- **[F26]** : fiche officielle « Facts » eCitaro, mercedes-benz-bus.com/int, datée **04/2026**.
- **[P25a]** : profil du véhicule d'exposition (UITP), Daimler Truck, **12/06/2025**.
- **[P25b]** : profil eCitaro NMC4 (Busworld), Daimler Truck, **02/10/2025**.
- **[P23]** : données techniques eCitaro NMC3, Daimler Truck, **13/04/2023**.
- **[P23d]** : communiqué NMC3 sur la conception, Daimler Truck, **13/04/2023**.
- **[P18]** : communiqué de la première mondiale, Daimler Truck, **10/07/2018**.
- **[C26]** : fiche « Facts » du Citaro diesel, mercedes-benz-bus.com/int, **04/2026**.

---

## 1. Dimensions de l'eCitaro solo

| Cote | Valeur | Source | Remarque |
|---|---|---|---|
| Longueur hors tout | **12 135 mm** | [F26], [P25a], [P25b] | [P23] indique 12 125 mm, probablement une coquille : 2 805 + 5 900 + 3 430 = 12 135. |
| Largeur sans rétroviseurs | **2 550 mm** | [F26] | |
| Largeur avec rétroviseurs | 2 950 mm | [F26] | |
| Hauteur | **3 400 mm** | [F26], [P25a], [P23] | Avec batteries de toit et climatisation. Le Citaro diesel mesure 3 095 mm ([C26]), soit 305 mm de moins. |
| Empattement (essieu avant – essieu moteur) | **5 900 mm** | [F26], [P25a] | Identique au Citaro diesel ([C26]). |
| Porte-à-faux avant | **2 805 mm** | [F26], [P25a] | Environ 23,1 % de la longueur. |
| Porte-à-faux arrière | **3 430 mm** | [F26], [P25a] | Environ 28,3 % de la longueur. L'empattement en représente 48,6 %. |
| Hauteur du plancher (allée centrale) | 370 mm | [F26], [P25a] | |
| Hauteur d'entrée aux portes 1, 2 et 3 | **320 mm** | [F26] | |
| Hauteur debout dans l'allée centrale | 2 313 mm | [P25a], [P25b] | |
| Hauteur de parapet (« parapet height, above ground ») | 952 mm | [F26] | Probablement l'allège des vitres latérales. Le sens exact n'est pas confirmé. |
| Diamètre de braquage | **≈ 21 214 mm** | [F26], [P25a] | Le cercle BOKraft est de 25 000 mm ([F26]). |
| Pneus | **275/70 R 22,5** | [F26], [P25a] | 315/60 R 22,5 en option ([F26]). |
| Nombre de portes | 2 ou 3 | [F26] | Le 1 porte existe aussi (Royaume-Uni et autres marchés). |
| Largeur libre des portes 1 et 2 | **1 250 mm** | [F26] | La largeur de la porte 3 n'est pas renseignée dans [F26]. |
| Places assises (conducteur / passagers) | 1/29 en 2 portes, 1/26 en 3 portes | [F26] | 35 sièges sur le véhicule d'exposition [P25b]. |
| Capacité maximale | **88 passagers** | [F26], [P18] | |
| PTAC | 20 000 kg | [F26], [P23] | **Les sources divergent** : 19 500 kg dans [P25a], [P25b] et [P18]. |
| Charge maximale de l'essieu avant / moteur | 7 500 / 13 000 kg | [F26] | **Les sources divergent** : 8 000 kg à l'avant dans [P25a] et [P23]. |
| Poids à vide (5 packs NMC4) | ≈ 13 800 kg | Sustainable Bus, 11/2026 | |

**Position des portes : non confirmée par une fiche.** Aucune source accessible ne donne de cote. Les fiches Technische Information (TI) en PDF ont un dessin coté A–F, mais il n'a pas pu être lu. La disposition habituelle d'un Citaro ou eCitaro à plancher bas, à vérifier sur photo :
- porte 1 dans le porte-à-faux avant, devant la roue avant ;
- porte 2 entre les essieux, environ au milieu de l'empattement ;
- porte 3 (version 3 portes) dans le porte-à-faux arrière, derrière la roue arrière.

Avec 1 250 mm de largeur libre, les portes 1 et 2 sont à deux vantaux. La configuration en nombre de vantaux, du type 2-2-2, n'est pas confirmée.

---

## 2. Motorisation actuelle (2024-2026) : les sources divergent

| Élément | Fiche officielle [F26], 04/2026 | Profils de véhicules [P25a] et [P25b], 2025 | Génération précédente [P23] et [P18] |
|---|---|---|---|
| Essieu moteur | **ZF AxTrax 2 LF** | **ZF AxTrax AVE** (écrit « AxTrac AVE »), pont portique à plancher bas | ZF AVE 130 |
| Moteurs | Non précisé | 2 moteurs asynchrones triphasés, un sur chaque moyeu | 2 moteurs de moyeu |
| Puissance | 440 kW en pointe / 360 kW en continu | 2 × 140 kW en continu (≈ 280 kW) | 2 × 125 kW |
| Couple | 2 × 525 Nm | 2 × 495 Nm, soit 2 × 11 216 Nm à la roue | 2 × 485 Nm, soit 2 × 11 000 Nm à la roue |
| Rapport de réduction | 2 × 11,896 ; 1:22,66 après le réducteur final | i = 22,66 | |
| Tension nominale | 650 / 750 V | | |
| Essieu avant | | ZF RL 82 EC à roues indépendantes | |

**À retenir :**
- Le moteur central n'est utilisé que sur l'eIntouro (moteur central ZF) et sur les futures versions *low entry* de l'eCitaro 2028 (moteur central et essieu Mercedes RO 440). **L'eCitaro à plancher bas reste sur un essieu portique avec un moteur près de chaque moyeu.**
- La fiche officielle 04/2026 indique l'AxTrax 2 LF pour toute la gamme (K, solo, G). Electrive et Sustainable Bus, le 10/11/2026, écrivent le contraire : l'eCitaro actuel aurait un essieu d'environ 280 kW, et l'AxTrax 2 LF à 360 kW arriverait avec la génération 2028.
- Le seul engagement officiel daté sur l'AxTrax 2 LF concerne l'eCitaro G de Busworld (10/2025) : un seul essieu moteur, 360 kW en continu et 860 Nm par moteur.
- **Non tranché : on ne sait pas si l'eCitaro solo livré en 2026 est déjà équipé de l'AxTrax 2 LF.** Pour un dessin « génération actuelle », un essieu portique avec deux moteurs aux moyeux est juste dans les deux cas.
- ZF prévoyait la série de l'AxTrax 2 LF en 2025, en deux variantes de 260 et 360 kW en continu (Sustainable Bus, 09/10/2023).

### Batteries

| Élément | Valeur | Source |
|---|---|---|
| Chimie actuelle | **NMC4** (fournisseur BMZ Poland). Série à partir de 2026, même encombrement que le NMC3. | [F26], communiqué NMC4 de 2025 |
| Capacité par pack | **111 kWh** en NMC4. C'était 98 kWh en NMC3 (pack de 9 modules, 5 400 cellules). | [F26] ; [P23d] |
| Nombre de packs sur le solo | **4 à 6**, soit 444, 555 ou 666 kWh | [F26] |
| Emplacement | **2 packs à l'arrière**, dans l'ancien compartiment moteur, et **jusqu'à 4 sur le toit** | [F26] ; [P23d] |
| Exemple | 555 kWh, soit 5 packs : 3 sur le toit et 2 à l'arrière | [P25b] |
| Autonomie annoncée | jusqu'à 600 km (essai interne) | [F26] |
| État solide | Proposé auparavant en option, surtout sur l'eCitaro G (2019). Absent de la fiche 04/2026. | communiqué de 2019 sur l'eCitaro G |
| Historique | 2018 : jusqu'à 243 kWh en modules d'environ 25 kWh (6 à 10 modules). 2019 : jusqu'à 292 kWh. | [P18] ; communiqué de 2019 |

### Recharge

| Élément | Valeur | Source |
|---|---|---|
| Prise | **Combo 2 (CCS2)** de série, jusqu'à 150 kW | [F26], [P25b] |
| Emplacement des prises | Au-dessus de l'essieu avant, **à droite** (position VDV, standard d'origine). Options : au-dessus de l'essieu avant à gauche, ou à l'arrière. Deux positions au maximum par véhicule. | [P18], [P23d], [P25b] |
| Pantographe ou rails de toit | En option, jusqu'à 300 kW. Placés **au droit de l'essieu avant**. | [F26], [P18], page GB |

---

## 3. Repères de design pour la modélisation

Les descriptions viennent des communiqués Daimler [P18] et [P23d]. Les proportions chiffrées sont **calculées à partir des cotes** du §1.

**Face avant**
- Pare-brise bombé qui **monte jusque dans le toit** et englobe la girouette (afficheur de ligne).
- De chaque côté, des **barres noires prolongent la ligne vitrée vers le toit**.
- Panneau avant **noir brillant** qui porte l'étoile Mercedes d'environ 28 cm au centre. Des baguettes rayonnent à gauche et à droite de l'étoile.
- **Phares LED individuels intégrés au panneau noir.** Sur le Citaro C2, les phares sont « en amande ».
- Pare-chocs avec support de plaque intégré.
- **Montants A0 tridimensionnels**, peints couleur carrosserie.

**Ligne latérale**
- Arête de toit en profilé aluminium extrudé, en plusieurs segments. Le segment inférieur, noir brillant, **prolonge visuellement le vitrage vers le haut**. Le segment supérieur, couleur carrosserie, rejoint le montant A0 à l'avant et le montant d'angle à l'arrière.
- Ligne de vitrage du Citaro C2 abaissée de 120 mm par rapport au Citaro précédent (communiqué Citaro de 2011).
- Passages de roue en polyester renforcé de fibre de verre, en relief, qui **montent jusqu'à la ligne de vitrage** (Citaro C2).
- **Non confirmé par écrit :** la courbe montante du vitrage au-dessus de la porte 1 et la forme exacte de la dernière vitre à l'arrière. Il faut les relever sur photo.

**Toit**
- Un **« îlot » couleur carrosserie semble flotter** au-dessus des équipements de toit et ferme la membrane du toit.
- Sous l'îlot : climatisation avec pompe à chaleur de série, refroidisseur des batteries, 2 à 4 packs batterie.
- L'îlot reprend, vu de dessus, la forme du capot arrière.
- Repères de hauteur : 3 400 mm pour l'eCitaro contre 3 095 mm pour le Citaro diesel. Le toit actuel en acier fait environ 70 mm d'épaisseur.
- **Non confirmé :** la position longitudinale de l'îlot, où il commence et finit. Pour situer l'avant du toit, on a seulement le pantographe et les rails, au droit de l'essieu avant, soit 2 805 mm depuis l'avant.

**Arrière**
- Il y a une **lunette arrière**, reliée au toit par des barres noires.
- Montants d'angle arrière qui remontent en forte courbe dans l'arête de toit.
- **Feux, capot arrière et pare-chocs repris du Citaro.** Sur le Citaro C2, ce sont des feux enveloppants dans les montants d'angle, avec des pare-chocs d'angle arrondis.
- 2 packs batterie dans l'ancien compartiment moteur.
- Sustainable Bus (11/2026) écrit que la génération 2028 « supprime la tour moteur arrière ». L'eCitaro actuel en conserve donc une, mais **sa forme et son côté ne sont pas documentés**.

**Roues**
- 2 essieux : une roue avant simple, roues arrière en pneus simples 275/70 R 22,5 sur un pont portique.
- Centres de roue à 2 805 mm de l'avant et à 8 705 mm de l'avant (2 805 + 5 900).

---

## 4. Production

| Site | Rôle | Source |
|---|---|---|
| **Mannheim (D)** | Centre de compétence des bus urbains électriques, consacré entièrement aux bus urbains électriques à partir de 2024. Il produit l'eCitaro depuis 2018 et l'eCitaro fuel cell depuis 2023. C'était le seul site eCitaro jusqu'en juin 2024. | Accord direction–comité d'entreprise de 2023 ; communiqués Daimler Truck ; Electrive, 17/06/2024 |
| **Ligny-en-Barrois (F)**, Daimler Buses France (ex-EvoBus France jusqu'en 2023, site fondé en 1981, 501 à 1 000 salariés) | **Deuxième site de production de l'eCitaro.** Premier exemplaire, un **solo de 12 m**, sorti en juin 2024 (communiqué du 11/06/2024). Le site produisait jusque-là des Citaro diesel et hybrides et continue de le faire. Investissement d'environ 50 M€ d'ici 2030, avec 250 emplois supplémentaires. Les annonces de 2023 prévoyaient 12 m et 18 m, mais **la production du 18 m à Ligny n'est pas confirmée**. | Electrive, 17/06/2024 ; Sustainable Bus, 13/06/2024 ; locations.daimlertruck.com |
| **Holýšov (CZ)** | Fabriquera **toutes les caisses en blanc** pour Mannheim, Neu-Ulm et Ligny à partir de 2028. | Accord de 2023 ; Sustainable Bus |

L'étendue exacte des opérations faites à Ligny sur l'eCitaro, de la caisse au montage final, n'est pas détaillée dans les sources accessibles. Le communiqué PDF français n'a pas pu être lu.

---

## 5. Pour comparaison : le Citaro diesel

| Élément | Valeur | Source |
|---|---|---|
| Moteur | Mercedes-Benz **OM 936** (installé debout) ou **OM 936 h** (version horizontale, couchée) | [C26] ; Kuhn Fachmedien ; communiqué Daimler du 09/06/2019 |
| Architecture | 6 cylindres en ligne, **7,7 l** | [C26] |
| Puissance / couple | **220 kW (299 ch), 1 200 Nm** entre 1 200 et 1 600 tr/min. Option sur certaines variantes : 260 kW et 1 400 Nm. | [C26] ; communiqué de 2019 |
| Hybride léger (option) | Moteur électrique de **14 kW et 220 Nm** placé entre le moteur thermique et la boîte. Supercondensateurs **sur le toit**. Réseau 48 V. | communiqué de 2019 ; page Mercedes en_DE |
| Module de récupération | De série | [C26] |
| Emplacement | Dans le porte-à-faux arrière de 3 430 mm, debout ou couché selon la version. **Le côté et la tour moteur ne sont pas confirmés par écrit.** | |
| Norme | Euro VI | [C26] |
| Alésage × course | **110 × 135 mm**, identiques sur l'OM 934 (4 cylindres) | [D12] |
| Entraxe des cylindres | **128 mm**, le même que sur l'OM 934 | [D12] |
| Cylindrée calculée | 6 × π/4 × 11,0² × 13,5 cm³ ≈ **7 697 cm³** : concorde avec les 7,7 l de [C26] | calcul |
| Distribution | **2 arbres à cames en tête**, **4 soupapes par cylindre**, admission et échappement « par paires parallèles », culasse à flux transversal (admission d'un côté, échappement de l'autre) | [PT] ; [TE12] |
| Entraînement de la distribution | Cascade de pignons **à l'arrière du moteur, côté volant** | [TE12] |
| Culasse et carter | Fonte grise à graphite lamellaire (GJL) pour la culasse ; carter rigide « de la même matière », avec une structure de longerons porteurs | [D12] |
| Injection | Rampe commune jusqu'à **2 400 bar**, injections multiples | [PT] ; [TE12] |
| Suralimentation | Un ou deux étages selon la puissance ([PT]). **Jusqu'à 220 kW** : un seul turbocompresseur asymétrique à turbine double flux. Les puissances au-dessus, dont 260 kW, passent à deux étages avec deux turbocompresseurs. | [PT] ; [D12] ; [TE12] |
| Encombrement (A × B × C) | **1 057 × 680 × 1 050 mm** (longueur × largeur hors tuyau d'air de suralimentation × hauteur), « selon l'équipement » | [PT] |
| Masse DIN 70020 | **652 kg** avec un étage de suralimentation, 666 kg avec deux | [PT] |
| Gamme bus | 175, 200, 220, 235 et 260 kW à 1 800 tr/min ; 1 000 à 1 400 Nm entre 1 200 et 1 600 tr/min | [PT] |

**Non sourcé, donc estimé dans la scène 3D** (`src/three/engineScene.ts`) : rayon de manivelle (course / 2, déduit), longueur de bielle (environ 1,6 × la course, valeur usuelle des diesels de cette taille), diamètre du volant, hauteur de la culasse, forme exacte des collecteurs et position du turbocompresseur sur le flanc. L'ordre d'allumage 1-5-3-6-2-4, habituel des six-cylindres en ligne, n'est pas confirmé pour l'OM 936.

Sources du §5 :
- **[PT]** : brochure officielle « Mercedes-Benz Powertrain – Portfolio Bus Euro VI », Daimler Truck, version en ligne lue le 23/11/2026, pages 10 et 12 : https://www.powertrain.mercedes-benz-trucks.com/content/dam/powertrain/files/Bus-EURO-VI-Powertrain-EN.pdf.coredownload.pdf
- **[D12]** : communiqué Daimler du 13/03/2012 (« Stuttgart, 13 March 2012 ») sur les nouveaux moteurs moyens OM 934 et OM 936. L'original du site média Daimler n'a pas pu être lu (erreur TLS) ; le texte est repris mot pour mot par https://carsite.co.za/the-new-medium-duty-engines-from-mercedes-benz
- **[TE12]** : Transport Engineer, « Euro 6 of the best », 08/05/2012 (presse technique, sur les fiches Daimler) : https://www.transportengineer.org.uk/content/features/euro-6-of-the-best

---

## 6. Génération suivante (pour mémoire, à ne pas mélanger)

Prototype présenté le 10/11/2026, première à Busworld en 10/2027, commercialisation en 2028.
- Plateforme électrique dédiée, flancs droits, **plus de tour arrière**.
- Toit sandwich d'environ 42 mm.
- Batteries LFP en packs d'environ 50 kWh : 4 sous le plancher entre les essieux et jusqu'à 8 sur le toit, de 300 à 600 kWh.
- AxTrax 2 LF jusqu'à 360 kW.
- Longueurs : 10,63, 12,13 et 18,13 m.

Sources : Sustainable Bus et Electrive, 10/11/2026.

---

## 7. Images et dessins officiels à consulter (non téléchargés)

- Vignettes officielles de la fiche Facts, probablement des silhouettes de profil (contenu non vérifié) :
  - https://www.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/vignetten/ecitaro-2-doors-pdf-vignette.jpg
  - https://www.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/vignetten/ecitaro-3-doors-pdf-vignette.jpg
  - https://www.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/mb-ecitaro-print-to-pdf.jpg
- Fiches PDF officielles, à ouvrir dans un navigateur. Le PDF lu par l'outil est une image et n'a pas pu être exploité. La fiche TI devrait contenir le dessin coté A–F avec les portes.
  - https://www.mercedes-benz-bus.com/lu/de/models/ecitaro/facts-ecitaro.pdf
  - https://www.mercedes-benz-bus.com/gb/en/models/ecitaro/facts-ecitaro-rl.pdf
  - https://showroom.mercedes-benz-bus.com/content/dam/mb/models/ecitaro/facts-ecitaro/facts-ecitaro-int-en.pdf (certificat TLS invalide pour l'outil)
- Fiche d'exploitant avec photo ou plan : https://www.bvb.ch/wp-content/bvb/Dokumente/Bilder_Fahrzeugpark/pdf/E/eCitaro.pdf
- Photos de presse : les communiqués Daimler Truck cités en §8 ont chacun une galerie (vues ¾ avant et arrière).

---

## 8. URL des sources

- [F26] https://www.mercedes-benz-bus.com/int/en/models/ecitaro/facts-ecitaro.html
- [C26] https://www.mercedes-benz-bus.com/int/en/models/citaro/facts-citaro.html
- [P25a] https://www.daimlertruck.com/en/newsroom/pressrelease/vehicle-profile-the-mercedes-benz-ecitaro-exhibition-vehicle-technical-data-53100234
- [P25b] https://www.daimlertruck.com/en/newsroom/pressrelease/vehicle-profile-mercedes-benz-ecitaro-with-nmc4-batteries-53205052
- eCitaro G AxTrax 2 LF (02/10/2025) : https://www.daimlertruck.com/en/newsroom/pressrelease/vehicle-profile-mercedes-benz-ecitaro-g-for-test-drives-53205054
- NMC4 (2025) : https://www.daimlertruck.com/en/newsroom/pressrelease/the-new-nmc4-battery-in-the-mercedes-benz-ecitaro-more-capacity-longer-service-life-53205023
- [P23] https://www.daimlertruck.com/en/newsroom/pressrelease/technical-data-for-mercedes-benz-ecitaro-with-nmc-3-batteries-52203319
- [P23d] https://www.daimlertruck.com/en/newsroom/pressrelease/the-locally-emission-free-all-electric-city-bus-combines-innovative-technologies-with-the-genes-of-the-citaro-which-has-proven-itself-thousands-of-times-over-52203312
- [P18] https://daimlertruck.com/en/newsroom/pressrelease/world-premiere-the-revolutionary-new-mercedes-benz-ecitaro-40675765
- Citaro, eCitaro et OM 936 (09/06/2019) : https://www.daimlertruck.com/en/newsroom/pressrelease/the-pace-maker-in-environmental-protection-economy-and-technology-mercedes-benz-citaro-and-ecitaro-offer-tailor-made-low-emission-and-locally-emission-free-drive-technologies-respectively-43508181
- Page eCitaro GB (recharge, NMC4) : https://mercedes-benz-bus.com/en_GB/models/ecitaro/facts.html
- Design du Citaro C2 (2011, copie de communiqué) : https://automotivedesignguide.blogspot.com/2011/05/new-mercedes-benz-citaro-in-detail_380.html
- OM 936 debout ou couché : https://regiotrans.kuhn-fachmedien.de/wp-content/themes/kuhn-magazin/pdf/mpdf/kuhn/print-post.php?postid=485
- Génération 2028 : https://www.sustainable-bus.com/news/mercedes-ecitaro-new-generation-launch/ et https://electrive.com/2026/11/10/mercedes-ecitaro-to-switch-to-a-dedicated-electric-platform-from-2028
- ZF AxTrax 2 LF (09/10/2023) : https://www.sustainable-bus.com/news/zf-axtrax-2-new-generation-launch-busworld/
- Ligny : https://www.electrive.net/2024/06/17/daimler-buses-baut-den-ecitaro-jetzt-auch-in-frankreich/ ; https://sustainable-bus.com/news/france-made-ecitaro-electric-bus-mercedes-ligny-en-barrois ; https://locations.daimlertruck.com/en/career/locations/detail/ligny-en-barrois-daimler-buses-france-
- Accord sur le réseau de production (2023) : https://www.daimlertruck.com/newsroom/pressemitteilung/geschaeftsfuehrung-von-daimler-buses-und-gesamtbetriebsrat-vereinbaren-zukunftsbild-zur-sicherung-der-wettbewerbsfaehigkeit-und-der-deutschen-standorte-52169608
