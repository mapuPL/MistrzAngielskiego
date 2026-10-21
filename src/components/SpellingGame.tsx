import React, { useState, useEffect, useCallback } from 'react';
import { CategoryId, VocabItem } from '../types';
import { VOCABULARY, CATEGORIES } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Lightbulb, RotateCcw, Check, ArrowRight, Delete, ArrowLeft } from 'lucide-react';

interface SpellingGameProps {
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSpelling: () => void;
  onWordSpelled?: () => void;
}

export const SpellingGame: React.FC<SpellingGameProps> = ({
  initialCategory = 'school',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSpelling,
  onWordSpelled
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [wordList, setWordList] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; letter: string; isUsed: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Pool
  const currentPool = React.useMemo(() => {
    // Pick words with 3 to 8 letters suitable for 3rd grade spelling
    const filtered = selectedCategory === 'all'
      ? VOCABULARY
      : VOCABULARY.filter(v => v.category === selectedCategory);
    return filtered.filter(v => !v.en.includes(' ')); // Single words for balloon spelling
  }, [selectedCategory]);

  const initGame = useCallback(() => {
    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    setWordList(shuffled.slice(0, 6));
    setCurrentIndex(0);
    setCompletedCount(0);
  }, [currentPool]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentWord = wordList[currentIndex];

  // Setup current word letters
  useEffect(() => {
    if (!currentWord) return;

    const letters = currentWord.en.toUpperCase().split('');
    // Add 1 or 2 decoy letters for extra fun and challenge
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const decoys: string[] = [];
    if (letters.length <= 6) {
      decoys.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    const allLetters = [...letters, ...decoys].sort(() => 0.5 - Math.random());
    setAvailableLetters(
      allLetters.map((char, index) => ({
        id: `${char}-${index}`,
        letter: char,
        isUsed: false
      }))
    );
    setTypedLetters([]);
    setIsSuccess(false);

    // Speak word
    speakEnglish(currentWord.en);
  }, [currentWord]);

  const handlePickLetter = (item: { id: string; letter: string; isUsed: boolean }) => {
    if (item.isUsed || isSuccess || !currentWord) return;

    soundManager.playClick(!soundEnabled);
    const newTyped = [...typedLetters, item.letter];
    setTypedLetters(newTyped);

    // Mark as used
    setAvailableLetters(prev =>
      prev.map(l => (l.id === item.id ? { ...l, isUsed: true } : l))
    );

    // Check if match
    const target = currentWord.en.toUpperCase();
    const currentAttempt = newTyped.join('');

    if (currentAttempt === target) {
      setIsSuccess(true);
      soundManager.playSuccess(!soundEnabled);
      soundManager.playStar(!soundEnabled);
      speakEnglish(currentWord.en);
      onAddStars(3);
      setCompletedCount(prev => prev + 1);
      if (onWordSpelled) onWordSpelled();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (currentAttempt.length >= target.length) {
      soundManager.playError(!soundEnabled);
    }
  };

  const handleRemoveLetter = (indexToRemove: number) => {
    if (isSuccess) return;
    soundManager.playClick(!soundEnabled);

    const letterToRemove = typedLetters[indexToRemove];
    const newTyped = typedLetters.filter((_, i) => i !== indexToRemove);
    setTypedLetters(newTyped);

    // Free up first used matching letter in availableLetters
    let freed = false;
    setAvailableLetters(prev =>
      prev.map(l => {
        if (!freed && l.isUsed && l.letter === letterToRemove) {
          freed = true;
          return { ...l, isUsed: false };
        }
        return l;
      })
    );
  };

  const handleResetLetters = () => {
    soundManager.playClick(!soundEnabled);
    setTypedLetters([]);
    setAvailableLetters(prev => prev.map(l => ({ ...l, isUsed: false })));
  };

  const handleHint = () => {
    if (isSuccess || !currentWord) return;
    const target = currentWord.en.toUpperCase();
    const nextCorrectIndex = typedLetters.length;

    if (nextCorrectIndex < target.length) {
      const nextChar = target[nextCorrectIndex];
      // Find an unused letter with this char
      const match = availableLetters.find(l => !l.isUsed && l.letter === nextChar);
      if (match) {
        handlePickLetter(match);
      }
    }
  };

  const handleNextWord = () => {
    soundManager.playClick(!soundEnabled);
    if (currentIndex + 1 < wordList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed round
      soundManager.playFanfare(!soundEnabled);
      onCompleteSpelling();
      confetti({ particleCount: 80, spread: 80 });
      onAddStars(10);
      initGame();
    }
  };

  if (!currentWord) {
    return <div className="text-center p-8">Ładowanie zadań literkowania...</div>;
  }

  const targetChars = currentWord.en.toUpperCase().split('');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Category Selection Bar */}
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
            Ukończone: <span className="font-mono text-emerald-600 font-extrabold">{completedCount}</span> słówek
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
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
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
              }`}
            >
              {c.icon} {c.namePl}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500">
          Ukończone: <span className="font-mono text-emerald-600 font-extrabold">{completedCount}</span> słówek
        </div>
      </div>
    </div>

      {/* Main Spelling Playground Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6 text-center">
        
        {/* Word Info & Audio Replay */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Słówko {currentIndex + 1} z {wordList.length}</span>
            <span className="text-emerald-700 font-semibold">Balonowe Literkowanie</span>
          </div>

          <div className="inline-block p-4 rounded-3xl bg-amber-50 border border-amber-200">
            <span className="text-6xl sm:text-7xl block select-none mb-1">
              {currentWord.emoji}
            </span>
            <div className="text-lg font-bold text-slate-800">
              „{currentWord.pl}”
            </div>
            <div className="text-xs font-mono text-amber-700 font-semibold">
              Wymowa: {currentWord.phonetic}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => speakEnglish(currentWord.en)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition-all shadow-2xs active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Posłuchaj wymowy 🔊</span>
            </button>

            <button
              onClick={handleHint}
              disabled={isSuccess || typedLetters.length >= targetChars.length}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border border-yellow-200 font-bold text-xs rounded-xl transition-all disabled:opacity-50"
              title="Odsłoń kolejną literkę"
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />
              <span>Podpowiedź</span>
            </button>
          </div>
        </div>

        {/* Answer Slots */}
        <div className="py-2">
          <div className="text-xs font-bold text-slate-500 mb-2">
            Ułóż słowo klikając literki (lub kliknij literę, aby ją cofnąć):
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 min-h-[64px]">
            {targetChars.map((char, index) => {
              const currentFilled = typedLetters[index];
              const isFilled = currentFilled !== undefined;

              return (
                <button
                  key={`slot-${index}`}
                  onClick={() => isFilled && handleRemoveLetter(index)}
                  disabled={!isFilled || isSuccess}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black font-mono transition-all duration-200 ${
                    isSuccess
                      ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md transform scale-105'
                      : isFilled
                      ? 'bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-xs hover:border-rose-400 hover:bg-rose-50'
                      : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400'
                  }`}
                  title={isFilled ? 'Kliknij, aby cofnąć' : undefined}
                >
                  {isFilled ? currentFilled : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Bubble Letters to tap */}
        {!isSuccess && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-lg mx-auto">
              {availableLetters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePickLetter(item)}
                  disabled={item.isUsed}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black font-mono shadow-md transition-all active:scale-95 ${
                    item.isUsed
                      ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-b from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white border-2 border-emerald-600 cursor-pointer transform hover:-translate-y-1'
                  }`}
                >
                  {item.letter}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleResetLetters}
                disabled={typedLetters.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>Wyczyść wszystko</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Banner and Next Button */}
        {isSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-bounce-subtle">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-lg">
              <Check className="w-6 h-6 text-emerald-600" />
              <span>Brawo! Wzorowo przeliterowane: {currentWord.en.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-600 italic">
              „{currentWord.exampleEn}”
            </p>
            <button
              onClick={handleNextWord}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>{currentIndex + 1 < wordList.length ? 'Następne słówko' : 'Koniec rundy!'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
