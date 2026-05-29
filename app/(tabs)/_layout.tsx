import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

export default function TabsLayout() {
  const colors = useColors();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="classic"
        options={{
          title: t.home.tabClassic,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blitz"
        options={{
          title: t.home.tabBlitz,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="killer"
        options={{
          title: t.home.tabKiller,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="skull-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
