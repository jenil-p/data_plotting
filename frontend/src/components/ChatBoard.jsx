// src/components/ChatBoard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';
import { sendAIChatMessage } from '../api/project';
import { toast } from 'react-hot-toast';

const ChatBoard = ({ projectId, columns, data }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainer = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendAIChatMessage(projectId, input);
      const aiMessage = { role: 'assistant', content: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send AI message:', error);
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Data Analysis</h2>
      <div className="mb-4 text-gray-600">
        <p>Ask questions about your data. Available columns: {columns.join(', ')}</p>
        <p className="text-sm mt-1">Example: "What is the average value of [column_name]?" or "Summarize trends in the data."</p>
      </div>
      <div
        ref={chatContainer}
        className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Start the conversation by asking a question about your data!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-2 bg-blue-700 text-white p-3 rounded-xl hover:bg-blue-800 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? <FiLoader className="animate-spin" /> : <FiSend />}
        </button>
      </form>
    </div>
  );
};

export default ChatBoard;