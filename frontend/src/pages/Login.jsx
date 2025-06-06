import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import '../App.css';

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
    default:
      return 'Login failed. Please try again or contact support.';
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

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
      await dispatch(loginUser(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle token expiration or unauthorized access
  React.useEffect(() => {
    if (error && error.includes('Invalid or expired token')) {
      localStorage.removeItem('token'); // Clear invalid token
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg animate-fade-in space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Sign in to PlotPilot
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Access your data and unlock powerful insights
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
                placeholder="Email address"
              />
            </div>
            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 .896-2 2zM7 20h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {getFriendlyErrorMessage(error)}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0a12 12 0 00-12 12h4z"
                  />
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-sm mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;