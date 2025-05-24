import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import { getAbout } from '../api/about';
import { toast } from 'react-hot-toast';
import '../App.css';

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
    return <div className="text-center text-gray-400 py-10 text-lg bg-gray-800 min-h-screen">Loading...</div>;
  }

  const content = (
    <div className="min-h-screen bg-gray-800">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-gray-600 to-indigo-700 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-indigo-700 animate-gradient" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
            About PlotPilot
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
            Discover the story behind PlotPilot and the team making data visualization accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-700 rounded-xl shadow-md p-6 sm:p-8 mb-12 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Our Mission</h2>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed">{aboutData.mission}</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {aboutData.team.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-12 animate-fade-in">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {aboutData.team.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="h-24 w-24 rounded-full bg-gray-600 mx-auto mb-4 flex items-center justify-center shadow-md">
                    <span className="text-3xl font-bold text-white">{member.initials}</span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">{member.name}</h3>
                  <p className="text-gray-300 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-700 rounded-xl shadow-md p-6 sm:p-8 animate-fade-in animation-delay-200">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-200 text-base sm:text-lg">
              <div className="flex items-center">
                <FiMail className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <strong className="text-white">Email:</strong> {aboutData.contact.email}
                </div>
              </div>
              <div className="flex items-center">
                <FiPhone className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <strong className="text-white">Phone:</strong> {aboutData.contact.phone}
                </div>
              </div>
              <div className="flex items-center">
                <FiMapPin className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <strong className="text-white">Address:</strong> {aboutData.contact.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Unauthenticated Only) */}
      {!user && (
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
      )}
    </div>
  );

  return user ? <DashboardLayout>{content}</DashboardLayout> : <div>{content}</div>;
};

export default About;