import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { loginUser, signupUser } from './authSlice';

// Map backend error messages to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';

  switch (errorMessage) {
    case 'Please provide email and password':
      return 'Please enter both email and password.';
    case 'Incorrect email or password':
      return 'The email or password you entered is incorrect.';
    case 'Invalid or expired token. Please log in again.':
      return 'Your session has expired. Please log in again.';
    case 'You are not logged in! Please log in to get access.':
      return 'Please log in to continue.';
    case 'Duplicate field value: email':
      return 'This email is already registered. Please use another email.';
    case 'Passwords do not match':
      return 'The passwords you entered do not match.';
    default:
      return type === 'login'
        ? 'Login failed. Please try again or contact support.'
        : 'Signup failed. Please try again or contact support.';
  }
};

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: type === 'signup' ? '' : undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error); // Access error from Redux state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate passwords for signup
      if (type === 'signup' && formData.password !== formData.confirmPassword) {
        toast.error(getFriendlyErrorMessage('Passwords do not match'));
        return;
      }

      const action = type === 'login' ? loginUser : signupUser;
      const payload =
        type === 'signup'
          ? {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }
          : { email: formData.email, password: formData.password };

      await dispatch(action(payload)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {type === 'login' ? 'Login' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signup' && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                maxLength="20"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Your username"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {type === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                required
                minLength="8"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {getFriendlyErrorMessage(error)}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : type === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {type === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;