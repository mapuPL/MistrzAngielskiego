import React, { useState, useEffect } from 'react';
import { CategoryId, GameMode, PlayerStats, DailyChallengeState, GradeLevel } from '../types';
import { getLandsForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { speakEnglish, soundManager } from '../utils/audio';
import { 
  Sparkles, BookOpen, Volume2, Gamepad2, SpellCheck, Lock, Headphones, 
  CheckCircle2, Flame, Zap, GraduationCap, BarChart2 
} from 'lucide-react';

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
  const isDark = currentGrade === 'grade7_8';

  return (
    <div className="space-y-6">
      
      {/* Grade Hero / Mascot Welcome Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${gradeConfig.heroGradient} shadow-lg border relative overflow-hidden transition-all`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl sm:text-6xl shadow-inner border border-white/30 transform group-hover:scale-105 transition-transform">
                {gradeConfig.mascotEmoji}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
                POZ. {playerLevel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
                <span>{gradeConfig.badgeLabel}</span>
                <span>•</span>
                <span>Wiek: {gradeConfig.ageRange}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-xs">
                Witaj, {playerStats.name}! 🌟
              </h1>
              <p className="text-xs sm:text-sm font-medium text-white/90 max-w-xl leading-relaxed">
                {gradeConfig.tagline}. {gradeConfig.description}
              </p>
            </div>
          </div>

          {/* Action buttons on the banner */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            
            {/* Dashboard Ucznia Prominent Button */}
            <button
              onClick={() => {
                soundManager.playClick(!playerStats.soundEnabled);
                onSelectMode('dashboard');
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-emerald-100" />
              <span>Dashboard Ucznia 📊</span>
            </button>

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
        <div className={`rounded-3xl p-5 text-white shadow-md border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark 
            ? 'bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 border-purple-700/80' 
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-300/80'
        }`}>
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
              📅
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black uppercase tracking-wider text-amber-100">
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
              <p className="text-xs text-white/80 font-medium">
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
        <div className={`lg:col-span-7 rounded-3xl p-5 border shadow-sm space-y-4 ${
          isDark 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : `${gradeConfig.cardBg} border-slate-200 text-slate-900`
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-extrabold font-display">
                🗺️ Moduły Tematyczne: {gradeConfig.name} ({gradeConfig.ageRange})
              </h2>
              <p className="text-xs opacity-70">
                Wybierz obszar poniżej, aby poznać specjalistyczne słownictwo i rozpocząć misję!
              </p>
            </div>
            <button
              onClick={() => onSelectMode('dashboard')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Statystyki krain</span>
            </button>
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

          {/* 7 Land Selectors with Crystal Clear Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {lands.map((land) => {
              const isSelected = selectedCategory === land.id;
              const unlocked = isLandUnlocked(land);
              const count = vocabulary.filter(v => v.category === land.id).length;

              // Compute clean, explicit contrast styles based on grade
              let cardStyle = '';
              if (isDark) {
                if (isSelected) {
                  cardStyle = 'bg-violet-950/90 border-violet-400 text-white shadow-md ring-2 ring-violet-400';
                } else if (unlocked) {
                  cardStyle = 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-100 hover:border-violet-500/60';
                } else {
                  cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60';
                }
              } else {
                if (isSelected) {
                  cardStyle = 'bg-amber-100/90 border-amber-500 text-slate-900 shadow-xs ring-2 ring-amber-400';
                } else if (unlocked) {
                  cardStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                } else {
                  cardStyle = 'bg-slate-50/70 border-slate-200 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={land.id}
                  onClick={() => {
                    soundManager.playClick(!playerStats.soundEnabled);
                    setSelectedCategory(land.id);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${cardStyle}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{land.icon}</span>
                    <div className="min-w-0">
                      <div className={`text-xs font-black truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {land.namePl}
                      </div>
                      <div className={`text-[10px] truncate font-medium ${
                        isDark ? (isSelected ? 'text-violet-200' : 'text-slate-300') : 'text-slate-500'
                      }`}>
                        {land.nameEn} · {count} słówek
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {unlocked ? (
                      <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isDark 
                          ? 'bg-violet-950 text-violet-300 border border-violet-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
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
          <div className={`rounded-3xl p-5 border shadow-sm space-y-4 ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : `${gradeConfig.cardBg} border-slate-200 text-slate-900`
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-200/80'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-3xl p-2.5 rounded-2xl ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-amber-100'
                }`}>
                  {activeLand.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black font-display text-inherit">
                    {activeLand.namePl}
                  </h3>
                  <p className={`text-xs font-bold ${
                    isDark ? 'text-violet-400' : 'text-amber-600'
                  }`}>
                    {activeLand.nameEn}
                  </p>
                </div>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-200' : 'text-slate-600'
            }`}>
              {activeLand.description}
            </p>

            {/* Grammar focus note */}
            <div className={`p-3 rounded-2xl border text-xs ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-200' 
                : 'bg-amber-50/70 border-amber-200 text-slate-800'
            }`}>
              <span className={`font-extrabold ${
                isDark ? 'text-violet-300' : 'text-amber-800'
              }`}>
                Nacisk gramatyczny:
              </span>{' '}
              <span className="font-medium">{activeLand.grammarFocus}</span>
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
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
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
                  className={`hover:underline flex items-center gap-1 font-semibold ${
                    isDark ? 'text-violet-400' : 'text-amber-600'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pełny słownik</span>
                </button>
              </div>

              {/* Grid of words with high contrast for dark and light modes */}
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {landVocab.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      soundManager.playClick(!playerStats.soundEnabled);
                      speakEnglish(word.en);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl border text-left transition-colors group cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white hover:border-violet-400'
                        : 'bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-slate-200 text-slate-800'
                    }`}
                    title={`Posłuchaj wymowy: ${word.en}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{word.emoji}</span>
                      <div className="truncate">
                        <div className={`text-xs font-bold truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {word.en}
                        </div>
                        <div className={`text-[10px] truncate ${
                          isDark ? 'text-violet-300' : 'text-slate-500'
                        }`}>
                          {word.pl}
                        </div>
                      </div>
                    </div>
                    <Volume2 className={`w-3.5 h-3.5 shrink-0 ml-1 ${
                      isDark 
                        ? 'text-violet-400 group-hover:text-violet-200' 
                        : 'text-slate-400 group-hover:text-amber-500'
                    }`} />
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
