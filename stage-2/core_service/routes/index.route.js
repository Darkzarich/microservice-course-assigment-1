import express from 'express';
import { testRouter } from './test.route.js';
import { userRouter } from './user.route.js';
import { dialogRouter } from './dialog.route.js';

const indexRouter = express.Router();

indexRouter.use('/api/dialog', dialogRouter);
indexRouter.use('/api/user', userRouter);
indexRouter.use('/api/test', testRouter);

export {
  indexRouter,
};