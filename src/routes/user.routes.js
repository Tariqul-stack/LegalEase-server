const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const verifyToken = require('../middleware/verifyToken');

// GET user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// UPDATE user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, photo } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, photo },
            { new: true }
        ).select('-password');
        res.status(200).json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;