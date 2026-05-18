# Research Summary: BaoGia TrustBackLink

**Project:** BaoGia TrustBackLink
**Domain:** Vietnamese SEO services pricing page (static, no e-commerce)
**Researched:** 2026-05-18
**Confidence:** HIGH (stack, architecture, pitfalls) / MEDIUM (Vietnamese market specifics)

---

## Executive Summary

BaoGia TrustBackLink là single-page static pricing display cho 3 dịch vụ SEO (Backlink, Blog Comment, Entity), targeting Vietnamese small business owners và affiliate marketers. Sales hoàn toàn qua Telegram — trang chỉ cần hiển thị giá rõ ràng, signal premium quality, và funnel visitors vào Telegram.

Tech approach đúng: zero-build vanilla HTML/CSS/JS deploy thẳng lên GitHub Pages, với Three.js (gold particle field) và GSAP ScrollTrigger làm animation layer thêm lên trên layout tĩnh đã functional.

**Build order bắt buộc:** design tokens → HTML skeleton → layout/CSS → Three.js isolation → GSAP integration. Animation layer là component rủi ro cao nhất và phải được build trên trang đã hoạt động — không build first.

---

## Recommended Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| HTML | Vanilla HTML5 | — | Zero build tooling, direct GitHub Pages deploy |
| CSS | Custom CSS (no framework) | — | Full control gold-black palette; Tailwind cần build step |
| CSS variables | CSS custom properties | — | Token-based theming (`--gold`, `--black`, `--glow`) |
| 3D background | Three.js | r169 (0.169.x) | Self-hosted ~150 KB gzip; Spline rejected (2.5 MB + watermark) |
| Animation | GSAP core + ScrollTrigger | 3.12.x | Industry standard; ScrollTrigger free từ 2023 |
| Icons | Lucide SVG sprite | 0.400.x | Zero JS runtime |
| Fonts | Playfair Display + Be Vietnam Pro | — | Luxury serif có Vietnamese glyphs + legible body |
| Build tooling | None | — | Raw files push to `gh-pages` |
| Deployment | GitHub Pages | — | Free, static assets |

**KHÔNG dùng:** React/Vue/Svelte, Tailwind, Bootstrap, Spline free tier, jQuery, AOS, GSAP paid plugins.

---

## Table Stakes Features

| Feature | Tại sao bắt buộc |
|---------|-----------------|
| Pricing cards (tên, giá, số lượng) | Lý do trang tồn tại |
| Mô tả 2–3 dòng mỗi dịch vụ | Nhiều buyer không biết "Entity SEO" là gì |
| Telegram CTA trên mỗi card | Không CTA = dead end |
| Giải thích Entity SEO (2 câu) | Bắt buộc cho conversion |
| 1 "Nổi Bật" card per service | Decoy pricing, giảm decision paralysis |
| Sticky floating Telegram button | 40–60% mobile không scroll đủ |
| Logo + brand name | Trust signal — page được forward như business card |
| Mobile-responsive | Majority Việt Nam dùng mobile (Xiaomi, OPPO, Samsung A-series trên 4G) |
| @username Telegram ở header/footer | Không chỉ trong CTA buttons |
| Pricing content load <1 giây | Bất kể Three.js load state |

**Defer post-MVP:** Three.js scene, GSAP animations, social proof numbers, CSS hover polish.

---

## Key Architecture Decisions

1. **Pricing data trong HTML** — hardcoded `<span class="price">`. Editable không cần touch JS. SEO-indexable.

2. **GSAP owns RAF loop; Three.js renders bên trong** — `gsap.ticker.add(() => renderer.render(scene, camera))`. `scene.js` KHÔNG gọi `requestAnimationFrame` trực tiếp.

3. **Three.js là isolated module** — export `init()`, `resize()`, refs. Không own DOM, scroll, hoặc GSAP.

4. **Canvas luôn `z-index: 0; pointer-events: none`** — `rgba(0,0,0,0.65)` dark overlay giữa canvas và text. Content luôn `z-index: 1`.

5. **Tất cả paths relative, filenames lowercase** — GitHub Pages = Linux filesystem (case-sensitive). `.nojekyll` bắt buộc.

6. **Mobile performance là first-class constraint** — `setPixelRatio(Math.min(devicePixelRatio, 1.5))`, 400 particles mobile vs 1000 desktop, demand-based rendering.

---

## Critical Pitfalls to Avoid

| # | Pitfall | Prevention |
|---|---------|------------|
| 1 | Unconditional Three.js RAF loop → thermal throttle trên Android | Demand-based: chỉ render khi `needsRender = true` |
| 2 | Không WebGL fallback → black rectangle cho 3–8% users | Detect WebGL trước init; canvas có CSS gradient fallback |
| 3 | Three.js load trước khi pricing visible | Pricing HTML render tại DOMContentLoaded; Three.js async, không gate content |
| 4 | Uppercase paths / absolute paths → 404 trên GitHub Pages | Lowercase tất cả; `./assets/` relative paths only; `.nojekyll` |
| 5 | Intro animation block content 3–5s | Cards bắt đầu từ 70% opacity (không 0%); canvas luôn là background |

---

## Build Order

```
Layer 1  Design tokens          base.css CSS variables
Layer 2  HTML skeleton          5 sections, pricing hardcoded, readable không JS
Layer 3a Layout + component CSS  Parallel với 3b — MVP shippable tại đây
Layer 3b Tab switching UI        Parallel với 3a — zero Three.js/GSAP dependency
Layer 4  Three.js scene          Isolated, tested standalone trước khi connect GSAP
Layer 5  GSAP integration        Connects tới Layer 4 qua ticker
Layer 6  Polish & deployment     Lighthouse audit, Telegram testing, GitHub Pages verify
```

---

## Open Questions Before Build Starts

| # | Câu hỏi | Tại sao blocking |
|---|---------|-----------------|
| 1 | Telegram username là gì? | Tất cả CTA links phụ thuộc vào đây |
| 2 | Tiers, tên gói, giá, số lượng cho 3 dịch vụ? | Pricing cards không thể viết thiếu thông tin này |
| 3 | Gói nào "Nổi Bật" per service? | Determines gold border + glow treatment |
| 4 | Social proof number thật? | Fake numbers destroy trust với Vietnamese SEO buyers |
| 5 | Logo asset đã có chưa? | Affects hero và header layout |
| 6 | GitHub Pages URL là sub-path hay custom domain? | Relative vs root-relative path strategy |
| 7 | Three.js: floating particles hay complex mesh? | Affects Layer 4 scope và mobile performance budget |

---

*Research completed: 2026-05-18 | Ready for roadmap: YES*
