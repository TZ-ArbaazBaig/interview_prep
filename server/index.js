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

// Manual CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://interview-prep-nine-zeta.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ];

  if (origin) {
    console.log(`Incoming request from origin: ${origin}`);
    
    // ALLOW: Localhost or ANY Vercel deployment
    const isAllowed = 
      origin.includes('localhost') || 
      origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

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

