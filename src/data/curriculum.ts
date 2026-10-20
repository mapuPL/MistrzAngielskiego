import { VocabItem, SentenceItem, CategoryId, Badge, LandInfo } from '../types';

export const LANDS: LandInfo[] = [
  {
    id: 'animals',
    namePl: 'Zwierzęcy Las',
    nameEn: 'Animal Jungle',
    icon: '🐾',
    description: 'Poznaj dzikie i domowe zwierzęta oraz ich niezwykłe umiejętności!',
    grammarFocus: 'can / can\'t (potrafi / nie potrafi)',
    requiredStarsToUnlock: 0,
    themeColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'school',
    namePl: 'Zamek Szkoły',
    nameEn: 'School Castle',
    icon: '🎒',
    description: 'Piórniki, książki i sala lekcyjna w zaczarowanym zamku wiedzy.',
    grammarFocus: 'have got / pozycje: on, in, under',
    requiredStarsToUnlock: 5,
    themeColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'food',
    namePl: 'Wioska Smaków',
    nameEn: 'Food Village',
    icon: '🍎',
    description: 'Owoce, warzywa, napoje i pyszności na rynku kulinarnym!',
    grammarFocus: 'like / don\'t like (lubię / nie lubię)',
    requiredStarsToUnlock: 12,
    themeColor: 'from-rose-500 to-amber-600'
  },
  {
    id: 'colors_numbers',
    namePl: 'Tęczowe Królestwo',
    nameEn: 'Rainbow Kingdom',
    icon: '🎨',
    description: 'Wszystkie barwy tęczy oraz liczenie po angielsku od 1 do 20.',
    grammarFocus: 'Liczby 1-20 i przymiotniki barw',
    requiredStarsToUnlock: 20,
    themeColor: 'from-purple-500 to-pink-600'
  },
  {
    id: 'body',
    namePl: 'Wyspa Zmysłów',
    nameEn: 'Sensory Island',
    icon: '👀',
    description: 'Części ciała, rysy twarzy oraz opisywanie wyglądu.',
    grammarFocus: 'have got / opisywanie wyglądu',
    requiredStarsToUnlock: 30,
    themeColor: 'from-cyan-500 to-sky-600'
  },
  {
    id: 'family_home',
    namePl: 'Dolina Rodziny',
    nameEn: 'Family Valley',
    icon: '🏡',
    description: 'Członkowie rodziny, przytulny dom, pokoje i ogród.',
    grammarFocus: 'This is my... / pomieszczenia w domu',
    requiredStarsToUnlock: 42,
    themeColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'actions',
    namePl: 'Polana Akcji',
    nameEn: 'Action Meadow',
    icon: '⚡',
    description: 'Sport, zabawy na świeżym powietrzu, czasowniki ruchu i hobby!',
    grammarFocus: 'I can / I love (potrafię, uwielbiam)',
    requiredStarsToUnlock: 55,
    themeColor: 'from-lime-500 to-green-600'
  }
];

export const CATEGORIES = LANDS.map(l => ({
  id: l.id,
  namePl: l.namePl,
  nameEn: l.nameEn,
  icon: l.icon,
  description: l.description
}));

export const VOCABULARY: VocabItem[] = [
  // 1. Animals & Abilities
  {
    id: 'dog',
    en: 'dog',
    pl: 'pies',
    category: 'animals',
    phonetic: '[dog]',
    emoji: '🐶',
    exampleEn: 'A dog can run and bark.',
    examplePl: 'Pies potrafi biegać i szczekać.'
  },
  {
    id: 'cat',
    en: 'cat',
    pl: 'kot',
    category: 'animals',
    phonetic: '[kat]',
    emoji: '🐱',
    exampleEn: 'The cat sleeps on the soft bed.',
    examplePl: 'Kot śpi na miękkim łóżku.'
  },
  {
    id: 'rabbit',
    en: 'rabbit',
    pl: 'królik',
    category: 'animals',
    phonetic: '[rabit]',
    emoji: '🐰',
    exampleEn: 'A rabbit can jump very high.',
    examplePl: 'Królik potrafi bardzo wysoko skakać.'
  },
  {
    id: 'bird',
    en: 'bird',
    pl: 'ptak',
    category: 'animals',
    phonetic: '[berd]',
    emoji: '🐦',
    exampleEn: 'A little bird can fly in the sky.',
    examplePl: 'Mały ptaszek potrafi latać po niebie.'
  },
  {
    id: 'lion',
    en: 'lion',
    pl: 'lew',
    category: 'animals',
    phonetic: '[lajon]',
    emoji: '🦁',
    exampleEn: 'The brave lion is the king of beasts.',
    examplePl: 'Odważny lew jest królem zwierząt.'
  },
  {
    id: 'monkey',
    en: 'monkey',
    pl: 'małpa',
    category: 'animals',
    phonetic: '[manki]',
    emoji: '🐵',
    exampleEn: 'A clever monkey can climb tall trees.',
    examplePl: 'Sprytna małpa potrafi wspinać się na wysokie drzewa.'
  },
  {
    id: 'elephant',
    en: 'elephant',
    pl: 'słoń',
    category: 'animals',
    phonetic: '[elefant]',
    emoji: '🐘',
    exampleEn: 'An elephant has got two big ears.',
    examplePl: 'Słoń ma dwoje wielkich uszu.'
  },
  {
    id: 'frog',
    en: 'frog',
    pl: 'żaba',
    category: 'animals',
    phonetic: '[frog]',
    emoji: '🐸',
    exampleEn: 'A green frog can jump and swim.',
    examplePl: 'Zielona żaba potrafi skakać i pływać.'
  },
  {
    id: 'fish',
    en: 'fish',
    pl: 'ryba',
    category: 'animals',
    phonetic: '[fysz]',
    emoji: '🐟',
    exampleEn: 'A fish can swim but it cannot run.',
    examplePl: 'Ryba potrafi pływać, ale nie potrafi biegać.'
  },
  {
    id: 'bear',
    en: 'bear',
    pl: 'niedźwiedź',
    category: 'animals',
    phonetic: '[ber]',
    emoji: '🐻',
    exampleEn: 'The brown bear loves sweet honey.',
    examplePl: 'Brunatny niedźwiedź uwielbia słodki miód.'
  },

  // 2. School Castle
  {
    id: 'pencil',
    en: 'pencil',
    pl: 'ołówek',
    category: 'school',
    phonetic: '[pensyl]',
    emoji: '✏️',
    exampleEn: 'The yellow pencil is on the desk.',
    examplePl: 'Żółty ołówek leży na biurku.'
  },
  {
    id: 'pen',
    en: 'pen',
    pl: 'długopis',
    category: 'school',
    phonetic: '[pen]',
    emoji: '🖊️',
    exampleEn: 'I have got a blue pen in my hand.',
    examplePl: 'Mam niebieski długopis w dłoni.'
  },
  {
    id: 'rubber',
    en: 'rubber',
    pl: 'gumka do ścierania',
    category: 'school',
    phonetic: '[raber]',
    emoji: '🧼',
    exampleEn: 'Can I borrow your white rubber?',
    examplePl: 'Czy mogę pożyczyć twoją białą gumkę?'
  },
  {
    id: 'ruler',
    en: 'ruler',
    pl: 'linijka',
    category: 'school',
    phonetic: '[ruler]',
    emoji: '📏',
    exampleEn: 'Draw a straight line with a ruler.',
    examplePl: 'Narysuj prostą linię linijką.'
  },
  {
    id: 'book',
    en: 'book',
    pl: 'książka',
    category: 'school',
    phonetic: '[buk]',
    exampleEn: 'Open your English book on page ten.',
    examplePl: 'Otwórz podręcznik do angielskiego na stronie dziesiątej.',
    emoji: '📖'
  },
  {
    id: 'bag',
    en: 'bag',
    pl: 'plecak / torba',
    category: 'school',
    phonetic: '[bag]',
    emoji: '🎒',
    exampleEn: 'Put the notebooks into your bag.',
    examplePl: 'Włóż zeszyty do plecaka.'
  },
  {
    id: 'desk',
    en: 'desk',
    pl: 'biurko / ławka',
    category: 'school',
    phonetic: '[desk]',
    emoji: '🪑',
    exampleEn: 'Sit at your desk and open the notebook.',
    examplePl: 'Usiądź przy biurku i otwórz zeszyt.'
  },
  {
    id: 'chair',
    en: 'chair',
    pl: 'krzesło',
    category: 'school',
    phonetic: '[czer]',
    emoji: '🪑',
    exampleEn: 'The red chair is next to the window.',
    examplePl: 'Czerwone krzesło stoi obok okna.'
  },
  {
    id: 'classroom',
    en: 'classroom',
    pl: 'sala lekcyjna / klasa',
    category: 'school',
    phonetic: '[klasrum]',
    emoji: '🏫',
    exampleEn: 'Our classroom is bright and friendly.',
    examplePl: 'Nasza klasa jest jasna i przyjazna.'
  },

  // 3. Food Village
  {
    id: 'apple',
    en: 'apple',
    pl: 'jabłko',
    category: 'food',
    phonetic: '[apyl]',
    emoji: '🍎',
    exampleEn: 'I like tasty red apples.',
    examplePl: 'Lubię smaczne czerwone jabłka.'
  },
  {
    id: 'banana',
    en: 'banana',
    pl: 'banan',
    category: 'food',
    phonetic: '[banana]',
    emoji: '🍌',
    exampleEn: 'The yellow banana is very sweet.',
    examplePl: 'Żółty banan jest bardzo słodki.'
  },
  {
    id: 'pizza',
    en: 'pizza',
    pl: 'pizza',
    category: 'food',
    phonetic: '[pica]',
    emoji: '🍕',
    exampleEn: 'We love hot cheese pizza.',
    examplePl: 'Uwielbiamy gorącą pizzę z serem.'
  },
  {
    id: 'milk',
    en: 'milk',
    pl: 'mleko',
    category: 'food',
    phonetic: '[mylk]',
    emoji: '🥛',
    exampleEn: 'I drink cold milk with cookies.',
    examplePl: 'Piję zimne mleko z ciasteczkami.'
  },
  {
    id: 'water',
    en: 'water',
    pl: 'woda',
    category: 'food',
    phonetic: '[łoter]',
    emoji: '💧',
    exampleEn: 'Drink fresh water every single day.',
    examplePl: 'Pij świeżą wodę każdego dnia.'
  },
  {
    id: 'cheese',
    en: 'cheese',
    pl: 'ser',
    category: 'food',
    phonetic: '[cziz]',
    emoji: '🧀',
    exampleEn: 'Mice like yellow cheese.',
    examplePl: 'Myszy lubią żółty ser.'
  },
  {
    id: 'bread',
    en: 'bread',
    pl: 'chleb',
    category: 'food',
    phonetic: '[bred]',
    emoji: '🍞',
    exampleEn: 'I eat fresh bread for breakfast.',
    examplePl: 'Jem świeży chleb na śniadanie.'
  },
  {
    id: 'ice_cream',
    en: 'ice cream',
    pl: 'lody',
    category: 'food',
    phonetic: '[ajs krim]',
    emoji: '🍦',
    exampleEn: 'Strawberry ice cream is delicious.',
    examplePl: 'Lody truskawkowe są przepyszne.'
  },
  {
    id: 'juice',
    en: 'juice',
    pl: 'sok',
    category: 'food',
    phonetic: '[dżus]',
    emoji: '🧃',
    exampleEn: 'I like cold orange juice.',
    examplePl: 'Lubię zimny sok pomarańczowy.'
  },

  // 4. Rainbow Kingdom (Colours & Numbers 1-20)
  {
    id: 'red',
    en: 'red',
    pl: 'czerwony',
    category: 'colors_numbers',
    phonetic: '[red]',
    emoji: '🔴',
    exampleEn: 'The red balloon flies high.',
    examplePl: 'Czerwony balonik leci wysoko.'
  },
  {
    id: 'blue',
    en: 'blue',
    pl: 'niebieski',
    category: 'colors_numbers',
    phonetic: '[blu]',
    emoji: '🔵',
    exampleEn: 'The sea is calm and blue.',
    examplePl: 'Morze jest spokojne i niebieskie.'
  },
  {
    id: 'green',
    en: 'green',
    pl: 'zielony',
    category: 'colors_numbers',
    phonetic: '[grin]',
    emoji: '🟢',
    exampleEn: 'The grass in spring is green.',
    examplePl: 'Trawa wiosną jest zielona.'
  },
  {
    id: 'yellow',
    en: 'yellow',
    pl: 'żółty',
    category: 'colors_numbers',
    phonetic: '[jeloł]',
    emoji: '🟡',
    exampleEn: 'The warm sun is yellow and bright.',
    examplePl: 'Ciepłe słońce jest żółte i jasne.'
  },
  {
    id: 'pink',
    en: 'pink',
    pl: 'różowy',
    category: 'colors_numbers',
    phonetic: '[pynk]',
    emoji: '🌸',
    exampleEn: 'I have got a nice pink pencil case.',
    examplePl: 'Mam ładny różowy piórnik.'
  },
  {
    id: 'purple',
    en: 'purple',
    pl: 'fioletowy',
    category: 'colors_numbers',
    phonetic: '[perpl]',
    emoji: '🟣',
    exampleEn: 'She has got a purple jacket.',
    examplePl: 'Ona ma fioletową kurtkę.'
  },
  {
    id: 'orange_col',
    en: 'orange',
    pl: 'pomarańczowy',
    category: 'colors_numbers',
    phonetic: '[oryndż]',
    emoji: '🟠',
    exampleEn: 'The fox has an orange coat.',
    examplePl: 'Lis ma pomarańczowe futerko.'
  },
  {
    id: 'black',
    en: 'black',
    pl: 'czarny',
    category: 'colors_numbers',
    phonetic: '[blak]',
    emoji: '⚫',
    exampleEn: 'A black cat walks silently.',
    examplePl: 'Czarny kot chodzi po cichu.'
  },
  {
    id: 'white',
    en: 'white',
    pl: 'biały',
    category: 'colors_numbers',
    phonetic: '[łajt]',
    emoji: '⚪',
    exampleEn: 'Winter snow is cold and white.',
    examplePl: 'Zimowy śnieg jest zimny i biały.'
  },
  {
    id: 'num_seven',
    en: 'seven',
    pl: 'siedem (7)',
    category: 'colors_numbers',
    phonetic: '[sewen]',
    emoji: '7️⃣',
    exampleEn: 'There are seven days in a week.',
    examplePl: 'W tygodniu jest siedem dni.'
  },
  {
    id: 'num_twelve',
    en: 'twelve',
    pl: 'dwanaście (12)',
    category: 'colors_numbers',
    phonetic: '[tłelw]',
    emoji: '🔢',
    exampleEn: 'I have got twelve colored crayons.',
    examplePl: 'Mam dwanaście kolorowych kredek.'
  },
  {
    id: 'num_twenty',
    en: 'twenty',
    pl: 'dwadzieścia (20)',
    category: 'colors_numbers',
    phonetic: '[tłenti]',
    emoji: '2️⃣0️⃣',
    exampleEn: 'There are twenty students in the class.',
    examplePl: 'W klasie jest dwudziestu uczniów.'
  },

  // 5. Sensory Island (Body & Appearance)
  {
    id: 'head',
    en: 'head',
    pl: 'głowa',
    category: 'body',
    phonetic: '[hed]',
    emoji: '👦',
    exampleEn: 'Put a warm cap on your head.',
    examplePl: 'Załóż ciepłą czapkę na głowę.'
  },
  {
    id: 'arms',
    en: 'arms',
    pl: 'ramiona / ręce',
    category: 'body',
    phonetic: '[armz]',
    emoji: '💪',
    exampleEn: 'Stretch your arms up high!',
    examplePl: 'Wyciągnij ramiona wysoko w górę!'
  },
  {
    id: 'legs',
    en: 'legs',
    pl: 'nogi',
    category: 'body',
    phonetic: '[legz]',
    emoji: '🦵',
    exampleEn: 'I can run fast on my strong legs.',
    examplePl: 'Potrafię szybko biegać na moich silnych nogach.'
  },
  {
    id: 'eyes',
    en: 'eyes',
    pl: 'oczy',
    category: 'body',
    phonetic: '[ajz]',
    emoji: '👀',
    exampleEn: 'I have got two big brown eyes.',
    examplePl: 'Mam dwoje dużych, brązowych oczu.'
  },
  {
    id: 'ears',
    en: 'ears',
    pl: 'uszy',
    category: 'body',
    phonetic: '[irz]',
    emoji: '👂',
    exampleEn: 'I hear music with my ears.',
    examplePl: 'Słucham muzyki moimi uszami.'
  },
  {
    id: 'mouth',
    en: 'mouth',
    pl: 'usta',
    category: 'body',
    phonetic: '[małf]',
    emoji: '👄',
    exampleEn: 'Smile with your friendly mouth.',
    examplePl: 'Uśmiechnij się przyjaznymi ustami.'
  },
  {
    id: 'nose',
    en: 'nose',
    pl: 'nos',
    category: 'body',
    phonetic: '[nołz]',
    emoji: '👃',
    exampleEn: 'Touch your nose with your finger.',
    examplePl: 'Dotknij nosa swoim palcem.'
  },
  {
    id: 'hair',
    en: 'hair',
    pl: 'włosy',
    category: 'body',
    phonetic: '[her]',
    emoji: '💇',
    exampleEn: 'She has got long blonde hair.',
    examplePl: 'Ona ma długie, jasne włosy.'
  },
  {
    id: 'feet',
    en: 'feet',
    pl: 'stopy',
    category: 'body',
    phonetic: '[fit]',
    emoji: '🦶',
    exampleEn: 'Stamp your feet to the rhythm!',
    examplePl: 'Tupnij stopami do rytmu!'
  },

  // 6. Family Valley (Family & House)
  {
    id: 'mum',
    en: 'mum',
    pl: 'mama',
    category: 'family_home',
    phonetic: '[mam]',
    emoji: '👩',
    exampleEn: 'This is my kind and lovely mum.',
    examplePl: 'To jest moja miła i kochana mama.'
  },
  {
    id: 'dad',
    en: 'dad',
    pl: 'tata',
    category: 'family_home',
    phonetic: '[dad]',
    emoji: '👨',
    exampleEn: 'My dad plays football with me.',
    examplePl: 'Mój tata gra ze mną w piłkę nożną.'
  },
  {
    id: 'brother',
    en: 'brother',
    pl: 'brat',
    category: 'family_home',
    phonetic: '[brader]',
    emoji: '👦',
    exampleEn: 'My little brother is six years old.',
    examplePl: 'Mój mały brat ma sześć lat.'
  },
  {
    id: 'sister',
    en: 'sister',
    pl: 'siostra',
    category: 'family_home',
    phonetic: '[syster]',
    emoji: '👧',
    exampleEn: 'My sister likes singing English songs.',
    examplePl: 'Moja siostra lubi śpiewać angielskie piosenki.'
  },
  {
    id: 'grandma',
    en: 'grandma',
    pl: 'babcia',
    category: 'family_home',
    phonetic: '[granma]',
    emoji: '👵',
    exampleEn: 'Grandma bakes the best apple pie.',
    examplePl: 'Babcia piecze najlepszą szarlotkę.'
  },
  {
    id: 'grandpa',
    en: 'grandpa',
    pl: 'dziadek',
    category: 'family_home',
    phonetic: '[granpa]',
    emoji: '👴',
    exampleEn: 'Grandpa tells funny stories.',
    examplePl: 'Dziadek opowiada śmieszne historyjki.'
  },
  {
    id: 'house',
    en: 'house',
    pl: 'dom',
    category: 'family_home',
    phonetic: '[hałs]',
    emoji: '🏠',
    exampleEn: 'We live in a nice yellow house.',
    examplePl: 'Mieszkamy w ładnym żółtym domu.'
  },
  {
    id: 'bedroom',
    en: 'bedroom',
    pl: 'sypialnia / pokój',
    category: 'family_home',
    phonetic: '[bedrum]',
    emoji: '🛏️',
    exampleEn: 'My bedroom is tidy and quiet.',
    examplePl: 'Mój pokój jest uporządkowany i cichy.'
  },
  {
    id: 'kitchen',
    en: 'kitchen',
    pl: 'kuchnia',
    category: 'family_home',
    phonetic: '[kyczyn]',
    emoji: '🍳',
    exampleEn: 'Dad is making breakfast in the kitchen.',
    examplePl: 'Tata robi śniadanie w kuchni.'
  },
  {
    id: 'garden',
    en: 'garden',
    pl: 'ogród',
    category: 'family_home',
    phonetic: '[garden]',
    emoji: '🌳',
    exampleEn: 'The cat plays in the green garden.',
    examplePl: 'Kot bawi się w zielonym ogrodzie.'
  },

  // 7. Action Meadow (Verbs & Free Time)
  {
    id: 'run',
    en: 'run',
    pl: 'biegać',
    category: 'actions',
    phonetic: '[ran]',
    emoji: '🏃',
    exampleEn: 'I can run very fast in the park.',
    examplePl: 'Potrafię bardzo szybko biegać w parku.'
  },
  {
    id: 'jump',
    en: 'jump',
    pl: 'skakać',
    category: 'actions',
    phonetic: '[dżamp]',
    emoji: '🦘',
    exampleEn: 'Can you jump like a green frog?',
    examplePl: 'Czy potrafisz skakać jak zielona żaba?'
  },
  {
    id: 'swim',
    en: 'swim',
    pl: 'pływać',
    category: 'actions',
    phonetic: '[słym]',
    emoji: '🏊',
    exampleEn: 'I can swim in the summer pool.',
    examplePl: 'Potrafię pływać w letnim basenie.'
  },
  {
    id: 'fly',
    en: 'fly',
    pl: 'latać',
    category: 'actions',
    phonetic: '[flaj]',
    emoji: '🦅',
    exampleEn: 'Birds can fly high above clouds.',
    examplePl: 'Ptaki potrafią latać wysoko ponad chmurami.'
  },
  {
    id: 'read',
    en: 'read',
    pl: 'czytać',
    category: 'actions',
    phonetic: '[rid]',
    emoji: '📚',
    exampleEn: 'I read interesting English stories.',
    examplePl: 'Czytam ciekawe angielskie opowiadania.'
  },
  {
    id: 'sing',
    en: 'sing',
    pl: 'śpiewać',
    category: 'actions',
    phonetic: '[syng]',
    emoji: '🎤',
    exampleEn: 'We sing happy songs at school.',
    examplePl: 'Śpiewamy wesołe piosenki w szkole.'
  },
  {
    id: 'dance',
    en: 'dance',
    pl: 'tańczyć',
    category: 'actions',
    phonetic: '[dans]',
    emoji: '💃',
    exampleEn: 'They can dance beautifully.',
    examplePl: 'Oni potrafią pięknie tańczyć.'
  },
  {
    id: 'play_football',
    en: 'play football',
    pl: 'grać w piłkę nożną',
    category: 'actions',
    phonetic: '[plej futbol]',
    emoji: '⚽',
    exampleEn: 'We play football with friends.',
    examplePl: 'Gramy w piłkę nożną z przyjaciółmi.'
  },
  {
    id: 'ride_bike',
    en: 'ride a bike',
    pl: 'jeździć na rowerze',
    category: 'actions',
    phonetic: '[rajd e bajk]',
    emoji: '🚴',
    exampleEn: 'I can ride a bike to the park.',
    examplePl: 'Potrafię jeździć na rowerze do parku.'
  }
];

export const SENTENCE_QUESTS: SentenceItem[] = [
  {
    id: 's1',
    fullEn: 'I have got a brown dog.',
    fullPl: 'Mam brązowego psa.',
    words: ['I', 'have', 'got', 'a', 'brown', 'dog.'],
    category: 'animals',
    hint: 'Zaczynamy od „I have got...”'
  },
  {
    id: 's2',
    fullEn: 'Can you swim fast?',
    fullPl: 'Czy potrafisz szybko pływać?',
    words: ['Can', 'you', 'swim', 'fast?'],
    category: 'actions',
    hint: 'Pytanie o umiejętność zaczynamy od „Can you...”'
  },
  {
    id: 's3',
    fullEn: 'The yellow pencil is on the desk.',
    fullPl: 'Żółty ołówek leży na biurku.',
    words: ['The', 'yellow', 'pencil', 'is', 'on', 'the', 'desk.'],
    category: 'school',
    hint: 'Pozycja na biurku to „on the desk.”'
  },
  {
    id: 's4',
    fullEn: 'I like sweet apples.',
    fullPl: 'Lubię słodkie jabłka.',
    words: ['I', 'like', 'sweet', 'apples.'],
    category: 'food',
    hint: 'Zdanie twierdzące o upodobaniach: „I like...”'
  },
  {
    id: 's5',
    fullEn: 'I do not like milk.',
    fullPl: 'Nie lubię mleka.',
    words: ['I', 'do', 'not', 'like', 'milk.'],
    category: 'food',
    hint: 'Przeczenie tworzymy przez „I do not like...”'
  },
  {
    id: 's6',
    fullEn: 'A bird can fly.',
    fullPl: 'Ptaszek potrafi latać.',
    words: ['A', 'bird', 'can', 'fly.'],
    category: 'animals',
    hint: 'Zdolność zwierzęcia: „can fly.”'
  },
  {
    id: 's7',
    fullEn: 'A fish cannot run.',
    fullPl: 'Ryba nie potrafi biegać.',
    words: ['A', 'fish', 'cannot', 'run.'],
    category: 'animals',
    hint: 'Brak umiejętności: „cannot run.”'
  },
  {
    id: 's8',
    fullEn: 'I have got two big eyes.',
    fullPl: 'Mam dwoje dużych oczu.',
    words: ['I', 'have', 'got', 'two', 'big', 'eyes.'],
    category: 'body',
    hint: 'Opis wyglądu: „I have got two...”'
  },
  {
    id: 's9',
    fullEn: 'This is my mum.',
    fullPl: 'To jest moja mama.',
    words: ['This', 'is', 'my', 'mum.'],
    category: 'family_home',
    hint: 'Przedstawianie rodziny: „This is my...”'
  },
  {
    id: 's10',
    fullEn: 'The cat is in the garden.',
    fullPl: 'Kot jest w ogrodzie.',
    words: ['The', 'cat', 'is', 'in', 'the', 'garden.'],
    category: 'family_home',
    hint: 'W ogrodzie to „in the garden.”'
  },
  {
    id: 's11',
    fullEn: 'I can ride a bike.',
    fullPl: 'Potrafię jeździć na rowerze.',
    words: ['I', 'can', 'ride', 'a', 'bike.'],
    category: 'actions',
    hint: 'Czynność i hobby: „ride a bike.”'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'starter',
    title: 'Młody Odkrywca',
    desc: 'Pierwsze 10 gwiazdek w nauce języka!',
    icon: '🌱',
    requirementStars: 10
  },
  {
    id: 'school_ace',
    title: 'Szkolny As',
    desc: 'Zdobyto 30 gwiazdek w zadaniach',
    icon: '🎓',
    requirementStars: 30
  },
  {
    id: 'speed_hero',
    title: 'Szybkie Ucho',
    desc: 'Zdobyto 60 gwiazdek i świetny refleks słuchowy',
    icon: '🎧',
    requirementStars: 60
  },
  {
    id: 'word_wizard',
    title: 'Czarodziej Słówek',
    desc: 'Zdobyto 100 gwiazdek i wspaniałą wiedzę',
    icon: '✨',
    requirementStars: 100
  },
  {
    id: 'grand_champion',
    title: 'Mistrz Klasy Trzeciej',
    desc: 'Zdobyto 150 gwiazdek – Oficjalny Tytuł Mistrza!',
    icon: '👑',
    requirementStars: 150
  }
];

export const AVATARS = [
  { id: 'fox', name: 'Lisek Leo (Przewodnik)', icon: '🦊' },
  { id: 'owl', name: 'Sówka Polly (Mądrala)', icon: '🦉' },
  { id: 'puppy', name: 'Piesek Rocky (Wesołek)', icon: '🐶' },
  { id: 'kitten', name: 'Kotek Luna (Bystrzak)', icon: '🐱' },
  { id: 'bear', name: 'Miś Benio (Siłacz)', icon: '🐻' },
  { id: 'rabbit', name: 'Króliczek Pikuś (Szybki)', icon: '🐰' }
];
