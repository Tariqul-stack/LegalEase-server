const express = require('express');
const router = express.Router();
const Lawyer = require('../models/lawyer.model');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// GET all lawyers (public)
router.get('/', async (req, res) => {
    try {
        const lawyers = await Lawyer.find({ isPublished: true });
        res.status(200).json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET single lawyer (public)
router.get('/:id', async (req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.params.id);
        if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
        res.status(200).json(lawyer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// CREATE lawyer profile (lawyer only)
router.post('/', verifyToken, checkRole('lawyer', 'admin'), async (req, res) => {
    try {
        const { name, email, photo, bio, specialization, consultationFee } = req.body;
        const lawyer = await Lawyer.create({
            userId: req.user.id,
            name,
            email,
            photo,
            bio,
            specialization,
            consultationFee,
        });
        res.status(201).json({ message: 'Lawyer profile created', lawyer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// UPDATE lawyer profile (lawyer only)
router.put('/:id', verifyToken, checkRole('lawyer', 'admin'), async (req, res) => {
    try {
        const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Lawyer profile updated', lawyer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE lawyer profile (admin only)
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        await Lawyer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Lawyer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;