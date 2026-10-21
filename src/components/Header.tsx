import React, { useState } from 'react';
import { GameMode, PlayerStats, GradeLevel } from '../types';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { Volume2, VolumeX, Award, Sparkles, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  playerStats: PlayerStats;
  currentGrade: GradeLevel;
  onChangeGrade: (grade: GradeLevel) => void;
  onOpenLanding: () => void;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenDiploma: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  playerStats,
  currentGrade,
  onChangeGrade,
  onOpenLanding,
  onToggleSound,
  onOpenProfile,
  onOpenDiploma
}) => {
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);

  const gradeConfig = GRADE_CONFIGS[currentGrade];

  // Dynamic nav items based on grade level
  const navItems: { mode: GameMode; label: string }[] = React.useMemo(() => {
    const base: { mode: GameMode; label: string }[] = [
      { mode: 'map', label: 'Wyprawa' },
      { mode: 'dashboard', label: 'Dashboard 📊' },
      { mode: 'daily', label: 'Wyzwania Dnia 📅' }
    ];

    if (currentGrade === 'grade4_6') {
      base.push({ mode: 'irregular_verbs', label: 'Czasowniki Nieregularne ⚡' });
    } else if (currentGrade === 'grade7_8') {
      base.push({ mode: 'cke_exam', label: 'Trener CKE 🎓' });
    }

    base.push(
      {
        mode: 'quiz',
        label: currentGrade === 'grade7_8' ? 'Quiz B1' : 'Quiz Mistrza'
      },
      { mode: 'speed_listening', label: 'Pokój Słuchowy' },
      {
        mode: 'spelling',
        label: currentGrade === 'grade3' ? 'Literkowanie' : currentGrade === 'grade4_6' ? 'Ortografia' : 'Pisownia CKE'
      },
      { mode: 'memory', label: 'Memory' },
      {
        mode: 'sentences',
        label: currentGrade === 'grade7_8' ? 'Architekt Zdań' : 'Buduj Zdania'
      },
      { mode: 'dictionary', label: 'Słowniczek' }
    );

    return base;
  }, [currentGrade]);

  const gradesList: { id: GradeLevel; label: string; icon: string }[] = [
    { id: 'grade3', label: 'Klasa 3 (8–9 lat)', icon: '🦊' },
    { id: 'grade4_6', label: 'Klasy 4–6 (10–12 lat)', icon: '🚀' },
    { id: 'grade7_8', label: 'Klasy 7–8 & CKE (13–15 lat)', icon: '🎓' }
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 shadow-xs ${gradeConfig.headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Wordmark & Grade Badge Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectMode('map')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
            title="Przejdź do mapy głównej"
          >
            <span className="text-2xl transition-transform group-hover:scale-110" role="img" aria-label="Mascot">
              {gradeConfig.mascotEmoji}
            </span>
            <span className={`text-lg sm:text-xl font-extrabold tracking-tight font-display whitespace-nowrap shrink-0 ${gradeConfig.headingColor}`}>
              Angielski<span className="text-amber-500">Mistrz</span>
            </span>
          </button>

          {/* Grade Selector Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-xl border transition-all cursor-pointer shadow-2xs ${gradeConfig.accentBadge}`}
              title="Zmień poziom trudności"
            >
              <span>{gradeConfig.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isGradeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 py-1">
                  Wybierz poziom nauki:
                </div>
                {gradesList.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      onChangeGrade(g.id);
                      setIsGradeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl text-left transition-colors cursor-pointer ${
                      currentGrade === g.id
                        ? 'bg-amber-100 text-amber-950 dark:bg-purple-950/60 dark:text-purple-200'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{g.icon}</span>
                      <span>{g.label}</span>
                    </div>
                    {currentGrade === g.id && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}

                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsGradeDropdownOpen(false);
                      onOpenLanding();
                    }}
                    className="w-full text-center px-3 py-1.5 text-[11px] font-bold text-amber-700 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Przeglądaj wszystkie poziomy ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Single-line nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => onSelectMode(item.mode)}
                className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? `${gradeConfig.primaryButton} shadow-xs scale-102`
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + player progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg text-slate-500 hover:text-amber-700 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={playerStats.soundEnabled ? 'Wycisz dźwięki gry' : 'Włącz dźwięki gry'}
            aria-label="Przełącznik dźwięków"
          >
            {playerStats.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-600 dark:text-purple-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Player Stars counter */}
          <button
            onClick={onOpenDiploma}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-bold text-xs sm:text-sm shadow-xs cursor-pointer ${gradeConfig.accentBadge}`}
            title="Kliknij, aby otworzyć Dyplom / Certyfikat"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-purple-400 fill-amber-500 dark:fill-purple-400 animate-spin-slow" />
            <span className="tabular-nums font-mono font-bold">{playerStats.stars}</span>
            <span className="hidden sm:inline">⭐</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
            title="Profil ucznia i odznaki"
          >
            <span className="text-base">{playerStats.avatar}</span>
            <span className="max-w-[75px] sm:max-w-[100px] truncate">{playerStats.name || 'Uczeń'}</span>
          </button>

          {/* Primary Action: Dyplom */}
          <button
            onClick={onOpenDiploma}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap shrink-0 text-xs sm:text-sm font-bold cursor-pointer ${gradeConfig.primaryButton}`}
          >
            <Award className="w-4 h-4" />
            <span>Dyplom</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar for small screens */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200/50 dark:border-slate-800 px-2 py-1.5 overflow-x-auto gap-1">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => onSelectMode(item.mode)}
            className={`px-2.5 py-1 text-xs font-bold rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
              currentMode === item.mode
                ? 'bg-amber-600 text-white dark:bg-purple-600'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
