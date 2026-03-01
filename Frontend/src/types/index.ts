export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}

export interface UserPreferences {
  reactionMode: 'friendly' | 'sarcastic' | 'aggressive';
  theme: 'light' | 'dark';
  pomodoroSettings: PomodoroSettings;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  rank: 1 | 2 | 3;
  xp: number;
  streak: number;
  preferences: UserPreferences;
}

