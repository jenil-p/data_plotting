import React, { useState, useEffect } from 'react';
import { FiUserCheck, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getSuspendedUsers, unsuspendUser } from '../../api/admin';

const SuspendedIDs = () => {
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [filteredSuspendedUsers, setFilteredSuspendedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspendedUsers = async () => {
      try {
        const response = await getSuspendedUsers();
        setSuspendedUsers(response.data.users);
        setFilteredSuspendedUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch suspended users:', error);
        toast.error('Failed to load suspended users');
      } finally {
        setLoading(false);
      }
    };
    fetchSuspendedUsers();
  }, []);

  useEffect(() => {
    const filtered = suspendedUsers.filter(user =>
      user.username.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuspendedUsers(filtered);
  }, [searchTerm, suspendedUsers]);

  const handleUnsuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to unsuspend this user? They will regain access to their account.')) {
      try {
        await unsuspendUser(userId);
        setSuspendedUsers(suspendedUsers.filter(user => user.id !== userId));
        setFilteredSuspendedUsers(filteredSuspendedUsers.filter(user => user.id !== userId));
        toast.success('User unsuspended successfully');
      } catch (error) {
        console.error('Failed to unsuspend user:', error);
        toast.error('Failed to unsuspend user');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Suspended Users</h1>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Suspended Accounts</h2>
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by User ID or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        {filteredSuspendedUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No suspended users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800">
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Projects</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuspendedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.username}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.projectsCount}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                      <button
                        onClick={() => handleUnsuspendUser(user.id)}
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                        title="Unsuspend User"
                      >
                        <FiUserCheck className="mr-1" /> Unsuspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuspendedIDs;