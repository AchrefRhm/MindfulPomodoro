import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';

interface DurationPickerProps {
  label: string;
  value: number; // in seconds
  onChange: (value: number) => void;
  icon: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
}

export function DurationPicker({
  label,
  value,
  onChange,
  icon,
  min = 300, // 5 minutes
  max = 3600, // 60 minutes
  step = 300, // 5 minutes
}: DurationPickerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const increment = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.rightContent}>
        <TouchableOpacity
          style={[styles.button, value >= max && styles.disabledButton]}
          onPress={increment}
          disabled={value >= max}
        >
          <ChevronUp size={16} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={styles.value}>{formatDuration(value)}</Text>
        <TouchableOpacity
          style={[styles.button, value <= min && styles.disabledButton]}
          onPress={decrement}
          disabled={value <= min}
        >
          <ChevronDown size={16} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    fontFamily: 'Inter-Bold',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#333333' : '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    minWidth: 40,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
});