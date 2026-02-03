import { useState, useEffect } from 'react';
import { SymbolPicker, SYMBOL_OPTIONS } from './SymbolPicker';

// Get list of predefined symbol values for checking
const PREDEFINED_SYMBOLS = SYMBOL_OPTIONS.map(opt => opt.value).filter(Boolean);

const ICON_TYPES = [
  { value: 'symbol', label: 'Icon Symbol' },
  { value: 'customSymbol', label: 'Custom Symbol Name' },
  { value: 'custom', label: 'Custom Image URL' },
  { value: 'generated', label: 'Generated Letter' },
];

const PRESET_COLORS = [
  '', // Use category color
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
];

export function BookmarkForm({ bookmark, categoryId, categories, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState('symbol');
  const [iconUrl, setIconUrl] = useState('');
  const [symbolName, setSymbolName] = useState('');
  const [hexColor, setHexColor] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(bookmark?.id);
  const selectedCategory = categories.find(c => c.id === parseInt(selectedCategoryId));
  const effectiveColor = hexColor || selectedCategory?.hex_color || '#8b5cf6';

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title || '');
      setUrl(bookmark.url || '');
      setIconUrl(bookmark.icon_url || '');
      setSymbolName(bookmark.symbol_name || '');
      setHexColor(bookmark.hex_color || '');
      setSelectedCategoryId(bookmark.category_id || '');

      // Determine icon type - check if symbol is predefined or custom
      let detectedIconType = bookmark.icon_type || 'symbol';
      if (detectedIconType === 'favicon') {
        detectedIconType = 'symbol';
      } else if (detectedIconType === 'symbol' && bookmark.symbol_name) {
        // Check if it's a custom symbol (not in predefined list)
        if (!PREDEFINED_SYMBOLS.includes(bookmark.symbol_name)) {
          detectedIconType = 'customSymbol';
        }
      }
      setIconType(detectedIconType);
    } else if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
  }, [bookmark, categoryId]);

  // Calculate sort order: keep existing for edits, or place at end for new
  const getSortOrder = () => {
    if (isEditing) return bookmark.sort_order || 0;
    const category = categories.find(c => c.id === parseInt(selectedCategoryId));
    const existingBookmarks = category?.bookmarks || [];
    return existingBookmarks.length > 0
      ? Math.max(...existingBookmarks.map(b => b.sort_order || 0)) + 1
      : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isSymbolType = iconType === 'symbol' || iconType === 'customSymbol';
      await onSubmit({
        title,
        url,
        icon_type: isSymbolType ? 'symbol' : iconType,
        icon_url: iconType === 'custom' ? iconUrl : null,
        symbol_name: isSymbolType ? symbolName : null,
        hex_color: hexColor || null,
        category_id: parseInt(selectedCategoryId, 10),
        sort_order: getSortOrder(),
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
        <label>Color Override</label>
        <div className="color-presets">
          {PRESET_COLORS.map((color, index) => (
            <button
              key={color || 'default'}
              type="button"
              className={`color-preset ${hexColor === color ? 'active' : ''}`}
              style={{
                '--preset-color': color || selectedCategory?.hex_color || '#8b5cf6',
                opacity: color ? 1 : 0.5
              }}
              onClick={() => setHexColor(color)}
              title={color ? color : 'Use category color'}
            >
              {!color && <span style={{ fontSize: '10px', color: 'white' }}>Auto</span>}
            </button>
          ))}
        </div>
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
          <label htmlFor="iconUrl">
            Custom Icon URL{' '}
            {title && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(title + ' logo icon transparent')}&tbm=isch`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-default)', opacity: 0.8 }}
              >
                (search for "{title}" icon →)
              </a>
            )}
          </label>
          <input
            id="iconUrl"
            type="url"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.png"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Tip: Right-click an image and copy the image URL
          </small>
        </div>
      )}

      {iconType === 'symbol' && (
        <div className="form-group">
          <label>Icon Symbol</label>
          <SymbolPicker
            value={symbolName}
            onChange={setSymbolName}
            accentColor={effectiveColor}
          />
        </div>
      )}

      {iconType === 'customSymbol' && (
        <div className="form-group">
          <label htmlFor="customSymbolName">
            Symbol Name{' '}
            <a
              href="https://heroicons.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--accent-default)', opacity: 0.8 }}
            >
              (browse heroicons →)
            </a>
          </label>
          <input
            id="customSymbolName"
            type="text"
            value={symbolName}
            onChange={(e) => setSymbolName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="e.g. arrow-right, bell, fire"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Use the icon name from Heroicons (outline style, kebab-case)
          </small>
        </div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>

      <style>{`
        .color-presets {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .color-preset {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid transparent;
          background: var(--preset-color);
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .color-preset:hover {
          transform: scale(1.1);
        }
        .color-preset.active {
          border-color: var(--text-primary);
          box-shadow: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--preset-color);
        }
      `}</style>
    </form>
  );
}
