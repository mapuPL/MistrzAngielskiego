import React, { useState, useEffect, useCallback } from 'react';
import { CategoryId, VocabItem } from '../types';
import { VOCABULARY, CATEGORIES } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, Sparkles, ArrowLeft } from 'lucide-react';

interface MemoryCard {
  uniqueId: string;
  wordId: string;
  type: 'en' | 'pl';
  text: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteMemory: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteMemory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [pairCount, setPairCount] = useState<4 | 6>(6);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Pool
  const currentPool = React.useMemo(() => {
    return selectedCategory === 'all'
      ? VOCABULARY
      : VOCABULARY.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

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
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle deck
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

    // If English card, pronounce it right away!
    if (card.type === 'en') {
      speakEnglish(card.text);
    } else {
      // Find the English word to pronounce as well
      const wordObj = VOCABULARY.find(v => v.id === card.wordId);
      if (wordObj) speakEnglish(wordObj.en);
    }

    const updatedCard = { ...card, isFlipped: true };
    const newCards = cards.map(c => (c.uniqueId === card.uniqueId ? updatedCard : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, updatedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      if (first.wordId === second.wordId && first.type !== second.type) {
        // MATCH!
        setTimeout(() => {
          soundManager.playSuccess(!soundEnabled);
          setCards(prev =>
            prev.map(c =>
              c.wordId === first.wordId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
          onAddStars(2);

          // Check if all matched
          const remaining = newCards.filter(c => !c.isMatched && c.wordId !== first.wordId);
          if (remaining.length === 0) {
            handleVictory();
          }
        }, 500);
      } else {
        // MISMATCH
        setTimeout(() => {
          soundManager.playError(!soundEnabled);
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

  const handleVictory = () => {
    setIsWon(true);
    soundManager.playFanfare(!soundEnabled);
    onCompleteMemory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onAddStars(pairCount === 6 ? 15 : 10);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Category & Controls Bar */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wróć do mapy</span>
          </button>
          <div className="text-xs font-bold text-slate-500">
            Ruchy: <span className="font-mono text-indigo-700 font-extrabold">{moves}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
              }`}
            >
              🌟 Wszystkie
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
              }`}
            >
              {c.icon} {c.namePl}
            </button>
          ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPairCount(4)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  pairCount === 4 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                4 pary (Łatwy)
              </button>
              <button
                onClick={() => setPairCount(6)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  pairCount === 6 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                6 par (Mistrz)
              </button>
            </div>

            <div className="text-xs font-bold text-slate-600">
              Ruchy: <span className="font-mono text-indigo-700">{moves}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Memory Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
        
        {isWon ? (
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <div className="text-6xl animate-bounce">🎉</div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">
              Świetna pamięć! Wszystkie pary odnalezione!
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              Ukończono w <span className="font-bold text-indigo-600">{moves}</span> ruchach! Zdobywasz bonusowe gwiazdki!
            </p>
            <div className="pt-2">
              <button
                onClick={initGame}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Zagraj nową partię</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={`grid gap-3 sm:gap-4 ${pairCount === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4'}`}>
            {cards.map((card) => {
              const showContent = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card)}
                  disabled={card.isMatched || isLocked}
                  className={`h-28 sm:h-36 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 transform cursor-pointer ${
                    card.isMatched
                      ? 'bg-emerald-50 border-2 border-emerald-400 opacity-90 shadow-2xs scale-98'
                      : showContent
                      ? 'bg-white border-2 border-indigo-400 shadow-md ring-2 ring-indigo-200'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-2 border-indigo-700 shadow-sm hover:scale-102 active:scale-95'
                  }`}
                >
                  {showContent ? (
                    <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-3xl sm:text-4xl block" role="img" aria-label="symbol">
                        {card.emoji}
                      </span>
                      <div className={`text-xs sm:text-sm font-extrabold truncate max-w-[100px] sm:max-w-[130px] ${
                        card.type === 'en' ? 'text-indigo-900 font-display' : 'text-slate-800'
                      }`}>
                        {card.text}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {card.type === 'en' ? '🇬🇧 English' : '🇵🇱 Polski'}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Sparkles className="w-6 h-6 text-indigo-200 mx-auto opacity-75" />
                      <div className="text-xs font-bold text-indigo-100">?</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
