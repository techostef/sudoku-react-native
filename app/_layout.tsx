import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../src/context/GameContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function InnerLayout() {
  const { colors } = useTheme();
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
