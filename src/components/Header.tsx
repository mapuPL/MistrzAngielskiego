import React from 'react';
import { GameMode, PlayerStats } from '../types';
import { Volume2, VolumeX, Award, Sparkles, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  playerStats: PlayerStats;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenDiploma: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  playerStats,
  onToggleSound,
  onOpenProfile,
  onOpenDiploma
}) => {
  const navItems: { mode: GameMode; label: string }[] = [
    { mode: 'map', label: 'Wyprawa' },
    { mode: 'quiz', label: 'Quiz Mistrza' },
    { mode: 'speed_listening', label: 'Pokój Słuchowy' },
    { mode: 'spelling', label: 'Literkowanie' },
    { mode: 'memory', label: 'Memory' },
    { mode: 'sentences', label: 'Buduj Zdania' },
    { mode: 'dictionary', label: 'Słowniczek' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-amber-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('map')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
          title="Przejdź do mapy głównej"
        >
          <span className="text-2xl transition-transform group-hover:scale-110" role="img" aria-label="Lisek">🦊</span>
          <span className="text-lg md:text-xl font-extrabold tracking-tight text-amber-950 font-display whitespace-nowrap shrink-0">
            Angielski<span className="text-amber-600">Mistrz</span> <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-1">Klasa 3</span>
          </span>
        </button>

        {/* Zone 2: 4-6 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => onSelectMode(item.mode)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs scale-102'
                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-100/60'
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
            className="p-2 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
            title={playerStats.soundEnabled ? 'Wycisz dźwięki gry' : 'Włącz dźwięki gry'}
            aria-label="Przełącznik dźwięków"
          >
            {playerStats.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Player Stars counter */}
          <button
            onClick={onOpenDiploma}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-950 rounded-xl hover:bg-amber-200 transition-all font-bold text-xs sm:text-sm shadow-xs"
            title="Kliknij, aby otworzyć Dyplom Mistrza"
          >
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500 animate-spin-slow" />
            <span className="tabular-nums font-mono font-bold text-amber-900">{playerStats.stars}</span>
            <span className="text-amber-700 hidden sm:inline">⭐</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all text-xs sm:text-sm font-semibold whitespace-nowrap"
            title="Profil ucznia i odznaki"
          >
            <span className="text-base">{playerStats.avatar}</span>
            <span className="max-w-[80px] sm:max-w-[110px] truncate">{playerStats.name || 'Uczeń'}</span>
          </button>

          {/* Primary Action: Dyplom */}
          <button
            onClick={onOpenDiploma}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Mój Dyplom</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar for small screens */}
      <div className="lg:hidden flex items-center justify-around bg-amber-100/70 border-t border-amber-200 px-2 py-1.5 overflow-x-auto gap-1">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => onSelectMode(item.mode)}
            className={`px-2.5 py-1 text-xs font-bold rounded-md whitespace-nowrap shrink-0 ${
              currentMode === item.mode
                ? 'bg-amber-600 text-white'
                : 'text-amber-900 hover:bg-amber-200/70'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
