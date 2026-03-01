import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import type { Work, Task, PomodoroSettings } from '@/types';

interface WorkFolderProps {
  work: Work;
  tasks: Task[];
  activeTaskId: string | null;
  onStartPomodoro: (taskId: string) => void;
  onMarkComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteWork: (workId: string) => void;
  onCreateTask: () => void;
  onUpdatePomodoroSettings: (taskId: string, settings: PomodoroSettings) => void;
  onUploadAttachment: (taskId: string, file: File) => Promise<void>;
  onDeleteAttachment: (taskId: string, index: number) => Promise<void>;
  pomodoroOverrides: Record<string, PomodoroSettings>;
  defaultPomodoroSettings: PomodoroSettings;
}

export const WorkFolder = ({
  work,
  tasks,
  activeTaskId,
  onStartPomodoro,
  onMarkComplete,
  onEditTask,
  onDeleteTask,
  onDeleteWork,
  onCreateTask,
  onUpdatePomodoroSettings,
  onUploadAttachment,
  onDeleteAttachment,
  pomodoroOverrides,
  defaultPomodoroSettings,
}: WorkFolderProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: work.color }}
        />
        <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="font-medium flex-1 text-left text-sm">{work.name}</span>
        <span className="text-xs text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks in this workspace yet.
                </p>
              )}
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isActive={activeTaskId === task._id}
                  onStartPomodoro={() => onStartPomodoro(task._id)}
                  onMarkComplete={() => onMarkComplete(task._id)}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task._id)}
                  onUpdatePomodoroSettings={settings => onUpdatePomodoroSettings(task._id, settings)}
                  onUploadAttachment={file => onUploadAttachment(task._id, file)}
                  onDeleteAttachment={index => onDeleteAttachment(task._id, index)}
                  pomodoroOverride={pomodoroOverrides[task._id]}
                  defaultPomodoroSettings={defaultPomodoroSettings}
                />
              ))}
              <div className="flex gap-2">
                <Button variant="glass" size="sm" onClick={onCreateTask} className="flex-1 text-xs">
                  <Plus className="w-3 h-3" /> Add Task
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteWork(work._id)}
                  className="text-destructive hover:text-destructive text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
