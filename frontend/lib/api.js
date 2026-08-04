import { getToken, logout } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api';

/**
 * Universal fetch wrapper for calling Spring Boot Backend APIs
 * - Automatically attaches Authorization Bearer token
 * - Disables stale caching with cache: 'no-store'
 * - Handles 401 Unauthorized redirect
 */
export async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions = {
    cache: 'no-store',
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);

    if (response.status === 401) {
      logout();
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || 'Đã có lỗi xảy ra từ máy chủ!');
    }

    return json;
  } catch (error) {
    console.warn(`[API Warning] ${endpoint}:`, error.message);
    throw error;
  }
}
