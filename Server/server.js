// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./database/database');
const expensesRoutes = require('./routes/expenses');
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/expenses', expensesRoutes);
app.use('/analysis', analysisRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});