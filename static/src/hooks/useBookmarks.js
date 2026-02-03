import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/xano';

export function useBookmarks() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = api.getToken();
  const hasToken = Boolean(token);

  const fetchBookmarks = useCallback(async () => {
    if (!hasToken) {
      setLoading(false);
      setError('Access denied. Token required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getBookmarks();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hasToken]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const addBookmark = async (bookmarkData) => {
    const newBookmark = await api.createBookmark(bookmarkData);
    await fetchBookmarks();
    return newBookmark;
  };

  const editBookmark = async (id, bookmarkData) => {
    const updated = await api.updateBookmark(id, bookmarkData);
    await fetchBookmarks();
    return updated;
  };

  const removeBookmark = async (id) => {
    await api.deleteBookmark(id);
    await fetchBookmarks();
  };

  const addCategory = async (categoryData) => {
    const newCategory = await api.createCategory(categoryData);
    await fetchBookmarks();
    return newCategory;
  };

  const editCategory = async (id, categoryData) => {
    const updated = await api.updateCategory(id, categoryData);
    await fetchBookmarks();
    return updated;
  };

  const removeCategory = async (id) => {
    await api.deleteCategory(id);
    await fetchBookmarks();
  };

  return {
    categories,
    loading,
    error,
    hasToken,
    refresh: fetchBookmarks,
    addBookmark,
    editBookmark,
    removeBookmark,
    addCategory,
    editCategory,
    removeCategory,
  };
}
