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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-2xl mx-auto transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        AI Data Analysis
      </h2>
      <div className="mb-6 text-gray-700">
        <p className="text-lg font-medium">
          Ask questions about your data. Available columns:{' '}
          <span className="text-indigo-600">{columns.join(', ')}</span>
        </p>
        <p className="text-sm mt-2 text-gray-500 italic">
          Example: "What is the average value of [column_name]?" or "Summarize trends in the data."
        </p>
      </div>
      <div
        ref={chatContainer}
        className="h-96 overflow-y-auto mb-6 p-6 bg-gray-100 rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-lg">
            Start the conversation by asking a question about your data! 🚀
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fadeIn`}
            >
              <div
                className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow-md transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {/* Typing animation when AI is thinking */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs md:max-w-md p-4 rounded-2xl bg-white border border-gray-200 shadow-md flex items-center space-x-2">
              <span className="text-gray-500">AI is thinking</span>
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce1"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce2"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce3"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-white text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-700 text-white p-4 rounded-xl hover:bg-indigo-800 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            <FiSend className="text-xl" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatBoard;