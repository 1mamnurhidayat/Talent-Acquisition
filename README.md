# Talent Acquisition Website - Mobile + Bilingual Q&A

The complete static website; upload all files together to the same directory.

- `index.html`: English homepage.
- `indonesia.html`: Indonesian homepage.
- `qa-en.html`: English Q&A, with 50 translated questions and English answers.
- `qa.html`: Indonesian Q&A, with 50 full original answers and source tables.
- `style.css`, `qa.css`, `script.js`, `qa.js`: responsive styling, mobile navigation, animations and Q&A search/filter.

The Q&A teaser cards scroll gently under Skills & Capabilities / Keahlian dan Kompetensi on both homepages. Animation pauses on hover or keyboard focus. For reduced-motion users it becomes a manually scrollable row.

Use the English/Indonesian language controls or top-level menu; each Q&A link points to the page in the active language. On narrow screens the primary navigation collapses to a mobile menu, content cards fit within the viewport, and Q&A motion is clipped to its own section.

Open via a local static server for best testing (e.g., `python -m http.server 8000`). Hosting and real-device validation remain separate steps.


## Mobile fix v4
- Menu dan section pada lebar 320–430 px diatur ulang.
- Q&A carousel bergerak menggunakan requestAnimationFrame (33 px/detik), bukan scroll snap.
- Geser manual via touch / pointer drag, dukungan keyboard panah, dan klik kartu.
- Respect prefers-reduced-motion.


Mobile v6: header dan footer pada keempat halaman dibekukan (fixed) saat scroll, dengan ruang konten otomatis menyesuaikan tinggi elemen dan safe-area smartphone.

## v7: mobile viewport fit + frozen header/footer
- Added `mobile-fix.css` as the last stylesheet for all five HTML pages, eliminating conflicts from older mobile styles.
- Header and footer remain `position:fixed` in mobile view; content gets matching top/bottom padding with measured heights.
- Removed overflowing decorative glows on narrow screens, which previously expanded the visual layout width.
- Preserved English/Indonesian home pages, both Q&A pages, search, and animated draggable Q&A cards.
- Chromium layout check at 320 px and 375 px: viewport and document width match, fixed header top = 0, fixed footer bottom = viewport height after scrolling up/down. For real-device verification, check browser toolbar behavior and cache invalidation after deployment.
