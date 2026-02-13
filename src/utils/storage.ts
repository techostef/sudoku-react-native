import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoxSize, Difficulty } from './sudoku';

export interface GameRecord {
  id: string;
  date: string;
  boxSize: BoxSize;
  difficulty: Difficulty;
  time: number;
  mistakes: number;
  completed: boolean;
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
