import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGame } from "../context/GameContext";
import { COLORS, SHADOWS } from "../constants/theme";

interface IPauseOverlayProps {
  formatTime: (seconds: number) => string;
}

const PauseOverlay = ({ formatTime }: IPauseOverlayProps) => {
  const { timer, togglePause } = useGame();
  return (
    <View style={[StyleSheet.absoluteFill, styles.pauseOverlay]}>
      <Ionicons name="pause-circle" size={80} color={COLORS.white} />
      <Text style={styles.pauseTitle}>Game Paused</Text>
      <Text style={styles.pauseSubtitle}>Time: {formatTime(timer)}</Text>
      <TouchableOpacity
        style={styles.resumeBtn}
        onPress={togglePause}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={24} color={COLORS.white} />
        <Text style={styles.resumeBtnText}>Resume</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  // Pause overlay
  pauseOverlay: {
    backgroundColor: COLORS.pauseOverlay,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 16,
  },
  pauseSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  resumeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  resumeBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
});

export default PauseOverlay;
