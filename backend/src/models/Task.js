const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['backlog', 'todo', 'in-progress', 'review', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    dueDate: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
