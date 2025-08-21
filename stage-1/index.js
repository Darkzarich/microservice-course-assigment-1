import './db.js';

import express from 'express';
import cors from 'cors';

import { indexRouter } from './routes/index.route.js';

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));

app.use((req, _, next) => {
  // Basic request logging via middleware
  console.log(`[host=${process.env.HOSTNAME}] `, req.ip, req.method, req.path);
  next();
})

app.use(indexRouter);

app.listen(3000, () => {
  console.log(`[host=${process.env.HOSTNAME}] Server is running on port 3000`);
});