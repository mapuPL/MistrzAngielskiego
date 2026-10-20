export type CategoryId = 'animals' | 'school' | 'food' | 'colors_numbers' | 'body' | 'family_home' | 'actions';

export interface VocabItem {
  id: string;
  en: string;
  pl: string;
  category: CategoryId;
  phonetic: string;
  emoji: string;
  exampleEn: string;
  examplePl: string;
}

export interface SentenceItem {
  id: string;
  fullEn: string;
  fullPl: string;
  words: string[];
  category: CategoryId;
  hint?: string;
}

export type GameMode = 'map' | 'quiz' | 'spelling' | 'memory' | 'sentences' | 'speed_listening' | 'dictionary';

export interface PlayerStats {
  name: string;
  avatar: string;
  stars: number;
  xp: number;
  quizzesCompleted: number;
  spellingCompleted: number;
  memoryCompleted: number;
  sentencesCompleted: number;
  speedListeningCompleted: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  requirementStars: number;
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
