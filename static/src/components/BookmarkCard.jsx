import { BookmarkIcon } from './BookmarkIcon';

export function BookmarkCard({ bookmark, categoryColor, animationIndex = 0, onEdit, onDelete }) {
  const animationDelay = `${animationIndex * 50}ms`;

  return (
    <div
      className="bookmark"
      style={{
        '--category-color': categoryColor,
        animationDelay,
      }}
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
      <div className="bookmark-actions">
        <button
          className="bookmark-action-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(bookmark);
          }}
          aria-label="Edit bookmark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
        <button
          className="bookmark-action-btn delete"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark);
          }}
          aria-label="Delete bookmark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
