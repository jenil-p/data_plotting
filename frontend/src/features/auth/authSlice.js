import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, login, logout, getMe } from '../../api/auth';
import { toast } from 'react-hot-toast';

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signup(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      // console.log('Login response:', response.data);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();
      // console.log('logoutUser response:', response);
      return response;
    } catch (error) {
      console.error('Logout API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await getMe();
      return response.data.user;
    } catch (error) {
      console.error('fetchUser error:', error);
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    status: localStorage.getItem('token') ? 'loading' : 'idle',
    error: null,
    dashboardView: 'user', // Default view for users; admins can toggle
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setDashboardView: (state, action) => {
      state.dashboardView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        toast.success('Account created successfully!');
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        // console.log('Redux state after login:', {
        //   user: state.user,
        //   token: state.token,
        // });
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = null;
        state.dashboardView = 'user'; // Reset to user view on logout
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.dashboardView = 'user'; // Reset to user view on logout
        localStorage.removeItem('token');
        toast.error('Logout failed. Session cleared.');
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = localStorage.getItem('token');
        // Set default dashboard view based on role
        state.dashboardView = action.payload.role === 'admin' ? 'admin' : 'user';
        // console.log('User fetched successfully:', action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.dashboardView = 'user'; // Reset to user view on failure
        localStorage.removeItem('token');
        console.error('Failed to fetch user:', action.payload);
      });
  },
});

export const { setCredentials, setDashboardView } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectDashboardView = (state) => state.auth.dashboardView;

export default authSlice.reducer;