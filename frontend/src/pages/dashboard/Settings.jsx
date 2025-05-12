import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUsername, updateProfilePicture } from '../../api/auth';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../features/auth/authSlice';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(null);
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setIsLoading(true);
    try {
      const response = await updateProfilePicture(formData);
      dispatch(setCredentials({ user: response.user }));
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : user?.profilePicture
                  ? `${process.env.REACT_APP_API_URL}/uploads/profile_pics/${user.profilePicture}`
                  : '/default-profile.png'
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Click on the camera icon to change your profile picture.
              <br />
              Max file size: 2MB (JPEG, JPG, PNG)
            </p>
          </div>
        </div>
      </div>

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