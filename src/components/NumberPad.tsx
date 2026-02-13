import React from 'react';
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
import { COLORS } from '../constants/theme';

const NumberPad = () => {
  const { state, inputNumber, togglePencil, erase, undo, autoPencil } = useGame();
  const { width: windowWidth } = useWindowDimensions();
  const gridSize = state.boxSize * state.boxSize;

  const maxPadWidth = Platform.OS === 'web'
    ? Math.min(windowWidth - 10, 560)
    : windowWidth - 24;

  const cols = state.boxSize <= 3 ? gridSize : state.boxSize;
  const btnSize = Math.min((maxPadWidth - cols * 6) / cols, 56);

  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);
  const rows: number[][] = [];
  for (let i = 0; i < numbers.length; i += cols) {
    rows.push(numbers.slice(i, i + cols));
  }

  return (
    <View style={[styles.container, { maxWidth: maxPadWidth }]}>
      <View style={styles.numbersContainer}>
        {rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.numberRow}>
            {row.map((num) => {
              const remaining = getRemainingCount(state.grid, num);
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberBtn,
                    {
                      width: btnSize,
                      height: btnSize,
                      borderRadius: 8,
                    },
                    remaining === 0 && styles.numberBtnDisabled,
                  ]}
                  onPress={() => inputNumber(num)}
                  disabled={remaining === 0}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.numberText,
                      {
                        fontSize: btnSize * 0.42,
                      },
                      remaining === 0 && styles.numberTextDisabled,
                    ]}
                  >
                    {num}
                  </Text>
                  {remaining > 0 && gridSize <= 16 && (
                    <Text style={[styles.remainingText, { fontSize: btnSize * 0.2 }]}>
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
          style={[styles.toolBtn, state.pencilMode && styles.toolBtnActive]}
          onPress={togglePencil}
          activeOpacity={0.6}
        >
          <Ionicons
            name="pencil"
            size={22}
            color={state.pencilMode ? COLORS.white : COLORS.text}
          />
          <Text
            style={[
              styles.toolLabel,
              state.pencilMode && styles.toolLabelActive,
            ]}
          >
            Pencil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtn}
          onPress={erase}
          activeOpacity={0.6}
        >
          <Ionicons name="backspace-outline" size={22} color={COLORS.text} />
          <Text style={styles.toolLabel}>Erase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtn}
          onPress={undo}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-undo" size={22} color={COLORS.text} />
          <Text style={styles.toolLabel}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolBtn}
          onPress={autoPencil}
          activeOpacity={0.6}
        >
          <Ionicons name="color-wand" size={22} color={COLORS.text} />
          <Text style={styles.toolLabel}>Auto</Text>
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
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  numberBtnDisabled: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.borderLight,
    opacity: 0.4,
  },
  numberText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  numberTextDisabled: {
    color: COLORS.textMuted,
  },
  remainingText: {
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    minWidth: 72,
  },
  toolBtnActive: {
    backgroundColor: COLORS.pencilActive,
    borderColor: COLORS.pencilActive,
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  toolLabelActive: {
    color: COLORS.white,
  },
});

export default React.memo(NumberPad);
