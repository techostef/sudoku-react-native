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
import { useLanguage } from '../src/context/LanguageContext';
import { LANGUAGE_META } from '../src/i18n/translations';
import AdBanner from '../src/components/AdBanner';

const MODES: { value: BoxSize; label: string; descKey: 'grid9x9' | 'grid16x16' }[] = [
  { value: 3, label: '3×3', descKey: 'grid9x9' },
  { value: 4, label: '4×4', descKey: 'grid16x16' },
];

type DiffKey = 'easy' | 'moderate' | 'hard' | 'expert' | 'extreme';
const DIFFICULTY_KEYS: { value: Difficulty; labelKey: DiffKey; descKey: `${DiffKey}Desc` }[] = [
  { value: 'easy', labelKey: 'easy', descKey: 'easyDesc' },
  { value: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc' },
  { value: 'hard', labelKey: 'hard', descKey: 'hardDesc' },
  { value: 'expert', labelKey: 'expert', descKey: 'expertDesc' },
  { value: 'extreme', labelKey: 'extreme', descKey: 'extremeDesc' },
];

export default function StartMenu() {
  const [boxSize, setBoxSize] = useState<BoxSize>(3);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { startGame } = useGame();
  const { colors, themeName, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
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
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.home.subtitle}</Text>
        </View>

        <View style={[styles.section, isWide && styles.sectionWide]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.home.gridSize}</Text>
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
                  {t.home[mode.descKey]}
                </Text>
              </TouchableOpacity>
            ))}
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
                      {t.home[diff.labelKey]}
                    </Text>
                    <Text style={[styles.diffBtnDesc, { color: colors.textMuted }]}>{t.home[diff.descKey]}</Text>
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
          <Text style={[styles.startBtnText, { color: colors.white }]}>{t.home.startGame}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.journeyBtn, isWide && styles.startBtnWide]}
          onPress={() => router.push('/journey')}
          activeOpacity={0.8}
        >
          <Ionicons name="map" size={22} color={colors.white} />
          <Text style={[styles.journeyBtnText, { color: colors.white }]}>{t.home.journey}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dashboardBtn, isWide && styles.startBtnWide, { backgroundColor: colors.surface, borderColor: colors.primary }]}
          onPress={() => router.push('/dashboard')}
          activeOpacity={0.8}
        >
          <Ionicons name="stats-chart" size={22} color={colors.primary} />
          <Text style={[styles.dashboardBtnText, { color: colors.primary }]}>{t.home.records}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeBtn, isWide && styles.startBtnWide, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}
          onPress={() => setShowThemeModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="color-palette" size={22} color={colors.text} />
          <Text style={[styles.themeBtnText, { color: colors.text }]}>{t.home.theme}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeBtn, isWide && styles.startBtnWide, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight, marginTop: 12 }]}
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="language" size={22} color={colors.text} />
          <Text style={[styles.themeBtnText, { color: colors.text }]}>{t.home.language}</Text>
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.home.chooseTheme}</Text>
              <View style={styles.themeList}>
                {THEME_META.map((theme) => (
                  <TouchableOpacity
                    key={theme.key}
                    style={[
                      styles.themeOption,
                      { borderColor: colors.borderLight },
                      themeName === theme.key && { borderColor: colors.primary, backgroundColor: colors.selected },
                    ]}
                    onPress={() => {
                      setTheme(theme.key);
                      setShowThemeModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.themePreview, { backgroundColor: theme.preview }]} />
                    <Text style={[styles.themeLabel, { color: colors.text }]}>{theme.label}</Text>
                    {themeName === theme.key && (
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
                <Text style={[styles.modalCloseBtnText, { color: colors.white }]}>{t.home.done}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t.home.chooseLanguage}</Text>
            <View style={styles.themeList}>
              {LANGUAGE_META.map((lang) => (
                <TouchableOpacity
                  key={lang.key}
                  style={[
                    styles.themeOption,
                    { borderColor: colors.borderLight },
                    language === lang.key && { borderColor: colors.primary, backgroundColor: colors.selected },
                  ]}
                  onPress={() => {
                    setLanguage(lang.key);
                    setShowLanguageModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={[styles.themeLabel, { color: colors.text }]}>{lang.label}</Text>
                  {language === lang.key && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowLanguageModal(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.modalCloseBtnText, { color: colors.white }]}>{t.home.done}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  langFlag: {
    fontSize: 24,
  },
});
