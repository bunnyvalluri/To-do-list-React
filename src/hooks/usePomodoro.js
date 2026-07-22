import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MODES = {
  work: { label: 'Work Focus', duration: 25 * 60 },
  shortBreak: { label: 'Short Break', duration: 5 * 60 },
  longBreak: { label: 'Long Break', duration: 15 * 60 }
};

export function usePomodoro() {
  const [mode, setMode] = useLocalStorage('taskflow_pomo_mode', 'work');
  const [timeLeft, setTimeLeft] = useState(MODES[mode]?.duration || 1500);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage('taskflow_pomo_sessions', 0);

  // Sync time left when mode changes
  useEffect(() => {
    setTimeLeft(MODES[mode]?.duration || 1500);
    setIsRunning(false);
  }, [mode]);

  // Countdown timer loop
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work') {
        setSessionsCompleted((prev) => prev + 1);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, setSessionsCompleted]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(MODES[mode]?.duration || 1500);
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    if (MODES[newMode]) {
      setMode(newMode);
    }
  }, [setMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    mode,
    modes: MODES,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    switchMode
  };
}
