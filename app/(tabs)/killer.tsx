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
import { useGame } from '../../src/context/GameContext';
import { Difficulty } from '../../src/utils/sudoku';
import { SHADOWS, DIFFICULTY_COLORS } from '../../src/constants/theme';
import { useColors } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import AdBanner from '../../src/components/AdBanner';

type DiffKey = 'easy' | 'moderate' | 'hard' | 'expert' | 'extreme';
const DIFFICULTY_KEYS: { value: Difficulty; labelKey: DiffKey; descKey: `${DiffKey}Desc` }[] = [
  { value: 'easy', labelKey: 'easy', descKey: 'easyDesc' },
  { value: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc' },
  { value: 'hard', labelKey: 'hard', descKey: 'hardDesc' },
  { value: 'expert', labelKey: 'expert', descKey: 'expertDesc' },
  { value: 'extreme', labelKey: 'extreme', descKey: 'extremeDesc' },
];

export default function KillerTab() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { startGame } = useGame();
  const colors = useColors();
  const { t } = useLanguage();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width > 600;
  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  const handleStart = () => {
    startGame(3, difficulty, { mode: 'killer' });
    router.push('/game');
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
            <Ionicons name="skull" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t.killer.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.killer.description}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{t.killer.cageRule}</Text>
          </View>
        </View>

        <View style={[styles.section, isWide && styles.sectionWide]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.home.difficulty}</Text>
          <View style={styles.difficultyList}>
            {DIFFICULTY_KEYS.map((diff) => (
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
                  <View>
                    <Text
                      style={[
                        styles.diffBtnLabel,
                        { color: colors.text },
                        difficulty === diff.value && { color: colors.primaryDark },
                      ]}
                    >
                      {t.home[diff.labelKey]}
                    </Text>
                    <Text style={[styles.diffBtnDesc, { color: colors.textMuted }]}>
                      {t.home[diff.descKey]}
                    </Text>
                  </View>
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
          <Ionicons name="play" size={24} color={colors.white} />
          <Text style={[styles.startBtnText, { color: colors.white }]}>{t.home.startGame}</Text>
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
  infoCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 13, fontWeight: '500', flex: 1 },
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
  diffBtnDesc: { fontSize: 12, marginTop: 1 },
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
