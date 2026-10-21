import React from 'react';
import { DailyChallengeState, DailyTask, GameMode, GradeLevel } from '../types';
import { getFormattedPolishDate } from '../utils/dailyChallenges';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Calendar, Flame, Award, ArrowLeft, CheckCircle2, Sparkles, Play, Gift } from 'lucide-react';

interface DailyChallengesViewProps {
  currentGrade: GradeLevel;
  dailyState: DailyChallengeState;
  onNavigateToMode: (mode: GameMode) => void;
  onClaimTaskReward: (taskId: string) => void;
  onClaimAllCompleted: () => void;
  onBackToMenu: () => void;
  soundEnabled: boolean;
}

export const DailyChallengesView: React.FC<DailyChallengesViewProps> = ({
  currentGrade,
  dailyState,
  onNavigateToMode,
  onClaimTaskReward,
  onClaimAllCompleted,
  onBackToMenu,
  soundEnabled
}) => {
  const gradeConfig = GRADE_CONFIGS[currentGrade];
  const formattedDate = getFormattedPolishDate(dailyState.date);
  const completedCount = dailyState.tasks.filter(t => t.current >= t.target).length;
  const allTasksDone = completedCount === dailyState.tasks.length;

  const handleClaimGrandPrize = () => {
    soundManager.playFanfare(!soundEnabled);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 }
    });
    onClaimAllCompleted();
  };

  const handleClaimSingle = (task: DailyTask) => {
    soundManager.playStar(!soundEnabled);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClaimTaskReward(task.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar with Return Button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mapa / Menu</span>
          </button>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gradeConfig.accentBadge}`}>
            {gradeConfig.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span className="capitalize">{formattedDate}</span>
        </div>

        {/* Daily Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-900 border border-orange-200 rounded-xl font-bold text-xs shadow-2xs">
          <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-bounce-subtle" />
          <span>Seria: <strong className="font-mono text-sm">{dailyState.dailyStreak}</strong> {dailyState.dailyStreak === 1 ? 'dzień' : 'dni'}</span>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${gradeConfig.heroGradient} p-6 md:p-8 shadow-md border-2 border-amber-300/40`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/90 dark:bg-slate-900/90 p-2 border-2 border-white/50 shadow-md flex items-center justify-center shrink-0">
              <span className="text-4xl md:text-5xl" role="img" aria-label="Kalendarz zadań">📅</span>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/80 dark:bg-slate-900/80 rounded-full text-[11px] font-bold text-slate-900 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Dedykowane misje dla poziomu: {gradeConfig.name}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black font-display">
                Codzienne Wyzwania Mistrza
              </h1>
              <p className="text-xs md:text-sm opacity-90 font-medium max-w-xl">
                Wykonaj 3 dzisiejsze zadania dostosowane do Twojego poziomu, aby zdobyć bonusowe punkty XP, gwiazdki i <strong>Odznakę Dnia</strong>!
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white p-4 rounded-2xl border border-white/30 text-center shrink-0 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Dzisiejszy postęp:
            </div>
            <div className="text-3xl font-black font-mono text-amber-500">
              {completedCount} / 3
            </div>
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              {allTasksDone ? 'Wszystko zrobione! 🎉' : 'Do dzieła!'}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Daily Quest Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-black font-display flex items-center gap-2">
          <span>🎯 Twoje 3 Zadania na Dziś ({gradeConfig.name}):</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyState.tasks.map((task, index) => {
            const isFinished = task.current >= task.target;
            const progressPercent = Math.min(100, Math.round((task.current / task.target) * 100));

            return (
              <div
                key={task.id}
                className={`rounded-3xl p-5 border-2 flex flex-col justify-between transition-all duration-200 ${
                  task.isClaimed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-90 shadow-2xs'
                    : isFinished
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Task Header */}
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {task.icon}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      Zadanie {index + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold font-display">
                      {task.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-2 text-xs font-bold pt-1">
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-lg">+{task.rewardXp} XP</span>
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-lg">+{task.rewardStars} ⭐</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Postęp:</span>
                      <span className="font-mono">
                        {task.current} / {task.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFinished ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                  {task.isClaimed ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Nagroda odebrana!</span>
                    </div>
                  ) : isFinished ? (
                    <button
                      onClick={() => handleClaimSingle(task)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer animate-bounce-subtle"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Odbierz nagrodę!</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToMode(task.targetMode)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Zagraj teraz</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grand Daily Prize & Odznaka Dnia Showcase */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 transition-all ${
        dailyState.allCompletedClaimed
          ? 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 border-amber-400 shadow-md'
          : allTasksDone
          ? 'bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 dark:from-slate-900 dark:to-slate-800 border-amber-500 shadow-lg ring-4 ring-amber-300'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-amber-400/30 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {dailyState.allCompletedClaimed ? '👑' : allTasksDone ? '🎁' : '🏅'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full mb-1">
                <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Główna Nagroda Dnia</span>
              </div>
              <h3 className="text-xl font-black font-display">
                {dailyState.allCompletedClaimed ? 'Odznaka Dnia Odblokowana!' : 'Specjalna Odznaka Dnia + 150 XP i 15 ⭐'}
              </h3>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                {dailyState.allCompletedClaimed
                  ? `Zdobyłeś: „${dailyState.dailyBadgeName}”. Gratulacje, świetna robota mistrzu!`
                  : 'Ukończ wszystkie 3 dzisiejsze zadania, aby odebrać Odznakę Dnia i powiększyć swoją serię!'}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {dailyState.allCompletedClaimed ? (
              <div className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Odznaka Dnia Zdobyta!</span>
              </div>
            ) : allTasksDone ? (
              <button
                onClick={handleClaimGrandPrize}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer animate-bounce-subtle"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Odbierz Odznakę Dnia! 🏆</span>
              </button>
            ) : (
              <div className="text-center sm:text-right text-xs text-slate-400 font-semibold">
                Ukończ jeszcze <span className="font-mono text-amber-500 font-bold">{3 - completedCount}</span> {3 - completedCount === 1 ? 'zadanie' : 'zadania'}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
