import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../src/context/GameContext';
import { COLORS, SHADOWS, DIFFICULTY_COLORS } from '../src/constants/theme';
import {
  JourneyProgress,
  JourneyLevel,
  loadJourneyProgress,
  resetJourneyProgress,
  getRandomDifficultyForLevel,
  TOTAL_LEVELS,
} from '../src/utils/journey';
import { Difficulty } from '../src/utils/sudoku';

interface ZoneDef {
  label: string;
  range: readonly [number, number];
  color: string;
}

const TIER_COLORS = {
  beginner: DIFFICULTY_COLORS.easy,
  novice: DIFFICULTY_COLORS.moderate,
  intermediate: '#0EA5E9',
  advanced: DIFFICULTY_COLORS.hard,
  veteran: '#F97316',
  master: DIFFICULTY_COLORS.expert,
  grandmaster: DIFFICULTY_COLORS.extreme,
};

const ZONE_NAMES: { tier: string; names: string[]; color: string }[] = [
  { tier: 'Beginner', color: TIER_COLORS.beginner, names: ['Village', 'Meadow', 'Forest', 'Lake', 'Valley'] },
  { tier: 'Novice', color: TIER_COLORS.novice, names: ['River', 'Hills', 'Coast', 'Plains', 'Grove'] },
  { tier: 'Intermediate', color: TIER_COLORS.intermediate, names: ['Cave', 'Desert', 'Ruins', 'Canyon', 'Marsh'] },
  { tier: 'Advanced', color: TIER_COLORS.advanced, names: ['Mountain', 'Volcano', 'Glacier', 'Storm Peak', 'Citadel'] },
  { tier: 'Veteran', color: TIER_COLORS.veteran, names: ['Fortress', 'Dungeon', 'Wasteland', 'Inferno', 'Abyss', 'Tundra', 'Labyrinth', 'Shadow Keep', 'Iron Gate', 'Thunder Ridge'] },
  { tier: 'Master', color: TIER_COLORS.master, names: ['Dragon Lair', 'Dark Tower', 'Obsidian Forge', 'Blood Moon', 'Phantom Isle', 'Crystal Depths', 'War Summit', 'Doom Bridge', 'Ember Throne', 'Lost Temple'] },
  { tier: 'Grandmaster', color: TIER_COLORS.grandmaster, names: ['Chaos Realm', 'Void Gate', 'Eternal Spire', 'Astral Rift', 'Celestial Peak', 'Oblivion', 'Infinity Core', 'Omega Sanctum', 'Genesis Flame', 'Final Horizon'] },
];

function buildZones(): ZoneDef[] {
  const zones: ZoneDef[] = [];
  let start = 1;
  for (const tier of ZONE_NAMES) {
    for (const name of tier.names) {
      const end = start + 9;
      zones.push({
        label: `${tier.tier} ${name}`,
        range: [start, end] as const,
        color: tier.color,
      });
      start = end + 1;
    }
  }
  return zones;
}

const ALL_ZONES = buildZones();

function getDifficultyLabel(level: number): string {
  const zone = ALL_ZONES.find((z) => level >= z.range[0] && level <= z.range[1]);
  if (!zone) return 'Grandmaster';
  return zone.label.split(' ')[0];
}

function getZoneColor(level: number): string {
  const zone = ALL_ZONES.find((z) => level >= z.range[0] && level <= z.range[1]);
  return zone?.color ?? DIFFICULTY_COLORS.extreme;
}

function renderStars(stars: number | undefined) {
  const s = stars ?? 0;
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3].map((i) => (
        <Ionicons
          key={i}
          name={i <= s ? 'star' : 'star-outline'}
          size={12}
          color={i <= s ? '#FBBF24' : COLORS.textMuted}
        />
      ))}
    </View>
  );
}

export default function JourneyScreen() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<JourneyLevel | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [randomDifficulty, setRandomDifficulty] = useState<Difficulty>('easy');
  const { startGame } = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width > 600;

  const columns = isWide ? 8 : 5;
  const gap = 10;
  const horizontalPadding = 20;
  const containerWidth = isWide ? 560 : width;
  const cellSize = (containerWidth - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  useFocusEffect(
    useCallback(() => {
      loadJourneyProgress().then(setProgress);
    }, [])
  );

  const handleLevelPress = (lvl: JourneyLevel) => {
    if (!lvl.unlocked) return;
    const diff = getRandomDifficultyForLevel(lvl.level);
    setRandomDifficulty(diff);
    setSelectedLevel(lvl);
  };

  const handlePlay = () => {
    if (!selectedLevel) return;
    startGame(3, randomDifficulty, selectedLevel.level);
    setSelectedLevel(null);
    router.push('/game');
  };

  const handleReroll = () => {
    if (!selectedLevel) return;
    const diff = getRandomDifficultyForLevel(selectedLevel.level);
    setRandomDifficulty(diff);
  };

  const handleReset = async () => {
    const newProgress = await resetJourneyProgress();
    setProgress(newProgress);
    setShowResetModal(false);
  };

  if (!progress) return null;

  const completedCount = progress.levels.filter((l) => l.completed).length;
  const totalStars = progress.levels.reduce((sum, l) => sum + (l.stars ?? 0), 0);
  const maxStars = TOTAL_LEVELS * 3;

  const zones = ALL_ZONES;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, isWide && styles.headerWide]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Journey</Text>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setShowResetModal(true)}
          activeOpacity={0.6}
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View style={[styles.summaryRow, isWide && styles.summaryRowWide]}>
        <View style={styles.summaryCard}>
          <Ionicons name="flag" size={18} color={COLORS.primary} />
          <Text style={styles.summaryValue}>{completedCount}/{TOTAL_LEVELS}</Text>
          <Text style={styles.summaryLabel}>Levels</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="star" size={18} color="#FBBF24" />
          <Text style={styles.summaryValue}>{totalStars}/{maxStars}</Text>
          <Text style={styles.summaryLabel}>Stars</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="trophy" size={18} color={COLORS.success} />
          <Text style={styles.summaryValue}>{getDifficultyLabel(completedCount + 1)}</Text>
          <Text style={styles.summaryLabel}>Rank</Text>
        </View>
      </View>

      {/* Level Grid */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.scrollContentWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {zones.map((zone) => {
          const zoneLevels = progress.levels.filter(
            (l) => l.level >= zone.range[0] && l.level <= zone.range[1]
          );
          const allCompleted = zoneLevels.every((l) => l.completed);

          return (
            <View key={zone.label} style={styles.zoneSection}>
              <View style={styles.zoneHeader}>
                <View style={[styles.zoneDot, { backgroundColor: zone.color }]} />
                <Text style={styles.zoneTitle}>{zone.label}</Text>
                {allCompleted && (
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                )}
              </View>
              <View style={styles.levelGrid}>
                {zoneLevels.map((lvl) => {
                  const isUnlocked = lvl.unlocked;
                  const isCompleted = lvl.completed;
                  const levelColor = getZoneColor(lvl.level);

                  return (
                    <TouchableOpacity
                      key={lvl.level}
                      style={[
                        styles.levelCell,
                        {
                          width: cellSize,
                          height: cellSize + 14,
                        },
                        isCompleted && styles.levelCellCompleted,
                        isCompleted && { borderColor: levelColor },
                        !isUnlocked && styles.levelCellLocked,
                      ]}
                      onPress={() => handleLevelPress(lvl)}
                      activeOpacity={isUnlocked ? 0.7 : 1}
                      disabled={!isUnlocked}
                    >
                      {!isUnlocked ? (
                        <Ionicons name="lock-closed" size={20} color={COLORS.textMuted} />
                      ) : (
                        <>
                          <Text
                            style={[
                              styles.levelNumber,
                              isCompleted && { color: levelColor },
                            ]}
                          >
                            {lvl.level}
                          </Text>
                          {isCompleted ? (
                            renderStars(lvl.stars)
                          ) : (
                            <View style={[styles.playDot, { backgroundColor: levelColor }]} />
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      {/* Level Detail Modal */}
      <Modal
        visible={selectedLevel !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedLevel(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.levelBadge, { backgroundColor: getZoneColor(selectedLevel?.level ?? 1) }]}>
              <Text style={styles.levelBadgeText}>Level {selectedLevel?.level}</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              {getDifficultyLabel(selectedLevel?.level ?? 1)} Zone
            </Text>

            <View style={styles.difficultyPreview}>
              <Text style={styles.difficultyPreviewLabel}>Difficulty</Text>
              <View style={[styles.difficultyPill, { backgroundColor: DIFFICULTY_COLORS[randomDifficulty] }]}>
                <Text style={styles.difficultyPillText}>
                  {randomDifficulty.charAt(0).toUpperCase() + randomDifficulty.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.modalHint}>
              Difficulty is randomly assigned based on your level progression
            </Text>

            <TouchableOpacity
              style={styles.rerollBtn}
              onPress={handleReroll}
              activeOpacity={0.7}
            >
              <Ionicons name="dice" size={18} color={COLORS.primary} />
              <Text style={styles.rerollText}>Re-roll Difficulty</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSelectedLevel(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPlayBtn, { backgroundColor: getZoneColor(selectedLevel?.level ?? 1) }]}
                onPress={handlePlay}
                activeOpacity={0.7}
              >
                <Ionicons name="play" size={18} color={COLORS.white} />
                <Text style={styles.modalPlayText}>Play</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="warning" size={48} color={COLORS.error} />
            <Text style={styles.resetTitle}>Reset Journey?</Text>
            <Text style={styles.resetDesc}>
              This will reset all your journey progress. All unlocked levels and stars will be lost.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowResetModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalResetConfirmBtn}
                onPress={handleReset}
                activeOpacity={0.7}
              >
                <Text style={styles.modalPlayText}>Reset</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  backBtn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  resetBtn: {
    padding: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  summaryRowWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 3,
    ...SHADOWS.small,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scrollContentWide: {
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },
  zoneSection: {
    marginBottom: 20,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  zoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  zoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  levelCell: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  levelCellCompleted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  levelCellLocked: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
    marginTop: 2,
  },
  playDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  // Modals
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
  levelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  difficultyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  difficultyPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  difficultyPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  rerollBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  rerollText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  modalPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalPlayText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalResetConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
  },
  resetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  resetDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
