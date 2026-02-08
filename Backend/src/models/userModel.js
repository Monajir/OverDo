import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    rank: { type: Number, default: 1 }, // 1 = Novice, 2 = Journeyman, 3 = Legend
    xp: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    preferences: {
        reactionMode: {
            type: String,
            enum: ['friendly', 'sarcastic', 'aggressive'],
            default: 'friendly'
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        pomodoroSettings: {
            workDuration: {
                type: Number, default: 25
            },
            breakDuration: {
                type: Number, default: 5
            },
            longBreakDuration: {
                type: Number, default: 15
            },
            cyclesBeforeLongBreak: {
                type: Number, default: 4
            }
        }
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User
