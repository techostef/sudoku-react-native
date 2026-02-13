import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { COLORS } from '../constants/theme';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Timer() {
  const { state, togglePause } = useGame();

  return (
    <View style={styles.container}>
      <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
      <Text style={styles.timeText}>{formatTime(state.timer)}</Text>
      <TouchableOpacity
        onPress={togglePause}
        style={styles.pauseBtn}
        activeOpacity={0.6}
      >
        <Ionicons
          name={state.isPaused ? 'play' : 'pause'}
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    minWidth: 56,
  },
  pauseBtn: {
    padding: 4,
  },
});
