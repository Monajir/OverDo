import mongoose from "mongoose";

const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    mimeType: {
        type: String
    },
    size: {
        type: Number
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false })


const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Work',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done', 'failed'],
        default: 'todo'
    },
    dueAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    totalPomodoros: {
        type: Number,
        default: 1
    },
    pomodoroCompleted: {
        type: Number,
        default: 0
    },
    attachments: {
        type: [attachmentSchema],
        default: []
    }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)

export default Task