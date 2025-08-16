import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { users } from './sign-up.controller.js';

export function signIn(req, res) {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).send('Invalid data');
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');

  if (user.password !== hashedPassword) {
    return res.status(401).send('Invalid password');
  }

  const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET);

  res.send({
    token,
  });
}