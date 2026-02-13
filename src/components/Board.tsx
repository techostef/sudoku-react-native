import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useGame, CellData } from '../context/GameContext';
import { COLORS } from '../constants/theme';

const Cell = React.memo(function Cell({
  cell,
  row,
  col,
  cellSize,
  boxSize,
  selectedValue,
  isSelected,
  isRelated,
  isSameValue,
  isError,
  onPress,
}: {
  cell: CellData;
  row: number;
  col: number;
  cellSize: number;
  boxSize: number;
  selectedValue: number;
  isSelected: boolean;
  isRelated: boolean;
  isSameValue: boolean;
  isError: boolean;
  onPress: () => void;
}) {
  const gridSize = boxSize * boxSize;
  const isRightBoxBorder = (col + 1) % boxSize === 0 && col < gridSize - 1;
  const isBottomBoxBorder = (row + 1) % boxSize === 0 && row < gridSize - 1;

  let bgColor = COLORS.surface;
  if (isSelected) bgColor = COLORS.selected;
  else if (isSameValue) bgColor = COLORS.highlight;
  else if (isRelated) bgColor = COLORS.related;

  const fontSize = cellSize * (gridSize <= 9 ? 0.5 : gridSize <= 16 ? 0.38 : 0.3);
  const noteSize = cellSize / (boxSize + 0.5);
  const noteFontSize = noteSize * 0.7;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: bgColor,
          borderRightWidth: isRightBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderBottomWidth: isBottomBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderRightColor: isRightBoxBorder ? COLORS.boxBorder : COLORS.border,
          borderBottomColor: isBottomBoxBorder ? COLORS.boxBorder : COLORS.border,
        },
        isError && { backgroundColor: COLORS.errorBg },
      ]}
    >
      {cell.value !== 0 ? (
        <Text
          style={[
            styles.cellText,
            {
              fontSize,
              color: cell.isGiven
                ? COLORS.given
                : cell.isLocked
                ? COLORS.given
                : isError
                ? COLORS.error
                : COLORS.userInput,
              fontWeight: cell.isGiven || cell.isLocked ? '700' : '500',
            },
          ]}
        >
          {cell.value}
        </Text>
      ) : cell.notes.length > 0 ? (
        <View style={[styles.notesContainer, { width: cellSize - 2, height: cellSize - 2 }]}>
          {Array.from({ length: gridSize }, (_, i) => i + 1).map((n) => (
            <View
              key={n}
              style={{
                width: noteSize,
                height: noteSize,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cell.notes.includes(n) && (
                <Text
                  style={{
                    fontSize: noteFontSize,
                    color: COLORS.noteText,
                    width: noteFontSize,
                    textAlign: 'center',  
                    fontWeight: '500',
                    backgroundColor: selectedValue === n ? COLORS.highlight : 'transparent',
                  }}
                >
                  {n}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
});

export default function Board() {
  const { state, selectCell } = useGame();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { grid, boxSize, selectedCell } = state;
  const gridSize = boxSize * boxSize;

  const maxBoardSize = Platform.OS === 'web'
    ? Math.min(windowWidth * 0.9, windowHeight * 0.55, 560)
    : Math.min(windowWidth - 24, windowHeight * 0.52);
  const boardSize = maxBoardSize;
  const cellSize = boardSize / gridSize;

  const selectedValue = useMemo(() => {
    if (!selectedCell) return 0;
    const [r, c] = selectedCell;
    return grid[r]?.[c]?.value ?? 0;
  }, [selectedCell, grid]);

  if (grid.length === 0) return null;

  return (
    <View
      style={[
        styles.board,
        {
          width: boardSize + 3,
          height: boardSize + 3,
        },
      ]}
    >
      {grid.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((cell, cIdx) => {
            const isSelected =
              selectedCell !== null &&
              selectedCell[0] === rIdx &&
              selectedCell[1] === cIdx;

            const isRelated =
              selectedCell !== null &&
              !isSelected &&
              (selectedCell[0] === rIdx ||
                selectedCell[1] === cIdx ||
                (Math.floor(selectedCell[0] / boxSize) ===
                  Math.floor(rIdx / boxSize) &&
                  Math.floor(selectedCell[1] / boxSize) ===
                    Math.floor(cIdx / boxSize)));

            const isSameValue =
              !isSelected &&
              selectedValue !== 0 &&
              cell.value === selectedValue;

            const isError =
              !cell.isGiven &&
              cell.value !== 0 &&
              cell.value !== cell.solution;

            return (
              <Cell
                key={cIdx}
                cell={cell}
                row={rIdx}
                col={cIdx}
                cellSize={cellSize}
                boxSize={boxSize}
                selectedValue={selectedValue}
                isSelected={isSelected}
                isRelated={isRelated}
                isSameValue={isSameValue}
                isError={isError}
                onPress={() => selectCell(rIdx, cIdx)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2.5,
    borderColor: COLORS.boxBorder,
    borderRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.border,
    borderBottomColor: COLORS.border,
  },
  cellText: {
    textAlign: 'center',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
