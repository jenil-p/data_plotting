import API from './axios';

export const createProject = async (projectData) => {
  const formData = new FormData();
  formData.append('file', projectData.file);
  if (projectData.name) formData.append('name', projectData.name);

  const token = localStorage.getItem('token');
  console.log('createProject request with token:', token);
  console.log('createProject FormData:', {
    file: projectData.file.name,
    name: projectData.name,
  });
  const response = await API.post('/projects', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProjects = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/projects', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProject = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.get(`/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addChart = async (projectId, chartData) => {
  const token = localStorage.getItem('token');
  const response = await API.post(`/projects/${projectId}/charts`, chartData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  const token = localStorage.getItem('token');
  const response = await API.delete(`/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};