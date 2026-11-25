/* ---------------- control builders ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== null && v !== undefined) e.setAttribute(k, v); } kids.flat().forEach(k => k != null && e.append(k.nodeType ? k : document.createTextNode(k))); return e; };
const info = (title, text, where) => { const i = $('#info'); i.innerHTML = ''; i.append(el('b', {}, title), el('p', {}, text, where ? el('span', {}, ' → ', el('code', {}, where)) : '')); };
const withInfo = (node, title, text, where) => { const f = () => info(title, text, where); node.addEventListener('mouseenter', f); node.addEventListener('focusin', f); return node; };

let uid = 0;
function numBox(path, { min, max, step, fmt }, onChange) {
  const box = el('div', { class: 'nb', tabindex: '0', role: 'slider', 'aria-valuemin': min, 'aria-valuemax': max });
  const fill = el('div', { class: 'fill' }), val = el('div', { class: 'val' });
  box.append(fill, val);
  const dec = (String(step).split('.')[1] || '').length;
  const paint = () => { const v = get(path); fill.style.width = ((v - min) / (max - min) * 100) + '%'; val.textContent = fmt ? fmt(v) : v.toFixed(dec); box.setAttribute('aria-valuenow', v); };
  const put = v => { v = clamp(Math.round(v / step) * step, min, max); v = +v.toFixed(dec); if (v !== get(path)) { set(path, v); paint(); onChange(); } };
  let start = null;
  box.addEventListener('pointerdown', e => { if (box.querySelector('input')) return; box.setPointerCapture(e.pointerId); start = { x: e.clientX, y: e.clientY, v: get(path) }; });
  box.addEventListener('pointermove', e => { if (!start) return; const d = (e.clientX - start.x) - (e.clientY - start.y); const range = max - min; put(start.v + d / 160 * range * (e.shiftKey ? .1 : 1)); });
  box.addEventListener('pointerup', () => start = null);
  box.addEventListener('dblclick', () => { const inp = el('input', { type: 'text', value: get(path) }); box.append(inp); inp.focus(); inp.select(); const done = ok => { if (ok && !isNaN(parseFloat(inp.value))) put(parseFloat(inp.value)); inp.remove(); box.focus(); }; inp.addEventListener('keydown', e => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); e.stopPropagation(); }); inp.addEventListener('blur', () => done(true)); });
  box.addEventListener('keydown', e => { if (e.target !== box) return; const m = e.shiftKey ? 10 : 1; if (['ArrowUp', 'ArrowRight'].includes(e.key)) { put(get(path) + step * m); e.preventDefault(); } if (['ArrowDown', 'ArrowLeft'].includes(e.key)) { put(get(path) - step * m); e.preventDefault(); } if (e.key === 'Enter') box.dispatchEvent(new Event('dblclick')); });
  box.paint = paint; paint();
  return box;
}
function seg(path, opts, onChange) {
  const s = el('div', { class: 'seg', role: 'group' });
  const paint = () => [...s.children].forEach(b => b.setAttribute('aria-pressed', String(String(get(path)) === b.dataset.v)));
  opts.forEach(([v, l]) => s.append(el('button', { 'data-v': String(v), type: 'button', onclick: () => { set(path, typeof v === 'boolean' ? v : v); paint(); onChange(); } }, l)));
  s.paint = paint; paint(); return s;
}
const painters = [];
function row(label, ctl, help, where) { const r = el('div', { class: 'row' }, el('label', {}, label), ctl); if (ctl.paint) painters.push(ctl.paint); return withInfo(r, label, help, where); }
function colorRow(key, getV, setV, help, where, derived) {
  const sw = el('label', { class: 'sw', title: 'Pick color' });
  const pick = el('input', { type: 'color', 'aria-label': key });
  const hex = el('input', { class: 'hex', spellcheck: 'false', 'aria-label': key + ' hex' });
  sw.append(pick);
  const r = el('div', { class: 'crow' + (derived ? ' derived' : '') }, sw, el('span', { class: 'k' }, key), hex);
  const paint = () => { const v = getV(); sw.style.background = v; pick.value = v; if (document.activeElement !== hex) hex.value = v; };
  pick.addEventListener('input', () => { setV(pick.value); paint(); });
  hex.addEventListener('input', () => { if (isHex(hex.value.trim())) { setV(normHex(hex.value.trim())); paint(); } });
  hex.addEventListener('blur', paint);
  painters.push(paint); paint();
  return withInfo(r, key, help || 'Terminal palette color, also used by btop and neovim.', where || 'colors.toml');
}
function section(title, open, ...kids) { const d = el('details', { class: 'sec' }, el('summary', {}, title), el('div', { class: 'sec-body' }, ...kids)); if (open) d.open = true; return d; }

/* ---------------- build panel ---------------- */
function buildPanel() {
  const root = $('#controls'); root.innerHTML = ''; painters.length = 0;
  const up = () => { apply(); save(); };
  const upAll = () => { apply(); save(); painters.forEach(p => p()); };

  // Colors
  const colorKids = [
    row('Mode', seg('colors.mode', [['dark', 'Dark'], ['light', 'Light']], up), 'Tells apps (GTK, browser, neovim) whether this is a light or dark theme.', 'colors.toml · mode'),
  ];
  GROUPS.forEach(([g, keys]) => {
    colorKids.push(el('div', { class: 'sub' }, g));
    keys.forEach(k => colorKids.push(colorRow(k, () => S.colors[k], v => { S.colors[k] = v; up(); }, COLOR_HELP[k], 'colors.toml · ' + k)));
  });
  colorKids.push(el('div', { class: 'btns', style: 'margin-top:6px' },
    withInfo(el('button', { class: 'btn', type: 'button', onclick: () => { const c = S.colors; c.dark_background = mix(c.background, '#000000', .25); c.darker_background = mix(c.background, '#000000', .5); c.lighter_background = mix(c.background, c.foreground, .08); c.dark_foreground = mix(c.foreground, c.background, .6); c.light_foreground = mix(c.foreground, c.background, .1); c.selection = mix(c.background, c.foreground, .18); c.muted = mix(c.foreground, c.background, .5); ['red','yellow','green','cyan','blue','magenta'].forEach(k => c['bright_' + k] = mix(c[k], '#ffffff', .2)); c.brown = mix(c.orange, '#000000', .5); upAll(); } }, 'Derive shades'), 'Derive shades', 'Recalculates the background and foreground shades, muted, selection, and the bright colors from your base colors. Uses Omarchy’s own rules where it has them (25% and 50% toward black, brights 20% toward white).', 'omarchy-theme-color'),
    withInfo(el('button', { class: 'btn', type: 'button', onclick: () => { KEYS.forEach(k => S.colors[k] = gray(S.colors[k])); upAll(); } }, 'Grayscale'), 'Grayscale', 'Turns every color into the gray of the same brightness. Good starting point for a black-and-white theme.'),
  ));

  // Typography
  const fontSel = el('select', { class: 'field', 'aria-label': 'Font' }, FONTS.map(f => el('option', { value: f.name }, f.name)));
  fontSel.value = S.font.name; fontSel.addEventListener('change', () => { S.font.name = fontSel.value; up(); });
  painters.push(() => fontSel.value = S.font.name);
  const typo = [
    row('Font', fontSel, 'Omarchy uses one monospace font everywhere: terminals, the bar, menus and the lock screen.', 'omarchy font set'),
    row('Terminal size', numBox('font.term', { min: 7, max: 18, step: .5, fmt: v => v.toFixed(1) + ' pt' }, up), 'Font size inside the terminal. Not part of the theme; set per terminal.', '~/.config/ghostty/config · font-size'),
    row('Shell base size', numBox('font.base', { min: 9, max: 18, step: 1, fmt: v => v + ' px' }, up), 'Root size of the shell’s type scale. Bar, launcher, menus and notifications scale from this.', 'shell.font.toml · base-size'),
  ];

  // Windows
  const win = [
    row('Inner gaps', numBox('hypr.gaps_in', { min: 0, max: 30, step: 1, fmt: v => v + ' px' }, up), 'Space around each window, so the gap between two windows is twice this.', 'hyprland.lua · general.gaps_in'),
    row('Outer gaps', numBox('hypr.gaps_out', { min: 0, max: 60, step: 1, fmt: v => v + ' px' }, up), 'Space between windows and the screen edge.', 'hyprland.lua · general.gaps_out'),
    row('Border width', numBox('hypr.border_size', { min: 0, max: 8, step: 1, fmt: v => v + ' px' }, up), 'Width of the line around each window.', 'hyprland.lua · general.border_size'),
    row('Rounding', numBox('hypr.rounding', { min: 0, max: 24, step: 1, fmt: v => v + ' px' }, up), 'Corner radius of windows. Cards, notifications and the lock field follow it in this preview.', 'hyprland.lua · decoration.rounding'),
    row('Dim inactive', seg('hypr.dim', [[false, 'Off'], [true, 'On']], up), 'Darkens windows that don’t have focus.', 'hyprland.lua · decoration.dim_inactive'),
    row('Dim strength', numBox('hypr.dim_strength', { min: 0, max: .6, step: .05, fmt: v => Math.round(v * 100) + ' %' }, up), 'How much unfocused windows are darkened.', 'hyprland.lua · decoration.dim_strength'),
    row('Terminal opacity', numBox('hypr.op', { min: .5, max: 1, step: .005, fmt: v => (v * 100).toFixed(1) + ' %' }, up), 'Opacity of focused terminals. Omarchy’s default is 98.5%, so the wallpaper shows through very slightly.', 'hyprland.lua · o.transparent_window'),
    row('…when unfocused', numBox('hypr.opi', { min: .5, max: 1, step: .005, fmt: v => (v * 100).toFixed(1) + ' %' }, up), 'Opacity of terminals without focus. Omarchy’s default is 96%.', 'hyprland.lua · o.transparent_window'),
  ];

  // Borders
  const bmode = seg('border.mode', [['accent', 'Accent'], ['solid', 'Solid'], ['gradient', 'Gradient']], () => { up(); });
  const bord = [
    row('Active border', bmode, 'Accent uses the theme accent, like most stock themes. Solid and Gradient write hyprland_active_border into colors.toml, which the shell reuses for popups, notifications and the lock field.', 'colors.toml · hyprland_active_border'),
    colorRow('color 1', () => S.border.c1 || S.colors.accent, v => { S.border.c1 = v; if (S.border.mode === 'accent') S.border.mode = 'solid'; bmode.paint(); up(); }, 'First (or only) color of the active border.', 'hyprland_active_border'),
    colorRow('color 2', () => S.border.c2 || S.colors.foreground, v => { S.border.c2 = v; S.border.mode = 'gradient'; bmode.paint(); up(); }, 'Second color, used in Gradient mode.', 'hyprland_active_border'),
    row('Angle', numBox('border.angle', { min: 0, max: 360, step: 15, fmt: v => v + '°' }, up), 'Direction of the gradient.', 'hyprland_active_border · deg'),
    colorRow('inactive', () => resolved().inHex, v => { S.border.inactive = v; up(); }, 'Border of windows without focus.', 'colors.toml · hyprland_inactive_border'),
    row('Inactive alpha', numBox('border.inactiveAlpha', { min: 0, max: 1, step: .05, fmt: v => Math.round(v * 100) + ' %' }, up), 'Opacity of the inactive border. Omarchy’s default is about 67%.', 'hyprland_inactive_border'),
  ];

  // Bar
  const bar = [
    row('Position', seg('bar.position', [['top', 'Top'], ['bottom', 'Bottom']], up), 'Which screen edge the bar sits on.', 'shell.json · bar.position'),
    row('Background', seg('bar.look', [['solid', 'Solid'], ['glassy', 'Glassy']], up), 'Glassy blurs whatever is behind the bar.', 'shell.json · bar.background'),
    row('Height', numBox('bar.size', { min: 16, max: 48, step: 1, fmt: v => v + ' px' }, up), 'Bar height at base size 12. It grows and shrinks with the shell base size.', 'shell.bar.toml · size-horizontal'),
    row('Opacity', numBox('bar.alpha', { min: 0, max: 1, step: .05, fmt: v => Math.round(v * 100) + ' %' }, up), 'Opacity of the bar background.', 'shell.bar.toml · background-alpha'),
  ];

  // Surfaces
  const surf = [
    row('Popup border', numBox('shell.popborder', { min: 0, max: 6, step: 1, fmt: v => v + ' px' }, up), 'Border width of notifications, the launcher, menus, the volume display and the lock field.', 'shell.popups / notifications · border-width'),
    row('Control border', numBox('shell.ctlborder', { min: 0, max: 3, step: 1, fmt: v => v + ' px' }, up), 'Border of buttons and inputs, such as the launcher search field.', 'shell.controls.toml · normal-border-width'),
    row('Launcher opacity', numBox('shell.lalpha', { min: .5, max: 1, step: .01, fmt: v => Math.round(v * 100) + ' %' }, up), 'Opacity of the launcher and menu cards.', 'shell.launcher.toml · background-alpha'),
    row('Backdrop dim', numBox('shell.scrim', { min: 0, max: 1, step: .05, fmt: v => Math.round(v * 100) + ' %' }, up), 'How strongly the screen behind the launcher is washed out.', 'shell.launcher.toml · scrim-alpha'),
    row('Spacing', numBox('shell.sp', { min: .6, max: 1.8, step: .05, fmt: v => '× ' + v.toFixed(2) }, up), 'Multiplies padding and row heights in shell surfaces.', 'shell.spacing.toml · scale'),
  ];

  // Wallpaper
  const file = el('input', { type: 'file', accept: 'image/*', hidden: '' });
  file.addEventListener('change', () => { const f = file.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { S.wall.image = r.result; S.wall.kind = 'image'; painters.forEach(p => p()); up(); }; r.readAsDataURL(f); });
  const wall = [
    row('Pattern', seg('wall.kind', [['solid', 'Solid'], ['grid', 'Grid'], ['dots', 'Dots'], ['lines', 'Lines'], ['image', 'Image']], () => { if (S.wall.kind === 'image' && !S.wall.image) file.click(); up(); }), 'Wallpaper drawn from your colors, or your own image. It is exported into the theme’s backgrounds folder.', 'backgrounds/'),
    colorRow('ground', () => S.wall.color || S.colors.darker_background, v => { S.wall.color = v; up(); }, 'Wallpaper base color. Defaults to darker_background.', 'backgrounds/'),
    colorRow('ink', () => S.wall.ink || S.colors.lighter_background, v => { S.wall.ink = v; up(); }, 'Color of the pattern lines or dots. Defaults to lighter_background.', 'backgrounds/'),
    row('Density', numBox('wall.density', { min: 8, max: 160, step: 4, fmt: v => v + ' px' }, up), 'Spacing of the pattern.', 'backgrounds/'),
    el('div', { class: 'btns' }, el('button', { class: 'btn', type: 'button', onclick: () => file.click() }, 'Upload image…'), file),
  ];

  // Preview
  const prev = [row('Screen', seg('screen', Object.keys(SCREENS).map(k => [k, k.replace('×', '×')]), up), 'Logical size of the mocked screen. 1536×960 is a 13″ MacBook at 1.67× scaling.', 'monitors.lua')];

  root.append(
    section('Colors', true, ...colorKids),
    section('Typography', true, ...typo),
    section('Windows', true, ...win),
    section('Borders', false, ...bord),
    section('Bar', false, ...bar),
    section('Shell surfaces', false, ...surf),
    section('Wallpaper', false, ...wall),
    section('Preview', false, ...prev),
  );
}

/* ---------------- presets ---------------- */
function buildPresets() {
  const p = $('#preset'); p.innerHTML = '';
  const own = el('optgroup', { label: 'Studio' }, Object.entries(STUDIO).map(([k, v]) => el('option', { value: k }, v.label)));
  const stock = el('optgroup', { label: 'Omarchy themes' }, Object.keys(STOCK).map(k => el('option', { value: k }, k.replace(/-/g, ' '))));
  p.append(el('option', { value: '', disabled: '' }, 'Start from…'), own, stock);
  p.value = S.preset || '';
  p.addEventListener('change', () => loadPreset(p.value));
  withInfo(p, 'Start from', 'Studio presets are monochrome with no gaps and 1px lines. Omarchy themes load the real colors of the themes installed on your machine, plus Omarchy’s default layout.');
}
function loadPreset(k) {
  const isStudio = k in STUDIO;
  const src = isStudio ? STUDIO[k].colors : STOCK[k];
  S.colors = {}; KEYS.forEach(x => S.colors[x] = src[x] || '#808080'); S.colors.mode = src.mode || 'dark';
  Object.assign(S, structuredClone(isStudio ? LAYOUT_STUDIO : LAYOUT_OMARCHY));
  if (isStudio) Object.assign(S.hypr, STUDIO[k].hypr);
  if (!isStudio && src.hyprland_active_border) { const parts = src.hyprland_active_border.match(/rgba?\(([0-9a-f]{6})/gi) || []; const cols = parts.map(p => '#' + p.slice(-6)); const ang = (src.hyprland_active_border.match(/(\d+)deg/) || [])[1]; S.border.mode = cols.length > 1 ? 'gradient' : 'solid'; S.border.c1 = cols[0]; S.border.c2 = cols[1] || null; S.border.angle = ang ? +ang : 0; }
  if (!isStudio && src.hyprland_inactive_border) { const m = src.hyprland_inactive_border.match(/rgba?\(([0-9a-f]{6})([0-9a-f]{2})?/i); if (m) { S.border.inactive = '#' + m[1]; S.border.inactiveAlpha = m[2] ? +(parseInt(m[2], 16) / 255).toFixed(2) : 1; } }
  S.wall = { kind: isStudio ? 'grid' : 'dots', color: null, ink: null, density: isStudio ? 48 : 28, image: null };
  S.preset = k; S.name = isStudio ? k : k + '-custom';
  $('#themeName').value = S.name;
  painters.forEach(p => p()); apply(); save();
}
