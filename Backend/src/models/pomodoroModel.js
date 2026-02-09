import mongoose from 'mongoose'

const Schema = mongoose.Schema

const pomodoroSchema = new Schema({

}, { timestamps: true });

export default mongoose.model('Pomodoro', pomodoroSchema);