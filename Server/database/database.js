const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            date TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Expenses table created');
            }
        });
    }
});

const initializeDatabase = () => db;

module.exports = { initializeDatabase, db };
