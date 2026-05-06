require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const sessionRoutes = require('./routes/sessions');
const questionRoutes = require('./routes/questions');
const evaluateRoutes = require('./routes/evaluate');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3005;

// Initialize Database
let server;
const startServer = async () => {
  try {
    await connectDB();
    
    server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`CORS allowed origin: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
const gracefulShutdown = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed. Releasing port...');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Robust CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

// Add versions with/without trailing slashes to be safe
const finalOrigins = [];
allowedOrigins.forEach(origin => {
  if (origin) {
    finalOrigins.push(origin.replace(/\/$/, ""));
    finalOrigins.push(origin.replace(/\/$/, "") + "/");
  }
});

app.use(cors({
  origin: finalOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
const { authenticate } = require('./middleware/auth');
app.use('/api', authenticate);

app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/evaluate', evaluateRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

