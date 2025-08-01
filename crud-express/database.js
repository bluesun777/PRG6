const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); s

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )`);
});

module.exports = db;
