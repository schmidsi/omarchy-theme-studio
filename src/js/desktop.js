/* ---------------- desktop ---------------- */
const desk = $('#desk');
const ICON = {
  menu: '<svg class="ico" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17"/><path d="M8 3.5v17"/></svg>',
  chev: '<svg class="ico" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  grid: '<svg class="ico fillc" viewBox="0 0 24 24"><circle cx="6" cy="9" r="1.6"/><circle cx="12" cy="9" r="1.6"/><circle cx="18" cy="9" r="1.6"/><circle cx="6" cy="15" r="1.6"/><circle cx="12" cy="15" r="1.6"/><circle cx="18" cy="15" r="1.6"/></svg>',
  bt: '<svg class="ico" viewBox="0 0 24 24"><path d="M7 7l10 10-5 4V3l5 4L7 17"/></svg>',
  wifi: '<svg class="ico" viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.2" r=".9" fill="currentColor"/></svg>',
  vol: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>',
  mon: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="12"/><path d="M8.5 20h7M12 16.5V20"/></svg>',
  bat: '<svg class="ico" viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="17"/><path d="M10 2.5h4"/><rect x="9" y="9" width="6" height="10" fill="currentColor" stroke="none"/></svg>',
  sun: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  globe: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
  dot: '<svg class="ico fillc" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/></svg>',
};

desk.innerHTML = `
  <div class="wall"></div>
  <div class="layer" id="layer"></div>
  <div class="bar" id="bar"><div class="bg"></div>
    <div class="bl">${ICON.menu.replace('class="ico"', 'class="ico" data-act="menu"')}<div class="ws" id="ws"></div></div>
    <div class="bc">${ICON.dot}<span id="clock"></span>${ICON.globe}${ICON.sun}</div>
    <div class="br">${ICON.chev}${ICON.grid}${ICON.bt}${ICON.wifi}${ICON.vol.replace('class="ico"', 'class="ico" data-act="osd"')}${ICON.mon}${ICON.bat}</div>
  </div>
  <div class="notifs" id="notifs"></div>
  <div class="osd" id="osd"><div class="ob"></div>${ICON.vol}<div class="track"><i id="osdv"></i></div><span id="osdn">60</span></div>
  <div class="scrim" id="scrim"><div class="wash"></div><div class="card"><div class="inner" id="cardInner"></div></div></div>
  <div class="lock" id="lock"><div class="wall2"></div><div class="clock" id="lclock"></div><div class="date" id="ldate"></div><div class="pw" id="pw"><div class="pin" id="pin"><span class="ph">Enter password</span></div></div></div>`;

/* window contents (rendered once; colors come from CSS variables) */
const S_ = (cls, t) => `<span class="${cls}">${t}</span>`;
function promptLine(cmd = '', cursor = false) { return `${S_('c4 b', '~/Work/studio')} ${S_('c5', 'main')} ${S_('c2', '❯')} ${cmd}${cursor ? '<span class="cur"> </span>' : ''}`; }
const blocks = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => `<span class="blk" style="background:var(--tc${from + i})"></span>`).join('');
const CONTENT = {
  fetch: () => [
    promptLine('fastfetch'),
    `${S_('ca b', '      ▄▄▄▄▄▄▄▄▄▄▄▄▄      ')}   ${S_('ca b', 'user')}@${S_('ca b', 'omarchy')}`,
    `${S_('ca b', '   ▄█▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▄   ')}   ${S_('c8', '─────────────────')}`,
    `${S_('ca b', '  ██  ▄▄▄▄▄▄▄▄▄▄▄   ██  ')}   ${S_('c4', 'OS')}       Omarchy 4`,
    `${S_('ca b', '  ██  ██       ██   ██  ')}   ${S_('c4', 'Kernel')}   7.2.15-arch1-1-t2`,
    `${S_('ca b', '  ██  ██       ██   ██  ')}   ${S_('c4', 'WM')}       Hyprland`,
    `${S_('ca b', '  ██  ▀▀▀▀▀▀▀▀▀▀▀   ██  ')}   ${S_('c4', 'Shell')}    bash 5.3`,
    `${S_('ca b', '   ▀█▄▄▄▄▄▄▄▄▄▄▄▄▄▄█▀   ')}   ${S_('c4', 'Terminal')} ghostty`,
    `${S_('ca b', '      ▀▀▀▀▀▀▀▀▀▀▀▀▀      ')}   ${S_('c4', 'Memory')}   6.1 GiB / 16 GiB`,
    ``,
    `                            ${blocks(0, 7)}`,
    `                            ${blocks(8, 15)}`,
    ``,
    promptLine('', true),
  ].join('\n'),
  ls: () => [
    promptLine('ls -l'),
    `${S_('c4 b', 'drwxr-xr-x')} ${S_('c3', 'user')} ${S_('c2', '  4.0k')} ${S_('c8', 'Nov 25 13:02')} ${S_('c4 b', 'backgrounds')}`,
    `${S_('c7', '.rw-r--r--')} ${S_('c3', 'user')} ${S_('c2', '   612')} ${S_('c8', 'Nov 25 13:04')} colors.toml`,
    `${S_('c7', '.rw-r--r--')} ${S_('c3', 'user')} ${S_('c2', '   388')} ${S_('c8', 'Nov 25 13:04')} hyprland.lua`,
    `${S_('c2 b', '.rwxr-xr-x')} ${S_('c3', 'user')} ${S_('c2', '  1.2k')} ${S_('c8', 'Nov 25 12:41')} ${S_('c2 b', 'install.sh')}`,
    `${S_('c6', 'lrwxrwxrwx')} ${S_('c3', 'user')} ${S_('c2', '     -')} ${S_('c8', 'Nov 24 18:20')} ${S_('c6', 'current')} → ${S_('c4', '../themes/studio')}`,
    promptLine('git log --oneline -4'),
    `${S_('c3', 'a3f9c1e')} ${S_('c6 b', '(HEAD → main)')} Tighten gaps to 0, 1px lines`,
    `${S_('c3', '7b20d4f')} Grayscale ANSI palette`,
    `${S_('c3', '19e8a02')} ${S_('c1', 'Revert')} accent to white`,
    `${S_('c3', 'c0ffee1')} Initial theme`,
    promptLine('git status -s'),
    `${S_('c2', ' M')} colors.toml   ${S_('c1', '??')} shell.bar.toml`,
    promptLine('', true),
  ].join('\n'),
  shell: () => promptLine('', true),
};
const NVIM = () => {
  const L = [
    `${S_('c5', 'local')} ${S_('c7', 'theme')} ${S_('c8', '=')} ${S_('c4', 'require')}(${S_('c2', '"omarchy.theme"')})`,
    ``,
    `${S_('c8', '-- Lines, text, and nothing else.')}`,
    `${S_('c5', 'function')} ${S_('c4', 'theme.apply')}(${S_('co', 'opts')})`,
    `  ${S_('c5', 'local')} gaps ${S_('c8', '=')} opts.gaps ${S_('c5', 'or')} ${S_('co', '0')}`,
    `  ${S_('c5', 'local')} border ${S_('c8', '=')} { size ${S_('c8', '=')} ${S_('co', '1')}, color ${S_('c8', '=')} ${S_('c2', '"#ffffff"')} }`,
    `  ${S_('c5', 'if')} opts.rounding ${S_('c8', '>')} ${S_('co', '0')} ${S_('c5', 'then')}`,
    `    ${S_('c4', 'vim.notify')}(${S_('c2', '"square corners only"')}, ${S_('c3', 'vim.log.levels')}.WARN)`,
    `  ${S_('c5', 'end')}`,
    `  ${S_('c5', 'return')} ${S_('c3', 'hl')}.${S_('c4', 'config')}({ general ${S_('c8', '=')} { gaps_in ${S_('c8', '=')} gaps } })`,
    `${S_('c5', 'end')}`,
    ``,
    `${S_('c5', 'return')} theme`,
  ];
  return `<div class="nv"><div class="tabs"><span class="on"> init.lua </span><span> colors.toml </span></div><div class="code">${L.map((l, i) => i === 5 ? `<span class="cl"><span class="ln">${i + 1}</span>${l}</span>` : `<span class="ln">${i + 1}</span>${l}`).join('\n')}\n${Array.from({ length: 14 }, () => S_('c8', '  ~')).join('\n')}</div><div class="status"><span class="m">NORMAL</span><span class="s2"> main </span><span> init.lua </span><span class="fill"></span><span class="s2"> lua </span><span class="m">6:21</span></div><div class="cmd">"init.lua" 13L, 412B</div></div>`;
};
const BTOP = () => `<div class="bt">
  <div class="box cpu"><span class="t"><i>¹</i>cpu</span><div class="graph" data-graph="cpu"></div><div class="gtx" data-cpu></div></div>
  <div class="box mem"><span class="t"><i>²</i>mem</span><div data-mem></div></div>
  <div class="box proc"><span class="t"><i>⁴</i>proc</span><div data-proc></div></div>
  <div class="box net"><span class="t"><i>³</i>net</span></div></div>`;

/* WM state */
let nextId = 1;
const W = {}; // id -> {type, el}
const WS = { 1: [], 2: [], 3: [], 4: [], 5: [] };
const FOCUS = {};
let cur = 1;
function makeWin(type, variant) {
  const id = nextId++;
  const w = el('div', { class: 'win spawn', 'data-id': id });
  const inner = el('div', { class: 'in' + (type === 'term' ? ' alpha' : '') });
  if (type === 'term') inner.innerHTML = `<div class="term">${CONTENT[variant || 'shell']()}</div>`;
  if (type === 'nvim') inner.innerHTML = NVIM();
  if (type === 'btop') inner.innerHTML = BTOP();
  w.append(inner, el('div', { class: 'dim' }));
  w.addEventListener('mousedown', () => { FOCUS[cur] = id; layout(); });
  setTimeout(() => w.classList.remove('spawn'), 300);
  W[id] = { type, el: w };
  return id;
}
function openWin(type, variant, ws = cur) { const id = makeWin(type, variant); WS[ws].push(id); FOCUS[ws] = id; $('#layer').append(W[id].el); layout(); return id; }
function closeWin() { const id = FOCUS[cur]; if (!id) return; WS[cur] = WS[cur].filter(x => x !== id); W[id].el.remove(); delete W[id]; FOCUS[cur] = WS[cur][WS[cur].length - 1]; layout(); }
function switchWs(n) { cur = n; layout(); }

function dims() { return SCREENS[S.screen] || SCREENS['1536×960']; }
function layout() {
  const [SW, SH] = dims();
  const scale = S.font.base / 12;
  const barH = Math.round(S.bar.size * scale);
  const go = S.hypr.gaps_out, sh = sharedBorders() ? S.hypr.border_size : 0, gi = S.hypr.gaps_in;
  const area = { x: go, y: (S.bar.position === 'top' ? barH : 0) + go, w: SW - 2 * go, h: SH - barH - 2 * go };
  Object.values(W).forEach(w => w.el.style.display = 'none');
  const ids = WS[cur];
  // dwindle: each new window splits the previous one's space along its longer side (force_split = 2 → new goes right/bottom)
  const rects = []; let r = { ...area };
  ids.forEach((id, i) => {
    if (i === ids.length - 1) { rects.push(r); return; }
    const vertical = r.w / r.h >= 1;
    if (vertical) { const a = { x: r.x, y: r.y, w: r.w / 2, h: r.h }; rects.push(a); r = { x: r.x + r.w / 2, y: r.y, w: r.w / 2, h: r.h }; }
    else { const a = { x: r.x, y: r.y, w: r.w, h: r.h / 2 }; rects.push(a); r = { x: r.x, y: r.y + r.h / 2, w: r.w, h: r.h / 2 }; }
  });
  ids.forEach((id, i) => {
    const q = rects[i], e = W[id].el;
    // gaps_in on edges shared with another window, gaps_out already applied on screen edges
    const L = q.x > area.x + .5 ? gi : 0, T = q.y > area.y + .5 ? gi : 0, R = q.x + q.w < area.x + area.w - .5 ? gi - sh : 0, B = q.y + q.h < area.y + area.h - .5 ? gi - sh : 0;
    e.style.display = '';
    Object.assign(e.style, { left: (q.x + L) + 'px', top: (q.y + T) + 'px', width: (q.w - L - R) + 'px', height: (q.h - T - B) + 'px' });
    e.classList.toggle('focus', FOCUS[cur] === id); e.style.zIndex = FOCUS[cur] === id ? 2 : 1;
  });
  // workspaces
  const ws = $('#ws'); ws.innerHTML = '';
  for (let n = 1; n <= 5; n++) ws.append(el('span', { class: (n === cur ? 'active' : '') + (WS[n].length ? '' : ' empty'), onclick: () => switchWs(n) }, String(n)));
}

/* live bits: clock, btop */
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function tick() {
  const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  $('#clock').textContent = `${DAYS[d.getDay()]} ${hh}:${mm}`;
  $('#lclock').textContent = `${hh}:${mm}`; $('#ldate').textContent = `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
const cpuHist = Array.from({ length: 90 }, () => 20 + Math.random() * 30);
const PROCS = [['1204', 'Hyprland', 'user', 4.1, 212], ['2311', 'ghostty', 'user', 2.6, 148], ['2318', 'nvim', 'user', 1.2, 96], ['981', 'quickshell', 'user', 0.9, 182], ['3120', 'chromium', 'user', 7.4, 1420], ['3122', 'claude', 'user', 3.3, 410], ['640', 'pipewire', 'user', 0.4, 38], ['1', 'systemd', 'root', 0.1, 14], ['2290', 'btop', 'user', 0.6, 9], ['771', 'NetworkManager', 'root', 0.1, 22]];
function btopTick() {
  cpuHist.push(clamp(cpuHist[cpuHist.length - 1] + (Math.random() - .5) * 22, 4, 96)); cpuHist.shift();
  document.querySelectorAll('#desk [data-graph]').forEach(g => { if (g.children.length !== cpuHist.length) g.innerHTML = cpuHist.map(() => '<i></i>').join(''); [...g.children].forEach((b, i) => b.style.height = cpuHist[i] + '%'); });
  const v = cpuHist[cpuHist.length - 1];
  document.querySelectorAll('#desk [data-cpu]').forEach(e => e.innerHTML = `CPU ${S_('c7', String(Math.round(v)).padStart(3) + '%')}  ${S_('dl', '│')}  load 0.82 0.71 0.66  ${S_('dl', '│')}  up 2d 4h  ${S_('dl', '│')}  ${S_('c3', '48°C')}`);
  const meter = (label, p, c) => `<div class="meter"><span>${label}</span><div class="mb"><i style="width:${p}%;background:linear-gradient(90deg,var(--t-${c[0]}),var(--t-${c[1]}),var(--t-${c[2]}))"></i></div><span class="gtx">${String(p).padStart(3)}%</span></div>`;
  document.querySelectorAll('#desk [data-mem]').forEach(e => e.innerHTML = [meter('Used ', 38, ['green', 'cyan', 'blue']), meter('Avail', 62, ['yellow', 'red', 'red']), meter('Cache', 21, ['blue', 'cyan', 'magenta']), meter('Free ', 41, ['magenta', 'blue', 'cyan']), '', `${S_('dl', 'disks ─────────────────')}`, `/      ${S_('gtx', '212G / 476G')}`, `/home  ${S_('gtx', '212G / 476G')}`].join('\n'));
  document.querySelectorAll('#desk [data-proc]').forEach(e => e.innerHTML = `${S_('c7 b', '  Pid Program         User    Cpu%   MemB')}\n` + PROCS.map((p, i) => { const line = `${p[0].padStart(5)} ${p[1].padEnd(15)} ${p[2].padEnd(7)} ${(p[3] + (Math.random() - .5)).toFixed(1).padStart(5)} ${String(p[4]).padStart(5)}M`; return i === 1 ? `<span class="hl">${line}</span>` : line; }).join('\n'));
}

/* launcher & menu */
const APPS = [['Ghostty', 'Terminal', 'term'], ['Neovim', 'Editor', 'nvim'], ['btop', 'System monitor', 'btop'], ['Chromium', 'Browser', 'term'], ['Files', 'Nautilus', 'term'], ['Spotify', 'Music', 'term'], ['Obsidian', 'Notes', 'term'], ['Signal', 'Messenger', 'term']];
const MENU = [['Apps'], ['Learn'], ['Trigger'], ['Style'], ['Setup'], ['Install'], ['Remove'], ['Update'], ['About'], ['System']];
let pop = null, sel = 0, query = '';
function renderPop() {
  const inner = $('#cardInner');
  const items = pop === 'launcher' ? APPS.filter(a => a[0].toLowerCase().includes(query.toLowerCase())) : MENU.map(m => [m[0], '', null]);
  sel = clamp(sel, 0, Math.max(0, items.length - 1));
  inner.innerHTML = '';
  inner.append(el('div', { class: 'q' }, query ? el('span', { class: 'typed' }, query) : '', el('span', { class: 'caret' }), query ? '' : el('span', { class: 'ph' }, pop === 'launcher' ? 'Search apps…' : 'Go')));
  if (pop === 'menu') inner.append(el('div', { class: 'head' }, 'OMARCHY'));
  items.slice(0, 8).forEach((a, i) => inner.append(el('div', { class: 'it' + (i === sel ? ' on' : ''), onmouseenter: () => { sel = i; renderPop(); }, onclick: () => launch(a) }, a[0], a[1] ? el('span', { class: 'sub2' }, a[1]) : '')));
  pop && (renderPop.items = items);
}
function openPop(kind) { pop = kind; sel = 0; query = ''; $('#scrim').classList.add('on'); renderPop(); }
function closePop() { pop = null; $('#scrim').classList.remove('on'); }
function launch(a) { closePop(); if (a[2]) openWin(a[2], a[2] === 'term' ? 'shell' : null); }
$('#scrim').addEventListener('mousedown', e => { if (e.target.classList.contains('wash')) closePop(); });

function notify() {
  const msgs = [['Theme applied', 'studio is now active.'], ['Screenshot saved', '~/Pictures/screenshot-1306.png'], ['Battery at 20%', 'Plug in soon.'], ['Update available', 'Omarchy 4.1 is ready to install.']];
  const [t, p] = msgs[Math.floor(Math.random() * msgs.length)];
  const n = el('div', { class: 'note' }, el('div', { class: 'inner' }, el('b', {}, t), el('p', {}, p), el('div', { class: 'cd' })));
  $('#notifs').prepend(n); setTimeout(() => n.remove(), 5000);
}
let osdT, vol = 60;
function osd(delta = 5) { vol = clamp(vol + delta, 0, 100); $('#osdv').style.width = vol + '%'; $('#osdn').textContent = vol; $('#osd').classList.add('on'); clearTimeout(osdT); osdT = setTimeout(() => $('#osd').classList.remove('on'), 1400); }
let pwLen = 0;
function lock(on) { $('#lock').classList.toggle('on', on); pwLen = 0; paintPw(); }
function paintPw(err) { const p = $('#pin'); $('#pw').classList.toggle('err', !!err); p.innerHTML = err ? 'Wrong password' : pwLen ? '•'.repeat(pwLen) : '<span class="ph">Enter password</span>'; }

/* focused terminal typing */
function typeInTerm(e) {
  const w = W[FOCUS[cur]]; if (!w || w.type !== 'term') return false;
  const t = w.el.querySelector('.term');
  if (!t.dataset.buf) t.dataset.buf = '';
  const rewrite = () => { const lines = t.innerHTML.split('\n'); lines[lines.length - 1] = promptLine(escapeHtml(t.dataset.buf), true); t.innerHTML = lines.join('\n'); };
  if (e.key === 'Backspace') { t.dataset.buf = t.dataset.buf.slice(0, -1); rewrite(); return true; }
  if (e.key === 'Enter') {
    const cmd = t.dataset.buf.trim(); t.dataset.buf = '';
    const lines = t.innerHTML.split('\n'); lines[lines.length - 1] = promptLine(escapeHtml(cmd));
    let out = '';
    if (cmd === 'clear') { t.innerHTML = promptLine('', true); return true; }
    else if (cmd === 'ls') out = `${S_('c4 b', 'backgrounds')}  colors.toml  hyprland.lua  ${S_('c2 b', 'install.sh')}  shell.bar.toml`;
    else if (cmd === 'colors' || cmd === 'palette') out = blocks(0, 7) + '\n' + blocks(8, 15);
    else if (cmd === 'btop') { openWin('btop'); }
    else if (cmd === 'nvim' || cmd.startsWith('nvim ')) { openWin('nvim'); }
    else if (cmd) out = `${S_('c1', 'bash: ' + escapeHtml(cmd.split(' ')[0]) + ': command not found')}  ${S_('c8', '(try ls, colors, btop, nvim, clear)')}`;
    if (out) lines.push(out);
    lines.push(promptLine('', true));
    t.innerHTML = lines.slice(-60).join('\n'); t.scrollTop = 1e9; return true;
  }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { t.dataset.buf += e.key; rewrite(); return true; }
  return false;
}
const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ACTIONS = { term: () => openWin('term', 'shell'), launcher: () => openPop('launcher'), menu: () => openPop('menu'), close: closeWin, notify, osd: () => osd(5), lock: () => lock(true) };
document.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); ACTIONS[b.dataset.act](); if (b.closest('#desk') || b.classList.contains('tb')) $('#viewport').focus({ preventScroll: true }); }));
document.querySelectorAll('.tb').forEach(b => withInfo(b, b.textContent.replace(/Alt.*/, '').trim(), {
  term: 'Opens a new terminal. In Omarchy this is Super + Return. New windows split the focused one, like Hyprland’s dwindle layout.',
  launcher: 'Opens the app launcher, styled by the [launcher] section of shell.toml. Super + Space in Omarchy.',
  close: 'Closes the focused window. Super + W in Omarchy.', notify: 'Shows a notification, styled by [notifications]. Its border follows the active window border.',
  osd: 'Shows the volume display (OSD).', lock: 'Shows the lock screen. Type anything and press Enter; Escape leaves it.' }[b.dataset.act]));

$('#viewport').addEventListener('keydown', e => {
  if ($('#lock').classList.contains('on')) {
    if (e.key === 'Escape') lock(false);
    else if (e.key === 'Enter') { if (pwLen) { paintPw(true); setTimeout(() => lock(false), 700); } }
    else if (e.key === 'Backspace') { pwLen = Math.max(0, pwLen - 1); paintPw(); }
    else if (e.key.length === 1) { pwLen++; paintPw(); }
    e.preventDefault(); return;
  }
  if (pop) {
    const items = renderPop.items || [];
    if (e.key === 'Escape') closePop();
    else if (e.key === 'ArrowDown') { sel++; renderPop(); }
    else if (e.key === 'ArrowUp') { sel--; renderPop(); }
    else if (e.key === 'Enter') { if (items[sel]) launch(items[sel]); }
    else if (e.key === 'Backspace') { query = query.slice(0, -1); sel = 0; renderPop(); }
    else if (e.key.length === 1 && !e.altKey) { query += e.key; sel = 0; renderPop(); }
    e.preventDefault(); return;
  }
  if (e.altKey) {
    const k = e.key.toLowerCase();
    if (e.key === 'Enter') ACTIONS.term();
    else if (k === ' ' || e.code === 'Space') ACTIONS.launcher();
    else if (k === 'w') closeWin();
    else if (k === 'n') notify();
    else if (k === 'v') osd(5);
    else if (k === 'l') lock(true);
    else if (k === 'j') { const ids = WS[cur]; if (ids.length) { FOCUS[cur] = ids[(ids.indexOf(FOCUS[cur]) + 1) % ids.length]; layout(); } }
    else if (/^digit[1-5]$/i.test(e.code)) switchWs(+e.code.slice(5));
    else return;
    e.preventDefault(); return;
  }
  if (typeInTerm(e)) e.preventDefault();
});
$('#viewport').addEventListener('mousedown', () => $('#viewport').focus({ preventScroll: true }));
