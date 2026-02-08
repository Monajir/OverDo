import Task from '../models/taskModel.js'
import Pomodoro from '../models/pomodoroModel.js'
import User from '../models/userModel.js'
import Work from '../models/workModel.js'

export async function getAllTasks(req, res) {
    try {
        const tasks = await Task.find({ user: req.userId }) // User id is stored as user in the task schema
        const pomodoros = await Pomodoro.find({ user: req.userId })
        res.json({ tasks, pomodoros })
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks' })
    }
}

export async function createNewTask(req, res) {
    try {
        const { title, description, priority, dueAt, workId, totalPomodoros } = req.body

        if (!workId) {
            const standalonework = await Work.findOne({
                user: req.userId,
                name: 'Standalone'
            })
            if (!standalonework) {
                return res.status(400).json({
                    message: 'Standalone work not found, please create or choose one Work folder first'
                })
            }
            workId = standalonework._id
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueAt,
            workId,
            totalPomodoros: totalPomodoros || 1,
            user: req.userId,
            status: 'todo'
        })
        res.json(task)
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create task' })
    }
}

export async function updateTask(req, res) {
    try {
        const { title, description, priority, dueAt, status, completedAt, workId, totalPomodoros, pomodoroCompleted } = req.body
        const update = {}

        if (title !== undefined) update.title = title
        if (description !== undefined) update.description = description
        if (priority !== undefined) update.priority = priority
        if (dueAt !== undefined) update.dueAt = dueAt
        if (status !== undefined) update.status = status
        if (completedAt !== undefined) update.completedAt = completedAt
        if (workId !== undefined) update.workId = workId
        if (totalPomodoros !== undefined) update.totalPomodoros = totalPomodoros
        if (pomodoroCompleted !== undefined) update.pomodoroCompleted = pomodoroCompleted

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { $set: update },
            { new: true, runValidators: true }
        )

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.json(task)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function deleteTask(req, res) {
    try {
        const task = await Task.findByIdAndDelete({ _id: req.params.id, user: req.userId })
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }
        res.json(task)
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete task' })
    }
}

export async function completeTask(req, res) {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId })
        const user = await User.findById(task.user).select('-password')

        if (task.status == 'done') {
            return res.status(400).json({ message: 'Task is already completed' })
        }

        const completedAt = new Date()

        const onTime = completedAt <= task.dueAt

        task.status = 'done'
        task.completedAt = completedAt
        await task.save()

        if (completedAt <= task.dueAt) {
            user.xp += 10
            if (user.xp >= 100) {
                user.rank += 1
                user.xp = 0
            }
            user.streak += 1
        } else {
            user.xp += 5
            if (user.xp >= 100) {
                user.rank += 1
                user.xp = 0
            }
            user.streak = 0
        }

        await user.save()

        res.status(200).json({ task: task, onTime: onTime, reactionMessage: (onTime ? 'Good job!' : 'You can do better next time!') })
    } catch (err) {
        res.status(500).json({ message: 'Failed to complete task' })
    }
}

export async function completePomodoro(req, res) {

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId })
        const user = await User.findById(task.user).select('-password')
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.pomodoroCompleted >= task.totalPomodoros) {
            return res.status(400).json({ message: 'Task is already completed' })
        }

        // Create Pomodoro record (EVENT LOG)
        const pomodoro = await Pomodoro.create({
            user: req.userId,
            task: task._id,
            duration: task.pomodoroDuration || 25,
            startedAt: new Date(Date.now() - (25 * 60 * 1000)),
            endedAt: new Date(),
            completed: true
        })

        task.pomodoroCompleted += 1

        if (task.pomodoroCompleted === 1) {
            task.status = 'inprogress'
        }

        if (task.pomodoroCompleted === task.totalPomodoros) {
            task.status = 'done'
            const completedAt = new Date()

            const onTime = completedAt <= task.dueAt

            task.completedAt = completedAt
            await task.save()

            if (completedAt <= task.dueAt) {
                user.xp += 10
                if (user.xp >= 100) {
                    user.rank += 1
                    user.xp = 0
                }
                user.streak += 1
            } else {
                user.xp += 5
                if (user.xp >= 100) {
                    user.rank += 1
                    user.xp = 0
                }
                user.streak = 0
            }

            await user.save()
        }
        await task.save()
        res.status(200).json({ message: 'Pomodoro completed', pomodoro: pomodoro, task: task })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update pomodoro count' })
    }
}