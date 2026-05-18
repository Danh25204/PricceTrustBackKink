# Stack Research: SEO Pricing Page

**Project:** BaoGia TrustBackLink
**Researched:** 2026-05-18

---

## Recommended Stack

| Layer | Choice | Version | Rationale | Confidence |
|-------|--------|---------|-----------|------------|
| HTML foundation | Vanilla HTML5 | — | Zero build tooling, direct GitHub Pages deploy | HIGH |
| CSS base | Custom CSS (no framework) | — | Full control over gold-black luxury palette | HIGH |
| CSS variables | CSS custom properties | — | Token-based theming (`--gold`, `--black`, `--glow`) | HIGH |
| 3D background | Three.js | r169 (0.169.x) | Client-side ES module, GitHub Pages compatible. Spline có watermark free tier + 2.5MB runtime | MEDIUM |
| Animation | GSAP core + ScrollTrigger | 3.12.x | Industry standard scroll-driven luxury animations. ScrollTrigger miễn phí từ 2023 | MEDIUM |
| Icon set | Lucide Icons (SVG sprite) | 0.400.x | Lightweight SVG icons, zero JS runtime | HIGH |
| Font | Cormorant Garamond + Inter | — | Cormorant = luxury serif. Inter = legible Vietnamese sans-serif | MEDIUM |
| Build tooling | None (zero-build) | — | Vanilla HTML/CSS/JS, không cần Vite/Webpack | HIGH |
| Deployment | GitHub Pages | — | Push raw files to `gh-pages` branch hoặc `/docs` | HIGH |

---

## 3D / Animation

### Three.js vs Spline

#### Three.js (KHUYẾN NGHỊ)

- Chạy 100% locally — không phụ thuộc CDN ngoài
- Bundle có thể kiểm soát: ~150 KB gzipped cho scene đơn giản
- GitHub Pages compatible hoàn toàn
- **KHÔNG dùng WebGPURenderer** — thử nghiệm, không hỗ trợ Safari/iOS

**Mobile strategy (quan trọng cho thị trường Việt Nam):**
```javascript
const isLowEnd = navigator.hardwareConcurrency <= 2
  || /Android.*Mobile/.test(navigator.userAgent);
if (isLowEnd) document.body.classList.add('no-webgl');
```
Dùng `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` — không dùng DPR đầy đủ trên mobile.

#### Spline (KHÔNG KHUYẾN NGHỊ)

| Vấn đề | Chi tiết |
|--------|----------|
| Watermark free tier | Logo Spline xuất hiện — phá vỡ hình ảnh luxury brand |
| Bundle size | ~2.5 MB runtime vs ~150 KB Three.js |
| External CDN | Assets từ `spline.design` — downtime của họ = trang bạn hỏng |

### GSAP Loading Strategy

- Tải `gsap.min.js` + `ScrollTrigger.min.js` một lần, self-host trong `/assets/js/`
- **Không dùng CDN** — self-hosting ổn định hơn cho pricing page dài hạn

**Các animation cần thiết:**
- Page load: logo + hero headline fade-in với stagger
- Scroll: pricing cards animate in khi vào viewport (ScrollTrigger)
- Hover: card lift + glow border — dùng CSS transitions (không GSAP, hiệu suất hơn)
- Numbers: animated price counter khi scroll đến
- CTA button: pulse glow loop

**Quy tắc:** Chỉ animate `transform` và `opacity`. Không animate layout properties.

---

## CSS / Styling

**Palette tokens:**
```css
:root {
  --gold-bright:  #FFD700;
  --gold-mid:     #C9A227;
  --gold-dim:     #8B6914;
  --gold-glow:    rgba(255, 215, 0, 0.15);
  --black-pure:   #000000;
  --black-rich:   #0A0A0A;
  --black-card:   #111111;
  --black-border: #1E1E1E;
  --text-primary: #F5F0E8;
  --text-muted:   #8A8070;
  --shadow-gold:  0 0 20px rgba(255,215,0,0.3), 0 0 60px rgba(255,215,0,0.1);
}
```

**Luxury card pattern:**
```css
.pricing-card {
  background: linear-gradient(135deg, var(--black-card) 0%, #0D0D0D 100%);
  border: 1px solid var(--black-border);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.pricing-card:hover, .pricing-card.featured {
  border-color: var(--gold-mid);
  box-shadow: var(--shadow-gold);
}
```

---

## What NOT to Use

| Technology | Lý do |
|------------|-------|
| React / Vue / Svelte | Không cần thiết cho 1 trang tĩnh. Thêm 40–100KB JS |
| Tailwind CSS | Cần build step, phá vỡ zero-build. Không phù hợp luxury design |
| Bootstrap | Aesthetic mặc định xung đột với dark-gold luxury |
| Spline (free tier) | Watermark + 2.5MB runtime — phân tích đầy đủ ở trên |
| jQuery | 30KB cho DOM manipulation mà vanilla JS xử lý được |
| AOS | Thay thế bằng GSAP ScrollTrigger — không cần 2 scroll listeners |
| GSAP SplitText / MorphSVG | Cần license trả phí. Không cần cho dự án này |

---

## Key Decisions Required

1. **Three.js Scene Type**: A) Floating gold particles (đơn giản, mobile tốt) B) Rotating 3D mesh (premium hơn) C) Full scene + bloom (đẹp nhất, nặng nhất) → **Khuyến nghị A**
2. **Mobile Strategy**: A) Tắt Three.js dưới 768px, dùng CSS gradient B) Adaptive quality → **Khuyến nghị A**
3. **Font**: Cormorant Garamond cần verify Vietnamese diacritics trước khi dùng. Fallback: Playfair Display hoặc EB Garamond

---

*Confidence: MEDIUM — version numbers cần verify tại github.com/mrdoob/three.js/releases và gsap.com*
