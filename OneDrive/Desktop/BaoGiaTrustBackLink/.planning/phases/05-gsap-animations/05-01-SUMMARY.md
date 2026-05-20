---
plan: 05-01
status: complete
completed_at: "2026-05-20"
tasks_completed: 2
files_modified:
  - index.html
  - assets/js/main.js
  - assets/js/animations.js
---

# Summary: Plan 05-01 — GSAP Integration, Ticker Wiring + Hero Animation

## What Was Done

- Removed temporary `requestAnimationFrame` loop from `index.html`
- Added GSAP 3.12.5 + ScrollTrigger CDN `<script>` tags before `</body>`
- Replaced inline `<script type="module">` block with external `<script type="module" src="./assets/js/main.js">`
- Wrote `assets/js/main.js`: imports scene.js, registers ScrollTrigger plugin, wires `gsap.ticker.add(render)`, runs hero animation
- Wrote `assets/js/animations.js`: exports `initScrollAnimations()` with all ScrollTrigger entrance tweens
- Integrated Plans 05-02 and 05-03 inline: scroll animations + reduced-motion guard all in one atomic commit

## Acceptance Criteria Verified

- ✓ `index.html` contains GSAP + ScrollTrigger CDN script tags
- ✓ `index.html` contains `<script type="module" src="./assets/js/main.js">`
- ✓ No `requestAnimationFrame` in `index.html`
- ✓ `main.js` contains `gsap.registerPlugin(ScrollTrigger)`
- ✓ `main.js` contains `gsap.ticker.add(render)`
- ✓ `main.js` contains hero `gsap.from('.hero__tagline, .brand-logo, .brand-name', { y: 30, opacity: 0, ... })`
- ✓ No `repeat: -1` or `yoyo` in hero tween
- ✓ `document.readyState` guard present
- ✓ `animations.js` exports `initScrollAnimations`
- ✓ All ScrollTrigger animations use `once: true`
- ✓ `#cta-float` uses `delay: 3` time-based entrance
- ✓ `prefersReducedMotion` guard wraps hero tween and `initScrollAnimations()`
- ✓ `gsap.ticker.add(render)` is outside the reduced-motion guard
