import apiClient from './apiClient';

const post = async (path, payload) => {
  const response = await apiClient.post(path, payload);
  const data = response.data;

  if (!data?.success) {
    const message = data?.message || 'Request failed. Please try again.';
    throw new Error(message);
  }

  return data;
};

export const registerUser = (payload) => post('/api/auth/register', payload);
export const loginUser = (payload) => post('/api/auth/login', payload);
export const updateProfile = async (payload) => {
  const response = await apiClient.patch('/api/auth/me', payload);
  const data = response.data;

  if (!data?.success) {
    const message = data?.message || 'Request failed. Please try again.';
    throw new Error(message);
  }

  return data;
};

export const changePassword = async (payload) => {
  const response = await apiClient.patch('/api/auth/me/password', payload);
  const data = response.data;

  if (!data?.success) {
    const message = data?.message || 'Request failed. Please try again.';
    throw new Error(message);
  }

  return data;
};
