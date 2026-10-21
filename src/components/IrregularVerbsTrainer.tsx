import React, { useState } from 'react';
import { IrregularVerb } from '../types';
import { IRREGULAR_VERBS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, ArrowLeft, CheckCircle2, RotateCcw, Sparkles, BookOpen, Dumbbell, ArrowRight } from 'lucide-react';

interface IrregularVerbsTrainerProps {
  onAddStars: (amount: number) => void;
  onCompleteExercise?: () => void;
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

export const IrregularVerbsTrainer: React.FC<IrregularVerbsTrainerProps> = ({
  onAddStars,
  onCompleteExercise,
  onBackToMenu,
  soundEnabled
}) => {
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentVerb = IRREGULAR_VERBS[currentIndex % IRREGULAR_VERBS.length];

  // Generate 4 options for quiz (testing the Past Simple form)
  const quizOptions = React.useMemo(() => {
    if (!currentVerb) return [];
    const otherVerbs = IRREGULAR_VERBS.filter(v => v.id !== currentVerb.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [currentVerb.past, ...otherVerbs.map(v => v.past)];
    return options.sort(() => 0.5 - Math.random());
  }, [currentVerb]);

  const handleSpeakVerb = (verb: IrregularVerb) => {
    soundManager.playClick(!soundEnabled);
    speakEnglish(`${verb.base}, ${verb.past}, ${verb.participle}`);
  };

  const handleSelectQuizOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentVerb.past;
    if (isCorrect) {
      soundManager.playSuccess(!soundEnabled);
      setQuizScore(prev => prev + 1);
      onAddStars(2);
      speakEnglish(`${currentVerb.base}, ${currentVerb.past}`);

      if ((quizScore + 1) % 3 === 0) {
        confetti({ particleCount: 40, spread: 60 });
      }
    } else {
      soundManager.playError(!soundEnabled);
      speakEnglish(currentVerb.past);
    }
  };

  const handleNextQuiz = () => {
    soundManager.playClick(!soundEnabled);
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex + 1 < IRREGULAR_VERBS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare(!soundEnabled);
      confetti({ particleCount: 100, spread: 80 });
      onAddStars(10);
      if (onCompleteExercise) onCompleteExercise();
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 border border-cyan-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do mapy</span>
        </button>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('study')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'study' ? 'bg-white text-cyan-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Karty i Wymowa (Nauka)</span>
          </button>
          <button
            onClick={() => {
              setMode('quiz');
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'quiz' ? 'bg-white text-cyan-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-cyan-600" />
            <span>Trening / Quiz Past Simple</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Opanowane: <strong className="font-mono text-cyan-700">{IRREGULAR_VERBS.length}</strong> czasowników
        </div>
      </div>

      {/* Mode 1: Study Flashcards Table */}
      {mode === 'study' && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                Klasy 4–6 · Gramatyka
              </span>
              <h2 className="text-2xl font-black font-display">
                Trener Czasowników Nieregularnych
              </h2>
              <p className="text-xs text-cyan-100 max-w-xl font-medium">
                Poznaj 3 formy: <strong>Infinitive</strong> (bezokolicznik), <strong>Past Simple</strong> (czas przeszły) oraz <strong>Past Participle</strong> (III forma). Kliknij głośniczek, aby usłyszeć poprawną wymowę!
              </p>
            </div>
            <button
              onClick={() => {
                setMode('quiz');
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className="px-5 py-3 bg-white hover:bg-cyan-50 text-cyan-950 font-black text-xs rounded-2xl shadow-xs transition-transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
            >
              Rozpocznij Quiz ➔
            </button>
          </div>

          {/* Verbs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {IRREGULAR_VERBS.map((verb) => (
              <div
                key={verb.id}
                className="bg-white rounded-3xl p-4 border border-cyan-200/80 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400">Znaczenie:</span>
                      <h3 className="text-base font-black text-slate-900 font-display">
                        {verb.pl}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleSpeakVerb(verb)}
                      className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition-colors cursor-pointer"
                      title="Posłuchaj 3 form czasownika"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 3 Forms Display */}
                  <div className="grid grid-cols-3 gap-1 pt-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">I Forma</div>
                      <div className="text-sm font-black text-slate-800 font-mono">{verb.base}</div>
                    </div>
                    <div className="bg-cyan-50 p-2 rounded-xl border border-cyan-200">
                      <div className="text-[10px] font-bold text-cyan-700 uppercase">Past Simple</div>
                      <div className="text-sm font-black text-cyan-900 font-mono">{verb.past}</div>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-200">
                      <div className="text-[10px] font-bold text-indigo-700 uppercase">III Forma</div>
                      <div className="text-sm font-black text-indigo-900 font-mono">{verb.participle}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic">
                  „{verb.exampleEn}”
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Quiz Mode */}
      {mode === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cyan-200/90 shadow-md text-center space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
            <span>Pytanie {currentIndex + 1} z {IRREGULAR_VERBS.length}</span>
            <span className="text-cyan-700">Wybierz poprawną formę Past Simple</span>
          </div>

          <div className="space-y-3 py-2">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Czasownik:
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {currentVerb.base.toUpperCase()}
            </div>
            <div className="text-base font-bold text-cyan-800">
              (polski: „{currentVerb.pl}”)
            </div>
            <p className="text-xs text-slate-500">
              Jaka jest II forma czasu przeszłego (Past Simple)?
            </p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {quizOptions.map((opt, idx) => {
              const isChosen = selectedOption === opt;
              const isCorrect = opt === currentVerb.past;

              let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-cyan-50 hover:border-cyan-300';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-black';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-base font-black font-mono transition-all transform cursor-pointer ${btnStyle} ${
                    !isAnswered ? 'active:scale-95' : ''
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Answer confirmation & Next Button */}
          {isAnswered && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-lg mx-auto border-t border-slate-100">
              <div className="text-xs text-left">
                <span className="font-bold text-slate-800 block">Pełna odmiana:</span>
                <span className="font-mono text-cyan-800 font-bold">
                  {currentVerb.base} ➔ {currentVerb.past} ➔ {currentVerb.participle}
                </span>
              </div>

              <button
                onClick={handleNextQuiz}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIndex + 1 < IRREGULAR_VERBS.length ? 'Następny czasownik' : 'Zakończ trening!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
