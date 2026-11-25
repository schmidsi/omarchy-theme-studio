# Omarchy Theme Studio

A browser-based theme designer for [Omarchy](https://omarchy.org). The panel on the left edits
colors, fonts, gaps, borders, rounding, the bar and the shell; the right side is a mocked Omarchy
desktop (Hyprland dwindle layout, bar, launcher, menu, notifications, OSD, lock screen) that
renders the theme live. Export produces the files Omarchy reads (`colors.toml`, `hyprland.lua`,
`shell.*.toml`) plus an `install.sh` that installs and applies the theme.

## Run

No build step and no dependencies. Open `src/index.html` in a browser.

Keys in the preview: click the desktop, then Alt stands in for Super
(Alt Enter terminal, Alt Space launcher, Alt W close, Alt 1–5 workspaces, Alt J cycle focus).

## Layout

```
src/
  index.html        markup
  css/panel.css     settings panel (the black-and-white UI)
  css/desktop.css   mocked desktop, driven by --t-* (colors.toml) and --h-* (hyprland/shell) variables
  js/themes.js      stock theme colors (generated)
  js/color.js       color math, mirrors omarchy-theme-color derivation rules
  js/state.js       presets, fonts, persisted state
  js/controls.js    panel controls (drag number boxes, segments, color rows) and panel layout
  js/desktop.js     windows, dwindle layout, bar, launcher, menu, notifications, OSD, lock
  js/render.js      wallpaper and applying state to the preview
  js/export.js      export/import of theme files and install.sh
  js/main.js        boot
scripts/
  build.py          inlines src/ into one dist/index.html (for single-file hosting)
  extract-themes.py regenerates js/themes.js from /usr/share/omarchy/themes
```

Scripts are plain (non-module) scripts loaded in order and share globals, so the page also works from `file://`.

## Scripts

```sh
python3 scripts/extract-themes.py   # after an Omarchy update that changes stock themes
python3 scripts/build.py            # writes dist/index.html
```
