// src/pages/dashboard/AIAnalysis.jsx
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const AIAnalysis = () => {
  return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Analysis</h1>
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis Coming Soon</h3>
          <p className="text-gray-500">We're working on advanced AI features to help you gain deeper insights from your data.</p>
        </div>
      </div>
  );
};

export default AIAnalysis;