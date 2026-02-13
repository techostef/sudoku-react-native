import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { BoxSize, Difficulty, generatePuzzle, getValidCandidates, isValidPlacement } from '../utils/sudoku';
import { saveRecord, GameRecord } from '../utils/storage';
import { completeJourneyLevel } from '../utils/journey';
import { loadSounds, playSound } from '../utils/sound';

export interface CellData {
  value: number;
  solution: number;
  isGiven: boolean;
  isLocked: boolean;
  notes: number[];
}

interface HistoryEntry {
  row: number;
  col: number;
  prevValue: number;
  prevNotes: number[];
}

export interface GameState {
  boxSize: BoxSize;
  difficulty: Difficulty;
  grid: CellData[][];
  solution: number[][];
  selectedCell: [number, number] | null;
  pencilMode: boolean;
  isPaused: boolean;
  isComplete: boolean;
  isGameOver: boolean;
  mistakes: number;
  maxMistakes: number;
  history: HistoryEntry[];
  gameStarted: boolean;
  journeyLevel: number | null;
}

type GameAction =
  | { type: 'START_GAME'; boxSize: BoxSize; difficulty: Difficulty; journeyLevel?: number }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_NUMBER'; num: number }
  | { type: 'TOGGLE_PENCIL' }
  | { type: 'ERASE' }
  | { type: 'UNDO' }
  | { type: 'RESTART' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'AUTO_PENCIL' };

const initialState: GameState = {
  boxSize: 3,
  difficulty: 'easy',
  grid: [],
  solution: [],
  selectedCell: null,
  pencilMode: false,
  isPaused: false,
  isComplete: false,
  isGameOver: false,
  mistakes: 0,
  maxMistakes: 3,
  history: [],
  gameStarted: false,
  journeyLevel: null,
};

function checkComplete(grid: CellData[][]): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (cell.value === 0 || cell.value !== cell.solution) return false;
    }
  }
  return true;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { puzzle, solution } = generatePuzzle(
        action.boxSize,
        action.difficulty
      );
      const size = action.boxSize * action.boxSize;
      const grid: CellData[][] = [];
      for (let r = 0; r < size; r++) {
        grid[r] = [];
        for (let c = 0; c < size; c++) {
          grid[r][c] = {
            value: puzzle[r][c],
            solution: solution[r][c],
            isGiven: puzzle[r][c] !== 0,
            isLocked: false,
            notes: [],
          };
        }
      }
      return {
        ...initialState,
        boxSize: action.boxSize,
        difficulty: action.difficulty,
        grid,
        solution,
        gameStarted: true,
        journeyLevel: action.journeyLevel ?? null,
      };
    }

    case 'SELECT_CELL': {
      if (state.isPaused || state.isComplete || state.isGameOver) return state;
      return { ...state, selectedCell: [action.row, action.col] };
    }

    case 'INPUT_NUMBER': {
      if (!state.selectedCell || state.isPaused || state.isComplete || state.isGameOver)
        return state;
      const [row, col] = state.selectedCell;
      const cell = state.grid[row][col];
      if (cell.isGiven || cell.isLocked) return state;

      const newGrid = state.grid.map((r) =>
        r.map((c) => ({ ...c, notes: [...c.notes] }))
      );
      const historyEntry: HistoryEntry = {
        row,
        col,
        prevValue: cell.value,
        prevNotes: [...cell.notes],
      };

      if (state.pencilMode) {
        // Validate pencil: only allow valid candidates
        const valuesGrid = state.grid.map((r) => r.map((c) => c.value));
        if (!isValidPlacement(valuesGrid, row, col, action.num, state.boxSize)) {
          // Already toggling off is always allowed
          const noteIdx = newGrid[row][col].notes.indexOf(action.num);
          if (noteIdx >= 0) {
            newGrid[row][col].notes.splice(noteIdx, 1);
            return {
              ...state,
              grid: newGrid,
              history: [...state.history, historyEntry],
            };
          }
          return state;
        }
        const noteIdx = newGrid[row][col].notes.indexOf(action.num);
        if (noteIdx >= 0) {
          newGrid[row][col].notes.splice(noteIdx, 1);
        } else {
          newGrid[row][col].notes.push(action.num);
          newGrid[row][col].notes.sort((a, b) => a - b);
        }
        newGrid[row][col].value = 0;
        return {
          ...state,
          grid: newGrid,
          history: [...state.history, historyEntry],
        };
      }

      const newValue =
        newGrid[row][col].value === action.num ? 0 : action.num;
      newGrid[row][col].value = newValue;
      newGrid[row][col].notes = [];

      let newMistakes = state.mistakes;
      if (newValue !== 0 && newValue !== cell.solution) {
        newMistakes++;
      }

      // Lock the cell if correct and clear pencil marks from related cells
      if (newValue !== 0 && newValue === cell.solution) {
        newGrid[row][col].isLocked = true;
        const size = state.boxSize * state.boxSize;
        const boxRowStart = Math.floor(row / state.boxSize) * state.boxSize;
        const boxColStart = Math.floor(col / state.boxSize) * state.boxSize;
        for (let i = 0; i < size; i++) {
          // Same row
          const ri = newGrid[row][i].notes.indexOf(newValue);
          if (ri >= 0) newGrid[row][i].notes.splice(ri, 1);
          // Same column
          const ci = newGrid[i][col].notes.indexOf(newValue);
          if (ci >= 0) newGrid[i][col].notes.splice(ci, 1);
        }
        // Same box
        for (let r = boxRowStart; r < boxRowStart + state.boxSize; r++) {
          for (let c = boxColStart; c < boxColStart + state.boxSize; c++) {
            const bi = newGrid[r][c].notes.indexOf(newValue);
            if (bi >= 0) newGrid[r][c].notes.splice(bi, 1);
          }
        }
      }

      const isGameOver = newMistakes >= state.maxMistakes;
      const isComplete = !isGameOver && checkComplete(newGrid);

      return {
        ...state,
        grid: newGrid,
        mistakes: newMistakes,
        history: [...state.history, historyEntry],
        isComplete,
        isGameOver,
      };
    }

    case 'TOGGLE_PENCIL': {
      return { ...state, pencilMode: !state.pencilMode };
    }

    case 'ERASE': {
      if (!state.selectedCell || state.isPaused || state.isComplete || state.isGameOver)
        return state;
      const [row, col] = state.selectedCell;
      const cell = state.grid[row][col];
      if (cell.isGiven || cell.isLocked) return state;
      if (cell.value === 0 && cell.notes.length === 0) return state;

      const newGrid = state.grid.map((r) =>
        r.map((c) => ({ ...c, notes: [...c.notes] }))
      );
      const historyEntry: HistoryEntry = {
        row,
        col,
        prevValue: cell.value,
        prevNotes: [...cell.notes],
      };
      newGrid[row][col].value = 0;
      newGrid[row][col].notes = [];

      return {
        ...state,
        grid: newGrid,
        history: [...state.history, historyEntry],
      };
    }

    case 'UNDO': {
      if (
        state.history.length === 0 ||
        state.isPaused ||
        state.isComplete ||
        state.isGameOver
      )
        return state;
      const newHistory = [...state.history];
      const entry = newHistory.pop()!;
      const newGrid = state.grid.map((r) =>
        r.map((c) => ({ ...c, notes: [...c.notes] }))
      );
      newGrid[entry.row][entry.col].value = entry.prevValue;
      newGrid[entry.row][entry.col].notes = [...entry.prevNotes];

      return {
        ...state,
        grid: newGrid,
        history: newHistory,
        selectedCell: [entry.row, entry.col],
      };
    }

    case 'RESTART': {
      const newGrid = state.grid.map((r) =>
        r.map((c) => ({
          ...c,
          value: c.isGiven ? c.value : 0,
          isLocked: false,
          notes: [],
        }))
      );
      return {
        ...state,
        grid: newGrid,
        selectedCell: null,
        pencilMode: false,
        isPaused: false,
        isComplete: false,
        isGameOver: false,
        mistakes: 0,
        history: [],
      };
    }

    case 'AUTO_PENCIL': {
      if (state.isPaused || state.isComplete || state.isGameOver) return state;
      const valuesGrid = state.grid.map((r) => r.map((c) => c.value));
      const newGrid = state.grid.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (c.value !== 0 || c.isGiven || c.isLocked) return { ...c, notes: [...c.notes] };
          const candidates = getValidCandidates(valuesGrid, rIdx, cIdx, state.boxSize);
          return { ...c, notes: candidates };
        })
      );
      return {
        ...state,
        grid: newGrid,
      };
    }

    case 'TOGGLE_PAUSE': {
      return {
        ...state,
        isPaused: !state.isPaused,
        selectedCell: state.isPaused ? state.selectedCell : null,
      };
    }

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  timer: number;
  setTimer: (timer: number) => void;
  startGame: (boxSize: BoxSize, difficulty: Difficulty, journeyLevel?: number) => void;
  selectCell: (row: number, col: number) => void;
  inputNumber: (num: number) => void;
  togglePencil: () => void;
  erase: () => void;
  undo: () => void;
  restart: () => void;
  togglePause: () => void;
  autoPencil: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [tick, setTick] = useState(0);

  // Load sounds on mount
  useEffect(() => {
    loadSounds();
  }, []);

  // Track mistakes to detect wrong placement
  const prevMistakesRef = useRef(0);
  // Track locked cell count to detect correct placement
  const prevLockedCountRef = useRef(0);

  // Play sounds on correct/wrong placement
  useEffect(() => {
    if (!state.gameStarted) {
      prevMistakesRef.current = 0;
      prevLockedCountRef.current = 0;
      return;
    }

    const lockedCount = state.grid.reduce(
      (sum, row) => sum + row.filter((c) => c.isLocked).length,
      0
    );

    // Don't play sounds on game over or complete (those have their own sounds)
    if (!state.isComplete && !state.isGameOver) {
      if (state.mistakes > prevMistakesRef.current) {
        playSound('hitWrong');
      } else if (lockedCount > prevLockedCountRef.current) {
        playSound('hitCorrect');
      }
    }

    prevMistakesRef.current = state.mistakes;
    prevLockedCountRef.current = lockedCount;
  }, [state.grid, state.mistakes]);

  // Save record when game completes or game over, and play win/lose sounds
  const prevCompleteRef = useRef(false);
  const prevGameOverRef = useRef(false);
  useEffect(() => {
    if ((state.isComplete && !prevCompleteRef.current) ||
        (state.isGameOver && !prevGameOverRef.current)) {
      const record: GameRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        boxSize: state.boxSize,
        difficulty: state.difficulty,
        time: tick,
        mistakes: state.mistakes,
        completed: state.isComplete,
      };
      saveRecord(record);

      // Play win or lose sound
      if (state.isComplete && !prevCompleteRef.current) {
        playSound('winGame');
      } else if (state.isGameOver && !prevGameOverRef.current) {
        playSound('loseGame');
      }

      // Complete journey level if in journey mode and won
      if (state.isComplete && state.journeyLevel !== null) {
        completeJourneyLevel(state.journeyLevel, state.mistakes);
      }
    }
    prevCompleteRef.current = state.isComplete;
    prevGameOverRef.current = state.isGameOver;
  }, [state.isComplete, state.isGameOver]);

  const startGame = useCallback(
    (boxSize: BoxSize, difficulty: Difficulty, journeyLevel?: number) => {
      setTick(0);
      dispatch({ type: 'START_GAME', boxSize, difficulty, journeyLevel });
    },
    []
  );

  const setTimer = useCallback((timer: number) => {
    setTick(timer);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const inputNumber = useCallback((num: number) => {
    dispatch({ type: 'INPUT_NUMBER', num });
  }, []);

  const togglePencil = useCallback(() => {
    dispatch({ type: 'TOGGLE_PENCIL' });
  }, []);

  const erase = useCallback(() => {
    dispatch({ type: 'ERASE' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const restart = useCallback(() => {
    setTick(0);
    dispatch({ type: 'RESTART' });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const autoPencil = useCallback(() => {
    dispatch({ type: 'AUTO_PENCIL' });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        timer: tick,
        setTimer,
        startGame,
        selectCell,
        inputNumber,
        togglePencil,
        erase,
        undo,
        restart,
        togglePause,
        autoPencil,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
