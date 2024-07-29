const {sql } = require('@vercel/postgres');
const express = require('express');
const router = express.Router();
const { createPool } = require('@vercel/postgres');

const pool = createPool({
  connectionString: 'postgres://default:itW7NXxuM8Ae@ep-restless-waterfall-a4fiyt3h-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"',
});


// Register a new user
router.post('/demo', async (req, res) => {
    
    const response = await pool.query('SELECT * FROM users');

    res.json(response.rows);
});



module.exports = router;
