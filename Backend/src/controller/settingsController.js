import User from "../models/userModel.js"

export async function getSettings(req, res) {
    try {
        const user = await User.findById(req.userId).select('preferences');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.preferences ? { mood: user.preferences.reactionMode, defaultPomodoroSettings: user.preferences.pomodoroSettings } : { mood: 'friendly', defaultPomodoroSettings: { workDuration: 25, breakDuration: 5, longBreakDuration: 15, cyclesBeforeLongBreak: 4 } })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
}

export async function updateSettings(req, res) {
    try {
        const { mood, defaultPomodoroSettings } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { preferences: { reactionMode: mood, pomodoroSettings: defaultPomodoroSettings } } },
            { new: true, runValidators: true }
        ).select('preferences');

        res.json(user.preferences ? { mood: user.preferences.reactionMode, defaultPomodoroSettings: user.preferences.pomodoroSettings } : { mood: 'friendly', defaultPomodoroSettings: { workDuration: 25, breakDuration: 5, longBreakDuration: 15, cyclesBeforeLongBreak: 4 } });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings' });
    }
}