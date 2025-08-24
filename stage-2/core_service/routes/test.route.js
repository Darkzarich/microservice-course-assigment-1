import express from 'express';
import { test } from '../controllers/test.controller.js';

const testRouter = express.Router();

testRouter.get('/test', test);

export {
  testRouter,
};