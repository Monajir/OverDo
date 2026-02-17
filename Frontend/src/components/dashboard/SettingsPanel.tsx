import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Flame, Star, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import type { User, UserPreferences, PomodoroSettings } from '@/types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const rankNames: Record<number, string> = { 1: 'Novice', 2: 'Journeyman', 3: 'Legend' };
const rankIcons: Record<number, React.ReactNode> = {
  1: <Star className="w-4 h-4" />,
  2: <Flame className="w-4 h-4" />,
  3: <Trophy className="w-4 h-4" />,
};

export const SettingsPanel = ({ open, onClose, user, onUpdatePreferences }: SettingsPanelProps) => {
  const { logoutUser } = useAuth();
  const [pomSettings, setPomSettings] = useState<PomodoroSettings>(user.preferences.pomodoroSettings);

  useEffect(() => {
    setPomSettings(user.preferences.pomodoroSettings);
  }, [user.preferences.pomodoroSettings]);

  const handlePomodoroSave = () => {
    onUpdatePreferences({ pomodoroSettings: pomSettings });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="glass-modal border-l-white/[0.08] w-[320px] sm:w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Settings</SheetTitle>
          <SheetDescription>
            Manage your account preferences, rank preview, and Pomodoro timer settings.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* User Stats */}
          <div className="glass-subtle rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              {rankIcons[user.rank]}
              {rankNames[user.rank]} Rank
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">{user.xp}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold font-mono">{user.streak}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Streak 🔥
                </p>
              </div>
            </div>
          </div>

          {/* Reaction Mode */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Motivation Style</Label>
            <Select
              value={user.preferences.reactionMode}
              onValueChange={v => onUpdatePreferences({ reactionMode: v as UserPreferences['reactionMode'] })}
            >
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-white/[0.1]">
                <SelectItem value="friendly">😊 Friendly</SelectItem>
                <SelectItem value="sarcastic">😏 Sarcastic</SelectItem>
                <SelectItem value="aggressive">😤 Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pomodoro Defaults */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Default Timer Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Work
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={pomSettings.workDuration}
                    onChange={e => setPomSettings(p => ({ ...p, workDuration: Number(e.target.value) || 1 }))}
                    className="bg-white/[0.04] border-white/[0.08] h-8 text-sm"
                    min={1}
                    max={120}
                  />
                  <span className="text-[10px] text-muted-foreground">min</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Break
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={pomSettings.breakDuration}
                    onChange={e => setPomSettings(p => ({ ...p, breakDuration: Number(e.target.value) || 1 }))}
                    className="bg-white/[0.04] border-white/[0.08] h-8 text-sm"
                    min={1}
                    max={60}
                  />
                  <span className="text-[10px] text-muted-foreground">min</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Long Break
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={pomSettings.longBreakDuration}
                    onChange={e =>
                      setPomSettings(p => ({ ...p, longBreakDuration: Number(e.target.value) || 1 }))
                    }
                    className="bg-white/[0.04] border-white/[0.08] h-8 text-sm"
                    min={1}
                    max={60}
                  />
                  <span className="text-[10px] text-muted-foreground">min</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Cycles
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={pomSettings.cyclesBeforeLongBreak}
                    onChange={e =>
                      setPomSettings(p => ({
                        ...p,
                        cyclesBeforeLongBreak: Number(e.target.value) || 1,
                      }))
                    }
                    className="bg-white/[0.04] border-white/[0.08] h-8 text-sm"
                    min={1}
                    max={10}
                  />
                </div>
              </div>
            </div>
            <Button variant="glass" size="sm" onClick={handlePomodoroSave} className="w-full">
              Save Timer Defaults
            </Button>
          </div>

          {/* Rank Change (for demo) */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preview Rank (demo)</Label>
            <Select
              value={String(user.rank)}
              onValueChange={v => {
                // This is a demo feature - in production, rank comes from the backend
                const fakeEvent = new CustomEvent('rank-change', { detail: Number(v) });
                window.dispatchEvent(fakeEvent);
              }}
            >
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-white/[0.1]">
                <SelectItem value="1">⭐ Novice</SelectItem>
                <SelectItem value="2">🔥 Journeyman</SelectItem>
                <SelectItem value="3">🏆 Legend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <Button
              variant="outline"
              size="sm"
              onClick={logoutUser}
              className="w-full text-destructive hover:bg-destructive/10 border-white/[0.08]"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
