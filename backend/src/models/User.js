const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String, default: '' },
    githubId: { type: String },
    githubUsername: { type: String },
    githubAccessToken: { type: String },
    skills: [{ type: String }],
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    title: { type: String, default: '' },
    socialLinks: {
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
        github: { type: String, default: '' }
    },
    education: [{
        university: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startYear: { type: String, required: true },
        endYear: { type: String, required: true },
        cgpa: { type: String }
    }],
    role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    hackathonMode: { type: Boolean, default: false },
    savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }],
    activityLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    workingPattern: { type: String, enum: ['morning', 'evening', 'flexible'], default: 'flexible' },
    timezone: { type: String, default: 'UTC' },
    zyphorCoins: { type: Number, default: 0 },
    badges: [{
        name: { type: String },
        icon: { type: String },
        earnedAt: { type: Date, default: Date.now }
    }],
    certificates: [{
        title: { type: String },
        issuer: { type: String },
        url: { type: String },
        issuedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
