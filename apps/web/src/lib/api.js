const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function fetchApi(path, options = {}) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

export function formatDate(value) {
  if (!value) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
}