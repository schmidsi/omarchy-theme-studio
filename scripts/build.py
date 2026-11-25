#!/usr/bin/env python3
"""Inline src/ into a single self-contained dist/index.html (used for the published artifact)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DIST = ROOT / 'src', ROOT / 'dist'

html = (SRC / 'index.html').read_text()
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
              lambda m: '<style>\n' + (SRC / m.group(1)).read_text() + '</style>', html)
html = re.sub(r'<script src="(js/[^"]+)"></script>',
              lambda m: '<script>\n' + (SRC / m.group(1)).read_text() + '</script>', html)
DIST.mkdir(exist_ok=True)
(DIST / 'index.html').write_text(html)
print(f'dist/index.html  {len(html) // 1024} KB')
