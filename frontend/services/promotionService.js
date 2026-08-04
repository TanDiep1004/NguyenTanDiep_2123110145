import { fetchApi } from '@/lib/api';

export const promotionService = {
  applyPromotion: async (promotionRequest) => {
    return await fetchApi('/public/promotions/apply', {
      method: 'POST',
      body: JSON.stringify(promotionRequest),
    });
  },

  getAllPromotionsAdmin: async () => {
    return await fetchApi('/admin/promotions', {
      method: 'GET',
    });
  },

  createPromotion: async (promotionData) => {
    return await fetchApi('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    });
  },

  updatePromotion: async (id, promotionData) => {
    return await fetchApi(`/admin/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    });
  },

  deletePromotion: async (id) => {
    return await fetchApi(`/admin/promotions/${id}`, {
      method: 'DELETE',
    });
  },
};
