import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export const users = [];

export function signUp(req, res) {
  const { first_name, second_name, birthdate, biography, city, password } = req.body;

  if (!first_name || !second_name || !birthdate || !biography || !city || !password) {
    return res.status(400).send('Invalid data');
  }

  const user = {
    id: users.length + 1,
    first_name,
    second_name,
    birthdate,
    biography,
    city,
    // Far enough not the most secure but will do for this assignment
    password: crypto.createHash('sha512').update(password).digest('hex'),
  };

  users.push(user);

  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET);

  res.send({
    token,
  });
}