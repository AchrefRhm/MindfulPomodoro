import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface FocusModeContextType {
  isFocusModeActive: boolean;
  toggleFocusMode: () => void;
  blockedApps: string[];
  setBlockedApps: (apps: string[]) => void;
  breathingExerciseActive: boolean;
  startBreathingExercise: () => void;
  stopBreathingExercise: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [breathingExerciseActive, setBreathingExerciseActive] = useState(false);

  useEffect(() => {
    loadFocusModeSettings();
  }, []);

  const loadFocusModeSettings = async () => {
    try {
      const savedBlockedApps = await AsyncStorage.getItem('blockedApps');
      if (savedBlockedApps) {
        setBlockedApps(JSON.parse(savedBlockedApps));
      }
    } catch (error) {
      console.error('Error loading focus mode settings:', error);
    }
  };

  const toggleFocusMode = async () => {
    const newState = !isFocusModeActive;
    setIsFocusModeActive(newState);

    if (newState) {
      // Enable focus mode
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } else {
      // Disable focus mode
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  };

  const saveBlockedApps = async (apps: string[]) => {
    try {
      setBlockedApps(apps);
      await AsyncStorage.setItem('blockedApps', JSON.stringify(apps));
    } catch (error) {
      console.error('Error saving blocked apps:', error);
    }
  };

  const startBreathingExercise = () => {
    setBreathingExerciseActive(true);
  };

  const stopBreathingExercise = () => {
    setBreathingExerciseActive(false);
  };

  return (
    <FocusModeContext.Provider value={{
      isFocusModeActive,
      toggleFocusMode,
      blockedApps,
      setBlockedApps: saveBlockedApps,
      breathingExerciseActive,
      startBreathingExercise,
      stopBreathingExercise,
    }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
}