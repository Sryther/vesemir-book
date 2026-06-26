// ============================================================================
//  CONTENU DU JEU — tout ce qui se modifie facilement est ici.
//  Remplace les valeurs entre /* ... */ par les vraies informations du concert.
// ============================================================================

export const CONFIG = {
  // --- Faits réels du cadeau (à compléter) ---
  recipientName: /* PRÉNOM */ 'Thibault',
  // Si Vesemir s'adresse au/à la destinataire par son nom, mets addressByName: true.
  addressByName: false,

  // Image affichée sur la couverture. Dépose ton fichier dans le dossier /public
  // (à la racine du projet) et indique son nom ici. Mets '' pour n'afficher aucune image.
  coverImage: 'tw_chair_bg.svg',

  // Musique d'ambiance jouée en fond (fichier dans /public). Mets '' pour la désactiver.
  music: 'The Witcher 3 Wild Hunt - The Vagabond Music Extended.mp3',

  // Effet sonore joué à chaque bonne réponse (fichier dans /public). '' pour désactiver.
  sfxCorrect: 'witcher-3-level.mp3',
  // Effet sonore joué quand un chapitre entier est terminé (au lieu de sfxCorrect).
  sfxComplete: 'witcher-3-completed.mp3',

  concert: {
    title: /* TITRE EXACT */ 'Celebrating 10 Years of The Witcher 3: Wild Hunt',
    date: /* DATE */ '21/11/2026',
    city: /* VILLE */ 'Zurich',
    venue: /* SALLE */ 'The Hall',
    seats: 2,
  },
}

// ----------------------------------------------------------------------------
//  LES CINQ POTIONS
//  - word      : mot à deviner au Motus (sans accents, en MAJUSCULES)
//  - display   : nom complet affiché de la potion
//  - story     : le récit de Vesemir (l'indice de lore est tissé dedans)
//  - hint      : l'indice sur le cadeau, gravé une fois la potion nommée
// ----------------------------------------------------------------------------

export const POTIONS = [
  {
    id: 'chat',
    word: 'CHAT',
    display: 'Œil-de-chat',
    color: '#38a501',
    clue: "Quand la dernière flamme s'éteint, un seul chasseur garde son royaume : prête-lui ses yeux, et la nuit te sera rendue.",
    story: [
      "Avant même de savoir tenir une lame, mon élève, chaque louveteau de Kaer Morhen apprend cette décoction-là. Sur la langue, elle a le froid de l'eau de roche ; dans le sang, elle a la patience de la bête qui veille. On la boit, et les ténèbres rendent ce que le jour t'avait dérobé.",
      "Je me souviens d'une nuit sans lune, au fond des ruines, sous la forteresse. Geralt, tout enfant, jurait que le noir l'avait avalé tout entier. Une gorgée — et ses prunelles se fendirent comme celles du chasseur tapi sous les toits. Il me décrivit alors les fresques des murs comme si l'aube s'était levée pour lui seul.",
      "Retiens ceci : il est des vérités qui n'attendent, pour se montrer, que l'extinction de toute lumière.",
    ],
    hint: "Ce qui ne se révèle qu'une fois la dernière lumière éteinte.",
  },
  {
    id: 'loriot',
    word: 'LORIOT DORE',
    display: 'Loriot doré',
    color: '#e0b310',
    clue: "Cherche dans la ramure l'éclat qu'aucun orfèvre ne sait forger : une flèche de plumes, un chant vêtu de soleil.",
    story: [
      "Le venin marche aux côtés du sorceleur comme une ombre fidèle, mon élève. Noues, échinopses, arachas — chacun porte sa morsure, et chaque morsure cherche le sang. Contre elles, j'ai toujours gardé au flanc une fiole d'un or si limpide qu'on l'eût crue remplie de soleil mis en fusion.",
      "Elle ne recoud pas la chair ; elle fait mieux. Elle traque le poison de veine en veine, le dénoue, l'efface jusqu'à la dernière goutte. Bois-la, et la toxine qui devait t'emporter s'endort, vaincue, dans tes propres veines.",
      "Son nom, on l'a emprunté à un oiseau dont le plumage rivalise avec l'or — car l'or, vois-tu, ne dort pas toujours au fond d'une bourse ; parfois il se perche et il chante.",
    ],
    hint: "L'or véritable n'emplit pas la bourse — il comble l'oreille.",
  },
  {
    id: 'hirondelle',
    word: 'HIRONDELLE',
    display: 'Hirondelle',
    color: '#c31e31',
    clue: "Elle recoud les plaies du fil de ses longs voyages, et ne revient qu'avec le premier souffle du printemps.",
    story: [
      "S'il ne devait te rester qu'une seule fiole au fond de la sacoche, mon élève, que ce soit celle-ci. La plus humble en apparence, la plus précieuse en vérité. Elle referme les chairs ouvertes, rallume le souffle qui vacille, et te ramène par la main du seuil même où la mort t'attendait.",
      "On l'a baptisée du nom d'un petit oiseau qui, chaque année, franchit des royaumes entiers pour retrouver le nid qu'il avait quitté. Car la guérison, vois-tu, est elle aussi un voyage : elle exige la distance, la patience, et la promesse d'un retour.",
      "Plus d'un sorceleur n'a survécu à la longue route que par sa grâce.",
    ],
    hint: "Comme l'oiseau migrateur, il faudra prendre la route pour l'atteindre.",
  },
  {
    id: 'lune',
    word: 'PLEINE LUNE',
    display: 'Pleine Lune',
    color: '#11549c',
    clue: "Pâle souveraine des marées, elle ne se montre tout entière qu'une seule nuit par cycle — et cette nuit-là, le calendrier la connaît d'avance.",
    story: [
      "Il existe un breuvage qui ose repousser les bornes mêmes de la chair, qui gonfle la vitalité bien au-delà de ce que la nature consent à offrir. Les meilleurs d'entre nous le réservent aux combats dont, d'ordinaire, nul ne revient pour les raconter.",
      "On ne le compose pas n'importe quand. Il faut attendre que l'astre des nuits soit plein, rond et blanc, dressé à son apogée au plus haut du ciel — car c'est en cette heure, dit-on, que sa puissance déborde. Une seule nuit, dans tout le mois, lui prête cet éclat.",
      "Lève donc les yeux : ce qui se fait rond et clair, et qui figure d'avance, écrit dans le grand calendrier des astres.",
    ],
    hint: "Une seule nuit, inscrite à l'avance dans le ciel.",
  },
  {
    id: 'maribor',
    word: 'FORET DE MARIBOR',
    display: 'Forêt de Maribor',
    color: '#7cae68',
    clue: "Là où veillent les filles des arbres, à l'abri des regards d'hommes, un nom de bois garde au creux de sa sève un secret de fruits sauvages.",
    story: [
      "Celle-ci est rare entre toutes, mon élève. On murmure que sa recette descend des profondeurs sylvestres, de ces clairières où veillent les filles des arbres et où peu d'hommes furent jamais conviés. Elle a sur la langue le goût des baies sauvages et de la sève montée à la première chaleur.",
      "Elle affûte le geste, fait gonfler dans les veines l'ardeur du combattant — puis elle la retient, la garde en réserve. Un feu patient qu'il faut savoir conserver jusqu'à l'instant qui décide de tout, jusqu'à l'ultime passe d'armes.",
      "Une faveur qu'on n'obtient qu'une fois, comme d'entrevoir une clairière interdite avant qu'elle ne se referme.",
    ],
    hint: "Une faveur qu'on n'obtient qu'une fois — à savourer jusqu'à la dernière note.",
  },
]

// ----------------------------------------------------------------------------
//  LES ROYAUMES DU NORD — le jeu des bannières
//  - name        : nom du royaume affiché au joueur
//  - blason      : fichier du blason dans /public/banners (id.svg)
//  - description : ce que Vesemir en dit, révélé quand on trouve la bonne bannière
//  L'ordre ci-dessous est l'ordre des manches du jeu.
// ----------------------------------------------------------------------------

export const KINGDOMS = [
  {
    id: 'temeria',
    name: 'Témérie',
    description:
      "La Témérie, fleuron du Nord, fière de ses lys d'argent sur champ de sable. Le roi Foltest y régnait — de la poigne, parfois trop d'orgueil, mais un véritable amour de sa terre. Geralt y a usé ses bottes et tranché bien des contrats. Une terre solide, ferme sous le pied.",
    hint: "Tu la connais bien, cette terre étrangère où tu œuvres chaque jour sans jamais y dormir : c'est là, et non chez toi, que t'attend ton présent.",
  },
  {
    id: 'redania',
    name: 'Rédanie',
    description:
      "La Rédanie, la plus puissante des couronnes du Nord, sous l'aigle d'argent. Radovid y régnait, l'esprit aussi vif que cruel, et nourrissait une haine glacée pour tout ce qui touche à la magie. Souviens-t'en, mon élève : là-bas, on dresse des bûchers pour les mages comme pour les monstres.",
    hint: "L'aigle déploie ses ailes au cœur de la saison froide : c'est en plein hiver qu'on t'attend.",
  },
  {
    id: 'kaedwen',
    name: 'Kaedwen',
    description:
      "Kaedwen, le plus vaste royaume du Nord — et celui que je connais le mieux. C'est dans ses montagnes, au creux d'une vallée que les cartes ont oubliée, que se dresse Kaer Morhen. La licorne est son emblème, le rude Henselt était son roi. Ici, louveteau, tu es chez toi.",
    hint: "Par-delà des montagnes plus hautes encore que celles de Kaedwen, ton présent repose.",
  },
  {
    id: 'aedirn',
    name: 'Aedirn',
    description:
      "Aedirn, la terre que les elfes nommaient jadis Dol Blathanna, la Vallée des Fleurs. Le roi Demavend la gouvernait l'œil rivé sur ses frontières, car une terre aussi riche attire toujours les convoitises. Le chevron d'or et de gueules flotte encore sur ses vallées disputées.",
    hint: "Dans la vallée, deux sièges dressés côte à côte : nul n'y prend place tout seul.",
  },
  {
    id: 'cintra',
    name: 'Cintra',
    description:
      "Cintra, au sud, gardée par ses lions d'or. La reine Calanthe — la Lionne, comme on l'appelait — y régnait, plus tranchante que l'acier. C'est de ce sang qu'est née l'Enfant Surprise. Nilfgaard a réduit la cité en cendres, mais le rugissement de Cintra n'a jamais péri.",
    hint: "On célébrera, comme aux fastes de Cintra — et cette fois l'on comptera dix années.",
  },
  {
    id: 'lyria',
    name: 'Lyria et Rivia',
    description:
      "Lyria et Rivia, deux noms sous une seule couronne. La reine Meve y menait ses armées en personne — peu de souverains pouvaient s'en vanter. Quant à Rivia... c'est le nom que Geralt s'est choisi : un sorceleur n'a pas de patrie, alors il a bien fallu qu'il s'en forge une.",
    hint: "Deux noms sous une seule couronne — comme le Loup et son Enfant Surprise : ce présent-là ne se savoure qu'à deux.",
  },
  {
    id: 'kovir',
    name: 'Kovir et Poviss',
    description:
      "Kovir et Poviss, tout au nord, là où l'océan ronge la côte. Plus d'or, de verre et de sel y transitent que partout ailleurs, et ses ports voient passer le monde entier. Le royaume se tient à l'écart des guerres des autres — « quand Kovir paie, le monde danse ». La richesse, vois-tu, est une muraille comme une autre.",
    hint: "Quand Kovir paie, le monde danse : tout un orchestre, escorté de bardes venus du folklore, rejouera pour toi des airs que tu connais déjà par cœur.",
  },
]

// ----------------------------------------------------------------------------
//  LE BLIND TEST DES MONSTRES
//  - name        : nom affiché du monstre (doit figurer dans MONSTER_CHOICES)
//  - file        : fichier son dans /public/monsters
//  - hint        : indice cryptique ajouté au récapitulatif quand on le trouve
//  L'ordre ci-dessous est l'ordre des manches du blind test.
// ----------------------------------------------------------------------------

export const MONSTERS = [
  {
    id: 'leshen',
    name: 'Léchi',
    file: 'leshen.wav',
    hint: "Le léchi fredonne un chant que la forêt n'a jamais oublié ; le tien non plus, tu le reconnaîtras dès la première note.",
  },
  {
    id: 'griffon',
    name: 'Griffon',
    file: 'griffon.wav',
    hint: "Le griffon franchit les cols à tire-d'aile ; toi, point n'est besoin d'ailes — la route ou le rail suffiront à t'y porter.",
  },
  {
    id: 'harpy',
    name: 'Harpie',
    file: 'harpy.wav',
    hint: "Les harpies braillent en désordre ; là où tu te rends, c'est un chœur parfaitement accordé qui s'élèvera.",
  },
  {
    id: 'banshee',
    name: 'Banshee',
    file: 'banshee.wav',
    hint: "La banshee hurle dans les ténèbres ; d'autres voix, plus douces, s'élèveront pour toi un soir.",
  },
  {
    id: 'nekker',
    name: 'Nekker',
    file: 'nekker.mp3',
    hint: "Là où les nekkers grouillent par centaines, une foule se pressera sous un même toit.",
  },
  {
    id: 'arachas',
    name: 'Arachas',
    file: 'arachas.wav',
    hint: "On traque l'arachas à l'oreille ; ton présent, lui aussi, se reconnaît au son.",
  },
]

// La liste complète des choix pour le blind test (bestiaire de The Witcher 3),
// triée par ordre alphabétique. Contient les bonnes réponses ci-dessus.
export const MONSTER_CHOICES = [
  'Abaya',
  'Algoule',
  'Alpe',
  'Arachas',
  'Arachas blindé',
  'Arachas venimeux',
  'Archigriffon',
  'Banshee',
  'Basilic',
  'Blême',
  'Brouillardier',
  'Bruxa',
  'Charognard',
  'Cocatrix',
  'Cyclope',
  'Démon',
  'Doppler',
  'Échidné',
  'Ekimmara',
  'Élémentaire de feu',
  'Élémentaire de terre',
  'Endriague',
  'Fielon',
  'Fleder',
  'Garkain',
  'Golem',
  'Goule',
  'Griffon',
  'Harpie',
  'Insectoïde',
  'Katakan',
  'Léchi',
  'Loup',
  'Loup-garou',
  'Nekker',
  'Nekker guerrier',
  'Noyeur',
  'Noyeuse',
  'Ogre',
  'Ours-garou',
  'Pesta',
  'Protofielon',
  'Putréfacteur',
  'Sangsue des airs',
  'Sirène',
  'Spectre',
  'Spectre de midi',
  'Spectre de minuit',
  'Striga',
  'Sylvain',
  'Troll des glaces',
  'Troll des rochers',
  'Vampire supérieur',
  'Wyverne',
]
