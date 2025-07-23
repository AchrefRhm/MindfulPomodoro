import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  gradient?: string[];
}

export function StatsCard({ icon, value, label, color, gradient }: StatsCardProps) {
  const { currentTheme, isDark } = useTheme();
  const styles = createStyles(currentTheme, isDark);

  return (
    <LinearGradient
      colors={gradient || [color + '20', color + '10']}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.content}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
  },
  label: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});