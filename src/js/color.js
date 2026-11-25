/* ---------------- color helpers (mirror omarchy-theme-color) ---------------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hexRgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const rgbHex = a => '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const mix = (a, b, p) => { const x = hexRgb(a), y = hexRgb(b); return rgbHex(x.map((v, i) => v * (1 - p) + y[i] * p)); };
const isHex = s => /^#?[0-9a-fA-F]{6}$/.test(s);
const normHex = s => ('#' + s.replace('#', '')).toLowerCase();
const lum = h => { const [r, g, b] = hexRgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const gray = h => { const l = lum(h); return rgbHex([l, l, l]); };
const hyprToCss = s => { // rgba(rrggbbaa) | rgb(rrggbb) | #hex
  let m = s.match(/rgba?\(([0-9a-fA-F]{6})([0-9a-fA-F]{2})?\)/);
  if (m) { const [r, g, b] = hexRgb(m[1]); const a = m[2] ? parseInt(m[2], 16) / 255 : 1; return `rgba(${r},${g},${b},${a.toFixed(3)})`; }
  return s;
};
const toHyprRgba = (hex, a) => `rgba(${hex.replace('#', '')}${Math.round(a * 255).toString(16).padStart(2, '0')})`;

const KEYS = ['accent','selection','muted','background','dark_background','darker_background','lighter_background','foreground','dark_foreground','light_foreground','bright_foreground','red','yellow','orange','green','cyan','blue','magenta','brown','bright_red','bright_yellow','bright_green','bright_cyan','bright_blue','bright_magenta'];
const GROUPS = [
  ['Base', ['background','foreground','accent','muted','selection']],
  ['Background shades', ['dark_background','darker_background','lighter_background']],
  ['Foreground shades', ['dark_foreground','light_foreground','bright_foreground']],
  ['Terminal colors', ['red','yellow','orange','green','cyan','blue','magenta','brown']],
  ['Bright terminal colors', ['bright_red','bright_yellow','bright_green','bright_cyan','bright_blue','bright_magenta']],
];
const COLOR_HELP = {
  background: 'Window, bar and card background. Ghostty palette 0.', foreground: 'Main text. Ghostty palette 7, bar text, launcher text.',
  accent: 'Highlights: btop keys, launcher selection text, neovim mode, notification countdown, and the default active border.',
  muted: 'Comments, line numbers, inactive text. Ghostty palette 8.', selection: 'Selected text and rows (btop, neovim, terminal selection).',
  dark_background: 'Neovim tab line and sidebars. Omarchy derives it as background mixed 25% toward black.', darker_background: 'Deepest panels. Omarchy derives it as background mixed 50% toward black.',
  lighter_background: 'Neovim cursor line and status line.', dark_foreground: 'Dimmed text in btop gradients.', light_foreground: 'btop graph labels and misc text.',
  bright_foreground: 'Terminal cursor and bright white (palette 15).', orange: 'Neovim constants. Falls back to yellow.', brown: 'Falls back to orange mixed 50% with black.',
};
