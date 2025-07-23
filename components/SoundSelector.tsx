import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export function SoundSelector() {
  const { currentTheme, isDark } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const styles = createStyles(currentTheme, isDark);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <TouchableOpacity
      style={styles.controlButton}
      onPress={toggleSound}
    >
      <LinearGradient
        colors={isDark ? ['#333333', '#555555'] : ['#FFFFFF', '#F5F5F5']}
        style={styles.buttonGradient}
      >
        {isMuted ? (
          <VolumeX size={24} color={currentTheme.text} />
        ) : (
          <Volume2 size={24} color={currentTheme.text} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
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
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
  },
});