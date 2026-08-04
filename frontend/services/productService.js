import { fetchApi } from '@/lib/api';

export const productService = {
  // Public APIs
  getAllProducts: async () => {
    return await fetchApi('/public/products', {
      method: 'GET',
    });
  },

  getAllProductsPublic: async () => {
    return await fetchApi('/public/products', {
      method: 'GET',
    });
  },

  getProductById: async (id) => {
    return await fetchApi(`/public/products/${id}`, {
      method: 'GET',
    });
  },

  // Admin APIs
  getAllProductsAdmin: async () => {
    return await fetchApi('/admin/products', {
      method: 'GET',
    });
  },

  createProduct: async (productData) => {
    return await fetchApi('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return await fetchApi(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return await fetchApi(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },
};
