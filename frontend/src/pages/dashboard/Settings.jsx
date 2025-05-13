import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUsername } from '../../api/auth';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../features/auth/authSlice';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateUsername(username);
      dispatch(setCredentials({ user: response.user }));
      toast.success('Username updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Username</h2>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              New Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength="20"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || username === user?.username}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Username'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;