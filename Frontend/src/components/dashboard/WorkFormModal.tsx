import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const presetColors = ['#FF6B35', '#4ECDC4', '#7C5CFC', '#F72585', '#4CC9F0', '#FFBE0B', '#06D6A0', '#EF476F'];

interface WorkFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
}

export const WorkFormModal = ({ open, onClose, onSubmit }: WorkFormModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(presetColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
    setName('');
    setColor(presetColors[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-modal rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your related tasks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              placeholder="e.g. Frontend Dev, Study..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08]"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
