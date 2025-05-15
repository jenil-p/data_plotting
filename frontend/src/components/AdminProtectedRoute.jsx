import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // Mock role check for now (replace with actual role check from user data)
  const isAdmin = user?.role === 'admin'; // Assuming user object has a 'role' field

  if (!isAdmin) {
    console.log('User is not an admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;