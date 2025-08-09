import React, { useState } from "react";
import axios from "axios";
import Chat from "./components/Chat";

// Define the backend server URL
// const API_URL = "http://localhost:5000/api/chat";
const API_URL = "https://humor-rater-ai.onrender.com/api/chat";

export default function App() {
  // State for messages, starting with a greeting from the AI
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Hello! Try to make me laugh in our next two messages.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [humorResult, setHumorResult] = useState(null); // State to hold the final score and remark

  // Function to send a message to the backend
  // In App.jsx

  const sendMessage = async () => {
    if (!input.trim() || loading || humorResult) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // --- THIS IS THE CRITICAL FIX ---
      // Use .slice(1) to remove the initial AI greeting from the history
      // before sending it to the backend.
      const historyForApi = updatedMessages.slice(1);

      const response = await axios.post(API_URL, { messages: historyForApi });

      const { aiMessage, humorScore, humorRemark } = response.data;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "ai", content: aiMessage },
      ]);

      if (humorScore !== undefined) {
        setHumorResult({ score: humorScore, remark: humorRemark });
      }
    } catch (error) {
      // This is where the error from the server is being caught and logged.
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "ai",
          content: "Sorry, I ran into an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Function to restart the conversation
  const restartChat = () => {
    setMessages([
      { role: "ai", content: "Alright, let's go again! Do your best." },
    ]);
    setHumorResult(null);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-cyan-400">
            Humor Rater AI 🤖
          </h1>
          {humorResult && (
            <button
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              onClick={restartChat}
            >
              Restart
            </button>
          )}
        </div>

        {/* Chat component to display messages */}
        <Chat messages={messages} loading={loading} />

        {/* Display the final humor analysis if it exists */}
        {humorResult && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-cyan-500/50">
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">
              Final Analysis:
            </h2>
            <p className="text-4xl font-bold text-center my-3">
              {humorResult.score} / 10
            </p>
            <p className="text-center text-lg italic text-gray-300">
              "{humorResult.remark}"
            </p>
          </div>
        )}

        {/* Input area, hidden when the result is shown */}
        {!humorResult && (
          <div className="mt-6 flex gap-2">
            <input
              className="flex-grow bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Say something funny..."
              disabled={loading}
            />
            <button
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        )}
      </div>
      <footer className="text-center mt-6 text-gray-500">
        <p>...</p>
      </footer>
    </div>
  );
}
