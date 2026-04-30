const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../interview_prep.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize the database with schema
 */
const initDb = () => {
  const schemaPath = path.join(__dirname, 'schema.js');
  const schema = require('./schema');
  
  db.exec(schema);
  console.log('Database initialized successfully');
};

module.exports = {
  db,
  initDb
};
