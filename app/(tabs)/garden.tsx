import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Sprout, Star, Zap } from 'lucide-react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useGarden } from '@/hooks/useGarden';
import { PlantCard } from '@/components/PlantCard';

export default function GardenScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { plants, points, level, plantSeed } = useGarden();
  const styles = createStyles(isDark);

  const availableSeeds = [
    { id: 'sunflower', name: 'Sunflower', cost: 50, emoji: '🌻' },
    { id: 'rose', name: 'Rose', cost: 75, emoji: '🌹' },
    { id: 'cactus', name: 'Cactus', cost: 100, emoji: '🌵' },
    { id: 'tree', name: 'Tree', cost: 150, emoji: '🌳' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Garden</Text>
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Star size={16} color="#FFD700" />
              <Text style={styles.statText}>Level {level}</Text>
            </View>
            <View style={styles.statChip}>
              <Zap size={16} color="#FF6B35" />
              <Text style={styles.statText}>{points} points</Text>
            </View>
          </View>
        </View>

        <View style={styles.gardenSection}>
          <Text style={styles.sectionTitle}>Your Plants</Text>
          {plants.length === 0 ? (
            <View style={styles.emptyGarden}>
              <Sprout size={48} color={isDark ? '#666666' : '#CCCCCC'} />
              <Text style={styles.emptyText}>Plant your first seed!</Text>
              <Text style={styles.emptySubtext}>
                Complete Pomodoro sessions to earn points and grow your garden
              </Text>
            </View>
          ) : (
            <FlatGrid
              itemDimension={150}
              data={plants}
              style={styles.plantGrid}
              spacing={16}
              renderItem={({ item }) => <PlantCard plant={item} />}
            />
          )}
        </View>

        <View style={styles.shopSection}>
          <Text style={styles.sectionTitle}>Plant Seeds</Text>
          <View style={styles.seedsGrid}>
            {availableSeeds.map((seed) => (
              <TouchableOpacity
                key={seed.id}
                style={[
                  styles.seedCard,
                  points < seed.cost && styles.seedCardDisabled,
                ]}
                onPress={() => plantSeed(seed)}
                disabled={points < seed.cost}
              >
                <Text style={styles.seedEmoji}>{seed.emoji}</Text>
                <Text style={styles.seedName}>{seed.name}</Text>
                <View style={styles.seedCost}>
                  <Zap size={14} color="#FF6B35" />
                  <Text style={styles.seedCostText}>{seed.cost}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000000' : '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    fontFamily: 'Inter-Bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    fontFamily: 'Inter-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  gardenSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  emptyGarden: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: isDark ? '#333333' : '#E5E5E5',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#888888' : '#666666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 250,
    fontFamily: 'Inter-Regular',
  },
  plantGrid: {
    marginTop: 8,
  },
  shopSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  seedsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seedCard: {
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  seedCardDisabled: {
    opacity: 0.5,
  },
  seedEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  seedName: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  seedCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seedCostText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
    fontFamily: 'Inter-Bold',
  },
});