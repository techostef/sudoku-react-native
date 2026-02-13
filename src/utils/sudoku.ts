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
  const perm = shuffle(Array.from({ length: size }, (_, i) => i + 1));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      g[r][c] = perm[g[r][c] - 1];
    }
  }

  return g;
}

function getCellsToRemove(boxSize: BoxSize, difficulty: Difficulty): number {
  const size = boxSize * boxSize;
  const totalCells = size * size;

  const percentages: Record<Difficulty, number> = {
    easy: 0.36,
    moderate: 0.46,
    hard: 0.54,
    expert: 0.62,
    extreme: 0.7,
  };

  return Math.floor(totalCells * percentages[difficulty]);
}

export function generatePuzzle(
  boxSize: BoxSize,
  difficulty: Difficulty
): { puzzle: number[][]; solution: number[][] } {
  const base = generateBaseGrid(boxSize);
  const solution = shuffleGrid(base, boxSize);
  const size = boxSize * boxSize;
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

export function getValidCandidates(
  grid: number[][],
  row: number,
  col: number,
  boxSize: number
): number[] {
  const size = boxSize * boxSize;
  const candidates: number[] = [];
  for (let num = 1; num <= size; num++) {
    if (isValidPlacement(grid, row, col, num, boxSize)) {
      candidates.push(num);
    }
  }
  return candidates;
}

export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  boxSize: number
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

  return true;
}
