import User from '../models/userModel.js'
import Task from '../models/taskModel.js'
import Work from '../models/workModel.js'
import Pomodoro from '../models/pomodoroModel.js'

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.userId).select('-password'); // It tells mongoose to exclude the password field in the return
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.userId);
        await Task.deleteMany({ user: req.userId });
        await Work.deleteMany({ user: req.userId });
        await Pomodoro.deleteMany({ user: req.userId });
        res.json({ message: 'User deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}