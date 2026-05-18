# BaoGia TrustBackLink

## What This Is

Trang web báo giá dịch vụ SEO chuyên nghiệp dành cho shop TrustBackLink. Hiển thị bảng giá 3 dịch vụ (Backlink, Blog Comment, Entity) với thiết kế cao cấp vàng-đen, giúp khách hàng xem giá, so sánh gói, rồi liên hệ đặt hàng qua Telegram.

Trang web thuần tĩnh (static HTML) — không có chức năng thanh toán hay đăng ký. Mọi giao dịch diễn ra qua kênh Telegram.

## Core Value

Khách hàng phải hiểu ngay gói nào phù hợp với mình và muốn nhắn Telegram ngay sau khi xem trang.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hiển thị bảng giá 3 dịch vụ: Backlink, Blog Comment, Entity
- [ ] Mỗi dịch vụ có nhiều gói theo số lượng, 1 gói được highlight "nổi bật"
- [ ] Nút CTA liên kết Telegram nổi bật, dễ bấm
- [ ] Mô tả ngắn từng dịch vụ để khách hiểu mình đang mua gì
- [ ] Hiển thị logo / thương hiệu TrustBackLink
- [ ] Thiết kế dark mode tông vàng-đen luxury
- [ ] Hiệu ứng Three.js hoặc Spline (3D scene nền)
- [ ] GSAP + ScrollTrigger (animation theo scroll)
- [ ] Hover effects trên pricing cards
- [ ] Deploy lên GitHub Pages (static site)

### Out of Scope

- Giỏ hàng / thanh toán online — bán hàng qua Telegram
- Tài khoản người dùng / đăng nhập — không cần
- Admin panel cập nhật giá — giá ổn định, sửa thẳng code
- Đa ngôn ngữ — chỉ tiếng Việt

## Context

- Shop đang bán dịch vụ SEO qua Telegram, cần trang web làm "menu giá" chuyên nghiệp để gửi cho khách tiềm năng
- Khách hàng là các cá nhân/doanh nghiệp cần SEO, họ đến trang để xem giá + so sánh gói trước khi liên hệ
- Logo thương hiệu đã có sẵn
- Tông màu chủ đạo: vàng (#FFD700 hoặc tương tự) trên nền đen — feel luxury/premium

## Constraints

- **Tech Stack**: HTML/CSS/JS thuần + Three.js/GSAP — không dùng framework nặng (Next.js, React) vì chỉ là trang tĩnh
- **Hosting**: GitHub Pages — phải là static files, không có server-side
- **Ngôn ngữ**: Tiếng Việt toàn trang
- **Performance**: Animation đẹp nhưng không được làm trang nặng quá — khách dùng mobile cũng nhiều

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static HTML thay vì CMS/framework | GitHub Pages, không cần server, giá ổn định | — Pending |
| Three.js/GSAP cho animation | Yêu cầu cao về thiết kế premium, tạo ấn tượng mạnh | — Pending |
| Mỗi dịch vụ highlight 1 gói riêng | Tâm lý học: dẫn dắt khách chọn gói giá trị nhất từng dịch vụ | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-18 after initialization*
