import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export function FloatingParticles() {
  const { currentTheme } = useTheme();
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.6 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle) => {
      const animateParticle = () => {
        const duration = 8000 + Math.random() * 4000;
        
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.6 + 0.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.6 + 0.2,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particle.scale, {
                toValue: Math.random() * 0.5 + 0.8,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.scale, {
                toValue: Math.random() * 0.5 + 0.5,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start(() => animateParticle());
      };

      animateParticle();
      return particle;
    });

    return () => {
      animations.forEach((particle) => {
        particle.x.stopAnimation();
        particle.y.stopAnimation();
        particle.opacity.stopAnimation();
        particle.scale.stopAnimation();
      });
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: currentTheme.primary,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});