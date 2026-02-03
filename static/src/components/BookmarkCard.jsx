import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookmarkIcon } from './BookmarkIcon';

// The actual bookmark card content
const BookmarkCardContent = forwardRef(function BookmarkCardContent(
  { bookmark, categoryColor, categoryDefaultSymbol, onEdit, onDuplicate, onDelete, isDragging, dropPosition, style, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`bookmark ${className} ${isDragging ? 'dragging' : ''} ${dropPosition ? `drop-${dropPosition}` : ''}`}
      style={{
        '--category-color': categoryColor,
        ...style,
      }}
      {...props}
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-link"
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <BookmarkIcon bookmark={bookmark} categoryColor={categoryColor} categoryDefaultSymbol={categoryDefaultSymbol} />
        <span className="bookmark-title">{bookmark.title}</span>
      </a>
      {onEdit && onDelete && (
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
          {onDuplicate && (
            <button
              className="bookmark-action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDuplicate(bookmark);
              }}
              aria-label="Duplicate bookmark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          )}
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
      )}
    </div>
  );
});

// Sortable wrapper for grid items
export function SortableBookmarkCard({ bookmark, categoryColor, categoryDefaultSymbol, animationIndex, onEdit, onDuplicate, onDelete, dropPosition, disableAnimation: disableAnimationProp }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: bookmark.id });

  // Disable entrance animation during/after sorting to prevent flash
  const disableAnimation = disableAnimationProp || isSorting || transform;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: disableAnimation ? undefined : `${animationIndex * 50}ms`,
    animation: disableAnimation ? 'none' : undefined,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <BookmarkCardContent
      ref={setNodeRef}
      style={style}
      bookmark={bookmark}
      categoryColor={categoryColor}
      categoryDefaultSymbol={categoryDefaultSymbol}
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      isDragging={isDragging}
      dropPosition={dropPosition}
      {...attributes}
      {...listeners}
    />
  );
}

// Keep the original export for backwards compatibility
export const BookmarkCard = BookmarkCardContent;
