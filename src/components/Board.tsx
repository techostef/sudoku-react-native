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
import { useSettings } from '../context/SettingsContext';
import { ThemeColors } from '../constants/theme';
import { getValueCell, isOnMainDiagonal, isOnAntiDiagonal } from '../utils/sudoku';
import { getCageEdges, getCageAnchor, getCageForCell } from '../utils/killerSudoku';

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
  cageEdges,
  cageColor,
  isCageAnchor,
  cageSum,
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
  cageEdges?: { top: boolean; right: boolean; bottom: boolean; left: boolean } | null;
  cageColor?: string;
  isCageAnchor?: boolean;
  cageSum?: number | null;
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
      {cageEdges && cageColor && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            right: 3,
            bottom: 3,
            borderColor: cageColor,
            borderStyle: 'dashed',
            borderTopWidth: cageEdges.top ? 1 : 0,
            borderRightWidth: cageEdges.right ? 1 : 0,
            borderBottomWidth: cageEdges.bottom ? 1 : 0,
            borderLeftWidth: cageEdges.left ? 1 : 0,
          }}
        />
      )}
      {isCageAnchor && cageSum !== null && cageSum !== undefined && (
        <Text
          style={{
            position: 'absolute',
            top: 1,
            left: 3,
            fontSize: Math.max(9, cellSize * 0.22),
            fontWeight: '700',
            color: colors.textSecondary,
          }}
        >
          {cageSum}
        </Text>
      )}
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
  const { settings } = useSettings();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { grid, boxSize, selectedCell, diagonal, cages, mode } = state;
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

  const showCages = mode === 'killer' && cages.length > 0;
  const cageColor = colors.boxBorder;

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

            const isOnSelectedDiag =
              diagonal &&
              selectedCell !== null &&
              (
                (isOnMainDiagonal(selectedCell[0], selectedCell[1]) && isOnMainDiagonal(rIdx, cIdx)) ||
                (isOnAntiDiagonal(selectedCell[0], selectedCell[1], gridSize) && isOnAntiDiagonal(rIdx, cIdx, gridSize))
              );

            const isRelated =
              settings.highlightRelated &&
              selectedCell !== null &&
              !isSelected &&
              (selectedCell[0] === rIdx ||
                selectedCell[1] === cIdx ||
                (Math.floor(selectedCell[0] / boxSize) ===
                  Math.floor(rIdx / boxSize) &&
                  Math.floor(selectedCell[1] / boxSize) ===
                    Math.floor(cIdx / boxSize)) ||
                isOnSelectedDiag);

            const isSameValue =
              !isSelected &&
              selectedValue !== 0 &&
              cell.value === selectedValue;

            const isError =
              !cell.isGiven &&
              cell.value !== 0 &&
              cell.value !== cell.solution;

            const cage = showCages ? getCageForCell(rIdx, cIdx, cages) : null;
            const cageEdges = cage ? getCageEdges(rIdx, cIdx, cage) : null;
            const cageAnchor = cage ? getCageAnchor(cage) : null;
            const isCageAnchor =
              cageAnchor !== null && cageAnchor[0] === rIdx && cageAnchor[1] === cIdx;

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
                cageEdges={cageEdges}
                cageColor={cageColor}
                isCageAnchor={isCageAnchor}
                cageSum={isCageAnchor && cage ? cage.sum : null}
              />
            );
          })}
        </View>
      ))}

      {diagonal && (
        <>
          <View
            pointerEvents="none"
            style={[
              staticStyles.diagonalLine,
              {
                width: boardSize * Math.SQRT2,
                top: boardSize / 2,
                left: -boardSize * (Math.SQRT2 - 1) / 2,
                transform: [{ rotate: '45deg' }],
                backgroundColor: colors.primary,
              },
            ]}
          />
          <View
            pointerEvents="none"
            style={[
              staticStyles.diagonalLine,
              {
                width: boardSize * Math.SQRT2,
                top: boardSize / 2,
                left: -boardSize * (Math.SQRT2 - 1) / 2,
                transform: [{ rotate: '-45deg' }],
                backgroundColor: colors.primary,
              },
            ]}
          />
        </>
      )}
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
  diagonalLine: {
    position: 'absolute',
    height: 1.5,
    opacity: 0.35,
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
