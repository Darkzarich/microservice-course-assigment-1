import { connection as db } from '../db.js';

export async function listMessages(req, res) {
  const { id: currentUserId } = req.user;

  const { user_id: targetUserId } = req.params;

  const dbRes = await db.query('SELECT * FROM messages WHERE ("to" = $1 AND "from" = $2) OR ("from" = $1 AND "to" = $2)', [
    targetUserId,
    currentUserId,
  ]);

  res.send(dbRes.rows);
}