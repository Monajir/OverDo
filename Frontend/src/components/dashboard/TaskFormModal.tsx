import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Task, Work, CreateTaskInput } from '@/types';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
  works: Work[];
  editingTask?: Task | null;
  defaultWorkId?: string;
}

export const TaskFormModal = ({
  open,
  onClose,
  onSubmit,
  works,
  editingTask,
  defaultWorkId,
}: TaskFormModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [totalPomodoros, setTotalPomodoros] = useState(1);
  const [workId, setWorkId] = useState<string | undefined>();

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueAt ? new Date(editingTask.dueAt) : undefined);
      setTotalPomodoros(editingTask.totalPomodoros);
      setWorkId(editingTask.workId);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(undefined);
      setTotalPomodoros(1);
      setWorkId(defaultWorkId);
    }
  }, [editingTask, defaultWorkId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description,
      priority,
      dueAt: dueDate?.toISOString(),
      totalPomodoros,
      workId: workId === '_none' ? undefined : workId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-modal rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editingTask ? 'Edit Task' : 'New Task'}
          </DialogTitle>
          <DialogDescription>
            {editingTask ? 'Update the details of your task.' : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08]"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              placeholder="Add details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <Select value={priority} onValueChange={v => setPriority(v as Task['priority'])}>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-white/[0.1]">
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pomodoro Cycles */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Pomodoro Cycles</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={totalPomodoros}
                onChange={e => setTotalPomodoros(Number(e.target.value) || 1)}
                className="bg-white/[0.04] border-white/[0.08]"
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-white/[0.04] border-white/[0.08]',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-white/[0.1]" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={{ before: new Date() }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Workspace */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Workspace (optional)</Label>
            <Select value={workId || '_none'} onValueChange={v => setWorkId(v === '_none' ? undefined : v)}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue placeholder="Standalone task" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-white/[0.1]">
                {/* <SelectItem value="_none">None (Standalone)</SelectItem> */}
                {works.map(w => (
                  <SelectItem key={w._id} value={w._id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={(w.name === "Standalone") ? { display: "none" } : { backgroundColor: w.color }}
                      />
                      {w.name === "Standalone" ? "None (Standalone)" : w.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow">
              {editingTask ? 'Update' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
