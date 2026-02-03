import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBookmarkCard } from './BookmarkCard';

export function CategorySection({
  category,
  categoryIndex = 0,
  onEditBookmark,
  onDuplicateBookmark,
  onDeleteBookmark,
  onEditCategory,
  onDeleteCategory,
  onAddBookmark,
  onReorderBookmarks,
}) {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [hasReordered, setHasReordered] = useState(false);

  const categoryColor = category.hex_color || '#8b5cf6';
  const bookmarks = category.bookmarks || [];

  const baseAnimationIndex = categoryIndex * 10;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (over && active.id !== over.id) {
      const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
      const newIndex = bookmarks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(bookmarks, oldIndex, newIndex);
        setHasReordered(true);
        onReorderBookmarks(category.id, reordered);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  // Determine drop position relative to the hovered item
  const getDropPosition = (bookmarkId) => {
    if (!activeId || !overId || activeId === bookmarkId) return null;
    if (overId !== bookmarkId) return null;

    const activeIndex = bookmarks.findIndex((b) => b.id === activeId);
    const overIndex = bookmarks.findIndex((b) => b.id === overId);

    return activeIndex < overIndex ? 'after' : 'before';
  };

  return (
    <div
      className="category"
      style={{
        '--category-color': categoryColor,
        animationDelay: `${categoryIndex * 100}ms`,
      }}
    >
      <div className="category-header">
        <h2>{category.name}</h2>
        <div className="category-actions">
          <button
            className="category-action-btn"
            onClick={() => onEditCategory(category)}
            aria-label="Edit category"
            title="Edit category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
          <button
            className="category-action-btn delete"
            onClick={() => onDeleteCategory(category)}
            aria-label="Delete category"
            title="Delete category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={bookmarks.map((b) => b.id)} strategy={rectSortingStrategy}>
          <div className="grid">
            {bookmarks.map((bookmark, index) => (
              <SortableBookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                categoryColor={bookmark.hex_color || categoryColor}
                categoryDefaultSymbol={category.default_symbol}
                animationIndex={baseAnimationIndex + index}
                onEdit={onEditBookmark}
                onDuplicate={onDuplicateBookmark}
                onDelete={onDeleteBookmark}
                dropPosition={getDropPosition(bookmark.id)}
                disableAnimation={hasReordered}
              />
            ))}
            <button
              className="new-bookmark-card"
              onClick={() => onAddBookmark(category)}
              style={{ '--category-color': categoryColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>New Bookmark</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
