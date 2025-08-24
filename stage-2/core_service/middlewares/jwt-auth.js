import jwt from 'jsonwebtoken';

export function requireJwtAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);

      return;
    };

    req.user = user;

    next();
  });
}