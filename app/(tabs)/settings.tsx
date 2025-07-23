import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Moon, Sun, Bell, Volume2, Clock, Palette, Shield } from 'lucide-react-native';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { useFocusMode } from '@/contexts/FocusModeContext';
import { SettingsRow } from '@/components/SettingsRow';
import { DurationPicker } from '@/components/DurationPicker';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function SettingsScreen() {
  const { currentTheme, isDark } = useTheme();
  const { isFocusModeActive, toggleFocusMode } = useFocusMode();
  const { settings, updateSettings } = useSettings();
  const styles = createStyles(currentTheme, isDark);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ashref's Timer Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer Settings</Text>
          
          <DurationPicker
            label="Work Duration"
            value={settings.workDuration}
            onChange={(value) => updateSettings({ workDuration: value })}
            icon={<Clock size={20} color={currentTheme.primary} />}
          />
          
          <DurationPicker
            label="Short Break"
            value={settings.shortBreakDuration}
            onChange={(value) => updateSettings({ shortBreakDuration: value })}
            icon={<Clock size={20} color={currentTheme.secondary} />}
          />
          
          <DurationPicker
            label="Long Break"
            value={settings.longBreakDuration}
            onChange={(value) => updateSettings({ longBreakDuration: value })}
            icon={<Clock size={20} color={currentTheme.accent} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Mode</Text>
          
          <SettingsRow
            icon={<Shield size={20} color={currentTheme.accent} />}
            title="Focus Mode"
            subtitle="Block distractions and silence notifications"
            rightElement={
              <Switch
                value={isFocusModeActive}
                onValueChange={toggleFocusMode}
                trackColor={{ false: '#767577', true: currentTheme.accent }}
                thumbColor={isFocusModeActive ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingsRow
            icon={<Bell size={20} color={currentTheme.primary} />}
            title="Session Reminders"
            subtitle="Get notified when sessions start and end"
            rightElement={
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSettings({ notifications: value })}
                trackColor={{ false: '#767577', true: currentTheme.primary }}
                thumbColor={settings.notifications ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
          
          <SettingsRow
            icon={<Volume2 size={20} color={currentTheme.secondary} />}
            title="Sound Effects"
            subtitle="Play sounds when sessions complete"
            rightElement={
              <Switch
                value={settings.soundEffects}
                onValueChange={(value) => updateSettings({ soundEffects: value })}
                trackColor={{ false: '#767577', true: currentTheme.primary }}
                thumbColor={settings.soundEffects ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingsRow
            icon={<Palette size={20} color={currentTheme.primary} />}
            title="Theme"
            subtitle={`Currently using ${currentTheme.name}`}
          />
          
          <ThemeSelector />
          
          <SettingsRow
            icon={isDark ? <Moon size={20} color={currentTheme.secondary} /> : <Sun size={20} color="#FFD700" />}
            title="Dark Mode"
            subtitle={`Currently using ${isDark ? 'dark' : 'light'} mode`}
            rightElement={
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSettings({ darkMode: value })}
                trackColor={{ false: '#767577', true: currentTheme.primary }}
                thumbColor={settings.darkMode ? '#FFFFFF' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>Ashref's Timer</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.description}>
              Your smart productivity companion that combines focus sessions with mindfulness and gamification.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.text,
    fontFamily: 'Inter-Bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  aboutCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primary,
    fontFamily: 'Inter-Bold',
  },
  version: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});