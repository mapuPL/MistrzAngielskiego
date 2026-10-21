import { DailyChallengeState, DailyTask } from '../types';

const DAILY_STORAGE_KEY = 'angielski_mistrz_daily_challenge_v2';

// Simple deterministic hash based on date string
function getDaySeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-random seeded generator
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

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

export function generateDailyTasks(dateStr: string): DailyTask[] {
  const seed = getDaySeed(dateStr);
  const rnd = seededRandom(seed);

  const taskTemplates: Omit<DailyTask, 'id' | 'current' | 'isClaimed'>[] = [
    {
      type: 'sentences_built',
      title: 'Konstruktor Zdań',
      description: 'Ułóż poprawnie 2 zdania w Fabryce Zdań',
      icon: '🧩',
      target: 2,
      targetMode: 'sentences',
      rewardXp: 50,
      rewardStars: 5
    },
    {
      type: 'memory_won',
      title: 'Pojedynek Pamięci',
      description: 'Dopasuj wszystkie pary i wygraj 1 grę Memory',
      icon: '🃏',
      target: 1,
      targetMode: 'memory',
      rewardXp: 40,
      rewardStars: 4
    },
    {
      type: 'quiz_answers',
      title: 'Bystry Quizowicz',
      description: 'Odpowiedz poprawnie na 4 pytania w Quizie Mistrza',
      icon: '🏆',
      target: 4,
      targetMode: 'quiz',
      rewardXp: 40,
      rewardStars: 4
    },
    {
      type: 'words_spelled',
      title: 'Mistrz Baloników',
      description: 'Przeliteruj 3 angielskie słówka w Balonikach',
      icon: '🎈',
      target: 3,
      targetMode: 'spelling',
      rewardXp: 45,
      rewardStars: 4
    },
    {
      type: 'speed_listening',
      title: 'Szybkie Ucho',
      description: 'Zagraj 1 rundę z uśmiechniętymi obiektami w Pokoju Słuchowym',
      icon: '🎧',
      target: 1,
      targetMode: 'speed_listening',
      rewardXp: 50,
      rewardStars: 5
    },
    {
      type: 'dictionary_listened',
      title: 'Ciekawski Słuchacz',
      description: 'Posłuchaj wymowy 3 słówek w Gadającym Słowniczku',
      icon: '📖',
      target: 3,
      targetMode: 'dictionary',
      rewardXp: 30,
      rewardStars: 3
    }
  ];

  // Pick 3 unique templates
  const shuffled = [...taskTemplates].sort(() => 0.5 - rnd());
  const selected = shuffled.slice(0, 3);

  return selected.map((t, index) => ({
    ...t,
    id: `daily-${dateStr}-${t.type}-${index}`,
    current: 0,
    isClaimed: false
  }));
}

export function loadDailyChallengeState(): DailyChallengeState {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (raw) {
      const parsed: DailyChallengeState = JSON.parse(raw);
      if (parsed.date === today && parsed.tasks && parsed.tasks.length === 3) {
        return parsed;
      }
      // New day! Check streak
      let streak = parsed.dailyStreak || 0;
      // If completed yesterday, keep streak, otherwise reset
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      if (parsed.lastCompletedDate !== yesterdayStr && parsed.lastCompletedDate !== today) {
        // missed a day
        streak = 0;
      }

      const freshState: DailyChallengeState = {
        date: today,
        tasks: generateDailyTasks(today),
        allCompletedClaimed: false,
        dailyStreak: streak,
        lastCompletedDate: parsed.lastCompletedDate,
        dailyBadgeName: `Mistrz Dnia: ${new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}`
      };
      saveDailyChallengeState(freshState);
      return freshState;
    }
  } catch {
    // fallback
  }

  const freshState: DailyChallengeState = {
    date: today,
    tasks: generateDailyTasks(today),
    allCompletedClaimed: false,
    dailyStreak: 0,
    dailyBadgeName: `Mistrz Dnia: ${new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}`
  };
  saveDailyChallengeState(freshState);
  return freshState;
}

export function saveDailyChallengeState(state: DailyChallengeState) {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage fallback
  }
}
