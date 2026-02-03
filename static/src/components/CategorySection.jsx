import { useState } from 'react';
import { BookmarkCard } from './BookmarkCard';

export function CategorySection({
  category,
  onEditBookmark,
  onDeleteBookmark,
  onEditCategory,
  onDeleteCategory,
  onAddBookmark,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="category">
      <div className="category-header" onMouseLeave={() => setShowMenu(false)}>
        <h2>{category.name}</h2>
        <button
          className="category-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Category options"
        >
          ⋮
        </button>
        {showMenu && (
          <div className="category-menu">
            <button onClick={() => { onAddBookmark(category); setShowMenu(false); }}>
              Add Bookmark
            </button>
            <button onClick={() => { onEditCategory(category); setShowMenu(false); }}>
              Edit Category
            </button>
            <button onClick={() => { onDeleteCategory(category); setShowMenu(false); }}>
              Delete Category
            </button>
          </div>
        )}
      </div>
      <div className="grid">
        {category.bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEditBookmark}
            onDelete={onDeleteBookmark}
          />
        ))}
      </div>
    </div>
  );
}
