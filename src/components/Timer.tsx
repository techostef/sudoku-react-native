import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { useColors } from '../context/ThemeContext';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Timer() {
  const { state, togglePause, setTimer } = useGame();
  const colors = useColors();
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.gameStarted && !state.isPaused && !state.isComplete && !state.isGameOver) {
      timerRef.current = setInterval(() => {
        setTick((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        setTimer(tick);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.gameStarted, state.isPaused, state.isComplete, state.isGameOver]);

  return (
    <View style={styles.container}>
      <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
      <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(tick)}</Text>
      <TouchableOpacity
        onPress={togglePause}
        style={styles.pauseBtn}
        activeOpacity={0.6}
      >
        <Ionicons
          name={state.isPaused ? 'play' : 'pause'}
          size={20}
          color={colors.primary}
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
    fontVariant: ['tabular-nums'],
    minWidth: 56,
  },
  pauseBtn: {
    padding: 4,
  },
});
