
const { createPool } = require('@vercel/postgres');

const postgresPool = createPool({
  connectionString: 'postgres://default:itW7NXxuM8Ae@ep-restless-waterfall-a4fiyt3h-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"',
});


module.exports = postgresPool;
