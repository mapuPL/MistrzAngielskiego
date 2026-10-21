import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryId, VocabItem, GradeLevel } from '../types';
import { getCategoriesForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Lightbulb, RotateCcw, Check, ArrowRight, Delete, ArrowLeft } from 'lucide-react';

interface SpellingGameProps {
  currentGrade: GradeLevel;
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSpelling: () => void;
  onWordSpelled?: () => void;
}

export const SpellingGame: React.FC<SpellingGameProps> = ({
  currentGrade,
  initialCategory = 'school',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSpelling,
  onWordSpelled
}) => {
  const categories = useMemo(() => getCategoriesForGrade(currentGrade), [currentGrade]);
  const vocabulary = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const validInitial = categories.some(c => c.id === initialCategory) ? initialCategory : categories[0]?.id || 'all';
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(validInitial);
  const [wordList, setWordList] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; letter: string; isUsed: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Pool
  const currentPool = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? vocabulary
      : vocabulary.filter(v => v.category === selectedCategory);
    // Prefer single words without multiple spaces for clear letter slots
    const singleWords = filtered.filter(v => !v.en.includes(' '));
    return singleWords.length >= 4 ? singleWords : filtered;
  }, [selectedCategory, vocabulary]);

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

    // Use uppercase letters (excluding spaces if any)
    const targetClean = currentWord.en.replace(/\s+/g, '').toUpperCase();
    const letters = targetClean.split('');

    // Add 1 decoy letter if word is short
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

  const targetCleanString = currentWord ? currentWord.en.replace(/\s+/g, '').toUpperCase() : '';

  const handlePickLetter = (item: { id: string; letter: string; isUsed: boolean }) => {
    if (item.isUsed || isSuccess || !currentWord) return;

    soundManager.playClick(!soundEnabled);
    const newTyped = [...typedLetters, item.letter];
    setTypedLetters(newTyped);

    setAvailableLetters(prev =>
      prev.map(l => (l.id === item.id ? { ...l, isUsed: true } : l))
    );

    // Check if word completed
    if (newTyped.length === targetCleanString.length) {
      if (newTyped.join('') === targetCleanString) {
        setIsSuccess(true);
        soundManager.playSuccess(!soundEnabled);
        soundManager.playStar(!soundEnabled);
        speakEnglish(currentWord.en);
        onAddStars(3);
        setCompletedCount(prev => prev + 1);
        if (onWordSpelled) onWordSpelled();

        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 }
        });
      } else {
        soundManager.playError(!soundEnabled);
      }
    }
  };

  const handleBackspace = () => {
    if (typedLetters.length === 0 || isSuccess) return;
    soundManager.playClick(!soundEnabled);

    const lastLetter = typedLetters[typedLetters.length - 1];
    setTypedLetters(prev => prev.slice(0, -1));

    // Release the last used letter of that character
    setAvailableLetters(prev => {
      let released = false;
      return [...prev].reverse().map(l => {
        if (!released && l.isUsed && l.letter === lastLetter) {
          released = true;
          return { ...l, isUsed: false };
        }
        return l;
      }).reverse();
    });
  };

  const handleHint = () => {
    if (isSuccess || !currentWord) return;
    soundManager.playClick(!soundEnabled);

    const nextCorrectIndex = typedLetters.length;
    if (nextCorrectIndex >= targetCleanString.length) return;

    const neededLetter = targetCleanString[nextCorrectIndex];
    const available = availableLetters.find(l => !l.isUsed && l.letter === neededLetter);

    if (available) {
      handlePickLetter(available);
    }
  };

  const handleNextWord = () => {
    soundManager.playClick(!soundEnabled);
    if (currentIndex + 1 < wordList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onCompleteSpelling();
      soundManager.playFanfare(!soundEnabled);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
      onAddStars(8);
    }
  };

  const isFinished = currentIndex >= wordList.length;

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
            {currentGrade === 'grade3' ? '🎈 Literkowanie Baloników' : '✍️ Trening Ortografii i Pisowni'}
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Ułożone słówka: <span className="text-amber-500 font-black text-sm">{completedCount}</span> / {wordList.length}
        </div>
      </div>

      {!isFinished && currentWord && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Słówko {currentIndex + 1} z {wordList.length}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleHint}
                disabled={isSuccess}
                className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full hover:bg-amber-100 text-xs font-bold cursor-pointer transition-colors"
                title="Odsłoń kolejną literkę"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Podpowiedź</span>
              </button>
            </div>
          </div>

          {/* Central Target Card */}
          <div className="text-center space-y-3 py-2">
            <div className="text-7xl sm:text-8xl select-none animate-bounce-subtle">
              {currentWord.emoji}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                {currentWord.pl}
              </h3>
              {currentGrade === 'grade3' && (
                <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  Zapis fonetyczny: [{currentWord.phonetic}]
                </div>
              )}
            </div>

            <button
              onClick={() => speakEnglish(currentWord.en)}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Posłuchaj wymowy</span>
            </button>
          </div>

          {/* Letter Slots */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {targetCleanString.split('').map((char, index) => {
              const typedChar = typedLetters[index];
              const isFilled = typedChar !== undefined;
              const isSlotCorrect = isFilled && typedChar === char;

              return (
                <div
                  key={index}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black border-2 transition-all shadow-xs ${
                    isSuccess
                      ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                      : isFilled
                      ? isSlotCorrect
                        ? 'bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-200 border-amber-400'
                        : 'bg-rose-100 text-rose-700 border-rose-400'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-300 dark:border-slate-700 text-transparent'
                  }`}
                >
                  {typedChar || '_'}
                </div>
              );
            })}
          </div>

          {/* Scrambled Bubble / Balloon Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Wybierz literki:</span>
              {typedLetters.length > 0 && !isSuccess && (
                <button
                  onClick={handleBackspace}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <Delete className="w-3.5 h-3.5" />
                  <span>Cofnij literkę</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
              {availableLetters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePickLetter(item)}
                  disabled={item.isUsed || isSuccess}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-extrabold text-lg sm:text-xl transition-all cursor-pointer shadow-md active:scale-90 ${
                    item.isUsed
                      ? 'opacity-20 scale-90 pointer-events-none bg-slate-300 dark:bg-slate-700 text-slate-500'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:border-amber-500 hover:-translate-y-1'
                  }`}
                >
                  {item.letter}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                    Świetnie! Poprawna pisownia: <span className="font-mono text-base">{currentWord.en}</span>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400">
                    {currentWord.exampleEn} — {currentWord.examplePl}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextWord}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <span>{currentIndex + 1 < wordList.length ? 'Następne słówko' : 'Zakończ grę'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-4xl shadow-inner">
            🎈
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Wspaniała robota! Wszystkie słówka przeliterowane!
            </h3>
            <p className="text-sm text-slate-500">
              Opanowałeś pisownię na poziomie: <strong className="text-amber-500">{gradeConfig.name}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Przeliteruj nową serię</span>
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
