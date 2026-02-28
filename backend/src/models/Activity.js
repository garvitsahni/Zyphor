const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['task_created', 'task_moved', 'task_completed', 'member_joined',
            'idea_validated', 'judge_scored', 'commit_pushed', 'comment',
            'presentation_generated', 'startup_plan_generated'],
        required: true,
    },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Activity, Notification };
