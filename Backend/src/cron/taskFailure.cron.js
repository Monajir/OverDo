import cron from 'node-cron'
import Task from '../models/taskModel.js'
import User from '../models/userModel.js'

cron.schedule('0 */2 * * *', async () => { // Runs every 2 hours
    try {
        const tasks = await Task.find({ status: 'todo', dueAt: { $lt: new Date() } })
        for (const task of tasks) {
            task.status = 'failed'
            await task.save()

            const user = await User.findById(task.user).select('-password')
            user.xp -= 5
            if (user.xp < 0) {
                user.xp = 0
                user.rank -= 1
                if (user.rank < 1) {
                    user.rank = 1
                }
            }
            user.streak = 0
            await user.save()
        }
    } catch (err) {
        console.error('Error in task failure cron:', err)
    }
})