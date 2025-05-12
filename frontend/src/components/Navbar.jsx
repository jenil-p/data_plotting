import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">
        PlotPilot
      </Link>
      
      <div className="flex items-center space-x-6">
        {user && (
          <>
            <div className="flex items-center space-x-2">
              <img
                src={
                  user.profilePicture
                    ? `${process.env.REACT_APP_API_URL}/uploads/profile_pics/${user.profilePicture}`
                    : '/default-profile.png'
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:inline">{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <FiLogOut />
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;