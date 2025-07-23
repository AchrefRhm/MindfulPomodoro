import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { TrendingUp, Target, Clock, Award, Zap, Star, Trophy, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/contexts/ThemeContext';
import { StatsCard } from '@/components/StatsCard';
import { WeeklyChart } from '@/components/WeeklyChart';
import { AchievementCard } from '@/components/AchievementCard';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { currentTheme, isDark } = useTheme();
  const { todayStats, weeklyStats, totalStats } = useStats();
  const styles = createStyles(currentTheme, isDark);

  return (
    <LinearGradient
      colors={isDark ? ['#0A0A0A', '#1A1A2E', '#16213E'] : ['#F8F9FA', '#E3F2FD', '#F3E5F5']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient
            colors={[currentTheme.primary, currentTheme.secondary]}
            style={styles.headerGradient}
          >
            <Trophy size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.title}>Your Amazing Progress</Text>
          <Text style={styles.subtitle}>You're crushing your goals! 🚀</Text>
        </View>

        <BlurView intensity={20} style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.statsGrid}>
            <StatsCard
              icon={<Target size={24} color={currentTheme.primary} />}
              value={todayStats.completed}
              label="Sessions"
              color={currentTheme.primary}
              gradient={[currentTheme.primary, '#FF8A65']}
            />
            <StatsCard
              icon={<Clock size={24} color={currentTheme.secondary} />}
              value={`${Math.round(todayStats.focusTime / 60)}m`}
              label="Focus Time"
              color={currentTheme.secondary}
              gradient={[currentTheme.secondary, '#64B5F6']}
            />
            <StatsCard
              icon={<Zap size={24} color={currentTheme.accent} />}
              value={todayStats.pointsEarned}
              label="Points"
              color={currentTheme.accent}
              gradient={[currentTheme.accent, '#81C784']}
            />
          </View>
        </BlurView>

        <BlurView intensity={20} style={styles.weeklySection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <WeeklyChart data={weeklyStats} />
        </BlurView>

        <BlurView intensity={20} style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Achievements Unlocked</Text>
          <View style={styles.achievementsList}>
            <AchievementCard
              icon="🎯"
              title="Focus Master"
              description="Complete 25 Pomodoros in one day"
              progress={todayStats.completed}
              target={25}
              color="#FFD700"
            />
            <AchievementCard
              icon="🌱"
              title="Garden Keeper"
              description="Grow 5 plants in your garden"
              progress={3}
              target={5}
              color={currentTheme.accent}
            />
            <AchievementCard
              icon="⚡"
              title="Power User"
              description="Maintain a 7-day streak"
              progress={totalStats.currentStreak}
              target={7}
              color={currentTheme.primary}
            />
          </View>
        </BlurView>

        <BlurView intensity={20} style={styles.totalSection}>
          <Text style={styles.sectionTitle}>🌟 Lifetime Stats</Text>
          <LinearGradient
            colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.02)']}
            style={styles.totalStats}
          >
            <View style={styles.totalStatItem}>
              <View style={[styles.statIconLarge, { backgroundColor: currentTheme.primary + '20' }]}>
                <Target size={28} color={currentTheme.primary} />
              </View>
              <Text style={[styles.totalStatValue, { color: currentTheme.primary }]}>{totalStats.totalSessions}</Text>
              <Text style={styles.totalStatLabel}>Total Sessions</Text>
            </View>
            <View style={styles.totalStatItem}>
              <View style={[styles.statIconLarge, { backgroundColor: currentTheme.secondary + '20' }]}>
                <Clock size={28} color={currentTheme.secondary} />
              </View>
              <Text style={[styles.totalStatValue, { color: currentTheme.secondary }]}>{Math.round(totalStats.totalFocusTime / 3600)}h</Text>
              <Text style={styles.totalStatLabel}>Total Focus Time</Text>
            </View>
            <View style={styles.totalStatItem}>
              <View style={[styles.statIconLarge, { backgroundColor: currentTheme.accent + '20' }]}>
                <Star size={28} color={currentTheme.accent} />
              </View>
              <Text style={[styles.totalStatValue, { color: currentTheme.accent }]}>{totalStats.currentStreak}</Text>
              <Text style={styles.totalStatLabel}>Current Streak</Text>
            </View>
          </LinearGradient>
        </BlurView>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.text,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: theme.textSecondary,
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  todaySection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  weeklySection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  achievementsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  achievementsList: {
    gap: 16,
  },
  totalSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  totalStats: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  totalStatValue: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
  },
  totalStatLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});