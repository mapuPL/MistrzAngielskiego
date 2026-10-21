export type GradeLevel = 'grade3' | 'grade4_6' | 'grade7_8';

export type CategoryId = 
  | 'animals' 
  | 'school' 
  | 'food' 
  | 'colors_numbers' 
  | 'body' 
  | 'family_home' 
  | 'actions'
  | 'travel_places'
  | 'jobs_professions'
  | 'environment_tech'
  | 'culture_media';

export interface VocabItem {
  id: string;
  en: string;
  pl: string;
  category: CategoryId;
  phonetic: string;
  emoji: string;
  exampleEn: string;
  examplePl: string;
  level?: GradeLevel;
}

export interface SentenceItem {
  id: string;
  fullEn: string;
  fullPl: string;
  words: string[];
  category: CategoryId;
  hint?: string;
  level?: GradeLevel;
}

export interface IrregularVerb {
  id: string;
  base: string;
  past: string;
  participle: string;
  pl: string;
  exampleEn: string;
}

export interface CkeExamItem {
  id: string;
  type: 'transformation' | 'translation' | 'gap_fill';
  instruction: string;
  sentenceBefore: string;
  bracketPrompt: string;
  sentenceAfter: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint: string;
  explanation: string;
}

export type GameMode = 
  | 'landing'
  | 'map' 
  | 'quiz' 
  | 'spelling' 
  | 'memory' 
  | 'sentences' 
  | 'speed_listening' 
  | 'dictionary' 
  | 'daily'
  | 'irregular_verbs'
  | 'cke_exam';

export type ChallengeType = 
  | 'quiz_answers'
  | 'sentences_built'
  | 'memory_won'
  | 'words_spelled'
  | 'speed_listening'
  | 'dictionary_listened'
  | 'irregular_verbs_practiced'
  | 'cke_tasks_solved';

export interface DailyTask {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  targetCategory?: CategoryId;
  targetMode: GameMode;
  rewardXp: number;
  rewardStars: number;
  isClaimed: boolean;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  tasks: DailyTask[];
  allCompletedClaimed: boolean;
  dailyStreak: number;
  lastCompletedDate?: string;
  dailyBadgeName?: string;
}

export interface PlayerStats {
  name: string;
  avatar: string;
  gradeLevel: GradeLevel;
  stars: number;
  xp: number;
  quizzesCompleted: number;
  spellingCompleted: number;
  memoryCompleted: number;
  sentencesCompleted: number;
  speedListeningCompleted: number;
  dailyChallengesCompleted: number;
  irregularCompleted?: number;
  ckeCompleted?: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  requirementStars: number;
  gradeLevel?: GradeLevel;
}

export interface LandInfo {
  id: CategoryId;
  namePl: string;
  nameEn: string;
  icon: string;
  description: string;
  grammarFocus: string;
  requiredStarsToUnlock: number;
  themeColor: string;
}
