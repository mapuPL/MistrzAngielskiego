import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryId, VocabItem, GradeLevel } from '../types';
import { getCategoriesForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, Sparkles, ArrowLeft } from 'lucide-react';

interface MemoryCard {
  uniqueId: string;
  wordId: string;
  type: 'en' | 'pl';
  text: string;
  emoji: string;
  phonetic?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  currentGrade: GradeLevel;
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteMemory: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  currentGrade,
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteMemory
}) => {
  const categories = useMemo(() => getCategoriesForGrade(currentGrade), [currentGrade]);
  const allVocab = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const validInitial = categories.some(c => c.id === initialCategory) ? initialCategory : categories[0]?.id || 'all';
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(validInitial);
  const [pairCount, setPairCount] = useState<4 | 6>(6);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Pool
  const currentPool = useMemo(() => {
    if (selectedCategory === 'all') return allVocab;
    const filtered = allVocab.filter(v => v.category === selectedCategory);
    return filtered.length >= pairCount ? filtered : allVocab;
  }, [selectedCategory, allVocab, pairCount]);

  const initGame = useCallback(() => {
    const shuffledPool = [...currentPool].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledPool.slice(0, pairCount);

    const generatedCards: MemoryCard[] = [];
    selectedWords.forEach((word) => {
      // English card
      generatedCards.push({
        uniqueId: `${word.id}-en`,
        wordId: word.id,
        type: 'en',
        text: word.en,
        emoji: word.emoji,
        phonetic: word.phonetic,
        isFlipped: false,
        isMatched: false
      });
      // Polish card
      generatedCards.push({
        uniqueId: `${word.id}-pl`,
        wordId: word.id,
        type: 'pl',
        text: word.pl,
        emoji: word.emoji,
        phonetic: word.phonetic,
        isFlipped: false,
        isMatched: false
      });
    });

    setCards(generatedCards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
    setIsWon(false);
  }, [currentPool, pairCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (card: MemoryCard) => {
    if (isLocked || card.isFlipped || card.isMatched) return;

    soundManager.playClick(!soundEnabled);

    // Speak English pronunciation when English card or its pair is revealed
    if (card.type === 'en') {
      speakEnglish(card.text);
    }

    const updatedCards = cards.map(c =>
      c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      const isMatch = first.wordId === second.wordId && first.type !== second.type;

      if (isMatch) {
        soundManager.playSuccess(!soundEnabled);
        setTimeout(() => {
          const matchedCards = updatedCards.map(c =>
            c.wordId === first.wordId ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setIsLocked(false);

          // Check if game won
          if (matchedCards.every(c => c.isMatched)) {
            setIsWon(true);
            soundManager.playFanfare(!soundEnabled);
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 }
            });
            onAddStars(pairCount === 4 ? 6 : 10);
            onCompleteMemory();
          }
        }, 500);
      } else {
        soundManager.playError(!soundEnabled);
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mapa / Menu</span>
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gradeConfig.accentBadge}`}>
            {gradeConfig.name}
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            Gra Memory (Dopasuj pary)
          </h2>
        </div>

        {/* Moves & Difficulty */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                soundManager.playClick(!soundEnabled);
                setPairCount(4);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                pairCount === 4 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Łatwy (4 pary)
            </button>
            <button
              onClick={() => {
                soundManager.playClick(!soundEnabled);
                setPairCount(6);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                pairCount === 6 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Mistrz (6 par)
            </button>
          </div>

          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Ruchy: <strong className="text-amber-500 font-black">{moves}</strong>
          </div>
        </div>
      </div>

      {/* Category Pills for this grade */}
      <div className="flex flex-wrap gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            soundManager.playClick(!soundEnabled);
            setSelectedCategory('all');
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          ✨ Wszystkie słówka
        </button>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setSelectedCategory(cat.id);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.namePl}</span>
          </button>
        ))}
      </div>

      {/* Memory Cards Grid */}
      <div className={`grid gap-3 sm:gap-4 ${
        pairCount === 4
          ? 'grid-cols-2 sm:grid-cols-4'
          : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'
      }`}>
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(card)}
              disabled={isRevealed || isLocked}
              className={`h-32 sm:h-36 rounded-3xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 transform cursor-pointer border-2 shadow-xs ${
                card.isMatched
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 scale-95 opacity-80 cursor-default'
                  : isRevealed
                  ? 'bg-white dark:bg-slate-800 border-amber-400 text-slate-900 dark:text-white shadow-md scale-100'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-indigo-400 text-white hover:-translate-y-1'
              }`}
            >
              {isRevealed ? (
                <div className="space-y-1.5 animate-fadeIn">
                  <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                  <div className="text-xs sm:text-sm font-extrabold break-words">
                    {card.text}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {card.type === 'en' ? '🇬🇧 English' : '🇵🇱 Polski'}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <Sparkles className="w-7 h-7 text-white/80 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-white/80">
                    Memory
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Won screen */}
      {isWon && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-4xl shadow-inner">
            <Award className="w-10 h-10 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Wygrana! Wszystkie pary odnalezione!
            </h3>
            <p className="text-sm text-slate-500">
              Ukończono grę w <strong className="text-amber-500">{moves}</strong> ruchach na poziomie {gradeConfig.name}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Zagraj ponownie</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wróć do mapy</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
