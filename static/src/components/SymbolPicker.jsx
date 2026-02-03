import * as OutlineIcons from '@heroicons/react/24/outline';

// List of commonly used icons for the visual picker
// Using kebab-case names that match heroicons naming
export const SYMBOL_OPTIONS = [
  { value: '', label: 'None' },
  // General
  { value: 'home', label: 'Home' },
  { value: 'star', label: 'Star' },
  { value: 'bookmark', label: 'Bookmark' },
  { value: 'folder', label: 'Folder' },
  { value: 'link', label: 'Link' },
  { value: 'document', label: 'Document' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'globe-alt', label: 'Globe' },
  { value: 'heart', label: 'Heart' },
  { value: 'users', label: 'Users' },
  { value: 'share', label: 'Share' },
  // AI & Bots
  { value: 'sparkles', label: 'AI/Sparkles' },
  { value: 'cpu-chip', label: 'AI Chip' },
  { value: 'chat-bubble-left-right', label: 'Chatbot' },
  { value: 'light-bulb', label: 'Lightbulb' },
  { value: 'eye', label: 'Vision' },
  { value: 'microphone', label: 'Voice' },
  { value: 'language', label: 'Language' },
  { value: 'academic-cap', label: 'Learning' },
  // Dev & Tools
  { value: 'code-bracket', label: 'Code' },
  { value: 'command-line', label: 'Terminal' },
  { value: 'wrench-screwdriver', label: 'Tools' },
  { value: 'cog-6-tooth', label: 'Settings' },
  { value: 'adjustments-horizontal', label: 'Config' },
  { value: 'beaker', label: 'Lab' },
  { value: 'puzzle-piece', label: 'Plugins' },
  // Infrastructure
  { value: 'server-stack', label: 'Server' },
  { value: 'circle-stack', label: 'Database' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'signal', label: 'API' },
  { value: 'bolt', label: 'Bolt' },
  // Media & Analytics
  { value: 'photo', label: 'Image' },
  { value: 'film', label: 'Film' },
  { value: 'play', label: 'Video' },
  { value: 'musical-note', label: 'Music' },
  { value: 'chat-bubble-oval-left', label: 'Chat' },
  { value: 'chart-bar', label: 'Analytics' },
  // Communication
  { value: 'envelope', label: 'Mail' },
  { value: 'phone', label: 'Phone' },
  { value: 'bell', label: 'Bell' },
  // Commerce
  { value: 'shopping-cart', label: 'Cart' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'credit-card', label: 'Payment' },
  { value: 'gift', label: 'Gift' },
  // Security
  { value: 'shield-check', label: 'Security' },
  { value: 'lock-closed', label: 'Lock' },
  { value: 'key', label: 'Key' },
  // Misc
  { value: 'rocket-launch', label: 'Rocket' },
  { value: 'fire', label: 'Fire' },
  { value: 'cube', label: 'Cube' },
  { value: 'map', label: 'Map' },
  { value: 'tag', label: 'Tag' },
  { value: 'hashtag', label: 'Hashtag' },
];

// Convert kebab-case to PascalCase + "Icon" suffix
function getIconComponent(name) {
  if (!name) return null;
  const pascalCase = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
  const iconName = `${pascalCase}Icon`;
  return OutlineIcons[iconName] || null;
}

export function SymbolPicker({ value, onChange, accentColor = '#8b5cf6' }) {
  return (
    <div className="symbol-picker">
      <div className="symbol-grid">
        {SYMBOL_OPTIONS.map((option) => {
          const IconComponent = getIconComponent(option.value);
          return (
            <button
              key={option.value || 'none'}
              type="button"
              className={`symbol-option ${value === option.value ? 'active' : ''}`}
              onClick={() => onChange(option.value)}
              title={option.label}
              style={{ '--accent': accentColor }}
            >
              {IconComponent ? (
                <span className="symbol-icon"><IconComponent /></span>
              ) : (
                <span className="symbol-none">—</span>
              )}
            </button>
          );
        })}
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
