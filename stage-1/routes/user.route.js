import express from 'express';
import { signUp } from '../controllers/sign-up.controller.js';
import { signIn } from '../controllers/sign-in.controller.js';
import { getUser } from '../controllers/get-user.controller.js';
import { requireJwtAuth } from '../middlewares/jwt-auth.js';

const userRouter = express.Router();

userRouter.get('/:id', requireJwtAuth, getUser);
userRouter.post('/login', signIn);
userRouter.post('/register', signUp);

export {
  userRouter,
};