import './db.js';

import express from 'express';
import cors from 'cors';

import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));

app.use(testRoute);
app.use(userRoute)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});