import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SentenceItem, GradeLevel } from '../types';
import { getSentencesForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle, RotateCcw, ArrowRight, Lightbulb, ArrowLeft, Undo2 } from 'lucide-react';

interface SentenceBuilderProps {
  currentGrade: GradeLevel;
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSentences: () => void;
  onSentenceBuilt?: () => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  currentGrade,
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSentences,
  onSentenceBuilt
}) => {
  const sentencesPool = useMemo(() => getSentencesForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const [questList, setQuestList] = useState<SentenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickedWords, setPickedWords] = useState<{ id: string; word: string }[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; word: string; isUsed: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [completedQuests, setCompletedQuests] = useState(0);

  const initGame = useCallback(() => {
    const shuffled = [...sentencesPool].sort(() => 0.5 - Math.random());
    setQuestList(shuffled);
    setCurrentIndex(0);
    setCompletedQuests(0);
  }, [sentencesPool]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQuest = questList[currentIndex];

  useEffect(() => {
    if (!currentQuest) return;

    // Scramble original words
    const scrambled = [...currentQuest.words]
      .map((w, i) => ({ id: `${w}-${i}`, word: w, isUsed: false }))
      .sort(() => 0.5 - Math.random());

    setAvailableWords(scrambled);
    setPickedWords([]);
    setIsSuccess(false);
    setIsError(false);
  }, [currentQuest]);

  const handlePickWord = (item: { id: string; word: string; isUsed: boolean }) => {
    if (item.isUsed || isSuccess || !currentQuest) return;

    soundManager.playClick(!soundEnabled);
    const newPicked = [...pickedWords, { id: item.id, word: item.word }];
    setPickedWords(newPicked);

    setAvailableWords(prev =>
      prev.map(w => (w.id === item.id ? { ...w, isUsed: true } : w))
    );

    // Check if sentence complete
    if (newPicked.length === currentQuest.words.length) {
      const builtString = newPicked.map(p => p.word).join(' ');
      const targetString = currentQuest.words.join(' ');

      if (builtString === targetString) {
        setIsSuccess(true);
        setIsError(false);
        soundManager.playSuccess(!soundEnabled);
        soundManager.playStar(!soundEnabled);
        speakEnglish(currentQuest.fullEn);
        onAddStars(5);
        setCompletedQuests(prev => prev + 1);
        if (onSentenceBuilt) onSentenceBuilt();

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 }
        });
      } else {
        setIsError(true);
        soundManager.playError(!soundEnabled);
      }
    }
  };

  const handleRemoveWord = (pickedItem: { id: string; word: string }) => {
    if (isSuccess) return;
    soundManager.playClick(!soundEnabled);

    setPickedWords(prev => prev.filter(w => w.id !== pickedItem.id));
    setAvailableWords(prev =>
      prev.map(w => (w.id === pickedItem.id ? { ...w, isUsed: false } : w))
    );
    setIsError(false);
  };

  const handleResetCurrent = () => {
    if (!currentQuest || isSuccess) return;
    soundManager.playClick(!soundEnabled);
    setPickedWords([]);
    setAvailableWords(prev => prev.map(w => ({ ...w, isUsed: false })));
    setIsError(false);
  };

  const handleNextQuest = () => {
    soundManager.playClick(!soundEnabled);
    if (currentIndex + 1 < questList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all
      onCompleteSentences();
      soundManager.playFanfare(!soundEnabled);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 }
      });
      onAddStars(10);
    }
  };

  const isFinishedAll = currentIndex >= questList.length;

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
            {currentGrade === 'grade7_8'
              ? 'Architekt Zdań Egzaminacyjnych B1'
              : 'Buduj Zdania (Fabryka Zdań)'}
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Ukończono: <span className="text-amber-500 font-black text-sm">{completedQuests}</span> zdań
        </div>
      </div>

      {!isFinishedAll && currentQuest && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Wyzwanie {currentIndex + 1} z {questList.length}</span>
            <span>+5 ⭐ za poprawne zdanie</span>
          </div>

          {/* Target Polish Meaning Card */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 text-center space-y-2">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Ułóż angielskie zdanie o znaczeniu:
            </span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-display">
              „{currentQuest.fullPl}”
            </div>
            {currentQuest.hint && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Wskazówka: {currentQuest.hint}</span>
              </div>
            )}
          </div>

          {/* Assembled Sentence Drop Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Twoje ułożone zdanie (kliknij słówko, aby je cofnąć):</span>
              {pickedWords.length > 0 && !isSuccess && (
                <button
                  onClick={handleResetCurrent}
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Wyczyść wszystko</span>
                </button>
              )}
            </div>

            <div className={`min-h-24 p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center justify-center gap-2 transition-all ${
              isSuccess
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-300'
                : isError
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700'
            }`}>
              {pickedWords.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium">
                  Klikaj klocki ze słowami poniżej we właściwej kolejności gramatycznej!
                </span>
              ) : (
                pickedWords.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleRemoveWord(item)}
                    disabled={isSuccess}
                    className={`px-3.5 py-2 rounded-xl text-sm sm:text-base font-extrabold shadow-xs transition-transform cursor-pointer ${
                      isSuccess
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isError
                        ? 'bg-rose-600 text-white hover:scale-95'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-95'
                    }`}
                  >
                    {item.word}
                  </button>
                ))
              )}
            </div>

            {isError && (
              <div className="text-center text-xs font-bold text-rose-600 dark:text-rose-400 animate-fadeIn">
                Kolejność słów nie jest poprawna. Spróbuj cofnąć lub zresetować klocki!
              </div>
            )}
          </div>

          {/* Word Bricks Pool */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 px-1">
              Dostępne klocki ze słówkami:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-100/70 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              {availableWords.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePickWord(item)}
                  disabled={item.isUsed || isSuccess}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    item.isUsed
                      ? 'opacity-20 scale-95 pointer-events-none bg-slate-300 dark:bg-slate-700 text-slate-500'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 shadow-sm hover:border-amber-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner & Audio */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                    Doskonale! Zdanie ułożone poprawnie!
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2 mt-0.5">
                    <span>Posłuchaj wymowy całego zdania:</span>
                    <button
                      onClick={() => speakEnglish(currentQuest.fullEn)}
                      className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-md text-emerald-900 dark:text-emerald-100 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextQuest}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <span>{currentIndex + 1 < questList.length ? 'Następne zdanie' : 'Zakończ fabrykę'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Finished State */}
      {isFinishedAll && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-4xl shadow-inner">
            🧩
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Gratulacje! Wszystkie zdania ułożone!
            </h3>
            <p className="text-sm text-slate-500">
              Opanowałeś struktury gramatyczne na poziomie: <span className="font-bold text-amber-500">{gradeConfig.name}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Zbuduj nową serię zdań</span>
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
