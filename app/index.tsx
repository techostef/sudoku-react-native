import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../src/context/GameContext';
import { BoxSize, Difficulty } from '../src/utils/sudoku';
import { SHADOWS, DIFFICULTY_COLORS, THEME_META } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';
import AdBanner from '../src/components/AdBanner';

const MODES: { value: BoxSize; label: string; desc: string }[] = [
  { value: 3, label: '3×3', desc: '9×9 grid' },
  { value: 4, label: '4×4', desc: '16×16 grid' },
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
  const [showThemeModal, setShowThemeModal] = useState(false);
  const { startGame } = useGame();
  const { colors, themeName, setTheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width > 600;

  const isMobile = Platform.OS === 'android' || Platform.OS === 'ios';

  const handleStart = () => {
    startGame(boxSize, difficulty);
    router.push('/game');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ paddingTop: insets.top }}
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[{ backgroundColor: colors.primary }]}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>SUDOKU</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Challenge your mind</Text>
        </View>

        <View style={[styles.section, isWide && styles.sectionWide]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Grid Size</Text>
          <View style={styles.modeRow}>
            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                style={[
                  styles.modeBtn,
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                  boxSize === mode.value && { borderColor: colors.primary, backgroundColor: colors.selected },
                ]}
                onPress={() => setBoxSize(mode.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modeBtnLabel,
                    { color: colors.textSecondary },
                    boxSize === mode.value && { color: colors.primary },
                  ]}
                >
                  {mode.label}
                </Text>
                <Text
                  style={[
                    styles.modeBtnDesc,
                    { color: colors.textMuted },
                    boxSize === mode.value && { color: colors.primaryLight },
                  ]}
                >
                  {mode.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, isWide && styles.sectionWide]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty</Text>
          <View style={styles.difficultyList}>
            {DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff.value}
                style={[
                  styles.diffBtn,
                  { backgroundColor: colors.surface, borderColor: colors.borderLight, borderLeftColor: colors.borderLight },
                  difficulty === diff.value && { borderColor: colors.primary, backgroundColor: colors.selected, borderLeftWidth: 4, borderLeftColor: DIFFICULTY_COLORS[diff.value] },
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
                        { color: colors.text },
                        difficulty === diff.value && { color: colors.primaryDark },
                      ]}
                    >
                      {diff.label}
                    </Text>
                    <Text style={[styles.diffBtnDesc, { color: colors.textMuted }]}>{diff.desc}</Text>
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
          style={[styles.startBtn, isWide && styles.startBtnWide, { backgroundColor: colors.primary }]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={24} color={colors.white} />
          <Text style={[styles.startBtnText, { color: colors.white }]}>Start Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.journeyBtn, isWide && styles.startBtnWide]}
          onPress={() => router.push('/journey')}
          activeOpacity={0.8}
        >
          <Ionicons name="map" size={22} color={colors.white} />
          <Text style={[styles.journeyBtnText, { color: colors.white }]}>Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dashboardBtn, isWide && styles.startBtnWide, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={() => router.push('/dashboard')}
          activeOpacity={0.8}
        >
          <Ionicons name="stats-chart" size={22} color={colors.primary} />
          <Text style={[styles.dashboardBtnText, { color: colors.primary }]}>Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeBtn, isWide && styles.startBtnWide, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}
          onPress={() => setShowThemeModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="color-palette" size={22} color={colors.text} />
          <Text style={[styles.themeBtnText, { color: colors.text }]}>Theme</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 110 }} />

        {/* Theme Picker Modal */}
        <Modal
          visible={showThemeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowThemeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Theme</Text>
              <View style={styles.themeList}>
                {THEME_META.map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    style={[
                      styles.themeOption,
                      { borderColor: colors.borderLight },
                      themeName === t.key && { borderColor: colors.primary, backgroundColor: colors.selected },
                    ]}
                    onPress={() => {
                      setTheme(t.key);
                      setShowThemeModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.themePreview, { backgroundColor: t.preview }]} />
                    <Text style={[styles.themeLabel, { color: colors.text }]}>{t.label}</Text>
                    {themeName === t.key && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowThemeModal(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCloseBtnText, { color: colors.white }]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {isMobile && <AdBanner />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.large,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 15,
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
    borderWidth: 2,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  modeBtnLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  modeBtnDesc: {
    fontSize: 11,
    marginTop: 2,
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
    borderWidth: 1.5,
    borderLeftWidth: 4,
    ...SHADOWS.small,
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
  },
  diffBtnDesc: {
    fontSize: 12,
    marginTop: 1,
  },
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
  startBtnWide: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  startBtnText: {
    fontSize: 20,
    fontWeight: '700',
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
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 2,
    ...SHADOWS.small,
  },
  dashboardBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1.5,
  },
  themeBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  adContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
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
    marginBottom: 20,
  },
  themeList: {
    width: '100%',
    gap: 10,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  themePreview: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  modalCloseBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalCloseBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
