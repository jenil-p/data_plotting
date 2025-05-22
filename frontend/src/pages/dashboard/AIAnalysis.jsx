// src/pages/dashboard/AIAnalysis.jsx
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FiBarChart2 } from 'react-icons/fi';

const AIAnalysis = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Data Analysis</h1>
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex justify-center mb-4">
          <FiBarChart2 className="h-12 w-12 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
          Analyze Your Data with AI
        </h3>
        <p className="text-gray-600 mb-4">
          Our AI Data Analysis feature allows you to interact with your uploaded dataset directly on the Project Details page. Using a chat interface powered by ChatGPT, you can ask questions about your data, such as summarizing trends, calculating averages, or identifying patterns.
        </p>
        <h4 className="text-md font-semibold text-gray-800 mb-2">How to Use</h4>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Navigate to a project's details page from your dashboard.</li>
          <li>Find the "AI Data Analysis" section below the chart creation form.</li>
          <li>View the available column headers displayed above the chat input.</li>
          <li>Type a question or prompt, such as:
            <ul className="list-circle list-inside ml-4 mt-1">
              <li>"What is the average value of [column_name]?"</li>
              <li>"Summarize the trends in the dataset."</li>
              <li>"How many rows have [column_name] greater than X?"</li>
            </ul>
          </li>
          <li>Press the send button to receive an AI-generated response.</li>
        </ul>
        <p className="text-gray-600">
          The AI has access to your dataset's column headers and a sample of the data, ensuring accurate and relevant responses. Try specific questions about your data to get the most value!
        </p>
      </div>
    </div>
  );
};

export default AIAnalysis;