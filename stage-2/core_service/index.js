import './db.js';

import express from 'express';
import cors from 'cors';

import { indexRouter } from './routes/index.route.js';

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));

app.use((req, _, next) => {
  // Basic request logging via middleware
  console.log(`[host=${hostname}] Request received`, req.method, req.path);
  next();
})

app.use(indexRouter);

app.listen(port, () => {
  console.log(`[host=${hostname}] Server is running on port 3000`);
});