const express = require('express');
const router = express.Router();
const PracticeChallenge = require('../models/PracticeChallenge');

// Get all practice challenges
router.get('/', async (req, res) => {
    try {
        // Mock data until DB is populated
        const mockChallenges = [
            {
                _id: 'p1',
                title: 'Two Sum',
                difficulty: 'Easy',
                category: 'Algorithms',
                description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
                points: 10,
                submissionsCount: 15420,
                successRate: 85
            },
            {
                _id: 'p2',
                title: 'LRU Cache Design',
                difficulty: 'Medium',
                category: 'System Design',
                description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
                points: 30,
                submissionsCount: 8900,
                successRate: 42
            },
            {
                _id: 'p3',
                title: 'Distributed Message Queue',
                difficulty: 'Hard',
                category: 'Architecture',
                description: 'Design a highly available distributed message queue system similar to Kafka.',
                points: 50,
                submissionsCount: 2300,
                successRate: 15
            }
        ];

        res.json(mockChallenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a solution
router.post('/:id/submit', async (req, res) => {
    try {
        // Mock evaluation
        const { code, language } = req.body;

        // Simulating simple validation
        if (!code || code.length < 5) {
            return res.json({ success: false, status: 'Failed', message: 'Syntax Error or empty code block.' });
        }

        res.json({ success: true, status: 'Accepted', pointsEarned: 10, runtime: '45ms', memory: '12MB' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
