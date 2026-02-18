import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useGame, CellData } from '../context/GameContext';
import { useColors } from '../context/ThemeContext';
import { ThemeColors } from '../constants/theme';
import { getValueCell } from '../utils/sudoku';

const Cell = React.memo(function Cell({
  fontSize,
  noteSize,
  noteFontSize,
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
  colors,
}: {
  fontSize: number;
  noteSize: number;
  noteFontSize: number;
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
  colors: ThemeColors;
}) {
  const gridSize = boxSize * boxSize;
  const isLeftBoxBorder = col % boxSize === 0 && col % boxSize !== 0;
  const isTopBoxBorder = row % boxSize === 0 && row % boxSize !== 0;
  const isRightBoxBorder = (col + 1) % boxSize === 0 && col < gridSize - 1;
  const isBottomBoxBorder = (row + 1) % boxSize === 0 && row < gridSize - 1;

  let bgColor = colors.surface;
  if (isSelected) bgColor = colors.highlight;
  else if (isSameValue) bgColor = colors.highlight;
  else if (isRelated) bgColor = colors.related;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        staticStyles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: bgColor,
          borderLeftWidth: isLeftBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderRightWidth: isRightBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderTopWidth: isTopBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderBottomWidth: isBottomBoxBorder ? 2.5 : StyleSheet.hairlineWidth,
          borderLeftColor: isLeftBoxBorder ? colors.boxBorder : colors.border,
          borderRightColor: isRightBoxBorder ? colors.boxBorder : colors.border,
          borderTopColor: isTopBoxBorder ? colors.boxBorder : colors.border,
          borderBottomColor: isBottomBoxBorder ? colors.boxBorder : colors.border,
        },
        isError && { backgroundColor: colors.errorBg },
      ]}
    >
      {cell.value !== 0 ? (
        <Text
          style={[
            staticStyles.cellText,
            {
              fontSize,
              color: cell.isGiven
                ? colors.given
                : cell.isLocked
                ? colors.given
                : isError
                ? colors.error
                : colors.userInput,
              fontWeight: cell.isGiven || cell.isLocked ? '700' : '500',
            },
          ]}
        >
          {cell.value}
        </Text>
      ) : cell.notes.length > 0 ? (
        <View style={[staticStyles.notesContainer, { width: cellSize - 2, height: cellSize - 2 }]}>
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
              {cell.notes.includes(getValueCell(n) as any) && (
                <Text
                  style={{
                    fontSize: noteFontSize,
                    color: colors.noteText,
                    width: noteFontSize,
                    textAlign: 'center',  
                    fontWeight: '500',
                    backgroundColor: selectedValue === n ? colors.highlight : 'transparent',
                  }}
                >
                  {getValueCell(n)}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}, ({selectedValue: prevSelectedValue, ...prevProps}, {selectedValue: nextSelectedValue, ...nextProps}) => {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    if (prevSelectedValue !== nextSelectedValue) {
      if (prevProps.cell.notes.includes(prevSelectedValue) || prevProps.cell.notes.includes(nextSelectedValue)) {
        return false;
      }
      if (nextProps.cell.notes.includes(prevSelectedValue) || nextProps.cell.notes.includes(nextSelectedValue)) {
        return false;
      }
      return true;
    }
    return true
  }
  return false;
});

export default function Board() {
  const { state, selectCell } = useGame();
  const colors = useColors();
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

  const handlePressCell = useCallback(
    (row: number, col: number) => {
      selectCell(row, col);
    },
    [selectCell]
  );
  
  const fontSize = cellSize * (gridSize <= 9 ? 0.7 : gridSize <= 16 ? 0.8 : 0.3);
  const noteSize = cellSize / (boxSize + (gridSize <= 9 ? 0.5 : 0.7));
  const noteFontSize = noteSize * 0.9

  if (grid.length === 0) return null;

  return (
    <View
      style={[
        staticStyles.board,
        {
          width: boardSize + 3,
          height: boardSize + 3,
          borderColor: colors.boxBorder,
        },
      ]}
    >
      {grid.map((row, rIdx) => (
        <View key={rIdx} style={staticStyles.row}>
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
                fontSize={fontSize}
                noteSize={noteSize}
                noteFontSize={noteFontSize}
                key={`${rIdx}-${cIdx}`}
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
                onPress={useCallback(() => handlePressCell(rIdx, cIdx), [handlePressCell, rIdx, cIdx])}
                colors={colors}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  board: {
    borderWidth: 2.5,
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
