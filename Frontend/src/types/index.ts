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

export interface Work {
  _id: string;
  user: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  filename: string;
  url: string;
  mimeType?: string;
  size?: number;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  user: string;
  workId?: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done' | 'failed';
  dueAt?: string;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  totalPomodoros: number;
  pomodoroCompleted: number;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Task['priority'];
  dueAt?: string;
  totalPomodoros: number;
  workId?: string;
}

export interface CreateWorkInput {
  name: string;
  color: string;
}

