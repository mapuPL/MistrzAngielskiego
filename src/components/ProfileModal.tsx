import React, { useState } from 'react';
import { PlayerStats } from '../types';
import { AVATARS, BADGES } from '../data/curriculum';
import { X, Check, Award, Lock, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  onUpdateStats
}) => {
  const [tempName, setTempName] = useState(playerStats.name);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStats({ name: tempName.trim() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{playerStats.avatar}</span>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Profil Ucznia i Odznaki
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Change Name Form */}
        <form onSubmit={handleSaveName} className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Twoje Imię na Dyplomie i w Grze:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="np. Ania, Staś, Zuzia, Oliwier..."
              maxLength={24}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Zapisz
            </button>
          </div>
        </form>

        {/* Choose Mascot Avatar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Wybierz Swojego Towarzysza Gry:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {AVATARS.map((av) => {
              const isSelected = playerStats.avatar === av.icon;
              return (
                <button
                  key={av.id}
                  onClick={() => onUpdateStats({ avatar: av.icon })}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-amber-100/70 border-amber-500 shadow-xs ring-2 ring-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-3xl">{av.icon}</span>
                  <span className="text-[11px] font-bold text-slate-800 text-center truncate max-w-full">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Twoje Zdobyte Odznaki:</span>
            <span className="text-xs font-semibold text-amber-700 font-mono">
              ⭐ {playerStats.stars} gwiazdek
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {playerStats.dailyChallengesCompleted > 0 && (
              <div className="flex items-center justify-between p-3 rounded-2xl border bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <div className="text-xs font-bold text-amber-950">
                      Odznaka Dnia (Mistrz Codziennych Zadań)
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Ukończono {playerStats.dailyChallengesCompleted} {playerStats.dailyChallengesCompleted === 1 ? 'zestaw' : 'zestawów'} codziennych wyzwań
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  <span>Aktywna</span>
                </span>
              </div>
            )}
            {BADGES.map((badge) => {
              const isUnlocked = playerStats.stars >= badge.requirementStars;
              return (
                <div
                  key={badge.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {badge.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {badge.desc}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>Zdobyta</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
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

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Zamknij i graj dalej
          </button>
        </div>

      </div>
    </div>
  );
};
