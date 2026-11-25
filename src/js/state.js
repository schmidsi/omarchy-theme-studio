/* ---------------- presets ---------------- */
const STUDIO_DARK = { mode:'dark', background:'#111111', dark_background:'#0b0b0b', darker_background:'#080808', lighter_background:'#1c1c1c', foreground:'#d9d9d9', dark_foreground:'#5c5c5c', light_foreground:'#ededed', bright_foreground:'#ffffff', accent:'#ffffff', muted:'#6b6b6b', selection:'#2b2b2b', red:'#bdbdbd', yellow:'#e0e0e0', orange:'#cfcfcf', green:'#a8a8a8', cyan:'#c4c4c4', blue:'#9a9a9a', magenta:'#b3b3b3', brown:'#6e6e6e', bright_red:'#d6d6d6', bright_yellow:'#f0f0f0', bright_green:'#c2c2c2', bright_cyan:'#dadada', bright_blue:'#b8b8b8', bright_magenta:'#cccccc' };
const STUDIO_LIGHT = { mode:'light', background:'#ffffff', dark_background:'#e6e6e6', darker_background:'#dadada', lighter_background:'#e9e9e9', foreground:'#141414', dark_foreground:'#8a8a8a', light_foreground:'#2e2e2e', bright_foreground:'#000000', accent:'#000000', muted:'#8f8f8f', selection:'#d2d2d2', red:'#3d3d3d', yellow:'#5a5a5a', orange:'#4a4a4a', green:'#525252', cyan:'#626262', blue:'#2b2b2b', magenta:'#454545', brown:'#6a6a6a', bright_red:'#555555', bright_yellow:'#707070', bright_green:'#686868', bright_cyan:'#787878', bright_blue:'#404040', bright_magenta:'#5c5c5c' };
const STUDIO_LIGHT_MUTED = { ...STUDIO_LIGHT, red:'#9a5b57', yellow:'#7b6b45', orange:'#89654d', green:'#577542', cyan:'#427575', blue:'#516f91', magenta:'#975592', brown:'#6f5a47', bright_red:'#b16c68', bright_yellow:'#917c4b', bright_green:'#628947', bright_cyan:'#478989', bright_blue:'#5d81ab', bright_magenta:'#af64a9' };
const LAYOUT_STUDIO = { hypr: { gaps_in: 0, shared: true, gaps_out: 0, border_size: 1, rounding: 0, dim: false, dim_strength: .15, op: .985, opi: .96 }, border: { mode: 'solid', c1: null, c2: null, angle: 45, inactive: null, inactiveAlpha: 1 }, bar: { position: 'top', look: 'solid', size: 26, alpha: 1 }, shell: { popborder: 1, ctlborder: 1, lalpha: 1, scrim: .5, sp: 1 } };
const LAYOUT_OMARCHY = { hypr: { gaps_in: 5, shared: false, gaps_out: 10, border_size: 2, rounding: 0, dim: false, dim_strength: .15, op: .985, opi: .96 }, border: { mode: 'accent', c1: null, c2: null, angle: 45, inactive: '#595959', inactiveAlpha: .667 }, bar: { position: 'top', look: 'solid', size: 26, alpha: 1 }, shell: { popborder: 2, ctlborder: 1, lalpha: .95, scrim: .5, sp: 1 } };
// Studio presets: colors plus layout. Light keeps terminals fully opaque.
const STUDIO = {
  'studio-dark': { label: 'Studio Dark', colors: STUDIO_DARK },
  'studio-light': { label: 'Studio Light', colors: STUDIO_LIGHT, hypr: { op: 1, opi: 1 } },
  'studio-light-muted': { label: 'Studio Light Muted', colors: STUDIO_LIGHT_MUTED, hypr: { op: 1, opi: 1 } },
};

const FONTS = [
  { name: 'JetBrains Mono', css: '"JetBrains Mono"', family: 'JetBrainsMono Nerd Font', pkg: 'ttf-jetbrains-mono-nerd', builtin: true },
  { name: 'IBM Plex Mono', css: '"IBM Plex Mono"', family: 'BlexMono Nerd Font', pkg: 'ttf-ibmplex-mono-nerd' },
  { name: 'Geist Mono', css: '"Geist Mono"', family: 'GeistMono Nerd Font', pkg: 'otf-geist-mono-nerd' },
  { name: 'Fira Code', css: '"Fira Code"', family: 'FiraCode Nerd Font', pkg: 'ttf-firacode-nerd' },
  { name: 'Source Code Pro', css: '"Source Code Pro"', family: 'SauceCodePro Nerd Font', pkg: 'ttf-sourcecodepro-nerd' },
  { name: 'Roboto Mono', css: '"Roboto Mono"', family: 'RobotoMono Nerd Font', pkg: 'ttf-roboto-mono-nerd' },
  { name: 'Space Mono', css: '"Space Mono"', family: 'SpaceMono Nerd Font', pkg: 'ttf-space-mono-nerd' },
];
const SCREENS = { '1280×800': [1280, 800], '1536×960': [1536, 960], '1920×1080': [1920, 1080], '2560×1440': [2560, 1440] };

const fresh = () => ({
  name: 'studio', preset: 'studio-dark', colors: { ...STUDIO_DARK }, custom: {},
  font: { name: 'JetBrains Mono', term: 10.5, base: 12 },
  ...structuredClone(LAYOUT_STUDIO),
  wall: { kind: 'grid', color: null, ink: null, density: 48, image: null },
  screen: '1536×960',
});
let S = fresh();
try { const saved = JSON.parse(localStorage.getItem('ots-state') || 'null'); if (saved && saved.colors) S = Object.assign(fresh(), saved); } catch (e) {}
const save = () => { try { localStorage.setItem('ots-state', JSON.stringify({ ...S, wall: { ...S.wall, image: S.wall.image && S.wall.image.length < 2e6 ? S.wall.image : null } })); } catch (e) {} };

const get = p => p.split('.').reduce((o, k) => o?.[k], S);
const set = (p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((o, k) => o[k], S)[last] = v; };

/* ---------------- derived values ---------------- */
// Hyprland draws each border inside its own tile, so two neighbours at gaps_in 0 show two lines.
// A negative inner gap of one border width on the right and bottom overlaps them into one.
const sharedBorders = () => S.hypr.shared && S.hypr.gaps_in === 0 && S.hypr.border_size > 0;
function resolved() {
  const c = { ...S.colors };
  const act = S.border.mode === 'accent' ? { css: c.accent, hypr: null }
    : S.border.mode === 'solid' ? { css: S.border.c1 || c.foreground, hypr: toHyprRgba(S.border.c1 || c.foreground, 1) }
    : { css: `linear-gradient(${90 + S.border.angle}deg, ${S.border.c1 || c.accent}, ${S.border.c2 || c.foreground})`, hypr: `${toHyprRgba(S.border.c1 || c.accent, .933)} ${toHyprRgba(S.border.c2 || c.foreground, .933)} ${S.border.angle}deg` };
  const inHex = S.border.inactive || (S.border.mode === 'solid' ? mix(c.background, c.foreground, .22) : '#595959');
  const inact = { css: hyprToCss(toHyprRgba(inHex, S.border.inactiveAlpha)), hypr: toHyprRgba(inHex, S.border.inactiveAlpha) };
  return { c, act, inact, inHex };
}
