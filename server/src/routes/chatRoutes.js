// routes/chatRoutes.js
import express from 'express';
import { handleChatConversation } from '../controllers/chatController.js';

const router = express.Router();

// @route   POST /api/chat/
// @desc    Handles the main chat interaction and humor analysis.
// @access  Public
router.post('/', handleChatConversation);

export default router;
