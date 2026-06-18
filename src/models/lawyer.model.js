const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    specialization: {
        type: String,
        required: true,
    },
    consultationFee: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'busy'],
        default: 'available',
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    totalHires: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Lawyer', lawyerSchema);