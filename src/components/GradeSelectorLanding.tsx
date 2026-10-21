import React from 'react';
import { GradeLevel } from '../types';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { Sparkles, Check, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';

interface GradeSelectorLandingProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  soundEnabled: boolean;
}

export const GradeSelectorLanding: React.FC<GradeSelectorLandingProps> = ({
  currentGrade,
  onSelectGrade
}) => {
  const grades: GradeLevel[] = ['grade3', 'grade4_6', 'grade7_8'];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 space-y-10">
      
      {/* Hero Welcome Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 rounded-full text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Platforma Edukacyjna Dopasowana do Wieku Ucznia</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
          Wybierz Swój Poziom Języka Angielskiego
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
          Każdy poziom posiada unikalną szatę graficzną, dedykowane słownictwo, zadania gramatyczne oraz moduły edukacyjne zgodne z polską podstawą programową MEN.
        </p>
      </div>

      {/* 3 Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {grades.map((gradeKey) => {
          const config = GRADE_CONFIGS[gradeKey];
          const isSelected = currentGrade === gradeKey;

          let cardStyle = '';
          let badgeBg = '';
          let btnStyle = '';

          if (gradeKey === 'grade3') {
            cardStyle = 'bg-gradient-to-b from-amber-50/80 to-white border-amber-300 hover:border-amber-400 hover:shadow-xl';
            badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
            btnStyle = 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white';
          } else if (gradeKey === 'grade4_6') {
            cardStyle = 'bg-gradient-to-b from-sky-50/80 to-white border-cyan-300 hover:border-cyan-400 hover:shadow-xl';
            badgeBg = 'bg-cyan-100 text-cyan-900 border-cyan-300';
            btnStyle = 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white';
          } else {
            cardStyle = 'bg-gradient-to-b from-slate-900 to-slate-950 border-purple-800/80 text-white hover:border-purple-600 hover:shadow-xl';
            badgeBg = 'bg-purple-950 text-purple-300 border-purple-700';
            btnStyle = 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-purple-700 text-white';
          }

          return (
            <div
              key={gradeKey}
              className={`rounded-3xl p-6 sm:p-8 border-2 flex flex-col justify-between transition-all transform hover:-translate-y-1 shadow-md relative ${cardStyle} ${
                isSelected ? 'ring-4 ring-amber-400 scale-102' : ''
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  <span>Obecnie wybrany</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Header with Mascot */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl sm:text-5xl p-2 rounded-2xl bg-white/30 backdrop-blur-xs border border-white/40 shadow-xs" role="img" aria-label={config.name}>
                    {config.mascotEmoji}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeBg}`}>
                    {config.ageRange}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black font-display tracking-tight">
                    {config.name}
                  </h2>
                  <p className="text-xs font-extrabold text-amber-700 dark:text-purple-300 mt-1 uppercase tracking-wider">
                    {config.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {config.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                    Moduły i atuty poziomu:
                  </div>
                  {config.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4">
                <button
                  onClick={() => onSelectGrade(gradeKey)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>Przejdź do: {config.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Methodology Footer Strip */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
          <div className="text-xs text-slate-600">
            <strong className="text-slate-900 block font-bold">Pełna zgodność z podstawą programową MEN</strong>
            W każdej chwili możesz zmienić poziom trudności z poziomu górnego paska nawigacyjnego bez utraty zebranych punktów i odznak.
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Od A1 (klasa 3) do B1 (klasa 8)</span>
        </div>
      </div>

    </div>
  );
};
