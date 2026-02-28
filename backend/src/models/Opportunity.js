const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['hackathon', 'research', 'contest', 'internship', 'job', 'scholarship', 'fest', 'hiring_challenge'], required: true },
    domain: { type: String, required: true }, // e.g., 'Web3', 'AI', 'Healthcare'
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    duration: { type: Number, required: true }, // in hours
    reward: { type: String, default: '' },
    mode: { type: String, enum: ['online', 'in-person', 'hybrid'], default: 'online' },
    skillsRequired: [{ type: String }],
    timeline: {
        registrationStart: { type: Date },
        registrationEnd: { type: Date },
        eventStart: { type: Date },
        eventEnd: { type: Date }
    },
    organizer: { type: String, default: 'Zyphra' },
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
