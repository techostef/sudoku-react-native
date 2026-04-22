import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SHADOWS } from '../src/constants/theme';
import { useColors } from '../src/context/ThemeContext';
import { useLanguage } from '../src/context/LanguageContext';
import { useSettings } from '../src/context/SettingsContext';

function SettingRow({
  label,
  description,
  value,
  onValueChange,
  trackColor,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  trackColor: { false: string; true: string };
}) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
      <View style={styles.settingText}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.settingDesc, { color: colors.textMuted }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const { settings, updateSetting } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width > 600;

  const trackColor = { false: colors.borderLight, true: colors.primary };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.header, isWide && styles.headerWide]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t.settings.title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingRow
            label={t.settings.sound}
            description={t.settings.soundDesc}
            value={settings.soundEnabled}
            onValueChange={(v) => updateSetting('soundEnabled', v)}
            trackColor={trackColor}
          />
          <SettingRow
            label={t.settings.highlightRelated}
            description={t.settings.highlightRelatedDesc}
            value={settings.highlightRelated}
            onValueChange={(v) => updateSetting('highlightRelated', v)}
            trackColor={trackColor}
          />
          <SettingRow
            label={t.settings.showRemaining}
            description={t.settings.showRemainingDesc}
            value={settings.showRemainingCount}
            onValueChange={(v) => updateSetting('showRemainingCount', v)}
            trackColor={trackColor}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  contentWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
