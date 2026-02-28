const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const { Activity } = require('../models/Activity');

const router = express.Router();

// Get all projects for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { 'collaborators.user': req.user._id },
            ],
        }).populate('owner', 'name avatar').sort({ updatedAt: -1 });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create project
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, domain, problemStatement, solution, targetUsers, hackathonMode, hackathonDuration } = req.body;
        const project = await Project.create({
            title, description, domain, problemStatement, solution, targetUsers,
            hackathonMode: hackathonMode || false,
            hackathonDuration: hackathonDuration || 48,
            owner: req.user._id,
            collaborators: [{ user: req.user._id, role: 'owner' }],
        });
        res.status(201).json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name avatar email')
            .populate('collaborators.user', 'name avatar email');
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!project) return res.status(404).json({ error: 'Project not found or unauthorized' });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get project activity
router.get('/:id/activity', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find({ project: req.params.id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ activities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add collaborator
router.post('/:id/collaborators', authMiddleware, async (req, res) => {
    try {
        const { email, role } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const User = require('../models/User');
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const alreadyMember = project.collaborators.some(c => c.user.toString() === user._id.toString());
        if (alreadyMember) return res.status(400).json({ error: 'Already a collaborator' });

        project.collaborators.push({ user: user._id, role: role || 'member' });
        await project.save();

        // Emit socket event
        const io = req.app.get('io');
        io.to(`project:${project._id}`).emit('member-joined', { user: { id: user._id, name: user.name, avatar: user.avatar } });

        res.json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Public portfolio view
router.get('/portfolio/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, isPublic: true })
            .populate('owner', 'name avatar githubUsername')
            .populate('collaborators.user', 'name avatar githubUsername');
        if (!project) return res.status(404).json({ error: 'Portfolio not found or private' });
        res.json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
