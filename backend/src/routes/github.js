const express = require('express');
const authMiddleware = require('../middleware/auth');
const { Activity } = require('../models/Activity');

const router = express.Router();

// Get GitHub repos (mock — in production use GitHub API with user's access token)
router.get('/repos', authMiddleware, async (req, res) => {
    try {
        // In production: fetch from GitHub API using req.user.githubAccessToken
        const repos = [
            { name: 'zyphra-project', fullName: 'user/zyphra-project', stars: 12, language: 'TypeScript', updatedAt: new Date() },
            { name: 'hackathon-app', fullName: 'user/hackathon-app', stars: 5, language: 'JavaScript', updatedAt: new Date() },
        ];
        res.json({ repos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get commits for a repo (mock)
router.get('/commits/:repo', authMiddleware, async (req, res) => {
    try {
        const commits = Array.from({ length: 20 }, (_, i) => ({
            sha: `abc${i}def`,
            message: `feat: implement feature ${20 - i}`,
            author: req.user.name,
            date: new Date(Date.now() - i * 3600000),
            additions: Math.floor(Math.random() * 100),
            deletions: Math.floor(Math.random() * 30),
        }));
        res.json({ commits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get contribution heatmap (mock)
router.get('/heatmap/:repo', authMiddleware, async (req, res) => {
    try {
        const days = 90;
        const heatmap = Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() - (days - i) * 86400000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10),
        }));
        res.json({ heatmap });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Connect repo to project
router.post('/connect', authMiddleware, async (req, res) => {
    try {
        const { projectId, repoUrl } = req.body;
        const Project = require('../models/Project');
        await Project.findByIdAndUpdate(projectId, { githubRepo: repoUrl });
        await Activity.create({
            project: projectId, user: req.user._id,
            type: 'commit_pushed',
            message: `connected GitHub repository: ${repoUrl}`,
        });
        res.json({ message: 'Repository connected', repoUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
