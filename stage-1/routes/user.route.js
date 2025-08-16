import express from 'express';
import { signUp } from '../controllers/sign-up.controller.js';
import { signIn } from '../controllers/sign-in.controller.js';
import { requireJwtAuth } from '../middlewares/jwt-auth.js';

const router = express.Router();

router.post('/login', signIn);

router.post('/user/register', signUp);

export default router;