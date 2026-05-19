---
plan: 02-03
phase: 02-html-skeleton
status: complete
completed_at: "2026-05-19T14:00:00Z"
duration_minutes: 5
tasks_completed: 2
files_modified:
  - index.html
requirements_delivered:
  - BL-01
  - BL-02
  - BL-03
  - BL-04
  - BC-01
  - BC-02
  - BC-03
  - BC-04
  - DATA-01
  - DATA-02
  - CTA-03
  - CTA-04
---

# Plan 02-03 Summary — Backlink + Blog Comment Pricing Sections

## What Was Built

**Backlink SEO section** (`<section id="backlink" class="pricing">`): 4 pricing cards:
- Starter: 500K, 50K/link, 10 backlinks, DA 20–40, 60% do-follow, 7 ngày
- Standard (featured): 1.2M, 40K/link, 30 backlinks, DA 30–60, 70% do-follow, 10 ngày — `class="pricing-card pricing-card--featured"` + `<span class="badge-featured">Nổi Bật</span>`
- Pro: 1.8M, 36K/link, 50 backlinks, DA 40–70, 75% do-follow, 14 ngày
- Enterprise: 3M, 30K/link, 100 backlinks, DA 50–80, 80% do-follow, 21 ngày

**Blog Comment section** (`<section id="blog-comment" class="pricing">`): 4 pricing cards:
- Starter: 300K, 10K/bình luận, 30 bình luận, >80% phê duyệt, 5 ngày
- Standard (featured): 800K, 8K/bình luận, 100 bình luận, >85%, 10 ngày
- Pro: 1.4M, 7K/bình luận, 200 bình luận, >90%, 14 ngày
- Enterprise: 3M, 6K/bình luận, 500 bình luận, >90%, 21 ngày

All 8 CTA buttons use `tg://resolve?domain=trustbacklink&text=...` with percent-encoded Vietnamese text and `data-fallback` to `https://t.me/trustbacklink`. `<main>` left open for plan 02-04.

## Verification

All 33 automated checks passed. Total `pricing-card--featured` in document: 2. Total `badge-featured`: 2.
