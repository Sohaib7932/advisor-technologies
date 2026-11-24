# Baseline (before perf/responsive)

Production build (`next build && next start`), branch point `ba82237`.
Raw numbers: `docs/perf/baseline.json`. Screenshots: `docs/responsive/baseline/`
(git-ignored PNGs; re-create with `npm run responsive:check -- --shots docs/responsive/baseline`).

## Lighthouse (mobile preset: simulated Slow 4G, 4x CPU)

| Route | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS KB | Img KB |
|---|---|---|---|---|---|---|---|---|---|
| / | 62 | 96 | 100 | 100 | 5.1 s | 0 | 579 ms | 253 | 116 |
| /about | 57 | 96 | 100 | 100 | 4.4 s | 0 | 1315 ms | 253 | 44 |
| /services | 52 | 100 | 100 | 100 | 4.8 s | 0 | 2061 ms | 253 | 136 |
| /products | 52 | 96 | 100 | 100 | 4.6 s | 0 | 3319 ms | 253 | 82 |
| /clients | 54 | 100 | 100 | 100 | 4.6 s | 0 | 1808 ms | 253 | 141 |
| /contact | 61 | 100 | 100 | 100 | 4.2 s | 0 | 1064 ms | 690 | 47 |

INP is not measured by Lighthouse navigation runs; the CPU traces below
cover interaction cost.

## Largest client chunks (gzip)

| Chunk | gzip | Contents |
|---|---|---|
| 0i-5efvfrwjiv | 98 KB | three.js + hero scene (lazy, home only) |
| 3h7376keuan4x | 83 KB | three.js for the dev-only /dev/render route |
| 3kmozkq6tgqnz | 69 KB | react-dom / Next runtime |
| 1z99mlp5cofct | 45 KB | Next runtime |
| 2suzfeygqwsat | 43 KB | GSAP + ScrollTrigger + app components |
| 0cz1d0mv5g_q7 | 38 KB | framework |
| 3avzmku3tjtfp | 15 KB | home sections (client) |
| 0_3ynov27xo50 | 11 KB | Lenis + layout |
| 2h9e1zeunmjcn | 13 KB | shared UI (client) |
| 0-ps_yplcznug | 9 KB | client logos / cards |

## CPU traces (Playwright + CDP, 390x844, 4x CPU)

| Route | Long tasks on load (total / max) | Long tasks while scrolling | Dropped frames (>34 ms) | CLS |
|---|---|---|---|---|
| / | 10 (2083 ms / 420 ms) | 0 | 8 / 358 | 0 |
| /about | 6 (1102 / 289) | 0 | 2 / 288 | 0 |
| /services | 8 (1183 / 284) | 0 | 0 / 338 | 0 |
| /products | 5 (1139 / 523) | 0 | 0 / 303 | 0 |
| /clients | 7 (1024 / 265) | 0 | 0 / 280 | 0 |
| /contact | 9 (1602 / 282) | 0 | 0 / 212 | 0 |

Top self time: GSAP/ScrollTrigger setup and refresh (470-1244 ms), forced
layout inside `scrollTo` (190-730 ms), module evaluation (230-290 ms),
Lenis (up to 677 ms on /clients), Google Maps (330 ms on /contact).

## Diagnosis

1. **LCP waits for JavaScript.** The hero and every page banner start
   clipped (`data-reveal="pending"`: panel clip-path, headline masks at
   110%) until hydration runs the intro timeline, so the largest text paints
   only after ~4-5 s of throttled JS. On phones the hero poster is also
   hidden (`motion-hide`) until JS.
2. **Main-thread work at startup.** Every `Reveal` and every `Button` is its
   own client component (45 Reveal instances on /clients, magnetic GSAP
   setup per button), so hydration is heavy; `SmoothScroll` calls
   `window.scrollTo(0,0)` and a full `ScrollTrigger.refresh()` on first
   mount (forced layout), and CardDeck measures every card on mount.
3. **Third party on /contact.** The Google Maps iframe loads ~440 KB of
   JS on page load even though it sits far below the fold.
4. **Responsive failures (2,832 across 112 page/width combinations).**
   Labels, chips and counters render at 9-12 px (worse on phones, where the
   root font is 15 px), many links are 18-20 px tall (footer, breadcrumb,
   text links) and a few elements reach past the viewport edge.
5. **Animation cost is small once loaded.** No long tasks while scrolling
   and 0-2 % dropped frames. Remaining smells: `box-shadow` transitions on
   cards and buttons, a permanent `will-change` on every 3D image, the hero
   loop allocating vectors per frame, and the product deck and marquees
   running while offscreen or when the tab is hidden.
