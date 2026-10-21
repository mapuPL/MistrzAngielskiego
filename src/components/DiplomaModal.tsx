import React from 'react';
import { PlayerStats, GradeLevel } from '../types';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { Printer, X, Award, CheckCircle } from 'lucide-react';

interface DiplomaModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  currentGrade: GradeLevel;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  currentGrade
}) => {
  if (!isOpen) return null;

  const gradeConfig = GRADE_CONFIGS[currentGrade];

  let rankTitle = 'Młody Odkrywca Języka Angielskiego';
  if (currentGrade === 'grade3') {
    if (playerStats.stars >= 150) rankTitle = 'Wielki Mistrz Języka Angielskiego Klasy 3';
    else if (playerStats.stars >= 100) rankTitle = 'Czarodziej Angielskich Słówek';
    else if (playerStats.stars >= 60) rankTitle = 'Szkolny As Języka Angielskiego';
    else if (playerStats.stars >= 30) rankTitle = 'Odważny Odkrywca Krain';
  } else if (currentGrade === 'grade4_6') {
    if (playerStats.stars >= 150) rankTitle = 'Kapitan English Explorer & Gramatyki';
    else if (playerStats.stars >= 100) rankTitle = 'Mistrz Czasowników Nieregularnych';
    else if (playerStats.stars >= 60) rankTitle = 'Nawigator Past Simple';
    else if (playerStats.stars >= 30) rankTitle = 'Młody Podróżnik Językowy';
  } else {
    if (playerStats.stars >= 150) rankTitle = 'Prymus Egzaminu Ósmoklasisty CKE B1';
    else if (playerStats.stars >= 100) rankTitle = 'Ekspert Parafraz i Struktur CKE';
    else if (playerStats.stars >= 60) rankTitle = 'Mistrz Okresów Warunkowych';
    else if (playerStats.stars >= 30) rankTitle = 'Aspirant Egzaminu CKE';
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 space-y-6 my-8 print:border-none print:shadow-none print:m-0 print:p-4 text-slate-900">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3 print:hidden">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Twój Oficjalny Certyfikat · {gradeConfig.name}</span>
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

        {/* Printable Certificate Frame */}
        <div className={`border-8 border-double p-6 sm:p-8 rounded-2xl text-center space-y-5 relative ${
          currentGrade === 'grade7_8'
            ? 'border-purple-800 bg-gradient-to-b from-purple-50/50 via-white to-slate-50'
            : currentGrade === 'grade4_6'
            ? 'border-cyan-600 bg-gradient-to-b from-sky-50/60 via-white to-cyan-50/40'
            : 'border-amber-400 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40'
        }`}>
          
          {/* Top Decorative Stars */}
          <div className="flex items-center justify-center gap-2 text-amber-500 text-lg">
            <span>⭐</span>
            <span>⭐</span>
            <span className="text-2xl">🌟</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <div className="text-xs font-black tracking-widest text-slate-500 uppercase">
              Rzeczpospolita Polska · Edukacja Językowa
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 uppercase">
              {currentGrade === 'grade7_8'
                ? 'Certyfikat Egzaminacyjny B1'
                : currentGrade === 'grade4_6'
                ? 'Certyfikat English Explorer'
                : 'Oficjalny Dyplom Mistrza'}
            </h2>
            <div className={`text-xs sm:text-sm font-black tracking-wider uppercase ${
              currentGrade === 'grade7_8' ? 'text-purple-700' : currentGrade === 'grade4_6' ? 'text-cyan-700' : 'text-amber-700'
            }`}>
              {currentGrade === 'grade7_8'
                ? 'EGZAMIN ÓSMOKLASISTY CKE · JĘZYK ANGIELSKI'
                : currentGrade === 'grade4_6'
                ? 'KLASY 4–6 · ŚREDNIOZAAWANSOWANY'
                : 'JĘZYK ANGIELSKI · KLASA 3'}
            </div>
          </div>

          {/* Recipient */}
          <div className="py-2 space-y-1">
            <p className="text-xs text-slate-500">Niniejszy dokument potwierdza, że uczeń / uczennica:</p>
            <div className="text-2xl sm:text-4xl font-black text-slate-900 font-display underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
              {playerStats.name || 'Wzorowy Uczeń'}
            </div>
            <div className="text-xs font-mono text-slate-400 pt-2">
              Towarzysz przygody: {playerStats.avatar}
            </div>
          </div>

          {/* Recognition description */}
          <div className="max-w-md mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentGrade === 'grade3' && (
              <p>
                Wykazał(a) się znakomitą znajomością słówek z 7 Magicznych Krain, opanował(a) pisownię balonikową,
                rozumienie ze słuchu oraz budowę zdań w języku angielskim.
              </p>
            )}
            {currentGrade === 'grade4_6' && (
              <p>
                Wykazał(a) się wybitną wiedzą w zakresie czasowników nieregularnych, czasów Past Simple i Present Continuous,
                stopniowania przymiotników oraz płynnego budowania zdań.
              </p>
            )}
            {currentGrade === 'grade7_8' && (
              <p>
                Osiągnął(ęła) biegłość w strukturach egzaminacyjnych CKE B1: transformacjach zdań, okresach warunkowych,
                stronie biernej oraz słownictwie technologicznym i społecznym.
              </p>
            )}
          </div>

          {/* Earned Title Banner */}
          <div className="inline-block px-5 py-2 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-extrabold shadow-sm">
            Tytuł: {rankTitle} ({playerStats.stars} ⭐)
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-200 text-xs">
            <div className="text-left space-y-1">
              <div className="font-bold text-slate-800">Data wystawienia:</div>
              <div className="text-slate-600 font-mono text-[11px]">{currentDate}</div>
              <div className="text-[10px] text-slate-400">Aplikacja „Angielski Mistrz”</div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-bold text-slate-800">
                {currentGrade === 'grade7_8'
                  ? 'Komisja CKE / Doradca B1'
                  : currentGrade === 'grade4_6'
                  ? 'Kadet Alex & Nauczyciel'
                  : 'Lisek Leo & Nauczyciel'}
              </div>
              <div className="font-serif italic text-amber-700 text-sm">
                Master of English
              </div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Oficjalny Certyfikat Sukcesu</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
