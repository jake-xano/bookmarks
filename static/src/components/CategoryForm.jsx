import { useState, useEffect } from 'react';
import { SymbolPicker } from './SymbolPicker';

// Preset colors for quick selection
const PRESET_COLORS = [
  '#8b5cf6', // Violet (primary)
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
];

export function CategoryForm({ category, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [hexColor, setHexColor] = useState('#8b5cf6');
  const [defaultSymbol, setDefaultSymbol] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(category);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setHexColor(category.hex_color || '#8b5cf6');
      setDefaultSymbol(category.default_symbol || '');
      setSortOrder(category.sort_order || 0);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        name,
        hex_color: hexColor,
        default_symbol: defaultSymbol || null,
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
        <label htmlFor="name">Category Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="My Category"
        />
      </div>

      <div className="form-group">
        <label>Accent Color</label>
        <div className="color-presets">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-preset ${hexColor === color ? 'active' : ''}`}
              style={{ '--preset-color': color }}
              onClick={() => setHexColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <div className="color-input-wrapper">
          <input
            type="color"
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
          />
          <input
            type="text"
            value={hexColor}
            onChange={(e) => setHexColor(e.target.value)}
            placeholder="#8b5cf6"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Default Icon for Bookmarks</label>
        <SymbolPicker
          value={defaultSymbol}
          onChange={setDefaultSymbol}
          accentColor={hexColor}
        />
      </div>

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

      <style>{`
        .color-presets {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .color-preset {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid transparent;
          background: var(--preset-color);
          cursor: pointer;
          transition: all 0.15s ease;
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
