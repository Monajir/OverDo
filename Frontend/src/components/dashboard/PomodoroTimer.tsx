import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task, TimerMode } from '@/types';

interface PomodoroTimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  mode: TimerMode;
  currentCycle: number;
  cyclesBeforeLongBreak: number;
  activeTask: Task | null;
  onPlayPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const modeLabels: Record<TimerMode, string> = {
  work: 'FOCUS',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK',
};

const modeColors: Record<TimerMode, string> = {
  work: 'hsl(var(--rank-accent))',
  shortBreak: 'hsl(var(--status-done))',
  longBreak: 'hsl(var(--priority-medium))',
};

export const PomodoroTimer = ({
  timeRemaining,
  totalTime,
  isRunning,
  mode,
  currentCycle,
  cyclesBeforeLongBreak,
  activeTask,
  onPlayPause,
  onReset,
  onSkip,
}: PomodoroTimerProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass rounded-2xl p-6 md:p-8 flex flex-col items-center glow">
      {/* Mode label */}
      <div
        className="text-xs font-semibold tracking-[0.3em] mb-4 uppercase"
        style={{ color: modeColors[mode] }}
      >
        {modeLabels[mode]}
      </div>

      {/* Circular timer */}
      <div className="relative w-56 h-56 md:w-64 md:h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
          {/* Track */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="hsl(0 0% 100% / 0.08)"
            strokeWidth="4"
          />
          {/* Progress */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={modeColors[mode]}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl md:text-6xl font-bold font-mono tabular-nums tracking-tight">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          {activeTask && (
            <span className="text-xs text-muted-foreground mt-2 max-w-[160px] truncate text-center">
              {activeTask.title}
            </span>
          )}
        </div>
      </div>

      {/* Session dots */}
      <div className="flex gap-2 mt-5">
        {Array.from({ length: cyclesBeforeLongBreak }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < currentCycle
                  ? modeColors.work
                  : 'hsl(0 0% 100% / 0.12)',
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-6">
        <Button variant="glass" size="icon" onClick={onReset} className="rounded-full">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          onClick={onPlayPause}
          className="rounded-full h-12 px-8 glow text-sm font-semibold"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-1" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" /> {activeTask ? 'Start' : 'Pick Task'}
            </>
          )}
        </Button>
        <Button variant="glass" size="icon" onClick={onSkip} className="rounded-full">
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
