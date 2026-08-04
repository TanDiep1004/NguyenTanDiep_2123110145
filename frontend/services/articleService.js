import { fetchApi } from '@/lib/api';

export const articleService = {
  // Public APIs for Storefront
  getAllArticlesPublic: async () => {
    return await fetchApi('/public/articles', {
      method: 'GET',
    });
  },

  getArticleByIdPublic: async (id) => {
    return await fetchApi(`/public/articles/${id}`, {
      method: 'GET',
    });
  },

  // Admin APIs
  getAllArticlesAdmin: async () => {
    return await fetchApi('/admin/articles', {
      method: 'GET',
    });
  },

  createArticle: async (articleData) => {
    return await fetchApi('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  updateArticle: async (id, articleData) => {
    return await fetchApi(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  deleteArticle: async (id) => {
    return await fetchApi(`/admin/articles/${id}`, {
      method: 'DELETE',
    });
  },
};
