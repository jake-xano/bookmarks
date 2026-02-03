import { HERO_ICONS } from './BookmarkIcon';

const SYMBOL_OPTIONS = [
  { value: '', label: 'None' },
  // General
  { value: 'home', label: 'Home' },
  { value: 'star', label: 'Star' },
  { value: 'bookmark', label: 'Bookmark' },
  { value: 'folder', label: 'Folder' },
  { value: 'link', label: 'Link' },
  { value: 'document', label: 'Document' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'globe', label: 'Globe' },
  { value: 'heart', label: 'Heart' },
  { value: 'users', label: 'Users' },
  { value: 'share', label: 'Share' },
  // AI & Bots
  { value: 'sparkles', label: 'AI/Sparkles' },
  { value: 'robot', label: 'Robot' },
  { value: 'chatbot', label: 'Chatbot' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'eye', label: 'Vision' },
  { value: 'microphone', label: 'Voice' },
  { value: 'language', label: 'Language' },
  { value: 'academicCap', label: 'Learning' },
  // Dev & Tools
  { value: 'code', label: 'Code' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'wrench', label: 'Tools' },
  { value: 'cog', label: 'Settings' },
  { value: 'adjustments', label: 'Config' },
  { value: 'beaker', label: 'Lab' },
  { value: 'puzzle', label: 'Plugins' },
  // Infrastructure
  { value: 'server', label: 'Server' },
  { value: 'database', label: 'Database' },
  { value: 'circleStack', label: 'Stack' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'cpu', label: 'CPU' },
  { value: 'signal', label: 'API' },
  // Media & Analytics
  { value: 'photo', label: 'Image' },
  { value: 'play', label: 'Video' },
  { value: 'chat', label: 'Chat' },
  { value: 'chart', label: 'Analytics' },
  // Misc
  { value: 'rocket', label: 'Rocket' },
  { value: 'bolt', label: 'Bolt' },
  { value: 'cube', label: 'Cube' },
  { value: 'shield', label: 'Security' },
];

export function SymbolPicker({ value, onChange, accentColor = '#8b5cf6' }) {
  return (
    <div className="symbol-picker">
      <div className="symbol-grid">
        {SYMBOL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`symbol-option ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            title={option.label}
            style={{ '--accent': accentColor }}
          >
            {option.value ? (
              <span className="symbol-icon">{HERO_ICONS[option.value]}</span>
            ) : (
              <span className="symbol-none">—</span>
            )}
          </button>
        ))}
      </div>

      <style>{`
        .symbol-picker {
          width: 100%;
        }
        .symbol-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 0.35rem;
        }
        .symbol-option {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1.5px solid var(--border-subtle);
          background: var(--bg-surface);
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0.25rem;
        }
        .symbol-option:hover {
          border-color: var(--border-accent);
          background: var(--bg-elevated);
          transform: scale(1.08);
        }
        .symbol-option.active {
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          box-shadow: 0 0 0 1px var(--bg-base), 0 0 0 2px var(--accent);
        }
        .symbol-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: var(--text-secondary);
        }
        .symbol-option:hover .symbol-icon,
        .symbol-option.active .symbol-icon {
          color: var(--accent);
        }
        .symbol-icon svg {
          width: 100%;
          height: 100%;
        }
        .symbol-none {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
