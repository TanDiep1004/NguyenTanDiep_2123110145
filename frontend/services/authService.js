import { fetchApi } from '@/lib/api';

export const authService = {
  login: async (credentials) => {
    return await fetchApi('/public/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return await fetchApi('/public/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return await fetchApi('/user/profile', {
      method: 'GET',
    });
  },
};
