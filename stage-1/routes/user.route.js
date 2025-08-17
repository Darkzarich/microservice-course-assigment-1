import express from 'express';
import { signUp } from '../controllers/sign-up.controller.js';
import { signIn } from '../controllers/sign-in.controller.js';

const userRouter = express.Router();

userRouter.post('/login', signIn);

userRouter.post('/register', signUp);

export {
  userRouter,
};