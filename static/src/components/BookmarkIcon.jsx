import * as OutlineIcons from '@heroicons/react/24/outline';

// Common aliases for heroicons names
const ICON_ALIASES = {
  'database': 'circle-stack',
  'db': 'circle-stack',
  'settings': 'cog-6-tooth',
  'gear': 'cog-6-tooth',
  'cog': 'cog-6-tooth',
  'config': 'adjustments-horizontal',
  'terminal': 'command-line',
  'cli': 'command-line',
  'console': 'command-line',
  'code': 'code-bracket',
  'mail': 'envelope',
  'email': 'envelope',
  'cart': 'shopping-cart',
  'server': 'server-stack',
  'chat': 'chat-bubble-oval-left',
  'message': 'chat-bubble-oval-left',
  'chatbot': 'chat-bubble-left-right',
  'globe': 'globe-alt',
  'world': 'globe-alt',
  'lightbulb': 'light-bulb',
  'bulb': 'light-bulb',
  'music': 'musical-note',
  'audio': 'musical-note',
  'security': 'shield-check',
  'shield': 'shield-check',
  'lock': 'lock-closed',
  'rocket': 'rocket-launch',
  'launch': 'rocket-launch',
  'tools': 'wrench-screwdriver',
  'wrench': 'wrench-screwdriver',
  'chart': 'chart-bar',
  'analytics': 'chart-bar',
  'graph': 'chart-bar',
  'stats': 'chart-bar',
  'puzzle': 'puzzle-piece',
  'plugin': 'puzzle-piece',
  'cpu': 'cpu-chip',
  'chip': 'cpu-chip',
  'ai': 'sparkles',
  'magic': 'sparkles',
  'payment': 'credit-card',
  'card': 'credit-card',
  'video': 'play',
  'movie': 'film',
};

// Convert kebab-case or lowercase to PascalCase + "Icon" suffix
function getIconComponent(name) {
  if (!name) return null;

  // Check for aliases first
  const resolvedName = ICON_ALIASES[name.toLowerCase()] || name;

  // Convert to PascalCase: "academic-cap" -> "AcademicCap", "home" -> "Home"
  const pascalCase = resolvedName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  // Try with "Icon" suffix (the standard heroicons naming)
  const iconName = `${pascalCase}Icon`;

  if (OutlineIcons[iconName]) {
    return OutlineIcons[iconName];
  }

  // Try without transforming (in case already correct)
  if (OutlineIcons[name]) {
    return OutlineIcons[name];
  }

  return null;
}

// Convert hex to HSL
function hexToHsl(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 50, l: 50 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to hex
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

// Get gradient end color - uses darker tint for oranges, analogous for others
function getGradientEndColor(hex, shift = 35) {
  const { h, s, l } = hexToHsl(hex);

  // Orange/warm colors (hue ~15-50) - just darken, don't shift hue
  const isOrange = h >= 15 && h <= 50;

  if (isOrange) {
    // Use same hue, just darken significantly
    const darkerLightness = l * 0.65;
    return hslToHex(h, s, darkerLightness);
  }

  // For other colors, shift hue and adjust lightness
  const newHue = (h + shift) % 360;
  const adjustedLightness = l > 50 ? l * 0.85 : Math.min(l * 1.1, 60);
  return hslToHex(newHue, s, adjustedLightness);
}

// Export a list of commonly used icons for the picker
export const HERO_ICONS = {
  // This is now just used for backwards compatibility with SymbolPicker
  // The actual rendering uses getIconComponent which has access to ALL heroicons
};

export function BookmarkIcon({ bookmark, categoryColor, categoryDefaultSymbol }) {
  const { icon_type, icon_url, symbol_name, title } = bookmark;
  const color = categoryColor || '#8b5cf6';
  const gradientEnd = getGradientEndColor(color, 35);

  const gradientStyle = {
    '--icon-color-start': color,
    '--icon-color-end': gradientEnd,
  };

  // Waterfall logic:
  // 1. Custom icon URL
  if (icon_type === 'custom' && icon_url) {
    return (
      <div className="bookmark-icon" style={gradientStyle}>
        <img
          src={icon_url}
          alt=""
          loading="lazy"
        />
      </div>
    );
  }

  // 2. Bookmark's own symbol
  if (icon_type === 'symbol' && symbol_name) {
    const IconComponent = getIconComponent(symbol_name);
    if (IconComponent) {
      return (
        <div className="bookmark-icon" style={gradientStyle}>
          <IconComponent />
        </div>
      );
    }
  }

  // 3. Generated placeholder (first letter on colored background)
  if (icon_type === 'generated') {
    const firstLetter = title?.charAt(0) || '?';
    return (
      <div
        className="bookmark-icon generated"
        style={gradientStyle}
      >
        {firstLetter}
      </div>
    );
  }

  // 4. Category's default symbol (if set)
  if (categoryDefaultSymbol) {
    const IconComponent = getIconComponent(categoryDefaultSymbol);
    if (IconComponent) {
      return (
        <div className="bookmark-icon" style={gradientStyle}>
          <IconComponent />
        </div>
      );
    }
  }

  // 5. Default: Bookmark symbol
  const BookmarkIconDefault = OutlineIcons.BookmarkIcon;
  return (
    <div className="bookmark-icon" style={gradientStyle}>
      <BookmarkIconDefault />
    </div>
  );
}
