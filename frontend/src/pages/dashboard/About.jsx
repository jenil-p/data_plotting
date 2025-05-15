import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const About = () => {
  const [aboutData, setAboutData] = useState({
    mission: 'PlotPilot was created to simplify data visualization for everyone. We believe that powerful insights should be accessible without requiring complex tools or technical expertise.',
    team: [
      { name: 'John Doe', role: 'Founder & CEO', initials: 'JD' },
      { name: 'Alice Smith', role: 'Lead Developer', initials: 'AS' },
      { name: 'Robert Johnson', role: 'Data Scientist', initials: 'RJ' },
    ],
    contact: {
      email: 'support@plotpilot.com',
      phone: '(123) 456-7890',
      address: '123 Data Street, Visualization City, DV 12345',
    },
  });

  useEffect(() => {
    // Load from localStorage if exists
    const savedData = localStorage.getItem('aboutData');
    if (savedData) {
      setAboutData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">About PlotPilot</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">{aboutData.mission}</p>

            <h2 className="text-xl font-semibold mb-4 mt-6">The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {aboutData.team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="h-32 w-32 rounded-full bg-indigo-100 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-4xl text-indigo-600">{member.initials}</span>
                  </div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Contact Us</h2>
            <p className="mb-2"><strong>Email:</strong> {aboutData.contact.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {aboutData.contact.phone}</p>
            <p><strong>Address:</strong> {aboutData.contact.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;