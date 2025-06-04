import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiLoader, FiBarChart2, FiX } from 'react-icons/fi';
import { sendAIChatMessage } from '../api/project';
import { toast } from 'react-hot-toast';
import '../App.css'

const ChatBoard = ({ projectId, columns, data }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const chatContainer = useRef(null);

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
    <div className="flex flex-col h-full">
      {/* Header: Columns */}
      <div className="columns">
        {isColumnsOpen ? (
          <div className="p-4 relative animate-roll-down">
            <button
              onClick={() => setIsColumnsOpen(false)}
              className="absolute top-2 right-2 p-1 text-gray-800 hover:bg-indigo-100 rounded-full transition-colors"
              aria-label="Close columns"
            >
              <FiX className="h-5 w-5" />
            </button>
            <p className="text-indigo-800 text-sm font-medium">Available columns :</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {columns.map((col, index) => (
                <span
                  key={index}
                  className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => setInput((prev) => `${prev} ${col}`.trim())}
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="p-4 ml-1 mr-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors"
            onClick={() => setIsColumnsOpen(true)}
          >
            <p className="text-indigo-800 text-sm font-medium">Available columns ...</p>
          </div>
        )}
      </div>

      {/* Scrollable Messages */}
      <div
        ref={chatContainer}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FiBarChart2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ask About Your Data</h3>
            <p className="text-gray-500 text-sm max-w-md">
              Start a conversation with the AI assistant to analyze your dataset. Try questions like:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                "What is the average of [column]?"
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                "Show trends in [column]"
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                "Find outliers in the data"
              </li>
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#707ee1] text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 rounded-bl-none max-w-[70%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#707ee1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#707ee1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#707ee1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-gray-500 text-sm">Analyzing data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-2xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-lg ${
              isLoading || !input.trim()
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[#707ee1] text-white cursor-pointer'
            } transition-colors`}
          >
            {isLoading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiSend />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBoard;