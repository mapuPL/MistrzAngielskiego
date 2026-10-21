import { GradeLevel, IrregularVerb, CkeExamItem, VocabItem, SentenceItem } from '../types';

export interface GradeThemeConfig {
  id: GradeLevel;
  name: string;
  badgeLabel: string;
  ageRange: string;
  tagline: string;
  description: string;
  mascotEmoji: string;
  mascotName: string;
  headerBg: string;
  appBg: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  headingColor: string;
  primaryButton: string;
  accentBadge: string;
  heroGradient: string;
  accentGlow: string;
  features: string[];
}

export const GRADE_CONFIGS: Record<GradeLevel, GradeThemeConfig> = {
  grade3: {
    id: 'grade3',
    name: 'Klasa 3',
    badgeLabel: 'Podstawa · Klasa 3',
    ageRange: '8–9 lat',
    tagline: 'Wesoła Kraina Angielskich Słówek z Liskiem Leo',
    description: 'Bajkowy świat z fonetycznym zapisem, zwierzątkami, przyborami szkolnymi, balonikami i prostymi zdaniami.',
    mascotEmoji: '🦊',
    mascotName: 'Lisek Leo',
    headerBg: 'bg-white/95 border-amber-200/70',
    appBg: 'bg-amber-50/50',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200/80',
    textColor: 'text-slate-800',
    headingColor: 'text-amber-950',
    primaryButton: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
    accentBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    heroGradient: 'from-amber-400 via-amber-300 to-orange-400 border-amber-300 text-amber-950',
    accentGlow: 'ring-amber-300',
    features: ['7 Magicznych Krain', 'Balonikowe Literkowanie', 'Fonetyka w nawiasie [dog]', 'Gra Memory', 'Fabryka Zdań']
  },
  grade4_6: {
    id: 'grade4_6',
    name: 'Klasy 4–6',
    badgeLabel: 'Średniozaawansowany · Klasy 4–6',
    ageRange: '10–12 lat',
    tagline: 'English Explorer – Czasowniki Nieregularne & Gramatyka',
    description: 'Dynamiczne wyzwania językowe: Present vs Past Simple, stopniowanie przymiotników, miasto, zawody i Trener Czasowników Nieregularnych.',
    mascotEmoji: '🚀',
    mascotName: 'Kadet Alex',
    headerBg: 'bg-white/95 border-cyan-200/80',
    appBg: 'bg-sky-50/40',
    cardBg: 'bg-white',
    cardBorder: 'border-cyan-200/90',
    textColor: 'text-slate-800',
    headingColor: 'text-cyan-950',
    primaryButton: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white',
    accentBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    heroGradient: 'from-cyan-600 via-sky-600 to-indigo-600 border-cyan-400 text-white',
    accentGlow: 'ring-cyan-400',
    features: ['Trener Czasowników Nieregularnych', 'Present vs Past Simple', 'Stopniowanie: big, bigger, biggest', 'Miasto, zawody i podróże']
  },
  grade7_8: {
    id: 'grade7_8',
    name: 'Klasy 7–8 & Egzamin CKE',
    badgeLabel: 'Egzamin Ósmoklasisty CKE',
    ageRange: '13–15 lat',
    tagline: 'English Pro – Przygotowanie do Egzaminu Ósmoklasisty',
    description: 'Nowoczesny moduł egzaminacyjny B1: parafrazy zdań, Present Perfect, Conditionals, phrasal verbs i zadania typu CKE.',
    mascotEmoji: '🎓',
    mascotName: 'Mistrz CKE',
    headerBg: 'bg-slate-900 border-slate-700 shadow-md',
    appBg: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-800',
    textColor: 'text-slate-100',
    headingColor: 'text-white',
    primaryButton: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold',
    accentBadge: 'bg-violet-950/90 text-violet-200 border-violet-700',
    heroGradient: 'from-slate-900 via-indigo-950 to-slate-900 border-violet-600/50 text-white',
    accentGlow: 'ring-violet-500',
    features: ['Trening Parafraz CKE', 'Uzupełnianie luk gramatycznych', 'Present Perfect & Conditionals', 'Phrasal Verbs & Idiomy']
  }
};

import { ALL_IRREGULAR_VERBS } from './irregularVerbs';
export const IRREGULAR_VERBS: IrregularVerb[] = ALL_IRREGULAR_VERBS;

export const CKE_EXAM_ITEMS: CkeExamItem[] = [
  {
    id: 'cke1',
    type: 'transformation',
    instruction: 'Uzupełnij drugie zdanie tak, aby znaczyło to samo co pierwsze (użyj od 2 do 3 wyrazów).',
    sentenceBefore: 'I have never visited London before.',
    bracketPrompt: 'TIME',
    sentenceAfter: 'This is the __________ I have visited London.',
    correctAnswer: 'first time',
    acceptableAnswers: ['first time'],
    hint: 'Konstrukcja „This is the first time...” z Present Perfect.',
    explanation: 'Zwrot „This is the first time I have visited...” oznacza „To pierwszy raz, kiedy odwiedzam...”.'
  },
  {
    id: 'cke2',
    type: 'translation',
    instruction: 'Przetłumacz fragment w nawiasie na język angielski, zachowując poprawność gramatyczną.',
    sentenceBefore: 'If it rains tomorrow, we',
    bracketPrompt: 'zostaniemy w domu',
    sentenceAfter: '.',
    correctAnswer: 'will stay at home',
    acceptableAnswers: ['will stay at home', "will stay home"],
    hint: 'Pierwszy okres warunkowy (First Conditional): If + Present Simple, will + bezokolicznik.',
    explanation: 'W First Conditional w części głównej używamy will + bezokolicznik: „will stay at home”.'
  },
  {
    id: 'cke3',
    type: 'gap_fill',
    instruction: 'Uzupełnij lukę w zdaniu odpowiednią formą wyrazu w nawiasie.',
    sentenceBefore: 'This is the',
    bracketPrompt: 'INTERESTING',
    sentenceAfter: 'book I have ever read.',
    correctAnswer: 'most interesting',
    acceptableAnswers: ['most interesting'],
    hint: 'Stopień najwyższy przymiotnika wielosylabowego (superlative).',
    explanation: 'Dla długich przymiotników stopień najwyższy tworzymy dodając „the most”: „the most interesting”.'
  },
  {
    id: 'cke4',
    type: 'transformation',
    instruction: 'Wykorzystaj podane słowo i uzupełnij drugie zdanie (parafraza CKE).',
    sentenceBefore: 'The coffee is too hot to drink.',
    bracketPrompt: 'ENOUGH',
    sentenceAfter: 'The coffee is not __________ to drink.',
    correctAnswer: 'cool enough',
    acceptableAnswers: ['cool enough', 'cold enough'],
    hint: 'Przeciwieństwo „too hot” to „not cool/cold enough”.',
    explanation: 'Przymiotnik stawia się przed „enough”: „not cool enough” lub „not cold enough”.'
  },
  {
    id: 'cke5',
    type: 'translation',
    instruction: 'Przetłumacz fragment w nawiasie na język angielski.',
    sentenceBefore: 'She told me that she',
    bracketPrompt: 'nigdy nie była',
    sentenceAfter: 'to Spain before.',
    correctAnswer: 'had never been',
    acceptableAnswers: ['had never been'],
    hint: 'Mowa zależna (Reported Speech) / czas zaprzeszły Past Perfect.',
    explanation: 'Czas cofa się z Present Perfect na Past Perfect: „had never been”.'
  },
  {
    id: 'cke6',
    type: 'gap_fill',
    instruction: 'Uzupełnij lukę odpowiednią formą czasownika.',
    sentenceBefore: 'The telephone',
    bracketPrompt: 'INVENT',
    sentenceAfter: 'by Alexander Graham Bell in 1876.',
    correctAnswer: 'was invented',
    acceptableAnswers: ['was invented'],
    hint: 'Strona bierna w czasie Past Simple (Past Passive: was/were + 3. forma).',
    explanation: 'Wynalazek w przeszłości: „was invented by...”.'
  }
];

export const VOCAB_GRADE_4_6: VocabItem[] = [
  {
    id: 'g4_airport',
    en: 'airport',
    pl: 'lotnisko',
    category: 'travel_places',
    phonetic: '[erport]',
    emoji: '✈️',
    exampleEn: 'We arrived at the airport on time.',
    examplePl: 'Przyjechaliśmy na lotnisko na czas.',
    level: 'grade4_6'
  },
  {
    id: 'g4_train_station',
    en: 'train station',
    pl: 'stacja kolejowa / dworzec',
    category: 'travel_places',
    phonetic: '[trejn stejszyn]',
    emoji: '🚉',
    exampleEn: 'The fast train leaves from platform two.',
    examplePl: 'Szybki pociąg odjeżdża z peronu drugiego.',
    level: 'grade4_6'
  },
  {
    id: 'g4_scientist',
    en: 'scientist',
    pl: 'naukowiec',
    category: 'jobs_professions',
    phonetic: '[sajentyst]',
    emoji: '🔬',
    exampleEn: 'The scientist conducts exciting experiments.',
    examplePl: 'Naukowiec przeprowadza ekscytujące eksperymenty.',
    level: 'grade4_6'
  },
  {
    id: 'g4_architect',
    en: 'architect',
    pl: 'architekt',
    category: 'jobs_professions',
    phonetic: '[arkitekt]',
    emoji: '📐',
    exampleEn: 'An architect designs modern buildings.',
    examplePl: 'Architekt projektuje nowoczesne budynki.',
    level: 'grade4_6'
  },
  {
    id: 'g4_luggage',
    en: 'luggage',
    pl: 'bagaż',
    category: 'travel_places',
    phonetic: '[lagydż]',
    emoji: '🧳',
    exampleEn: 'Pack your heavy luggage carefully.',
    examplePl: 'Spakuj uważnie swój ciężki bagaż.',
    level: 'grade4_6'
  },
  {
    id: 'g4_supermarket',
    en: 'supermarket',
    pl: 'supermarket',
    category: 'travel_places',
    phonetic: '[supermarket]',
    emoji: '🛒',
    exampleEn: 'We bought fresh groceries at the supermarket.',
    examplePl: 'Kupiliśmy świeże zakupy w supermarkecie.',
    level: 'grade4_6'
  }
];

export const VOCAB_GRADE_7_8: VocabItem[] = [
  {
    id: 'g7_environment',
    en: 'environment',
    pl: 'środowisko naturalne',
    category: 'environment_tech',
    phonetic: '[enwajronment]',
    emoji: '🌍',
    exampleEn: 'We must protect our natural environment.',
    examplePl: 'Musimy chronić nasze środowisko naturalne.',
    level: 'grade7_8'
  },
  {
    id: 'g7_renewable_energy',
    en: 'renewable energy',
    pl: 'energia odnawialna',
    category: 'environment_tech',
    phonetic: '[rinjuabl enderdżi]',
    emoji: '⚡',
    exampleEn: 'Solar panels generate clean renewable energy.',
    examplePl: 'Panele słoneczne wytwarzają czystą energię odnawialną.',
    level: 'grade7_8'
  },
  {
    id: 'g7_artificial_intelligence',
    en: 'artificial intelligence',
    pl: 'sztuczna inteligencja',
    category: 'environment_tech',
    phonetic: '[artifyszyl inteligens]',
    emoji: '🤖',
    exampleEn: 'Artificial intelligence transforms modern science.',
    examplePl: 'Sztuczna inteligencja zmienia współczesną naukę.',
    level: 'grade7_8'
  },
  {
    id: 'g7_achievement',
    en: 'achievement',
    pl: 'osiągnięcie / sukces',
    category: 'culture_media',
    phonetic: '[ecziwment]',
    emoji: '🏅',
    exampleEn: 'Passing the exam was a great achievement.',
    examplePl: 'Zdanie egzaminu było wspaniałym osiągnięciem.',
    level: 'grade7_8'
  },
  {
    id: 'g7_opportunity',
    en: 'opportunity',
    pl: 'szansa / okazja',
    category: 'culture_media',
    phonetic: '[oportjuniti]',
    emoji: '🎯',
    exampleEn: 'Studying abroad is a fantastic opportunity.',
    examplePl: 'Studia za granicą to fantastyczna szansa.',
    level: 'grade7_8'
  }
];

export const SENTENCE_QUESTS_4_6: SentenceItem[] = [
  {
    id: 's4_1',
    fullEn: 'Yesterday I went to the cinema with my friends.',
    fullPl: 'Wczoraj poszedłem do kina z przyjaciółmi.',
    words: ['Yesterday', 'I', 'went', 'to', 'the', 'cinema', 'with', 'my', 'friends.'],
    category: 'travel_places',
    hint: 'Czas przeszły Past Simple z czasem określonym: „Yesterday I went...”',
    level: 'grade4_6'
  },
  {
    id: 's4_2',
    fullEn: 'She is reading an interesting book right now.',
    fullPl: 'Ona czyta ciekawą książkę w tej chwili.',
    words: ['She', 'is', 'reading', 'an', 'interesting', 'book', 'right', 'now.'],
    category: 'actions',
    hint: 'Czynność dziejąca się w tej chwili: Present Continuous (is + reading + right now).',
    level: 'grade4_6'
  },
  {
    id: 's4_3',
    fullEn: 'A cheetah is much faster than a lion.',
    fullPl: 'Gepard jest znacznie szybszy niż lew.',
    words: ['A', 'cheetah', 'is', 'much', 'faster', 'than', 'a', 'lion.'],
    category: 'animals',
    hint: 'Stopniowanie przymiotnika z „than”: „faster than a lion.”',
    level: 'grade4_6'
  }
];

export const SENTENCE_QUESTS_7_8: SentenceItem[] = [
  {
    id: 's7_1',
    fullEn: 'I have lived in this city for five years.',
    fullPl: 'Mieszkam w tym mieście od pięciu lat.',
    words: ['I', 'have', 'lived', 'in', 'this', 'city', 'for', 'five', 'years.'],
    category: 'family_home',
    hint: 'Present Perfect z określeniem trwania „for five years”.',
    level: 'grade7_8'
  },
  {
    id: 's7_2',
    fullEn: 'If you study hard, you will pass the exam.',
    fullPl: 'Jeśli będziesz pilnie się uczyć, zdasz egzamin.',
    words: ['If', 'you', 'study', 'hard,', 'you', 'will', 'pass', 'the', 'exam.'],
    category: 'school',
    hint: 'First Conditional: If + Present Simple, will + bezokolicznik.',
    level: 'grade7_8'
  },
  {
    id: 's7_3',
    fullEn: 'The project was completed by the scientific team.',
    fullPl: 'Projekt został ukończony przez zespół naukowy.',
    words: ['The', 'project', 'was', 'completed', 'by', 'the', 'scientific', 'team.'],
    category: 'environment_tech',
    hint: 'Strona bierna (Passive voice): was completed by...',
    level: 'grade7_8'
  }
];
