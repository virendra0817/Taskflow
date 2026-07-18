const API_BASE = '/api';

export const TokenStore = {
  get() { return localStorage.getItem('taskflow_token'); },
  set(token) { localStorage.setItem('taskflow_token', token); },
  clear() { localStorage.removeItem('taskflow_token'); },
};

async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = TokenStore.get();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try { data = await res.json(); } catch (_) { /* empty body */ }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const Api = {
  register: (name, email, password) =>
    apiRequest('/auth/register', { method: 'POST', body: { name, email, password }, auth: false }),
  login: (email, password) =>
    apiRequest('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => apiRequest('/auth/me'),

  listTasks: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    const suffix = qs.toString() ? `?${qs}` : '';
    return apiRequest(`/tasks${suffix}`);
  },
  stats: () => apiRequest('/tasks/stats/summary'),
  createTask: (payload) => apiRequest('/tasks', { method: 'POST', body: payload }),
  updateTask: (id, payload) => apiRequest(`/tasks/${id}`, { method: 'PUT', body: payload }),
  deleteTask: (id) => apiRequest(`/tasks/${id}`, { method: 'DELETE' }),
};
