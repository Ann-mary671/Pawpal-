const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pet_adoption.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

function initDatabase() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // SQLite run multiple statements
  db.exec(schemaSql, (err) => {
    if (err) {
      // Ignore unique constraint error if mock data was already inserted
      if (!err.message.includes('UNIQUE constraint failed')) {
        console.error('Database initialization warning/error:', err.message);
      }
    } else {
      console.log('Database initialized with ANSI SQL schema and seed data.');
    }
  });
}

module.exports = { db, initDatabase };
