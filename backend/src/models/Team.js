const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' },
        joinedAt: { type: Date, default: Date.now }
    }],
    invitations: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        invitedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
    }],
    maxSize: { type: Number, default: 4 },
    isLookingForMembers: { type: Boolean, default: true },
    requiredSkills: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
