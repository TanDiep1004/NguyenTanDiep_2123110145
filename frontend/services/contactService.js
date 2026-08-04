import { fetchApi } from '@/lib/api';

export const contactService = {
  getAllContactsAdmin: async () => {
    return await fetchApi('/admin/contacts', {
      method: 'GET',
    });
  },

  updateStatus: async (id, status) => {
    return await fetchApi(`/admin/contacts/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
  },

  deleteContact: async (id) => {
    return await fetchApi(`/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};
