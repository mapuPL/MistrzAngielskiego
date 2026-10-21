import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryId, VocabItem, GradeLevel } from '../types';
import { getCategoriesForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Flame, ArrowLeft } from 'lucide-react';

interface QuizGameProps {
  currentGrade: GradeLevel;
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteQuiz: () => void;
  onAnswerCorrect?: () => void;
}

type QuizType = 'visual' | 'listening' | 'en_to_pl';

export const QuizGame: React.FC<QuizGameProps> = ({
  currentGrade,
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteQuiz,
  onAnswerCorrect
}) => {
  const categories = useMemo(() => getCategoriesForGrade(currentGrade), [currentGrade]);
  const allVocab = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  // Verify initial category is valid for this grade
  const validInitial = categories.some(c => c.id === initialCategory) ? initialCategory : categories[0]?.id || 'all';
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(validInitial);
  const [quizType, setQuizType] = useState<QuizType>('visual');
  const [questions, setQuestions] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<VocabItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);

  // Pool of available words for this grade & category
  const currentPool = useMemo(() => {
    if (selectedCategory === 'all') return allVocab;
    const filtered = allVocab.filter(v => v.category === selectedCategory);
    return filtered.length > 0 ? filtered : allVocab;
  }, [selectedCategory, allVocab]);

  // Start/restart quiz
  const startQuiz = useCallback(() => {
    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(8, shuffled.length));
    setQuestions(picked);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowPhonetic(false);
  }, [currentPool]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const currentQuestion = questions[currentIndex];

  // Generate options when question changes
  useEffect(() => {
    if (!currentQuestion) return;

    // Pick 3 distractors from the current grade's vocabulary pool
    const otherOptions = allVocab
      .filter(v => v.id !== currentQuestion.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const fullOptions = [...otherOptions, currentQuestion].sort(() => 0.5 - Math.random());
    setOptions(fullOptions);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowPhonetic(false);

    // If listening quiz, speak automatically
    if (quizType === 'listening') {
      const timer = setTimeout(() => {
        speakEnglish(currentQuestion.en);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, quizType, allVocab]);

  const handleSelectOption = (option: VocabItem) => {
    if (isAnswered || !currentQuestion) return;

    const correct = option.id === currentQuestion.id;
    setSelectedOption(option.id);
    setIsAnswered(true);
    setShowPhonetic(true);

    // Pronounce the English word
    speakEnglish(currentQuestion.en);

    if (correct) {
      soundManager.playSuccess(!soundEnabled);
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      onAddStars(2);
      if (onAnswerCorrect) onAnswerCorrect();

      if (newStreak === 3 || newStreak === 5) {
        soundManager.playStar(!soundEnabled);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      soundManager.playError(!soundEnabled);
      setStreak(0);
    }
  };

  const handleNext = () => {
    soundManager.playClick(!soundEnabled);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      onCompleteQuiz();
      soundManager.playFanfare(!soundEnabled);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
      // Completion bonus
      onAddStars(5);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Controls & Grade Context */}
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
            {currentGrade === 'grade7_8' ? 'Quiz Egzaminacyjny B1' : 'Quiz Mistrza'}
          </h2>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black animate-bounce shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Seria: {streak}x Combo!</span>
            </div>
          )}
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Wynik: <span className="text-amber-500 font-black text-sm">{score}</span> / {questions.length}
          </div>
        </div>
      </div>

      {/* Mode & Category Selectors */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Quiz Variant Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setQuizType('visual');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              quizType === 'visual'
                ? `${gradeConfig.primaryButton} shadow-xs`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🖼️ Obrazkowy Quiz
          </button>

          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setQuizType('listening');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              quizType === 'listening'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🎧 Listening Challenge
          </button>

          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setQuizType('en_to_pl');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              quizType === 'en_to_pl'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🇬🇧 Angielski ➔ 🇵🇱 Polski
          </button>
        </div>

        {/* Category Pills tailored to this grade */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ✨ Wszystkie ({allVocab.length})
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
      </div>

      {/* Active Question Box */}
      {!isFinished && currentQuestion && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">
              Pytanie {currentIndex + 1} z {questions.length}
            </span>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="text-center py-4 space-y-3">
            {quizType === 'visual' && (
              <>
                <div className="text-7xl sm:text-8xl animate-bounce-subtle select-none">
                  {currentQuestion.emoji}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                  Jak to powiesz po angielsku?
                </h3>
                <p className="text-sm font-semibold text-slate-500">
                  Znaczenie: <span className="text-amber-600 dark:text-amber-400 font-bold">{currentQuestion.pl}</span>
                </p>
              </>
            )}

            {quizType === 'listening' && (
              <>
                <div className="flex justify-center">
                  <button
                    onClick={() => speakEnglish(currentQuestion.en)}
                    className="w-24 h-24 rounded-full bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 dark:hover:bg-sky-900 border-2 border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-md active:scale-95 transition-all cursor-pointer group"
                    title="Odtwórz dźwięk ponownie"
                  >
                    <Volume2 className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                  Posłuchaj wymowy i wybierz poprawne słówko!
                </h3>
                <p className="text-xs text-slate-400">
                  Kliknij głośnik, jeśli chcesz usłyszeć nagranie ponownie
                </p>
              </>
            )}

            {quizType === 'en_to_pl' && (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/60 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <span className="text-3xl">{currentQuestion.emoji}</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-purple-950 dark:text-purple-200 font-display">
                    {currentQuestion.en}
                  </span>
                  <button
                    onClick={() => speakEnglish(currentQuestion.en)}
                    className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300 cursor-pointer"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  Co oznacza to słowo po polsku?
                </h3>
              </>
            )}

            {/* Phonetic Pronunciation Guide for young learners */}
            {showPhonetic && currentQuestion.phonetic && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-full text-xs font-mono font-bold text-amber-900 dark:text-amber-300 animate-fadeIn">
                <span>Wymowa:</span>
                <span>{currentQuestion.phonetic}</span>
              </div>
            )}
          </div>

          {/* 4 Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQuestion.id;

              let btnStyle = 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600';
                } else {
                  btnStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all font-bold text-sm sm:text-base cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{opt.emoji}</span>
                    <div className="truncate">
                      <div>{quizType === 'en_to_pl' ? opt.pl : opt.en}</div>
                      {currentGrade === 'grade3' && (
                        <div className="text-[11px] font-mono opacity-80">
                          {quizType === 'en_to_pl' ? opt.en : opt.phonetic}
                        </div>
                      )}
                    </div>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 ml-2">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button / Explanation when Answered */}
          {isAnswered && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-amber-600 dark:text-amber-400">Przykład:</span>{' '}
                <span className="italic">"{currentQuestion.exampleEn}"</span> — {currentQuestion.examplePl}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <span>{currentIndex + 1 < questions.length ? 'Następne pytanie' : 'Zobacz wynik'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Finished Summary Screen */}
      {isFinished && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-4xl shadow-inner">
            🏆
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Wspaniały wynik w Quizie!
            </h3>
            <p className="text-sm text-slate-500">
              Ukończono zestaw pytań dla poziomu: <span className="font-bold text-amber-500">{gradeConfig.name}</span>
            </p>
          </div>

          <div className="flex justify-center gap-6 py-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-28">
              <div className="text-3xl font-black text-amber-500">{score} / {questions.length}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Poprawne</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-28">
              <div className="text-3xl font-black text-emerald-500">+{score * 2 + 5} ⭐</div>
              <div className="text-xs font-bold text-slate-500 mt-1">Zdobyte gwiazdki</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={startQuiz}
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
              <span>Wróć do mapy przygody</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
