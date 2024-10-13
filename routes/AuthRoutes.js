const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Реєстрація
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        //res.send({user})
        console.log('User instance created:', user); // Debugging line
        await user.save();
        res.status(201).send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Вхід
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send({ error: 'Login failed!' });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, 'secretKey', { expiresIn: '2h' });
        console.log('User instance created:', user);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Перевірка аутентифікації
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretKey');
        const user = await User.findOne({ _id: decoded._id});
        if (!user||user.username!==decoded.username) {
            throw new Error();
        }
        res.send(user);
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
});

module.exports = router;