import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { connection as db } from '../db.js';

export async function signIn(req, res) {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).send('Invalid data');
  }

  const dbRes = await db.query('SELECT id, password FROM users WHERE id = $1', [id]);

  if (!dbRes.rows.length) {
    return res.status(404).send('User not found');
  }

  const user = dbRes.rows[0];

  const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');

  if (user.password !== hashedPassword) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET);

  res.send({
    token,
  });
}