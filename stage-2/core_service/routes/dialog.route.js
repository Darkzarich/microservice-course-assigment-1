import express from 'express';
import { sendMessage } from '../controllers/send-message.controller.js';
import { listMessages } from '../controllers/list-messages.controller.js';

const dialogRouter = express.Router();

dialogRouter.post('/:user_id/send', sendMessage);
dialogRouter.get('/:user_id/list', listMessages);

export {
  dialogRouter,
}
