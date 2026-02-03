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
  } = useBookmarks();

  // Modal states
  const [bookmarkModal, setBookmarkModal] = useState({ isOpen: false, bookmark: null, categoryId: null });
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, category: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, item: null });

  // Bookmark handlers
  const handleEditBookmark = (bookmark) => {
    setBookmarkModal({ isOpen: true, bookmark, categoryId: null });
  };

  const handleAddBookmark = (category) => {
    setBookmarkModal({ isOpen: true, bookmark: null, categoryId: category.id });
  };

  const handleBookmarkSubmit = async (data) => {
    if (bookmarkModal.bookmark) {
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

  // Render access denied
  if (!hasToken) {
    return (
      <div className="container">
        <h1><span className="accent">/</span> Bookmarks</h1>
        <p className="error-message">Access denied. Please provide a valid token.</p>
      </div>
    );
  }

  // Render loading
  if (loading) {
    return (
      <div className="container">
        <h1><span className="accent">/</span> Bookmarks</h1>
        <p className="loading">Loading bookmarks...</p>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div className="container">
        <h1><span className="accent">/</span> Bookmarks</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1><span className="accent">/</span> Bookmarks</h1>
        <button className="add-category-btn" onClick={handleAddCategory}>
          + Category
        </button>
      </header>

      <main>
        {categories.length === 0 ? (
          <p className="empty-message">No bookmarks yet. Add a category to get started.</p>
        ) : (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onEditBookmark={handleEditBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddBookmark={handleAddBookmark}
            />
          ))
        )}
      </main>

      {/* Bookmark Modal */}
      <Modal
        isOpen={bookmarkModal.isOpen}
        onClose={() => setBookmarkModal({ isOpen: false, bookmark: null, categoryId: null })}
        title={bookmarkModal.bookmark ? 'Edit Bookmark' : 'Add Bookmark'}
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
