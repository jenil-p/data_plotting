import API from './axios';

export const signup = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response;
};

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return {
    ...response,
    data: {
      token: response.data.token,
      user: response.data.data.user
    }
  };
};

export const logout = async () => {
  const response = await API.get('/auth/logout');
  return response;
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const response = await API.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return {
      data: {
        user: response.data.user || response.data.data.user
      }
    };
  } catch (error) {
    console.error('getMe error:', error);
    localStorage.removeItem('token');
    throw error;
  }
};

export const updateUsername = async (username) => {
  const response = await API.patch('/users/update-username', { username });
  return response;
};