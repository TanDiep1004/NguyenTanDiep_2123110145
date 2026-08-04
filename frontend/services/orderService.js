import { fetchApi } from '@/lib/api';

export const orderService = {
  checkout: async (orderData) => {
    return await fetchApi('/user/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return await fetchApi('/user/orders', {
      method: 'GET',
    });
  },

  getAllOrdersAdmin: async () => {
    return await fetchApi('/admin/orders', {
      method: 'GET',
    });
  },

  updateOrderStatus: async (id, status) => {
    return await fetchApi(`/admin/orders/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
  },
};
