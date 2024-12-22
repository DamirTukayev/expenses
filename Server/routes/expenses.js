const express = require('express');
const { db } = require('../database/database');
const router = express.Router();

// Get all expenses
router.get('/', (req, res) => {
    const query = 'SELECT * FROM expenses';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new expense
router.post('/', (req, res) => {
    const { user, date, amount, category, description } = req.body;
    const query = `INSERT INTO expenses (user, date, amount, category, description) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [user, date, amount, category, description], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
});

// Update an expense
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { user, date, amount, category, description } = req.body;
    const query = `UPDATE expenses SET user = ?, date = ?, amount = ?, category = ?, description = ? WHERE id = ?`;
    db.run(query, [user, date, amount, category, description, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Expense not found' });
        } else {
            res.status(200).json({ message: 'Expense updated successfully' });
        }
    });
});

// Delete an expense
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM expenses WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Expense not found' });
        } else {
            res.status(200).json({ message: 'Expense deleted successfully' });
        }
    });
});

module.exports = router;
