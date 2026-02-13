import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { COLORS, SHADOWS } from "../constants/theme";
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
  return (
    <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
      <View style={styles.completionCard}>
        <Ionicons name="trophy" size={64} color={COLORS.pencilActive} />
        <Text style={styles.completionTitle}>Congratulations!</Text>
        <Text style={styles.completionSubtitle}>You solved the puzzle!</Text>

        <View style={styles.completionStats}>
          <View style={styles.completionStatItem}>
            <Text style={styles.completionStatValue}>
              {formatTime(timer)}
            </Text>
            <Text style={styles.completionStatLabel}>Time</Text>
          </View>
          <View style={styles.completionDivider} />
          <View style={styles.completionStatItem}>
            <Text style={styles.completionStatValue}>{state.mistakes}</Text>
            <Text style={styles.completionStatLabel}>Mistakes</Text>
          </View>
          <View style={styles.completionDivider} />
          <View style={styles.completionStatItem}>
            <Text style={styles.completionStatValue}>
              {state.difficulty.charAt(0).toUpperCase() +
                state.difficulty.slice(1)}
            </Text>
            <Text style={styles.completionStatLabel}>Difficulty</Text>
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
              <Text style={styles.newGameBtnText}>
                {state.journeyLevel !== null && state.journeyLevel >= TOTAL_LEVELS
                  ? "Journey Complete!"
                  : "Next Level"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.newGameBtn, { flex: 1 }]}
              onPress={handleBackToJourney}
              activeOpacity={0.8}
            >
              <Text style={styles.newGameBtnText}>Journey Map</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.newGameBtn}
            onPress={handleNewGame}
            activeOpacity={0.8}
          >
            <Text style={styles.newGameBtnText}>New Game</Text>
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
    backgroundColor: COLORS.surface,
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
    color: COLORS.text,
    marginTop: 12,
  },
  completionSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
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
    color: COLORS.text,
  },
  completionStatLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  completionDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.borderLight,
  },
  newGameBtn: {
    marginTop: 28,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  newGameBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
  gameOverActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    width: "100%",
  },
});

export default CompletionOverlay;
