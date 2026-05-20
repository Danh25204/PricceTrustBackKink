---
plan: 05-03
status: complete
completed_at: "2026-05-20"
tasks_completed: 1
files_modified:
  - assets/js/main.js
---

# Summary: Plan 05-03 — Reduced-Motion Handling

## What Was Done

Implemented in single atomic commit with 05-01/05-02. In `main.js`:
- `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Hero `gsap.from(...)` and `initScrollAnimations()` wrapped inside `if (!prefersReducedMotion)`
- `gsap.ticker.add(render)` remains outside the guard — Three.js particles unaffected
- No `gsap.globalTimeline.timeScale(0)` used

## Acceptance Criteria Verified

- ✓ `window.matchMedia('(prefers-reduced-motion: reduce)').matches` present
- ✓ Hero tween and `initScrollAnimations()` inside `if (!prefersReducedMotion)` block
- ✓ `gsap.ticker.add(render)` NOT inside the guard
- ✓ No `gsap.globalTimeline.timeScale` in file
- ✓ `animations.js` unchanged by this plan
