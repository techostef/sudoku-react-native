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

interface IGameoverOverlayProps {
  isJourney: boolean;
  handleBackToJourney: () => void;
  handleNewGame: () => void;
  setShowRestartModal: (show: boolean) => void;
  formatTime: (seconds: number) => string;
}

const GameoverOverlay = ({ isJourney, handleBackToJourney, handleNewGame, setShowRestartModal, formatTime }: IGameoverOverlayProps) => {
  const { state, timer, restart } = useGame();
  return (
    <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
      <View style={styles.completionCard}>
        <Ionicons name="sad" size={64} color={COLORS.error} />
        <Text style={styles.completionTitle}>Game Over</Text>
        <Text style={styles.completionSubtitle}>You made 3 mistakes</Text>

        <View style={styles.completionStats}>
          <View style={styles.completionStatItem}>
            <Text style={styles.completionStatValue}>
              {formatTime(timer)}
            </Text>
            <Text style={styles.completionStatLabel}>Time</Text>
          </View>
          <View style={styles.completionDivider} />
          <View style={styles.completionStatItem}>
            <Text style={[styles.completionStatValue, { color: COLORS.error }]}>
              {state.mistakes}/3
            </Text>
            <Text style={styles.completionStatLabel}>Mistakes</Text>
          </View>
          <View style={styles.completionDivider} />
          <View style={styles.completionStatItem}>
            <Text style={styles.completionStatValue}>
              {state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)}
            </Text>
            <Text style={styles.completionStatLabel}>Difficulty</Text>
          </View>
        </View>

        <View style={styles.gameOverActions}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setShowRestartModal(false);
              restart();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color={COLORS.white} />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newGameBtn}
            onPress={isJourney ? handleBackToJourney : handleNewGame}
            activeOpacity={0.8}
          >
            <Text style={styles.newGameBtnText}>
              {isJourney ? "Back to Journey" : "New Game"}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 0,
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
  retryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    ...SHADOWS.medium,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});


export default GameoverOverlay;
