import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FiBarChart2, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AIAnalysis = () => {
  const steps = [
    {
      title: "Navigate to Project",
      description: "Go to your project's details page from the dashboard."
    },
    {
      title: "Find AI Section",
      description: "Locate the 'AI Data Analysis' section right bottom corner in the form of a logo."
    },
    {
      title: "View Column Headers",
      description: "Check the available column headers displayed above the chat."
    },
    {
      title: "Ask Questions",
      description: "Type questions like averages, trends, or specific data queries."
    },
    {
      title: "Get Insights",
      description: "Receive AI-generated responses about your data."
    }
  ];

  const exampleQuestions = [
    "What is the average value of [column_name]?",
    "Summarize the trends in the dataset.",
    "How many rows have [column_name] greater than X?"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
            <div className="bg-indigo-100 p-6 rounded-full">
              <FiBarChart2 className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Data Analysis</h1>
            <p className="text-lg text-gray-600 mb-6">
              Interact with your datasets using natural language. Get instant insights, summaries, and data visualizations poweblue by AI.
            </p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Try it now <FiChevronRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full h-8 w-8 flex items-center justify-center mr-4 mt-1">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Example Questions</h3>
          <ul className="space-y-3">
            {exampleQuestions.map((question, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 text-indigo-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{question}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-800">
              The AI has access to your dataset's structure and sample data, ensuring accurate and relevant responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;