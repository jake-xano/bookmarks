import { useState, useEffect } from 'react';

const ICON_TYPES = [
  { value: 'favicon', label: 'Favicon (auto)' },
  { value: 'custom', label: 'Custom Image URL' },
  { value: 'symbol', label: 'Icon Symbol' },
  { value: 'generated', label: 'Generated Letter' },
];

const SYMBOL_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'star', label: 'Star' },
  { value: 'bookmark', label: 'Bookmark' },
  { value: 'folder', label: 'Folder' },
  { value: 'link', label: 'Link' },
  { value: 'code', label: 'Code' },
  { value: 'document', label: 'Document' },
  { value: 'chat', label: 'Chat' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'cog', label: 'Settings' },
  { value: 'globe', label: 'Globe' },
];

export function BookmarkForm({ bookmark, categoryId, categories, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState('favicon');
  const [iconUrl, setIconUrl] = useState('');
  const [symbolName, setSymbolName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(bookmark);

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title || '');
      setUrl(bookmark.url || '');
      setIconType(bookmark.icon_type || 'favicon');
      setIconUrl(bookmark.icon_url || '');
      setSymbolName(bookmark.symbol_name || '');
      setSelectedCategoryId(bookmark.category_id || '');
      setSortOrder(bookmark.sort_order || 0);
    } else if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
  }, [bookmark, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        title,
        url,
        icon_type: iconType,
        icon_url: iconType === 'custom' ? iconUrl : null,
        symbol_name: iconType === 'symbol' ? symbolName : null,
        category_id: parseInt(selectedCategoryId, 10),
        sort_order: parseInt(sortOrder, 10),
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="My Bookmark"
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="iconType">Icon Type</label>
        <select
          id="iconType"
          value={iconType}
          onChange={(e) => setIconType(e.target.value)}
        >
          {ICON_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {iconType === 'custom' && (
        <div className="form-group">
          <label htmlFor="iconUrl">Custom Icon URL</label>
          <input
            id="iconUrl"
            type="url"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.png"
          />
        </div>
      )}

      {iconType === 'symbol' && (
        <div className="form-group">
          <label htmlFor="symbolName">Icon Symbol</label>
          <select
            id="symbolName"
            value={symbolName}
            onChange={(e) => setSymbolName(e.target.value)}
          >
            <option value="">Select icon</option>
            {SYMBOL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="sortOrder">Sort Order</label>
        <input
          id="sortOrder"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          min="0"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
