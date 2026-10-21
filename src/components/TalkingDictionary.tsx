import React, { useState, useMemo } from 'react';
import { CategoryId, VocabItem, GradeLevel } from '../types';
import { getCategoriesForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import { Search, Volume2, ArrowLeft } from 'lucide-react';

interface TalkingDictionaryProps {
  currentGrade: GradeLevel;
  soundEnabled: boolean;
  onBackToMenu?: () => void;
  onPracticeWord?: (word: VocabItem) => void;
  onListenWord?: () => void;
}

export const TalkingDictionary: React.FC<TalkingDictionaryProps> = ({
  currentGrade,
  soundEnabled,
  onBackToMenu,
  onListenWord
}) => {
  const categories = useMemo(() => getCategoriesForGrade(currentGrade), [currentGrade]);
  const vocabulary = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const filteredWords = vocabulary.filter((word) => {
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      word.en.toLowerCase().includes(query) ||
      word.pl.toLowerCase().includes(query) ||
      word.phonetic.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (word: VocabItem) => {
    soundManager.playClick(!soundEnabled);
    if (onListenWord) onListenWord();
    setActiveWordId(word.id);
    speakEnglish(word.en, 0.85, () => {
      setActiveWordId(null);
    });
  };

  const handleSpeakSentence = (sentence: string) => {
    soundManager.playClick(!soundEnabled);
    speakEnglish(sentence);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Search */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border ${gradeConfig.cardBorder} shadow-xs space-y-4`}>
        {onBackToMenu && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wróć do mapy</span>
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gradeConfig.accentBadge}`}>
                {gradeConfig.name}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Liczba słówek: <strong className="text-amber-500 font-mono">{filteredWords.length}</strong>
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-display">
              {currentGrade === 'grade7_8'
                ? '📖 Słownik Egzaminacyjny CKE B1 & Phrasal Verbs'
                : currentGrade === 'grade4_6'
                ? '📖 Słownik Tematyczny English Explorer'
                : '📖 Gadający Słowniczek Obrazkowy z Liskiem Leo'}
            </h2>
            <p className="text-xs md:text-sm opacity-70">
              Posłuchaj wymowy native speaker (UK), zapoznaj się z zapisem fonetycznym i zdaniami przykładowymi.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj (en, pl, fonetyka)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Pills for this Grade */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Wszystkie ({vocabulary.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick(!soundEnabled);
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.namePl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => {
          const isSpeaking = activeWordId === word.id;

          return (
            <div
              key={word.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between gap-4 ${
                isSpeaking
                  ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
                      {word.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="text-lg font-black text-slate-900 dark:text-white font-display truncate">
                        {word.en}
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {word.phonetic}
                      </div>
                    </div>
                  </div>

                  {/* Play Speech Button */}
                  <button
                    onClick={() => handleSpeak(word)}
                    className={`p-2.5 rounded-2xl transition-transform active:scale-90 cursor-pointer shrink-0 ${
                      isSpeaking
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-700'
                    }`}
                    title="Odsłuchaj wymowę"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {word.pl}
                </div>
              </div>

              {/* Example sentence with click-to-speak */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
                  <span className="italic">"{word.exampleEn}"</span>
                  <button
                    onClick={() => handleSpeakSentence(word.exampleEn)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-amber-600 cursor-pointer shrink-0 ml-1"
                    title="Odsłuchaj całe zdanie"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  {word.examplePl}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold">Nie znaleziono słówek</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Spróbuj wpisać inne hasło lub wyczyść filtr kategorii.
          </p>
        </div>
      )}

    </div>
  );
};
