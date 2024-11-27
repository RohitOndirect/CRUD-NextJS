import pool from '../../../../lib/db';

export default async function handler(req, res) {
    const { id } = req.query;
  
    if (req.method === 'DELETE') {
      try {
        const result = await pool.query(
          'DELETE FROM users WHERE id = $1 RETURNING *',
          [id]
        );
  
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        return res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete user' });
      }
    }
  
    res.status(405).json({ message: 'Method Not Allowed' });
  }