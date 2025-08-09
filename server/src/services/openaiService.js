// server/src/services/openaiService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends a conversation to OpenAI and returns the response message
 * @param {Array} messages - Array of messages in OpenAI format [{role: 'user', content: '...'}, ...]
 * @returns {Promise<string>} The assistant's reply
 */
export const sendMessageToOpenAI = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    throw error;
  }
};
