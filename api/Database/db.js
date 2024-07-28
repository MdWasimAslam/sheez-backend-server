// db.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12721417',
  password: 'iJbEgRP8sV',
  database: 'sql12721417'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});

module.exports = db;
