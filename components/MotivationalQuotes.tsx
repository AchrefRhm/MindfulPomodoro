import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const quotes = [
  "Focus is the gateway to thinking clearly.",
  "The successful warrior is the average person with laser-like focus.",
  "Concentrate all your thoughts upon the work at hand.",
  "Where focus goes, energy flows and results show.",
  "The art of being wise is knowing what to overlook.",
  "Success is the result of preparation, hard work, and focus.",
];

interface MotivationalQuotesProps {
  currentQuote: number;
}

export function MotivationalQuotes({ currentQuote }: MotivationalQuotesProps) {
  const { currentTheme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(1));
  const styles = createStyles(currentTheme);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuote]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.quote}>"{quotes[currentQuote % quotes.length]}"</Text>
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
});