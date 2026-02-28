const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    domain: { type: String, default: '' },
    problemStatement: { type: String, default: '' },
    solution: { type: String, default: '' },
    targetUsers: { type: String, default: '' },
    status: {
        type: String,
        enum: ['idea', 'planning', 'development', 'judging', 'startup'],
        default: 'idea',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' },
        joinedAt: { type: Date, default: Date.now },
    }],
    hackathonMode: { type: Boolean, default: false },
    hackathonDuration: { type: Number, default: 48 }, // hours
    githubRepo: { type: String, default: '' },
    ideaValidation: {
        innovationScore: { type: Number, default: 0 },
        similarProjects: [{ name: String, similarity: Number, url: String }],
        researchPapers: [{
            title: String,
            summary: String,
            methodology: String,
            datasets: [String],
            limitations: String
        }],
        considerations: {
            noveltyGap: String,
            beginnerExplanation: String,
            technicalExplanation: String
        },
        improvedProblemStatement: { type: String },
        suggestions: [{ type: String }],
        validatedAt: { type: Date },
    },
    judgeScores: {
        innovation: { type: Number, default: 0 },
        technicalComplexity: { type: Number, default: 0 },
        feasibility: { type: Number, default: 0 },
        realWorldImpact: { type: Number, default: 0 },
        presentationClarity: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        feedback: { type: String },
        improvements: [{ type: String }],
        scoredAt: { type: Date },
    },
    presentation: {
        slides: [{ title: String, content: String, notes: String }],
        speakingScript: { type: String },
        demoFlow: [{ step: String, description: String }],
        judgeQuestions: [{ question: String, answer: String }],
        generatedAt: { type: Date },
    },
    startup: {
        businessModel: { type: String },
        targetCustomers: { type: String },
        pricing: { type: String },
        scalingRoadmap: { type: String },
        futureFeatures: { type: String },
        generatedAt: { type: Date },
    },
    deadline: {
        completionProbability: { type: Number, default: 100 },
        riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
        recommendedScope: { type: String },
    },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
