import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-500">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">
            Welcome to PlotPilot
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Upload your Excel or CSV files, generate stunning graphs, and unlock AI-powered insights to make data-driven decisions with ease.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose PlotPilot?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: File Upload */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy File Upload
              </h3>
              <p className="text-gray-600">
                Seamlessly upload your Excel or CSV files and start exploring your data in seconds.
              </p>
            </div>

            {/* Feature 2: Graph Generation */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Dynamic Graphs
              </h3>
              <p className="text-gray-600">
                Create beautiful, interactive charts and visualizations tailored to your data.
              </p>
            </div>

            {/* Feature 3: AI Insights */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Ask our AI to analyze your data and uncover trends, patterns, and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-500 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">
            Ready to explore your data?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Get Started
            </Link>{' '}
            or{' '}
            <Link to="/about" className="text-blue-600 hover:underline">
              Learn More About Us
            </Link>
          </p>
          <p className="text-gray-400">
            &copy; 2025 PlotPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;