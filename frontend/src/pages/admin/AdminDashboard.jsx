import React, { useState, useEffect } from 'react';
import { FiUserX, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getAllUsers, suspendUser, deleteUser } from '../../api/admin';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user? They will not be able to access their account.')) {
      try {
        await suspendUser(userId);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'suspended' } : user
        ));
        toast.success('User suspended successfully');
      } catch (error) {
        console.error('Failed to suspend user:', error);
        toast.error('Failed to suspend user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This will delete their projects and mark their ID as permanently blocked.')) {
      try {
        await deleteUser(userId);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'blocked' } : user
        ));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

  const activeUsers = filteredUsers.filter(user => user.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">Total Active Users:</span> {activeUsers.length}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Users</h2>
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
        {activeUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No active users found.</p>
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
                {activeUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.username}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.projectsCount}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="flex items-center text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Suspend User"
                        >
                          <FiUserX className="mr-1" /> Suspend
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
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

export default AdminDashboard;