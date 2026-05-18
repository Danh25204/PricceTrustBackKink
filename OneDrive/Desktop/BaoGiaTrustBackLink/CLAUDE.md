# BaoGia TrustBackLink — Project Guide

## Project Overview

Trang web báo giá dịch vụ SEO premium cho shop TrustBackLink. Static HTML/CSS/JS deploy trên GitHub Pages. Không có backend, không có e-commerce — khách xem giá rồi nhắn Telegram `@trustbacklink`.

## GSD Workflow

Dự án này sử dụng GSD (Get Shit Done) workflow. Planning artifacts tại `.planning/`.

### Next Command
```
/gsd:plan-phase 1
```

### Phase Order (strict dependency)
1. **Foundation** — Design tokens, folder structure, `.nojekyll`
2. **HTML Skeleton** — Tất cả pricing content hardcoded, readable không JS/CSS
3. **CSS Styling** — Gold-black luxury layout, featured cards, mobile responsive
4. **Three.js Scene** — Gold particles isolated, mobile fallback
5. **GSAP Animations** — Scroll animations, GSAP owns RAF loop
6. **Polish & Deploy** — OG image, weight audit, GitHub Pages live

## Key Technical Rules

### Critical — Không được vi phạm
- `scene.js` KHÔNG được gọi `requestAnimationFrame` trực tiếp — GSAP ticker owns the loop
- Three.js canvas: `pointer-events: none; position: fixed; z-index: 0` — không block scroll/click
- `rgba(0,0,0,0.65)` dark overlay LUÔN giữa canvas và text
- Tất cả filenames viết **thường** (lowercase) — GitHub Pages case-sensitive
- Tất cả asset paths là **relative** (`./assets/`) không root-relative

### Performance
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`
- Three.js demand-based rendering — chỉ render khi `needsRender = true`
- Particle count: 1000 desktop, 400 mobile
- Three.js tắt hoàn toàn trên mobile (<768px), dùng CSS gradient

### Colors
```css
--gold-bright: #FFD700
--gold-mid:    #C9A227
--black-rich:  #0A0A0A
--black-card:  #111111
--text-primary: #F5F0E8
```

### Telegram
- Username: `@trustbacklink`
- Deeplink pattern: `tg://resolve?domain=trustbacklink` với fallback `https://t.me/trustbacklink`
- Pre-filled message: `?text=Tôi+muốn+mua+gói+[tên gói]`

## Planning Files

| File | Mục đích |
|------|---------|
| `.planning/PROJECT.md` | Project context và decisions |
| `.planning/REQUIREMENTS.md` | 54 v1 requirements với REQ-IDs |
| `.planning/ROADMAP.md` | 6 phases, success criteria |
| `.planning/STATE.md` | Current progress |
| `.planning/research/SUMMARY.md` | Research findings tóm tắt |

## Pricing Data (Mẫu — cần cập nhật bởi shop owner)

**Backlink:** 10/500K | 30/1.2M ⭐ | 50/1.8M | 100/3M
**Blog Comment:** 30/300K | 100/800K ⭐ | 200/1.4M | 500/3M
**Entity:** Basic/2M | Standard/4M ⭐ | Premium/7M

⭐ = "Nổi Bật" featured package
