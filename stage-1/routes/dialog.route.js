import express from 'express';
import { sendMessage } from '../controllers/send-message.controller.js';
import { listMessages } from '../controllers/list-messages.controller.js';
import { requireJwtAuth } from '../middlewares/jwt-auth.js';

const dialogRouter = express.Router();

dialogRouter.post('/:user_id/send', requireJwtAuth, sendMessage);

dialogRouter.get('/:user_id/list', requireJwtAuth, listMessages);

export {
  dialogRouter,
}
