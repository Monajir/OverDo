import { useState, useCallback, useEffect, useRef } from 'react';
import type { TimerMode, PomodoroSettings } from '@/types';

interface UsePomodoroOptions extends PomodoroSettings {
  onPomodoroComplete?: () => void;
}

export function usePomodoro(options: UsePomodoroOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const completedNaturally = useRef(false);

  const [state, setState] = useState({
    timeRemaining: options.workDuration * 60,
    totalTime: options.workDuration * 60,
    isRunning: false,
    mode: 'work' as TimerMode,
    currentCycle: 1,
  });

  // Fire callback when a work session completes naturally
  const prevModeRef = useRef<TimerMode>('work');
  useEffect(() => {
    if (prevModeRef.current === 'work' && state.mode !== 'work' && completedNaturally.current) {
      optionsRef.current.onPomodoroComplete?.();
      completedNaturally.current = false;
    }
    prevModeRef.current = state.mode;
  }, [state.mode]);

  // Countdown interval
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          const opts = optionsRef.current;

          if (prev.mode === 'work') {
            completedNaturally.current = true;
            const isLong = prev.currentCycle >= opts.cyclesBeforeLongBreak;
            const nextMode: TimerMode = isLong ? 'longBreak' : 'shortBreak';
            const dur = isLong ? opts.longBreakDuration : opts.breakDuration;
            return {
              isRunning: false,
              mode: nextMode,
              timeRemaining: dur * 60,
              totalTime: dur * 60,
              currentCycle: isLong ? 1 : prev.currentCycle,
            };
          } else {
            completedNaturally.current = false;
            return {
              isRunning: false,
              mode: 'work' as TimerMode,
              timeRemaining: opts.workDuration * 60,
              totalTime: opts.workDuration * 60,
              currentCycle: prev.mode === 'shortBreak' ? prev.currentCycle + 1 : prev.currentCycle,
            };
          }
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning]);

  const start = useCallback(() => setState(prev => ({ ...prev, isRunning: true })), []);
  const pause = useCallback(() => setState(prev => ({ ...prev, isRunning: false })), []);

  const reset = useCallback(() => {
    completedNaturally.current = false;
    const opts = optionsRef.current;
    setState({
      timeRemaining: opts.workDuration * 60,
      totalTime: opts.workDuration * 60,
      isRunning: false,
      mode: 'work',
      currentCycle: 1,
    });
  }, []);

  const skip = useCallback(() => {
    completedNaturally.current = false;
    setState(prev => {
      const opts = optionsRef.current;
      if (prev.mode === 'work') {
        const isLong = prev.currentCycle >= opts.cyclesBeforeLongBreak;
        const nextMode: TimerMode = isLong ? 'longBreak' : 'shortBreak';
        const dur = isLong ? opts.longBreakDuration : opts.breakDuration;
        return {
          isRunning: false,
          mode: nextMode,
          timeRemaining: dur * 60,
          totalTime: dur * 60,
          currentCycle: isLong ? 1 : prev.currentCycle,
        };
      } else {
        return {
          isRunning: false,
          mode: 'work' as TimerMode,
          timeRemaining: opts.workDuration * 60,
          totalTime: opts.workDuration * 60,
          currentCycle: prev.mode === 'shortBreak' ? prev.currentCycle + 1 : prev.currentCycle,
        };
      }
    });
  }, []);

  return { ...state, start, pause, reset, skip };
}
