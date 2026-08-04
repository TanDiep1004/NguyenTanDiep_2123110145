import { fetchApi } from '@/lib/api';

export const categoryService = {
  getAllCategories: async () => {
    return await fetchApi('/public/categories', {
      method: 'GET',
    });
  },

  getAllCategoriesAdmin: async () => {
    return await fetchApi('/admin/categories', {
      method: 'GET',
    });
  },

  createCategory: async (categoryData) => {
    return await fetchApi('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (id, categoryData) => {
    return await fetchApi(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (id) => {
    return await fetchApi(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
