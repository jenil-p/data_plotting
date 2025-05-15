import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getAdmins, promoteToAdmin } from '../../api/admin';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminsAndUsers = async () => {
      try {
        const response = await getAdmins();
        const allUsers = response.data.users;
        setAdmins(allUsers.filter(user => user.role === 'admin'));
        setUsers(allUsers.filter(user => user.role !== 'admin' && user.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch admins:', error);
        toast.error('Failed to load admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminsAndUsers();
  }, []);

  const handlePromoteToAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      try {
        await promoteToAdmin(userId);
        setUsers(users.filter(user => user.id !== userId));
        const promotedUser = users.find(user => user.id === userId);
        setAdmins([...admins, { ...promotedUser, role: 'admin' }]);
        toast.success('User promoted to admin successfully');
      } catch (error) {
        console.error('Failed to promote user:', error);
        toast.error('Failed to promote user');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admins</h1>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <h2 className="text-xl font-semibold text-gray-800 p-6">Current Admins</h2>
        {admins.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No admins found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800">
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{admin.username}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{admin.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users Table (for promoting to admin) */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 p-6">Promote Users to Admin</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No active users available to promote.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800">
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Username</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.username}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                      <button
                        onClick={() => handlePromoteToAdmin(user.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        title="Promote to Admin"
                      >
                        <FiUserPlus className="mr-1" /> Promote
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

export default Admins;