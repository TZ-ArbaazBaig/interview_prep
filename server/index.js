require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const sessionRoutes = require('./routes/sessions');
const questionRoutes = require('./routes/questions');
const evaluateRoutes = require('./routes/evaluate');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database
try {
  initDb();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/evaluate', evaluateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
