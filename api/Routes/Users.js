// routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../Database/db.js');

const router = express.Router();
const saltRounds = 10;
const secretKey = 'supersecrettokenkey'; // Replace with your secret key

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, coupleId } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, password, coupleId)
      VALUES ($1, $2, $3)
    `;

    await pool.query(sql, [username, hashedPassword, coupleId]);

    res.status(200).send('User registered successfully');
  } catch (err) {
    console.error('Error registering new user:', err.message);
    res.status(500).send('Error registering new user');
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await pool.query(sql, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Incorrect password');
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    console.log(user)
    let payload = {
      userId: user.id,
      username: user.username,
      coupleId: user.coupleid,
      token: token
    };

    res.status(200).json(payload);
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Error logging in user');
  }
});

module.exports = router;
