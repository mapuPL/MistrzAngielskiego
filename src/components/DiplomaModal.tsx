import React from 'react';
import { PlayerStats } from '../types';
import { BADGES } from '../data/curriculum';
import { Printer, X, Sparkles, Award } from 'lucide-react';

interface DiplomaModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  isOpen,
  onClose,
  playerStats
}) => {
  if (!isOpen) return null;

  // Determine title based on stars
  let rankTitle = 'Młody Odkrywca Języka Angielskiego';
  if (playerStats.stars >= 150) rankTitle = 'Wielki Mistrz Języka Angielskiego Klasy 3';
  else if (playerStats.stars >= 100) rankTitle = 'Czarodziej Angielskich Słówek';
  else if (playerStats.stars >= 60) rankTitle = 'Szkolny As Języka Angielskiego';
  else if (playerStats.stars >= 30) rankTitle = 'Odważny Znawca Słówek';

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const gradeSubtitles: Record<string, string> = {
    grade3: 'JĘZYKA ANGIELSKIEGO · KLASA 3',
    grade4_6: 'ENGLISH EXPLORER · KLASY 4–6',
    grade7_8: 'ENGLISH PRO · EGZAMIN ÓSMOKLASISTY CKE'
  };

  const currentGradeSubtitle = gradeSubtitles[playerStats.gradeLevel] || 'JĘZYKA ANGIELSKIEGO · KLASA 3';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 space-y-6 my-8 print:border-none print:shadow-none print:m-0 print:p-4">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 print:hidden">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Twój Oficjalny Dyplom / Certyfikat</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Wydrukuj certyfikat dla ucznia"
            >
              <Printer className="w-4 h-4" />
              <span>Drukuj Dyplom</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Frame */}
        <div className="border-8 border-double border-amber-400 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 text-center space-y-5 relative">
          
          {/* Top Decorative Stars */}
          <div className="flex items-center justify-center gap-2 text-amber-500 text-lg">
            <span>⭐</span>
            <span>⭐</span>
            <span className="text-2xl">🌟</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-black text-amber-950 font-display tracking-tight uppercase">
              {playerStats.gradeLevel === 'grade7_8' ? 'CERTYFIKAT MISTRZA' : 'DYPLOM MISTRZA'}
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-amber-700 tracking-wider">
              {currentGradeSubtitle}
            </h2>
          </div>

          {/* Trophy visual */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-2 border-amber-300 shadow-md bg-amber-100 flex items-center justify-center">
            <img
              src="/src/assets/images/treasure_trophy_badge_1792504961772.jpg"
              alt="Złoty Puchar Mistrza"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-5xl absolute" aria-hidden="true">🏆</span>
          </div>

          {/* Student Recognition */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Niniejszy dyplom z dumą i uznaniem otrzymuje:
            </p>
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 border-b-2 border-dashed border-amber-400 inline-block px-6 py-1 font-display">
              {playerStats.name || 'Wspaniały Uczeń'}
            </div>
            <p className="text-xs text-amber-900 font-semibold pt-1">
              za znakomite postępy, wiedzę i pracowitość w nauce języka angielskiego!
            </p>
          </div>

          {/* Title & Stars tally */}
          <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-200 inline-block max-w-md mx-auto space-y-1">
            <div className="text-xs uppercase tracking-wider text-amber-800 font-bold">
              Tytuł Honorowy:
            </div>
            <div className="text-base sm:text-lg font-black text-amber-950 font-display">
              {rankTitle}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-900 pt-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Zdobyte gwiazdki: <strong className="text-sm font-mono">{playerStats.stars}</strong> ⭐</span>
            </div>
          </div>

          {/* Signatures & Date */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-slate-600 border-t border-amber-200/60">
            <div>
              <div className="font-semibold text-slate-800">{currentDate}</div>
              <div className="border-t border-slate-300 mt-4 pt-1 text-[11px] text-slate-500">
                Data przyznania
              </div>
            </div>
            <div>
              <div className="font-script text-base text-amber-800 font-bold">Lisek Leo 🐾 & Nauczyciel</div>
              <div className="border-t border-slate-300 mt-4 pt-1 text-[11px] text-slate-500">
                Podpis i pieczęć
              </div>
            </div>
          </div>

        </div>

        {/* Bottom encouragement (Hidden in print) */}
        <div className="text-center print:hidden">
          <p className="text-xs text-slate-500">
            Graj dalej w Quizy, Memory i Budowanie Zdań, aby zdobyć jeszcze więcej gwiazdek!
          </p>
        </div>

      </div>
    </div>
  );
};
