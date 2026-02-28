const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: [{ type: String, required: true }],
    title: { type: String, required: true }, // e.g., 'Senior SWE at Google'
    company: { type: String },
    bio: { type: String },
    hourlyRate: { type: Number, default: 0 }, // 0 means free
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    availability: [{
        dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        startTime: { type: String }, // '14:00'
        endTime: { type: String }    // '18:00'
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Mentorship', mentorshipSchema);
