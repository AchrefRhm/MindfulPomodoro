import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Play, Pause, RotateCcw, Volume2, Shield, Wind, Zap, Star, Trophy, Target } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTimer } from '@/hooks/useTimer';
import { useSettings } from '@/hooks/useSettings';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/contexts/ThemeContext';
import { useFocusMode } from '@/contexts/FocusModeContext';
import { SessionTypeSelector } from '@/components/SessionTypeSelector';
import { SoundSelector } from '@/components/SoundSelector';
import { CircularProgress } from '@/components/CircularProgress';
import { BreathingExercise } from '@/components/BreathingExercise';
import { FocusModeToggle } from '@/components/FocusModeToggle';
import { FloatingParticles } from '@/components/FloatingParticles';
import { PulsingOrb } from '@/components/PulsingOrb';
import { MotivationalQuotes } from '@/components/MotivationalQuotes';

const { width, height } = Dimensions.get('window');

export default function TimerScreen() {
  const { currentTheme, isDark } = useTheme();
  const { isFocusModeActive, breathingExerciseActive, startBreathingExercise } = useFocusMode();
  const {
    timeLeft,
    isRunning,
    sessionType,
    currentSession,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType,
  } = useTimer();
  const { settings } = useSettings();
  const { addCompletedSession, todayStats } = useStats();

  const [showCelebration, setShowCelebration] = useState(false);
  const [streakCount, setStreakCount] = useState(7);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const styles = createStyles(currentTheme, isDark);
  const totalTime = sessionType === 'work' ? settings.workDuration : 
                   sessionType === 'shortBreak' ? settings.shortBreakDuration :
                   settings.longBreakDuration;
  
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Enhanced animations
  useEffect(() => {
    if (isRunning) {
      // Pulsing animation for active timer
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isRunning]);

  // Floating animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCelebration(false));
  };

  const handleStart = () => {
    triggerHaptic();
    startTimer();
  };

  const handlePause = () => {
    triggerHaptic();
    pauseTimer();
  };

  const handleReset = () => {
    triggerHaptic();
    resetTimer();
  };

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      addCompletedSession(sessionType, totalTime);
      triggerHaptic();
      triggerCelebration();
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 200, 100, 200, 100, 200]);
      }
      
      if (sessionType === 'work') {
        setTimeout(() => {
          startBreathingExercise();
        }, 3000);
      }
    }
  }, [timeLeft, isRunning]);

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return [currentTheme.primary, '#FF8A65'];
      case 'shortBreak': return [currentTheme.secondary, '#64B5F6'];
      case 'longBreak': return [currentTheme.accent, '#81C784'];
      default: return [currentTheme.primary, '#FF8A65'];
    }
  };

  const floatingTransform = {
    transform: [
      {
        translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0A0A0A', '#1A1A2E', '#16213E'] : ['#F8F9FA', '#E3F2FD', '#F3E5F5']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FloatingParticles />
        
        {/* Enhanced Header */}
        <Animated.View style={[styles.header, floatingTransform]}>
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={getSessionColor()}
              style={styles.logoGradient}
            >
              <Ionicons name="timer-outline" size={32} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Ashref's Timer</Text>
              <Text style={styles.subtitle}>Ultimate Focus Companion</Text>
            </View>
          </View>
          
          <View style={styles.headerStats}>
            <View style={styles.statBadge}>
              <Zap size={16} color="#FFD700" />
              <Text style={styles.statBadgeText}>{todayStats.completed}</Text>
            </View>
            <View style={styles.statBadge}>
              <Star size={16} color="#FF6B35" />
              <Text style={styles.statBadgeText}>{streakCount}</Text>
            </View>
            <View style={styles.statBadge}>
              <Trophy size={16} color="#7ED321" />
              <Text style={styles.statBadgeText}>L{Math.floor(todayStats.completed / 5) + 1}</Text>
            </View>
          </View>

          <View style={styles.headerControls}>
            <FocusModeToggle />
            <TouchableOpacity
              style={[styles.breathingButton, { backgroundColor: currentTheme.accent }]}
              onPress={startBreathingExercise}
            >
              <Wind size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Session Type Selector with Enhanced Design */}
        <SessionTypeSelector
          currentType={sessionType}
          onTypeChange={setSessionType}
          disabled={isRunning}
        />

        {/* Motivational Quote */}
        <MotivationalQuotes currentQuote={currentQuote} />

        {/* Enhanced Timer Container */}
        <View style={styles.timerContainer}>
          <Animated.View
            style={[
              styles.timerWrapper,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {/* Glow Effect */}
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowAnim,
                  backgroundColor: getSessionColor()[0],
                },
              ]}
            />
            
            {/* Pulsing Orb Background */}
            <PulsingOrb isActive={isRunning} color={getSessionColor()[0]} />
            
            <CircularProgress
              size={320}
              width={12}
              fill={progress}
              tintColor={getSessionColor()[0]}
              backgroundColor={isDark ? '#333333' : '#E5E5E5'}
            >
              {() => (
                <BlurView intensity={20} style={styles.timerInner}>
                  <LinearGradient
                    colors={getSessionColor()}
                    style={styles.timeContainer}
                  >
                    <Text style={styles.timeText}>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </Text>
                  </LinearGradient>
                  
                  <Text style={styles.sessionLabel}>
                    {sessionType === 'work' ? '🎯 Deep Focus' : 
                     sessionType === 'shortBreak' ? '☕ Quick Break' : '🌿 Long Rest'}
                  </Text>
                  
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionNumber}>Session {currentSession}</Text>
                    {isFocusModeActive && (
                      <View style={styles.focusBadge}>
                        <Shield size={14} color={currentTheme.accent} />
                        <Text style={styles.focusBadgeText}>Focus Mode</Text>
                      </View>
                    )}
                  </View>
                </BlurView>
              )}
            </CircularProgress>
          </Animated.View>
        </View>

        {/* Enhanced Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleReset}
            disabled={timeLeft === totalTime && !isRunning}
          >
            <LinearGradient
              colors={isDark ? ['#333333', '#555555'] : ['#FFFFFF', '#F5F5F5']}
              style={styles.buttonGradient}
            >
              <RotateCcw size={24} color={currentTheme.text} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={isRunning ? handlePause : handleStart}
          >
            <LinearGradient
              colors={getSessionColor()}
              style={styles.buttonGradient}
            >
              {isRunning ? (
                <Pause size={36} color="#FFFFFF" />
              ) : (
                <Play size={36} color="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <SoundSelector />
        </View>

        {/* Enhanced Stats Dashboard */}
        <BlurView intensity={30} style={styles.statsContainer}>
          <LinearGradient
            colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.02)']}
            style={styles.statsGradient}
          >
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: currentTheme.primary + '20' }]}>
                  <Target size={20} color={currentTheme.primary} />
                </View>
                <Text style={styles.statValue}>{todayStats.completed}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: currentTheme.secondary + '20' }]}>
                  <Zap size={20} color={currentTheme.secondary} />
                </View>
                <Text style={styles.statValue}>{Math.round(todayStats.focusTime / 60)}m</Text>
                <Text style={styles.statLabel}>Focus Time</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: currentTheme.accent + '20' }]}>
                  <Star size={20} color={currentTheme.accent} />
                </View>
                <Text style={styles.statValue}>{streakCount}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>

        {/* Celebration Animation */}
        {showCelebration && (
          <Animated.View
            style={[
              styles.celebrationOverlay,
              {
                opacity: celebrationAnim,
                transform: [
                  {
                    scale: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.celebrationText}>🎉 Amazing Work! 🎉</Text>
            <Text style={styles.celebrationSubtext}>You completed another focus session!</Text>
          </Animated.View>
        )}

        <BreathingExercise />
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
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.text,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    fontFamily: 'Inter-Bold',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  breathingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 20,
  },
  timerWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    opacity: 0.3,
    elevation: 0,
  },
  timerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 160,
    overflow: 'hidden',
  },
  timeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sessionLabel: {
    fontSize: 20,
    color: theme.text,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
    gap: 8,
  },
  sessionNumber: {
    fontSize: 16,
    color: theme.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  focusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  focusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.accent,
    fontFamily: 'Inter-Bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 32,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  secondaryButton: {
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  statsContainer: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: height * 0.4,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.primary,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  celebrationSubtext: {
    fontSize: 18,
    color: theme.text,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});