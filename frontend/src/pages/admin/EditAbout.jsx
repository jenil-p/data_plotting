import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getAbout, updateAbout } from '../../api/about';

const EditAbout = () => {
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

  const handleAddTeamMember = () => {
    setAboutData({
      ...aboutData,
      team: [...aboutData.team, { name: '', role: '', initials: '' }],
    });
  };

  const handleRemoveTeamMember = (index) => {
    if (aboutData.team.length <= 1) {
      toast.error('At least one team member is required');
      return;
    }
    const updatedTeam = aboutData.team.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, team: updatedTeam });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!aboutData.mission || !aboutData.contact.email || !aboutData.contact.phone || !aboutData.contact.address) {
        throw new Error('Please fill in all required fields');
      }
      if (aboutData.team.length === 0 || aboutData.team.some(member => !member.name || !member.role || !member.initials)) {
        throw new Error('Please fill in all team member details');
      }

      await updateAbout(aboutData);
      toast.success('About page updated successfully!');
    } catch (error) {
      console.error('Failed to update About data:', error);
      toast.error(error.message || 'Failed to update About page');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">The Team</h2>
            <button
              type="button"
              onClick={handleAddTeamMember}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiPlus className="mr-1" /> Add Member
            </button>
          </div>
          {aboutData.team.map((member, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg relative">
              <button
                type="button"
                onClick={() => handleRemoveTeamMember(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <FiTrash2 />
              </button>
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