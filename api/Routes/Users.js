// routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Database/db.js');

const router = express.Router();
const saltRounds = 10;
const secretKey = 'supersecrettokenkey'; // Replace with your secret key

// Register a new user
router.post('/register', async (req, res) => {
    console.log(req.body,'req.body');
  const { username, password, coupleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, password, coupleId)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [username, hashedPassword, coupleId], (err, result) => {
      if (err) {
        return res.status(500).send('Error registering new user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (err) {
    res.status(500).send('Error hashing password');
  }
});

// Login an existing user
router.post('/login', (req, res) => {

  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Incorrect password');
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

module.exports = router;
