const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const githubRoutes = require('./routes/github');
const opportunityRoutes = require('./routes/opportunities');
const teamRoutes = require('./routes/teams');
const mentorRoutes = require('./routes/mentors');
const practiceRoutes = require('./routes/practice');

// Import passport config
require('./config/passport');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000'
];

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'zyphra-secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/practice', practiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket handling
require('./sockets/handler')(io);

// MongoDB connection
const startServer = async () => {
    try {
        let MONGODB_URI = process.env.MONGODB_URI;

        if (process.env.USE_MOCK_DB !== 'false') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            MONGODB_URI = mongoServer.getUri();
            console.log('🧪 Using Mock Database (MongoDB Memory Server)');
        } else {
            MONGODB_URI = MONGODB_URI || 'mongodb://localhost:27017/zyphra';
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.warn('⚠️  MongoDB connection error:', err.message);
        console.warn('   Running without database or failed to start mock.');
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`🚀 Zyphra backend running on port ${PORT}`);
    });
};

startServer();

module.exports = { app, server, io };
// Trigger nodemon restart for env changes
