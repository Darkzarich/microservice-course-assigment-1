import express from 'express';
import { testRouter } from './test.route.js';
import { userRouter } from './user.route.js';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

const indexRouter = express.Router();

indexRouter.use('/api/dialog', createProxyMiddleware({
  target: process.env.DIALOG_SERVICE_URL + '/api/dialog',
  on: {
    proxyReq: fixRequestBody,
  },
}));
indexRouter.use('/api/user', userRouter);
indexRouter.use('/api/test', testRouter);

export {
  indexRouter,
};