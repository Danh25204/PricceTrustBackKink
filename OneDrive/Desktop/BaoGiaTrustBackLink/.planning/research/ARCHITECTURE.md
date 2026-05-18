# Architecture Research: SEO Pricing Page

**Project:** BaoGia TrustBackLink
**Researched:** 2026-05-18
**Confidence:** HIGH (structural patterns, Three.js/GSAP integration, GitHub Pages)

---

## File Structure

```
BaoGiaTrustBackLink/
├── index.html                  # Single entry point — tất cả sections ở đây
├── assets/
│   ├── css/
│   │   ├── base.css            # CSS variables (colors, fonts, spacing, z-index), reset
│   │   ├── layout.css          # Section containers, grid, responsive breakpoints
│   │   ├── components.css      # Pricing cards, badges, buttons, tab UI
│   │   └── animations.css      # CSS-only hover states, featured card glow keyframe
│   ├── js/
│   │   ├── scene.js            # Three.js canvas scene — isolated module
│   │   ├── animations.js       # GSAP + ScrollTrigger timeline registrations
│   │   ├── ui.js               # DOM interactions: tab switching
│   │   └── main.js             # Boot sequence — import và init tất cả modules
│   ├── fonts/
│   │   └── [woff2 files]       # Self-hosted fonts
│   └── images/
│       ├── logo.svg            # TrustBackLink logo (SVG: scale hoàn hảo, file nhỏ)
│       └── og-image.jpg        # Open Graph preview cho Telegram link sharing
├── .nojekyll                   # BẮT BUỘC: ngăn GitHub Pages chạy Jekyll
└── README.md
```

**Tại sao tách 4 JS files:**
- `scene.js` có thể disable trên low-end devices mà không ảnh hưởng animation code
- `animations.js` tune độc lập trong performance work
- `ui.js` zero dependency với Three.js hoặc GSAP — pure DOM manipulation
- `main.js` là orchestrator duy nhất kiểm soát thứ tự execution

---

## Page Sections

Single `index.html` với semantic `<section>`. **Mỗi section phải readable hoàn toàn với zero JavaScript** — JS chỉ thêm motion lên trên static HTML.

| # | Section ID | Mục đích | Elements chính |
|---|-----------|----------|----------------|
| 1 | `#hero` | First impression, brand statement | Logo, tagline `<h1>`, CTA Telegram, Three.js canvas behind |
| 2 | `#services` | Giải thích dịch vụ trước khi show giá | 3 `<article>`: Backlink, Blog Comment, Entity — mô tả ngắn |
| 3 | `#pricing` | Core purpose — so sánh và lựa chọn | Tab UI per service, pricing card grids, 1 featured card |
| 4 | `#contact` | Convert — đưa khách đến Telegram | Large Telegram CTA, trust signals |
| 5 | `#footer` | Close | Brand name, copyright, Telegram link |

### Component Detail

**Hero (`#hero`)**
- `<canvas id="bg-canvas">` tại `position: fixed; z-index: 0`
- Hero content div tại `z-index: 1`
- Logo: `<img src="assets/images/logo.svg">` — load synchronous, không lazy
- CTA: `<a href="https://t.me/..." target="_blank" rel="noopener">` — anchor, không button

**Pricing (`#pricing`)**
- Tab nav: `<div class="pricing-tabs">` với 3 tab buttons
- Featured card: `class="pricing-card pricing-card--featured"` — CSS handle gold border và scale
- Giá: hardcoded `<span class="price">` trong HTML — không JS, không data file
- CTA per card: Telegram link với pre-filled message (`?text=Tôi+muốn+mua+gói+X`)
- Tab switching: `ui.js` add/remove `active` class

---

## Animation Architecture

### Vấn đề tích hợp cốt lõi

Three.js chạy `requestAnimationFrame` loop. GSAP cũng dùng RAF cho ticker của nó. Hai RAF loops độc lập = lãng phí CPU và frame timing conflicts trên mobile.

**Giải pháp: GSAP sở hữu RAF loop, Three.js render bên trong GSAP ticker.**

### Boot Sequence trong `main.js`

```
1. DOMContentLoaded fires
2. main.js gọi scene.init()      → Three.js scene tạo, KHÔNG start RAF loop
3. main.js gọi animations.init() → GSAP registered, ScrollTrigger attach vào DOM
4. main.js register Three.js với GSAP ticker:
       gsap.ticker.add(() => { renderer.render(scene, camera) })
```

**Một RAF loop duy nhất.** GSAP owns time; Three.js renders bên trong nó.

### scene.js Contract

- Tạo `WebGLRenderer`, `Scene`, `PerspectiveCamera`, geometry, materials
- Export `init()`, `resize(w, h)`, refs tới `renderer`/`scene`/`camera`
- **KHÔNG gọi** `renderer.setAnimationLoop()` hoặc `requestAnimationFrame`
- Xử lý `window.resize`: gọi `renderer.setSize()`, cập nhật `camera.aspect`

**Mobile detection khi init:**
```javascript
const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency !== undefined
                 && navigator.hardwareConcurrency <= 2;
if (isMobile || isLowEnd) {
  PARTICLE_COUNT = 400;       // vs 1000 desktop
  renderer.setPixelRatio(1);  // vs Math.min(devicePixelRatio, 2)
}
```

### Three.js Scene Content

**Particle field (khuyến nghị):** 800–1200 `BufferGeometry` points màu vàng (`#FFD700`), drifting chậm với sin wave hoặc noise function. Render được trên mọi thiết bị, full control over particle count.

### GSAP Animation Catalog

| Target | Animation | Trigger |
|--------|-----------|---------|
| `#hero .hero-content` | Fade-in + translateY(30px → 0) | Page load (immediate) |
| `.service-card` (×3) | Stagger fade-in from bottom | ScrollTrigger, viewport enter |
| `.pricing-card` (all) | Stagger fade-in + subtle scale | ScrollTrigger, viewport enter |
| `.pricing-card--featured` | Gold glow pulse | CSS keyframe (always-on) |
| `#contact .cta-block` | Scale 0.95 → 1.0 | ScrollTrigger, viewport enter |
| Floating Telegram button | Slide in từ right edge | 3s delay sau load |

**Quy tắc quan trọng:** Hover effects trên `.pricing-card` là **CSS only** (`transform: translateY(-4px)`, `box-shadow` change) — CSS hover fires trên compositor thread, mượt hơn GSAP mouseover trên mobile.

### Script Loading Order

```html
<!-- Cuối <body>, tất cả defer -->
<script src="assets/js/vendor/three.min.js" defer></script>
<script src="assets/js/vendor/gsap.min.js" defer></script>
<script src="assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/js/scene.js" defer></script>
<script src="assets/js/animations.js" defer></script>
<script src="assets/js/ui.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

`defer` giữ thứ tự script và không block HTML parsing. Trang readable hoàn toàn trước khi JS execute.

---

## Performance Strategy

**Vietnam mobile context:** Mid-range Android (Xiaomi, OPPO, Samsung A-series) trên 4G LTE.

### Size Budgets

| Resource | Budget | Notes |
|----------|--------|-------|
| HTML | < 50 KB | Full content, all pricing data inline |
| CSS total | < 30 KB | Không unused rules |
| GSAP (self-hosted) | ~70 KB gzip | Cached sau first visit |
| Three.js (self-hosted) | ~150 KB gzip | Cached sau first visit |
| Custom JS | < 10 KB | 4 files combined |
| Fonts | < 50 KB | 1–2 weights, woff2 only |
| Images | < 100 KB | Logo SVG + OG image |
| **Total first load** | **< 500 KB** | Target < 350 KB |

### Mobile Rules

1. Detect và reduce Three.js complexity trước first render
2. `will-change: transform` chỉ trên elements đang animate — không global
3. `font-display: swap` trên tất cả custom fonts
4. Tất cả CSS animations chỉ dùng `transform` và `opacity`
5. `ScrollTrigger` với `pin: false`
6. Reduced motion support:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### GitHub Pages Gotchas

- **`.nojekyll` là bắt buộc** — không có file này, GitHub Pages chạy Jekyll và ignore files bắt đầu bằng `_`
- **Paths phải relative** (`assets/css/base.css`) không phải root-relative (`/assets/css/base.css`) — trừ khi deploy tới custom domain tại root
- Không hỗ trợ server-side redirect — không cần cho single HTML page

---

## Build Order

```
Layer 1 — Design tokens (không có dependency)
  base.css: CSS custom properties (--gold, --black, --surface, typography scale)
  → Tất cả CSS files khác reference variables này

Layer 2 — HTML skeleton (cần Layer 1)
  index.html: 5 sections, real Vietnamese copy, all pricing data hardcoded
  → Phải readable trong browser với zero CSS (semantic HTML baseline)

Layer 3a — Layout & Component CSS (cần Layer 1, 2) — PARALLEL với 3b
  layout.css, components.css, animations.css
  → Trang phải usable và complete tại điểm này

Layer 3b — ui.js tab switching (cần Layer 2) — PARALLEL với 3a
  Đơn giản classList manipulation cho pricing tabs
  → Zero dependency với Three.js hoặc GSAP

Layer 4 — Three.js scene (cần Layer 1, 2, 3a)
  scene.js: Particle field, mobile detection, resize handler
  → Test isolation: canvas render, resize, mobile reduction fires
  → KHÔNG cần GSAP tại điểm này

Layer 5 — GSAP animations (cần Layer 2, 3a, 4)
  animations.js + main.js: ScrollTrigger registrations, GSAP ticker drives renderer
  → GSAP ticker gọi Three.js render — CRITICAL INTEGRATION POINT

Layer 6 — Polish & Deployment (cần tất cả)
  - Lighthouse mobile audit (target Performance >= 75)
  - OG meta tags cho Telegram link preview
  - Verify .nojekyll, relative paths, Telegram pre-filled messages
  - Test trên Android thiết bị thật hoặc Chrome DevTools throttle
```

**Dependency quan trọng:** Layer 5 yêu cầu Layer 4 hoạt động. `scene.js` phải render độc lập trước khi `main.js` integration bắt đầu.

---

## Component Boundaries

| Component | Owns | Does NOT Own |
|-----------|------|--------------|
| `scene.js` | WebGL renderer, camera, geometry | DOM, scroll, GSAP |
| `animations.js` | GSAP timelines, ScrollTrigger | Three.js internals |
| `ui.js` | Pricing tab state | Animations, Three.js |
| `main.js` | Boot order, module glue | Business logic |
| CSS | Visual presentation, hover states | Behavior, data |
| HTML | Content, all pricing data | Presentation, behavior |

**Nguyên tắc:** Giá nằm trong HTML — không trong JS. Editable không cần touch JS, indexable bởi search engines.

---

*Last updated: 2026-05-18*
