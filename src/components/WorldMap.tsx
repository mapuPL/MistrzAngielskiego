import React, { useState } from 'react';
import { CategoryId, GameMode, PlayerStats } from '../types';
import { LANDS, VOCABULARY } from '../data/curriculum';
import { speakEnglish, soundManager } from '../utils/audio';
import { Sparkles, Play, BookOpen, Volume2, Gamepad2, SpellCheck, Lock, Headphones, CheckCircle2 } from 'lucide-react';

interface WorldMapProps {
  onSelectCategoryAndMode: (category: CategoryId, mode: GameMode) => void;
  onSelectMode: (mode: GameMode) => void;
  playerStats: PlayerStats;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectCategoryAndMode,
  onSelectMode,
  playerStats
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('animals');
  const [isSpeakingWelcome, setIsSpeakingWelcome] = useState(false);

  const activeLand = LANDS.find(l => l.id === selectedCategory) || LANDS[0];
  const landVocab = VOCABULARY.filter(v => v.category === selectedCategory);

  const isLandUnlocked = (land: typeof LANDS[0]) => {
    return playerStats.stars >= land.requiredStarsToUnlock;
  };

  const handleSpeakWelcome = () => {
    soundManager.playClick(!playerStats.soundEnabled);
    setIsSpeakingWelcome(true);
    speakEnglish(`Hello ${playerStats.name || 'friend'}! Welcome to English Star! Let's explore all seven magic lands together!`, 0.85, () => {
      setIsSpeakingWelcome(false);
    });
  };

  // Calculate player level from XP or stars
  const playerLevel = Math.max(1, Math.floor(playerStats.stars / 15) + 1);
  const nextLevelStars = playerLevel * 15;
  const currentLevelProgress = Math.min(100, Math.round(((playerStats.stars % 15) / 15) * 100));

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner with Leo and Level XP */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 p-6 md:p-8 shadow-md border-2 border-amber-300">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* Mascot Image with Fallback */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-100 flex items-center justify-center">
              <img
                src="/src/assets/images/mascot_fox_leo_1792504961154.jpg"
                alt="Lisek Leo - Przewodnik języka angielskiego"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-4xl absolute" aria-hidden="true">🦊</span>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-amber-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Angielski dla Klasy 3 · 7 Krain Tematycznych</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-amber-950 font-display">
                Cześć {playerStats.name || 'Odkrywco'}! Gotowy na przygodę?
              </h1>
              <p className="text-sm text-amber-900 font-medium">
                Zdobywaj gwiazdki, odblokowuj kolejne krainy i zostań Mistrzem Języka Angielskiego!
              </p>

              {/* Player XP Level Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 max-w-md">
                <div className="text-xs font-bold text-amber-950 whitespace-nowrap">
                  Poziom {playerLevel} · {playerStats.stars} ⭐
                </div>
                <div className="flex-1 bg-white/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-amber-400">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentLevelProgress}%` }}
                  />
                </div>
                <div className="text-[11px] font-bold text-amber-900 font-mono whitespace-nowrap">
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
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-white text-amber-900 hover:bg-amber-50'
              }`}
            >
              <Volume2 className="w-5 h-5 text-amber-600" />
              <span>{isSpeakingWelcome ? 'Lisek mówi...' : 'Posłuchaj powitania! 🔊'}</span>
            </button>

            <button
              onClick={() => onSelectMode('speed_listening')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-amber-300" />
              <span>Pokój Słuchowy (Nowość!)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Adventure Map & 7 Thematic Lands */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Map Graphic & 7 Land Badges */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 font-display">
                🗺️ 7 Magicznych Krain Języka Angielskiego
              </h2>
              <p className="text-xs text-slate-500">
                Wybierz krainę poniżej, aby poznać słówka i rozpocząć misję!
              </p>
            </div>
          </div>

          {/* Map Illustration with Fallback */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 aspect-video shadow-inner">
            <img
              src="/src/assets/images/english_quest_map_1792504961161.jpg"
              alt="Magiczna mapa wyprawy do krain języka angielskiego"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Visual overlay labels for fun orientation */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span>🐾</span> Zwierzęcy Las
            </div>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span>🎒</span> Zamek Szkoły
            </div>
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span>🍎</span> Wioska Smaków
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span>🎨</span> Tęczowe Królestwo
            </div>
          </div>

          {/* 7 Land Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {LANDS.map((land) => {
              const isSelected = selectedCategory === land.id;
              const unlocked = isLandUnlocked(land);
              const count = VOCABULARY.filter(v => v.category === land.id).length;

              return (
                <button
                  key={land.id}
                  onClick={() => {
                    soundManager.playClick(!playerStats.soundEnabled);
                    setSelectedCategory(land.id);
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-500 shadow-xs ring-2 ring-amber-400'
                      : unlocked
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{land.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {land.namePl}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
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
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
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
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 bg-amber-100 rounded-2xl">{activeLand.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {activeLand.namePl}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold">
                    {activeLand.nameEn}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeLand.description}
            </p>

            {/* Grammar focus note */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
              <span className="font-extrabold text-amber-900">Gramatyka i zwroty:</span>{' '}
              <span className="text-slate-700 font-medium">{activeLand.grammarFocus}</span>
            </div>

            {/* Mission Launchers for this category */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'quiz');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Zagraj w Quiz Mistrza</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+10 ⭐</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'speed_listening');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
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
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SpellCheck className="w-4 h-4" />
                  <span>Literkowanie baloników</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+15 ⭐</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick(!playerStats.soundEnabled);
                  onSelectCategoryAndMode(selectedCategory, 'memory');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Gra Memory (Dopasuj pary)</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+20 ⭐</span>
              </button>
            </div>

            {/* Vocabulary preview with click to pronounce */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Słówka w tej krainie:</span>
                <button
                  onClick={() => onSelectMode('dictionary')}
                  className="text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Wszystkie w słowniku</span>
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
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-left transition-colors group cursor-pointer"
                    title={`Posłuchaj wymowy: ${word.en}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{word.emoji}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 truncate">
                          {word.en}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {word.pl}
                        </div>
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 ml-1" />
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
