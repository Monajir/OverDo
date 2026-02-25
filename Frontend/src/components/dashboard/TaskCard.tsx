import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pencil, Check, Trash2, ChevronDown, Clock, Timer, Paperclip, Upload, File, FileText, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task, PomodoroSettings } from '@/types';

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  onStartPomodoro: () => void;
  onMarkComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdatePomodoroSettings: (settings: PomodoroSettings) => void;
  onUploadAttachment: (file: File) => Promise<void>;
  onDeleteAttachment: (index: number) => Promise<void>;
  pomodoroOverride?: PomodoroSettings;
  defaultPomodoroSettings: PomodoroSettings;
}

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
  urgent: 'Urgent',
};

const statusLabels: Record<Task['status'], string> = {
  todo: 'Todo',
  inprogress: 'In Progress',
  done: 'Done',
  failed: 'Failed',
};

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText;
  return File;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const TaskCard = ({
  task,
  isActive,
  onStartPomodoro,
  onMarkComplete,
  onEdit,
  onDelete,
  onUpdatePomodoroSettings,
  onUploadAttachment,
  onDeleteAttachment,
  pomodoroOverride,
  defaultPomodoroSettings,
}: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSettings = pomodoroOverride || defaultPomodoroSettings;
  const pomodoroProgress =
    task.totalPomodoros > 0 ? (task.pomodoroCompleted / task.totalPomodoros) * 100 : 0;

  const handleSettingsChange = (partial: Partial<PomodoroSettings>) => {
    onUpdatePomodoroSettings({ ...currentSettings, ...partial });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUploadAttachment(file);
      setShowAttachments(true);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isImage = (mimeType?: string) => mimeType?.startsWith('image/');

  return (
    <div
      className={cn(
        'glass rounded-xl overflow-hidden transition-all',
        isActive && 'glow ring-1 ring-primary/50',
        task.status === 'done' && 'opacity-60'
      )}
    >
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 md:p-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        {/* Priority badge */}
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
          style={{
            backgroundColor: `hsl(var(--priority-${task.priority}) / 0.15)`,
            color: `hsl(var(--priority-${task.priority}))`,
          }}
        >
          {priorityLabels[task.priority]}
        </span>

        {/* Title + progress */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', task.status === 'done' && 'line-through')}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 max-w-[120px] h-1 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pomodoroProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {task.pomodoroCompleted}/{task.totalPomodoros} 🍅
            </span>
          </div>
        </div>

        {/* Due date */}
        {task.dueAt && (
          <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">
            {format(new Date(task.dueAt), 'MMM d')}
          </span>
        )}

        {/* Status */}
        <span
          className="text-[10px] font-medium shrink-0"
          style={{
            color:
              task.status === 'done'
                ? 'hsl(var(--status-done))'
                : task.status === 'failed'
                  ? 'hsl(var(--status-failed))'
                  : task.status === 'inprogress'
                    ? 'hsl(var(--rank-accent))'
                    : 'hsl(var(--muted-foreground))',
          }}
        >
          {statusLabels[task.status]}
        </span>

        {/* Expand icon */}
        <ChevronDown
          className={cn('w-4 h-4 text-muted-foreground transition-transform shrink-0', isExpanded && 'rotate-180')}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
              )}

              {/* Info row */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" /> {task.pomodoroCompleted}/{task.totalPomodoros} completed
                </span>
                {task.dueAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {format(new Date(task.dueAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {task.status !== 'done' && (
                  <>
                    <Button variant="glass" size="sm" onClick={onStartPomodoro} className="text-xs">
                      <Play className="w-3 h-3" /> Start Pomodoro
                    </Button>
                    <Button variant="glass" size="sm" onClick={onMarkComplete} className="text-xs">
                      <Check className="w-3 h-3" /> Complete
                    </Button>
                  </>
                )}
                <Button variant="glass" size="sm" onClick={onEdit} className="text-xs">
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="text-xs"
                >
                  <Paperclip className="w-3 h-3" />
                  {showAttachments ? 'Hide' : 'Show'} Attachments
                  {task.attachments.length > 0 && ` (${task.attachments.length})`}
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs"
                >
                  <Upload className="w-3 h-3" /> {uploading ? 'Uploading…' : 'Upload'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-xs text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <AnimatePresence>
                {showAttachments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Attachments
                      </p>
                      {task.attachments.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">No attachments yet.</p>
                      ) : (
                        task.attachments.map((att, index) => {
                          const IconComp = getFileIcon(att.mimeType);
                          return (
                            <div
                              key={att.filename}
                              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                            >
                              <IconComp className="w-4 h-4 text-muted-foreground shrink-0" />
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-0 text-xs font-medium truncate hover:underline"
                                onClick={(e) => {
                                  if (isImage(att.mimeType)) {
                                    e.preventDefault();
                                    window.open(att.url, '_blank');
                                  }
                                }}
                              >
                                {att.filename}
                              </a>
                              {att.size && (
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {formatFileSize(att.size)}
                                </span>
                              )}
                              <button
                                onClick={() => onDeleteAttachment(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/[0.08]"
                                title="Remove attachment"
                              >
                                <X className="w-3 h-3 text-destructive" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Per-task pomodoro settings */}
              {task.status !== 'done' && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    Timer Settings
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-xs text-muted-foreground">Work</Label>
                      <Input
                        type="number"
                        className="w-14 h-7 text-xs bg-white/[0.04] border-white/[0.08]"
                        value={currentSettings.workDuration}
                        onChange={e => handleSettingsChange({ workDuration: Number(e.target.value) || 1 })}
                        min={1}
                        max={120}
                      />
                      <span className="text-[10px] text-muted-foreground">min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Label className="text-xs text-muted-foreground">Break</Label>
                      <Input
                        type="number"
                        className="w-14 h-7 text-xs bg-white/[0.04] border-white/[0.08]"
                        value={currentSettings.breakDuration}
                        onChange={e => handleSettingsChange({ breakDuration: Number(e.target.value) || 1 })}
                        min={1}
                        max={60}
                      />
                      <span className="text-[10px] text-muted-foreground">min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};
