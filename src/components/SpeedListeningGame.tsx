import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CategoryId, VocabItem, GradeLevel } from '../types';
import { getCategoriesForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Timer, Zap, RotateCcw, Trophy, ArrowLeft, Heart } from 'lucide-react';

interface SpeedListeningGameProps {
  currentGrade: GradeLevel;
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSpeed: () => void;
}

const ROUND_TIME = 10; // 10 seconds per round

export const SpeedListeningGame: React.FC<SpeedListeningGameProps> = ({
  currentGrade,
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSpeed
}) => {
  const categories = useMemo(() => getCategoriesForGrade(currentGrade), [currentGrade]);
  const allVocab = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const validInitial = categories.some(c => c.id === initialCategory) ? initialCategory : categories[0]?.id || 'all';
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(validInitial);
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<VocabItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'round_end' | 'game_over'>('playing');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pool = useMemo(() => {
    if (selectedCategory === 'all') return allVocab;
    const filtered = allVocab.filter(v => v.category === selectedCategory);
    return filtered.length > 0 ? filtered : allVocab;
  }, [selectedCategory, allVocab]);

  const startNewGame = useCallback(() => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 8));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setGameState('playing');
    setSelectedId(null);
    setIsAnswered(false);
  }, [pool]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const currentTarget = questions[currentIndex];

  // Setup round
  const setupRound = useCallback(() => {
    if (!currentTarget) return;

    // Pick 2 decoys from current grade vocabulary
    const otherWords = allVocab
      .filter(v => v.id !== currentTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const roundChoices = [...otherWords, currentTarget].sort(() => 0.5 - Math.random());
    setChoices(roundChoices);
    setSelectedId(null);
    setIsAnswered(false);
    setTimeLeft(ROUND_TIME);

    // Speak the target word
    const t = setTimeout(() => {
      speakEnglish(currentTarget.en);
    }, 250);

    return () => clearTimeout(t);
  }, [currentTarget, allVocab]);

  useEffect(() => {
    if (gameState === 'playing' && currentTarget) {
      const clean = setupRound();
      return () => {
        if (clean) clean();
      };
    }
  }, [currentIndex, gameState, setupRound, currentTarget]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswered, currentIndex]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    soundManager.playError(!soundEnabled);
    setCombo(0);
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('game_over');
      } else {
        setTimeout(handleNextRound, 1400);
      }
      return newLives;
    });
  };

  const handleSelect = (item: VocabItem) => {
    if (isAnswered || gameState !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsAnswered(true);
    setSelectedId(item.id);

    const isCorrect = item.id === currentTarget?.id;

    if (isCorrect) {
      soundManager.playSuccess(!soundEnabled);
      setScore(prev => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      onAddStars(2);

      if (newCombo % 3 === 0) {
        soundManager.playStar(!soundEnabled);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      setTimeout(handleNextRound, 1200);
    } else {
      soundManager.playError(!soundEnabled);
      setCombo(0);
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setGameState('game_over');
        } else {
          setTimeout(handleNextRound, 1400);
        }
        return nextLives;
      });
    }
  };

  const handleNextRound = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('round_end');
      soundManager.playFanfare(!soundEnabled);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
      onAddStars(6);
      onCompleteSpeed();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Controls */}
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
            Pokój Słuchowy & Wyzwanie Reakcji
          </h2>
        </div>

        {/* Lives and Combo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform ${
                  i <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 dark:text-slate-700 scale-90'
                }`}
              />
            ))}
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{combo}x Combo!</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Card */}
      {gameState === 'playing' && currentTarget && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Timer and Progress */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Runda {currentIndex + 1} z {questions.length}
            </span>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl font-mono font-black text-sm border ${
              timeLeft <= 3
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Time bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 linear ${
                timeLeft <= 3 ? 'bg-rose-500' : 'bg-sky-500'
              }`}
              style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
            />
          </div>

          {/* Central Speaker Button */}
          <div className="text-center py-4 space-y-3">
            <div className="flex justify-center">
              <button
                onClick={() => speakEnglish(currentTarget.en)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 dark:hover:bg-sky-900 border-4 border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-lg active:scale-95 transition-all cursor-pointer group"
                title="Kliknij, aby posłuchać ponownie"
              >
                <Volume2 className="w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Posłuchaj i szybko kliknij właściwy obiekt!
            </h3>
            <p className="text-xs text-slate-400">
              Masz tylko 10 sekund na reakcję!
            </p>
          </div>

          {/* 3 Interactive Objects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {choices.map((item) => {
              const isSelected = selectedId === item.id;
              const isCorrect = item.id === currentTarget.id;

              let cardStyle = 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 hover:scale-105';

              if (isAnswered) {
                if (isCorrect) {
                  cardStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105 ring-4 ring-emerald-300';
                } else if (isSelected) {
                  cardStyle = 'bg-rose-500 text-white border-rose-600 opacity-90';
                } else {
                  cardStyle = 'opacity-40 pointer-events-none bg-slate-100 dark:bg-slate-800';
                }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  disabled={isAnswered}
                  className={`p-6 rounded-3xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 shadow-xs ${cardStyle}`}
                >
                  <span className="text-6xl sm:text-7xl select-none animate-bounce-subtle">
                    {item.emoji}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-base sm:text-lg">
                      {item.pl}
                    </div>
                    {isAnswered && (
                      <div className="text-xs font-mono font-bold">
                        {item.en} [{item.phonetic}]
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'game_over' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-4xl shadow-inner">
            💔
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Skończyły się życia!
            </h3>
            <p className="text-sm text-slate-500">
              Udało ci się rozpoznać {score} z {questions.length} słówek. Trening czyni mistrza!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={startNewGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Spróbuj jeszcze raz</span>
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

      {/* Victory / Round End Screen */}
      {gameState === 'round_end' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-4xl shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Wyśmienity refleks i słuch!
            </h3>
            <p className="text-sm text-slate-500">
              Ukończono wszystkie rundy w Pokoju Słuchowym dla poziomu: <strong className="text-amber-500">{gradeConfig.name}</strong>
            </p>
          </div>

          <div className="flex justify-center gap-6 py-2">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-28">
              <div className="text-3xl font-black text-amber-500">{score} / {questions.length}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Poprawne</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-28">
              <div className="text-3xl font-black text-emerald-500">+{score * 2 + 6} ⭐</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Zdobyte gwiazdki</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={startNewGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
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
