// services/geminiService.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined. Please create a .env file and add your key.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const getAiResponseAndHumorAnalysis = async (messages) => {
  const userMessagesCount = messages.filter(m => m.role === 'user').length;

  // --- THIS IS THE FIX ---
  // The history must be mapped to use the role 'model' instead of 'ai'.
  const history = messages.slice(0, -1).map(m => ({
    // CHANGED: Use a ternary operator to translate 'ai' to the required 'model' role.
    role: m.role === 'ai' ? 'model' : 'user', 
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history,
    safetySettings,
  });

  const lastMessageContent = messages[messages.length - 1].content;

  if (userMessagesCount < 4) {
    const personaPrompt = `
      Adopt the persona of a witty, slightly sarcastic individual talking to someone new for the first time. 
      Your response should be brief and conversational, NOT like an AI assistant. 
      Do not ask "How can I help you?". Instead, just continue the conversation naturally.
      
      Here's what the user just said: "${lastMessageContent}"
    `;
    
    const result = await chat.sendMessage(personaPrompt);
    const responseText = await result.response.text();
    
    return { aiMessage: responseText };

  } else {
    // This part remains the same.
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const analysisPrompt = `
      You are an AI that just had a short conversation with a user and now you must judge their humor.
      Here is the full conversation transcript:
      ---
      ${conversationText}
      ---
      Based on the user's messages in the transcript, perform two tasks:
      1. Provide a final, concluding message to naturally wrap up the chat.
      2. Analyze the user's humor.
      
      IMPORTANT: Return ONLY a single, raw JSON object in the following format, with no other text, comments, or markdown formatting.
      {
        "aiMessage": "The concluding message you wrote.",
        "humorScore": <A number from 1 (not funny at all) to 10 (hilarious)>,
        "humorRemark": "<A short, witty, one-sentence justification for the score you gave.>"
      }
    `;
    
    const result = await chat.sendMessage(analysisPrompt);
    const responseText = await result.response.text();
    
    const cleanedJsonString = responseText.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", e, "Raw response:", responseText);
      return { 
        aiMessage: "That was fun! My humor analysis circuits got a bit tangled, though.", 
        humorScore: 5, 
        humorRemark: "Could not formally analyze the response due to a technical glitch." 
      };
    }
  }
};