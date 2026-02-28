const express = require('express');
const Task = require('../models/Task');
const { Activity } = require('../models/Activity');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get tasks for a project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignee', 'name avatar')
            .sort({ order: 1 });
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, project, assignee, priority, estimatedHours, status, tags, dueDate } = req.body;
        const task = await Task.create({
            title, description, project, assignee, priority,
            estimatedHours: estimatedHours || 0,
            status: status || 'todo',
            tags: tags || [],
            dueDate,
        });
        await task.populate('assignee', 'name avatar');

        // Log activity
        await Activity.create({
            project, user: req.user._id,
            type: 'task_created',
            message: `created task "${title}"`,
        });

        // Emit socket event
        const io = req.app.get('io');
        io.to(`project:${project}`).emit('task-created', task);

        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task (move between columns, edit)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const oldTask = await Task.findById(req.params.id);
        if (!oldTask) return res.status(404).json({ error: 'Task not found' });

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('assignee', 'name avatar');

        // Track status changes for activity feed
        if (req.body.status && req.body.status !== oldTask.status) {
            await Activity.create({
                project: task.project, user: req.user._id,
                type: req.body.status === 'done' ? 'task_completed' : 'task_moved',
                message: `moved "${task.title}" to ${req.body.status}`,
            });
            if (req.body.status === 'done') {
                task.completedAt = new Date();
                await task.save();
            }
        }

        // Emit socket event
        const io = req.app.get('io');
        io.to(`project:${task.project}`).emit('task-updated', task);

        res.json({ task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const io = req.app.get('io');
        io.to(`project:${task.project}`).emit('task-deleted', { taskId: task._id });

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Batch update task order
router.post('/reorder', authMiddleware, async (req, res) => {
    try {
        const { tasks } = req.body; // [{id, order, status}]
        const ops = tasks.map(t => ({
            updateOne: {
                filter: { _id: t.id },
                update: { order: t.order, status: t.status },
            },
        }));
        await Task.bulkWrite(ops);
        res.json({ message: 'Tasks reordered' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
