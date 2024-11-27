// pages/api/users/create.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
      // Insert user data into the database
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );

      // Respond with the created user data
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

  // Handle method not allowed
  res.status(405).json({ message: 'Method Not Allowed' });
}
