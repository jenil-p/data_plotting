import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { fetchUser, selectCurrentToken, selectCurrentUser, logoutUser, selectAuthStatus } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/DashboardLayout';
import CreateProject from './pages/dashboard/CreateProject';
import History from './pages/dashboard/History';
import AIAnalysis from './pages/dashboard/AIAnalysis';
import Settings from './pages/dashboard/Settings';
import About from './pages/dashboard/About';
import ProjectDetails from './pages/dashboard/ProjectDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<CreateProject />} />
                <Route path="/dashboard/:id" element={<ProjectDetails />} />
                <Route path="/history" element={<History />} />
                <Route path="/ai-analysis" element={<AIAnalysis />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" />
        </AuthWrapper>
      </Router>
    </Provider>
  );
}

// Update AuthWrapper component
const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for existing token on initial load
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && user && token) {
      navigate('/dashboard', { replace: true });
    } else if (status === 'failed') {
      navigate('/login', { replace: true });
    }
  }, [status, token, user, navigate]);

  return children;
};

export default App;