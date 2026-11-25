/* ---------------- wallpaper ---------------- */
let wallURL = '', wallKey = '';
function wallpaper(c) {
  const [SW, SH] = dims();
  const ground = S.wall.color || c.darker_background, ink = S.wall.ink || c.lighter_background;
  const key = [S.wall.kind, ground, ink, S.wall.density, SW, SH, S.wall.kind === 'image' ? S.wall.image?.length : 0].join('|');
  if (key === wallKey) return wallURL;
  wallKey = key;
  if (S.wall.kind === 'image' && S.wall.image) return (wallURL = S.wall.image);
  const cv = document.createElement('canvas'); cv.width = SW; cv.height = SH; const g = cv.getContext('2d');
  g.fillStyle = ground; g.fillRect(0, 0, SW, SH);
  g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = 1; const d = S.wall.density;
  if (S.wall.kind === 'grid') { g.beginPath(); for (let x = .5; x < SW; x += d) { g.moveTo(x, 0); g.lineTo(x, SH); } for (let y = .5; y < SH; y += d) { g.moveTo(0, y); g.lineTo(SW, y); } g.stroke(); }
  if (S.wall.kind === 'dots') { for (let x = d / 2; x < SW; x += d) for (let y = d / 2; y < SH; y += d) { g.fillRect(Math.round(x), Math.round(y), 2, 2); } }
  if (S.wall.kind === 'lines') { g.beginPath(); for (let y = .5; y < SH; y += d / 4) { g.moveTo(0, y); g.lineTo(SW, y); } g.stroke(); }
  return (wallURL = cv.toDataURL('image/png'));
}

/* ---------------- apply state to preview ---------------- */
function apply() {
  const { c, act, inact } = resolved();
  const font = FONTS.find(f => f.name === S.font.name) || FONTS[0];
  const st = desk.style;
  Object.entries(c).forEach(([k, v]) => k !== 'mode' && st.setProperty('--t-' + k, v));
  const pal = [c.background, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.foreground, c.muted, c.bright_red, c.bright_green, c.bright_yellow, c.bright_blue, c.bright_magenta, c.bright_cyan, c.bright_foreground];
  pal.forEach((v, i) => st.setProperty('--tc' + i, v));
  st.setProperty('--t-selection_foreground', c.bright_foreground);
  st.setProperty('--t-font', `${font.css}, ui-monospace, monospace`);
  st.setProperty('--t-base', S.font.base + 'px');
  st.setProperty('--t-term', (S.font.term * 4 / 3).toFixed(2) + 'px');
  st.setProperty('--h-bar', Math.round(S.bar.size * S.font.base / 12) + 'px');
  st.setProperty('--h-baralpha', S.bar.look === 'glassy' ? Math.min(S.bar.alpha, .78) : S.bar.alpha);
  st.setProperty('--h-border', S.hypr.border_size + 'px');
  st.setProperty('--h-round', S.hypr.rounding + 'px');
  st.setProperty('--h-gout', Math.max(S.hypr.gaps_out, 10) + 'px');
  st.setProperty('--h-dim', S.hypr.dim_strength);
  st.setProperty('--h-op', S.hypr.op); st.setProperty('--h-opi', S.hypr.opi);
  const grad = v => v.startsWith('linear') ? v : `linear-gradient(${v}, ${v})`;
  st.setProperty('--h-active-grad', grad(act.css));
  st.setProperty('--h-inactive-grad', grad(inact.css));
  st.setProperty('--h-launcher-grad', S.border.mode === 'accent' ? grad(c.foreground) : grad(act.css));
  st.setProperty('--h-popborder', S.shell.popborder + 'px');
  st.setProperty('--h-ctlborder', S.shell.ctlborder + 'px');
  st.setProperty('--h-lalpha', S.shell.lalpha);
  st.setProperty('--h-scrim', S.shell.scrim);
  st.setProperty('--h-sp', S.shell.sp);
  desk.classList.toggle('dimon', S.hypr.dim);
  const bar = $('#bar'); bar.className = 'bar ' + S.bar.position + (S.bar.look === 'glassy' ? ' glassy' : '');
  const [SW, SH] = dims(); desk.style.width = SW + 'px'; desk.style.height = SH + 'px';
  $('#notifs').style.top = (S.bar.position === 'top' ? Math.round(S.bar.size * S.font.base / 12) : 0) + Math.max(S.hypr.gaps_out, 10) + 'px';
  const url = wallpaper(c);
  desk.querySelector('.wall').style.backgroundImage = `url(${url})`;
  desk.querySelector('.wall2').style.backgroundImage = `url(${url})`;
  $('#meta').textContent = `${S.name} · ${SW}×${SH} · ${S.colors.mode}`;
  layout(); fit();
}
function fit() {
  const vp = $('#viewport'), [SW, SH] = dims();
  const cs = getComputedStyle(vp); const aw = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ah = vp.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 14;
  const k = Math.max(.1, Math.min(aw / SW, ah / SH));
  desk.style.transform = `scale(${k})`;
  const f = $('#frame'); f.style.width = SW * k + 'px'; f.style.height = SH * k + 'px';
}
new ResizeObserver(fit).observe($('#viewport'));
