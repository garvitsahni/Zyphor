const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    status: { type: String, enum: ['registered', 'waitlisted', 'cancelled'], default: 'registered' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    readinessScore: { type: Number, default: 0 },
    missingSkills: [{ type: String }],
    preparationChecklist: [{
        task: { type: String },
        resource: { type: String },
        completed: { type: Boolean, default: false }
    }],
    registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate registrations
registrationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
