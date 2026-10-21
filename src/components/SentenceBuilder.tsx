import React, { useState, useEffect, useCallback } from 'react';
import { SentenceItem } from '../types';
import { SENTENCE_QUESTS } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle, RotateCcw, ArrowRight, Lightbulb, ArrowLeft } from 'lucide-react';

interface SentenceBuilderProps {
  onAddStars: (amount: number) => void;
  soundEnabled: boolean;
  onBackToMenu: () => void;
  onCompleteSentences: () => void;
  onSentenceBuilt?: () => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  onAddStars,
  soundEnabled,
  onBackToMenu,
  onCompleteSentences,
  onSentenceBuilt
}) => {
  const [questList, setQuestList] = useState<SentenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; word: string; isUsed: boolean }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedQuests, setCompletedQuests] = useState(0);

  const initGame = useCallback(() => {
    const shuffled = [...SENTENCE_QUESTS].sort(() => 0.5 - Math.random());
    setQuestList(shuffled);
    setCurrentIndex(0);
    setCompletedQuests(0);
  }, []);

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
  }, [currentQuest]);

  const handlePickWord = (item: { id: string; word: string; isUsed: boolean }) => {
    if (item.isUsed || isSuccess || !currentQuest) return;

    soundManager.playClick(!soundEnabled);
    const newPicked = [...pickedWords, item.word];
    setPickedWords(newPicked);

    setAvailableWords(prev =>
      prev.map(w => (w.id === item.id ? { ...w, isUsed: true } : w))
    );

    // Check if match
    if (newPicked.length === currentQuest.words.length) {
      const builtString = newPicked.join(' ');
      const targetString = currentQuest.words.join(' ');

      if (builtString === targetString) {
        setIsSuccess(true);
        soundManager.playSuccess(!soundEnabled);
        soundManager.playStar(!soundEnabled);
        speakEnglish(currentQuest.fullEn);
        onAddStars(5);
        setCompletedQuests(prev => prev + 1);
        if (onSentenceBuilt) onSentenceBuilt();

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        soundManager.playError(!soundEnabled);
      }
    }
  };

  const handleRemoveWord = (index: number) => {
    if (isSuccess) return;
    soundManager.playClick(!soundEnabled);

    const wordToRemove = pickedWords[index];
    const newPicked = pickedWords.filter((_, i) => i !== index);
    setPickedWords(newPicked);

    // Free word
    let freed = false;
    setAvailableWords(prev =>
      prev.map(w => {
        if (!freed && w.isUsed && w.word === wordToRemove) {
          freed = true;
          return { ...w, isUsed: false };
        }
        return w;
      })
    );
  };

  const handleHint = () => {
    if (isSuccess || !currentQuest) return;
    const nextIdx = pickedWords.length;
    if (nextIdx < currentQuest.words.length) {
      const correctWord = currentQuest.words[nextIdx];
      const match = availableWords.find(w => !w.isUsed && w.word === correctWord);
      if (match) {
        handlePickWord(match);
      }
    }
  };

  const handleNextQuest = () => {
    soundManager.playClick(!soundEnabled);
    if (currentIndex + 1 < questList.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare(!soundEnabled);
      onCompleteSentences();
      confetti({ particleCount: 100, spread: 80 });
      onAddStars(15);
      initGame();
    }
  };

  if (!currentQuest) {
    return <div className="text-center p-8">Ładowanie zadań układania zdań...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wróć do mapy</span>
          </button>
          <div className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            Ułożone zdania: <span className="font-mono text-amber-700 font-extrabold">{completedQuests}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-display">
              🧩 Fabryka Zdań (Ułóż zdanie)
            </h2>
            <p className="text-xs text-slate-500">
              Ułóż angielskie słówka w poprawnej kolejności gramatycznej!
            </p>
          </div>
        </div>
      </div>

      {/* Main Builder Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6 text-center">
        
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Zdanie {currentIndex + 1} z {questList.length}</span>
          <button
            onClick={handleHint}
            disabled={isSuccess || pickedWords.length >= currentQuest.words.length}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Kolejne słowo</span>
          </button>
        </div>

        {/* Target Polish sentence */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 max-w-lg mx-auto space-y-1">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Zdanie po polsku:
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
            „{currentQuest.fullPl}”
          </div>
        </div>

        {/* Drop / Assembly Area */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500">
            Twoje ułożone zdanie (kliknij słówko, aby je cofnąć):
          </div>

          <div className="min-h-[72px] p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-wrap items-center justify-center gap-2">
            {pickedWords.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Wybierz poniższe słówka, aby ułożyć zdanie...
              </span>
            ) : (
              pickedWords.map((word, idx) => (
                <button
                  key={`picked-${idx}`}
                  onClick={() => handleRemoveWord(idx)}
                  disabled={isSuccess}
                  className={`px-3.5 py-2 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-150 ${
                    isSuccess
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-amber-500 hover:bg-rose-500 text-white shadow-xs active:scale-95'
                  }`}
                  title="Kliknij, aby usunąć"
                >
                  {word}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Word Options */}
        {!isSuccess && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-500">
              Dostępne słowa:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-md mx-auto">
              {availableWords.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePickWord(item)}
                  disabled={item.isUsed}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-xs ${
                    item.isUsed
                      ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed shadow-none'
                      : 'bg-white hover:bg-amber-100 text-slate-800 border-2 border-slate-200 hover:border-amber-400 cursor-pointer transform hover:-translate-y-0.5 active:scale-95'
                  }`}
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-base sm:text-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Świetnie! Poprawne zdanie!</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800">
              <span>{currentQuest.fullEn}</span>
              <button
                onClick={() => speakEnglish(currentQuest.fullEn)}
                className="p-1 rounded-md text-amber-700 hover:bg-amber-100"
                title="Posłuchaj całego zdania"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleNextQuest}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <span>{currentIndex + 1 < questList.length ? 'Następne zdanie' : 'Koniec rundy!'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
