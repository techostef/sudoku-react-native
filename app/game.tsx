import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SHADOWS, DIFFICULTY_COLORS } from "../src/constants/theme";
import { useColors } from "../src/context/ThemeContext";
import {
  getRandomDifficultyForLevel,
  TOTAL_LEVELS,
} from "../src/utils/journey";
import Board from "../src/components/Board";
import NumberPad from "../src/components/NumberPad";
import Timer from "../src/components/Timer";
import GameoverOverlay from "@/src/components/GameoverOverlay";
import PauseOverlay from "@/src/components/PauseOverlay";
import CompletionOverlay from "@/src/components/CompletionOverlay";
import { useGame } from "@/src/context/GameContext";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}


const useGameScreen = () => {
  const { state, restart, startGame } = useGame();
  const colors = useColors();
  const {
    journeyLevel,
    difficulty,
    mistakes,
    boxSize,
    isComplete,
    isPaused,
    isGameOver,
  } = state;

  const router = useRouter();
  const { width } = useWindowDimensions();
  const [showRestartModal, setShowRestartModal] = useState(false);

  const isJourney = journeyLevel !== null;
  const isWide = width > 600;

  const handleRestart = () => {
    setShowRestartModal(true);
  };

  const confirmRestart = () => {
    setShowRestartModal(false);
    restart();
  };

  const handleNewGame = () => {
    router.back();
  };

  const handleNextLevel = () => {
    if (!isJourney || journeyLevel === null) return;
    const nextLevel = journeyLevel + 1;
    if (nextLevel > TOTAL_LEVELS) {
      router.back();
      return;
    }
    const diff = getRandomDifficultyForLevel(nextLevel);
    startGame(3, diff, nextLevel);
  };

  const handleBackToJourney = () => {
    router.back();
  };

  const diffColor = DIFFICULTY_COLORS[difficulty] || colors.primary;

  return {
    colors,
    isWide,
    isJourney,
    difficulty,
    mistakes,
    boxSize,
    journeyLevel,
    isComplete,
    isGameOver,
    isPaused,

    // State gamescreen
    showRestartModal,
    handleRestart,
    confirmRestart,
    handleNewGame,
    handleNextLevel,
    handleBackToJourney,
    setShowRestartModal,
    diffColor,
  };
};

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const {
    colors,
    isWide,
    isJourney,
    difficulty,
    mistakes,
    isComplete,
    isGameOver,
    journeyLevel,
    boxSize,
    isPaused,

    showRestartModal,
    handleRestart,
    confirmRestart,
    handleNewGame,
    handleNextLevel,
    handleBackToJourney,
    setShowRestartModal,
    diffColor,
  } = useGameScreen();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, isWide && styles.topBarWide]}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={handleNewGame}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          {isJourney && (
            <View style={[styles.diffBadge, { backgroundColor: "#7C3AED" }]}>
              <Text style={[styles.diffBadgeText, { color: colors.white }]}>LV.{journeyLevel}</Text>
            </View>
          )}
          <View style={[styles.diffBadge, { backgroundColor: diffColor }]}>
            <Text style={[styles.diffBadgeText, { color: colors.white }]}>{difficulty.toUpperCase()}</Text>
          </View>
          {!isJourney && (
            <Text style={[styles.modeText, { color: colors.textSecondary }]}>
              {boxSize}×{boxSize}
            </Text>
          )}
        </View>

        <View style={styles.topRight}>
          <Timer />
        </View>
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, isWide && styles.statsBarWide]}>
        <View style={styles.statItem}>
          <Ionicons
            name="close-circle-outline"
            size={16}
            color={colors.error}
          />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            Mistakes:{" "}
            <Text
              style={{
                color: mistakes >= 3 ? colors.error : colors.text,
                fontWeight: "700",
              }}
            >
              {mistakes}/3
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.restartBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
          onPress={handleRestart}
          activeOpacity={0.6}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={[styles.restartText, { color: colors.primary }]}>Restart</Text>
        </TouchableOpacity>
      </View>

      {/* Game Content */}
      <ScrollView
        contentContainerStyle={[
          styles.gameContent,
          isWide && styles.gameContentWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Board />
        {!isComplete && !isGameOver && <NumberPad />}
      </ScrollView>

      {/* Pause Overlay */}
      {isPaused && !isComplete && <PauseOverlay formatTime={formatTime} />}

      {/* Game Over Overlay */}
      {isGameOver && (
        <GameoverOverlay
          isJourney={isJourney}
          handleBackToJourney={handleBackToJourney}
          handleNewGame={handleNewGame}
          setShowRestartModal={setShowRestartModal}
          formatTime={formatTime}
        />
      )}

      {/* Completion Overlay */}
      {isComplete && (
        <CompletionOverlay
          formatTime={formatTime}
          handleNextLevel={handleNextLevel}
          handleBackToJourney={handleBackToJourney}
          handleNewGame={handleNewGame}
          isJourney={isJourney}
        />
      )}

      {/* Restart Confirmation Modal */}
      <Modal
        visible={showRestartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRestartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="refresh-circle" size={48} color={colors.primary} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Restart Puzzle?</Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              This will clear all your progress and reset the timer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.borderLight }]}
                onPress={() => setShowRestartModal(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: colors.error }]}
                onPress={confirmRestart}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalConfirmText, { color: colors.white }]}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarWide: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  topBtn: {
    padding: 6,
  },
  topCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  statsBarWide: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: "500",
  },
  restartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  restartText: {
    fontSize: 13,
    fontWeight: "600",
  },
  gameContent: {
    paddingVertical: 8,
    paddingBottom: 40,
    alignItems: "center",
  },
  gameContentWide: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  // Pause overlay
  pauseOverlay: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
  },
  pauseSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  resumeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  resumeBtnText: {
    fontSize: 18,
    fontWeight: "700",
  },
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
  retryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    ...SHADOWS.medium,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginHorizontal: 32,
    maxWidth: 360,
    width: "90%",
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  modalDesc: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
