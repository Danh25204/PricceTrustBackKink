---
plan: 02-04
phase: 02-html-skeleton
status: complete
completed_at: "2026-05-19T14:00:00Z"
duration_minutes: 5
tasks_completed: 1
files_modified:
  - index.html
requirements_delivered:
  - EN-01
  - EN-02
  - EN-03
  - EN-04
  - CTA-01
  - CTA-02
  - CTA-03
  - CTA-04
  - DATA-03
---

# Plan 02-04 Summary — Entity SEO, Contact Section, Close Main

## What Was Built

**Entity SEO section** (`<section id="entity" class="pricing">`): 3 pricing cards:
- Basic: 2M, scope "Gói cơ bản", 10 entities, Wikipedia/Wikidata, 14 ngày
- Standard (featured): 4M, scope "Phổ biến nhất", 25 entities, Google Knowledge/Bing, 21 ngày — `class="pricing-card pricing-card--featured"` + `<span class="badge-featured">Nổi Bật</span>`
- Premium: 7M, scope "Gói cao cấp", 50 entities, Forbes/Crunchbase, 30 ngày

**Contact section** (`<section id="contact" class="contact">`):
- `<h2>Liên hệ đặt hàng</h2>` heading
- Body copy: "Bạn đã chọn được gói phù hợp? Nhắn tin ngay để được tư vấn và xác nhận đơn hàng."
- `<a class="btn-cta btn-cta--large">` linking to generic `tg://resolve?domain=trustbacklink` (no pre-fill)
- `<p class="contact__note">Phản hồi trong vòng 5–30 phút trong giờ làm việc.</p>`

**Closed `<main>`** with `</main>`. Footer and `#cta-float` from plan 02-01 confirmed intact — not duplicated.

## Document Structure (final)

`<header>` → `<section#hero>` → `<main>` [services + backlink + blog-comment + entity + contact] `</main>` → `<footer>` → `<a#cta-float>`

## Verification

All 89 total checks across all 4 plans passed:
- 11 pricing cards total (4 BL + 4 BC + 3 EN)
- 3 `pricing-card--featured` (BL Standard, BC Standard, EN Standard)
- 3 `badge-featured` spans
- No duplicate footer or cta-float
- `</main>` present and closed
