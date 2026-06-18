const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.model');
const Hiring = require('../models/hiring.model');
const Lawyer = require('../models/lawyer.model');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// CREATE comment (only hired users)
router.post('/', verifyToken, checkRole('user'), async (req, res) => {
    try {
        const { lawyerId, clientName, clientPhoto, comment } = req.body;

        // Check if user has hired this lawyer
        const hiring = await Hiring.findOne({
            userId: req.user.id,
            lawyerId,
            status: 'accepted',
        });

        if (!hiring) {
            return res.status(403).json({ message: 'You can only comment after hiring this lawyer' });
        }

        const newComment = await Comment.create({
            userId: req.user.id,
            lawyerId,
            clientName,
            clientPhoto,
            comment,
        });

        res.status(201).json({ message: 'Comment added', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET comments for a lawyer (public)
router.get('/:lawyerId', async (req, res) => {
    try {
        const comments = await Comment.find({ lawyerId: req.params.lawyerId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET logged in user's comments
router.get('/user/my-comments', verifyToken, checkRole('user'), async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.user.id });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// UPDATE comment (user only)
router.put('/:id', verifyToken, checkRole('user'), async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { comment: req.body.comment },
            { new: true }
        );
        res.status(200).json({ message: 'Comment updated', comment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE comment (user only)
router.delete('/:id', verifyToken, checkRole('user'), async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;