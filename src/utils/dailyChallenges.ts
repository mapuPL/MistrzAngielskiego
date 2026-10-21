import { DailyChallengeState, DailyTask, GradeLevel } from '../types';
import { getDailyTasksForGrade } from '../data/curriculumsByGrade';

const DAILY_STORAGE_PREFIX = 'angielski_mistrz_daily_challenge_v3_';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFormattedPolishDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function generateDailyTasks(dateStr: string, grade: GradeLevel = 'grade3'): DailyTask[] {
  return getDailyTasksForGrade(grade, dateStr);
}

export function loadDailyChallengeState(grade: GradeLevel = 'grade3'): DailyChallengeState {
  const today = getTodayDateString();
  const storageKey = `${DAILY_STORAGE_PREFIX}${grade}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed: DailyChallengeState = JSON.parse(raw);
      if (parsed.date === today && parsed.tasks && parsed.tasks.length === 3) {
        return parsed;
      }

      // New day! Check streak
      let streak = parsed.dailyStreak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      if (parsed.lastCompletedDate !== yesterdayStr && parsed.lastCompletedDate !== today) {
        streak = 0;
      }

      const freshState: DailyChallengeState = {
        date: today,
        tasks: generateDailyTasks(today, grade),
        allCompletedClaimed: false,
        dailyStreak: streak,
        lastCompletedDate: parsed.lastCompletedDate,
        dailyBadgeName: `Mistrz Dnia: ${new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}`
      };
      saveDailyChallengeState(freshState, grade);
      return freshState;
    }
  } catch {
    // fallback
  }

  const freshState: DailyChallengeState = {
    date: today,
    tasks: generateDailyTasks(today, grade),
    allCompletedClaimed: false,
    dailyStreak: 0,
    dailyBadgeName: `Mistrz Dnia: ${new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}`
  };
  saveDailyChallengeState(freshState, grade);
  return freshState;
}

export function saveDailyChallengeState(state: DailyChallengeState, grade: GradeLevel = 'grade3') {
  try {
    const storageKey = `${DAILY_STORAGE_PREFIX}${grade}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // storage fallback
  }
}
