# Features Research: SEO Pricing Page

**Project:** BaoGia TrustBackLink
**Researched:** 2026-05-18
**Confidence:** HIGH (conversion psychology) / MEDIUM (Vietnamese market specifics)

---

## Table Stakes

| Feature | Tại sao cần | Complexity |
|---------|-------------|------------|
| Pricing cards theo gói | Lý do khách vào trang — không có giá = không có trust | Low |
| Tên gói + giá + số lượng | Khách so sánh theo đơn giá và volume | Low |
| Mô tả ngắn từng dịch vụ (2–3 dòng) | Nhiều khách không biết "Entity" là gì — giải thích bắt buộc | Low |
| CTA Telegram trên mỗi card | Card không có nút = dead end | Low |
| Logo + tên thương hiệu | Tín hiệu uy tín | Low |
| Mobile responsive | Người dùng Việt Nam đa số dùng mobile | Medium |
| Typography dễ đọc | Giá phải đọc rõ trên nền tối | Low |
| Tải dưới 3s trên mobile | Scene 3D nặng phải có fallback | Medium |
| Tách biệt rõ 3 dịch vụ | Tránh nhầm lẫn cognitive overload | Low |
| @username Telegram hiển thị rõ | Visible ở header/footer, không chỉ trong button | Low |

---

## Differentiators

| Feature | Giá trị | Complexity |
|---------|---------|------------|
| Badge "Nổi Bật" / "Best Value" per service | Giảm do dự — dẫn dắt khách chọn gói margin tốt nhất | Low |
| Card entrance animation | Tạo cảm giác thương hiệu chuyên nghiệp | Medium |
| 3D hero background (Three.js) | Không có shop SEO Telegram nào có cái này | High |
| Gold-black luxury design | Visual trust signal, neo giá cao hơn về tâm lý | Medium |
| Feature bullets per card | DA range, do-follow ratio, turnaround, report — giảm câu hỏi trước khi mua | Low |
| Scroll-based reveal animations | Tăng thời gian trên trang, mỗi section như màn trình diễn | Medium |
| Sticky floating Telegram button | Capture intent ở mọi vị trí scroll | Low |
| Hover effects trên cards | Micro-interaction nhấn mạnh premium feel | Low–Medium |
| Social proof tĩnh ("200+ khách hàng") | Trust signal ngay trước CTA | Low |
| Volume tier ascending (Starter → Premium) | Thể hiện lợi thế đơn giá ở tier cao | Low |

---

## Conversion Psychology

### 1. Price Anchoring
Đặt gói đắt nhất bên trái — khách đọc từ trái sang phải, anchor vào số đầu tiên. Gói tầm trung cảm giác "hời" hơn.

### 2. Decoy Pricing (Middle Option Bias)
3 tier khai thác xu hướng tránh thái cực. Badge "Nổi Bật" trên gói giữa reinforces quyết định. **Business decision cần thiết: gói nào được highlight — không hardcode trước khi có thông tin từ shop.**

### 3. CTA Copy mạnh
- Dùng **"Đặt ngay"** hoặc **"Tư vấn miễn phí"** thay vì "Liên hệ"
- Telegram button: **"Nhắn Telegram ngay"**
- Tránh "Xem thêm" (passive)

### 4. Visual Hierarchy — Featured Card
Card "Nổi Bật" phải trông khác biệt rõ rệt:
- Padding thêm (cao hơn các card khác)
- Border: `1–2px solid #FFD700`
- Glow: `box-shadow: 0 0 24px rgba(255,215,0,0.35)`
- Badge "Nổi Bật" (position: absolute, top-right)
- Các card còn lại: border mờ, không glow

### 5. Social Proof tại điểm quyết định
Đặt social proof ngay dưới row cards (trước CTA) — không phải đầu trang.
Ví dụ: "Hơn 150 đơn hàng thành công tháng qua"

### 6. Price Formatting
Dùng **"500K", "1.2M"** — không phải "500.000đ". Viết cả đơn giá:
"10 backlinks — 500K (~50K/link)"

### 7. Above-the-Fold CTA trên Mobile
40–60% mobile users không scroll. Hero phải có logo + 1-sentence value prop + Telegram CTA trong 667px đầu.

### 8. Cognitive Load Cap
Tối đa 4 gói per service. Tách biệt 3 dịch vụ bằng full-width section break.

---

## Anti-Features

| Tính năng | Tại sao KHÔNG làm |
|-----------|-------------------|
| Shopping cart / checkout | Sales qua Telegram — không cần |
| All-services comparison table | 3 service × 4 tier trong 1 bảng = không đọc được trên mobile |
| Pricing calculator | Telegram xử lý custom quote |
| FAQ accordion | Làm chậm scroll đến CTA |
| Testimonial carousel | JS nặng; thay bằng 1 dòng text tĩnh |
| Multi-language toggle | Chỉ tiếng Việt |
| Login / account | Không cần |
| Third-party live chat | Telegram đã đóng vai này |
| Cookie banner | Không có tracking cookies trên static site |
| Popup / exit-intent modal | Phá hỏng luxury brand perception |
| Video autoplay background | Quá nặng; Three.js đã cung cấp motion |
| Admin panel | Giá ổn định, sửa thẳng HTML |
| Fake countdown timer | **Người mua SEO Việt Nam nhận ra ngay — destroy trust** |

---

## Vietnamese Market Notes

### Buyer Behavior
- Khách hàng là chủ doanh nghiệp nhỏ hoặc individual affiliate/MMO. Nhạy cảm về giá nhưng coi trọng thương hiệu.
- Telegram là kênh B2B chủ đạo cho digital services tại Việt Nam.
- Trang web chuyên nghiệp được forward giữa các khách — hoạt động như digital business card.

### Pricing Language
- Dùng "K" cho nghìn (500K, 1.2M) — shorthand native trong digital commerce Việt Nam.
- Ghi cả đơn giá VÀ giá gói — khách Việt thường tính cost-per-link để so sánh.
- CTA phụ: "Liên hệ giá sỉ" — báo hiệu discount cho volume lớn.

### Service-Specific Questions

**Backlink:** DA range, do-follow ratio, niche relevance, turnaround, report format

**Blog Comment:** Approval rate guarantee, contextual relevance của comment text. "Guaranteed approved comments" là lever chuyển đổi mạnh.

**Entity:** Nhiều khách không biết Entity SEO là gì. **Giải thích 2 câu là BẮT BUỘC:**
> "Entity SEO giúp Google nhận diện thương hiệu bạn là một thực thể có thật, tăng uy tín domain bền vững."

### Trust Signals Hiệu Quả
- Số đơn/khách hàng cụ thể ("200+ khách hàng")
- Thời gian hoàn thành rõ ràng ("3–5 ngày")
- "Hỗ trợ sau bán hàng" — tránh bị cho là ghost sau khi nhận tiền
- @username Telegram visible và clickable trên mọi màn hình

### Urgency Copy
- Hoạt động: "Ưu đãi tháng này", "Còn X slot" (nếu thật)
- Phá trust: Fake countdown timer, "Chỉ còn 2 suất" mà reset khi reload

---

## MVP Feature Set

1. Section headers + mô tả ngắn từng dịch vụ (Entity explanation là bắt buộc)
2. Pricing cards: tên, giá, số lượng, 4–6 feature bullets
3. 1 card "Nổi Bật" per service (CSS badge + elevated visual)
4. Telegram CTA trên mỗi card
5. Sticky floating Telegram button
6. Mobile-responsive single-column card layout
7. Logo + tên thương hiệu ở header
8. Gold-black design tokens

**Defer post-MVP:** Three.js scene, GSAP animations, social proof (cần số thật), hover effects CSS polish

*Rationale: Animation layer có risk cao nhất. Build trên layout đã validated là an toàn hơn build layout bên trong animation scaffold.*

---

*Last updated: 2026-05-18*
