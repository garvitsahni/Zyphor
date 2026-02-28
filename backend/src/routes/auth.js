const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper: check if MongoDB is connected
function requireDB(req, res) {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({ error: 'Database not available. Please ensure MongoDB is running or set MONGODB_URI in .env.' });
        return false;
    }
    return true;
}

// Register
router.post('/register', async (req, res) => {
    if (!requireDB(req, res)) return;
    try {
        const { name, email, password, skills } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const user = await User.create({ name, email, password, skills: skills || [] });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    if (!requireDB(req, res)) return;
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skills: user.skills },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// Update profile
router.patch('/me', authMiddleware, async (req, res) => {
    try {
        const { name, bio, skills, hackathonMode, phone, location, title, socialLinks, education } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (skills) updates.skills = skills;
        if (hackathonMode !== undefined) updates.hackathonMode = hackathonMode;
        if (phone !== undefined) updates.phone = phone;
        if (location !== undefined) updates.location = location;
        if (title !== undefined) updates.title = title;
        if (socialLinks !== undefined) updates.socialLinks = socialLinks;
        if (education !== undefined) updates.education = education;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'repo'] }));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

module.exports = router;
