import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { useColors } from '../context/ThemeContext';
import { getValueCell } from '../utils/sudoku';

const maxButton3x3 = 9
const maxButton4x4 = 16

const NumberPad = () => {
  const { state, inputNumber, togglePencil, erase, undo, autoPencil } = useGame();
  const colors = useColors();
  const { width: windowWidth } = useWindowDimensions();
  const gridSize = state.boxSize * state.boxSize;

  const { grid, selectedCell } = state;

  const maxPadWidth = Platform.OS === 'web'
    ? Math.min(windowWidth - 10, 560)
    : windowWidth + 10;

  const cols = maxButton3x3;
  const btnSize = Math.min((maxPadWidth - cols * 6) / cols, 56);

  let numbers = Array.from({ length: maxButton3x3 }, (_, i) => i + 1);
  const rows3x3: number[][] = [];
  const rows4x4: number[][] = [];
  let i = 0
  for (i; i < maxButton3x3; i += cols) {
    rows3x3.push(numbers.slice(i, i + cols));
  }
  if (gridSize === 16) {
    numbers = Array.from({ length: maxButton4x4 }, (_, i) => i + 1);
    for (i; i < maxButton4x4; i += cols) {
      rows4x4.push(numbers.slice(i, i + cols));
    }
  }

  const selectedNotes = useMemo(() => {
    if (!selectedCell) return {};
    const [r, c] = selectedCell;
    if (!grid[r] || !grid[r][c]) return {};
    const value: Record<number, boolean> = {};
    grid[r][c].notes.forEach((note) => {
      value[note] = true;
    });
    return value;
  }, [selectedCell, grid]);

  return (
    <View style={[styles.container, { maxWidth: maxPadWidth }]}>
      <View style={styles.numbersContainer}>
        {rows3x3.map((row, rIdx) => (
          <View key={rIdx} style={styles.numberRow}>
            {row.map((_num) => {
              const num = getValueCell(_num) as any
              const remaining = getRemainingCount(state.grid, num);
              const isNote = selectedNotes[num] || !state.pencilMode;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberBtn,
                    {
                      width: btnSize,
                      height: gridSize <= 9 ? btnSize + 16 : btnSize + 25,
                      borderRadius: 8,
                      opacity: isNote ? 1 : 0.4,
                      backgroundColor: colors.surface,
                      borderColor: colors.borderLight,
                    },
                    remaining === 0 && { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight, opacity: 0.4 },
                  ]}
                  onPress={() => inputNumber(num)}
                  disabled={remaining === 0}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.numberText,
                      {
                        fontSize: btnSize * 0.6,
                        color: colors.primary,
                      },
                      remaining === 0 && { color: colors.textMuted },
                    ]}
                  >
                    {num}
                  </Text>
                  {remaining > 0 && gridSize <= 16 && (
                    <Text style={[styles.remainingText, { fontSize: btnSize * 0.2, color: colors.textMuted }]}>
                      {remaining}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {rows4x4.map((row, rIdx) => (
          <View key={rIdx} style={styles.numberRow}>
            {row.map((_num) => {
              const num = getValueCell(_num) as any
              const remaining = getRemainingCount(state.grid, num);
              const isNote = selectedNotes[num] || !state.pencilMode;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberBtn,
                    {
                      width: btnSize,
                      height: gridSize <= 9 ? btnSize + 16 : btnSize + 25,
                      borderRadius: 8,
                      opacity: isNote ? 1 : 0.4,
                      backgroundColor: colors.surface,
                      borderColor: colors.borderLight,
                    },
                    remaining === 0 && { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight, opacity: 0.4 },
                  ]}
                  onPress={() => inputNumber(num)}
                  disabled={remaining === 0}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.numberText,
                      {
                        fontSize: btnSize * 0.6,
                        color: colors.primary,
                      },
                      remaining === 0 && { color: colors.textMuted },
                    ]}
                  >
                    {num}
                  </Text>
                  {remaining > 0 && gridSize <= 16 && (
                    <Text style={[styles.remainingText, { fontSize: btnSize * 0.2, color: colors.textMuted }]}>
                      {remaining}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.toolRow}>
        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, state.pencilMode && { backgroundColor: colors.pencilActive, borderColor: colors.pencilActive }]}
          onPress={togglePencil}
          activeOpacity={0.6}
        >
          <Ionicons
            name="pencil"
            size={22}
            color={state.pencilMode ? colors.white : colors.text}
          />
          <Text
            style={[
              styles.toolLabel,
              { color: colors.textSecondary },
              state.pencilMode && { color: colors.white },
            ]}
          >
            Pencil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
          onPress={erase}
          activeOpacity={0.6}
        >
          <Ionicons name="backspace-outline" size={22} color={colors.text} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>Erase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
          onPress={undo}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-undo" size={22} color={colors.text} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
          onPress={autoPencil}
          activeOpacity={0.6}
        >
          <Ionicons name="color-wand" size={22} color={colors.text} />
          <Text style={[styles.toolLabel, { color: colors.textSecondary }]}>Auto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getRemainingCount(grid: any[][], num: number): number {
  if (!grid || grid.length === 0) return 0;
  const total = grid.length;
  let placed = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.value === num) placed++;
    }
  }
  return total - placed;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  numbersContainer: {
    alignItems: 'center',
    gap: 6,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
  },
  numberBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  numberText: {
    fontWeight: '700',
  },
  remainingText: {
    fontWeight: '500',
    marginTop: -2,
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 72,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default React.memo(NumberPad);
