import React, { useState, useMemo } from 'react';
import { PlayerStats, GradeLevel } from '../types';
import { getAvatarsForGrade, getBadgesForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { X, Check, Award, Lock, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  currentGrade: GradeLevel;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  currentGrade,
  onUpdateStats
}) => {
  const [tempName, setTempName] = useState(playerStats.name);
  const avatars = useMemo(() => getAvatarsForGrade(currentGrade), [currentGrade]);
  const badges = useMemo(() => getBadgesForGrade(currentGrade), [currentGrade]);
  const gradeConfig = GRADE_CONFIGS[currentGrade];

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStats({ name: tempName.trim() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{playerStats.avatar}</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Profil Ucznia: {gradeConfig.name}
              </h3>
              <p className="text-xs text-slate-500">
                Wybierz swój awatar i sprawdź zdobyte odznaki
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change Name Form */}
        <form onSubmit={handleSaveName} className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Twoje Imię na Dyplomie i w Grze:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Wpisz swoje imię..."
              maxLength={24}
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Zapisz
            </button>
          </div>
        </form>

        {/* Choose Avatar for this grade */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Wybierz Awatara ({gradeConfig.name}):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {avatars.map((av) => {
              const isSelected = playerStats.avatar === av.emoji;

              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => onUpdateStats({ avatar: av.emoji })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-3xl">{av.emoji}</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate w-full">
                    {av.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate w-full">
                    {av.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges List */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Odznaki do zdobycia ({gradeConfig.name}):</span>
            <span className="text-amber-500 font-bold">{playerStats.stars} ⭐</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {badges.map((badge) => {
              const isUnlocked = playerStats.stars >= badge.requirementStars;

              return (
                <div
                  key={badge.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-colors ${
                    isUnlocked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-2xs">
                      {badge.icon}
                    </span>
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{badge.title}</span>
                        {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {badge.desc}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold shrink-0 ml-2">
                    {isUnlocked ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-black">Odblokowana</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{badge.requirementStars} ⭐</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
