// Xano API client for bookmarks

const API_BASE_URL = import.meta.env.VITE_XANO_API_URL || 'https://your-xano-instance.xano.io/api:bookmarks';

// Get token from URL query params
export function getToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (token) {
    url.searchParams.set('token', token);
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Get all categories with bookmarks
export async function getBookmarks() {
  return apiRequest('/bookmarks');
}

// Create a new bookmark
export async function createBookmark(data) {
  return apiRequest('/bookmarks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update a bookmark
export async function updateBookmark(id, data) {
  return apiRequest(`/bookmarks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete a bookmark
export async function deleteBookmark(id) {
  return apiRequest(`/bookmarks/${id}`, {
    method: 'DELETE',
  });
}

// Create a new category
export async function createCategory(data) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update a category
export async function updateCategory(id, data) {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete a category
export async function deleteCategory(id) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}
