import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // NeonDB connection URL
  ssl: {
    rejectUnauthorized: false, // For production, ensure SSL is handled securely
  },
});

export default pool;
