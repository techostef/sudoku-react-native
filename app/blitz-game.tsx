import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SHADOWS } from '../src/constants/theme';
import { useColors } from '../src/context/ThemeContext';
import Board from '../src/components/Board';
import NumberPad from '../src/components/NumberPad';
import { useGame } from '../src/context/GameContext';
import { useLanguage } from '../src/context/LanguageContext';
import {
  BlitzDifficulty,
  loadBlitzBestScores,
  saveBlitzScore,
} from '../src/utils/storage';

const BLITZ_DURATION_SECONDS = 5 * 60;
const MISTAKE_PENALTY_SECONDS = 5;

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function BlitzGameScreen() {
  const { state, regenerateBlitzPuzzle, incBlitzScore } = useGame();
  const colors = useColors();
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width > 600;

  const [timeRemaining, setTimeRemaining] = useState(BLITZ_DURATION_SECONDS);
  const [bestScore, setBestScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [scorePulse] = useState(new Animated.Value(0));
  const [penaltyPulse] = useState(new Animated.Value(0));

  const prevMistakesRef = useRef(state.mistakes);
  const prevCompleteRef = useRef(state.isComplete);
  const startedAtRef = useRef<number>(0);

  // Difficulty maps to the BlitzDifficulty subset (easy/moderate/hard)
  const blitzDifficulty = state.difficulty as BlitzDifficulty;

  useEffect(() => {
    startedAtRef.current = Date.now();
    setTimeRemaining(BLITZ_DURATION_SECONDS);
    setFinished(false);
    prevMistakesRef.current = 0;
    prevCompleteRef.current = false;
  }, [state.gameStarted]);

  // Countdown ticker
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished, state.gameStarted]);

  // Handle time up
  useEffect(() => {
    if (timeRemaining <= 0 && !finished) {
      setFinished(true);
      saveBlitzScore(blitzDifficulty, state.blitzScore).then(setBestScore);
    }
  }, [timeRemaining, finished, blitzDifficulty, state.blitzScore]);

  // Detect new mistakes → apply time penalty + pulse
  useEffect(() => {
    if (state.mistakes > prevMistakesRef.current) {
      const delta = state.mistakes - prevMistakesRef.current;
      setTimeRemaining((t) => Math.max(0, t - delta * MISTAKE_PENALTY_SECONDS));
      Animated.sequence([
        Animated.timing(penaltyPulse, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(penaltyPulse, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    }
    prevMistakesRef.current = state.mistakes;
  }, [state.mistakes]);

  // Detect completion → bump score + regenerate
  useEffect(() => {
    if (state.isComplete && !prevCompleteRef.current) {
      incBlitzScore();
      Animated.sequence([
        Animated.timing(scorePulse, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(scorePulse, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
      // Brief delay so the user sees the completion before next puzzle.
      setTimeout(() => {
        regenerateBlitzPuzzle();
      }, 350);
    }
    prevCompleteRef.current = state.isComplete;
  }, [state.isComplete]);

  // Initial best-score read
  useEffect(() => {
    loadBlitzBestScores().then((scores) => setBestScore(scores[blitzDifficulty] ?? 0));
  }, [blitzDifficulty]);

  const handleBack = () => router.back();
  const handlePlayAgain = () => router.replace('/(tabs)/blitz' as any);

  const scoreScale = scorePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const penaltyOpacity = penaltyPulse;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.topBar, isWide && styles.topBarWide]}>
        <TouchableOpacity style={styles.topBtn} onPress={handleBack} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Ionicons name="flash" size={12} color={colors.white} />
            <Text style={[styles.badgeText, { color: colors.white }]}>BLITZ</Text>
          </View>
          <Text style={[styles.diffLabel, { color: colors.textSecondary }]}>
            {state.difficulty.toUpperCase()}
          </Text>
        </View>

        <View style={styles.topRight}>
          <Ionicons name="time-outline" size={18} color={timeRemaining < 30 ? colors.error : colors.textSecondary} />
          <Text
            style={[
              styles.timeText,
              { color: timeRemaining < 30 ? colors.error : colors.text },
            ]}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      <View style={[styles.statsBar, isWide && styles.statsBarWide]}>
        <View style={styles.statItem}>
          <Ionicons name="trophy-outline" size={16} color={colors.primary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {t.blitz.score}:{' '}
            <Animated.Text
              style={{
                color: colors.text,
                fontWeight: '800',
                fontSize: 16,
                transform: [{ scale: scoreScale }],
              }}
            >
              {state.blitzScore}
            </Animated.Text>
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star-outline" size={16} color={colors.primary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {t.blitz.bestScore}:{' '}
            <Text style={{ color: colors.text, fontWeight: '700' }}>{bestScore}</Text>
          </Text>
        </View>
        <Animated.View style={{ opacity: penaltyOpacity }}>
          <Text style={[styles.penaltyText, { color: colors.error }]}>{t.blitz.penalty}</Text>
        </Animated.View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.gameContent, isWide && styles.gameContentWide]}
        showsVerticalScrollIndicator={false}
      >
        <Board />
        {!finished && <NumberPad />}
      </ScrollView>

      {finished && (
        <View style={[styles.overlay, { backgroundColor: colors.pauseOverlay }]}>
          <View style={[styles.overlayCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="flash" size={48} color={colors.primary} />
            <Text style={[styles.overlayTitle, { color: colors.text }]}>{t.blitz.timeUp}</Text>
            <Text style={[styles.overlaySub, { color: colors.textSecondary }]}>
              {t.blitz.puzzlesSolved}
            </Text>
            <Text style={[styles.bigScore, { color: colors.primary }]}>{state.blitzScore}</Text>
            <Text style={[styles.bestText, { color: colors.textSecondary }]}>
              {t.blitz.bestScore}: <Text style={{ fontWeight: '800', color: colors.text }}>{bestScore}</Text>
            </Text>
            <View style={styles.overlayActions}>
              <TouchableOpacity
                style={[styles.overlayBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Text style={[styles.overlayBtnText, { color: colors.text }]}>{t.overlay.newGame}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.overlayBtn, { backgroundColor: colors.primary }]}
                onPress={handlePlayAgain}
                activeOpacity={0.7}
              >
                <Text style={[styles.overlayBtnText, { color: colors.white }]}>{t.blitz.playAgain}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBarWide: { maxWidth: 600, alignSelf: 'center', width: '100%' },
  topBtn: { padding: 6 },
  topCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  diffLabel: { fontSize: 12, fontWeight: '700' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'], minWidth: 56 },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  statsBarWide: { maxWidth: 600, alignSelf: 'center', width: '100%' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, fontWeight: '500' },
  penaltyText: { fontSize: 16, fontWeight: '800' },
  gameContent: { paddingVertical: 8, paddingBottom: 40, alignItems: 'center' },
  gameContentWide: { maxWidth: 600, alignSelf: 'center', width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  overlayCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 24,
    maxWidth: 400,
    width: '90%',
    ...SHADOWS.large,
  },
  overlayTitle: { fontSize: 26, fontWeight: '800', marginTop: 12 },
  overlaySub: { fontSize: 14, marginTop: 8 },
  bigScore: { fontSize: 64, fontWeight: '900', marginTop: 8 },
  bestText: { fontSize: 14, marginTop: 4 },
  overlayActions: { flexDirection: 'row', gap: 12, marginTop: 24, width: '100%' },
  overlayBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  overlayBtnText: { fontSize: 15, fontWeight: '700' },
});
