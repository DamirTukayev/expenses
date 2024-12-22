const express = require('express');
const { db } = require('../database/database');
const router = express.Router();

// Get total expenses
router.get('/total', (req, res) => {
    const query = 'SELECT SUM(amount) AS total FROM expenses';
    db.get(query, [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ total: row.total || 0 });
        }
    });
});

// Get expenses grouped by category
router.get('/by-category', (req, res) => {
    const query = 'SELECT category, SUM(amount) AS total FROM expenses GROUP BY category';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get expenses by date range
router.post('/by-date-range', (req, res) => {
    const { startDate, endDate } = req.body;
    const query = `SELECT date, SUM(amount) AS total FROM expenses WHERE date BETWEEN ? AND ? GROUP BY date`;
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
