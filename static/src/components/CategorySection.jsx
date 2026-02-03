import { useState, useEffect, useRef } from 'react';
import { BookmarkCard } from './BookmarkCard';

export function CategorySection({
  category,
  categoryIndex = 0,
  onEditBookmark,
  onDeleteBookmark,
  onEditCategory,
  onDeleteCategory,
  onAddBookmark,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const categoryColor = category.hex_color || '#8b5cf6';
  const bookmarks = category.bookmarks || [];

  // Calculate base animation index for staggering across all categories
  const baseAnimationIndex = categoryIndex * 10;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <div
      className="category"
      style={{
        '--category-color': categoryColor,
        animationDelay: `${categoryIndex * 100}ms`,
      }}
    >
      <div className="category-header" ref={menuRef}>
        <h2>{category.name}</h2>
        <div className="category-actions">
          <button
            className="category-add-btn"
            onClick={() => onAddBookmark(category)}
            aria-label="Add bookmark"
            title="Add bookmark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button
            className="category-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Category options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
        {showMenu && (
          <div className="category-menu">
            <button onClick={() => { onEditCategory(category); setShowMenu(false); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Edit Category
            </button>
            <button
              className="danger"
              onClick={() => { onDeleteCategory(category); setShowMenu(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Delete Category
            </button>
          </div>
        )}
      </div>
      <div className="grid">
        {bookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            categoryColor={categoryColor}
            animationIndex={baseAnimationIndex + index}
            onEdit={onEditBookmark}
            onDelete={onDeleteBookmark}
          />
        ))}
      </div>
    </div>
  );
}
