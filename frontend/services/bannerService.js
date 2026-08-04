import { fetchApi } from '@/lib/api';

export const bannerService = {
  // Public API
  getAllBannersPublic: async () => {
    return await fetchApi('/public/banners', {
      method: 'GET',
    });
  },

  // Admin APIs
  getAllBannersAdmin: async () => {
    return await fetchApi('/admin/banners', {
      method: 'GET',
    });
  },

  createBanner: async (bannerData) => {
    return await fetchApi('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },

  updateBanner: async (id, bannerData) => {
    return await fetchApi(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  },

  deleteBanner: async (id) => {
    return await fetchApi(`/admin/banners/${id}`, {
      method: 'DELETE',
    });
  },
};
