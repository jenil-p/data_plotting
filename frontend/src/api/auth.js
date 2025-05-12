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
  const token = localStorage.getItem('token');
  console.log('getMe request with token:', token);
  const response = await API.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateUsername = async (username) => {
  const response = await API.patch('/users/update-username', { username });
  return response;
};

export const updateProfilePicture = async (formData) => {
  const response = await API.patch('/users/update-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};


// import API from './axios';

// export const signup = async (userData) => {
//   const response = await API.post('/auth/signup', userData);
//   return response.data;
// };

// export const login = async (credentials) => {
//   const response = await API.post('/auth/login', credentials);
//   return response.data;
// };

// export const logout = async () => {
//   const response = await API.post('/auth/logout');
//   return response.data;
// };

// export const getMe = async () => {
//   const response = await API.get('/users/me');
//   return response.data;
// };