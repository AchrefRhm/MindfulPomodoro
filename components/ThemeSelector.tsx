import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, themes, setTheme, isDark } = useTheme();
  const styles = createStyles(currentTheme, isDark);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {themes.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[
            styles.themeOption,
            currentTheme.id === theme.id && styles.selectedTheme,
          ]}
          onPress={() => setTheme(theme.id)}
        >
          <View style={styles.colorPreview}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.primary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.secondary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.accent }]} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    paddingHorizontal: 24,
    gap: 12,
  },
  themeOption: {
    width: 80,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTheme: {
    borderColor: theme.primary,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 4,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});