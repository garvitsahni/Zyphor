const mongoose = require('mongoose');

const practiceChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    category: { type: String, required: true }, // 'Algorithms', 'System Design', 'Frontend'
    description: { type: String, required: true },
    problemStatement: { type: String, required: true },
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    points: { type: Number, default: 10 },
    timeLimit: { type: Number, default: 2000 }, // ms
    testCases: [{
        input: { type: String },
        expectedOutput: { type: String },
        isHidden: { type: Boolean, default: false }
    }],
    submissionsCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    author: { type: String, default: 'Zyphra' },
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PracticeChallenge', practiceChallengeSchema);
