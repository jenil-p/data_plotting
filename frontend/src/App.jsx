import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { fetchUser } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import CreateProject from './pages/dashboard/CreateProject';
import History from './pages/dashboard/History';
import AIAnalysis from './pages/dashboard/AIAnalysis';
import Settings from './pages/dashboard/Settings';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuspendedIDs from './pages/admin/SuspendedIDs';
import BlockedIDs from './pages/admin/BlockedIDs';
import Admins from './pages/admin/Admins';
import EditAbout from './pages/admin/EditAbout';
import ProjectDetails from './pages/dashboard/ProjectDetails';
import { useLocation } from 'react-router-dom';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Protected routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* User routes */}
                <Route path="/dashboard" element={<CreateProject />} />
                <Route path="/dashboard/:id" element={<ErrorBoundary><ProjectDetails /></ErrorBoundary>} />
                <Route path="/history" element={<History />} />
                <Route path="/ai-analysis" element={<AIAnalysis />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admindash" element={<AdminDashboard />} />
                <Route path="/admindash/suspended" element={<SuspendedIDs />} />
                <Route path="/admindash/blocked" element={<BlockedIDs />} />
                <Route path="/admindash/admins" element={<Admins />} />
                <Route path="/admindash/edit-about" element={<EditAbout />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" />
        </AuthWrapper>
      </Router>
    </Provider>
  );
}

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, status, dashboardView } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const redirectablePublicPaths = ['/', '/login', '/signup']; // Exclude /about from redirect
    const isRedirectablePublicPath = redirectablePublicPaths.includes(location.pathname);

    if (status === 'loading') return;

    if (token && user) {
      // Only redirect if the user is on a redirectable public path (i.e., not /about)
      if (isRedirectablePublicPath) {
        const redirectPath = dashboardView === 'admin' ? '/admindash' : '/dashboard';
        navigate(redirectPath, { replace: true });
      }
    } else if (!redirectablePublicPaths.includes(location.pathname) && location.pathname !== '/about') {
      // Redirect to login if the user is not authenticated and trying to access a non-public route
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [status, token, user, dashboardView, navigate, location]);


  return children;
};

export default App;