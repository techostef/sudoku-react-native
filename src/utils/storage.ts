import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoxSize, Difficulty } from './sudoku';

const DIFFICULTIES: Difficulty[] = ['easy', 'moderate', 'hard', 'expert', 'extreme'];

export interface GameRecord {
  id: string;
  date: string;
  boxSize: BoxSize;
  difficulty: Difficulty;
  time: number;
  mistakes: number;
  completed: boolean;
  hintsUsed?: number;
}

const RECORDS_KEY = 'sudoku_game_records';
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
