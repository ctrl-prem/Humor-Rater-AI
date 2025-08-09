// controllers/chatController.js
import { getAiResponseAndHumorAnalysis } from '../services/geminiService.js';

/**
 * Handles the incoming chat request, calls the Gemini service,
 * and sends back the response.
 */
export const handleChatConversation = async (req, res) => {
  try {
    const { messages } = req.body;

    // Basic validation to ensure messages are present.
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
    }

    // Delegate the core logic to the service layer.
    const response = await getAiResponseAndHumorAnalysis(messages);

    // Send the successful response back to the client.
    res.status(200).json(response);

  } catch (error) {
    // Centralized error handling.
    console.error('Error in chatController:', error.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
