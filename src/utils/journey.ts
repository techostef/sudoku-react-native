import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty } from './sudoku';

const JOURNEY_KEY = 'sudoku_journey_progress';
const TOTAL_LEVELS = 500;

export interface JourneyLevel {
  level: number;
  unlocked: boolean;
  completed: boolean;
  difficulty?: Difficulty;
  stars?: number; // 1-3 based on mistakes: 0 mistakes=3, 1=2, 2+=1
}

export interface JourneyProgress {
  levels: JourneyLevel[];
}

function getDefaultProgress(): JourneyProgress {
  const levels: JourneyLevel[] = [];
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    levels.push({
      level: i,
      unlocked: i === 1,
      completed: false,
    });
  }
  return { levels };
}

export async function loadJourneyProgress(): Promise<JourneyProgress> {
  try {
    const raw = await AsyncStorage.getItem(JOURNEY_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw) as JourneyProgress;
    // Ensure we always have TOTAL_LEVELS levels (in case we add more later)
    while (parsed.levels.length < TOTAL_LEVELS) {
      parsed.levels.push({
        level: parsed.levels.length + 1,
        unlocked: false,
        completed: false,
      });
    }
    return parsed;
  } catch {
    return getDefaultProgress();
  }
}

export async function saveJourneyProgress(progress: JourneyProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(JOURNEY_KEY, JSON.stringify(progress));
  } catch {
    // silently fail
  }
}

export async function completeJourneyLevel(
  level: number,
  mistakes: number
): Promise<JourneyProgress> {
  const progress = await loadJourneyProgress();
  const idx = level - 1;
  if (idx < 0 || idx >= progress.levels.length) return progress;

  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;

  // Only update stars if better than previous
  if (!progress.levels[idx].completed || (progress.levels[idx].stars ?? 0) < stars) {
    progress.levels[idx].stars = stars;
  }
  progress.levels[idx].completed = true;

  // Unlock next level
  if (idx + 1 < progress.levels.length) {
    progress.levels[idx + 1].unlocked = true;
  }

  await saveJourneyProgress(progress);
  return progress;
}

export async function resetJourneyProgress(): Promise<JourneyProgress> {
  const progress = getDefaultProgress();
  await saveJourneyProgress(progress);
  return progress;
}

/**
 * Get a random difficulty weighted by level number.
 * Lower levels favor easy/moderate, higher levels favor hard/expert/extreme.
 */
export function getRandomDifficultyForLevel(level: number): Difficulty {
  // Weights: [easy, moderate, hard, expert, extreme]
  let weights: number[];

  if (level <= 50) {
    weights = [50, 35, 10, 4, 1];
  } else if (level <= 100) {
    weights = [30, 35, 22, 10, 3];
  } else if (level <= 150) {
    weights = [15, 28, 30, 18, 9];
  } else if (level <= 200) {
    weights = [5, 15, 30, 30, 20];
  } else if (level <= 300) {
    weights = [2, 8, 20, 35, 35];
  } else if (level <= 400) {
    weights = [0, 3, 12, 35, 50];
  } else {
    weights = [0, 0, 8, 27, 65];
  }

  const difficulties: Difficulty[] = ['easy', 'moderate', 'hard', 'expert', 'extreme'];
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return difficulties[i];
  }

  return difficulties[difficulties.length - 1];
}

export { TOTAL_LEVELS };
