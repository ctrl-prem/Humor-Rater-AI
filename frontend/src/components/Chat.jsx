import React, { useEffect, useRef } from 'react';

export default function Chat({ messages, loading }) {
  // Ref to the chat container for auto-scrolling
  const chatEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="space-y-4 h-96 overflow-y-auto p-4 bg-gray-900 rounded-lg border border-gray-700">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-cyan-700 text-white' : 'bg-gray-600 text-white'}`}>
            {msg.content}
          </div>
        </div>
      ))}
      {/* Show a "typing" indicator when the AI is processing */}
      {loading && (
        <div className="flex justify-start">
            <div className="bg-gray-600 text-white px-4 py-2 rounded-xl">
                <span className="animate-pulse">AI is thinking...</span>
            </div>
        </div>
      )}
      {/* Empty div to mark the end of the chat for scrolling */}
      <div ref={chatEndRef} />
    </div>
  );
}
