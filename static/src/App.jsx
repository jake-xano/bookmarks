import { useState } from 'react';
import { useBookmarks } from './hooks/useBookmarks';
import { CategorySection } from './components/CategorySection';
import { Modal } from './components/Modal';
import { BookmarkForm } from './components/BookmarkForm';
import { CategoryForm } from './components/CategoryForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import './App.css';

function App() {
  const {
    categories,
    loading,
    error,
    hasToken,
    addBookmark,
    editBookmark,
    removeBookmark,
    addCategory,
    editCategory,
    removeCategory,
    reorderBookmarks,
  } = useBookmarks();

  // Modal states
  const [bookmarkModal, setBookmarkModal] = useState({ isOpen: false, bookmark: null, categoryId: null });
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, category: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, item: null });

  // Bookmark handlers
  const handleEditBookmark = (bookmark) => {
    setBookmarkModal({ isOpen: true, bookmark, categoryId: null });
  };

  const handleDuplicateBookmark = (bookmark) => {
    // Create a copy without the id so it's treated as a new bookmark
    const duplicatedBookmark = {
      ...bookmark,
      id: null,
      title: `${bookmark.title} (copy)`,
    };
    setBookmarkModal({ isOpen: true, bookmark: duplicatedBookmark, categoryId: bookmark.category_id });
  };

  const handleAddBookmark = (category) => {
    setBookmarkModal({ isOpen: true, bookmark: null, categoryId: category.id });
  };

  const handleBookmarkSubmit = async (data) => {
    if (bookmarkModal.bookmark?.id) {
      await editBookmark(bookmarkModal.bookmark.id, data);
    } else {
      await addBookmark(data);
    }
    setBookmarkModal({ isOpen: false, bookmark: null, categoryId: null });
  };

  const handleDeleteBookmark = (bookmark) => {
    setDeleteConfirm({ isOpen: true, type: 'bookmark', item: bookmark });
  };

  const confirmDeleteBookmark = async () => {
    await removeBookmark(deleteConfirm.item.id);
    setDeleteConfirm({ isOpen: false, type: null, item: null });
  };

  // Category handlers
  const handleEditCategory = (category) => {
    setCategoryModal({ isOpen: true, category });
  };

  const handleAddCategory = () => {
    setCategoryModal({ isOpen: true, category: null });
  };

  const handleCategorySubmit = async (data) => {
    if (categoryModal.category) {
      await editCategory(categoryModal.category.id, data);
    } else {
      await addCategory(data);
    }
    setCategoryModal({ isOpen: false, category: null });
  };

  const handleDeleteCategory = (category) => {
    setDeleteConfirm({ isOpen: true, type: 'category', item: category });
  };

  const confirmDeleteCategory = async () => {
    await removeCategory(deleteConfirm.item.id);
    setDeleteConfirm({ isOpen: false, type: null, item: null });
  };

  const logoIcon = (
    <span className="logo-icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    </span>
  );

  // Render access denied
  if (!hasToken) {
    const handleTokenSubmit = (e) => {
      e.preventDefault();
      const token = e.target.token.value.trim();
      if (token) {
        window.location.href = `${window.location.pathname}?token=${encodeURIComponent(token)}`;
      }
    };

    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1>Bookmark Launcher</h1>
          <p>Access your personalized bookmarks by entering your access token below.</p>
          <form className="auth-form" onSubmit={handleTokenSubmit}>
            <input
              type="text"
              name="token"
              placeholder="Paste your token here"
              autoFocus
              autoComplete="off"
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render loading
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div className="container">
        <h1>{logoIcon}Bookmarks</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>{logoIcon}Bookmarks</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleAddCategory}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Category
          </button>
          <button className="btn btn-primary" onClick={() => setBookmarkModal({ isOpen: true, bookmark: null, categoryId: categories[0]?.id || null })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Bookmark
          </button>
        </div>
      </header>

      <main>
        {categories.length === 0 ? (
          <p className="empty-message">No bookmarks yet. Add a category to get started.</p>
        ) : (
          categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              categoryIndex={index}
              onEditBookmark={handleEditBookmark}
              onDuplicateBookmark={handleDuplicateBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddBookmark={handleAddBookmark}
              onReorderBookmarks={reorderBookmarks}
            />
          ))
        )}
      </main>

      {/* Bookmark Modal */}
      <Modal
        isOpen={bookmarkModal.isOpen}
        onClose={() => setBookmarkModal({ isOpen: false, bookmark: null, categoryId: null })}
        title={bookmarkModal.bookmark?.id ? 'Edit Bookmark' : bookmarkModal.bookmark ? 'Duplicate Bookmark' : 'Add Bookmark'}
      >
        <BookmarkForm
          bookmark={bookmarkModal.bookmark}
          categoryId={bookmarkModal.categoryId}
          categories={categories}
          onSubmit={handleBookmarkSubmit}
          onCancel={() => setBookmarkModal({ isOpen: false, bookmark: null, categoryId: null })}
        />
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, category: null })}
        title={categoryModal.category ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          category={categoryModal.category}
          onSubmit={handleCategorySubmit}
          onCancel={() => setCategoryModal({ isOpen: false, category: null })}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Delete ${deleteConfirm.type === 'category' ? 'Category' : 'Bookmark'}`}
        message={
          deleteConfirm.type === 'category'
            ? `Are you sure you want to delete "${deleteConfirm.item?.name}"? This will also delete all bookmarks in this category.`
            : `Are you sure you want to delete "${deleteConfirm.item?.title}"?`
        }
        onConfirm={deleteConfirm.type === 'category' ? confirmDeleteCategory : confirmDeleteBookmark}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: null, item: null })}
      />
    </div>
  );
}

export default App;
