import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CategoryId, VocabItem } from '../types';
import { VOCABULARY, LANDS } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Timer, Zap, RotateCcw, Trophy, ArrowLeft, Heart } from 'lucide-react';

interface SpeedListeningGameProps {
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSpeed: () => void;
}

const ROUND_TIME = 10; // 10 seconds per round

export const SpeedListeningGame: React.FC<SpeedListeningGameProps> = ({
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSpeed
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
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

  const pool = React.useMemo(() => {
    if (selectedCategory === 'all') return VOCABULARY;
    return VOCABULARY.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

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

    // Pick 2 decoys
    const otherWords = VOCABULARY.filter(v => v.id !== currentTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const roundChoices = [...otherWords, currentTarget].sort(() => 0.5 - Math.random());
    setChoices(roundChoices);
    setSelectedId(null);
    setIsAnswered(false);
    setTimeLeft(ROUND_TIME);

    // Speak the target word after a micro pause
    const t = setTimeout(() => {
      speakEnglish(currentTarget.en);
    }, 250);

    return () => clearTimeout(t);
  }, [currentTarget]);

  useEffect(() => {
    if (gameState === 'playing' && currentTarget) {
      setupRound();
    }
  }, [currentIndex, gameState, currentTarget, setupRound]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
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
    const newLives = lives - 1;
    setLives(newLives);

    if (currentTarget) {
      speakEnglish(`Time is up! It was ${currentTarget.en}`);
    }

    setTimeout(() => {
      if (newLives <= 0) {
        setGameState('game_over');
      } else {
        advanceRound();
      }
    }, 1500);
  };

  const handleChoice = (item: VocabItem) => {
    if (isAnswered || gameState !== 'playing' || !currentTarget) return;

    setIsAnswered(true);
    setSelectedId(item.id);

    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = item.id === currentTarget.id;

    if (isCorrect) {
      soundManager.playSuccess(!soundEnabled);
      const timeBonus = Math.max(1, timeLeft);
      const points = 10 + timeBonus * 2;
      setScore(prev => prev + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      onAddStars(2);

      if (newCombo % 3 === 0) {
        soundManager.playStar(!soundEnabled);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      speakEnglish(currentTarget.en);

      setTimeout(() => {
        advanceRound();
      }, 1100);
    } else {
      soundManager.playError(!soundEnabled);
      setCombo(0);
      const newLives = lives - 1;
      setLives(newLives);

      speakEnglish(`Listen again: ${currentTarget.en}`);

      setTimeout(() => {
        if (newLives <= 0) {
          setGameState('game_over');
        } else {
          advanceRound();
        }
      }, 1500);
    }
  };

  const advanceRound = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Victory / round end
      setGameState('round_end');
      soundManager.playFanfare(!soundEnabled);
      confetti({ particleCount: 90, spread: 80 });
      onAddStars(score > 100 ? 15 : 10);
      onCompleteSpeed();
    }
  };

  const repeatVoice = () => {
    if (currentTarget) {
      soundManager.playClick(!soundEnabled);
      speakEnglish(currentTarget.en);
    }
  };

  if (gameState === 'game_over' || gameState === 'round_end') {
    const isWin = gameState === 'round_end';
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-inner animate-bounce-subtle">
          {isWin ? '🏆' : '💪'}
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 font-display">
            {isWin ? 'Wspaniały refleks słuchowy!' : 'Koniec szans, ale super próba!'}
          </h2>
          <p className="text-slate-600 font-medium">
            Zdobyte punkty: <span className="font-extrabold text-amber-600 text-xl font-mono">{score}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={startNewGame}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-xs transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Zagraj jeszcze raz</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wróć do mapy</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Bar with back button and lives */}
      <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do mapy</span>
        </button>

        {/* Lives (Hearts) */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              className={`w-6 h-6 transition-all ${
                heart <= lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-200 fill-slate-200 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Combo & Score */}
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-bounce-subtle">
              <Zap className="w-3.5 h-3.5 fill-amber-500" />
              <span>Combo x{combo}!</span>
            </div>
          )}
          <div className="text-xs font-bold text-slate-700">
            Punkty: <span className="font-mono text-sm text-amber-700 font-extrabold">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6 text-center">
        
        {/* Timer Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>Czas na reakcję</span>
            </span>
            <span className={`font-mono text-sm font-black ${timeLeft <= 3 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
              {timeLeft} s
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                timeLeft <= 3 ? 'bg-rose-500' : timeLeft <= 6 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
            />
          </div>
        </div>

        {/* Audio Speaker Prompt */}
        <div className="py-4 space-y-3">
          <button
            onClick={repeatVoice}
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-xl flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-amber-100"
            title="Kliknij, aby usłyszeć słówko jeszcze raz!"
          >
            <Volume2 className="w-12 h-12 mb-1" />
            <span className="text-[11px] font-black tracking-wider uppercase">Posłuchaj</span>
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Co powiedział Lisek Leo?
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Wybierz właściwy uśmiechnięty obiekt, zanim skończy się czas!
          </p>
        </div>

        {/* 3 Large Choices Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {choices.map((item) => {
            const isTarget = currentTarget && item.id === currentTarget.id;
            const isChosen = selectedId === item.id;

            let cardStyle = 'bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-slate-200 text-slate-800';

            if (isAnswered) {
              if (isTarget) {
                cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102';
              } else if (isChosen && !isTarget) {
                cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
              } else {
                cardStyle = 'bg-slate-50 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleChoice(item)}
                disabled={isAnswered}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all transform cursor-pointer ${cardStyle} ${
                  !isAnswered ? 'hover:-translate-y-1 active:scale-95 shadow-sm' : ''
                }`}
              >
                <span className="text-6xl sm:text-7xl block select-none mb-1 transition-transform hover:scale-110">
                  {item.emoji}
                </span>
                <span className="text-lg sm:text-xl font-black font-display">
                  {item.pl}
                </span>
                {isAnswered && (
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {item.en}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
