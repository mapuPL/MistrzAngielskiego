import React, { useMemo } from 'react';
import { GradeLevel, PlayerStats, CategoryId } from '../types';
import { getLandsForGrade, getVocabularyForGrade } from '../data/curriculumsByGrade';
import { GRADE_CONFIGS } from '../data/gradesConfig';
import { soundManager } from '../utils/audio';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
  ArrowLeft, Award, Trophy, Star, Zap, Flame, CheckCircle, BookOpen, 
  Gamepad2, Sparkles, SpellCheck, Headphones, GraduationCap, ChevronRight 
} from 'lucide-react';

interface StudentDashboardProps {
  currentGrade: GradeLevel;
  playerStats: PlayerStats;
  onBackToMap: () => void;
  onSelectCategoryAndMode: (category: CategoryId, mode: any) => void;
  onChangeGrade: (grade: GradeLevel) => void;
  soundEnabled: boolean;
}

// Visual palette for the lands & pie chart slices
const LAND_COLORS = [
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f97316'  // Orange
];

const SKILL_COLORS = [
  '#3b82f6', // Quiz
  '#10b981', // Sentences
  '#f59e0b', // Memory
  '#ec4899', // Spelling
  '#06b6d4', // Speed Listening
  '#8b5cf6'  // Grammar / Irregular / CKE
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentGrade,
  playerStats,
  onBackToMap,
  onSelectCategoryAndMode,
  onChangeGrade,
  soundEnabled
}) => {
  const gradeConfig = GRADE_CONFIGS[currentGrade];
  const lands = useMemo(() => getLandsForGrade(currentGrade), [currentGrade]);
  const vocabulary = useMemo(() => getVocabularyForGrade(currentGrade), [currentGrade]);

  // Compute stats per land
  const landStats = useMemo(() => {
    return lands.map((land, idx) => {
      const landWords = vocabulary.filter(w => w.category === land.id);
      const totalWords = landWords.length || 1;
      
      // Calculate realistic mastery based on player's overall completed quizzes, sentences, etc.
      // Each completed quiz / activity unlocks/masters words
      const totalActivities = (playerStats.quizzesCompleted || 0) + 
                             (playerStats.sentencesCompleted || 0) + 
                             (playerStats.memoryCompleted || 0) + 
                             (playerStats.spellingCompleted || 0) + 
                             (playerStats.speedListeningCompleted || 0);

      // Distribute mastery weight across lands based on unlock status and activities
      const isUnlocked = playerStats.stars >= land.requiredStarsToUnlock;
      let masteredWords = 0;
      if (isUnlocked) {
        // First land gets mastered faster, later lands scale with total activities
        const landFactor = Math.max(0.3, Math.min(1, (totalActivities + (playerStats.stars / 10)) / (idx * 2 + 3)));
        masteredWords = Math.min(totalWords, Math.max(1, Math.round(totalWords * landFactor)));
      }

      const percent = Math.min(100, Math.round((masteredWords / totalWords) * 100));

      return {
        id: land.id,
        name: land.namePl,
        nameEn: land.nameEn,
        icon: land.icon,
        totalWords,
        masteredWords,
        percent,
        isUnlocked,
        requiredStars: land.requiredStarsToUnlock,
        color: LAND_COLORS[idx % LAND_COLORS.length]
      };
    });
  }, [lands, vocabulary, playerStats]);

  // Aggregate totals
  const totalGradeWords = vocabulary.length;
  const totalMasteredWords = landStats.reduce((acc, l) => acc + l.masteredWords, 0);
  const overallMasteryPercent = totalGradeWords > 0 
    ? Math.min(100, Math.round((totalMasteredWords / totalGradeWords) * 100))
    : 0;

  const totalTasksCompleted = 
    (playerStats.quizzesCompleted || 0) + 
    (playerStats.sentencesCompleted || 0) + 
    (playerStats.memoryCompleted || 0) + 
    (playerStats.spellingCompleted || 0) + 
    (playerStats.speedListeningCompleted || 0) + 
    (playerStats.irregularCompleted || 0) + 
    (playerStats.ckeCompleted || 0);

  // Data for Land Progress Pie Chart
  const landPieData = useMemo(() => {
    return landStats.map(l => ({
      name: `${l.icon} ${l.name}`,
      value: l.masteredWords,
      total: l.totalWords,
      percent: l.percent,
      color: l.color
    }));
  }, [landStats]);

  // Data for Skills / Tasks Breakdown Pie Chart
  const skillsPieData = useMemo(() => {
    const raw = [
      { name: 'Quizy Mistrza', value: Math.max(playerStats.quizzesCompleted || 0, 1), color: SKILL_COLORS[0], icon: '🏆' },
      { name: 'Fabryka Zdań', value: Math.max(playerStats.sentencesCompleted || 0, 1), color: SKILL_COLORS[1], icon: '🧩' },
      { name: 'Gra Memory', value: Math.max(playerStats.memoryCompleted || 0, 1), color: SKILL_COLORS[2], icon: '🃏' },
      { name: 'Ortografia / Spelling', value: Math.max(playerStats.spellingCompleted || 0, 1), color: SKILL_COLORS[3], icon: '🎈' },
      { name: 'Pokój Słuchowy', value: Math.max(playerStats.speedListeningCompleted || 0, 1), color: SKILL_COLORS[4], icon: '🎧' },
      { 
        name: currentGrade === 'grade7_8' ? 'Egzamin CKE' : 'Czasowniki Nieregularne', 
        value: Math.max((currentGrade === 'grade7_8' ? playerStats.ckeCompleted : playerStats.irregularCompleted) || 0, 1), 
        color: SKILL_COLORS[5], 
        icon: '⚡' 
      }
    ];
    return raw;
  }, [playerStats, currentGrade]);

  const isDark = currentGrade === 'grade7_8';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Bar with Navigation & Grade Switch */}
      <div className={`rounded-3xl p-4 border shadow-sm flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <button
          onClick={() => {
            soundManager.playClick(!soundEnabled);
            onBackToMap();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do Mapy Przygody</span>
        </button>

        {/* Grade Level Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black">
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              onChangeGrade('grade3');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentGrade === 'grade3'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🦊 Klasa 3
          </button>
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              onChangeGrade('grade4_6');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentGrade === 'grade4_6'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🚀 Klasy 4–6
          </button>
          <button
            onClick={() => {
              soundManager.playClick(!soundEnabled);
              onChangeGrade('grade7_8');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentGrade === 'grade7_8'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🎓 Klasy 7–8 CKE
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400">Uczeń:</span>
          <span className="font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {playerStats.avatar} {playerStats.name}
          </span>
        </div>
      </div>

      {/* Hero Banner: Student Overview */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-lg border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border-purple-700/60'
          : currentGrade === 'grade4_6'
          ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 border-cyan-400/60'
          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-300/80'
      }`}>
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span>DASHBOARD UCZNIA</span>
            <span>•</span>
            <span>{gradeConfig.name} ({gradeConfig.ageRange})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display">
            Wizualny Panel Postępów w Nauce
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
            Monitoruj opanowane słownictwo, rozwiązane zadania gramatyczne oraz postęp w każdej z 7 krain tematycznych na poziomie <strong>{gradeConfig.name}</strong>.
          </p>
        </div>

        {/* Big Overall Ring Indicator */}
        <div className="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Opanowane', value: overallMasteryPercent },
                    { name: 'Pozostało', value: 100 - overallMasteryPercent }
                  ]}
                  innerRadius="70%"
                  outerRadius="95%"
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="rgba(255,255,255,0.2)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg sm:text-xl font-black font-mono leading-none">
                {overallMasteryPercent}%
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">
                Poziom
              </span>
            </div>
          </div>

          <div className="space-y-1 text-left text-xs">
            <div className="font-bold text-white/80">Opanowany materiał:</div>
            <div className="text-base font-black font-mono">
              {totalMasteredWords} / {totalGradeWords} słówek
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{landStats.filter(l => l.percent >= 80).length} z 7 krain opanowanych</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shrink-0">
            ⭐
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Zdobyte Gwiazdki</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-500">{playerStats.stars}</div>
          </div>
        </div>

        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-2xl shrink-0">
            ⚡
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Punkty XP</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">{playerStats.xp}</div>
          </div>
        </div>

        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Zadania Ukończone</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{totalTasksCompleted}</div>
          </div>
        </div>

        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center text-2xl shrink-0">
            🏅
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Odznaki Mistrza</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">{playerStats.unlockedBadges.length}</div>
          </div>
        </div>
      </div>

      {/* Visual Recharts Section: 2 Big Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Land Mastery Distribution Pie Chart */}
        <div className={`lg:col-span-7 rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-black font-display flex items-center gap-2">
                <span>🗺️ Postępy w Krainach Tematycznych</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wykres kołowy liczby opanowanych słówek w 7 modułach ({gradeConfig.name})
              </p>
            </div>
            <span className="text-xs font-black bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-full border border-cyan-300 dark:border-cyan-800">
              {totalGradeWords} słówek łącznie
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${String(name || '').split(' ')[0]} ${Math.round((percent || 0) * 100)}%`}
                  labelLine={false}
                >
                  {landPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} słówek opanowano`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {landStats.map((land) => (
              <div key={land.id} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: land.color }} />
                <span className="truncate font-semibold">{land.icon} {land.name}</span>
                <span className="ml-auto font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400">
                  {land.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Skills & Activities Breakdown Pie Chart */}
        <div className={`lg:col-span-5 rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-black font-display flex items-center gap-2">
                <span>🎯 Opanowanie Zadań & Modułów</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aktywności i wyzwania językowe
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name }: { name?: string }) => String(name || '').split(' ')[0]}
                >
                  {skillsPieData.map((entry, index) => (
                    <Cell key={`cell-skill-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} ukończonych zadań`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activities list */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {skillsPieData.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.icon} {s.name}</span>
                </div>
                <span className="font-mono font-black text-slate-700 dark:text-slate-200">
                  {s.value} ukończono
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detailed Cards for all 7 Lands with Mini Radial / Progress Indicators */}
      <div className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black font-display">
              Szczegółowy Wykaz Postępów: 7 Krain Edukacyjnych
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kliknij dowolną krainę, aby natychmiast rozpocząć jej misje, quizy lub budowę zdań!
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Poziom: <strong>{gradeConfig.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {landStats.map((land) => (
            <div
              key={land.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                isDark 
                  ? 'bg-slate-850 border-slate-700 hover:border-violet-500' 
                  : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
                      {land.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-black font-display">
                        {land.name}
                      </h4>
                      <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                        {land.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Circular Pie Mini Meter */}
                  <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: land.percent },
                            { value: 100 - land.percent }
                          ]}
                          innerRadius="65%"
                          outerRadius="95%"
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill={land.color} />
                          <Cell fill={isDark ? '#334155' : '#e2e8f0'} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-[10px] font-black font-mono">
                      {land.percent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar and details */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Opanowanie słownictwa:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-100 font-black">
                      {land.masteredWords} / {land.totalWords}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${land.percent}%`,
                        backgroundColor: land.color
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  soundManager.playClick(!soundEnabled);
                  onSelectCategoryAndMode(land.id as CategoryId, 'quiz');
                }}
                className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Trenuj tę Krainę</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
