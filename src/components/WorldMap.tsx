import React, { useState, useEffect } from 'react';
import { CategoryId, GameMode, PlayerStats, DailyChallengeState, GradeLevel } from '../types';
import { getLandsForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import { Sparkles, BookOpen, Volume2, Gamepad2, SpellCheck, Lock, Headphones, CheckCircle2, Flame, Zap, GraduationCap } from 'lucide-react';

interface WorldMapProps {
  currentGrade: GradeLevel;
  onSelectCategoryAndMode: (category: CategoryId, mode: GameMode) => void;
  onSelectMode: (mode: GameMode) => void;
  playerStats: PlayerStats;
  dailyState?: DailyChallengeState;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentGrade,
  onSelectCategoryAndMode,
  onSelectMode,
  playerStats,
  dailyState
}) => {
  const lands = getLandsForGrade(currentGrade);
  const vocabulary = getVocabularyForGrade(currentGrade);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(lands[0]?.id || 'animals');
  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);

  // Sync category if grade changes and previous category is not in new grade
  useEffect(() => {
    if (!lands.some(l => l.id === selectedCategory)) {
      setSelectedCategory(lands[0]?.id || 'animals');
    }
  }, [currentGrade, lands, selectedCategory]);

  const activeLand = lands.find(l => l.id === selectedCategory) || lands[0];
  const landVocab = vocabulary.filter(v => v.category === selectedCategory);

  const isLandUnlocked = (land: typeof lands[0]) => {
    return playerStats.stars >= land.requiredStarsToUnlock;
  };

  const handleSpeakWelcome = () => {
    soundManager.playClick(!playerStats.soundEnabled);
    setIsSpeakingWelcome(true);

    let message = `Hello ${playerStats.name || 'friend'}! Welcome to English Star! Let's explore all seven lands together!`;
    if (currentGrade === 'grade4_6') {
      message = `Hello ${playerStats.name || 'explorer'}! Welcome to English Explorer. Let's master vocabulary, grammar, and irregular verbs!`;
    } else if (currentGrade === 'grade7_8') {
      message = `Hello ${playerStats.name || 'candidate'}! Welcome to English Pro B1. Let's practice key CKE exam tasks and conditionals together!`;
    }

    speakEnglish(message, 0.88, () => {
      setIsSpeakingWelcome(false);
    });
  };

  const playerLevel = Math.max(1, Math.floor(playerStats.stars / 15) + 1);
  const currentLevelProgress = Math.min(100, Math.round(((playerStats.stars % 15) / 15) * 100));

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner tailored to Grade Level */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradeConfig.heroGradient} p-6 md:p-8 shadow-md border-2 border-amber-300/40`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Mascot Avatar Display */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden border-4 border-white/80 shadow-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
              {currentGrade === 'grade3' ? (
                <>
                  <img
                    src="/src/assets/images/mascot_fox_leo_1792504961154.jpg"
                    alt="Lisek Leo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-4xl absolute" aria-hidden="true">🦊</span>
                </>
              ) : (
                <span className="text-5xl">{gradeConfig.mascotEmoji}</span>
              )}
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{gradeConfig.badgeLabel} · 7 Modułów Tematycznych</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-display">
                Cześć {playerStats.name || 'Uczniu'}! Witaj w {gradeConfig.name}!
              </h1>
              <p className="text-sm opacity-90 font-medium">
                {gradeConfig.tagline}
              </p>

              {/* Player XP Level Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 max-w-md">
                <div className="text-xs font-bold whitespace-nowrap">
                  Poziom {playerLevel} · {playerStats.stars} ⭐
                </div>
                <div className="flex-1 bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/30">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentLevelProgress}%` }}
                  />
                </div>
                <div className="text-[11px] font-bold font-mono whitespace-nowrap opacity-90">
                  {playerStats.stars % 15}/15 XP do poziomu {playerLevel + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleSpeakWelcome}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
                isSpeakingWelcome
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Volume2 className="w-5 h-5 text-amber-600" />
              <span>{isSpeakingWelcome ? 'Odtwarzanie...' : `Posłuchaj (${gradeConfig.mascotName}) 🔊`}</span>
            </button>

            {/* Quick button to level-specific killer feature */}
            {currentGrade === 'grade4_6' && (
              <button
                onClick={() => onSelectMode('irregular_verbs')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Czasowniki Nieregularne ⚡</span>
              </button>
            )}

            {currentGrade === 'grade7_8' && (
              <button
                onClick={() => onSelectMode('cke_exam')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-violet-200" />
                <span>Trener Egzaminu CKE 🎓</span>
              </button>
            )}

            {currentGrade === 'grade3' && (
              <button
                onClick={() => onSelectMode('speed_listening')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-amber-300" />
                <span>Pokój Słuchowy (Nowość!)</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Daily Challenges Quick Banner */}
      {dailyState && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-md border-2 border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
              📅
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black text-amber-100 uppercase tracking-wider">
                <span>Codzienne Wyzwania · {gradeConfig.name}</span>
                <span className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-white font-mono">
                  <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  {dailyState.dailyStreak} {dailyState.dailyStreak === 1 ? 'dzień serii' : 'dni serii'}
                </span>
              </div>
              <div className="text-base sm:text-lg font-black font-display mt-0.5">
                {dailyState.allCompletedClaimed
                  ? 'Wszystkie 3 dzisiejsze wyzwania ukończone! Brawo! 🌟'
                  : `Dzisiaj ukończono: ${dailyState.tasks.filter(t => t.current >= t.target).length} z 3 zadań`}
              </div>
              <p className="text-xs text-amber-100/90 font-medium">
                {dailyState.allCompletedClaimed
                  ? `Odblokowano Odznakę Dnia: ${dailyState.dailyBadgeName}`
                  : 'Wykonaj dzisiejsze dedykowane misje, aby zdobyć bonusowe punkty XP i Odznakę Dnia!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectMode('daily')}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-amber-50 text-slate-900 font-black text-xs sm:text-sm rounded-2xl shadow-xs transition-transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
          >
            Otwórz Wyzwania Dnia ➔
          </button>
        </div>
      )}

      {/* Main Adventure Map & Land Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Thematic Lands */}
        <div className={`lg:col-span-7 ${gradeConfig.cardBg} rounded-3xl p-5 border ${gradeConfig.cardBorder} shadow-xs space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-extrabold font-display">
                🗺️ Moduły Tematyczne: {gradeConfig.name} ({gradeConfig.ageRange})
              </h2>
              <p className="text-xs opacity-70">
                Wybierz obszar poniżej, aby poznać specjalistyczne słownictwo i rozpocząć misję!
              </p>
            </div>
          </div>

          {/* Map/Graphic Visual header */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900/10 aspect-video shadow-inner flex items-center justify-center">
            {currentGrade === 'grade3' ? (
              <img
                src="/src/assets/images/english_quest_map_1792504961161.jpg"
                alt="Magiczna mapa wyprawy do krain języka angielskiego"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : currentGrade === 'grade4_6' ? (
              <div className="w-full h-full bg-gradient-to-br from-cyan-900 via-sky-800 to-indigo-950 p-6 flex flex-col justify-between text-white relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest bg-cyan-500/30 px-3 py-1 rounded-full border border-cyan-400/40">
                    ENGLISH EXPLORER MAP
                  </span>
                  <span className="text-2xl">🧭</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-cyan-200">
                    Odkrywaj Świat Języka Angielskiego
                  </h3>
                  <p className="text-xs text-sky-200 mt-1 max-w-md">
                    Podróże, zawody, zdrowie, geografia i gramatyka czasów Past Simple oraz Present Continuous.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg">✈️ City & Travel</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg">💼 Jobs</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg">⛰️ Nature</span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg">⚡ Irregular Verbs</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 p-6 flex flex-col justify-between text-white relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest bg-purple-500/30 px-3 py-1 rounded-full border border-purple-400/40 text-purple-200">
                    CKE EXAM B1 MATRIX
                  </span>
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-purple-200">
                    Strefa Przygotowania do Egzaminu Ósmoklasisty
                  </h3>
                  <p className="text-xs text-purple-300 mt-1 max-w-md">
                    Poziom B1: Nauka i AI, Ekologia, Parafrazy CKE, Okresy Warunkowe (Conditionals) i Strona Bierna.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-purple-900/60 border border-purple-700 px-2.5 py-1 rounded-lg">🤖 AI & Science</span>
                  <span className="bg-purple-900/60 border border-purple-700 px-2.5 py-1 rounded-lg">🌍 Ecology</span>
                  <span className="bg-purple-900/60 border border-purple-700 px-2.5 py-1 rounded-lg">📝 CKE Tasks</span>
                  <span className="bg-purple-900/60 border border-purple-700 px-2.5 py-1 rounded-lg">🔮 Conditionals</span>
                </div>
              </div>
            )}
          </div>

          {/* 7 Land Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {lands.map((land) => {
              const isSelected = selectedCategory === land.id;
              const unlocked = isLandUnlocked(land);
              const count = vocabulary.filter(v => v.category === land.id).length;

              return (
                <button
                  key={land.id}
                  onClick={() => {
                    soundManager.playClick(!playerStats.soundEnabled);
                    setSelectedCategory(land.id);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-500 shadow-xs ring-2 ring-amber-400'
                      : unlocked
                      ? 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{land.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">
                        {land.namePl}
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        {land.nameEn} · {count} słówek
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {unlocked ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{land.requiredStarsToUnlock} ⭐</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Land Details & Quick Missions */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${gradeConfig.cardBg} rounded-3xl p-5 border ${gradeConfig.cardBorder} shadow-xs space-y-4`}>
            
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 bg-amber-100 dark:bg-amber-950/60 rounded-2xl">{activeLand.icon}</span>
                <div>
                  <h3 className="text-lg font-black font-display">
                    {activeLand.namePl}
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    {activeLand.nameEn}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              {activeLand.description}
            </p>

            {/* Grammar focus note */}
            <div className="p-3 bg-amber-50/70 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs">
              <span className="font-extrabold text-amber-800 dark:text-amber-400">Nacisk gramatyczny:</span>{' '}
              <span className="font-medium opacity-90">{activeLand.grammarFocus}</span>
            </div>

            {/* Mission Launchers for this category */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'quiz');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl ${gradeConfig.primaryButton} font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer`}
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>
                    {currentGrade === 'grade7_8' ? 'Quiz Egzaminacyjny B1' : 'Zagraj w Quiz Mistrza'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+10 ⭐</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'sentences');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {currentGrade === 'grade7_8'
                      ? 'Architekt Zdań CKE & Conditionals'
                      : 'Buduj Zdania (Fabryka Zdań)'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+12 ⭐</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'speed_listening');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>Pokój Słuchowy (Reakcja 10s)</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+12 ⭐</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'spelling');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SpellCheck className="w-4 h-4" />
                  <span>
                    {currentGrade === 'grade3' ? 'Balonikowe Literkowanie' : 'Trening Ortografii i Pisowni'}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+15 ⭐</span>
              </button>
            </div>

            {/* Vocabulary preview with click to pronounce */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span>Słówka w tym module ({landVocab.length}):</span>
                <button
                  onClick={() => onSelectMode('dictionary')}
                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pełny słownik</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {landVocab.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      soundManager.playClick(!playerStats.soundEnabled);
                      speakEnglish(word.en);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 border border-slate-200 dark:border-slate-700 text-left transition-colors group cursor-pointer"
                    title={`Posłuchaj wymowy: ${word.en}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{word.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {word.en}
                        </div>
                        <div className="text-[10px] opacity-70 truncate">
                          {word.pl}
                        </div>
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
