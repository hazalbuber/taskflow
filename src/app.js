const express = require('express');
const logger = require('./middleware/logger');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Log every request (method, endpoint, timestamp)
app.use(logger);

// Root endpoint: short API overview
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow API',
    description: 'Task and project management system',
    endpoints: {
      list: 'GET /tasks',
      detail: 'GET /tasks/:id',
      create: 'POST /tasks',
      update: 'PUT /tasks/:id',
      delete: 'DELETE /tasks/:id'
    }
  });
});

// Task routes
app.use('/tasks', taskRoutes);

// 404 handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;