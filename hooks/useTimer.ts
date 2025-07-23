import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SessionType = 'work' | 'shortBreak' | 'longBreak';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  currentSession: number;
}

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [currentSession, setCurrentSession] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const durations = {
    work: 1500, // 25 minutes
    shortBreak: 300, // 5 minutes
    longBreak: 900, // 15 minutes
  };

  useEffect(() => {
    loadTimerState();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(durations[sessionType]);
    setIsRunning(false);
  }, [sessionType]);

  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('timerState');
      if (savedState) {
        const state: TimerState = JSON.parse(savedState);
        setCurrentSession(state.currentSession);
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  };

  const saveTimerState = async () => {
    try {
      const state: TimerState = {
        timeLeft,
        isRunning: false,
        sessionType,
        currentSession,
      };
      await AsyncStorage.setItem('timerState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  const handleSessionComplete = () => {
    if (sessionType === 'work') {
      setCurrentSession((prev) => prev + 1);
      const nextType = currentSession % 4 === 0 ? 'longBreak' : 'shortBreak';
      setSessionType(nextType);
    } else {
      setSessionType('work');
    }
    saveTimerState();
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[sessionType]);
  };

  const changeSessionType = (type: SessionType) => {
    setSessionType(type);
    setIsRunning(false);
  };

  return {
    timeLeft,
    isRunning,
    sessionType,
    currentSession,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType: changeSessionType,
  };
}