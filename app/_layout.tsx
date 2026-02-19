import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { GameProvider } from '../src/context/GameContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function InnerLayout() {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    NavigationBar.setBackgroundColorAsync('#FFFFFF');
    NavigationBar.setButtonStyleAsync('dark');
    NavigationBar.setPositionAsync('relative');
  }, []);

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GameProvider>
        <InnerLayout />
      </GameProvider>
    </ThemeProvider>
  );
}
