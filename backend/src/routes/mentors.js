const express = require('express');
const router = express.Router();
const Mentorship = require('../models/Mentorship');

// Get all top mentors
router.get('/', async (req, res) => {
    try {
        // Mock data for UI purposes until real DB is populated
        const mockMentors = [
            {
                _id: 'm1',
                mentor: { name: 'Elena Rodriguez', avatar: 'ER' },
                expertise: ['AI/ML', 'System Design', 'Python'],
                title: 'Senior AI Researcher at DeepMind',
                company: 'Google',
                bio: 'Helping builders scale AI agents. Former YC founder.',
                hourlyRate: 0,
                rating: 4.9,
                reviewsCount: 124,
                isActive: true
            },
            {
                _id: 'm2',
                mentor: { name: 'David Chen', avatar: 'DC' },
                expertise: ['Web3', 'Smart Contracts', 'Solidity'],
                title: 'Lead Blockchain Engineer',
                company: 'Ethereum Foundation',
                bio: 'Passionate about decentralized finance and complex tokenomics.',
                hourlyRate: 50,
                rating: 4.8,
                reviewsCount: 89,
                isActive: true
            },
            {
                _id: 'm3',
                mentor: { name: 'Sarah Jenkins', avatar: 'SJ' },
                expertise: ['Frontend', 'React', 'UI/UX'],
                title: 'Staff Frontend Engineer',
                company: 'Vercel',
                bio: 'I build fast web experiences and help others do the same.',
                hourlyRate: 25,
                rating: 5.0,
                reviewsCount: 210,
                isActive: true
            }
        ];

        return res.json(mockMentors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Book a session (Mock)
router.post('/:id/book', async (req, res) => {
    try {
        const { date, time } = req.body;
        // In a real app we'd create a Booking record
        res.json({ success: true, message: 'Mentorship session booked successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
