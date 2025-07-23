import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  backgroundSound: string;
}

const defaultSettings: Settings = {
  workDuration: 1500, // 25 minutes
  shortBreakDuration: 300, // 5 minutes
  longBreakDuration: 900, // 15 minutes
  notifications: true,
  soundEffects: true,
  darkMode: false,
  backgroundSound: 'none',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
  };
}