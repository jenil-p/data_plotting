import React from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiBarChart2, FiCpu, FiArrowRight, FiUsers } from 'react-icons/fi';
import '../App.css';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gray-800 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 animate-gradient" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
            Transform Your Data with PlotPilot
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
            Upload Excel or CSV files, create stunning visualizations, and unlock AI-driven insights to empower your decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up animation-delay-400">
            <Link
              to="/login"
              className="bg-white  text-gray-800 hover:text-white px-6 py-3 rounded-lg font-semibold hover:backdrop-blur-3xl hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900 transition-all duration-300 flex items-center justify-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 hover:shadow-lg transition-all duration-300"
            >
              About Us
            </Link>
          </div>
          <div className="mt-12 hidden md:block animate-slide-up animation-delay-600">
            <svg
              className="w-full max-w-4xl mx-auto h-auto"
              viewBox="0 0 600 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="50" y="50" width="500" height="200" rx="20" fill="white" fillOpacity="0.1" />
              <path d="M100 200L200 150L300 180L400 120L500 160" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <circle cx="200" cy="150" r="8" fill="white" />
              <circle cx="300" cy="180" r="8" fill="white" />
              <circle cx="400" cy="120" r="8" fill="white" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in">
            Why PlotPilot Stands Out
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1: File Upload */}
            <div className="p-6 bg-gray-700 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in animation-delay-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full mb-4">
                <FiUpload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Effortless File Upload
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                Drag and drop your Excel or CSV files to start analyzing data in seconds.
              </p>
            </div>

            {/* Feature 2: Graph Generation */}
            <div className="p-6 bg-gray-700 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in animation-delay-400">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full mb-4">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stunning Visualizations
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                Generate interactive 2D and 3D charts tailored to your dataset with ease.
              </p>
            </div>

            {/* Feature 3: AI Insights */}
            <div className="p-6 bg-gray-700 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in animation-delay-600">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full mb-4">
                <FiCpu className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI-Driven Insights
              </h3>
              <p className="text-gray-200 text-sm sm:text-base">
                Leverage AI to uncover trends, patterns, and predictions from your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in">
            Trusted by Data Enthusiasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 bg-gray-700 rounded-xl shadow-md animate-fade-in animation-delay-200">
              <p className="text-gray-400 italic mb-4">
                "PlotPilot turned my raw data into beautiful charts in minutes. The AI insights were a game-changer!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Jane Doe</p>
                  <p className="text-gray-300 text-sm">Data Analyst</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-700 rounded-xl shadow-md animate-fade-in animation-delay-400">
              <p className="text-gray-400 italic mb-4">
                "Uploading my CSV was effortless, and the visualizations helped me present my findings with confidence."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">John Smith</p>
                  <p className="text-gray-300 text-sm">Business Owner</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-700 rounded-xl shadow-md animate-fade-in animation-delay-600">
              <p className="text-gray-400 italic mb-4">
                "The AI feature helped me discover trends I would’ve missed. PlotPilot is now my go-to tool!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                  EM
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Emily Miles</p>
                  <p className="text-gray-300 text-sm">Researcher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-slide-up">
            Ready to Unlock Your Data’s Potential?
          </h2>
          <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Join PlotPilot today and start visualizing, analyzing, and acting on your data like never before.
          </p>
          <Link
            to="/login"
            className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:text-white hover:shadow-lg shadow-gray-900 transition-all duration-300 inline-flex items-center animate-slide-up animation-delay-400"
          >
            Start Now <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PlotPilot</h3>
              <p className="text-gray-400 text-sm">
                Empowering you to visualize and analyze data with ease. Upload, explore, and discover insights today.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.98 0a6.99 6.99 0 015.02 2.07V0h4v7.986h-4V4.672A4.978 4.978 0 0017 2.01c-2.763 0-5 2.238-5 5v.714L7 10.548v4.286l5-2.857V17c0 2.762 2.237 5 5 5a4.978 4.978 0 004.98-4.672h4V25h-4v-2.07A6.99 6.99 0 0116.98 25c-3.866 0-7-3.134-7-7v-5.714l-5 2.857V10.86l5-2.857V7c0-3.866 3.134-7 7-7z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>© 2025 PlotPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;