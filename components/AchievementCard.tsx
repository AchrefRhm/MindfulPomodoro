import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  color: string;
}

export function AchievementCard({ icon, title, description, progress, target, color }: AchievementCardProps) {
  const { currentTheme, isDark } = useTheme();
  const styles = createStyles(currentTheme, isDark);
  const progressPercentage = Math.min((progress / target) * 100, 100);
  const isCompleted = progress >= target;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={isCompleted ? [color, color + '80'] : [color + '20', color + '10']}
        style={styles.iconContainer}
      >
        <Text style={styles.icon}>{icon}</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[color, color + '80']}
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress}/{target}
          </Text>
        </View>
      </View>
      
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: isDark ? '#333333' : '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    fontFamily: 'Inter-Bold',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});