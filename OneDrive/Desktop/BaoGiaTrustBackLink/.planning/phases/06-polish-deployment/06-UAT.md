---
status: complete
phase: 06-polish-deployment
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md
started: 2026-05-20T00:00:00Z
updated: 2026-05-20T00:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. OG Image File
expected: Open assets/og-image.jpg directly in a browser or file explorer. The image is 1200×630px, gold-black branded, shows "TrustBackLink" name, a tagline, services, and @trustbacklink handle. File size ~60 KB.
result: pass

### 2. Open Graph Meta Tags
expected: Open index.html in browser → DevTools → Elements → <head>. Tags og:type, og:locale, og:title, og:description, og:image, og:image:width (1200), og:image:height (630), og:url are all present.
result: pass

### 3. Twitter Card Meta Tags
expected: Same DevTools <head> view. Tags twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image are all present.
result: pass

### 4. Pricing Card CTA → Telegram
expected: Click any "Đặt ngay" button on a pricing card. Telegram app opens (or t.me web opens) pointing to @trustbacklink with a pre-filled message like "Tôi muốn mua gói [package name]". All 11 pricing cards should behave this way.
result: issue
reported: "nút có hoạt động nhưng không có tin nhắn soạn sẵn"
severity: major

### 5. Hero / Contact / Floating CTAs → Telegram
expected: Click the hero CTA button, the contact section CTA, and the floating CTA button. Each opens Telegram to @trustbacklink. No broken links or blank targets.
result: pass

### 6. Page Weight — Fast Load
expected: Open DevTools → Network tab → hard-refresh. Total transferred for local assets (HTML + CSS + JS + OG image) is well under 800 KB. Page feels fast to load.
result: pass

## Summary

total: 6
passed: 5
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Click 'Đặt ngay' opens Telegram with pre-filled message 'Tôi muốn mua gói [name]'"
  status: failed
  reason: "User reported: nút có hoạt động nhưng không có tin nhắn soạn sẵn"
  severity: major
  test: 4
  root_cause: "tg://resolve?domain=...&text=... does not pass text param to Telegram app. data-fallback has correct https://t.me/?text= URL but no JS handler uses it."
  artifacts:
    - path: "index.html"
      issue: "All 11 btn-cta hrefs use tg:// scheme which drops &text= param"
  missing:
    - "Change btn-cta hrefs to https://t.me/trustbacklink?text=... (keeps tg:// only for non-card CTAs)"
  debug_session: ""
