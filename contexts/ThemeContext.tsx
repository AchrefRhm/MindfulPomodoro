import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Ocean Breeze',
    primary: '#FF6B35',
    secondary: '#4A90E2',
    accent: '#7ED321',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
  },
  {
    id: 'forest',
    name: 'Forest Calm',
    primary: '#2E8B57',
    secondary: '#228B22',
    accent: '#32CD32',
    background: '#F0F8F0',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    primary: '#FF4500',
    secondary: '#FF6347',
    accent: '#FFD700',
    background: '#FFF8F0',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    primary: '#4169E1',
    secondary: '#1E90FF',
    accent: '#00BFFF',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#888888',
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState('default');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme) {
        setCurrentThemeId(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (themeId: string) => {
    try {
      setCurrentThemeId(themeId);
      await AsyncStorage.setItem('selectedTheme', themeId);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];
  const isDark = currentTheme.background === '#000000';

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}