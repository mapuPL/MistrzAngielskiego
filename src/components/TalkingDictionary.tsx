import React, { useState } from 'react';
import { CategoryId, VocabItem } from '../types';
import { VOCABULARY, CATEGORIES } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import { Search, Volume2, Sparkles, Filter, ArrowLeft } from 'lucide-react';

interface TalkingDictionaryProps {
  soundEnabled: boolean;
  onBackToMenu?: () => void;
  onPracticeWord?: (word: VocabItem) => void;
  onListenWord?: () => void;
}

export const TalkingDictionary: React.FC<TalkingDictionaryProps> = ({
  soundEnabled,
  onBackToMenu,
  onListenWord
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const filteredWords = VOCABULARY.filter((word) => {
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
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
        {onBackToMenu && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wróć do mapy</span>
            </button>
            <span className="text-xs font-bold text-slate-500">
              Liczba słówek: <strong className="text-amber-800 font-mono">{filteredWords.length}</strong>
            </span>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 font-display">
              📖 Gadający Słowniczek Obrazkowy
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Posłuchaj poprawnej wymowy każdego słówka i poznaj przykłady użycia w zdaniach!
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj np. cat, pies, apple..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
            }`}
          >
            🌟 Wszystkie ({VOCABULARY.length})
          </button>
          {CATEGORIES.map((c) => {
            const count = VOCABULARY.filter(v => v.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {c.icon} {c.namePl} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-200/80 shadow-xs space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">Nie znaleziono słówek</h3>
          <p className="text-xs text-slate-500">
            Spróbuj wpisać inną frazę lub wybierz inną kategorię tematyczną.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWords.map((word) => {
            const isSpeaking = activeWordId === word.id;
            return (
              <div
                key={word.id}
                className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl block transition-transform group-hover:scale-110 select-none" role="img" aria-label={word.pl}>
                      {word.emoji}
                    </span>
                    <button
                      onClick={() => handleSpeak(word)}
                      className={`p-2.5 rounded-xl transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                      }`}
                      title={`Posłuchaj wymowy: ${word.en}`}
                      aria-label={`Odtwórz wymowę słowa ${word.en}`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <div className="text-lg font-extrabold text-slate-900 font-display">
                      {word.en}
                    </div>
                    <div className="text-xs font-mono font-semibold text-amber-700">
                      wymowa: {word.phonetic}
                    </div>
                    <div className="text-sm font-semibold text-slate-700 pt-0.5">
                      {word.pl}
                    </div>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span className="italic">„{word.exampleEn}”</span>
                    <button
                      onClick={() => handleSpeakSentence(word.exampleEn)}
                      className="text-slate-400 hover:text-amber-600 p-0.5"
                      title="Posłuchaj całego zdania"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {word.examplePl}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
