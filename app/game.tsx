import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../src/context/GameContext';
import { COLORS, SHADOWS, DIFFICULTY_COLORS } from '../src/constants/theme';
import { getRandomDifficultyForLevel, TOTAL_LEVELS } from '../src/utils/journey';
import Board from '../src/components/Board';
import NumberPad from '../src/components/NumberPad';
import Timer from '../src/components/Timer';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function GameScreen() {
  const { state, togglePause, restart, startGame } = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [showRestartModal, setShowRestartModal] = useState(false);

  const isJourney = state.journeyLevel !== null;
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
    if (!isJourney || state.journeyLevel === null) return;
    const nextLevel = state.journeyLevel + 1;
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

  const diffColor = DIFFICULTY_COLORS[state.difficulty] || COLORS.primary;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, isWide && styles.topBarWide]}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={handleNewGame}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          {isJourney && (
            <View style={[styles.diffBadge, { backgroundColor: '#7C3AED' }]}>
              <Text style={styles.diffBadgeText}>
                LV.{state.journeyLevel}
              </Text>
            </View>
          )}
          <View style={[styles.diffBadge, { backgroundColor: diffColor }]}>
            <Text style={styles.diffBadgeText}>
              {state.difficulty.toUpperCase()}
            </Text>
          </View>
          {!isJourney && (
            <Text style={styles.modeText}>
              {state.boxSize}×{state.boxSize}
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
          <Ionicons name="close-circle-outline" size={16} color={COLORS.error} />
          <Text style={styles.statText}>
            Mistakes: <Text style={{ color: state.mistakes >= 3 ? COLORS.error : COLORS.text, fontWeight: '700' }}>{state.mistakes}/3</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={handleRestart}
          activeOpacity={0.6}
        >
          <Ionicons name="refresh" size={18} color={COLORS.primary} />
          <Text style={styles.restartText}>Restart</Text>
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
        {!state.isComplete && !state.isGameOver && <NumberPad />}
      </ScrollView>

      {/* Pause Overlay */}
      {state.isPaused && !state.isComplete && (
        <View style={[StyleSheet.absoluteFill, styles.pauseOverlay]}>
          <Ionicons name="pause-circle" size={80} color={COLORS.white} />
          <Text style={styles.pauseTitle}>Game Paused</Text>
          <Text style={styles.pauseSubtitle}>
            Time: {formatTime(state.timer)}
          </Text>
          <TouchableOpacity
            style={styles.resumeBtn}
            onPress={togglePause}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={24} color={COLORS.white} />
            <Text style={styles.resumeBtnText}>Resume</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Game Over Overlay */}
      {state.isGameOver && (
        <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
          <View style={styles.completionCard}>
            <Ionicons name="sad" size={64} color={COLORS.error} />
            <Text style={styles.completionTitle}>Game Over</Text>
            <Text style={styles.completionSubtitle}>
              You made 3 mistakes
            </Text>

            <View style={styles.completionStats}>
              <View style={styles.completionStatItem}>
                <Text style={styles.completionStatValue}>
                  {formatTime(state.timer)}
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
                  {state.difficulty.charAt(0).toUpperCase() +
                    state.difficulty.slice(1)}
                </Text>
                <Text style={styles.completionStatLabel}>Difficulty</Text>
              </View>
            </View>

            <View style={styles.gameOverActions}>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => { setShowRestartModal(false); restart(); }}
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
                  {isJourney ? 'Back to Journey' : 'New Game'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Completion Overlay */}
      {state.isComplete && (
        <View style={[StyleSheet.absoluteFill, styles.completionOverlay]}>
          <View style={styles.completionCard}>
            <Ionicons name="trophy" size={64} color={COLORS.pencilActive} />
            <Text style={styles.completionTitle}>Congratulations!</Text>
            <Text style={styles.completionSubtitle}>
              You solved the puzzle!
            </Text>

            <View style={styles.completionStats}>
              <View style={styles.completionStatItem}>
                <Text style={styles.completionStatValue}>
                  {formatTime(state.timer)}
                </Text>
                <Text style={styles.completionStatLabel}>Time</Text>
              </View>
              <View style={styles.completionDivider} />
              <View style={styles.completionStatItem}>
                <Text style={styles.completionStatValue}>
                  {state.mistakes}
                </Text>
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
                  style={[styles.newGameBtn, { backgroundColor: '#7C3AED', flex: 1 }]}
                  onPress={handleNextLevel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.newGameBtnText}>
                    {state.journeyLevel !== null && state.journeyLevel >= TOTAL_LEVELS
                      ? 'Journey Complete!'
                      : 'Next Level'}
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
      )}

      {/* Restart Confirmation Modal */}
      <Modal
        visible={showRestartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRestartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="refresh-circle" size={48} color={COLORS.primary} />
            <Text style={styles.modalTitle}>Restart Puzzle?</Text>
            <Text style={styles.modalDesc}>
              This will clear all your progress and reset the timer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowRestartModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmRestart}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Restart</Text>
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
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  topBtn: {
    padding: 6,
  },
  topCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  statsBarWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  restartText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  gameContent: {
    paddingVertical: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  gameContentWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  // Pause overlay
  pauseOverlay: {
    backgroundColor: COLORS.pauseOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 16,
  },
  pauseSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  resumeBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Completion overlay
  completionOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  completionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 24,
    maxWidth: 400,
    width: '90%',
    ...SHADOWS.large,
  },
  completionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
  },
  completionSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  completionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  completionStatItem: {
    alignItems: 'center',
  },
  completionStatValue: {
    fontSize: 20,
    fontWeight: '700',
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
    fontWeight: '700',
    color: COLORS.white,
  },
  gameOverActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.error,
    ...SHADOWS.medium,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginHorizontal: 32,
    maxWidth: 360,
    width: '90%',
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});
