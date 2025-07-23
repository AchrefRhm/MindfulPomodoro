import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface Plant {
  id: string;
  type: string;
  name: string;
  emoji: string;
  plantedAt: Date;
  stage: number;
  lastWatered: Date;
}

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const getStageEmoji = (stage: number, baseEmoji: string) => {
    switch (stage) {
      case 0: return '🌱';
      case 1: return '🌿';
      case 2: return '🌿';
      case 3: return baseEmoji;
      case 4: return baseEmoji + '✨';
      default: return baseEmoji;
    }
  };

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 0: return 'Seed';
      case 1: return 'Sprout';
      case 2: return 'Young';
      case 3: return 'Mature';
      case 4: return 'Flowering';
      default: return 'Growing';
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>
        {getStageEmoji(plant.stage, plant.emoji)}
      </Text>
      <Text style={styles.name}>{plant.name}</Text>
      <Text style={styles.stage}>{getStageLabel(plant.stage)}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: `${(plant.stage / 4) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  stage: {
    fontSize: 12,
    color: isDark ? '#888888' : '#666666',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: isDark ? '#333333' : '#E5E5E5',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#7ED321',
    borderRadius: 2,
  },
});