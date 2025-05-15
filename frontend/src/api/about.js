import API from './axios';

export const getAbout = async () => {
  const response = await API.get('/about');
  return response.data;
};

export const updateAbout = async (aboutData) => {
  const response = await API.patch('/about', aboutData);
  return response.data;
};