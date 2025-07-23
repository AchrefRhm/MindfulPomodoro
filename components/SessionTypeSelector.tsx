import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SessionType } from '@/hooks/useTimer';
import { useTheme } from '@/contexts/ThemeContext';

interface SessionTypeSelectorProps {
  currentType: SessionType;
  onTypeChange: (type: SessionType) => void;
  disabled?: boolean;
}

export function SessionTypeSelector({ currentType, onTypeChange, disabled }: SessionTypeSelectorProps) {
  const { currentTheme, isDark } = useTheme();
  const styles = createStyles(currentTheme, isDark);

  const sessionTypes = [
    { key: 'work' as SessionType, label: '🎯 Focus', color: currentTheme.primary, gradient: [currentTheme.primary, '#FF8A65'] },
    { key: 'shortBreak' as SessionType, label: '☕ Short Break', color: currentTheme.secondary, gradient: [currentTheme.secondary, '#64B5F6'] },
    { key: 'longBreak' as SessionType, label: '🌿 Long Break', color: currentTheme.accent, gradient: [currentTheme.accent, '#81C784'] },
  ];

  return (
    <BlurView intensity={20} style={styles.container}>
      {sessionTypes.map((type) => (
        <TouchableOpacity
          key={type.key}
          style={[
            styles.button,
            disabled && styles.disabledButton,
          ]}
          onPress={() => onTypeChange(type.key)}
          disabled={disabled}
        >
          {currentType === type.key ? (
            <LinearGradient
              colors={type.gradient}
              style={styles.activeButtonGradient}
            >
              <Text style={styles.activeButtonText}>{type.label}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.inactiveButton}>
              <Text style={styles.buttonText}>{type.label}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </BlurView>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 6,
    marginHorizontal: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inactiveButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textSecondary,
    fontFamily: 'Inter-Bold',
  },
  activeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});