# Textes du portfolio : répétitions et proposition

Proposition seulement : `src/content.ts` n’est pas modifié. Les textes proposés sont écrits avec des espaces simples ; le script `scripts/typo-fr.mjs` posera les insécables.

Règle suivie : chaque fait est dit en entier une seule fois, à sa place naturelle (postes dans le parcours, diplômes dans la formation, l’essentiel une fois dans le hero, le chemin dans « À propos »). Ailleurs : une allusion, ou rien.

---

## 1. Inventaire des répétitions

Les extraits viennent du français ; l’anglais a les mêmes répétitions aux mêmes clés (`en.…`). `fr.meta.description` n’est pas affiché sur la page (balise SEO) : je le cite pour mémoire et je n’y touche pas.

### Master MAALSI, CESI Nancy, 2025 — 2027

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.hero.lead` | Hero, paragraphe | « En parallèle, je prépare un master au CESI de Nancy. » |
| `fr.hero.facts[1]` | Hero, cartouche | « En parallèle · Master MAALSI · CESI Nancy · 2025 — 2027 » |
| `fr.about.stages[2].text` | À propos, étape 3 | « Le master MAALSI, commencé en 2025 au CESI de Nancy, avance en même temps. » |
| `fr.education.intro` | Formation, intro | « Du bac pro au master, tout s’est passé à Nancy […] puis le CESI. » |
| `diplomasFr[0]` | Formation, fiche | fiche complète (place naturelle) |

Dans le hero, le master est dit deux fois à quelques centimètres d’écart (paragraphe et cartouche), avec le même mot « En parallèle ».

### Daimler Buses France, intranet Symfony / React, 1 200 salariés, depuis 2024

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.hero.lead` | Hero, paragraphe | « chez Daimler Buses France, où je construis depuis 2024 un intranet Symfony / React dont se servent plus de 1 200 salariés » |
| `fr.hero.facts[0]` | Hero, cartouche | « En ce moment · Développeur web · Daimler Buses France » |
| `fr.hero.facts[2]` | Hero, cartouche | « Au quotidien · Symfony, React · TypeScript, PHP » |
| `fr.hero.annotation` | Hero, note manuscrite | « Symfony · React » |
| `fr.about.stages[2].text` | À propos, étape 3 | « Depuis septembre 2024, je développe l’intranet de Daimler Buses France à Ligny-en-Barrois, en Symfony et React. » |
| `fr.experience.intro` | Parcours, intro | « puis l’intranet de Daimler Buses France » |
| `jobsFr[0]` | Parcours, fiche | fiche complète (place naturelle) |
| `fr.skills.groups[0].label` | Compétences, tableau | « Tous les jours, chez Daimler Buses » + Symfony, React, TypeScript, PHP (même liste que `hero.facts[2]`) |
| `fr.meta.description` | non affiché | « développeur full-stack chez Daimler Buses France : un intranet Symfony / React… » |

### Premières missions (site WordPress du lycée, Kuehne + Nagel, Nexiom)

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.about.stages[1].text` | À propos, étape 2 | « un site WordPress, un portail développeurs chez Kuehne + Nagel, un outil d’analyse en C# chez Nexiom » |
| `fr.experience.intro` | Parcours, intro | « Ma première mission, en 2022 : un site WordPress pour mon ancien lycée. Depuis : un portail développeurs chez Kuehne + Nagel, un outil d’analyse chez Nexiom […] » |
| `jobsFr[1]`, `jobsFr[2]`, `jobsFr[4]` | Parcours, fiches | fiches complètes (place naturelle) |
| `fr.skills.people[0].text` | Compétences, côté humain | « Chez Kuehne + Nagel comme chez Nexiom, j’ai commencé par le cahier des charges ou les spécifications » (reprend `jobsFr[1]` et `jobsFr[2]`) |
| `fr.skills.people[1].text` | Compétences, côté humain | « Le site du lycée Jean Prouvé, je l’ai présenté devant son corps enseignant. » (reprend `jobsFr[4]`) |

L’intro du parcours répète la liste des fiches qui s’affichent juste en dessous.

### Lidl, trois ans, en parallèle des études

| Clé | Section affichée | Extrait |
|---|---|---|
| `jobsFr[3].summary` | Parcours, fiche | « en parallèle de mes études […] trois ans de terrain : ça aide à comprendre ceux pour qui j’écris des logiciels » |
| `fr.experience.intro` | Parcours, intro | « pendant trois ans, la préparation de commandes chez Lidl » |
| `fr.skills.people[2].text` | Compétences, côté humain | « Trois ans de préparation de commandes chez Lidl, en parallèle de mes études : le travail en équipe, et le point de vue de celui qui utilise l’outil » |

### Diplômes (bac pro, BTS SIO, licence CDA) et écoles

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.about.stages[0].text` | À propos, étape 1 | « un bac pro Systèmes Numériques au lycée Jean Prouvé, mention très bien, entre Cisco, VLAN et Arduino » (copie de la fiche `diplomasFr[3]`) |
| `fr.about.stages[1].text` | À propos, étape 2 | « un BTS SIO au lycée Frédéric Chopin, une licence de concepteur développeur au CESI » |
| `fr.education.intro` | Formation, intro | « lycée Jean Prouvé, lycée Frédéric Chopin, puis le CESI » (les écoles de chaque fiche) |
| `diplomasFr[0..3]` | Formation, fiches | fiches complètes (place naturelle) |

### Nancy (11 occurrences)

`fr.hero.lead`, `fr.hero.facts[1].detail`, `fr.about.stages[2].text`, `fr.education.intro`, les quatre `diplomasFr[*].school` (« CESI, Nancy », « Lycée Frédéric Chopin, Nancy », « Lycée Jean Prouvé, Nancy »), `jobsFr[1].location`, `jobsFr[4].location`, `fr.contact.location`. La section Formation dit « Nancy » cinq fois (intro + quatre fiches).

### Objectif : être au contact des clients et des utilisateurs

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.about.stages[3].text` | À propos, étape 4 | « Ce que je cherche maintenant : être davantage au contact des clients et des utilisateurs, là où se décide ce qu’on construit. » |
| `fr.skills.peopleIntro` | Compétences, côté humain | « être de plus en plus au contact des clients et des utilisateurs, pour comprendre le besoin à la source plutôt que de le recevoir déjà traduit » |

### Jeux, agents IA, « à côté »

| Clé | Section affichée | Extrait |
|---|---|---|
| `fr.hero.roles[2]` | Hero, sous le nom | « Créateur de jeux » (décision de Timothée : on garde) |
| `fr.hero.lead` | Hero, paragraphe | « Et à côté, je fais des jeux. » |
| `fr.about.stages[3].text` | À propos, étape 4 | « À côté, je fais des jeux et je dirige des équipes d’agents IA. » |
| `fr.ai.intro` | IA, intro | « je dirige des équipes d’agents » (place naturelle des agents) |

« Développeur full-stack » est aussi dit deux fois dans le hero : `hero.roles[0]` et le début de `hero.lead`.

### Petites reprises de mots

- « en même temps » : `fr.about.stages[2].text` (« avance en même temps ») et `fr.skills.people[3].text` (« j’avance en même temps »).
- « en parallèle » : `fr.hero.lead`, `fr.hero.facts[1].label`, `jobsFr[3].summary`, `fr.skills.people[2].text`.

---

## 2. Changements proposés

23 chaînes en français, 23 en anglais. Tout ce qui n’est pas listé reste tel quel.

### Hero

**`hero.lead`**
- FR actuel : Je suis développeur full-stack chez Daimler Buses France, où je construis depuis 2024 un intranet Symfony / React dont se servent plus de 1 200 salariés. En parallèle, je prépare un master au CESI de Nancy. Et à côté, je fais des jeux.
- FR proposé : Je construis l’intranet de Daimler Buses France, dont se servent plus de 1 200 salariés.
- EN actuel : I’m a full-stack developer at Daimler Buses France, where since 2024 I have been building a Symfony / React intranet used by more than 1,200 employees. Alongside the job I am studying for a master’s degree at CESI Nancy. And on the side, I make games.
- EN proposé : I build the Daimler Buses France intranet, used by more than 1,200 employees.
- Raison : « full-stack » et « jeux » sont dans la ligne des rôles juste au-dessus ; le master, la pile et la date sont dans le cartouche. Le paragraphe garde ce que le cartouche ne dit pas : l’entreprise, l’intranet et ses 1 200 utilisateurs.

**`hero.facts[0].detail`**
- FR actuel : Daimler Buses France
- FR proposé : depuis sept. 2024
- EN actuel : Daimler Buses France
- EN proposé : since Sept. 2024
- Raison : l’entreprise est déjà dans le paragraphe ; la date de début, retirée du paragraphe, trouve sa place ici (même format que la fiche du parcours).

### À propos

**`about.intro`**
- FR actuel : Le bus se dessine pendant que vous faites défiler la page. Mon parcours s’est construit dans le même ordre.
- FR proposé : Ce portrait se dessine en quatre calques pendant que vous faites défiler la page. Mon parcours s’est construit dans le même ordre.
- EN actuel : The bus draws itself as you scroll. My path was built in the same order.
- EN proposé : This portrait draws itself in four layers as you scroll. My path was built in the same order.
- Raison : le bus est remplacé par le portrait.

**Les quatre notes d’étape (`about.stages[0..3].note`)**

Chaque note sert de titre à l’étape du parcours et de nom au calque du portrait qui s’allume dans la légende.

| Clé | FR actuel | FR proposé | EN actuel | EN proposé | Calque du portrait | Étape du parcours |
|---|---|---|---|---|---|---|
| `about.stages[0].note` | le plan | l’esquisse | the plan | the sketch | tracés de construction | le point de départ : réseau et matériel |
| `about.stages[1].note` | le volume | le contour | the volume | the outline | contour | le métier prend forme : études et premières missions |
| `about.stages[2].note` | les détails | la profondeur | the details | the depth | ombres hachurées | le poste actuel et le master |
| `about.stages[3].note` | le rendu | le regard | the render | the gaze | la photo | ce que je fais à côté et ce que je cherche maintenant |

- Raison : « le plan, le volume, les détails, le rendu » décrivaient la construction du bus. Les nouvelles notes nomment les calques d’un portrait au crayon et se lisent aussi comme les étapes d’un chemin. « le regard » annonce la dernière phrase de l’étape (« ce que je cherche maintenant »). Les quatre notes restent différentes entre elles (elles servent de clé React dans `About.tsx`).

**`about.stages[0].text`**
- FR actuel : Je suis arrivé au développement par le réseau et le matériel : un bac pro Systèmes Numériques au lycée Jean Prouvé, mention très bien, entre Cisco, VLAN et Arduino.
- FR proposé : Je suis arrivé au développement par le réseau et le matériel, en bac pro.
- EN actuel : I came to software through networks and hardware: a vocational baccalauréat in digital systems at Lycée Jean Prouvé, with highest honours, among Cisco, VLANs and Arduino.
- EN proposé : I came to software through networks and hardware, in a vocational baccalauréat.
- Raison : l’intitulé, le lycée, la mention et Cisco / VLAN / Arduino sont mot pour mot dans la fiche Formation. L’étape garde le chemin : par où je suis arrivé.

**`about.stages[1].text`**
- FR actuel : Puis le logiciel : un BTS SIO au lycée Frédéric Chopin, une licence de concepteur développeur au CESI, et mes premières missions — un site WordPress, un portail développeurs chez Kuehne + Nagel, un outil d’analyse en C# chez Nexiom.
- FR proposé : Puis le logiciel : un BTS, une licence, et mes premières missions, de 2022 à 2024.
- EN actuel : Then software: a BTS SIO at Lycée Frédéric Chopin, a bachelor’s degree in application development at CESI, and my first assignments — a WordPress site, a developer portal at Kuehne + Nagel, a C# analysis tool at Nexiom.
- EN proposé : Then software: a BTS, a bachelor’s degree, and my first assignments, from 2022 to 2024.
- Raison : écoles et missions sont détaillées dans Formation et dans Parcours. « De 2022 à 2024 » vient des dates des fiches (lycée Jean Prouvé, mai 2022 ; Nexiom, jusqu’en avril 2024).

**`about.stages[2].text`**
- FR actuel : Depuis septembre 2024, je développe l’intranet de Daimler Buses France à Ligny-en-Barrois, en Symfony et React. Le master MAALSI, commencé en 2025 au CESI de Nancy, avance en même temps.
- FR proposé : Depuis 2024, je travaille chez Daimler Buses France, et je prépare un master.
- EN actuel : Since September 2024 I have been building the Daimler Buses France intranet in Ligny-en-Barrois, with Symfony and React. The MAALSI master’s degree, started in 2025 at CESI Nancy, runs alongside it.
- EN proposé : Since 2024 I have been working at Daimler Buses France, and I am studying for a master’s degree.
- Raison : l’intranet, la pile et Ligny-en-Barrois sont dans la fiche du parcours ; MAALSI, le CESI, Nancy et 2025 dans le cartouche et la fiche Formation. Retire aussi « avance en même temps », repris dans « Mener de front ».

**`about.stages[3].text`**
- FR actuel : À côté, je fais des jeux et je dirige des équipes d’agents IA. Ce que je cherche maintenant : être davantage au contact des clients et des utilisateurs, là où se décide ce qu’on construit.
- FR proposé : À côté, je fais des jeux et je dirige des équipes d’agents IA. Ce que je cherche maintenant : être davantage au contact des clients et des utilisateurs, pour comprendre le besoin à la source plutôt que de le recevoir déjà traduit.
- EN actuel : On the side, I make games and run teams of AI agents. What I am looking for now: more contact with clients and users, where the decisions about what to build are made.
- EN proposé : On the side, I make games and run teams of AI agents. What I am looking for now: more contact with clients and users, to understand the need at its source rather than receive it already translated.
- Raison : l’objectif était dit deux fois (ici et dans « Côté humain ») avec deux raisons différentes. Il est dit en entier ici, à sa place dans le chemin ; la raison retenue est celle de `skills.peopleIntro`, plus précise. « Là où se décide ce qu’on construit » disparaît comme formulation, l’idée reste.

**`about.sketchLabel`** (texte lu par les lecteurs d’écran sur le dessin)
- FR actuel : Dessin technique d’un bus qui se construit en quatre étapes : le plan, le volume, les détails, le rendu
- FR proposé : Portrait de Timothée Maire qui se dessine en quatre calques : tracés de construction, contour, ombres hachurées, puis la photo
- EN actuel : Technical drawing of a bus built in four steps: the plan, the volume, the details, the render
- EN proposé : Portrait of Timothée Maire drawn in four layers: construction lines, outline, hatched shading, then the photo
- Raison : décrit le nouveau dessin. Les noms des calques y sont littéraux (pas les notes imagées), pour qu’un lecteur d’écran sache ce qui se dessine.

**`about.portraitAlt`**
- FR actuel : Portrait de Timothée Maire
- FR proposé : Photo de Timothée Maire, de face, avec des lunettes, une barbe courte et un manteau sombre
- EN actuel : Portrait of Timothée Maire
- EN proposé : Photo of Timothée Maire, facing the camera, with glasses, a short beard and a dark coat
- Raison : « Portrait de Timothée Maire » répète le texte de `sketchLabel` ; le texte alternatif décrit ce que montre la photo (`public/portrait-520.webp`).

**`about.portraitCaption`**
- FR actuel : Timothée Maire · Grand Est
- FR proposé : Timothée Maire
- EN actuel : Timothée Maire · Grand Est
- EN proposé : Timothée Maire
- Raison : « Grand Est » est déjà dans le contact (« Grand Est, France · Nancy et Ligny-en-Barrois »).

### Parcours

**`experience.intro`**
- FR actuel : Ma première mission, en 2022 : un site WordPress pour mon ancien lycée. Depuis : un portail développeurs chez Kuehne + Nagel, un outil d’analyse chez Nexiom, puis l’intranet de Daimler Buses France. Et, pendant trois ans, la préparation de commandes chez Lidl.
- FR proposé : Quatre postes de développeur depuis 2022, et un emploi en logistique pendant mes études.
- EN actuel : My first assignment, in 2022: a WordPress site for my former school. Since then: a developer portal at Kuehne + Nagel, an analysis tool at Nexiom, then the Daimler Buses France intranet. And, for three years, picking orders at Lidl.
- EN proposé : Four developer jobs since 2022, and a logistics job alongside my studies.
- Raison : l’intro énumérait les cinq fiches affichées juste en dessous. Elle n’en garde que le compte (lycée Jean Prouvé, Kuehne + Nagel, Nexiom, Daimler ; Lidl à part).

### Compétences

**`skills.groups[0].label`**
- FR actuel : Tous les jours, chez Daimler Buses
- FR proposé : Tous les jours, au travail
- EN actuel : Every day, at Daimler Buses
- EN proposé : Every day, at work
- Raison : le tableau range les outils par contexte ; l’employeur est dit dans le hero et le parcours. « Au travail » s’oppose à la ligne suivante, « Sur mes projets ».

**`skills.peopleIntro`**
- FR actuel : C’est la direction que je veux donner à la suite : être de plus en plus au contact des clients et des utilisateurs, pour comprendre le besoin à la source plutôt que de le recevoir déjà traduit.
- FR proposé : Ce qui me servira pour travailler davantage avec les clients et les utilisateurs :
- EN actuel : This is where I want to go next: more and more contact with clients and users, to understand the need at its source rather than receive it already translated.
- EN proposé : What will help me work more closely with clients and users:
- Raison : l’objectif et sa raison sont dits en entier dans « À propos » (étape 4) ; ici, une allusion qui introduit la liste.

**`skills.people[2].text`** (« Connaître le terrain »)
- FR actuel : Trois ans de préparation de commandes chez Lidl, en parallèle de mes études : le travail en équipe, et le point de vue de celui qui utilise l’outil plutôt que de celui qui le conçoit.
- FR proposé : Chez Lidl : le travail en équipe, et le point de vue de celui qui utilise l’outil plutôt que de celui qui le conçoit.
- EN actuel : Three years picking orders at Lidl alongside my studies: teamwork, and the point of view of the person who uses the tool rather than the one who designs it.
- EN proposé : At Lidl: teamwork, and the point of view of the person who uses the tool rather than the one who designs it.
- Raison : la durée, le poste et « en parallèle de mes études » sont dans la fiche Lidl du parcours ; la carte garde ce qu’elle seule dit (ce que j’en ai appris).

### Formation

**`education.intro`**
- FR actuel : Du bac pro au master, tout s’est passé à Nancy : lycée Jean Prouvé, lycée Frédéric Chopin, puis le CESI.
- FR proposé : Du bac pro au master, tout s’est passé à Nancy.
- EN actuel : From the vocational baccalauréat to the master’s, it all happened in Nancy: Lycée Jean Prouvé, Lycée Frédéric Chopin, then CESI.
- EN proposé : From the vocational baccalauréat to the master’s, it all happened in Nancy.
- Raison : chaque école est sur sa fiche juste en dessous.

**`diplomas[*].school`** (quatre chaînes par langue)

| Clé | Actuel (FR et EN) | Proposé (FR et EN) |
|---|---|---|
| `diplomasFr[0].school` / `diplomasEn[0].school` | CESI, Nancy | CESI |
| `diplomasFr[1].school` / `diplomasEn[1].school` | CESI, Nancy | CESI |
| `diplomasFr[2].school` / `diplomasEn[2].school` | Lycée Frédéric Chopin, Nancy | Lycée Frédéric Chopin |
| `diplomasFr[3].school` / `diplomasEn[3].school` | Lycée Jean Prouvé, Nancy | Lycée Jean Prouvé |

- Raison : l’intro dit une fois que tout s’est passé à Nancy ; la section passe de cinq « Nancy » à un.

### Bilan des comptages (français, texte affiché)

| Mot | Avant | Après |
|---|---|---|
| Nancy | 11 | 5 (cartouche du hero, intro Formation, deux lieux de fiches Parcours, contact) |
| Master / MAALSI | 5 endroits | 3 (cartouche du hero, allusion dans À propos, fiche) + l’intro Formation |
| CESI | 7 | 3 (cartouche du hero, deux fiches Formation) |
| Daimler | 7 (dont meta) | 4 (dont meta) : paragraphe du hero, À propos, fiche |
| Symfony | 8 (dont meta) | 6 (dont meta) : cartouche, note manuscrite, fiche et ses tags, tableau des compétences |
| intranet | 5 (dont meta) | 3 (dont meta) : paragraphe du hero, fiche |
| WordPress | 5 | 3 : fiche, tags de la fiche, tableau des compétences |

Aucun fait ne disparaît du site : chaque élément retiré d’une chaîne reste en entier dans la fiche, le cartouche ou la section indiqués dans la raison.

---

## 3. À valider par Timothée

1. **Le paragraphe du hero devient une seule phrase.** Il ne dit plus « développeur full-stack » ni « je fais des jeux » parce que la ligne des rôles le dit juste au-dessus. Si une seule phrase paraît trop sèche, on peut garder « Et à côté, je fais des jeux. » : c’est la seule entorse que je recommanderais.
2. **Daimler dans le paragraphe, la date dans le cartouche.** L’autre option : garder « Daimler Buses France » dans le cartouche et écrire « Depuis 2024, je construis un intranet dont se servent plus de 1 200 salariés. » Je préfère nommer l’entreprise dans la phrase que tout le monde lit.
3. **Les notes d’étape.** « le regard / the gaze » est le choix le plus discutable. Autre paire : « la ressemblance / the likeness », terme classique du portrait, mais moins lié à la phrase « ce que je cherche maintenant ». Pour la première note, « les tracés / the construction lines » est plus littéral mais ne marche pas comme étape de parcours.
4. **« À propos » ne dit toujours pas pourquoi.** Le brief demande le chemin (pourquoi, comment), mais je n’ai pas les faits : pourquoi passer du réseau au logiciel après le bac pro ? Pourquoi Daimler Buses ? Pourquoi un master en architecture ? Je n’ai rien écrit à leur place. Une phrase de Timothée sur l’un de ces points donnerait de la matière aux étapes 1 à 3, qui sont maintenant très courtes.
5. **Les fiches Formation sans « Nancy ».** Huit chaînes changent pour cela. Si une fiche doit rester lisible seule (capture, impression), on peut garder les fiches telles quelles et ne changer que l’intro.
6. **« Écouter avant de coder » et « Présenter » (`skills.people[0]`, `skills.people[1]`) ne changent pas**, alors qu’ils redisent les fiches Kuehne + Nagel, Nexiom et lycée Jean Prouvé. Je les garde parce que la preuve tient en une proposition. Si vous voulez aller au bout de la règle :
   - FR « Présenter » : « Expliquer un outil à des gens dont ce n’est pas le métier fait partie du travail : je l’ai fait dès ma première mission. » / EN : « Explaining a tool to people whose job is something else is part of the work: I did it on my very first assignment. » (Attention : le lycée n’est pas « mon premier site », qui est web1 en 2020 ; c’est ma première mission.)
   - « Écouter avant de coder » : je n’ai pas de formulation plus courte qui garde les deux noms sans redire la fiche.
7. **Lidl.** La fiche du parcours garde « ça aide à comprendre ceux pour qui j’écris des logiciels aujourd’hui », proche de la leçon de « Connaître le terrain ». Je ne l’ai pas retirée : sur la fiche, c’est ce qui explique pourquoi un poste sans code figure dans le parcours.
8. **Deux portraits dans la même section ?** `About.tsx` affiche déjà la photo dans la colonne de texte (`figure.portrait`). Si le dessin en quatre calques finit sur la même photo, elle apparaît deux fois. À trancher dans la mise en page ; les textes proposés marchent dans les deux cas (`portraitAlt` pour la photo, `sketchLabel` pour le dessin).
9. **Le texte alternatif décrit l’apparence** (lunettes, barbe courte, manteau sombre), lue sur `public/portrait-520.webp`. Si la photo change, il faudra le revoir. « Photo de Timothée Maire » seul reste possible.
10. **Laissés tels quels volontairement :** `meta.description` (non affichée, sert au référencement), `hero.annotation` (« Symfony · React », note manuscrite masquée aux lecteurs d’écran), `hero.facts[2]` (même liste que le tableau des compétences, mais c’est l’essentiel du hero), `hero.sketchLabel` (le hero garde son bus 3D), et la phrase sur les agents de l’étape 4, qui reste une allusion à la section IA.
11. **« Quatre postes de développeur »** (intro du parcours) est un compte fait d’après les intitulés des fiches : Développeur web (lycée Jean Prouvé), Développeur (Kuehne + Nagel), Développeur d’applications (Nexiom), Développeur web (Daimler). Pour l’anglais, « jobs » couvre aussi les missions courtes ; si « postes » paraît trop fort pour une mission de deux mois, « Quatre missions de développement » marche aussi.

## 4. Arbitrages après relecture A2A, et nouvelles chaînes

Ces décisions **remplacent** les propositions du §2 quand les deux se contredisent. Tout le reste du §2 s'applique tel quel.

### Remplacements du §2

| Clé | FR retenu | EN retenu |
|---|---|---|
| `about.stages[3].note` | la ressemblance | the likeness |
| `about.stages[0].text` | Je suis arrivé au développement par le réseau et le matériel : un bac pro, entre Cisco, VLAN et Arduino. | I came to software through networks and hardware: a vocational baccalauréat, among Cisco, VLANs and Arduino. |
| `about.stages[1].text` | Puis le logiciel : un BTS, une licence, et mes premières missions, dès 2022. | Then software: a BTS, a bachelor’s degree, and my first assignments, from 2022. |
| `about.stages[2].text` | Depuis 2024, je travaille chez Daimler Buses France, à Ligny-en-Barrois, où est produit l’eCitaro dessiné en haut de page. Je prépare aussi un master. | Since 2024 I have been working at Daimler Buses France in Ligny-en-Barrois, where the eCitaro drawn at the top of this page is built. I am also studying for a master’s degree. |
| `experience.intro` | Quatre missions de développement depuis 2022, et un emploi en logistique pendant mes études. | Four development assignments since 2022, and a logistics job during my studies. |
| `about.sketchLabel` | supprimée (le SVG des traits est décoratif ; la photo porte le texte alternatif) | supprimée |

**Exceptions assumées** à la règle « une seule fois » :
- « entre Cisco, VLAN et Arduino » reprend la fiche du bac pro, pour que l'étape 1 garde un détail concret ;
- « Ligny-en-Barrois » revient dans « À propos », pour dire le lien avec l'eCitaro du hero.

Le tableau des comptages du §2 est donc à corriger : Daimler et Ligny gagnent une occurrence chacun.

### Nouvelles chaînes : le bus eCitaro (hero)

| Clé | FR | EN |
|---|---|---|
| `hero.modelNote` | ['Mercedes-Benz eCitaro', 'en 3D, avec Three.js'] | ['Mercedes-Benz eCitaro', 'in 3D, with Three.js'] |
| `hero.canvasLabel` | Mercedes-Benz eCitaro en fil de fer, en 3D : 12 135 mm de long, 2 550 mm de large, 3 400 mm de haut. Il tourne lentement et suit la souris. | Wireframe Mercedes-Benz eCitaro in 3D: 12,135 mm long, 2,550 mm wide, 3,400 mm high. It turns slowly and follows the mouse. |
| `hero.sketchLabel` | Dessin technique d’un Mercedes-Benz eCitaro de 12 mètres, avec ses cotes | Technical drawing of a 12-metre Mercedes-Benz eCitaro, with its dimensions |
| `hero.dims` | { length: '12 135 mm', width: '2 550 mm', height: '3 400 mm' } | { length: '12,135 mm', width: '2,550 mm', height: '3,400 mm' } |
| `hero.source` (nouvelle) | D’après la fiche constructeur (04/2026) · dessin personnel | After the manufacturer’s data sheet (04/2026) · my own drawing |
| `hero.partsTitle` (nouvelle) | Dans la vue éclatée | In the exploded view |
| `hero.parts` (nouvelle, liste) | voir ci-dessous | voir ci-dessous |

`hero.parts`. Le champ `tag` est le texte court du sprite 3D ; `name` et `detail` forment la liste DOM.

| FR `tag` | FR `name` | FR `detail` | EN `tag` | EN `name` | EN `detail` |
|---|---|---|---|---|---|
| Batteries NMC4 · 111 kWh par pack | Batteries NMC4 | 111 kWh par pack. Ici, 3 packs sur le toit et 2 à l’arrière ; 4 à 6 selon la configuration. | NMC4 batteries · 111 kWh per pack | NMC4 batteries | 111 kWh per pack. Shown here: 3 packs on the roof and 2 at the rear; 4 to 6 depending on the configuration. |
| Essieu portique ZF · un moteur par roue | Essieu portique ZF | L’essieu arrière porte un moteur électrique près de chaque roue. | ZF portal axle · one motor per wheel | ZF portal axle | The rear axle carries an electric motor next to each wheel. |
| Prise CCS2 | Prise de recharge CCS2 | Au-dessus de la roue avant droite. | CCS2 socket | CCS2 charging socket | Above the front right wheel. |

L'ancienne note « Modèle 3D (Three.js) · un bus, évidemment » disparaît.

### Nouvelles chaînes : la carte du moteur OM 936 (`projects.playground.engine`)

| Clé | FR | EN |
|---|---|---|
| `name` | Moteur OM 936 | OM 936 engine |
| `tech` | Three.js · WebGL | Three.js · WebGL |
| `description` | Le moteur du Citaro diesel : six cylindres en ligne, 7,7 litres, 220 kW et 1 200 Nm. Dans l’eCitaro, deux packs de batteries prennent sa place ; les moteurs sont dans l’essieu. | The engine of the diesel Citaro: six cylinders in line, 7.7 litres, 220 kW and 1,200 Nm. In the eCitaro, two battery packs take its place; the motors sit in the axle. |
| `explode` | Éclater le moteur | Explode the engine |
| `assemble` | Remonter le moteur | Reassemble the engine |
| `canvasLabel` | Scène 3D : le moteur diesel OM 936 du Citaro en fil de fer, à faire pivoter | 3D scene: the diesel OM 936 engine of the Citaro in wireframe, which you can rotate |
| `hint` | Glisser pour faire pivoter | Drag to rotate |
| `loading` | Chargement de la scène… | Loading the scene… |
| `unsupported` | WebGL n’est pas disponible sur cet appareil. | WebGL is not available on this device. |
| `source` | Schéma de principe d’après la fiche constructeur (04/2026) | Schematic after the manufacturer’s data sheet (04/2026) |
