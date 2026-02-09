import Task from '../models/taskModel.js'
import Pomodoro from '../models/pomodoroModel.js'

export async function getWeeklyReport(req, res) {
    try {
        const userId = req.userId
        const end = new Date()
        const start = new Date(end)
        start.setDate(end.getDate() - 7)

        const [totalTasks, completedTasks, failedTasks, pomodoros] = await Promise.all([
            Task.countDocuments({ user: userId, createdAt: { $gte: start } }),
            Task.countDocuments({ user: userId, status: 'done', completedAt: { $gte: start } }),
            Task.countDocuments({ user: userId, status: 'failed', updatedAt: { $gte: start } }),
            Pomodoro.find({ user: userId, endedAt: { $gte: start } }).select('duration')
        ])

        const focusMinutes = pomodoros.reduce((sum, item) => sum + (item.duration || 0), 0)

        res.json({
            range: { start: start.toISOString(), end: end.toISOString() },
            totalTasks,
            completedTasks,
            failedTasks,
            totalPomodoros: pomodoros.length,
            focusMinutes
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch weekly report' })
    }
}
