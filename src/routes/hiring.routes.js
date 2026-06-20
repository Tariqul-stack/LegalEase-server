const express = require('express');
const router = express.Router();
const Hiring = require('../models/hiring.model');
const Lawyer = require('../models/lawyer.model');
const Transaction = require('../models/transaction.model');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// CREATE Stripe payment intent
router.post('/:id/pay', verifyToken, async (req, res) => {
    try {
        const hiring = await Hiring.findById(req.params.id);
        if (!hiring) return res.status(404).json({ message: 'Hiring not found' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: hiring.fee * 100,
            currency: 'usd',
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// CONFIRM successful payment
router.post('/:id/confirm-payment', verifyToken, async (req, res) => {
    try {
        const { transactionId } = req.body;
        if (!transactionId) return res.status(400).json({ message: 'Transaction ID is required' });

        const hiring = await Hiring.findById(req.params.id);
        if (!hiring) return res.status(404).json({ message: 'Hiring not found' });

        hiring.isPaid = true;
        await hiring.save();

        const lawyer = await Lawyer.findById(hiring.lawyerId);
        if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });

        await Transaction.create({
            userId: hiring.userId,
            lawyerId: hiring.lawyerId,
            hiringId: hiring._id,
            userEmail: hiring.clientEmail,
            lawyerEmail: lawyer.email,
            amount: hiring.fee,
            transactionId,
        });

        res.status(200).json({ message: 'Payment confirmed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
