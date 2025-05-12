// src/pages/dashboard/About.jsx
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const About = () => {
  return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">About PlotPilot</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                PlotPilot was created to simplify data visualization for everyone. We believe that 
                powerful insights should be accessible without requiring complex tools or technical 
                expertise.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 mt-6">The Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-100 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl text-indigo-600">JD</span>
                  </div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-gray-500 text-sm">Founder & CEO</p>
                </div>
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-100 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl text-indigo-600">AS</span>
                  </div>
                  <h3 className="font-medium">Alice Smith</h3>
                  <p className="text-gray-500 text-sm">Lead Developer</p>
                </div>
                <div className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-100 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl text-indigo-600">RJ</span>
                  </div>
                  <h3 className="font-medium">Robert Johnson</h3>
                  <p className="text-gray-500 text-sm">Data Scientist</p>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 mt-6">Contact Us</h2>
              <p className="mb-2">
                <strong>Email:</strong> support@plotpilot.com
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> (123) 456-7890
              </p>
              <p>
                <strong>Address:</strong> 123 Data Street, Visualization City, DV 12345
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default About;