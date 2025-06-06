import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSave, FiPlus, FiTrash2, FiEye, FiChevronRight } from 'react-icons/fi';
import { getAbout, updateAbout } from '../../api/about';
import { useNavigate } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState('edit');
  const navigate = useNavigate();

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

  const handlePreview = () => {
    navigate('/about');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Page Editor</h1>
          <p className="text-gray-600 mt-2">Edit and preview your about page content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Panel */}
        <div className={`lg:col-span-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all ${activeTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mission Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
                </div>
                <textarea
                  value={aboutData.mission}
                  onChange={(e) => handleChange(e, 'mission')}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="5"
                  placeholder="Share your company's mission and values..."
                />
              </div>

              {/* Team Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Our Team</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                  >
                    <FiPlus size={16} /> Add Member
                  </button>
                </div>
                
                <div className="space-y-4">
                  {aboutData.team.map((member, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg relative group hover:border-indigo-300 transition-colors">
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(index)}
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleChange(e, 'team', index, 'name')}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleChange(e, 'team', index, 'role')}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Position"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Initials</label>
                          <input
                            type="text"
                            value={member.initials}
                            onChange={(e) => handleChange(e, 'team', index, 'initials')}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="JD"
                            maxLength="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={aboutData.contact.email}
                      onChange={(e) => handleChange(e, 'contact', null, 'email')}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={aboutData.contact.phone}
                      onChange={(e) => handleChange(e, 'contact', null, 'phone')}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={aboutData.contact.address}
                      onChange={(e) => handleChange(e, 'contact', null, 'address')}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                  <FiSave size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`lg:col-span-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
              <button 
                onClick={handlePreview}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View Live <FiChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Mission Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Mission</h4>
                <div className="prose max-w-none text-gray-700">
                  {aboutData.mission || <span className="text-gray-400 italic">No mission statement added</span>}
                </div>
              </div>

              {/* Team Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Team Members</h4>
                <div className="space-y-3">
                  {aboutData.team.length > 0 ? (
                    aboutData.team.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                          {member.initials || 'TM'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{member.name || 'Team Member'}</p>
                          <p className="text-sm text-gray-500">{member.role || 'Role'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No team members added</p>
                  )}
                </div>
              </div>

              {/* Contact Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Email:</span> {aboutData.contact.email || <span className="text-gray-400 italic">Not specified</span>}</p>
                  <p><span className="font-medium text-gray-700">Phone:</span> {aboutData.contact.phone || <span className="text-gray-400 italic">Not specified</span>}</p>
                  <p><span className="font-medium text-gray-700">Address:</span> {aboutData.contact.address || <span className="text-gray-400 italic">Not specified</span>}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAbout;