import { connection as db } from '../db.js';

export async function sendMessage(req, res) {
  const { id: currentUserId } = req.user;
  const { user_id } = req.params;
  const { text } = req.body;

  // Send request to the dialog service
}