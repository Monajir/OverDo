import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RankBackground } from '@/components/dashboard/RankBackground';
import { PomodoroTimer } from '@/components/dashboard/PomodoroTimer';
import { MotivationalCharacter } from '@/components/dashboard/MotivationalCharacter';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { WorkFolder } from '@/components/dashboard/WorkFolder';
import { TaskFormModal } from '@/components/dashboard/TaskFormModal';
import { WorkFormModal } from '@/components/dashboard/WorkFormModal';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { usePomodoro } from '@/hooks/use-pomodoro';
import type { User, Task, Work, PomodoroSettings, UserPreferences, CreateTaskInput } from '@/types';
import {
  fetchCurrentUser,
  fetchTasks,
  fetchWorks,
  createTask,
  updateTask,
  deleteTask,
  createWork,
  deleteWork,
  markTaskComplete,
  incrementPomodoro,
  updateUserPreferences,
  uploadAttachment,
  deleteAttachment,
  fetchMessages,
} from '@/lib/api';
import { setCharacterMessages } from '@/lib/character-messages';

const getRankClass = (rank: number) => {
  if (rank === 3) return 'rank-legend';
  if (rank === 2) return 'rank-journeyman';
  return 'rank-novice';
};

const Dashboard = () => {
  const { toast } = useToast();
  const { } = useAuth();

  // ---- Core state ----
  const [user, setUser] = useState<User>({
    _id: '',
    username: '',
    email: '',
    rank: 1,
    xp: 0,
    streak: 0,
    preferences: {
      reactionMode: 'friendly',
      theme: 'dark',
      pomodoroSettings: { workDuration: 25, breakDuration: 5, longBreakDuration: 15, cyclesBeforeLongBreak: 4 },
    },
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [standAloneWork, setStandAloneWork] = useState<Work | null>(null);

  // ---- UI state ----
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [workFormOpen, setWorkFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | undefined>();
  const [taskPomodoroOverrides, setTaskPomodoroOverrides] = useState<Record<string, PomodoroSettings>>({});

  // ---- Refs ----
  const timerRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);

  // ---- Derived ----
  const activeTask = tasks.find(t => t._id === activeTaskId) || null;
  const activePomodoroSettings = (activeTaskId && taskPomodoroOverrides[activeTaskId]) || user.preferences.pomodoroSettings;
  const standaloneTasks = useMemo(() => tasks.filter(t => t.workId === standAloneWork?._id), [tasks]); // Edited here for standalone id. It was !t.workId before.
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(t => t.dueAt && new Date(t.dueAt) < new Date() && t.status !== 'done').length;
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const characterStats = useMemo(
    () => ({ completionRate, overdueTasks, streak: user.streak, isOnBreak: false, totalTasks }),
    [completionRate, overdueTasks, user.streak, totalTasks]
  );

  // ---- Pomodoro hook ----
  const pomodoro = usePomodoro({
    ...activePomodoroSettings,
    onPomodoroComplete: () => {
      if (activeTaskId) {
        handleIncrementPomodoro(activeTaskId);
        toast({ title: '🍅 Pomodoro Complete!', description: 'Time for a break.' });
      }
    },
  });

  // Update character stats with break info
  const characterStatsWithBreak = useMemo(
    () => ({ ...characterStats, isOnBreak: pomodoro.mode !== 'work' }),
    [characterStats, pomodoro.mode]
  );

  // ---- Active task change → reset + start timer ----
  const prevActiveTaskId = useRef<string | null>(null);
  useEffect(() => {
    if (activeTaskId && activeTaskId !== prevActiveTaskId.current) {
      pomodoro.reset();
      pomodoro.start();
    }
    prevActiveTaskId.current = activeTaskId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskId]);

  // ---- Rank change demo listener ----
  useEffect(() => {
    const handler = (e: Event) => {
      const rank = (e as CustomEvent).detail as 1 | 2 | 3;
      setUser(prev => ({ ...prev, rank }));
    };
    window.addEventListener('rank-change', handler);
    return () => window.removeEventListener('rank-change', handler);
  }, []);

  // ---- Load initial data ----
  useEffect(() => {
    Promise.all([fetchCurrentUser(), fetchTasks(), fetchWorks(), fetchMessages()])
      .then(([u, t, w, m]) => {
        setUser(u);
        setTasks(t);
        setWorks(w);
        if (m) {
          setCharacterMessages(m);
        }
        for (const work of w) {
          if (work.name === "Standalone") {
            setStandAloneWork(work);
            break;
          }
        }

      })
      .finally(() => setLoading(false));
  }, []);

  // ---- Handlers ----
  const handleStartPomodoro = useCallback((taskId: string) => {
    setActiveTaskId(taskId);
    timerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleTimerPlayPause = useCallback(() => {
    if (pomodoro.isRunning) {
      pomodoro.pause();
    } else if (activeTaskId) {
      pomodoro.start();
    } else {
      taskListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodoro.isRunning, activeTaskId]);

  const handleCreateTask = async (data: CreateTaskInput) => {
    const newTask = await createTask(data);
    setTasks(prev => [...prev, newTask]);
    setTaskFormOpen(false);
    toast({ title: 'Task created!' });
  };

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    const updated = await updateTask(id, data as CreateTaskInput);
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
    setEditingTask(null);
    toast({ title: 'Task updated!' });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
      pomodoro.reset();
    }
  };

  const handleMarkComplete = async (id: string) => {
    const { task, user: updatedUser } = await markTaskComplete(id);
    setTasks(prev => prev.map(t => (t._id === id ? task : t)));
    if (updatedUser) setUser(updatedUser);
    toast({ title: '✅ Task completed!' });
  };

  const handleIncrementPomodoro = async (id: string) => {
    const duration = activePomodoroSettings.workDuration;
    const { task, user: updatedUser } = await incrementPomodoro(id, duration);
    setTasks(prev => prev.map(t => (t._id === id ? task : t)));
    if (updatedUser) setUser(updatedUser);

    // If all pomodoros completed, deselect the task (timer continues its break naturally)
    if (task.pomodoroCompleted >= task.totalPomodoros) {
      setActiveTaskId(null);
      toast({ title: '🎉 Task Completed!', description: 'All pomodoro cycles done. Pick a new task to continue.' });
    }
  };

  const handleCreateWork = async (data: { name: string; color: string }) => {
    const newWork = await createWork(data);
    setWorks(prev => [...prev, newWork]);
    setWorkFormOpen(false);
    toast({ title: 'Workspace created!' });
  };

  const handleDeleteWork = async (id: string) => {
    await deleteWork(id);
    setWorks(prev => prev.filter(w => w._id !== id));
  };

  const handleUpdatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = await updateUserPreferences(prefs);
    setUser(updated);
    toast({ title: 'Settings saved!' });
  };

  const handleUpdatePomodoroSettings = useCallback((taskId: string, settings: PomodoroSettings) => {
    setTaskPomodoroOverrides(prev => ({ ...prev, [taskId]: settings }));
  }, []);

  const handleUploadAttachment = useCallback(async (taskId: string, file: File) => {
    const data = await uploadAttachment(taskId, file);
    const updated = (data as any).task;
    setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
  }, []);

  const handleDeleteAttachment = useCallback(async (taskId: string, index: number) => {
    const data = await deleteAttachment(taskId, index);
    const updated = (data as any).task;
    setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${getRankClass(user.rank)}`}>
      <RankBackground rank={user.rank} />

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* ---- Header: Character + Timer + Settings ---- */}
        <header className="grid grid-cols-1 lg:grid-cols-[260px_1fr_auto] gap-4 lg:gap-6 items-start">
          <MotivationalCharacter
            reactionMode={user.preferences.reactionMode}
            stats={characterStatsWithBreak}
          />

          <div ref={timerRef}>
            <PomodoroTimer
              timeRemaining={pomodoro.timeRemaining}
              totalTime={pomodoro.totalTime}
              isRunning={pomodoro.isRunning}
              mode={pomodoro.mode}
              currentCycle={pomodoro.currentCycle}
              cyclesBeforeLongBreak={activePomodoroSettings.cyclesBeforeLongBreak}
              activeTask={activeTask}
              onPlayPause={handleTimerPlayPause}
              onReset={() => pomodoro.reset()}
              onSkip={() => pomodoro.skip()}
            />
          </div>

          <div className="hidden lg:flex flex-col gap-2">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Mobile settings/logout buttons */}
        <div className="flex justify-end gap-2 lg:hidden">
          <Button variant="glass" size="sm" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-1" /> Settings
          </Button>
        </div>

        {/* ---- Workspaces ---- */}
        <section ref={taskListRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Workspaces</h2>
            <Button variant="glass" size="sm" onClick={() => setWorkFormOpen(true)} className="text-xs">
              <Plus className="w-3 h-3" /> New Workspace
            </Button>
          </div>

          {works
            .filter(work => work.name !== "Standalone")
            .map(work => (
              <WorkFolder
                key={work._id}
                work={work}
                tasks={tasks.filter(t => t.workId === work._id)}
                activeTaskId={activeTaskId}
                onStartPomodoro={handleStartPomodoro}
                onMarkComplete={handleMarkComplete}
                onEditTask={task => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
                onDeleteWork={handleDeleteWork}
                onCreateTask={() => {
                  setSelectedWorkId(work._id);
                  setTaskFormOpen(true);
                }}
                onUpdatePomodoroSettings={handleUpdatePomodoroSettings}
                onUploadAttachment={handleUploadAttachment}
                onDeleteAttachment={handleDeleteAttachment}
                pomodoroOverrides={taskPomodoroOverrides}
                defaultPomodoroSettings={user.preferences.pomodoroSettings}
              />
            ))}

          {works.length === 0 && (
            <div className="glass-subtle rounded-xl p-6 text-center text-sm text-muted-foreground">
              No workspaces yet. Create one to group your tasks!
            </div>
          )}
        </section>

        {/* ---- Standalone Tasks ---- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Tasks</h2>
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                setSelectedWorkId(standAloneWork?._id);
                setTaskFormOpen(true);
              }}
              className="text-xs"
            >
              <Plus className="w-3 h-3" /> New Task
            </Button>
          </div>

          {standaloneTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              isActive={activeTaskId === task._id}
              onStartPomodoro={() => handleStartPomodoro(task._id)}
              onMarkComplete={() => handleMarkComplete(task._id)}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDeleteTask(task._id)}
              onUpdatePomodoroSettings={settings => handleUpdatePomodoroSettings(task._id, settings)}
              onUploadAttachment={file => handleUploadAttachment(task._id, file)}
              onDeleteAttachment={index => handleDeleteAttachment(task._id, index)}
              pomodoroOverride={taskPomodoroOverrides[task._id]}
              defaultPomodoroSettings={user.preferences.pomodoroSettings}
            />
          ))}

          {standaloneTasks.length === 0 && (
            <div className="glass-subtle rounded-xl p-6 text-center text-sm text-muted-foreground">
              No standalone tasks. Create one above!
            </div>
          )}
        </section>
      </div>

      {/* ---- Modals ---- */}
      <TaskFormModal
        open={taskFormOpen || !!editingTask}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={
          editingTask
            ? data => handleUpdateTask(editingTask._id, data)
            : handleCreateTask
        }
        works={works}
        editingTask={editingTask}
        defaultWorkId={selectedWorkId}
      />

      <WorkFormModal
        open={workFormOpen}
        onClose={() => setWorkFormOpen(false)}
        onSubmit={handleCreateWork}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUpdatePreferences={handleUpdatePreferences}
      />
    </div>
  );
};

export default Dashboard;
