export const getPrefix = () => {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.startsWith('/admin') ? 'admin_' : '';
};

export const getTokenKey = () => `${getPrefix()}auth_token`;
export const getUserKey = () => `${getPrefix()}auth_user`;

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(getTokenKey());
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  const key = getTokenKey();
  localStorage.setItem(key, token);
  document.cookie = `${key}=${token}; path=/; max-age=86400; SameSite=Lax`;
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  const tKey = getTokenKey();
  const uKey = getUserKey();
  localStorage.removeItem(tKey);
  localStorage.removeItem(uKey);
  document.cookie = `${tKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(getUserKey());
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getUserKey(), JSON.stringify(user));
};

export const isAdmin = () => {
  const user = getUser();
  if (!user) return false;
  const role = user.role?.toLowerCase();
  return role === 'admin' || role === 'staff';
};

export const logout = () => {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = isAdminRoute ? '/admin/login' : '/login';
  }
};
