---
plan: 05-02
status: complete
completed_at: "2026-05-20"
tasks_completed: 2
files_modified:
  - assets/js/animations.js
  - assets/js/main.js
---

# Summary: Plan 05-02 — ScrollTrigger Animations

## What Was Done

Implemented in single atomic commit with 05-01. `animations.js` written with `initScrollAnimations()` covering:
- ANIM-02: `.service-card` stagger fade-in from y:40, trigger `#services top 80%`, `once: true`
- ANIM-03: `.pricing-card` stagger fade-in + scale:0.97, trigger `top 85%`, `once: true`
- ANIM-04: `#contact` scale 0.95→1 + fade, trigger `top 80%`, `once: true`
- ANIM-05: `#cta-float` slides in from x:80, delay:3 (time-based, not ScrollTrigger)
- `main.js` updated with import and `initScrollAnimations()` call inside bootstrap

## Acceptance Criteria Verified

- ✓ `animations.js` exports `initScrollAnimations`
- ✓ `once: true` on all ScrollTrigger animations (ANIM-06)
- ✓ `#cta-float` with `delay: 3`
- ✓ `scale: 0.97` on pricing cards
- ✓ `stagger:` on both `.service-card` and `.pricing-card`
- ✓ No `requestAnimationFrame` in file
- ✓ No `import gsap` or `import ScrollTrigger`
- ✓ `main.js` contains `import { initScrollAnimations } from './animations.js'`
- ✓ `initScrollAnimations()` called inside bootstrap
- ✓ `gsap.ticker.add(render)` and hero tween still present
