import React, { useState } from 'react';
import { FiFilePlus, FiClock, FiBarChart2, FiSettings, FiShield, FiUsers, FiEdit, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setDashboardView } from '../features/auth/authSlice';
import { selectDashboardView } from '../features/auth/authSlice';
import '../App.css'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const dashboardView = useSelector(selectDashboardView);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const handleSwitchView = (view) => {
    dispatch(setDashboardView(view));
    const redirectPath = view === 'admin' ? '/admindash' : '/dashboard';
    navigate(redirectPath);
  };

  const userMenuItems = [
    { name: 'Create Project', icon: <FiFilePlus />, path: '/dashboard' },
    { name: 'History', icon: <FiClock />, path: '/history' },
    { name: 'AI Analysis', icon: <FiBarChart2 />, path: '/ai-analysis' },
    { name: 'Account Settings', icon: <FiSettings />, path: '/settings' },
  ];

  const adminMenuItems = [
    { name: 'Users', icon: <FiUsers />, path: '/admindash' },
    { name: 'Suspended IDs', icon: <FiShield />, path: '/admindash/suspended' },
    { name: 'Blocked IDs', icon: <FiShield />, path: '/admindash/blocked' },
    { name: 'Admins', icon: <FiUser />, path: '/admindash/admins' },
    { name: 'Edit About', icon: <FiEdit />, path: '/admindash/edit-about' },
  ];

  const menuItems = dashboardView === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="sm:block md:hidden fixed top-14 left-1 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <FiMenu className="h-4 w-4" />
      </button>

      {/* Sidebar (Tablet/Desktop) */}
      <div
        className={`
          hidden md:block
          ${sidebarOpen ? 'w-64' : 'w-20'}
          bg-gray-800 text-white transition-all duration-300 ease-in-out
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">PlotPilot</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center p-3 hover:bg-gray-700 rounded-lg mx-2 ${
                    location.pathname === item.path ? 'bg-gray-700' : ''
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

      {/* Mobile Sidebar Modal */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-40 md:hidden"
          >
            <div className="w-64 bg-gray-800 text-white rounded-lg shadow-xl animate-modal-open">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">PlotPilot</h1>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-700"
                  aria-label="Close sidebar"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <nav className="mt-6">
                <ul>
                  {menuItems.map((item, index) => (
                    <li key={index} className="mb-2">
                      <Link
                        to={item.path}
                        className={`flex items-center p-3 hover:bg-gray-700 rounded-lg mx-2 ${
                          location.pathname === item.path ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 sm:pl-16 md:pl-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {dashboardView === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSwitchView('user')}
                    className={`px-3 py-1 rounded-lg ${dashboardView === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    User Dashboard
                  </button>
                  <button
                    onClick={() => handleSwitchView('admin')}
                    className={`px-3 py-1 rounded-lg ${dashboardView === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    Admin Panel
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-200 text-red-600 py-1 px-3 rounded hover:bg-red-300"
              >
                Logout
              </button>
              <Link to="/settings">
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;