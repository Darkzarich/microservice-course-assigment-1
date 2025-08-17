import { connection as db } from '../db.js';

export async function sendMessage(req, res) {
  const { id: currentUserId } = req.user;
  const { user_id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).send('Invalid data');
  }

  await db.query('INSERT INTO messages ("from", "to", text) VALUES ($1, $2, $3)', [
    currentUserId,
    user_id,
    text,
  ]);

  res.sendStatus(201);
}