import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { connection as db } from '../db.js';

export async function signUp(req, res) {
  const { first_name, second_name, birthdate, biography, city, password } = req.body;

  if (!first_name || !second_name || !birthdate || !biography || !city || !password) {
    return res.status(400).send('Invalid data');
  }

  const inserted = await db.query('INSERT INTO users (first_name, second_name, birthdate, biography, city, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [
    first_name,
    second_name,
    birthdate,
    biography,
    city,
    // Far enough not the most secure but will do for this assignment
    crypto.createHash('sha512').update(password).digest('hex'),
  ]);

  const token = jwt.sign({ id: inserted.rows[0].id }, process.env.JWT_SECRET);

  res.send({
    token,
  });
}