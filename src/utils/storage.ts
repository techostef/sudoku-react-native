import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoxSize, Difficulty } from './sudoku';

const DIFFICULTIES: Difficulty[] = ['easy', 'moderate', 'hard', 'expert', 'extreme'];

export type GameMode = 'classic' | 'killer';
export type BlitzDifficulty = 'easy' | 'moderate' | 'hard';

export interface GameRecord {
  id: string;
  date: string;
  boxSize: BoxSize;
  difficulty: Difficulty;
  time: number;
  mistakes: number;
  completed: boolean;
  hintsUsed?: number;
  mode?: GameMode;
  diagonal?: boolean;
}

const RECORDS_KEY = 'sudoku_game_records';
const BLITZ_SCORES_KEY = 'sudoku_blitz_best_scores';
const MAX_RECORDS = 100;

export async function loadRecords(): Promise<GameRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GameRecord[];
  } catch {
    return [];
  }
}

export async function saveRecord(record: GameRecord): Promise<void> {
  try {
    const records = await loadRecords();
    records.unshift(record);
    if (records.length > MAX_RECORDS) {
      records.length = MAX_RECORDS;
    }
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // silently fail
  }
}

export async function clearRecords(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RECORDS_KEY);
    await AsyncStorage.removeItem(BLITZ_SCORES_KEY);
  } catch {
    // silently fail
  }
}

export function getBestTimesByDifficulty(records: GameRecord[]): Record<Difficulty, number | null> {
  const result = {} as Record<Difficulty, number | null>;
  for (const diff of DIFFICULTIES) {
    const wins = records.filter((r) => r.completed && r.difficulty === diff);
    result[diff] = wins.length > 0 ? Math.min(...wins.map((r) => r.time)) : null;
  }
  return result;
}

export function getWinStreak(records: GameRecord[]): number {
  let streak = 0;
  for (const record of records) {
    if (record.completed) streak++;
    else break;
  }
  return streak;
}

export type BlitzBestScores = Record<BlitzDifficulty, number>;

export async function loadBlitzBestScores(): Promise<BlitzBestScores> {
  try {
    const raw = await AsyncStorage.getItem(BLITZ_SCORES_KEY);
    if (!raw) return { easy: 0, moderate: 0, hard: 0 };
    const parsed = JSON.parse(raw) as Partial<BlitzBestScores>;
    return {
      easy: parsed.easy ?? 0,
      moderate: parsed.moderate ?? 0,
      hard: parsed.hard ?? 0,
    };
  } catch {
    return { easy: 0, moderate: 0, hard: 0 };
  }
}

export async function saveBlitzScore(difficulty: BlitzDifficulty, score: number): Promise<number> {
  try {
    const current = await loadBlitzBestScores();
    if (score > current[difficulty]) {
      current[difficulty] = score;
      await AsyncStorage.setItem(BLITZ_SCORES_KEY, JSON.stringify(current));
    }
    return current[difficulty];
  } catch {
    return score;
  }
}
