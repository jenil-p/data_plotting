import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentUser, selectAuthStatus } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute check - user:', user, 'status:', status);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;