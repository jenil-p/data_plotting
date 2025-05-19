import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/DashboardLayout';
import { getAbout } from '../api/about';
import { toast } from 'react-hot-toast';

const About = () => {
  const { user } = useSelector((state) => state.auth);
  const [aboutData, setAboutData] = useState({
    mission: '',
    team: [],
    contact: {
      email: '',
      phone: '',
      address: '',
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await getAbout();
        setAboutData(response.data);
      } catch (error) {
        console.error('Failed to fetch About data:', error);
        toast.error('Failed to load About data');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

  const content = (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-down">
          About PlotPilot
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
          Discover the story behind PlotPilot and the team that's making data visualization accessible to everyone.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform  transition-transform duration-300">
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-6">Our Mission</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{aboutData.mission}</p>
      </div>

      {/* Team Section */}
      {/* <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-8 text-center">The Team</h2>
        <div className="flex justify-center items-center gap-8">
          {aboutData.team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-32 w-32 rounded-full bg-indigo-100 mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-4xl font-bold text-indigo-600">{member.initials}</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-1">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Contact Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-transform duration-300">
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 mb-6">Contact Us</h2>
        <div className="space-y-4 text-gray-700 text-lg">
          <p>
            <strong className="text-gray-900">Email:</strong> {aboutData.contact.email}
          </p>
          <p>
            <strong className="text-gray-900">Phone:</strong> {aboutData.contact.phone}
          </p>
          <p>
            <strong className="text-gray-900">Address:</strong> {aboutData.contact.address}
          </p>
        </div>
      </div>
    </div>
  );

  return user ? <DashboardLayout>{content}</DashboardLayout> : <div className="">{content}</div>;
};

export default About;