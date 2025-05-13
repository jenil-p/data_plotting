import React, { useState } from 'react';
import { FiFilePlus, FiClock, FiBarChart2, FiSettings, FiInfo } from 'react-icons/fi';
import { RiCloseLine } from 'react-icons/ri';
import { Link, Outlet, useNavigate ,useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    if(confirm("Are you sure Want to Logout ?")){
      try {
        await dispatch(logoutUser()).unwrap();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const menuItems = [
    { name: 'Create Project', icon: <FiFilePlus />, path: '/dashboard' },
    { name: 'History', icon: <FiClock />, path: '/history' },
    { name: 'AI Analysis', icon: <FiBarChart2 />, path: '/ai-analysis' },
    { name: 'Account Settings', icon: <FiSettings />, path: '/settings' },
    { name: 'About Us', icon: <FiInfo />, path: '/about' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">PlotPilot</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={item.path}
                  // className="flex items-center p-3 hover:bg-gray-700 rounded-lg mx-2"
                  className={`flex items-center p-3 hover:bg-gray-700 rounded-lg mx-2 ${location.pathname === item.path ? 'bg-gray-700' : ''
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Logout
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;