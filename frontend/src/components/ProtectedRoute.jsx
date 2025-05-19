import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentUser, selectAuthStatus } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const { user, token, status } = useSelector((state) => state.auth);
  const location = useLocation();

  // console.log('ProtectedRoute state:', { user, token, status });

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">
      <div>Verifying your session...</div>
    </div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;