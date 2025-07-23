import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Plant {
  id: string;
  type: string;
  name: string;
  emoji: string;
  plantedAt: Date;
  stage: number; // 0-4 (seed, sprout, young, mature, flowering)
  lastWatered: Date;
}

interface Seed {
  id: string;
  name: string;
  cost: number;
  emoji: string;
}

export function useGarden() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    loadGarden();
  }, []);

  const loadGarden = async () => {
    try {
      const savedPlants = await AsyncStorage.getItem('garden');
      const savedPoints = await AsyncStorage.getItem('points');
      const savedLevel = await AsyncStorage.getItem('level');

      if (savedPlants) {
        const parsed = JSON.parse(savedPlants).map((plant: any) => ({
          ...plant,
          plantedAt: new Date(plant.plantedAt),
          lastWatered: new Date(plant.lastWatered),
        }));
        setPlants(parsed);
      }
      
      if (savedPoints) {
        setPoints(parseInt(savedPoints, 10));
      }
      
      if (savedLevel) {
        setLevel(parseInt(savedLevel, 10));
      }
    } catch (error) {
      console.error('Error loading garden:', error);
    }
  };

  const saveGarden = async (newPlants: Plant[], newPoints: number, newLevel: number) => {
    try {
      await AsyncStorage.setItem('garden', JSON.stringify(newPlants));
      await AsyncStorage.setItem('points', newPoints.toString());
      await AsyncStorage.setItem('level', newLevel.toString());
    } catch (error) {
      console.error('Error saving garden:', error);
    }
  };

  const plantSeed = async (seed: Seed) => {
    if (points < seed.cost) return;

    const newPlant: Plant = {
      id: Date.now().toString(),
      type: seed.id,
      name: seed.name,
      emoji: seed.emoji,
      plantedAt: new Date(),
      stage: 0,
      lastWatered: new Date(),
    };

    const newPoints = points - seed.cost;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const updatedPlants = [...plants, newPlant];

    setPlants(updatedPlants);
    setPoints(newPoints);
    setLevel(newLevel);

    await saveGarden(updatedPlants, newPoints, newLevel);
  };

  const addPoints = async (earnedPoints: number) => {
    const newPoints = points + earnedPoints;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    setPoints(newPoints);
    setLevel(newLevel);

    // Grow plants with earned points
    const updatedPlants = plants.map(plant => {
      const daysSincePlanted = Math.floor(
        (Date.now() - plant.plantedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const newStage = Math.min(4, Math.floor(daysSincePlanted / 2) + Math.floor(earnedPoints / 25));
      return { ...plant, stage: Math.max(plant.stage, newStage) };
    });

    setPlants(updatedPlants);
    await saveGarden(updatedPlants, newPoints, newLevel);
  };

  return {
    plants,
    points,
    level,
    plantSeed,
    addPoints,
  };
}