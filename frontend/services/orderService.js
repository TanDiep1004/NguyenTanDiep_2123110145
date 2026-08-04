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

  getOrderById: async (id) => {
    return await fetchApi(`/user/orders/${id}`, {
      method: 'GET',
    });
  },

  cancelOrder: async (id) => {
    return await fetchApi(`/user/orders/${id}/cancel`, {
      method: 'PUT',
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
