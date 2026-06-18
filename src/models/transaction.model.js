const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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
    hiringId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hiring',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    lawyerEmail: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);