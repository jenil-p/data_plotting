import API from './axios';

export const getAllUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

export const getSuspendedUsers = async () => {
  const response = await API.get('/admin/users/suspended');
  return response.data;
};

export const getBlockedUsers = async () => {
  const response = await API.get('/admin/users/blocked');
  return response.data;
};

export const suspendUser = async (userId) => {
  const response = await API.patch(`/admin/users/${userId}/suspend`);
  return response.data;
};

export const unsuspendUser = async (userId) => {
  const response = await API.patch(`/admin/users/${userId}/unsuspend`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await API.delete(`/admin/users/${userId}`);
  return response.data;
};

export const promoteToAdmin = async (userId) => {
  const response = await API.patch(`/admin/users/${userId}/promote`);
  return response.data;
};

export const getAdmins = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};