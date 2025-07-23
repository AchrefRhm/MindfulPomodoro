import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface WeeklyChartProps {
  data: { [day: string]: number };
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxValue = Math.max(...Object.values(data), 1);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {days.map((day) => {
          const value = data[day] || 0;
          const height = (value / maxValue) * 120;
          
          return (
            <View key={day} style={styles.dayContainer}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max(height, 4) },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{day}</Text>
              <Text style={styles.valueLabel}>{value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    backgroundColor: '#FF6B35',
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: isDark ? '#888888' : '#666666',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    marginTop: 4,
    fontFamily: 'Inter-Bold',
  },
});