# Requirements: BaoGia TrustBackLink

**Defined:** 2026-05-18
**Core Value:** Khách hàng phải hiểu ngay gói nào phù hợp và muốn nhắn @trustbacklink ngay sau khi xem trang.

---

## v1 Requirements

### Branding & Header

- [ ] **BRAND-01**: Header hiển thị logo TrustBackLink + tên shop
- [ ] **BRAND-02**: @trustbacklink Telegram username visible ở header (clickable)
- [ ] **BRAND-03**: Footer hiển thị tên shop + Telegram link + copyright

### Hero Section

- [ ] **HERO-01**: Hero section có tagline 1 câu mô tả giá trị ("Dịch vụ SEO chất lượng cao — báo giá minh bạch")
- [ ] **HERO-02**: CTA Telegram nổi bật ngay trong hero (above-the-fold trên mobile)
- [ ] **HERO-03**: Three.js floating gold particles background chạy sau hero section
- [ ] **HERO-04**: Three.js tắt hoàn toàn trên mobile (<768px), thay bằng CSS radial-gradient gold-black

### Services Section

- [ ] **SVC-01**: Section "Dịch vụ của chúng tôi" với 3 service cards (Backlink, Blog Comment, Entity)
- [ ] **SVC-02**: Mỗi service card có mô tả 2–3 dòng tiếng Việt
- [ ] **SVC-03**: Entity service bắt buộc có giải thích 2 câu: "Entity SEO giúp Google nhận diện thương hiệu bạn là một thực thể có thật, tăng uy tín domain bền vững."

### Pricing Section — Backlink

- [ ] **BL-01**: Hiển thị 4 gói Backlink theo số lượng tăng dần
- [ ] **BL-02**: Mỗi gói có: tên gói, số lượng link, giá (format "500K"), đơn giá per link, 4–5 feature bullets (DA range, do-follow ratio, niche, turnaround)
- [ ] **BL-03**: Gói Standard (30 links) được highlight "Nổi Bật" với gold border + glow + badge
- [ ] **BL-04**: Mỗi gói có nút "Đặt ngay" → `tg://resolve?domain=trustbacklink` (fallback `https://t.me/trustbacklink`)

### Pricing Section — Blog Comment

- [ ] **BC-01**: Hiển thị 4 gói Blog Comment theo số lượng tăng dần
- [ ] **BC-02**: Mỗi gói có: tên gói, số lượng comment, giá, đơn giá per comment, feature bullets (approval rate, turnaround, context relevance)
- [ ] **BC-03**: Gói Standard (100 comments) được highlight "Nổi Bật"
- [ ] **BC-04**: Mỗi gói có nút "Đặt ngay" → Telegram deeplink

### Pricing Section — Entity

- [ ] **EN-01**: Hiển thị 3 gói Entity (Basic, Standard, Premium)
- [ ] **EN-02**: Mỗi gói có: tên gói, mô tả phạm vi, giá, feature bullets (số entities, loại platform, report)
- [ ] **EN-03**: Gói Standard được highlight "Nổi Bật"
- [ ] **EN-04**: Mỗi gói có nút "Đặt ngay" → Telegram deeplink

### Conversion & CTA

- [ ] **CTA-01**: Floating sticky button "Nhắn Telegram ngay" fixed bottom-right (56×56px tối thiểu), visible mọi lúc
- [ ] **CTA-02**: Section Contact cuối trang với CTA lớn + @trustbacklink
- [ ] **CTA-03**: Tất cả Telegram links dùng `tg://` deeplink + `https://t.me/` fallback
- [ ] **CTA-04**: Pre-filled message mỗi gói: `?text=Tôi+muốn+mua+gói+[tên gói]`

### Design — Gold-Black Luxury

- [ ] **DESIGN-01**: CSS custom properties: `--gold-bright: #FFD700`, `--gold-mid: #C9A227`, `--black-rich: #0A0A0A`, `--black-card: #111111`, `--text-primary: #F5F0E8`
- [ ] **DESIGN-02**: `rgba(0,0,0,0.65)` dark overlay giữa Three.js canvas và tất cả text content
- [ ] **DESIGN-03**: Font headings: Playfair Display (Google Fonts với `&subset=vietnamese`)
- [ ] **DESIGN-04**: Font body: Be Vietnam Pro (Google Fonts với `&subset=vietnamese`)
- [ ] **DESIGN-05**: Featured card: `border: 1px solid #FFD700`, `box-shadow: 0 0 24px rgba(255,215,0,0.35)`, badge "Nổi Bật" absolute top-right
- [ ] **DESIGN-06**: Non-featured cards: `border: 1px solid #1E1E1E`, no glow

### Animation — GSAP

- [ ] **ANIM-01**: Hero headline + logo: fade-in + translateY(30px→0) khi page load
- [ ] **ANIM-02**: Service cards (×3): stagger fade-in từ bottom khi scroll vào viewport (ScrollTrigger)
- [ ] **ANIM-03**: Pricing cards: stagger fade-in + subtle scale khi scroll vào viewport
- [ ] **ANIM-04**: Contact CTA block: scale 0.95→1.0 khi scroll vào viewport
- [ ] **ANIM-05**: Floating Telegram button: slide in từ right edge sau 3s delay
- [ ] **ANIM-06**: Tất cả entrance animations chỉ play MỘT LẦN — không loop
- [ ] **ANIM-07**: CSS hover trên pricing cards: `transform: translateY(-4px)` + `box-shadow` thay đổi (không GSAP)
- [ ] **ANIM-08**: `prefers-reduced-motion` handled: CSS media query tắt animations + GSAP skip khi enabled

### Performance & Technical

- [ ] **PERF-01**: Three.js canvas: `pointer-events: none; position: fixed; z-index: 0`
- [ ] **PERF-02**: Three.js demand-based rendering (không unconditional RAF loop)
- [ ] **PERF-03**: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` trên mobile
- [ ] **PERF-04**: Particle count: 1000 desktop, 400 mobile (<768px)
- [ ] **PERF-05**: WebGL feature detection — canvas hide + CSS gradient fallback nếu không support
- [ ] **PERF-06**: GSAP sở hữu RAF loop; Three.js render qua `gsap.ticker.add()`
- [ ] **PERF-07**: Tất cả filenames và folder names viết thường (lowercase)
- [ ] **PERF-08**: Tất cả asset paths là relative (`./assets/`) không phải root-relative
- [ ] **PERF-09**: `.nojekyll` file tại root repo
- [ ] **PERF-10**: Total page weight ≤800 KB; pricing content visible <1 giây

### Pricing Data (Mẫu — cần cập nhật)

- [ ] **DATA-01**: Backlink — 4 gói: 10 links/500K | 30 links/1.2M ⭐ | 50 links/1.8M | 100 links/3M
- [ ] **DATA-02**: Blog Comment — 4 gói: 30 cmt/300K | 100 cmt/800K ⭐ | 200 cmt/1.4M | 500 cmt/3M
- [ ] **DATA-03**: Entity — 3 gói: Basic/2M | Standard/4M ⭐ | Premium/7M
- [ ] **DATA-04**: OG image (1200×630) cho Telegram link preview

---

## v2 Requirements

### Social Proof
- **SOCIAL-01**: Số đơn hàng/khách hàng thật → hiển thị ngay trên pricing section
- **SOCIAL-02**: Testimonial snippet 1–2 khách hàng

### SEO & Analytics
- **SEO-01**: Google Analytics / Clarity tracking (nếu muốn theo dõi traffic)
- **SEO-02**: Sitemap.xml cho Google indexing

### Advanced Animation
- **ADV-01**: Counter số đếm lên (số khách hàng, số đơn) khi scroll đến
- **ADV-02**: Parallax depth trên hero section

---

## Out of Scope

| Feature | Lý do |
|---------|-------|
| Shopping cart / thanh toán | Sales qua Telegram — không cần |
| Admin panel cập nhật giá | Giá ổn định, sửa HTML trực tiếp |
| Login / tài khoản người dùng | Không phù hợp mô hình kinh doanh |
| Multi-language | Chỉ tiếng Việt |
| Fake countdown timer | Phá trust với Vietnamese SEO buyers |
| Chatbot / live chat | Telegram đã thay thế |
| Server-side code | GitHub Pages = static only |
| Video autoplay background | Quá nặng, Three.js đã cover motion |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DESIGN-01, 02, 03, 04, 05, 06 | Phase 1 — Foundation | Pending |
| PERF-07, 08, 09 | Phase 1 — Foundation | Pending |
| BRAND-01, 02, 03 | Phase 2 — HTML Skeleton | Pending |
| HERO-01, 02 | Phase 2 — HTML Skeleton | Pending |
| SVC-01, 02, 03 | Phase 2 — HTML Skeleton | Pending |
| DATA-01, 02, 03 | Phase 2 — HTML Skeleton | Pending |
| BL-01, 02, 03, 04 | Phase 2 — HTML Skeleton | Pending |
| BC-01, 02, 03, 04 | Phase 2 — HTML Skeleton | Pending |
| EN-01, 02, 03, 04 | Phase 2 — HTML Skeleton | Pending |
| CTA-01, 02, 03, 04 | Phase 2 — HTML Skeleton | Pending |
| ANIM-07 | Phase 3 — CSS Styling | Pending |
| HERO-03, 04 | Phase 4 — Three.js Scene | Pending |
| PERF-01, 02, 03, 04, 05 | Phase 4 — Three.js Scene | Pending |
| ANIM-01, 02, 03, 04, 05, 06, 08 | Phase 5 — GSAP Animations | Pending |
| PERF-06 | Phase 5 — GSAP Animations | Pending |
| DATA-04 | Phase 6 — Polish & Deployment | Pending |
| PERF-10 | Phase 6 — Polish & Deployment | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-18*
*Last updated: 2026-05-18 — Traceability updated after roadmap creation (corrected count: 54 reqs, not 48)*
