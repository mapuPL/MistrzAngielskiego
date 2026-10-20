import React, { useState, useEffect } from 'react';
import { GameMode, CategoryId, PlayerStats } from './types';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { QuizGame } from './components/QuizGame';
import { SpeedListeningGame } from './components/SpeedListeningGame';
import { SpellingGame } from './components/SpellingGame';
import { MemoryGame } from './components/MemoryGame';
import { SentenceBuilder } from './components/SentenceBuilder';
import { TalkingDictionary } from './components/TalkingDictionary';
import { DiplomaModal } from './components/DiplomaModal';
import { ProfileModal } from './components/ProfileModal';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'angielski_mistrz_klasa3_data_v2';

const defaultStats: PlayerStats = {
  name: 'Staś',
  avatar: '🦊',
  stars: 18,
  xp: 180,
  quizzesCompleted: 0,
  spellingCompleted: 0,
  memoryCompleted: 0,
  sentencesCompleted: 0,
  speedListeningCompleted: 0,
  soundEnabled: true,
  unlockedBadges: ['starter']
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('map');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('animals');
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultStats;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStats));
    } catch {
      // localStorage error fallback
    }
  }, [playerStats]);

  const addStars = (amount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      stars: prev.stars + amount,
      xp: prev.xp + amount * 10
    }));
  };

  const toggleSound = () => {
    const nextVal = !playerStats.soundEnabled;
    soundManager.playClick(!nextVal);
    setPlayerStats(prev => ({ ...prev, soundEnabled: nextVal }));
  };

  const updateStats = (updates: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...updates }));
  };

  const handleSelectCategoryAndMode = (cat: CategoryId, mode: GameMode) => {
    setActiveCategory(cat);
    setCurrentMode(mode);
  };

  const handleBackToMap = () => {
    soundManager.playClick(!playerStats.soundEnabled);
    setCurrentMode('map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50 text-slate-800">
      
      {/* Top Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          soundManager.playClick(!playerStats.soundEnabled);
          setCurrentMode(mode);
        }}
        playerStats={playerStats}
        onToggleSound={toggleSound}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDiploma={() => setIsDiplomaOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentMode === 'map' && (
          <WorldMap
            onSelectCategoryAndMode={handleSelectCategoryAndMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
            playerStats={playerStats}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizGame
            initialCategory={activeCategory}
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onCompleteQuiz={() => {
              setPlayerStats(prev => ({
                ...prev,
                quizzesCompleted: prev.quizzesCompleted + 1
              }));
            }}
          />
        )}

        {currentMode === 'speed_listening' && (
          <SpeedListeningGame
            initialCategory={activeCategory}
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onCompleteSpeed={() => {
              setPlayerStats(prev => ({
                ...prev,
                speedListeningCompleted: prev.speedListeningCompleted + 1
              }));
            }}
          />
        )}

        {currentMode === 'spelling' && (
          <SpellingGame
            initialCategory={activeCategory}
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onCompleteSpelling={() => {
              setPlayerStats(prev => ({
                ...prev,
                spellingCompleted: prev.spellingCompleted + 1
              }));
            }}
          />
        )}

        {currentMode === 'memory' && (
          <MemoryGame
            initialCategory={activeCategory}
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onCompleteMemory={() => {
              setPlayerStats(prev => ({
                ...prev,
                memoryCompleted: prev.memoryCompleted + 1
              }));
            }}
          />
        )}

        {currentMode === 'sentences' && (
          <SentenceBuilder
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onCompleteSentences={() => {
              setPlayerStats(prev => ({
                ...prev,
                sentencesCompleted: prev.sentencesCompleted + 1
              }));
            }}
          />
        )}

        {currentMode === 'dictionary' && (
          <TalkingDictionary
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🦊</span>
            <span className="font-semibold text-slate-700">Angielski Mistrz · Edukacyjna gra językowa dla klasy 3 szkoły podstawowej</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-slate-600 flex-wrap justify-center">
            <span>7 Krain Wiedzy</span>
            <span aria-hidden="true">·</span>
            <span>Synteza Mowy (en-GB)</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio API</span>
            <span aria-hidden="true">·</span>
            <span>Darmowy Dyplom</span>
          </div>

          <div>
            <span>Dla uczniów, nauczycieli i rodziców</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        playerStats={playerStats}
        onUpdateStats={updateStats}
      />

      <DiplomaModal
        isOpen={isDiplomaOpen}
        onClose={() => setIsDiplomaOpen(false)}
        playerStats={playerStats}
      />

    </div>
  );
}
