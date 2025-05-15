import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { fetchUser } from './features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import CreateProject from './pages/dashboard/CreateProject';
import History from './pages/dashboard/History';
import AIAnalysis from './pages/dashboard/AIAnalysis';
import Settings from './pages/dashboard/Settings';
import About from './pages/dashboard/About';
import AdminDashboard from './pages/AdminDashboard';
import SuspendedIDs from './pages/SuspendedIDs';
import BlockedIDs from './pages/BlockedIDs';
import Admins from './pages/Admins'; // New page for admins
import EditAbout from './pages/EditAbout'; // New page for editing About content
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
                <Route path="/about" element={<About />} />
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
      console.log('Fetching user with token...');
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    console.log('Current location:', location.pathname);
    const publicPaths = ['/', '/login', '/signup'];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (status === 'loading') return;

    if (token && user) {
      if (isPublicPath) {
        const redirectPath = dashboardView === 'admin' ? '/admindash' : '/dashboard';
        console.log(`Redirecting from public path to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      }
    } else if (!isPublicPath) {
      console.log('Redirecting to /login from:', location.pathname);
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [status, token, user, dashboardView, navigate, location]);

  useEffect(() => {
    console.log('Route changed to:', location.pathname);
  }, [location]);

  console.log('AuthWrapper state:', { token, user, status, dashboardView });

  return children;
};

export default App;