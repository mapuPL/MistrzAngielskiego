import React, { useState, useMemo } from 'react';
import { IrregularVerb } from '../types';
import { ALL_IRREGULAR_VERBS } from '../data/irregularVerbs';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, ArrowLeft, CheckCircle2, RotateCcw, Sparkles, BookOpen, Dumbbell, ArrowRight, Search, Filter } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [letterFilter, setLetterFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'essential'>('all');

  // Quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Filtered verbs for Study mode
  const filteredVerbs = useMemo(() => {
    return ALL_IRREGULAR_VERBS.filter(verb => {
      // Scope filter (essential = first 35 most common)
      if (scopeFilter === 'essential') {
        const isEssential = ALL_IRREGULAR_VERBS.slice(0, 35).some(v => v.id === verb.id);
        if (!isEssential) return false;
      }

      // Letter filter
      if (letterFilter !== 'all') {
        const firstLetter = verb.base.charAt(0).toLowerCase();
        if (letterFilter === 'A-C' && !['a', 'b', 'c'].includes(firstLetter)) return false;
        if (letterFilter === 'D-F' && !['d', 'e', 'f'].includes(firstLetter)) return false;
        if (letterFilter === 'G-L' && !['g', 'h', 'i', 'j', 'k', 'l'].includes(firstLetter)) return false;
        if (letterFilter === 'M-R' && !['m', 'n', 'o', 'p', 'q', 'r'].includes(firstLetter)) return false;
        if (letterFilter === 'S-Z' && !['s', 't', 'u', 'v', 'w', 'y', 'z'].includes(firstLetter)) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        return (
          verb.base.toLowerCase().includes(q) ||
          verb.past.toLowerCase().includes(q) ||
          verb.participle.toLowerCase().includes(q) ||
          verb.pl.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [searchTerm, letterFilter, scopeFilter]);

  // Quiz verbs pool
  const quizPool = useMemo(() => {
    return scopeFilter === 'essential'
      ? ALL_IRREGULAR_VERBS.slice(0, 35)
      : ALL_IRREGULAR_VERBS;
  }, [scopeFilter]);

  const currentVerb = quizPool[quizIndex % quizPool.length];

  // 4 choices for current verb's Past Simple
  const quizOptions = useMemo(() => {
    if (!currentVerb) return [];
    const otherVerbs = quizPool
      .filter(v => v.id !== currentVerb.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [currentVerb.past, ...otherVerbs.map(v => v.past)];
    return options.sort(() => 0.5 - Math.random());
  }, [currentVerb, quizPool]);

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
    if (quizIndex + 1 < quizPool.length) {
      setQuizIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare(!soundEnabled);
      confetti({ particleCount: 100, spread: 80 });
      onAddStars(15);
      if (onCompleteExercise) onCompleteExercise();
      setQuizIndex(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 border border-cyan-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
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
              mode === 'study' ? 'bg-white text-cyan-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Baza Czasowników ({ALL_IRREGULAR_VERBS.length})</span>
          </button>
          <button
            onClick={() => {
              setMode('quiz');
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === 'quiz' ? 'bg-white text-cyan-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-cyan-600" />
            <span>Trening Past Simple (Quiz)</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-600">
          Łącznie w bazie: <strong className="font-mono text-cyan-700">{ALL_IRREGULAR_VERBS.length}</strong> czasowników
        </div>
      </div>

      {/* Mode 1: Study Flashcards Table */}
      {mode === 'study' && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                Klasy 4–6 & 7–8 · Pełna Tablica Odmian
              </span>
              <h2 className="text-2xl font-black font-display">
                Kompletna Baza Czasowników Nieregularnych
              </h2>
              <p className="text-xs text-cyan-100 max-w-2xl font-medium leading-relaxed">
                Poznaj wszystkie 3 formy: <strong>Infinitive</strong> (bezokolicznik), <strong>Past Simple</strong> (czas przeszły) oraz <strong>Past Participle</strong> (III forma). Kliknij ikonę głośnika, aby odsłuchać poprawną brytyjską wymowę!
              </p>
            </div>
            <button
              onClick={() => {
                setMode('quiz');
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className="px-5 py-3 bg-white hover:bg-cyan-50 text-cyan-950 font-black text-xs rounded-2xl shadow-sm transition-transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
            >
              Przejdź do Quizu ➔
            </button>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-cyan-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj (np. be, went, widzieć)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Range and Letter filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setScopeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    scopeFilter === 'all' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Wszystkie ({ALL_IRREGULAR_VERBS.length})
                </button>
                <button
                  onClick={() => setScopeFilter('essential')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    scopeFilter === 'essential' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Podstawowe (35)
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {['all', 'A-C', 'D-F', 'G-L', 'M-R', 'S-Z'].map((lf) => (
                  <button
                    key={lf}
                    onClick={() => setLetterFilter(lf)}
                    className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      letterFilter === lf ? 'bg-white text-cyan-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {lf === 'all' ? 'A-Z' : lf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 px-1">
            Wyświetlam <strong className="text-cyan-800 font-bold">{filteredVerbs.length}</strong> z {ALL_IRREGULAR_VERBS.length} czasowników
          </div>

          {/* Verbs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredVerbs.map((verb) => (
              <div
                key={verb.id}
                className="bg-white rounded-3xl p-4 border border-cyan-200/80 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400">Znaczenie:</span>
                      <h3 className="text-base font-black text-slate-900 font-display">
                        {verb.pl}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleSpeakVerb(verb)}
                      className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition-colors cursor-pointer"
                      title="Posłuchaj wymowy 3 form"
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
            <span>Pytanie {quizIndex + 1} z {quizPool.length}</span>
            <span className="text-cyan-700 font-bold">Wybierz poprawną formę Past Simple</span>
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
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{quizIndex + 1 < quizPool.length ? 'Następny czasownik' : 'Zakończ trening!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
