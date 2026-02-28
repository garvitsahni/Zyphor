module.exports = (io) => {
    // Track connected users per project
    const projectUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        // Join project workspace
        socket.on('join-project', ({ projectId, user }) => {
            socket.join(`project:${projectId}`);

            if (!projectUsers.has(projectId)) {
                projectUsers.set(projectId, new Map());
            }
            projectUsers.get(projectId).set(socket.id, {
                id: user?.id || socket.id,
                name: user?.name || 'Anonymous',
                avatar: user?.avatar || '',
                cursor: null,
            });

            // Broadcast presence to project members
            io.to(`project:${projectId}`).emit('presence-update', {
                users: Array.from(projectUsers.get(projectId).values()),
            });

            console.log(`👤 ${user?.name || 'User'} joined project ${projectId}`);
        });

        // Leave project workspace
        socket.on('leave-project', ({ projectId }) => {
            socket.leave(`project:${projectId}`);
            if (projectUsers.has(projectId)) {
                projectUsers.get(projectId).delete(socket.id);
                io.to(`project:${projectId}`).emit('presence-update', {
                    users: Array.from(projectUsers.get(projectId).values()),
                });
            }
        });

        // Task moved (drag-and-drop)
        socket.on('task-move', ({ projectId, taskId, newStatus, newOrder }) => {
            socket.to(`project:${projectId}`).emit('task-moved', {
                taskId, newStatus, newOrder, movedBy: socket.id,
            });
        });

        // Typing indicator
        socket.on('typing', ({ projectId, user, section }) => {
            socket.to(`project:${projectId}`).emit('user-typing', {
                user, section,
            });
        });

        // New activity/message
        socket.on('new-activity', ({ projectId, activity }) => {
            io.to(`project:${projectId}`).emit('activity-update', activity);
        });

        // Cursor position for live collaboration
        socket.on('cursor-move', ({ projectId, position }) => {
            if (projectUsers.has(projectId) && projectUsers.get(projectId).has(socket.id)) {
                projectUsers.get(projectId).get(socket.id).cursor = position;
            }
            socket.to(`project:${projectId}`).emit('cursor-update', {
                userId: socket.id,
                position,
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            // Remove from all project rooms
            for (const [projectId, users] of projectUsers.entries()) {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    io.to(`project:${projectId}`).emit('presence-update', {
                        users: Array.from(users.values()),
                    });
                }
            }
            console.log(`🔌 User disconnected: ${socket.id}`);
        });
    });
};
