// routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Database/db.js');

const router = express.Router();
const saltRounds = 10;
const secretKey = 'supersecrettokenkey'; // Replace with your secret key

// Register a new user
// Register a new user
router.post('/register', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { username, password, coupleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, password, coupleId)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [username, hashedPassword, coupleId], function (err) {
      if (err) {
        console.error('Error inserting new user:', err.message);
        return res.status(500).send('Error registering new user');
      }
      res.status(200).send('User registered successfully');
    });
  } catch (err) {
    console.error('Error hashing password:', err.message);
    res.status(500).send('Error processing request');
  }
});


// Login an existing user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], async (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Incorrect password');
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

    let payload = {
      userId: user.id,
      username: user.username,
      coupleId: user.coupleId,
      token: token
    }
    res.status(200).json(payload);
  });
});

module.exports = router;
