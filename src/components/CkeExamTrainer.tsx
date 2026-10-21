import React, { useState } from 'react';
import { CkeExamItem } from '../types';
import { CKE_EXAM_ITEMS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Volume2, ArrowRight, RotateCcw, GraduationCap, Award } from 'lucide-react';

interface CkeExamTrainerProps {
  onAddStars: (amount: number) => void;
  onCompleteExercise?: () => void;
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

export const CkeExamTrainer: React.FC<CkeExamTrainerProps> = ({
  onAddStars,
  onCompleteExercise,
  onBackToMenu,
  soundEnabled
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const currentTask = CKE_EXAM_ITEMS[currentIndex % CKE_EXAM_ITEMS.length];

  const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !userInput.trim()) return;

    const userNorm = normalize(userInput);
    const correctNorm = normalize(currentTask.correctAnswer);
    const acceptable = (currentTask.acceptableAnswers || []).map(normalize);

    const matches = userNorm === correctNorm || acceptable.includes(userNorm);

    setIsAnswered(true);
    setIsCorrect(matches);

    if (matches) {
      soundManager.playSuccess(!soundEnabled);
      setScore(prev => prev + 1);
      onAddStars(3);

      confetti({ particleCount: 50, spread: 70 });
    } else {
      soundManager.playError(!soundEnabled);
    }

    // Pronounce the full sentence
    const fullSentence = `${currentTask.sentenceBefore} ${currentTask.correctAnswer} ${currentTask.sentenceAfter}`.replace(/\s+/g, ' ');
    speakEnglish(fullSentence);
  };

  const handleNext = () => {
    soundManager.playClick(!soundEnabled);
    setUserInput('');
    setIsAnswered(false);
    setShowHint(false);

    if (currentIndex + 1 < CKE_EXAM_ITEMS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare(!soundEnabled);
      confetti({ particleCount: 120, spread: 90 });
      onAddStars(15);
      if (onCompleteExercise) onCompleteExercise();
      setCurrentIndex(0);
    }
  };

  const handleSpeakFull = () => {
    soundManager.playClick(!soundEnabled);
    const full = `${currentTask.sentenceBefore} ${currentTask.correctAnswer} ${currentTask.sentenceAfter}`.replace(/\s+/g, ' ');
    speakEnglish(full);
  };

  const typeLabels = {
    transformation: 'Parafraza Zdań CKE',
    translation: 'Tłumaczenie Fragmentu',
    gap_fill: 'Słowotwórstwo i Luki'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-md flex items-center justify-between text-white">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do mapy</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-black text-purple-300">
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <span>Egzamin Ósmoklasisty CKE · Poziom B1</span>
        </div>

        <div className="text-xs font-bold text-slate-400">
          Wynik: <strong className="font-mono text-purple-400 text-sm">{score}</strong> / {CKE_EXAM_ITEMS.length}
        </div>
      </div>

      {/* Main Task Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-6">
        
        {/* Task Tag & Progress */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
          <span className="bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full font-bold">
            {typeLabels[currentTask.type]}
          </span>
          <span className="text-slate-400 font-mono">
            Zadanie {currentIndex + 1} z {CKE_EXAM_ITEMS.length}
          </span>
        </div>

        {/* Instruction */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
            Polecenie:
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            {currentTask.instruction}
          </h2>
        </div>

        {/* Task Prompt Sentences */}
        <div className="p-5 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
          {currentTask.sentenceBefore && currentTask.type === 'transformation' && (
            <div className="text-sm sm:text-base font-medium text-slate-300">
              <span className="text-xs text-purple-400 font-bold block uppercase tracking-wider mb-1">
                Zdanie wyjściowe:
              </span>
              „{currentTask.sentenceBefore}”
            </div>
          )}

          <div className="text-base sm:text-xl font-bold text-white leading-relaxed">
            {currentTask.type === 'transformation' ? (
              <>
                <span className="text-xs text-purple-400 font-bold block uppercase tracking-wider mb-1">
                  Uzupełnij drugie zdanie (słowo klucz: <strong className="text-yellow-400 font-mono">[{currentTask.bracketPrompt}]</strong>):
                </span>
                {currentTask.sentenceAfter.replace('__________', ' [ ... ] ')}
              </>
            ) : (
              <>
                <span>{currentTask.sentenceBefore} </span>
                <span className="bg-purple-950/80 text-yellow-300 border border-purple-700/80 px-2 py-0.5 rounded-lg font-mono">
                  [{currentTask.bracketPrompt}]
                </span>
                <span> {currentTask.sentenceAfter}</span>
              </>
            )}
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isAnswered}
              placeholder="Wpisz brakujące wyrazy po angielsku..."
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm sm:text-base focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60"
            />
            {!isAnswered ? (
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                Sprawdź odpowiedź
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>{currentIndex + 1 < CKE_EXAM_ITEMS.length ? 'Kolejne zadanie' : 'Zakończ arkusz!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hint Button */}
          {!isAnswered && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ukryj podpowiedź' : 'Pokaż podpowiedź gramatyczną'}</span>
              </button>
            </div>
          )}

          {showHint && !isAnswered && (
            <div className="p-3 bg-purple-950/40 border border-purple-800 rounded-xl text-xs text-purple-200">
              💡 <strong>Wskazówka:</strong> {currentTask.hint}
            </div>
          )}
        </form>

        {/* Feedback & Explanation */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isCorrect ? 'bg-emerald-950/50 border-emerald-600/70' : 'bg-rose-950/50 border-rose-600/70'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="font-extrabold text-sm sm:text-base">
                  {isCorrect ? 'Świetnie! Poprawna odpowiedź egzaminacyjna!' : 'Niestety błąd! Prawidłowa forma to:'}
                </span>
              </div>

              <button
                onClick={handleSpeakFull}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                title="Posłuchaj pełnego zdania"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                <span>Odsłuchaj</span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-black font-mono text-yellow-300">
              „{currentTask.correctAnswer}”
            </div>

            <div className="text-xs text-slate-300 pt-1 border-t border-slate-800 leading-relaxed">
              <strong className="text-purple-300 block mb-0.5">Wyjaśnienie reguły CKE:</strong>
              {currentTask.explanation}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
