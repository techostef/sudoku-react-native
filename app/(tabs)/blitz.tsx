import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../../src/context/GameContext';
import { SHADOWS, DIFFICULTY_COLORS } from '../../src/constants/theme';
import { useColors } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { BlitzDifficulty, loadBlitzBestScores, BlitzBestScores } from '../../src/utils/storage';
import AdBanner from '../../src/components/AdBanner';

const BLITZ_DIFFICULTIES: { value: BlitzDifficulty; labelKey: 'easy' | 'moderate' | 'hard' }[] = [
  { value: 'easy', labelKey: 'easy' },
  { value: 'moderate', labelKey: 'moderate' },
  { value: 'hard', labelKey: 'hard' },
];

export default function BlitzTab() {
  const [difficulty, setDifficulty] = useState<BlitzDifficulty>('easy');
  const [bestScores, setBestScores] = useState<BlitzBestScores>({ easy: 0, moderate: 0, hard: 0 });
  const { startGame } = useGame();
  const colors = useColors();
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width > 600;
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  useFocusEffect(
    React.useCallback(() => {
      loadBlitzBestScores().then(setBestScores);
    }, [])
  );

  const handleStart = () => {
    startGame(3, difficulty, { mode: 'classic', isBlitz: true });
    router.push('/blitz-game' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ paddingTop: insets.top }}
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
            <Ionicons name="flash" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t.blitz.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.blitz.description}</Text>
        </View>

        <View style={[styles.bestCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.bestTitle, { color: colors.textSecondary }]}>{t.blitz.bestScore}</Text>
          <View style={styles.bestRow}>
            {BLITZ_DIFFICULTIES.map((d) => (
              <View key={d.value} style={styles.bestItem}>
                <Text style={[styles.bestDiffLabel, { color: DIFFICULTY_COLORS[d.value] }]}>
                  {t.home[d.labelKey].toUpperCase()}
                </Text>
                <Text style={[styles.bestValue, { color: colors.text }]}>{bestScores[d.value]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, isWide && styles.sectionWide]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.home.difficulty}</Text>
          <View style={styles.difficultyList}>
            {BLITZ_DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff.value}
                style={[
                  styles.diffBtn,
                  { backgroundColor: colors.surface, borderColor: colors.borderLight, borderLeftColor: colors.borderLight },
                  difficulty === diff.value && {
                    borderColor: colors.primary,
                    backgroundColor: colors.selected,
                    borderLeftWidth: 4,
                    borderLeftColor: DIFFICULTY_COLORS[diff.value],
                  },
                ]}
                onPress={() => setDifficulty(diff.value)}
                activeOpacity={0.7}
              >
                <View style={styles.diffBtnContent}>
                  <View style={[styles.diffDot, { backgroundColor: DIFFICULTY_COLORS[diff.value] }]} />
                  <Text
                    style={[
                      styles.diffBtnLabel,
                      { color: colors.text },
                      difficulty === diff.value && { color: colors.primaryDark },
                    ]}
                  >
                    {t.home[diff.labelKey]}
                  </Text>
                </View>
                {difficulty === diff.value && (
                  <Ionicons name="checkmark-circle" size={22} color={DIFFICULTY_COLORS[diff.value]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.startBtn, isWide && styles.startBtnWide, { backgroundColor: colors.primary }]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={24} color={colors.white} />
          <Text style={[styles.startBtnText, { color: colors.white }]}>{t.blitz.start}</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 140 }} />
      </ScrollView>
      {isMobile && <AdBanner />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  contentWide: { maxWidth: 560, alignSelf: 'center', width: '100%' },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 1.5 },
  subtitle: { fontSize: 14, marginTop: 6, textAlign: 'center', paddingHorizontal: 16 },
  bestCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  bestTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  bestRow: { flexDirection: 'row', justifyContent: 'space-around' },
  bestItem: { alignItems: 'center' },
  bestDiffLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  bestValue: { fontSize: 24, fontWeight: '800' },
  section: { marginBottom: 20 },
  sectionWide: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  difficultyList: { gap: 8 },
  diffBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  diffBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  diffDot: { width: 10, height: 10, borderRadius: 5 },
  diffBtnLabel: { fontSize: 16, fontWeight: '600' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
    ...SHADOWS.medium,
  },
  startBtnWide: { maxWidth: 400, alignSelf: 'center', width: '100%' },
  startBtnText: { fontSize: 20, fontWeight: '700' },
});
