/* ---------------- boot ---------------- */
$('#themeName').value = S.name;
$('#themeName').addEventListener('input', e => { S.name = e.target.value; $('#meta').textContent = `${S.name} · ${dims().join('×')} · ${S.colors.mode}`; save(); });
withInfo($('#themeName'), 'Theme name', 'Folder name under ~/.config/omarchy/themes/ and the name you pass to omarchy theme set.', '~/.config/omarchy/themes/<name>');
buildPresets();
buildPanel();
openWin('term', 'fetch', 1); openWin('nvim', null, 1); openWin('term', 'ls', 1);
openWin('btop', null, 2); openWin('term', 'shell', 2);
FOCUS[1] = WS[1][1]; cur = 1;
apply(); tick(); btopTick();
setInterval(tick, 10000); setInterval(btopTick, 1000);
