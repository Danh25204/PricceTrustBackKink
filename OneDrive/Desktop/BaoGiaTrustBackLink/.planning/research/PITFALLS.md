# Pitfalls Research: SEO Pricing Page

**Project:** BaoGia TrustBackLink
**Researched:** 2026-05-18
**Confidence:** HIGH (Three.js, GSAP, GitHub Pages, WCAG 2.1, Vietnamese mobile)

---

## Performance Pitfalls

### P1 [CRITICAL] — Three.js Chạy Mỗi Frame Dù Scene Không Đổi

**Vấn đề:** RAF loop vô điều kiện fires 60 lần/giây liên tục, ngay cả khi background 3D không thay đổi. Trên Android tầm trung (Snapdragon 4xx — rất phổ biến Việt Nam dưới $200), điều này đốt GPU/CPU liên tục, gây thermal throttling sau 30–60 giây, trang trở nên lag đúng lúc khách đang đọc giá.

**Phòng ngừa:**
```javascript
let needsRender = false;
function loop() {
  if (needsRender) { renderer.render(scene, camera); needsRender = false; }
  requestAnimationFrame(loop);
}
// GSAP tweens: onUpdate: () => { needsRender = true; }
```

**Phase cần xử lý:** Phase Three.js setup — bake pattern này ngay từ đầu.

---

### P2 [CRITICAL] — Không Có WebGL Fallback

**Vấn đề:** ~3–8% users (iOS Safari cũ, Android WebView, battery-saver mode) không có WebGL. `new THREE.WebGLRenderer()` fail silently → black rectangle.

**Phòng ngừa:**
```javascript
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}
if (!supportsWebGL()) document.getElementById('bg-canvas').style.display = 'none';
```
Canvas container LUÔN có CSS background: `background: radial-gradient(ellipse at center, #1a1200 0%, #000000 70%)`

---

### P3 [CRITICAL] — Asset Size Giết First Load Trên Mobile Việt Nam

**Vấn đề:** Three.js không minified (~1.2 MB), texture PNG lớn, không có loading placeholder → trang trắng 3–6 giây trên 4G Việt Nam.

**Phòng ngừa:**
- Dùng `three.module.min.js` (~580 KB minified, cached sau first visit)
- Load Three.js với `<script type="module">` — không block HTML parsing
- Pricing table LUÔN visible dù Three.js chưa load
- Background hoàn toàn procedural — zero texture files
- Target: total page ≤800 KB, Three.js scene visible ≤3s trên 4G

---

### P4 [HIGH] — Pixel Ratio Sai Phá GPU Mobile

**Vấn đề:** `renderer.setPixelRatio(window.devicePixelRatio)` trên iPhone 15 Pro (DPR 3) = 9× GPU work. Scene 60fps desktop → 15–20fps mobile.

**Phòng ngừa:**
```javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Trên mobile: giảm particle count 60% + cap tại DPR 1.5
```

---

### P5 [HIGH] — Memory Leak Khi Recreate Three.js Objects Trên Resize

**Vấn đề:** Tạo `new THREE.WebGLRenderer()` mới trong resize callback → GPU memory leak tích lũy → crash trên mobile 2–3 GB RAM.

**Phòng ngừa:**
```javascript
// Chỉ resize, KHÔNG recreate
window.addEventListener('resize', debounce(() => {
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}, 250));
```

---

## GitHub Pages Gotchas

### G1 [CRITICAL] — Case Sensitivity Phá Asset Paths

**Vấn đề:** GitHub Pages = Linux filesystem (case-sensitive). Windows = case-insensitive. `./Assets/Logo.png` hoạt động local nhưng 404 trên production nếu file là `assets/logo.png`.

**Phòng ngừa:** Enforce **lowercase tuyệt đối** cho tất cả files/folders. Convention: `assets/`, `css/`, `js/`, `fonts/` — không có capital letters.

---

### G2 [CRITICAL] — Sub-Path Base URL Phá Absolute Paths

**Vấn đề:** Deploy tới `username.github.io/BaoGiaTrustBackLink/` → `/assets/logo.png` resolve tới `username.github.io/assets/logo.png` = 404.

**Phòng ngừa:** Chỉ dùng **relative paths**: `./assets/logo.png`, không `/assets/logo.png`.

---

### G3 [HIGH] — HTTP CDN URLs Bị Block bởi Mixed Content

**Vấn đề:** GitHub Pages luôn serve HTTPS. `http://` CDN links bị block.

**Phòng ngừa:** Tất cả CDN URLs dùng `https://`, hoặc self-host trong `/js/vendor/`.

---

### G4 [HIGH] — Không Set Custom HTTP Headers

**Vấn đề:** GitHub Pages không hỗ trợ custom headers. Không thể configure CORS cho external data fetches.

**Phòng ngừa:** Embed ALL pricing data trực tiếp trong HTML/JS — không có `fetch()` calls, không external data files.

---

### G5 — `.nojekyll` File Bắt Buộc

Không có file này → GitHub Pages chạy Jekyll, ignore files bắt đầu bằng `_`.

**Phòng ngừa:** Tạo `.nojekyll` (file trống) tại root trước khi deploy.

---

## Conversion Killers

### C1 [CRITICAL] — Telegram CTA Không Thể Với Tới Không Scroll Nhiều

**Phòng ngừa:** `position: fixed; bottom: 20px; right: 20px` floating Telegram button, visible từ page load trên mobile.

---

### C2 [CRITICAL] — Intro Animation Block Content

**Vấn đề:** Animation 3–5 giây toàn màn hình → khách có intent phải chờ trước khi thấy giá.

**Phòng ngừa:**
- Pricing HTML visible trong 1 giây sau DOMContentLoaded, bất kể Three.js load state
- Canvas LUÔN `z-index: 0`, content LUÔN `z-index: 1`
- Nếu có entrance animation: từ 70% opacity → 100% (không từ 0%)

---

### C3 [HIGH] — Quá Nhiều Gói = Decision Paralysis

**Phòng ngừa:** Tối đa 4 tiers per service. 1 "Phổ biến nhất" card visually dominant. Supporting tiers mờ hơn.

---

### C4 [HIGH] — Telegram Link Friction via Browser Redirect

**Phòng ngừa:**
```html
<a href="https://t.me/USERNAME"
   onclick="try { window.location.href='tg://resolve?domain=USERNAME'; return false; } catch(e) {}">
  Nhắn Telegram ngay
</a>
```
`tg://` mở thẳng app nếu có cài. `https://t.me/` là fallback.

---

### C5 [HIGH] — Không Có Trust Signals Trước Pricing

**Phòng ngừa:** Ngay trên section pricing đầu tiên: logo + 1–2 câu credibility + 1 social proof snippet.

---

### C6 [MEDIUM] — Animation Cạnh Tranh Với Text

**Phòng ngừa:** Background Three.js: chuyển động cực chậm (<5px/second). GSAP card entrance: play ONE lần khi scroll vào, stop hẳn. Hover effects: fine vì user-initiated.

---

## Accessibility & Compatibility

### A1 [CRITICAL] — Gold-on-Black Contrast Thất Bại Cho Body Text

**Vấn đề:** `#FFD700` on `#000000` = 13.7:1 ✓ nhưng muted gold (#B8860B) = 5–7:1, dùng làm body text là vấn đề. Nguy hiểm hơn: white text trên card với Three.js background sáng phía sau.

**Phòng ngừa:**
- Giá và tên gói: `#FFD700` hoặc sáng hơn — không bao giờ muted gold cho text
- Body/description text: `#E0E0E0` hoặc `#FFFFFF`
- Muted gold chỉ cho accents/borders
- **LUÔN có** `rgba(0,0,0,0.65)` dark overlay giữa canvas và text

---

### A2 [HIGH] — `prefers-reduced-motion` Không Được Respect

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) initAnimations();
else gsap.set('.pricing-card', { opacity: 1, y: 0 });
```

---

### A3 [HIGH] — iOS Safari WebGL Memory Limits

**Phòng ngừa:** `{ antialias: false }` khi tạo renderer. Không texture >1024×1024. Giữ GPU memory <100 MB.

---

### A4 [HIGH] — Vietnamese Unicode Font Rendering

**Vấn đề:** Nhiều luxury fonts thiếu glyphs tiếng Việt → mid-word font fallback.

**Phòng ngừa:** Google Fonts với `&subset=vietnamese`. Khuyến nghị: **Playfair Display** (headings) + **Be Vietnam Pro** (body text). Fallback: `'Be Vietnam Pro', 'Helvetica Neue', Arial, sans-serif`.

---

### A5 [MEDIUM] — Touch Target Quá Nhỏ

**Phòng ngừa:** CTA buttons tối thiểu `height: 44px; padding: 12px 24px`. Floating button tối thiểu 56×56px.

---

### A6 [MEDIUM] — Three.js Canvas Block Touch Events

**Phòng ngừa:**
```css
#bg-canvas {
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  z-index: 0;
}
```

---

## Prevention Checklist Nhanh

### Phase 1 (Foundation + Three.js)
- [ ] Lowercase tất cả files/folders (G1)
- [ ] Relative paths everywhere (G2)
- [ ] CDN URLs dùng `https://` hoặc self-host (G3)
- [ ] `{ antialias: false }` (A3)
- [ ] `setPixelRatio(Math.min(devicePixelRatio, 2))` (P4)
- [ ] WebGL detection + CSS fallback gradient (P2)
- [ ] `pointer-events: none; z-index: 0` trên canvas (A6)
- [ ] Google Fonts với `&subset=vietnamese` (A4)
- [ ] Demand-based rendering (không unconditional RAF) (P1)
- [ ] `.nojekyll` file tại root (G5)

### Phase 2 (Pricing Layout + Animation)
- [ ] Pricing visible <1s, không bị gate bởi Three.js (C2)
- [ ] 1 featured card per service (C3)
- [ ] CTA buttons ≥44px height (A5)
- [ ] Floating Telegram button fixed (C1)
- [ ] `tg://` deeplink + https fallback (C4)
- [ ] Trust signal trước pricing section (C5)
- [ ] `prefers-reduced-motion` handled (A2)
- [ ] Dark overlay `rgba(0,0,0,0.65)` giữa canvas và text (A1)

### Phase 3 (Performance Audit)
- [ ] Lighthouse mobile score ≥70 (P3)
- [ ] Total weight ≤800 KB (P3)
- [ ] Test trên Android thiết bị thật (P1, P4)
- [ ] Test WebGL disabled — fallback đẹp (P2)
- [ ] Verify GitHub Pages deployment, tất cả assets load (G1, G2)
- [ ] Lighthouse Accessibility contrast audit pass (A1)

---

*Last updated: 2026-05-18*
