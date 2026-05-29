import { Difficulty, generatePuzzle } from './sudoku';

export interface Cage {
  id: number;
  cells: [number, number][];
  sum: number;
}

const KILLER_BOX_SIZE = 3;
const GRID_SIZE = 9;

function getCageSizeRange(difficulty: Difficulty): [number, number] {
  switch (difficulty) {
    case 'easy':
      return [2, 3];
    case 'moderate':
      return [2, 3];
    case 'hard':
      return [2, 4];
    case 'expert':
      return [3, 4];
    case 'extreme':
      return [3, 5];
    default:
      return [2, 3];
  }
}

function neighbors(r: number, c: number): [number, number][] {
  const result: [number, number][] = [];
  if (r > 0) result.push([r - 1, c]);
  if (r < GRID_SIZE - 1) result.push([r + 1, c]);
  if (c > 0) result.push([r, c - 1]);
  if (c < GRID_SIZE - 1) result.push([r, c + 1]);
  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildCages(solution: number[][], difficulty: Difficulty): Cage[] {
  const [minSize, maxSize] = getCageSizeRange(difficulty);
  const assigned: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(-1)
  );
  const cages: Cage[] = [];

  const allCells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) allCells.push([r, c]);
  }
  const shuffledStarts = shuffle(allCells);

  for (const [sr, sc] of shuffledStarts) {
    if (assigned[sr][sc] !== -1) continue;

    const cageId = cages.length;
    const cells: [number, number][] = [[sr, sc]];
    assigned[sr][sc] = cageId;
    const used = new Set<number>([solution[sr][sc]]);
    const targetSize = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

    while (cells.length < targetSize) {
      const candidates: [number, number][] = [];
      for (const [cr, cc] of cells) {
        for (const [nr, nc] of neighbors(cr, cc)) {
          if (assigned[nr][nc] === -1 && !used.has(solution[nr][nc])) {
            candidates.push([nr, nc]);
          }
        }
      }
      if (candidates.length === 0) break;
      const [nr, nc] = candidates[Math.floor(Math.random() * candidates.length)];
      assigned[nr][nc] = cageId;
      used.add(solution[nr][nc]);
      cells.push([nr, nc]);
    }

    const sum = cells.reduce((acc, [r, c]) => acc + solution[r][c], 0);
    cages.push({ id: cageId, cells, sum });
  }

  // Merge any size-1 orphan cages into a neighbor when possible (no-duplicate rule allowing).
  // Killer cages of size 1 are uninteresting; merge if safe.
  for (let i = cages.length - 1; i >= 0; i--) {
    const cage = cages[i];
    if (cage.cells.length !== 1) continue;
    const [r, c] = cage.cells[0];
    const v = solution[r][c];
    let merged = false;
    for (const [nr, nc] of neighbors(r, c)) {
      const otherId = assigned[nr][nc];
      if (otherId === cage.id) continue;
      const other = cages.find((cg) => cg.id === otherId);
      if (!other) continue;
      const otherValues = new Set(other.cells.map(([or, oc]) => solution[or][oc]));
      if (!otherValues.has(v)) {
        other.cells.push([r, c]);
        other.sum += v;
        assigned[r][c] = other.id;
        cages.splice(i, 1);
        merged = true;
        break;
      }
    }
    if (!merged) {
      // Leave as-is; rare edge case
    }
  }

  return cages;
}

export function generateKillerPuzzle(difficulty: Difficulty): {
  puzzle: number[][];
  solution: number[][];
  cages: Cage[];
} {
  const { puzzle, solution } = generatePuzzle(KILLER_BOX_SIZE as any, difficulty);
  const cages = buildCages(solution, difficulty);
  return { puzzle, solution, cages };
}

export function getCageForCell(row: number, col: number, cages: Cage[]): Cage | null {
  for (const cage of cages) {
    if (cage.cells.some(([r, c]) => r === row && c === col)) return cage;
  }
  return null;
}

/**
 * Returns true if placing `num` at (row,col) is valid against killer cage rules:
 *  - No duplicate value within the cage
 *  - Sum of placed values does not exceed cage.sum
 *  - If the cage is fully filled by this placement, sum must equal cage.sum
 */
export function isValidKillerCagePlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  cages: Cage[]
): boolean {
  const cage = getCageForCell(row, col, cages);
  if (!cage) return true;
  let sum = num;
  let unfilled = 0;
  for (const [r, c] of cage.cells) {
    if (r === row && c === col) continue;
    const v = grid[r][c];
    if (v === num) return false;
    if (v === 0) unfilled++;
    else sum += v;
  }
  if (unfilled === 0 && sum !== cage.sum) return false;
  if (sum > cage.sum) return false;
  return true;
}

/**
 * Returns the cells along the top-left edge of a cage so the sum label
 * can be rendered on the cage's anchor (smallest row, then smallest col).
 */
export function getCageAnchor(cage: Cage): [number, number] {
  let best = cage.cells[0];
  for (const cell of cage.cells) {
    if (cell[0] < best[0] || (cell[0] === best[0] && cell[1] < best[1])) {
      best = cell;
    }
  }
  return best;
}

/**
 * For drawing dashed borders: returns which sides of a cell are NOT shared with
 * another cell in the same cage. Sides: top/right/bottom/left.
 */
export function getCageEdges(
  row: number,
  col: number,
  cage: Cage
): { top: boolean; right: boolean; bottom: boolean; left: boolean } {
  const has = (r: number, c: number) =>
    cage.cells.some(([cr, cc]) => cr === r && cc === c);
  return {
    top: !has(row - 1, col),
    right: !has(row, col + 1),
    bottom: !has(row + 1, col),
    left: !has(row, col - 1),
  };
}
