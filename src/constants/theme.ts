export type ThemeColors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  given: string;
  userInput: string;
  error: string;
  errorBg: string;
  selected: string;
  related: string;
  highlight: string;
  border: string;
  borderLight: string;
  boxBorder: string;
  success: string;
  successBg: string;
  pauseOverlay: string;
  noteText: string;
  pencilActive: string;
  white: string;
  black: string;
  statusBar: 'light' | 'dark';
};

export type ThemeName = 'classic' | 'dark' | 'ocean' | 'sunset' | 'forest';

const classicTheme: ThemeColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  given: '#0F172A',
  userInput: '#3B82F6',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  selected: '#DBEAFE',
  related: '#EFF6FF',
  highlight: '#96beffff',
  border: '#334155',
  borderLight: '#E2E8F0',
  boxBorder: '#334155',
  success: '#22C55E',
  successBg: '#DCFCE7',
  pauseOverlay: 'rgba(15, 23, 42, 0.92)',
  noteText: '#64748B',
  pencilActive: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  statusBar: 'dark',
};

const darkTheme: ThemeColors = {
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  given: '#F1F5F9',
  userInput: '#60A5FA',
  error: '#F87171',
  errorBg: '#451A1A',
  selected: '#1E3A5F',
  related: '#162033',
  highlight: '#2563EB88',
  border: '#475569',
  borderLight: '#334155',
  boxBorder: '#94A3B8',
  success: '#4ADE80',
  successBg: '#14532D',
  pauseOverlay: 'rgba(0, 0, 0, 0.92)',
  noteText: '#94A3B8',
  pencilActive: '#FBBF24',
  white: '#FFFFFF',
  black: '#000000',
  statusBar: 'light',
};

const oceanTheme: ThemeColors = {
  primary: '#0EA5E9',
  primaryLight: '#38BDF8',
  primaryDark: '#0284C7',
  background: '#F0F9FF',
  surface: '#FFFFFF',
  surfaceAlt: '#E0F2FE',
  text: '#0C4A6E',
  textSecondary: '#0369A1',
  textMuted: '#7DD3FC',
  given: '#0C4A6E',
  userInput: '#0EA5E9',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  selected: '#BAE6FD',
  related: '#E0F2FE',
  highlight: '#7DD3FC88',
  border: '#0369A1',
  borderLight: '#BAE6FD',
  boxBorder: '#0369A1',
  success: '#22C55E',
  successBg: '#DCFCE7',
  pauseOverlay: 'rgba(12, 74, 110, 0.92)',
  noteText: '#0369A1',
  pencilActive: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  statusBar: 'dark',
};

const sunsetTheme: ThemeColors = {
  primary: '#F97316',
  primaryLight: '#FB923C',
  primaryDark: '#EA580C',
  background: '#FFFBEB',
  surface: '#FFFFFF',
  surfaceAlt: '#FEF3C7',
  text: '#78350F',
  textSecondary: '#92400E',
  textMuted: '#D97706',
  given: '#78350F',
  userInput: '#F97316',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  selected: '#FED7AA',
  related: '#FFF7ED',
  highlight: '#FDBA7488',
  border: '#92400E',
  borderLight: '#FDE68A',
  boxBorder: '#92400E',
  success: '#22C55E',
  successBg: '#DCFCE7',
  pauseOverlay: 'rgba(120, 53, 15, 0.92)',
  noteText: '#92400E',
  pencilActive: '#EAB308',
  white: '#FFFFFF',
  black: '#000000',
  statusBar: 'dark',
};

const forestTheme: ThemeColors = {
  primary: '#16A34A',
  primaryLight: '#4ADE80',
  primaryDark: '#15803D',
  background: '#F0FDF4',
  surface: '#FFFFFF',
  surfaceAlt: '#DCFCE7',
  text: '#14532D',
  textSecondary: '#166534',
  textMuted: '#86EFAC',
  given: '#14532D',
  userInput: '#16A34A',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  selected: '#BBF7D0',
  related: '#F0FDF4',
  highlight: '#86EFAC88',
  border: '#166534',
  borderLight: '#BBF7D0',
  boxBorder: '#166534',
  success: '#22C55E',
  successBg: '#DCFCE7',
  pauseOverlay: 'rgba(20, 83, 45, 0.92)',
  noteText: '#166534',
  pencilActive: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  statusBar: 'dark',
};

export const THEMES: Record<ThemeName, ThemeColors> = {
  classic: classicTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
};

export const THEME_META: { key: ThemeName; label: string; preview: string }[] = [
  { key: 'classic', label: 'Classic', preview: '#3B82F6' },
  { key: 'dark', label: 'Dark', preview: '#1E293B' },
  { key: 'ocean', label: 'Ocean', preview: '#0EA5E9' },
  { key: 'sunset', label: 'Sunset', preview: '#F97316' },
  { key: 'forest', label: 'Forest', preview: '#16A34A' },
];

// Backward-compatible default export
export const COLORS = classicTheme;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22C55E',
  moderate: '#3B82F6',
  hard: '#F59E0B',
  expert: '#EF4444',
  extreme: '#7C3AED',
};
