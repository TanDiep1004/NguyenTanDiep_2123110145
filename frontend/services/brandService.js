import { fetchApi } from '@/lib/api';

export const brandService = {
  getAllBrands: async () => {
    return await fetchApi('/public/brands', {
      method: 'GET',
    });
  },

  getAllBrandsAdmin: async () => {
    return await fetchApi('/admin/brands', {
      method: 'GET',
    });
  },

  createBrand: async (brandData) => {
    return await fetchApi('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
  },

  updateBrand: async (id, brandData) => {
    return await fetchApi(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
  },

  deleteBrand: async (id) => {
    return await fetchApi(`/admin/brands/${id}`, {
      method: 'DELETE',
    });
  },
};
