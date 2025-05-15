import API from './axios';

export const createProject = async (formData) => {
  console.log('createProject FormData:', {
    file: formData.get('file')?.name,
    name: formData.get('name'),
  });
  const response = await API.post('/projects', formData);
  return response.data;
};

export const getProjects = async () => {
  const response = await API.get('/projects');
  return response.data;
};

export const getProject = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

export const getFileData = async (id) => {
  const response = await API.get(`/projects/${id}/file`);
  return response.data;
};

export const addChart = async (projectId, chartData) => {
  const response = await API.post(`/projects/${projectId}/charts`, chartData);
  return response.data;
};

export const deleteChart = async (projectId, chartId) => {
  const response = await API.delete(`/projects/${projectId}/charts/${chartId}`);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};