import { useState } from 'react';

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

export function BookmarkCard({ bookmark, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const iconUrl = bookmark.icon_url || getFaviconUrl(bookmark.url);

  return (
    <div className="bookmark" onMouseLeave={() => setShowMenu(false)}>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-link"
      >
        {!imgError && iconUrl && (
          <img
            src={iconUrl}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <span>{bookmark.title}</span>
      </a>
      <button
        className="bookmark-menu-btn"
        onClick={(e) => {
          e.preventDefault();
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
