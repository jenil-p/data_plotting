import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiUserPlus, FiUser, FiSearch, FiUserMinus } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAdmins, promoteToAdmin, demoteToUser } from '../../api/admin';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAdminsAndUsers = async () => {
      try {
        const response = await getAdmins();
        const allUsers = response.data.users;
        setAdmins(allUsers.filter(user => user.role === 'admin'));
        setUsers(allUsers.filter(user => user.role !== 'admin' && user.status === 'active'));
        setFilteredUsers(allUsers.filter(user => user.role !== 'admin' && user.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch admins:', error);
        toast.error('Failed to load admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminsAndUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handlePromoteToAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to promote this user to admin?')) {
      try {
        await promoteToAdmin(userId);
        setUsers(users.filter(user => user.id !== userId));
        setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        const promotedUser = users.find(user => user.id === userId);
        setAdmins([...admins, { ...promotedUser, role: 'admin' }]);
        toast.success('User promoted to admin');
      } catch (error) {
        console.error('Failed to promote user:', error);
        toast.error('Failed to promote user');
      }
    }
  };

  const handleDemoteToUser = async (userId) => {
    if (admins.length === 1) {
      toast.info('Cannot demote yourself as you are the only admin');
      return;
    }

    if (window.confirm('Are you sure you want to demote this admin to user?')) {
      try {
        await demoteToUser(userId);
        setAdmins(admins.filter(admin => admin.id !== userId));
        const demotedUser = admins.find(admin => admin.id === userId);
        setUsers([...users, { ...demotedUser, role: 'user' }]);
        setFilteredUsers([...filteredUsers, { ...demotedUser, role: 'user' }]);
        toast.success('Admin demoted to user');
      } catch (error) {
        console.error('Failed to demote admin:', error);
        toast.error('Failed to demote admin');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admins</h1>

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
                  <th className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-indigo-50 transition-colors duration-200">
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{admin.username}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">{admin.email}</td>
                    <td className="border-b border-gray-200 px-6 py-4 text-gray-700">
                      <button
                        onClick={() => handleDemoteToUser(admin.id)}
                        disabled={admins.length === 1 && admin.id === user?.id}
                        className={`flex items-center text-red-600 hover:text-red-800 transition-colors ${
                          admins.length === 1 && admin.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={admins.length === 1 && admin.id === user?.id ? 'Cannot demote yourself as the only admin' : 'Demote to User'}
                      >
                        <FiUserMinus className="mr-1" /> Demote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Promote Users to Admin</h2>
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
        {filteredUsers.length === 0 ? (
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
                {filteredUsers.map((user) => (
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
