import { useState } from 'react';
import { BookmarkIcon } from './BookmarkIcon';

export function BookmarkCard({ bookmark, categoryColor, animationIndex = 0, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const animationDelay = `${animationIndex * 50}ms`;

  return (
    <div
      className="bookmark"
      style={{
        '--category-color': categoryColor,
        animationDelay,
      }}
      onMouseLeave={() => setShowMenu(false)}
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-link"
      >
        <BookmarkIcon bookmark={bookmark} categoryColor={categoryColor} />
        <span className="bookmark-title">{bookmark.title}</span>
      </a>
      <button
        className="bookmark-menu-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        aria-label="Bookmark options"
      >
        ⋮
      </button>
      {showMenu && (
        <div className="bookmark-menu">
          <button onClick={() => { onEdit(bookmark); setShowMenu(false); }}>
            Edit
          </button>
          <button onClick={() => { onDelete(bookmark); setShowMenu(false); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
