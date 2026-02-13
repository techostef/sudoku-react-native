import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { useColors } from "../context/ThemeContext";
import { SHADOWS } from "../constants/theme";
import {
  TOTAL_LEVELS,
} from "../utils/journey";

interface ICompletionOverlay {
  formatTime: (time: number) => string;
  handleNextLevel: () => void;
  handleBackToJourney: () => void;
  handleNewGame: () => void;
  isJourney: boolean;
}

const CompletionOverlay = ({ formatTime, handleNextLevel, handleBackToJourney, handleNewGame, isJourney }: ICompletionOverlay) => {
  const { state, timer } = useGame();
  const colors = useColors();
  return (
    <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
      <View style={[styles.completionCard, { backgroundColor: colors.surface }]}>
        <Ionicons name="trophy" size={64} color={colors.pencilActive} />
        <Text style={[styles.completionTitle, { color: colors.text }]}>Congratulations!</Text>
        <Text style={[styles.completionSubtitle, { color: colors.textSecondary }]}>You solved the puzzle!</Text>

        <View style={styles.completionStats}>
          <View style={styles.completionStatItem}>
            <Text style={[styles.completionStatValue, { color: colors.text }]}>
              {formatTime(timer)}
            </Text>
            <Text style={[styles.completionStatLabel, { color: colors.textMuted }]}>Time</Text>
          </View>
          <View style={[styles.completionDivider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.completionStatItem}>
            <Text style={[styles.completionStatValue, { color: colors.text }]}>{state.mistakes}</Text>
            <Text style={[styles.completionStatLabel, { color: colors.textMuted }]}>Mistakes</Text>
          </View>
          <View style={[styles.completionDivider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.completionStatItem}>
            <Text style={[styles.completionStatValue, { color: colors.text }]}>
              {state.difficulty.charAt(0).toUpperCase() +
                state.difficulty.slice(1)}
            </Text>
            <Text style={[styles.completionStatLabel, { color: colors.textMuted }]}>Difficulty</Text>
          </View>
        </View>

        {isJourney ? (
          <View style={styles.gameOverActions}>
            <TouchableOpacity
              style={[
                styles.newGameBtn,
                { backgroundColor: "#7C3AED", flex: 1 },
              ]}
              onPress={() => handleNextLevel()}
              activeOpacity={0.8}
            >
              <Text style={[styles.newGameBtnText, { color: colors.white }]}>
                {state.journeyLevel !== null && state.journeyLevel >= TOTAL_LEVELS
                  ? "Journey Complete!"
                  : "Next Level"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.newGameBtn, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={handleBackToJourney}
              activeOpacity={0.8}
            >
              <Text style={[styles.newGameBtnText, { color: colors.white }]}>Journey Map</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.newGameBtn, { backgroundColor: colors.primary }]}
            onPress={handleNewGame}
            activeOpacity={0.8}
          >
            <Text style={[styles.newGameBtnText, { color: colors.white }]}>New Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  // Completion overlay
  completionOverlay: {
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  completionCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 24,
    maxWidth: 400,
    width: "90%",
    ...SHADOWS.large,
  },
  completionTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
  },
  completionSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  completionStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 16,
  },
  completionStatItem: {
    alignItems: "center",
  },
  completionStatValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  completionStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  completionDivider: {
    width: 1,
    height: 32,
  },
  newGameBtn: {
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    ...SHADOWS.medium,
  },
  newGameBtnText: {
    fontSize: 17,
    fontWeight: "700",
  },
  gameOverActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    width: "100%",
  },
});

export default CompletionOverlay;
