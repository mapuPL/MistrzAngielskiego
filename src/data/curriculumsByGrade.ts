import { GradeLevel, LandInfo, VocabItem, SentenceItem, Badge, DailyTask, CategoryId } from '../types';
import { LANDS as LANDS_G3, VOCABULARY as VOCAB_G3, SENTENCE_QUESTS as SENTENCES_G3, BADGES as BADGES_G3, CATEGORIES as CATEGORIES_G3 } from './curriculum';

// ============================================================================
// 1. KRAINY TEMATYCZNE DLA KLAS 4–6 (ENGLISH EXPLORER)
// ============================================================================
export const LANDS_GRADE_4_6: LandInfo[] = [
  {
    id: 'travel_places',
    namePl: 'Miasto i Podróże',
    nameEn: 'City & Travel',
    icon: '🏙️',
    description: 'Dworce, lotniska, zabytki, orientacja w przestrzeni, bilety i poruszanie się po mieście.',
    grammarFocus: 'Past Simple (went, arrived) & Pytanie o drogę',
    requiredStarsToUnlock: 0,
    themeColor: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'jobs_professions',
    namePl: 'Zawody i Praca',
    nameEn: 'Jobs & Professions',
    icon: '💼',
    description: 'Świat profesji: inżynier, ratownik, programista, lekarz, dziennikarz, naukowiec.',
    grammarFocus: 'Present Simple (routines) & want to be...',
    requiredStarsToUnlock: 10,
    themeColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'actions',
    namePl: 'Czas Wolny i Sport',
    nameEn: 'Free Time & Sports',
    icon: '🛹',
    description: 'Aktywności pozalekcyjne, gra na instrumentach, sporty zespołowe i hobby.',
    grammarFocus: 'Present Continuous (is doing right now) & good at',
    requiredStarsToUnlock: 20,
    themeColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'body',
    namePl: 'Zdrowie i Ciało',
    nameEn: 'Health & Well-being',
    icon: '🩺',
    description: 'U lekarza i dentysty, opisywanie samopoczucia, higiena i zdrowy styl życia.',
    grammarFocus: 'should / shouldn\'t & have got a fever/headache',
    requiredStarsToUnlock: 35,
    themeColor: 'from-rose-500 to-amber-600'
  },
  {
    id: 'environment_tech',
    namePl: 'Przyroda i Krajobrazy',
    nameEn: 'Nature & Geography',
    icon: '⛰️',
    description: 'Oceany, pasma górskie, pogoda, zjawiska klimatyczne i gadżety technologiczne.',
    grammarFocus: 'Stopniowanie: bigger than, the highest in the world',
    requiredStarsToUnlock: 50,
    themeColor: 'from-teal-600 to-green-700'
  },
  {
    id: 'school',
    namePl: 'Dzień w Szkole i Domu',
    nameEn: 'Daily Life & School',
    icon: '⏰',
    description: 'Plan lekcji, przedmioty szkolne, obowiązki domowe i planowanie tygodnia.',
    grammarFocus: 'Przysłówki: always, usually, often, sometimes, never',
    requiredStarsToUnlock: 65,
    themeColor: 'from-purple-600 to-indigo-700'
  },
  {
    id: 'food',
    namePl: 'Jedzenie i Restauracja',
    nameEn: 'Food, Cafe & Shopping',
    icon: '🥗',
    description: 'Zamawianie w restauracji, zdrowe posiłki, lista zakupów i ceny.',
    grammarFocus: 'some / any, much / many, How much does it cost?',
    requiredStarsToUnlock: 80,
    themeColor: 'from-amber-500 to-orange-600'
  }
];

export const CATEGORIES_GRADE_4_6 = [
  { id: 'travel_places' as CategoryId, namePl: 'Miasto i Podróże', nameEn: 'City & Travel', icon: '🏙️', description: 'Poruszanie się po mieście i podróże' },
  { id: 'jobs_professions' as CategoryId, namePl: 'Zawody i Praca', nameEn: 'Jobs & Professions', icon: '💼', description: 'Profesje i miejsca pracy' },
  { id: 'actions' as CategoryId, namePl: 'Czas Wolny i Sport', nameEn: 'Free Time & Sports', icon: '🛹', description: 'Sporty, gry i zainteresowania' },
  { id: 'body' as CategoryId, namePl: 'Zdrowie i Ciało', nameEn: 'Health & Well-being', icon: '🩺', description: 'Dolegliwości, lekarstwa i kondycja' },
  { id: 'environment_tech' as CategoryId, namePl: 'Przyroda i Krajobrazy', nameEn: 'Nature & Tech', icon: '⛰️', description: 'Geografia, pogoda i elektronika' },
  { id: 'school' as CategoryId, namePl: 'Dzień w Szkole i Domu', nameEn: 'Daily Life & School', icon: '⏰', description: 'Plan dnia, przedmioty i obowiązki' },
  { id: 'food' as CategoryId, namePl: 'Jedzenie i Restauracja', nameEn: 'Food & Dining', icon: '🥗', description: 'Posiłki, kawiarnia i zakupy spożywcze' }
];

// Słownictwo Klasy 4–6
export const VOCAB_GRADE_4_6_FULL: VocabItem[] = [
  // Miasto i Podróże
  {
    id: 'g4_airport',
    en: 'airport',
    pl: 'lotnisko',
    category: 'travel_places',
    phonetic: '[erport]',
    emoji: '✈️',
    exampleEn: 'We arrived at the international airport early in the morning.',
    examplePl: 'Przyjechaliśmy na międzynarodowe lotnisko wcześnie rano.',
    level: 'grade4_6'
  },
  {
    id: 'g4_train_station',
    en: 'railway station',
    pl: 'stacja kolejowa / dworzec',
    category: 'travel_places',
    phonetic: '[rejlłej stejszyn]',
    emoji: '🚉',
    exampleEn: 'The express train leaves from platform two.',
    examplePl: 'Pociąg ekspresowy odjeżdża z drugiego peronu.',
    level: 'grade4_6'
  },
  {
    id: 'g4_underground',
    en: 'underground',
    pl: 'metro',
    category: 'travel_places',
    phonetic: '[andergraund]',
    emoji: '🚇',
    exampleEn: 'Travelling by underground is very fast in London.',
    examplePl: 'Podróżowanie metrem jest bardzo szybkie w Londynie.',
    level: 'grade4_6'
  },
  {
    id: 'g4_traffic_lights',
    en: 'traffic lights',
    pl: 'sygnalizacja świetlna',
    category: 'travel_places',
    phonetic: '[trafik lajts]',
    emoji: '🚦',
    exampleEn: 'Pedestrians must stop when traffic lights are red.',
    examplePl: 'Piesi muszą się zatrzymać, gdy światła są czerwone.',
    level: 'grade4_6'
  },
  {
    id: 'g4_museum',
    en: 'museum',
    pl: 'muzeum',
    category: 'travel_places',
    phonetic: '[mju-zijem]',
    emoji: '🏛️',
    exampleEn: 'We saw old dinosaur bones at the natural science museum.',
    examplePl: 'Widzieliśmy stare kości dinozaurów w muzeum przyrodniczym.',
    level: 'grade4_6'
  },
  {
    id: 'g4_ticket',
    en: 'ticket office',
    pl: 'kasa biletowa',
    category: 'travel_places',
    phonetic: '[tyket ofis]',
    emoji: '🎟️',
    exampleEn: 'I bought two return tickets at the ticket office.',
    examplePl: 'Kupiłem dwa bilety powrotne w kasie biletowej.',
    level: 'grade4_6'
  },
  {
    id: 'g4_tourist',
    en: 'tourist guide',
    pl: 'przewodnik turystyczny',
    category: 'travel_places',
    phonetic: '[turyst gajd]',
    emoji: '🗺️',
    exampleEn: 'Our tourist guide told us historic legends about the castle.',
    examplePl: 'Nasz przewodnik turystyczny opowiedział nam historyczne legendy o zamku.',
    level: 'grade4_6'
  },
  {
    id: 'g4_crossroads',
    en: 'crossroads',
    pl: 'skrzyżowanie',
    category: 'travel_places',
    phonetic: '[krosrołdz]',
    emoji: '➕',
    exampleEn: 'Turn right at the crossroads to reach the hotel.',
    examplePl: 'Skręć w prawo na skrzyżowaniu, aby dotrzeć do hotelu.',
    level: 'grade4_6'
  },

  // Zawody i Praca
  {
    id: 'g4_engineer',
    en: 'engineer',
    pl: 'inżynier',
    category: 'jobs_professions',
    phonetic: '[endżynir]',
    emoji: '⚙️',
    exampleEn: 'An engineer designs modern bridges and electric cars.',
    examplePl: 'Inżynier projektuje nowoczesne mosty i samochody elektryczne.',
    level: 'grade4_6'
  },
  {
    id: 'g4_journalist',
    en: 'journalist',
    pl: 'dziennikarz',
    category: 'jobs_professions',
    phonetic: '[dżernalyst]',
    emoji: '📰',
    exampleEn: 'The journalist interviewed the famous basketball player.',
    examplePl: 'Dziennikarz przeprowadził wywiad ze słynnym koszykarzem.',
    level: 'grade4_6'
  },
  {
    id: 'g4_chef',
    en: 'chef',
    pl: 'szef kuchni',
    category: 'jobs_professions',
    phonetic: '[szef]',
    emoji: '👨‍🍳',
    exampleEn: 'The master chef prepared a delicious seafood soup.',
    examplePl: 'Szef kuchni przygotował wyśmienitą zupę z owoców morza.',
    level: 'grade4_6'
  },
  {
    id: 'g4_firefighter',
    en: 'firefighter',
    pl: 'strażak',
    category: 'jobs_professions',
    phonetic: '[fajerfajter]',
    emoji: '🚒',
    exampleEn: 'Brave firefighters put out the dangerous fire quickly.',
    examplePl: 'Odważni strażacy szybko ugasili niebezpieczny pożar.',
    level: 'grade4_6'
  },
  {
    id: 'g4_programmer',
    en: 'programmer',
    pl: 'programista',
    category: 'jobs_professions',
    phonetic: '[programer]',
    emoji: '💻',
    exampleEn: 'A programmer writes code to build video games.',
    examplePl: 'Programista pisze kod, aby tworzyć gry wideo.',
    level: 'grade4_6'
  },
  {
    id: 'g4_paramedic',
    en: 'paramedic',
    pl: 'ratownik medyczny',
    category: 'jobs_professions',
    phonetic: '[paramedyk]',
    emoji: '🚑',
    exampleEn: 'The paramedic helped the injured cyclist on the road.',
    examplePl: 'Ratownik medyczny pomógł rannemu rowerzyście na drodze.',
    level: 'grade4_6'
  },
  {
    id: 'g4_architect',
    en: 'architect',
    pl: 'architekt',
    category: 'jobs_professions',
    phonetic: '[arkitekt]',
    emoji: '📐',
    exampleEn: 'The architect drew the blueprint of a glass skyscraper.',
    examplePl: 'Architekt narysował plan szklanego wieżowca.',
    level: 'grade4_6'
  },

  // Czas Wolny i Sport
  {
    id: 'g4_skateboarding',
    en: 'skateboarding',
    pl: 'jazda na deskorolce',
    category: 'actions',
    phonetic: '[skejtboarding]',
    emoji: '🛹',
    exampleEn: 'He practices skateboarding in the local park every weekend.',
    examplePl: 'On ćwiczy jazdę na deskorolce w lokalnym parku w każdy weekend.',
    level: 'grade4_6'
  },
  {
    id: 'g4_guitar',
    en: 'play the guitar',
    pl: 'grać na gitarze',
    category: 'actions',
    phonetic: '[plej de gitar]',
    emoji: '🎸',
    exampleEn: 'She is learning how to play the acoustic guitar.',
    examplePl: 'Ona uczy się, jak grać na gitarze akustycznej.',
    level: 'grade4_6'
  },
  {
    id: 'g4_photography',
    en: 'photography',
    pl: 'fotografia',
    category: 'actions',
    phonetic: '[fotografi]',
    emoji: '📷',
    exampleEn: 'My favorite hobby is wildlife photography.',
    examplePl: 'Moim ulubionym hobby jest fotografia dzikiej przyrody.',
    level: 'grade4_6'
  },
  {
    id: 'g4_snowboarding',
    en: 'snowboarding',
    pl: 'snowboarding',
    category: 'actions',
    phonetic: '[snołbording]',
    emoji: '🏂',
    exampleEn: 'In winter we often go snowboarding in the mountains.',
    examplePl: 'Zimą często jeździmy na snowboardzie w góry.',
    level: 'grade4_6'
  },
  {
    id: 'g4_chess',
    en: 'play chess',
    pl: 'grać w szachy',
    category: 'actions',
    phonetic: '[plej czes]',
    emoji: '♟️',
    exampleEn: 'Playing chess helps train your memory and strategic thinking.',
    examplePl: 'Gra w szachy pomaga trenować pamięć i myślenie strategiczne.',
    level: 'grade4_6'
  },
  {
    id: 'g4_swimming_pool',
    en: 'swimming pool',
    pl: 'basen kąpielowy',
    category: 'actions',
    phonetic: '[słiming pul]',
    emoji: '🏊‍♂️',
    exampleEn: 'We go to the indoor swimming pool every Tuesday.',
    examplePl: 'Chodzimy na kryty basen w każdy wtorek.',
    level: 'grade4_6'
  },

  // Zdrowie i Ciało
  {
    id: 'g4_headache',
    en: 'headache',
    pl: 'ból głowy',
    category: 'body',
    phonetic: '[hedejk]',
    emoji: '🤕',
    exampleEn: 'I have got a bad headache, so I need to rest quietly.',
    examplePl: 'Mam mocny ból głowy, więc muszę spokojnie odpocząć.',
    level: 'grade4_6'
  },
  {
    id: 'g4_medicine',
    en: 'medicine',
    pl: 'lekarstwo',
    category: 'body',
    phonetic: '[medysyn]',
    emoji: '💊',
    exampleEn: 'You should take this medicine twice a day after lunch.',
    examplePl: 'Powinieneś przyjmować to lekarstwo dwa razy dziennie po obiedzie.',
    level: 'grade4_6'
  },
  {
    id: 'g4_dentist',
    en: 'dentist',
    pl: 'stomatolog / dentysta',
    category: 'body',
    phonetic: '[dentyst]',
    emoji: '🦷',
    exampleEn: 'I visit the friendly dentist every six months for a checkup.',
    examplePl: 'Odwiedzam miłego dentystę co pół roku na kontrolę.',
    level: 'grade4_6'
  },
  {
    id: 'g4_sore_throat',
    en: 'sore throat',
    pl: 'ból gardła',
    category: 'body',
    phonetic: '[sor trołt]',
    emoji: '🧣',
    exampleEn: 'Drink warm herbal tea with honey for your sore throat.',
    examplePl: 'Pij ciepłą herbatę ziołową z miodem na ból gardła.',
    level: 'grade4_6'
  },
  {
    id: 'g4_stomachache',
    en: 'stomach ache',
    pl: 'ból brzucha',
    category: 'body',
    phonetic: '[stamak ejk]',
    emoji: '🤢',
    exampleEn: 'Eating too much candy gave him a stomach ache.',
    examplePl: 'Zjedzenie zbyt wielu słodyczy wywołało u niego ból brzucha.',
    level: 'grade4_6'
  },
  {
    id: 'g4_fever',
    en: 'fever',
    pl: 'gorączka',
    category: 'body',
    phonetic: '[fiwer]',
    emoji: '🌡️',
    exampleEn: 'The doctor checked my temperature because I had a fever.',
    examplePl: 'Lekarz sprawdził moją temperaturę, ponieważ miałem gorączkę.',
    level: 'grade4_6'
  },

  // Przyroda i Krajobrazy
  {
    id: 'g4_mountain',
    en: 'mountain range',
    pl: 'pasmo górskie',
    category: 'environment_tech',
    phonetic: '[małntyn rejndż]',
    emoji: '🏔️',
    exampleEn: 'The Tatra Mountains are the highest mountain range in Poland.',
    examplePl: 'Tatry to najwyższe pasmo górskie w Polsce.',
    level: 'grade4_6'
  },
  {
    id: 'g4_thunderstorm',
    en: 'thunderstorm',
    pl: 'burza z piorunami',
    category: 'environment_tech',
    phonetic: '[tanderstorm]',
    emoji: '⛈️',
    exampleEn: 'There was a loud thunderstorm yesterday afternoon.',
    examplePl: 'Wczoraj po południu przeszła głośna burza z piorunami.',
    level: 'grade4_6'
  },
  {
    id: 'g4_waterfall',
    en: 'waterfall',
    pl: 'wodospad',
    category: 'environment_tech',
    phonetic: '[łoterfol]',
    emoji: '🌊',
    exampleEn: 'We took amazing pictures near the roaring waterfall.',
    examplePl: 'Zrobiliśmy niesamowite zdjęcia w pobliżu szumiącego wodospadu.',
    level: 'grade4_6'
  },
  {
    id: 'g4_desert',
    en: 'desert',
    pl: 'pustynia',
    category: 'environment_tech',
    phonetic: '[dezert]',
    emoji: '🏜️',
    exampleEn: 'Camels can survive without water in the hot desert.',
    examplePl: 'Wielbłądy potrafią przetrwać bez wody na gorącej pustyni.',
    level: 'grade4_6'
  },
  {
    id: 'g4_solar_panel',
    en: 'solar panel',
    pl: 'panel słoneczny',
    category: 'environment_tech',
    phonetic: '[sołlar panel]',
    emoji: '☀️',
    exampleEn: 'Solar panels generate green electricity from sunshine.',
    examplePl: 'Panele słoneczne produkują zieloną elektryczność ze słońca.',
    level: 'grade4_6'
  },

  // Szkoła i Obowiązki
  {
    id: 'g4_chores',
    en: 'do the washing-up',
    pl: 'zmywać naczynia',
    category: 'school',
    phonetic: '[du de łoszing ap]',
    emoji: '🧼',
    exampleEn: 'I always help my family and do the washing-up after dinner.',
    examplePl: 'Zawsze pomagam rodzinie i zmywam naczynia po obiedzie.',
    level: 'grade4_6'
  },
  {
    id: 'g4_tidy_room',
    en: 'tidy the room',
    pl: 'sprzątać pokój',
    category: 'school',
    phonetic: '[tajdi de rum]',
    emoji: '🧹',
    exampleEn: 'You should tidy your room before going to the playground.',
    examplePl: 'Powinieneś posprzątać swój pokój przed wyjściem na plac zabaw.',
    level: 'grade4_6'
  },
  {
    id: 'g4_timetable',
    en: 'timetable',
    pl: 'plan lekcji',
    category: 'school',
    phonetic: '[tajmtejbl]',
    emoji: '📅',
    exampleEn: 'Check the school timetable to see which books you need.',
    examplePl: 'Sprawdź plan lekcji, aby zobaczyć, jakich książek potrzebujesz.',
    level: 'grade4_6'
  },
  {
    id: 'g4_geography',
    en: 'geography',
    pl: 'geografia',
    category: 'school',
    phonetic: '[dżiografi]',
    emoji: '🌍',
    exampleEn: 'In geography class we study capital cities and continents.',
    examplePl: 'Na lekcji geografii uczymy się o stolicach i kontynentach.',
    level: 'grade4_6'
  },

  // Jedzenie i Restauracja
  {
    id: 'g4_salmon',
    en: 'grilled salmon',
    pl: 'grillowany łosoś',
    category: 'food',
    phonetic: '[gryld samon]',
    emoji: '🐟',
    exampleEn: 'Grilled salmon with lemon is a very healthy dish.',
    examplePl: 'Grillowany łosoś z cytryną to bardzo zdrowe danie.',
    level: 'grade4_6'
  },
  {
    id: 'g4_cereal',
    en: 'cereal with milk',
    pl: 'płatki śniadaniowe z mlekiem',
    category: 'food',
    phonetic: '[siryjal łif mylk]',
    emoji: '🥣',
    exampleEn: 'I usually eat cereal with milk for breakfast.',
    examplePl: 'Zazwyczaj jem płatki z mlekiem na śniadanie.',
    level: 'grade4_6'
  },
  {
    id: 'g4_pancakes',
    en: 'pancakes',
    pl: 'naleśniki',
    category: 'food',
    phonetic: '[pankejks]',
    emoji: '🥞',
    exampleEn: 'Grandma made delicious pancakes with maple syrup.',
    examplePl: 'Babcia zrobiła pyszne naleśniki z syropem klonowym.',
    level: 'grade4_6'
  },
  {
    id: 'g4_vegetables',
    en: 'fresh vegetables',
    pl: 'świeże warzywa',
    category: 'food',
    phonetic: '[fresz wedżteblz]',
    emoji: '🥦',
    exampleEn: 'Eating fresh vegetables every day keeps you energetic.',
    examplePl: 'Jedzenie świeżych warzyw każdego dnia dodaje energii.',
    level: 'grade4_6'
  }
];

// Zdania Klasy 4–6
export const SENTENCES_GRADE_4_6: SentenceItem[] = [
  {
    id: 's4_1',
    fullEn: 'Yesterday I went to the cinema with my best friends.',
    fullPl: 'Wczoraj poszedłem do kina z moimi najlepszymi przyjaciółmi.',
    words: ['Yesterday', 'I', 'went', 'to', 'the', 'cinema', 'with', 'my', 'best', 'friends.'],
    category: 'travel_places',
    hint: 'Past Simple dla przeszłości: "Yesterday I went..."',
    level: 'grade4_6'
  },
  {
    id: 's4_2',
    fullEn: 'She is reading an interesting adventure book right now.',
    fullPl: 'Ona czyta ciekawą książkę przygodową w tej chwili.',
    words: ['She', 'is', 'reading', 'an', 'interesting', 'adventure', 'book', 'right', 'now.'],
    category: 'actions',
    hint: 'Present Continuous dla czynności w tej chwili: "is reading ... right now".',
    level: 'grade4_6'
  },
  {
    id: 's4_3',
    fullEn: 'A fast cheetah is much quicker than a heavy lion.',
    fullPl: 'Szybki gepard jest znacznie szybszy niż ciężki lew.',
    words: ['A', 'fast', 'cheetah', 'is', 'much', 'quicker', 'than', 'a', 'heavy', 'lion.'],
    category: 'environment_tech',
    hint: 'Stopniowanie przymiotników z "than": "quicker than".',
    level: 'grade4_6'
  },
  {
    id: 's4_4',
    fullEn: 'You should stay in bed when you have got a fever.',
    fullPl: 'Powinieneś zostać w łóżku, gdy masz gorączkę.',
    words: ['You', 'should', 'stay', 'in', 'bed', 'when', 'you', 'have', 'got', 'a', 'fever.'],
    category: 'body',
    hint: 'Udzielanie porad z "should": "You should stay...".',
    level: 'grade4_6'
  },
  {
    id: 's4_5',
    fullEn: 'He always walks his dog before going to school.',
    fullPl: 'On zawsze wyprowadza swojego psa przed pójściem do szkoły.',
    words: ['He', 'always', 'walks', 'his', 'dog', 'before', 'going', 'to', 'school.'],
    category: 'school',
    hint: 'Present Simple z przysłówkiem częstotliwości: "always walks".',
    level: 'grade4_6'
  },
  {
    id: 's4_6',
    fullEn: 'My older brother wants to become an airplane pilot.',
    fullPl: 'Mój starszy brat chce zostać pilotem samolotu.',
    words: ['My', 'older', 'brother', 'wants', 'to', 'become', 'an', 'airplane', 'pilot.'],
    category: 'jobs_professions',
    hint: 'Plany zawodowe: "wants to become an airplane pilot".',
    level: 'grade4_6'
  },
  {
    id: 's4_7',
    fullEn: 'How much does this pair of sports shoes cost?',
    fullPl: 'Ile kosztuje ta para butów sportowych?',
    words: ['How', 'much', 'does', 'this', 'pair', 'of', 'sports', 'shoes', 'cost?'],
    category: 'food',
    hint: 'Pytanie o cenę: "How much does ... cost?".',
    level: 'grade4_6'
  }
];

// Odznaki Klasy 4–6
export const BADGES_GRADE_4_6: Badge[] = [
  { id: 'g4_b1', title: 'Młody Odkrywca', desc: '10 gwiazdek w klasach 4–6', icon: '🚀', requirementStars: 10, gradeLevel: 'grade4_6' },
  { id: 'g4_b2', title: 'Mistrz Past Simple', desc: '30 gwiazdek i opanowane formy przeszłe', icon: '⚡', requirementStars: 30, gradeLevel: 'grade4_6' },
  { id: 'g4_b3', title: 'Nawigator Miasta', desc: '60 gwiazdek w podróżach i zawodach', icon: '🧭', requirementStars: 60, gradeLevel: 'grade4_6' },
  { id: 'g4_b4', title: 'Ekspert Stopniowania', desc: '100 gwiazdek w gramatyce', icon: '📈', requirementStars: 100, gradeLevel: 'grade4_6' },
  { id: 'g4_b5', title: 'Kapitan Języka Angielskiego', desc: '150 gwiazdek – pełny sukces w klasach 4–6!', icon: '🏆', requirementStars: 150, gradeLevel: 'grade4_6' }
];

export const AVATARS_GRADE_4_6 = [
  { id: 'av_alex', name: 'Kadet Alex', emoji: '🚀', desc: 'Kosmiczny nawigator języka angielskiego' },
  { id: 'av_maya', name: 'Odkrywczyni Maya', emoji: '🧭', desc: 'Podróżniczka po miastach i zabytkach' },
  { id: 'av_max', name: 'Programista Max', emoji: '💻', desc: 'Mistrz technologii i logicznych reguł' },
  { id: 'av_zoe', name: 'Pilotka Zoe', emoji: '✈️', desc: 'Zawsze gotowa na podniebne wyzwania' },
  { id: 'av_sam', name: 'Naukowiec Sam', emoji: '🔬', desc: 'Ekspert od przyrody i eksperymentów' },
  { id: 'av_leo', name: 'Lider Drużyny Leo', emoji: '🦁', desc: 'Odważny przewodnik po gramatyce' }
];


// ============================================================================
// 2. KRAINY TEMATYCZNE DLA KLAS 7–8 & EGZAMIN CKE (ENGLISH PRO B1)
// ============================================================================
export const LANDS_GRADE_7_8: LandInfo[] = [
  {
    id: 'environment_tech',
    namePl: 'Nauka i Nowe Technologie',
    nameEn: 'Science & AI Technology',
    icon: '🤖',
    description: 'Sztuczna inteligencja, cyberbezpieczeństwo, algorytmy i przełomy technologiczne.',
    grammarFocus: 'Strona bierna (Passive Voice: is invented, was developed)',
    requiredStarsToUnlock: 0,
    themeColor: 'from-violet-600 to-indigo-900'
  },
  {
    id: 'culture_media',
    namePl: 'Społeczeństwo i Ekologia',
    nameEn: 'Society & Global Issues',
    icon: '🌍',
    description: 'Ochrona klimatu, wolontariat, prawa człowieka, odnawialne źródła i wyzwania XXI wieku.',
    grammarFocus: 'Okresy warunkowe: First & Second Conditional (If I had time...)',
    requiredStarsToUnlock: 10,
    themeColor: 'from-purple-700 to-slate-900'
  },
  {
    id: 'travel_places',
    namePl: 'Kultura, Sztuka i Media',
    nameEn: 'Culture, Media & Art',
    icon: '🎬',
    description: 'Recenzje filmowe, dzieła sztuki, social media, festiwale i literatura współczesna.',
    grammarFocus: 'Present Perfect (have already seen, just finished, since/for)',
    requiredStarsToUnlock: 20,
    themeColor: 'from-fuchsia-600 to-purple-900'
  },
  {
    id: 'body',
    namePl: 'Człowiek i Relacje',
    nameEn: 'Personality & Relationships',
    icon: '🤝',
    description: 'Cechy charakteru, emocje, empatia, budowanie relacji i radzenie sobie ze stresem.',
    grammarFocus: 'Czasowniki modalne: must, have to, shouldn\'t, might',
    requiredStarsToUnlock: 35,
    themeColor: 'from-rose-600 to-pink-900'
  },
  {
    id: 'school',
    namePl: 'Edukacja i Przyszłość',
    nameEn: 'Education & Future Careers',
    icon: '🎓',
    description: 'Egzamin ósmoklasisty, wybór szkoły średniej, stypendia, CV i rynek pracy.',
    grammarFocus: 'Mowa zależna (Reported Speech: said that he had...)',
    requiredStarsToUnlock: 50,
    themeColor: 'from-blue-600 to-slate-900'
  },
  {
    id: 'actions',
    namePl: 'Phrasal Verbs i Idiomy',
    nameEn: 'Phrasal Verbs & Idioms',
    icon: '⚡',
    description: 'Kluczowe zwroty frazowe do egzaminu CKE: give up, look forward to, run out of.',
    grammarFocus: 'Czasowniki złożone w kontekście egzaminacyjnym',
    requiredStarsToUnlock: 65,
    themeColor: 'from-amber-600 to-violet-900'
  },
  {
    id: 'food',
    namePl: 'Styl Życia i Zdrowie',
    nameEn: 'Global Lifestyle & Health',
    icon: '🥑',
    description: 'Zrównoważona dieta, kuchnie świata, mindfulness i zdrowe nawyki młodzieży.',
    grammarFocus: 'Zaimki względne: who, which, where, whose',
    requiredStarsToUnlock: 80,
    themeColor: 'from-emerald-600 to-slate-900'
  }
];

export const CATEGORIES_GRADE_7_8 = [
  { id: 'environment_tech' as CategoryId, namePl: 'Nauka i Nowe Technologie', nameEn: 'Science & AI Technology', icon: '🤖', description: 'AI, cyfryzacja i postęp' },
  { id: 'culture_media' as CategoryId, namePl: 'Społeczeństwo i Ekologia', nameEn: 'Society & Ecology', icon: '🌍', description: 'Ekologia, prawa i klimat' },
  { id: 'travel_places' as CategoryId, namePl: 'Kultura, Sztuka i Media', nameEn: 'Culture & Media', icon: '🎬', description: 'Film, sztuka i social media' },
  { id: 'body' as CategoryId, namePl: 'Człowiek i Relacje', nameEn: 'Personality & Feelings', icon: '🤝', description: 'Osobowość i relacje z ludźmi' },
  { id: 'school' as CategoryId, namePl: 'Edukacja i Przyszłość', nameEn: 'Education & Careers', icon: '🎓', description: 'Egzamin CKE, CV i kariera' },
  { id: 'actions' as CategoryId, namePl: 'Phrasal Verbs i Idiomy', nameEn: 'Phrasal Verbs', icon: '⚡', description: 'Kluczowe zwroty egzaminacyjne' },
  { id: 'food' as CategoryId, namePl: 'Styl Życia i Zdrowie', nameEn: 'Global Lifestyle', icon: '🥑', description: 'Zdrowie, dieta i świat' }
];

// Słownictwo Klasy 7–8 (Egzamin CKE B1)
export const VOCAB_GRADE_7_8_FULL: VocabItem[] = [
  // Nauka i Technologie
  {
    id: 'g7_ai',
    en: 'artificial intelligence',
    pl: 'sztuczna inteligencja',
    category: 'environment_tech',
    phonetic: '[artifyszyl intelidżens]',
    emoji: '🤖',
    exampleEn: 'Artificial intelligence is changing the way we learn languages.',
    examplePl: 'Sztuczna inteligencja zmienia sposób, w jaki uczymy się języków.',
    level: 'grade7_8'
  },
  {
    id: 'g7_cyber',
    en: 'cybersecurity',
    pl: 'cyberbezpieczeństwo',
    category: 'environment_tech',
    phonetic: '[sajbersekjuriti]',
    emoji: '🛡️',
    exampleEn: 'Strong passwords are vital for your cybersecurity.',
    examplePl: 'Silne hasła są kluczowe dla twojego cyberbezpieczeństwa.',
    level: 'grade7_8'
  },
  {
    id: 'g7_renewable',
    en: 'renewable energy',
    pl: 'energia odnawialna',
    category: 'environment_tech',
    phonetic: '[rinju-ebl enerdżi]',
    emoji: '💨',
    exampleEn: 'Solar panels and wind farms generate clean renewable energy.',
    examplePl: 'Panele słoneczne i farmy wiatrowe produkują czystą energię odnawialną.',
    level: 'grade7_8'
  },
  {
    id: 'g7_breakthrough',
    en: 'scientific breakthrough',
    pl: 'przełom naukowy',
    category: 'environment_tech',
    phonetic: '[sajentyfik brejktru]',
    emoji: '🔬',
    exampleEn: 'The team made a major scientific breakthrough in medicine.',
    examplePl: 'Zespół dokonał wielkiego przełomu naukowego w medycynie.',
    level: 'grade7_8'
  },
  {
    id: 'g7_virtual',
    en: 'virtual reality',
    pl: 'wirtualna rzeczywistość',
    category: 'environment_tech',
    phonetic: '[werczual rijaliti]',
    emoji: '🥽',
    exampleEn: 'Virtual reality allows students to explore historical museums remotely.',
    examplePl: 'Wirtualna rzeczywistość pozwala uczniom zdalnie zwiedzać historyczne muzea.',
    level: 'grade7_8'
  },

  // Społeczeństwo i Ekologia
  {
    id: 'g7_climate',
    en: 'climate change',
    pl: 'zmiany klimatu',
    category: 'culture_media',
    phonetic: '[klajmet czejndż]',
    emoji: '🌡️',
    exampleEn: 'Global leaders discuss urgent solutions to combat climate change.',
    examplePl: 'Światowi przywódcy dyskutują nad pilnymi rozwiązaniami w walce ze zmianami klimatu.',
    level: 'grade7_8'
  },
  {
    id: 'g7_volunteer',
    en: 'volunteer work',
    pl: 'wolontariat / praca społeczna',
    category: 'culture_media',
    phonetic: '[wolontir łork]',
    emoji: '🤝',
    exampleEn: 'Doing volunteer work helps young people build valuable life skills.',
    examplePl: 'Praca w wolontariacie pomaga młodym ludziom budować wartościowe umiejętności życiowe.',
    level: 'grade7_8'
  },
  {
    id: 'g7_human_rights',
    en: 'human rights',
    pl: 'prawa człowieka',
    category: 'culture_media',
    phonetic: '[hjuman rajts]',
    emoji: '⚖️',
    exampleEn: 'Every country has a legal obligation to protect human rights.',
    examplePl: 'Każdy kraj ma prawny obowiązek chronić prawa człowieka.',
    level: 'grade7_8'
  },
  {
    id: 'g7_deforestation',
    en: 'deforestation',
    pl: 'wylesianie / wycinka lasów',
    category: 'culture_media',
    phonetic: '[diforystejszyn]',
    emoji: '🪵',
    exampleEn: 'Deforestation threatens endangered animal species in the Amazon.',
    examplePl: 'Wylesianie zagraża zagrożonym gatunkom zwierząt w Amazonii.',
    level: 'grade7_8'
  },
  {
    id: 'g7_greenhouse',
    en: 'greenhouse effect',
    pl: 'efekt cieplarniany',
    category: 'culture_media',
    phonetic: '[grinhałs ifekt]',
    emoji: '🏭',
    exampleEn: 'Carbon emissions contribute directly to the greenhouse effect.',
    examplePl: 'Emisje dwutlenku węgla bezpośrednio przyczyniają się do efektu cieplarnianego.',
    level: 'grade7_8'
  },

  // Kultura, Media i Sztuka
  {
    id: 'g7_masterpiece',
    en: 'masterpiece',
    pl: 'arcydzieło',
    category: 'travel_places',
    phonetic: '[masterpis]',
    emoji: '🎨',
    exampleEn: 'The Mona Lisa is considered Leonardo da Vinci\'s masterpiece.',
    examplePl: 'Mona Lisa jest uważana za arcydzieło Leonarda da Vinci.',
    level: 'grade7_8'
  },
  {
    id: 'g7_review',
    en: 'film review',
    pl: 'recenzja filmu',
    category: 'travel_places',
    phonetic: '[film riwju]',
    emoji: '🎬',
    exampleEn: 'The critic wrote a favorable film review in yesterday\'s magazine.',
    examplePl: 'Krytyk napisał przychylną recenzję filmu we wczorajszym magazynie.',
    level: 'grade7_8'
  },
  {
    id: 'g7_exhibition',
    en: 'art exhibition',
    pl: 'wystawa sztuki',
    category: 'travel_places',
    phonetic: '[art eksybyszyn]',
    emoji: '🖼️',
    exampleEn: 'The modern art exhibition attracted thousands of visitors.',
    examplePl: 'Wystawa sztuki nowoczesnej przyciągnęła tysiące zwiedzających.',
    level: 'grade7_8'
  },
  {
    id: 'g7_influencer',
    en: 'social media influencer',
    pl: 'twórca internetowy / influencer',
    category: 'travel_places',
    phonetic: '[sołszyl midia influenser]',
    emoji: '📱',
    exampleEn: 'The popular influencer promoted eco-friendly shopping habits.',
    examplePl: 'Popularny influencer promował ekologiczne nawyki zakupowe.',
    level: 'grade7_8'
  },

  // Człowiek i Relacje (Personality)
  {
    id: 'g7_ambitious',
    en: 'ambitious',
    pl: 'ambitny',
    category: 'body',
    phonetic: '[ambyszes]',
    emoji: '🎯',
    exampleEn: 'She is an ambitious student who dreams of studying medicine.',
    examplePl: 'Ona jest ambitną uczennicą, która marzy o studiowaniu medycyny.',
    level: 'grade7_8'
  },
  {
    id: 'g7_reliable',
    en: 'reliable',
    pl: 'niezawodny / rzetelny',
    category: 'body',
    phonetic: '[rylajebl]',
    emoji: '🤝',
    exampleEn: 'A reliable friend always keeps promises and supports you.',
    examplePl: 'Niezawodny przyjaciel zawsze dotrzymuje obietnic i wspiera cię.',
    level: 'grade7_8'
  },
  {
    id: 'g7_trustworthy',
    en: 'trustworthy',
    pl: 'godny zaufania',
    category: 'body',
    phonetic: '[trastłerdi]',
    emoji: '⭐',
    exampleEn: 'He proved to be a trustworthy partner in our school project.',
    examplePl: 'Okazał się partnerem godnym zaufania w naszym szkolnym projekcie.',
    level: 'grade7_8'
  },
  {
    id: 'g7_stubborn',
    en: 'stubborn',
    pl: 'uparty',
    category: 'body',
    phonetic: '[staborn]',
    emoji: '🦙',
    exampleEn: 'He is so stubborn that he rarely admits when he is wrong.',
    examplePl: 'Jest tak uparty, że rzadko przyznaje się do błędu.',
    level: 'grade7_8'
  },

  // Edukacja i Kariera
  {
    id: 'g7_qualification',
    en: 'qualification',
    pl: 'kwalifikacja / uprawnienie',
    category: 'school',
    phonetic: '[kłolifikajszyn]',
    emoji: '📜',
    exampleEn: 'Language certificates provide an excellent qualification for the future.',
    examplePl: 'Certyfikaty językowe zapewniają doskonałą kwalifikację na przyszłość.',
    level: 'grade7_8'
  },
  {
    id: 'g7_scholarship',
    en: 'scholarship',
    pl: 'stypendium naukowe',
    category: 'school',
    phonetic: '[skolarszyp]',
    emoji: '🎓',
    exampleEn: 'She was awarded a prestigious scholarship for her high grades.',
    examplePl: 'Przyznano jej prestiżowe stypendium za wysokie oceny.',
    level: 'grade7_8'
  },
  {
    id: 'g7_interview',
    en: 'job interview',
    pl: 'rozmowa kwalifikacyjna',
    category: 'school',
    phonetic: '[dżob interwju]',
    emoji: '💼',
    exampleEn: 'Prepare concise answers before attending a job interview.',
    examplePl: 'Przygotuj zwięzłe odpowiedzi przed pójściem na rozmowę kwalifikacyjną.',
    level: 'grade7_8'
  },

  // Phrasal Verbs
  {
    id: 'g7_give_up',
    en: 'give up',
    pl: 'poddać się / zrezygnować',
    category: 'actions',
    phonetic: '[gyw ap]',
    emoji: '🏳️',
    exampleEn: 'Never give up on your dreams, even when difficulties arise.',
    examplePl: 'Nigdy nie rezygnuj ze swoich marzeń, nawet gdy pojawiają się trudności.',
    level: 'grade7_8'
  },
  {
    id: 'g7_look_forward',
    en: 'look forward to',
    pl: 'nie móc się doczekać',
    category: 'actions',
    phonetic: '[luk forłard tu]',
    emoji: '🤩',
    exampleEn: 'I am looking forward to our trip to Oxford next month.',
    examplePl: 'Nie mogę się doczekać naszej wycieczki do Oksfordu w przyszłym miesiącu.',
    level: 'grade7_8'
  },
  {
    id: 'g7_run_out',
    en: 'run out of',
    pl: 'wyczerpać / skończyć się',
    category: 'actions',
    phonetic: '[ran ałt of]',
    emoji: '⏳',
    exampleEn: 'We have run out of time during the English grammar exam.',
    examplePl: 'Skończył nam się czas podczas egzaminu z gramatyki angielskiej.',
    level: 'grade7_8'
  },
  {
    id: 'g7_turn_down',
    en: 'turn down',
    pl: 'odrzucić (np. ofertę) / ściszyć',
    category: 'actions',
    phonetic: '[tern dałn]',
    emoji: '❌',
    exampleEn: 'She decided to turn down the job offer in another city.',
    examplePl: 'Zdecydowała się odrzucić ofertę pracy w innym mieście.',
    level: 'grade7_8'
  },

  // Styl Życia i Zdrowie
  {
    id: 'g7_meditation',
    en: 'mindfulness meditation',
    pl: 'trening uważności / medytacja',
    category: 'food',
    phonetic: '[majndfulnes meditejszyn]',
    emoji: '🧘',
    exampleEn: 'Daily meditation helps teenagers reduce exam stress effectively.',
    examplePl: 'Codzienna medytacja skutecznie pomaga nastolatkom redukować stres egzaminacyjny.',
    level: 'grade7_8'
  },
  {
    id: 'g7_nutrition',
    en: 'balanced nutrition',
    pl: 'zrównoważone odżywianie',
    category: 'food',
    phonetic: '[balanst njutryszyn]',
    emoji: '🥗',
    exampleEn: 'Balanced nutrition provides proper energy for studying and sports.',
    examplePl: 'Zrównoważone odżywianie zapewnia odpowiednią energię do nauki i sportu.',
    level: 'grade7_8'
  }
];

// Zdania Klasy 7–8 & CKE
export const SENTENCES_GRADE_7_8: SentenceItem[] = [
  {
    id: 's7_1',
    fullEn: 'If I had more free time, I would learn Spanish.',
    fullPl: 'Gdybym miał więcej wolnego czasu, uczyłbym się hiszpańskiego.',
    words: ['If', 'I', 'had', 'more', 'free', 'time,', 'I', 'would', 'learn', 'Spanish.'],
    category: 'culture_media',
    hint: 'Drugi okres warunkowy (Second Conditional): If + Past Simple, would + bezokolicznik.',
    level: 'grade7_8'
  },
  {
    id: 's7_2',
    fullEn: 'The smartphone was invented in the twenty-first century.',
    fullPl: 'Smartfon został wynaleziony w dwudziestym pierwszym wieku.',
    words: ['The', 'smartphone', 'was', 'invented', 'in', 'the', 'twenty-first', 'century.'],
    category: 'environment_tech',
    hint: 'Strona bierna w czasie przeszłym (Past Simple Passive): was/were + III forma.',
    level: 'grade7_8'
  },
  {
    id: 's7_3',
    fullEn: 'She has already lived in London for five years.',
    fullPl: 'Ona mieszka w Londynie już od pięciu lat.',
    words: ['She', 'has', 'already', 'lived', 'in', 'London', 'for', 'five', 'years.'],
    category: 'travel_places',
    hint: 'Czas Present Perfect z określeniem trwania: has + III forma + for five years.',
    level: 'grade7_8'
  },
  {
    id: 's7_4',
    fullEn: 'If it rains tomorrow, we will stay at home.',
    fullPl: 'Jeśli jutro będzie padać, zostaniemy w domu.',
    words: ['If', 'it', 'rains', 'tomorrow,', 'we', 'will', 'stay', 'at', 'home.'],
    category: 'culture_media',
    hint: 'Pierwszy okres warunkowy (First Conditional): If + Present Simple, will + bezokolicznik.',
    level: 'grade7_8'
  },
  {
    id: 's7_5',
    fullEn: 'He said that he had never seen such a robot.',
    fullPl: 'Powiedział, że nigdy wcześniej nie widział takiego robota.',
    words: ['He', 'said', 'that', 'he', 'had', 'never', 'seen', 'such', 'a', 'robot.'],
    category: 'environment_tech',
    hint: 'Mowa zależna (Reported Speech): cofnięcie czasu do Past Perfect (had seen).',
    level: 'grade7_8'
  },
  {
    id: 's7_6',
    fullEn: 'We have run out of printer paper in the office.',
    fullPl: 'Skończył nam się papier do drukarki w biurze.',
    words: ['We', 'have', 'run', 'out', 'of', 'printer', 'paper', 'in', 'the', 'office.'],
    category: 'actions',
    hint: 'Phrasal verb: run out of (skończyć się, wyczerpać).',
    level: 'grade7_8'
  },
  {
    id: 's7_7',
    fullEn: 'You must not use your phone during the CKE exam.',
    fullPl: 'Nie wolno ci używać telefonu podczas egzaminu CKE.',
    words: ['You', 'must', 'not', 'use', 'your', 'phone', 'during', 'the', 'CKE', 'exam.'],
    category: 'school',
    hint: 'Czasownik modalny zakazu: "must not use".',
    level: 'grade7_8'
  }
];

// Odznaki Klasy 7–8
export const BADGES_GRADE_7_8: Badge[] = [
  { id: 'g7_b1', title: 'Aspirant Ósmoklasisty', desc: '10 gwiazdek w module CKE', icon: '🎓', requirementStars: 10, gradeLevel: 'grade7_8' },
  { id: 'g7_b2', title: 'Mistrz Parafraz', desc: '30 gwiazdek i perfekcyjne transformacje zdań', icon: '📝', requirementStars: 30, gradeLevel: 'grade7_8' },
  { id: 'g7_b3', title: 'Ekspert Conditionals', desc: '60 gwiazdek w okresach warunkowych', icon: '🔮', requirementStars: 60, gradeLevel: 'grade7_8' },
  { id: 'g7_b4', title: 'Władca Phrasal Verbs', desc: '100 gwiazdek w zaawansowanym słownictwie', icon: '⚡', requirementStars: 100, gradeLevel: 'grade7_8' },
  { id: 'g7_b5', title: 'Prymus Egzaminu CKE B1', desc: '150 gwiazdek – 100% gotowości do egzaminu!', icon: '👑', requirementStars: 150, gradeLevel: 'grade7_8' }
];

export const AVATARS_GRADE_7_8 = [
  { id: 'av_cke_master', name: 'Mistrz CKE', emoji: '🎓', desc: 'Ekspert od arkuszy egzaminacyjnych' },
  { id: 'av_linguist', name: 'Młody Lingwista', emoji: '📚', desc: 'Pasjonat etymologii i gramatyki' },
  { id: 'av_ai_analyst', name: 'Analityk AI', emoji: '🤖', desc: 'Łączy języki obce z nowymi technologiami' },
  { id: 'av_diplomat', name: 'Młody Dyplomata', emoji: '🌍', desc: 'Perfekcyjny w dyskusji i negocjacjach' },
  { id: 'av_journalist', name: 'Reporter Śledczy', emoji: '🎙️', desc: 'Zawsze zadaje celne pytania po angielsku' },
  { id: 'av_scholar', name: 'Stypendysta Oxbridge', emoji: '🏛️', desc: 'Dąży do najwyższych wyników z certyfikatów' }
];

// ============================================================================
// HELPER SELECTORS BY GRADE LEVEL
// ============================================================================
export function getLandsForGrade(grade: GradeLevel): LandInfo[] {
  if (grade === 'grade4_6') return LANDS_GRADE_4_6;
  if (grade === 'grade7_8') return LANDS_GRADE_7_8;
  return LANDS_G3;
}

export function getCategoriesForGrade(grade: GradeLevel) {
  if (grade === 'grade4_6') return CATEGORIES_GRADE_4_6;
  if (grade === 'grade7_8') return CATEGORIES_GRADE_7_8;
  return CATEGORIES_G3;
}

export function getVocabularyForGrade(grade: GradeLevel): VocabItem[] {
  if (grade === 'grade4_6') return VOCAB_GRADE_4_6_FULL;
  if (grade === 'grade7_8') return VOCAB_GRADE_7_8_FULL;
  return VOCAB_G3;
}

export function getSentencesForGrade(grade: GradeLevel): SentenceItem[] {
  if (grade === 'grade4_6') return SENTENCES_GRADE_4_6;
  if (grade === 'grade7_8') return SENTENCES_GRADE_7_8;
  return SENTENCES_G3;
}

export function getBadgesForGrade(grade: GradeLevel): Badge[] {
  if (grade === 'grade4_6') return BADGES_GRADE_4_6;
  if (grade === 'grade7_8') return BADGES_GRADE_7_8;
  return BADGES_G3;
}

export function getAvatarsForGrade(grade: GradeLevel) {
  if (grade === 'grade4_6') return AVATARS_GRADE_4_6;
  if (grade === 'grade7_8') return AVATARS_GRADE_7_8;
  // Grade 3 Default Avatars
  return [
    { id: 'av_leo', name: 'Lisek Leo', emoji: '🦊', desc: 'Wesoły przewodnik po krainach słówek' },
    { id: 'av_owl', name: 'Sówka Pola', emoji: '🦉', desc: 'Mądra nauczycielka poprawnej wymowy' },
    { id: 'av_dog', name: 'Piesek Bąbel', emoji: '🐶', desc: 'Wierny przyjaciel w trudnych zadaniach' },
    { id: 'av_cat', name: 'Kotek Puszek', emoji: '🐱', desc: 'Szybki w układaniu literek' },
    { id: 'av_bear', name: 'Miś Bruno', emoji: '🐻', desc: 'Cierpliwy mistrz pamięci Memory' },
    { id: 'av_rabbit', name: 'Króliczek Tuptuś', emoji: '🐰', desc: 'Skacze prosto po złote gwiazdki' }
  ];
}

export function getDailyTasksForGrade(grade: GradeLevel, dateStr: string): DailyTask[] {
  if (grade === 'grade4_6') {
    return [
      {
        id: `daily-${dateStr}-irreg-1`,
        type: 'irregular_verbs_practiced',
        title: 'Formy Nieregularne Past Simple',
        description: 'Przećwicz 3 czasowniki w Trenerze Czasowników Nieregularnych',
        icon: '⚡',
        target: 3,
        targetMode: 'irregular_verbs',
        rewardXp: 50,
        rewardStars: 5,
        isClaimed: false,
        current: 0
      },
      {
        id: `daily-${dateStr}-sent-2`,
        type: 'sentences_built',
        title: 'Architekt Zdań (Past & Present)',
        description: 'Ułóż 2 zdania w Fabryce Zdań dla klas 4–6',
        icon: '🧩',
        target: 2,
        targetMode: 'sentences',
        rewardXp: 45,
        rewardStars: 4,
        isClaimed: false,
        current: 0
      },
      {
        id: `daily-${dateStr}-quiz-3`,
        type: 'quiz_answers',
        title: 'Quiz Miasto & Zawody',
        description: 'Odpowiedz poprawnie na 4 pytania w Quizie dla klas 4–6',
        icon: '🏆',
        target: 4,
        targetMode: 'quiz',
        rewardXp: 40,
        rewardStars: 4,
        isClaimed: false,
        current: 0
      }
    ];
  }

  if (grade === 'grade7_8') {
    return [
      {
        id: `daily-${dateStr}-cke-1`,
        type: 'cke_tasks_solved',
        title: 'Zadania CKE Ósmoklasisty',
        description: 'Rozwiąż poprawnie 2 zadania typu egzaminacyjnego CKE (parafrazy / luki)',
        icon: '🎓',
        target: 2,
        targetMode: 'cke_exam',
        rewardXp: 60,
        rewardStars: 6,
        isClaimed: false,
        current: 0
      },
      {
        id: `daily-${dateStr}-sent-2`,
        type: 'sentences_built',
        title: 'Złożone Zdania B1 & Conditionals',
        description: 'Zbuduj 2 zdania z okresami warunkowymi lub stroną bierną',
        icon: '🧩',
        target: 2,
        targetMode: 'sentences',
        rewardXp: 50,
        rewardStars: 5,
        isClaimed: false,
        current: 0
      },
      {
        id: `daily-${dateStr}-quiz-3`,
        type: 'quiz_answers',
        title: 'Słownictwo Egzaminacyjne CKE',
        description: 'Odpowiedz na 4 pytania z technologii, kultury i społeczeństwa',
        icon: '🏆',
        target: 4,
        targetMode: 'quiz',
        rewardXp: 45,
        rewardStars: 5,
        isClaimed: false,
        current: 0
      }
    ];
  }

  // Grade 3 Default
  return [
    {
      id: `daily-${dateStr}-sent-g3`,
      type: 'sentences_built',
      title: 'Fabryka Prostych Zdań',
      description: 'Ułóż 2 zdania w Fabryce Zdań z Liskiem Leo',
      icon: '🧩',
      target: 2,
      targetMode: 'sentences',
      rewardXp: 50,
      rewardStars: 5,
      isClaimed: false,
      current: 0
    },
    {
      id: `daily-${dateStr}-spell-g3`,
      type: 'words_spelled',
      title: 'Balonikowe Literkowanie',
      description: 'Przeliteruj 3 słówka z zapisem fonetycznym',
      icon: '🎈',
      target: 3,
      targetMode: 'spelling',
      rewardXp: 45,
      rewardStars: 4,
      isClaimed: false,
      current: 0
    },
    {
      id: `daily-${dateStr}-quiz-g3`,
      type: 'quiz_answers',
      title: 'Wesoły Quiz Obrazkowy',
      description: 'Odpowiedz poprawnie na 4 pytania z 7 Krain',
      icon: '🏆',
      target: 4,
      targetMode: 'quiz',
      rewardXp: 40,
      rewardStars: 4,
      isClaimed: false,
      current: 0
    }
  ];
}
