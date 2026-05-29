import { ALPHA } from "../constants/utils";

export type BoxSize = 3 | 4 | 5;
export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert' | 'extreme';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateBaseGrid(boxSize: number): number[][] {
  const size = boxSize * boxSize;
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      grid[r][c] =
        ((boxSize * (r % boxSize) + Math.floor(r / boxSize) + c) % size) + 1;
    }
  }
  return grid;
}

function shuffleGrid(baseGrid: number[][], boxSize: number): number[][] {
  const size = boxSize * boxSize;
  const g = baseGrid.map((r) => [...r]);

  const swapRows = (r1: number, r2: number) => {
    [g[r1], g[r2]] = [g[r2], g[r1]];
  };

  const swapCols = (c1: number, c2: number) => {
    for (let r = 0; r < size; r++) {
      [g[r][c1], g[r][c2]] = [g[r][c2], g[r][c1]];
    }
  };

  // Shuffle rows within each band
  for (let band = 0; band < boxSize; band++) {
    for (let i = boxSize - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swapRows(band * boxSize + i, band * boxSize + j);
    }
  }

  // Shuffle columns within each stack
  for (let stack = 0; stack < boxSize; stack++) {
    for (let i = boxSize - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      swapCols(stack * boxSize + i, stack * boxSize + j);
    }
  }

  // Shuffle bands
  for (let i = boxSize - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let r = 0; r < boxSize; r++) {
      swapRows(i * boxSize + r, j * boxSize + r);
    }
  }

  // Shuffle stacks
  for (let i = boxSize - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let c = 0; c < boxSize; c++) {
      swapCols(i * boxSize + c, j * boxSize + c);
    }
  }

  // Permute values
  const perm = shuffle(Array.from({ length: size }, (_, i) => i + 1)) as any;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let v = getValueCell(perm[g[r][c] - 1])
      g[r][c] = v as any
    }
  }

  return g;
}

function getCellsToRemove(boxSize: BoxSize, difficulty: Difficulty): number {
  const size = boxSize * boxSize;
  const totalCells = size * size;

  const percentages: Record<Difficulty, number> = {
    easy: 0.36,
    moderate: 0.42,
    hard: 0.48,
    expert: 0.54,
    extreme: 0.62,
  };

  return Math.floor(totalCells * percentages[difficulty]);
}

export function generatePuzzle(
  boxSize: BoxSize,
  difficulty: Difficulty,
  diagonal: boolean = false
): { puzzle: number[][]; solution: number[][] } {
  const size = boxSize * boxSize;
  let solution: number[][] = [];

  // For diagonal mode we generate solutions until both diagonals are valid.
  // shuffleGrid randomizes enough that this normally succeeds within a few tries.
  const maxAttempts = diagonal ? 200 : 1;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const base = generateBaseGrid(boxSize);
    const candidate = shuffleGrid(base, boxSize);
    if (!diagonal || diagonalsAreValid(candidate, size)) {
      solution = candidate;
      break;
    }
  }
  if (solution.length === 0) {
    // Fallback — extremely unlikely; just use any shuffled grid
    solution = shuffleGrid(generateBaseGrid(boxSize), boxSize);
  }

  const puzzle = solution.map((r) => [...r]);

  const toRemove = getCellsToRemove(boxSize, difficulty);
  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => [
      Math.floor(i / size),
      i % size,
    ])
  );

  for (let i = 0; i < toRemove && i < positions.length; i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }

  return { puzzle, solution };
}

function diagonalsAreValid(grid: number[][], size: number): boolean {
  const main = new Set<number>();
  const anti = new Set<number>();
  for (let i = 0; i < size; i++) {
    main.add(grid[i][i]);
    anti.add(grid[i][size - 1 - i]);
  }
  return main.size === size && anti.size === size;
}

export function isOnMainDiagonal(row: number, col: number): boolean {
  return row === col;
}

export function isOnAntiDiagonal(row: number, col: number, size: number): boolean {
  return row + col === size - 1;
}

export function getValidCandidates(
  grid: number[][],
  row: number,
  col: number,
  boxSize: number,
  diagonal: boolean = false
): number[] {
  const size = boxSize * boxSize;
  const candidates: number[] = [];
  for (let num = 1; num <= size; num++) {
    const v = getValueCell(num)
    if (isValidPlacement(grid, row, col, v as any, boxSize, diagonal)) {
      candidates.push(v as any);
    }
  }
  return candidates;
}

export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  boxSize: number,
  diagonal: boolean = false
): boolean {
  const size = boxSize * boxSize;

  // Check row
  for (let c = 0; c < size; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < size; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }

  // Check box
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;
  for (let r = boxRow; r < boxRow + boxSize; r++) {
    for (let c = boxCol; c < boxCol + boxSize; c++) {
      if (r !== row && c !== col && grid[r][c] === num) return false;
    }
  }

  // Check diagonals when enabled
  if (diagonal) {
    if (isOnMainDiagonal(row, col)) {
      for (let i = 0; i < size; i++) {
        if (i !== row && grid[i][i] === num) return false;
      }
    }
    if (isOnAntiDiagonal(row, col, size)) {
      for (let i = 0; i < size; i++) {
        const c = size - 1 - i;
        if (i !== row && grid[i][c] === num) return false;
      }
    }
  }

  return true;
}

export const getValueCell = (v: number): string =>  {
  return ALPHA[v] ?? v
}