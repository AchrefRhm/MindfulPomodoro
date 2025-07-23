import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from './useTimer';

interface SessionRecord {
  type: SessionType;
  duration: number;
  completedAt: Date;
  pointsEarned: number;
}

interface DailyStats {
  completed: number;
  focusTime: number;
  breakTime: number;
  pointsEarned: number;
}

interface WeeklyStats {
  [day: string]: number;
}

interface TotalStats {
  totalSessions: number;
  totalFocusTime: number;
  currentStreak: number;
  longestStreak: number;
}

export function useStats() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [todayStats, setTodayStats] = useState<DailyStats>({
    completed: 0,
    focusTime: 0,
    breakTime: 0,
    pointsEarned: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({});
  const [totalStats, setTotalStats] = useState<TotalStats>({
    totalSessions: 0,
    totalFocusTime: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [sessions]);

  const loadStats = async () => {
    try {
      const savedSessions = await AsyncStorage.getItem('sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt),
        }));
        setSessions(parsed);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveStats = async (newSessions: SessionRecord[]) => {
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter(
      session => session.completedAt >= today
    );

    const todayCompleted = todaySessions.length;
    const todayFocusTime = todaySessions
      .filter(session => session.type === 'work')
      .reduce((total, session) => total + session.duration, 0);
    const todayBreakTime = todaySessions
      .filter(session => session.type !== 'work')
      .reduce((total, session) => total + session.duration, 0);
    const todayPoints = todaySessions.reduce((total, session) => total + session.pointsEarned, 0);

    setTodayStats({
      completed: todayCompleted,
      focusTime: todayFocusTime,
      breakTime: todayBreakTime,
      pointsEarned: todayPoints,
    });

    // Calculate weekly stats
    const weeklyData: WeeklyStats = {};
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dayKey = day.toLocaleDateString('en-US', { weekday: 'short' });
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === day.getTime();
      });
      
      weeklyData[dayKey] = daySessions.length;
    }
    setWeeklyStats(weeklyData);

    // Calculate total stats
    const totalSessions = sessions.length;
    const totalFocusTime = sessions
      .filter(session => session.type === 'work')
      .reduce((total, session) => total + session.duration, 0);

    setTotalStats({
      totalSessions,
      totalFocusTime,
      currentStreak: calculateStreak(),
      longestStreak: calculateLongestStreak(),
    });
  };

  const calculateStreak = (): number => {
    // Calculate current streak logic
    return 7; // Placeholder
  };

  const calculateLongestStreak = (): number => {
    // Calculate longest streak logic
    return 12; // Placeholder
  };

  const addCompletedSession = async (type: SessionType, duration: number) => {
    const pointsEarned = type === 'work' ? 25 : 10;
    const newSession: SessionRecord = {
      type,
      duration,
      completedAt: new Date(),
      pointsEarned,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    await saveStats(updatedSessions);
  };

  return {
    sessions,
    todayStats,
    weeklyStats,
    totalStats,
    addCompletedSession,
  };
}