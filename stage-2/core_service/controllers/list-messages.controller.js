import { connection as db } from '../db.js';

export async function listMessages(req, res) {
  const { id: currentUserId } = req.user;

  const { user_id: targetUserId } = req.params;

  // Send request to the dialog service
}