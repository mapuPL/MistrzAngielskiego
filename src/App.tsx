import React, { useState, useEffect } from 'react';
import { GameMode, CategoryId, PlayerStats, ChallengeType, DailyChallengeState, GradeLevel } from './types';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { QuizGame } from './components/QuizGame';
import { SpeedListeningGame } from './components/SpeedListeningGame';
import { SpellingGame } from './components/SpellingGame';
import { MemoryGame } from './components/MemoryGame';
import { SentenceBuilder } from './components/SentenceBuilder';
import { TalkingDictionary } from './components/TalkingDictionary';
import { DailyChallengesView } from './components/DailyChallengesView';
import { GradeSelectorLanding } from './components/GradeSelectorLanding';
import { IrregularVerbsTrainer } from './components/IrregularVerbsTrainer';
import { CkeExamTrainer } from './components/CkeExamTrainer';
import { DiplomaModal } from './components/DiplomaModal';
import { ProfileModal } from './components/ProfileModal';
import { soundManager } from './utils/audio';
import { loadDailyChallengeState, saveDailyChallengeState, getTodayDateString } from './utils/dailyChallenges';
import { GRADE_CONFIGS } from './data/gradesConfig';

const STORAGE_KEY = 'angielski_mistrz_multi_grade_v4';

const defaultStats: PlayerStats = {
  name: 'Staś',
  avatar: '🦊',
  gradeLevel: 'grade3',
  stars: 18,
  xp: 180,
  quizzesCompleted: 0,
  spellingCompleted: 0,
  memoryCompleted: 0,
  sentencesCompleted: 0,
  speedListeningCompleted: 0,
  dailyChallengesCompleted: 0,
  irregularCompleted: 0,
  ckeCompleted: 0,
  soundEnabled: true,
  unlockedBadges: ['starter']
};

export default function App() {
  // Start on landing hub to let students choose grade level, or return to it
  const [currentMode, setCurrentMode] = useState<GameMode>('landing');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('animals');
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gradeLevel) parsed.gradeLevel = 'grade3';
        return parsed;
      }
    } catch {
      // fallback
    }
    return defaultStats;
  });

  const [dailyState, setDailyState] = useState<DailyChallengeState>(() => loadDailyChallengeState());

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);

  // Active grade configuration
  const currentGrade = playerStats.gradeLevel || 'grade3';
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerStats));
    } catch {
      // localStorage error fallback
    }
  }, [playerStats]);

  // Save dailyState to localStorage
  useEffect(() => {
    saveDailyChallengeState(dailyState);
  }, [dailyState]);

  const addStars = (amount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      stars: prev.stars + amount,
      xp: prev.xp + amount * 10
    }));
  };

  const addXpAndStars = (xpAmount: number, starsAmount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      xp: prev.xp + xpAmount,
      stars: prev.stars + starsAmount
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

  const handleSelectGrade = (grade: GradeLevel) => {
    soundManager.playSuccess(!playerStats.soundEnabled);
    setPlayerStats(prev => ({
      ...prev,
      gradeLevel: grade,
      // Default companion avatar based on grade if desired
      avatar: grade === 'grade3' ? '🦊' : grade === 'grade4_6' ? '🚀' : '🎓'
    }));
    setCurrentMode('map');
  };

  const handleSelectCategoryAndMode = (cat: CategoryId, mode: GameMode) => {
    setActiveCategory(cat);
    setCurrentMode(mode);
  };

  const handleBackToMap = () => {
    soundManager.playClick(!playerStats.soundEnabled);
    setCurrentMode('map');
  };

  // Progress daily tasks
  const progressDailyTask = (taskType: ChallengeType, amount = 1) => {
    setDailyState(prev => {
      let changed = false;
      const updatedTasks = prev.tasks.map(task => {
        if (task.type === taskType && !task.isClaimed && task.current < task.target) {
          changed = true;
          return {
            ...task,
            current: Math.min(task.target, task.current + amount)
          };
        }
        return task;
      });

      if (!changed) return prev;
      return {
        ...prev,
        tasks: updatedTasks
      };
    });
  };

  // Claim single task reward
  const handleClaimTaskReward = (taskId: string) => {
    const task = dailyState.tasks.find(t => t.id === taskId);
    if (!task || task.isClaimed) return;

    addXpAndStars(task.rewardXp, task.rewardStars);

    setDailyState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, isClaimed: true } : t))
    }));
  };

  // Claim all tasks completed / Odznaka Dnia
  const handleClaimAllCompleted = () => {
    if (dailyState.allCompletedClaimed) return;

    const todayStr = getTodayDateString();
    addXpAndStars(150, 15);

    setPlayerStats(prev => ({
      ...prev,
      dailyChallengesCompleted: (prev.dailyChallengesCompleted || 0) + 1,
      unlockedBadges: [...prev.unlockedBadges, `daily_${todayStr}`]
    }));

    setDailyState(prev => ({
      ...prev,
      allCompletedClaimed: true,
      dailyStreak: (prev.dailyStreak || 0) + 1,
      lastCompletedDate: todayStr
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${gradeConfig.appBg} ${gradeConfig.textColor}`}>
      
      {/* Top Bar with Level Switcher */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          soundManager.playClick(!playerStats.soundEnabled);
          setCurrentMode(mode);
        }}
        playerStats={playerStats}
        currentGrade={currentGrade}
        onChangeGrade={handleSelectGrade}
        onOpenLanding={() => setCurrentMode('landing')}
        onToggleSound={toggleSound}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDiploma={() => setIsDiplomaOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Landing Hub / Level Selection Screen */}
        {currentMode === 'landing' && (
          <GradeSelectorLanding
            currentGrade={currentGrade}
            onSelectGrade={handleSelectGrade}
            soundEnabled={playerStats.soundEnabled}
          />
        )}

        {currentMode === 'map' && (
          <WorldMap
            onSelectCategoryAndMode={handleSelectCategoryAndMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
            playerStats={playerStats}
            dailyState={dailyState}
          />
        )}

        {currentMode === 'daily' && (
          <DailyChallengesView
            dailyState={dailyState}
            onNavigateToMode={(mode) => {
              soundManager.playClick(!playerStats.soundEnabled);
              setCurrentMode(mode);
            }}
            onClaimTaskReward={handleClaimTaskReward}
            onClaimAllCompleted={handleClaimAllCompleted}
            onBackToMenu={handleBackToMap}
            soundEnabled={playerStats.soundEnabled}
          />
        )}

        {/* Specialized Module: Irregular Verbs (Grades 4-6) */}
        {currentMode === 'irregular_verbs' && (
          <IrregularVerbsTrainer
            onAddStars={addStars}
            onBackToMenu={handleBackToMap}
            soundEnabled={playerStats.soundEnabled}
            onCompleteExercise={() => {
              progressDailyTask('irregular_verbs_practiced', 1);
              setPlayerStats(prev => ({
                ...prev,
                irregularCompleted: (prev.irregularCompleted || 0) + 1
              }));
            }}
          />
        )}

        {/* Specialized Module: CKE Exam Trainer (Grades 7-8) */}
        {currentMode === 'cke_exam' && (
          <CkeExamTrainer
            onAddStars={addStars}
            onBackToMenu={handleBackToMap}
            soundEnabled={playerStats.soundEnabled}
            onCompleteExercise={() => {
              progressDailyTask('cke_tasks_solved', 1);
              setPlayerStats(prev => ({
                ...prev,
                ckeCompleted: (prev.ckeCompleted || 0) + 1
              }));
            }}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizGame
            initialCategory={activeCategory}
            onAddStars={addStars}
            soundEnabled={playerStats.soundEnabled}
            onBackToMenu={handleBackToMap}
            onAnswerCorrect={() => progressDailyTask('quiz_answers', 1)}
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
              progressDailyTask('speed_listening', 1);
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
            onWordSpelled={() => progressDailyTask('words_spelled', 1)}
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
              progressDailyTask('memory_won', 1);
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
            onSentenceBuilt={() => progressDailyTask('sentences_built', 1)}
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
            onListenWord={() => progressDailyTask('dictionary_listened', 1)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>{gradeConfig.mascotEmoji}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {gradeConfig.name} · {gradeConfig.tagline}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-slate-600 dark:text-slate-400 flex-wrap justify-center">
            <button
              onClick={() => setCurrentMode('landing')}
              className="font-bold text-amber-700 dark:text-purple-400 hover:underline cursor-pointer"
            >
              Zmień poziom edukacyjny
            </button>
            <span aria-hidden="true">·</span>
            <span>Klasa 3</span>
            <span aria-hidden="true">·</span>
            <span>Klasy 4–6</span>
            <span aria-hidden="true">·</span>
            <span>Klasy 7–8 & CKE</span>
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
