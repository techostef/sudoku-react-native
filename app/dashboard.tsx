import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, DIFFICULTY_COLORS } from '../src/constants/theme';
import { GameRecord, loadRecords, clearRecords } from '../src/utils/storage';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const mon = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hr = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${mon}/${year} ${hr}:${min}`;
}

export default function DashboardScreen() {
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width > 600;

  useFocusEffect(
    useCallback(() => {
      loadRecords().then(setRecords);
    }, [])
  );

  const handleClear = async () => {
    await clearRecords();
    setRecords([]);
    setShowClearModal(false);
  };

  const wins = records.filter((r) => r.completed).length;
  const losses = records.filter((r) => !r.completed).length;
  const bestTime =
    records.filter((r) => r.completed).length > 0
      ? Math.min(...records.filter((r) => r.completed).map((r) => r.time))
      : null;

  const renderRecord = ({ item, index }: { item: GameRecord; index: number }) => {
    const diffColor = DIFFICULTY_COLORS[item.difficulty] || COLORS.primary;
    return (
      <View style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <View style={styles.recordLeft}>
            <Text style={styles.recordIndex}>#{index + 1}</Text>
            <View style={[styles.resultBadge, { backgroundColor: item.completed ? COLORS.success : COLORS.error }]}>
              <Ionicons
                name={item.completed ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={COLORS.white}
              />
              <Text style={styles.resultText}>
                {item.completed ? 'Won' : 'Lost'}
              </Text>
            </View>
          </View>
          <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.recordDetails}>
          <View style={styles.recordDetail}>
            <Text style={styles.detailLabel}>Grid</Text>
            <Text style={styles.detailValue}>
              {item.boxSize}×{item.boxSize}
            </Text>
          </View>
          <View style={styles.recordDetailDivider} />
          <View style={styles.recordDetail}>
            <Text style={styles.detailLabel}>Difficulty</Text>
            <View style={[styles.diffPill, { backgroundColor: diffColor }]}>
              <Text style={styles.diffPillText}>
                {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.recordDetailDivider} />
          <View style={styles.recordDetail}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formatTime(item.time)}</Text>
          </View>
          <View style={styles.recordDetailDivider} />
          <View style={styles.recordDetail}>
            <Text style={styles.detailLabel}>Mistakes</Text>
            <Text style={[styles.detailValue, item.mistakes >= 3 && { color: COLORS.error }]}>
              {item.mistakes}/3
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
        <Text style={styles.title}>Records</Text>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => records.length > 0 && setShowClearModal(true)}
          activeOpacity={0.6}
          disabled={records.length === 0}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={records.length > 0 ? COLORS.error : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
        <View style={styles.statCard}>
          <Ionicons name="game-controller" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>{records.length}</Text>
          <Text style={styles.statLabel}>Played</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={20} color={COLORS.success} />
          <Text style={styles.statValue}>{wins}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="sad" size={20} color={COLORS.error} />
          <Text style={styles.statValue}>{losses}</Text>
          <Text style={styles.statLabel}>Lost</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="timer" size={20} color={COLORS.pencilActive} />
          <Text style={styles.statValue}>
            {bestTime !== null ? formatTime(bestTime) : '--:--'}
          </Text>
          <Text style={styles.statLabel}>Best</Text>
        </View>
      </View>

      {/* Records List */}
      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No Records Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete or lose a game to see your records here
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={renderRecord}
          contentContainerStyle={[
            styles.listContent,
            isWide && styles.listContentWide,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear Confirmation Modal */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="trash" size={48} color={COLORS.error} />
            <Text style={styles.modalTitle}>Clear All Records?</Text>
            <Text style={styles.modalDesc}>
              This will permanently delete all your game records. This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowClearModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Clear All</Text>
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
  clearBtn: {
    padding: 6,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statsRowWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  listContentWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    ...SHADOWS.small,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordIndex: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  recordDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDetail: {
    flex: 1,
    alignItems: 'center',
  },
  recordDetailDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.borderLight,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  diffPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffPillText: {
    fontSize: 11,
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
