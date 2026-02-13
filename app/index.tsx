import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../src/context/GameContext';
import { BoxSize, Difficulty } from '../src/utils/sudoku';
import { COLORS, SHADOWS, DIFFICULTY_COLORS } from '../src/constants/theme';

const MODES: { value: BoxSize; label: string; desc: string }[] = [
  { value: 3, label: '3×3', desc: '9×9 grid' },
  { value: 4, label: '4×4', desc: '16×16 grid' },
  { value: 5, label: '5×5', desc: '25×25 grid' },
];

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Great for beginners' },
  { value: 'moderate', label: 'Moderate', desc: 'A fair challenge' },
  { value: 'hard', label: 'Hard', desc: 'For experienced players' },
  { value: 'expert', label: 'Expert', desc: 'Serious puzzlers only' },
  { value: 'extreme', label: 'Extreme', desc: 'Ultimate challenge' },
];

export default function StartMenu() {
  const [boxSize, setBoxSize] = useState<BoxSize>(3);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { startGame } = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width > 600;

  const handleStart = () => {
    startGame(boxSize, difficulty);
    router.push('/game');
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[
        styles.content,
        isWide && styles.contentWide,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="grid" size={40} color={COLORS.white} />
        </View>
        <Text style={styles.title}>SUDOKU</Text>
        <Text style={styles.subtitle}>Challenge your mind</Text>
      </View>

      <View style={[styles.section, isWide && styles.sectionWide]}>
        <Text style={styles.sectionTitle}>Grid Size</Text>
        <View style={styles.modeRow}>
          {MODES.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              style={[
                styles.modeBtn,
                boxSize === mode.value && styles.modeBtnActive,
              ]}
              onPress={() => setBoxSize(mode.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeBtnLabel,
                  boxSize === mode.value && styles.modeBtnLabelActive,
                ]}
              >
                {mode.label}
              </Text>
              <Text
                style={[
                  styles.modeBtnDesc,
                  boxSize === mode.value && styles.modeBtnDescActive,
                ]}
              >
                {mode.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, isWide && styles.sectionWide]}>
        <Text style={styles.sectionTitle}>Difficulty</Text>
        <View style={styles.difficultyList}>
          {DIFFICULTIES.map((diff) => (
            <TouchableOpacity
              key={diff.value}
              style={[
                styles.diffBtn,
                difficulty === diff.value && styles.diffBtnActive,
                difficulty === diff.value && {
                  borderLeftColor: DIFFICULTY_COLORS[diff.value],
                },
              ]}
              onPress={() => setDifficulty(diff.value)}
              activeOpacity={0.7}
            >
              <View style={styles.diffBtnContent}>
                <View
                  style={[
                    styles.diffDot,
                    { backgroundColor: DIFFICULTY_COLORS[diff.value] },
                  ]}
                />
                <View>
                  <Text
                    style={[
                      styles.diffBtnLabel,
                      difficulty === diff.value && styles.diffBtnLabelActive,
                    ]}
                  >
                    {diff.label}
                  </Text>
                  <Text style={styles.diffBtnDesc}>{diff.desc}</Text>
                </View>
              </View>
              {difficulty === diff.value && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={DIFFICULTY_COLORS[diff.value]}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startBtn, isWide && styles.startBtnWide]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={24} color={COLORS.white} />
        <Text style={styles.startBtnText}>Start Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.journeyBtn, isWide && styles.startBtnWide]}
        onPress={() => router.push('/journey')}
        activeOpacity={0.8}
      >
        <Ionicons name="map" size={22} color={COLORS.white} />
        <Text style={styles.journeyBtnText}>Journey</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.dashboardBtn, isWide && styles.startBtnWide]}
        onPress={() => router.push('/dashboard')}
        activeOpacity={0.8}
      >
        <Ionicons name="stats-chart" size={22} color={COLORS.primary} />
        <Text style={styles.dashboardBtnText}>Records</Text>
      </TouchableOpacity>

      <View style={{ height: insets.bottom + 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contentWide: {
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.large,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionWide: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  modeBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selected,
  },
  modeBtnLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modeBtnLabelActive: {
    color: COLORS.primary,
  },
  modeBtnDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modeBtnDescActive: {
    color: COLORS.primaryLight,
  },
  difficultyList: {
    gap: 8,
  },
  diffBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  diffBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.selected,
    borderLeftWidth: 4,
  },
  diffBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diffDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  diffBtnLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  diffBtnLabelActive: {
    color: COLORS.primaryDark,
  },
  diffBtnDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    ...SHADOWS.medium,
  },
  startBtnWide: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  startBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  journeyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    marginTop: 12,
    ...SHADOWS.medium,
  },
  journeyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginTop: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  dashboardBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
