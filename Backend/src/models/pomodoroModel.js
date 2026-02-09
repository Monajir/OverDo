import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pomodoroSchema = new Schema({
    
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },

        // // Max pomodoro cycles required
        // pomodoroCycles: {
        //     type: Number,
        //     required: true
        // },
        // // Pomodoros completed
        // pomodoroCount: {
        //     type: Number,
        //     default: 0
        // },

        duration: {
            type: Number, // Minutes
            required: true
        },

}, { timestamps: true });

export default mongoose.model('Pomodoro', pomodoroSchema);