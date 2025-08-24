import { connection as db } from '../db.js';

export async function getUser(req, res) {
  const { id: userId } = req.params;

  const dbRes = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  if (!dbRes.rows.length) {
    return res.status(404).send('User not found');
  }

  const user = dbRes.rows[0];

  res.json({
    id: user.id,
    first_name: user.first_name,
    second_name: user.second_name,
    birthdate: user.birthdate,
    biography: user.biography,
    city: user.city,
  });
}