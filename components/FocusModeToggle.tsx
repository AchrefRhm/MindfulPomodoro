import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Shield, ShieldOff } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useFocusMode } from '@/contexts/FocusModeContext';

export function FocusModeToggle() {
  const { currentTheme } = useTheme();
  const { isFocusModeActive, toggleFocusMode } = useFocusMode();
  const styles = createStyles(currentTheme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFocusModeActive ? currentTheme.accent : currentTheme.surface,
        },
      ]}
      onPress={toggleFocusMode}
    >
      {isFocusModeActive ? (
        <Shield size={20} color="#FFFFFF" />
      ) : (
        <ShieldOff size={20} color={currentTheme.text} />
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.accent,
  },
});