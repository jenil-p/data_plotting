import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUsername, updatePassword } from '../../api/auth';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../features/auth/authSlice';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Validate inputs
    if (!username.trim() && (!password || !confirmPassword)) {
      toast.error('Please provide a username or password to update');
      return;
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        hasErrors = true;
      }
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    setIsLoading(true);
    try {
      let usernameUpdated = false;
      let passwordUpdated = false;

      // Update username if changed
      if (username.trim() && username !== user?.username) {
        const response = await updateUsername(username);
        dispatch(setCredentials({ user: response.user }));
        usernameUpdated = true;
      }

      // Update password if provided
      if (password && confirmPassword) {
        await updatePassword({ password, confirmPassword });
        passwordUpdated = true;
      }

      // Show success message based on what was updated
      if (usernameUpdated && passwordUpdated) {
        toast.success('Username and password updated successfully!');
      } else if (usernameUpdated) {
        toast.success('Username updated successfully!');
      } else if (passwordUpdated) {
        toast.success('Password updated successfully!');
      }

      // Clear password fields after successful update
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Update Account Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              maxLength="20"
              placeholder="Enter new username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              minLength="8"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              minLength="8"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (!username.trim() && !password && !confirmPassword)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;