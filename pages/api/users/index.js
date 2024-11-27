import pool from '../../../lib/db';

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users'); // Adjust table name as needed
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database query failed:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'OPTIONS']);
  res.status(405).json({ message: 'Method Not Allowed' });
}
