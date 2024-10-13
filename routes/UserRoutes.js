const express = require('express');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const auth = require('../authMiddleware');
const User = require('../models/user'); // Import the User model
const router = express.Router();

router.patch('/me', auth(['user', 'admin']), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));

        // If password is being updated, hash it
        if (req.body.password) {
            req.user.password = await bcrypt.hash(req.user.password, 8);
        }

        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
    User.findByIdAndDelete(userId);
    res.status(204).end();
});

module.exports = router;