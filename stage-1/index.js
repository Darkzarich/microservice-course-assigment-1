import express from 'express';
import cors from 'cors';
import testRoute from './routes/test.route.js';

const app = express();

app.use(testRoute);

app.use(cors());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});