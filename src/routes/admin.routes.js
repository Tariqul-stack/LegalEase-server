const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Lawyer = require('../models/lawyer.model');
const Hiring = require('../models/hiring.model');
const Transaction = require('../models/transaction.model');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// GET all users
router.get('/users', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// CHANGE user role
router.patch('/users/:id/role', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.status(200).json({ message: 'Role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE user
router.delete('/users/:id', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET all transactions
router.get('/transactions', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET analytics
router.get('/analytics', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalLawyers = await User.countDocuments({ role: 'lawyer' });
        const totalHires = await Hiring.countDocuments();
        const transactions = await Transaction.find();
        const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

        res.status(200).json({
            totalUsers,
            totalLawyers,
            totalHires,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;