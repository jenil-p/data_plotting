import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user && ['/login', '/signup'].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;