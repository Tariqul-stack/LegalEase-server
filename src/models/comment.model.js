const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientPhoto: {
        type: String,
        default: '',
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);