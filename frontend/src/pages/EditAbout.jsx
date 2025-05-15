import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const EditAbout = () => {
  const [aboutData, setAboutData] = useState({
    mission: '',
    team: [
      { name: '', role: '', initials: '' },
      { name: '', role: '', initials: '' },
      { name: '', role: '', initials: '' },
    ],
    contact: {
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    // Load default data or from localStorage
    const defaultData = {
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
    };
    const savedData = localStorage.getItem('aboutData');
    setAboutData(savedData ? JSON.parse(savedData) : defaultData);
  }, []);

  const handleChange = (e, section, index, field) => {
    const updatedData = { ...aboutData };
    if (section === 'mission') {
      updatedData.mission = e.target.value;
    } else if (section === 'team') {
      updatedData.team[index][field] = e.target.value;
    } else if (section === 'contact') {
      updatedData.contact[field] = e.target.value;
    }
    setAboutData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('aboutData', JSON.stringify(aboutData));
      toast.success('About page updated successfully!');
    } catch (error) {
      console.error('Failed to save about data:', error);
      toast.error('Failed to update About page');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit About Page</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
        {/* Mission Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <textarea
            value={aboutData.mission}
            onChange={(e) => handleChange(e, 'mission')}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder="Enter the mission statement..."
          />
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">The Team</h2>
          {aboutData.team.map((member, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleChange(e, 'team', index, 'name')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Team member name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleChange(e, 'team', index, 'role')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Team member role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Initials</label>
                  <input
                    type="text"
                    value={member.initials}
                    onChange={(e) => handleChange(e, 'team', index, 'initials')}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Initials (e.g., JD)"
                    maxLength="2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={aboutData.contact.email}
                onChange={(e) => handleChange(e, 'contact', null, 'email')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contact email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={aboutData.contact.phone}
                onChange={(e) => handleChange(e, 'contact', null, 'phone')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contact phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={aboutData.contact.address}
                onChange={(e) => handleChange(e, 'contact', null, 'address')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contact address"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <FiSave className="mr-2" /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAbout;