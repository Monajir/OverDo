import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const workSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#FF6B35'
    }
}, { timestamps: true });

const Work = mongoose.model('Work', workSchema);

export default Work;
