const express = require('express');
const router = express.Router();
const Hiring = require('../models/hiring.model');
const Lawyer = require('../models/lawyer.model');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// CREATE hiring request (user only)
router.post('/', verifyToken, checkRole('user'), async (req, res) => {
    try {
        const { lawyerId, clientName, clientEmail, lawyerName, specialization, fee } = req.body;

        const hiring = await Hiring.create({
            userId: req.user.id,
            lawyerId,
            clientName,
            clientEmail,
            lawyerName,
            specialization,
            fee,
        });

        res.status(201).json({ message: 'Hiring request sent', hiring });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET hiring history for user
router.get('/user', verifyToken, checkRole('user'), async (req, res) => {
    try {
        const hirings = await Hiring.find({ userId: req.user.id });
        res.status(200).json(hirings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET hiring requests for lawyer
router.get('/lawyer', verifyToken, checkRole('lawyer'), async (req, res) => {
    try {
        const lawyer = await Lawyer.findOne({ userId: req.user.id });
        if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });

        const hirings = await Hiring.find({ lawyerId: lawyer._id });
        res.status(200).json(hirings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ACCEPT or REJECT hiring request (lawyer only)
router.patch('/:id/status', verifyToken, checkRole('lawyer'), async (req, res) => {
    try {
        const { status } = req.body;
        const hiring = await Hiring.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({ message: `Hiring ${status}`, hiring });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;