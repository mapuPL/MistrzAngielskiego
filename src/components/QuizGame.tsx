import React, { useState, useEffect, useCallback } from 'react';
import { CategoryId, VocabItem } from '../types';
import { VOCABULARY, CATEGORIES } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Flame, ArrowLeft } from 'lucide-react';

interface QuizGameProps {
  initialCategory?: CategoryId;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteQuiz: () => void;
  onAnswerCorrect?: () => void;
}

type QuizType = 'visual' | 'listening' | 'en_to_pl';

export const QuizGame: React.FC<QuizGameProps> = ({
  initialCategory = 'animals',
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteQuiz,
  onAnswerCorrect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
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

  // Pool of available words
  const currentPool = React.useMemo(() => {
    if (selectedCategory === 'all') return VOCABULARY;
    return VOCABULARY.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  // Start/restart quiz
  const startQuiz = useCallback(() => {
    // Shuffle and pick 8 questions
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

    // Pick 3 distractors from the entire pool
    const otherOptions = VOCABULARY.filter(v => v.id !== currentQuestion.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const fullOptions = [...otherOptions, currentQuestion].sort(() => 0.5 - Math.random());
    setOptions(fullOptions);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowPhonetic(false);

    // If listening quiz, speak automatically
    if (quizType === 'listening') {
      setTimeout(() => {
        speakEnglish(currentQuestion.en);
      }, 300);
    }
  }, [currentQuestion, quizType]);

  const handleSelectOption = (option: VocabItem) => {
    if (isAnswered || !currentQuestion) return;

    const correct = option.id === currentQuestion.id;
    setSelectedOption(option.id);
    setIsAnswered(true);
    setShowPhonetic(true);

    // Always pronounce the English word so child connects sound to meaning
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      // Bonus stars for finishing
      onAddStars(score >= 6 ? 10 : 5);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-inner">
          {percentage >= 80 ? '🏆' : percentage >= 50 ? '⭐' : '💪'}
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            {percentage >= 80 ? 'Wspaniale! Super Mistrz!' : percentage >= 50 ? 'Bardzo dobra robota!' : 'Świetna próba! Trening czyni mistrza!'}
          </h2>
          <p className="text-slate-600 font-medium">
            Twój wynik: <span className="font-extrabold text-amber-600">{score}</span> z <span className="font-bold">{questions.length}</span> poprawnych odpowiedzi ({percentage}%)
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 font-bold text-sm">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Zdobywasz +{score >= 6 ? 10 : 5} bonusowych gwiazdek do dyplomu!</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={startQuiz}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Zagraj jeszcze raz</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wróć do mapy</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center p-8">Ładowanie pytań...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Control Bar: Categories & Quiz Mode */}
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
            Kraina: <span className="text-amber-800 font-extrabold">{selectedCategory === 'all' ? 'Wszystkie' : CATEGORIES.find(c => c.id === selectedCategory)?.namePl}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
              }`}
            >
              🌟 Wszystkie (Miks)
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                }`}
              >
                {c.icon} {c.namePl}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setQuizType('visual')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                quizType === 'visual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Obrazek i polskie tłumaczenie"
            >
              🖼️ Obrazki
            </button>
            <button
              onClick={() => setQuizType('listening')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                quizType === 'listening' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Posłuchaj i wybierz ze słuchu"
            >
              🎧 Ze słuchu
            </button>
            <button
              onClick={() => setQuizType('en_to_pl')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                quizType === 'en_to_pl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Angielski na polski"
            >
              🇬🇧 Angielski ➔ PL
            </button>
          </div>

        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
        
        {/* Progress & Streak Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span>Pytanie {currentIndex + 1} z {questions.length}</span>
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <div className="flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full animate-bounce-subtle">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>Seria x{streak}!</span>
              </div>
            )}
            <div className="text-amber-800">
              Punkty: <span className="font-mono text-sm">{score}</span>
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="text-center space-y-3 py-2">
          
          {quizType === 'visual' && (
            <div className="space-y-2">
              <span className="text-6xl sm:text-7xl block transition-transform hover:scale-105 select-none" role="img" aria-label={currentQuestion.pl}>
                {currentQuestion.emoji}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Jak to jest po angielsku?
              </h2>
              <p className="text-base font-semibold text-amber-700">
                „{currentQuestion.pl}”
              </p>
            </div>
          )}

          {quizType === 'listening' && (
            <div className="space-y-3">
              <button
                onClick={() => speakEnglish(currentQuestion.en)}
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                title="Kliknij, aby odsłuchać słowo"
                aria-label="Posłuchaj wymowy"
              >
                <Volume2 className="w-10 h-10" />
              </button>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Posłuchaj i wybierz właściwe słowo!
              </h2>
              <p className="text-xs text-slate-500">
                Kliknij głośniczek, jeśli chcesz usłyszeć słówko jeszcze raz.
              </p>
            </div>
          )}

          {quizType === 'en_to_pl' && (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-2xl text-2xl font-extrabold text-amber-950 font-display">
                <span>{currentQuestion.en}</span>
                <button
                  onClick={() => speakEnglish(currentQuestion.en)}
                  className="p-1 text-amber-700 hover:text-amber-950"
                  title="Posłuchaj wymowy"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Co oznacza to słowo po polsku?
              </h2>
            </div>
          )}

          {/* Phonetic & Example hint if answered */}
          {showPhonetic && (
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs max-w-md mx-auto space-y-1">
              <div className="font-bold text-amber-900">
                Wymowa: <span className="font-mono text-amber-700 font-semibold">{currentQuestion.phonetic}</span> · Znaczenie: <span className="font-semibold text-slate-800">{currentQuestion.pl}</span>
              </div>
              <div className="text-slate-600 italic">
                „{currentQuestion.exampleEn}” ({currentQuestion.examplePl})
              </div>
            </div>
          )}

        </div>

        {/* 4 Choices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            const isCorrect = opt.id === currentQuestion.id;

            let buttonStyle = 'bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-slate-200 text-slate-800';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-extrabold';
              } else if (isChosen && !isCorrect) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300';
              } else {
                buttonStyle = 'bg-slate-50 border-slate-200 opacity-60 text-slate-500';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-150 ${buttonStyle} ${
                  !isAnswered ? 'active:scale-98 cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <div className="text-base sm:text-lg font-bold">
                      {quizType === 'en_to_pl' ? opt.pl : opt.en}
                    </div>
                    {isAnswered && (
                      <div className="text-xs text-slate-500">
                        {quizType === 'en_to_pl' ? opt.en : opt.pl}
                      </div>
                    )}
                  </div>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isChosen && !isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Następne pytanie' : 'Zobacz wynik!'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
