import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { X, Wind } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useFocusMode } from '@/contexts/FocusModeContext';

export function BreathingExercise() {
  const { currentTheme, isDark } = useTheme();
  const { breathingExerciseActive, stopBreathingExercise } = useFocusMode();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const styles = createStyles(currentTheme, isDark);

  useEffect(() => {
    if (!breathingExerciseActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale':
                return 'hold';
              case 'hold':
                return 'exhale';
              case 'exhale':
                return 'inhale';
              default:
                return 'inhale';
            }
          });
          return phase === 'hold' ? 4 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingExerciseActive, phase]);

  useEffect(() => {
    if (!breathingExerciseActive) return;

    const duration = 4000;
    
    if (phase === 'inhale') {
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration,
        useNativeDriver: true,
      }).start();
    } else if (phase === 'exhale') {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, breathingExerciseActive]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Breathe';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return currentTheme.primary;
      case 'hold':
        return currentTheme.secondary;
      case 'exhale':
        return currentTheme.accent;
      default:
        return currentTheme.primary;
    }
  };

  return (
    <Modal
      visible={breathingExerciseActive}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={stopBreathingExercise}
          >
            <X size={24} color={currentTheme.text} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Wind size={48} color={getPhaseColor()} />
            <Text style={styles.title}>Mindful Breathing</Text>
            <Text style={styles.subtitle}>Take a moment to breathe and relax</Text>

            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    backgroundColor: getPhaseColor(),
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              />
              <View style={styles.breathingText}>
                <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
                  {getPhaseText()}
                </Text>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            </View>

            <Text style={styles.instruction}>
              Follow the circle and breathe naturally
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 32,
    margin: 24,
    alignItems: 'center',
    minWidth: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  breathingContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.3,
  },
  breathingText: {
    position: 'absolute',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  countdownText: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.text,
    marginTop: 8,
    fontFamily: 'Inter-Bold',
  },
  instruction: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});