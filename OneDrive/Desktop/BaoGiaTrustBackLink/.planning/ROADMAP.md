# Roadmap: BaoGia TrustBackLink

## Overview

Single-page Vietnamese SEO pricing site, built layer-by-layer following a strict dependency order: design tokens first, then HTML content skeleton (fully readable without JS), then CSS styling, then Three.js particle background in isolation, then GSAP animations wired on top, then final polish and GitHub Pages deployment. Each phase leaves the page in a shippable state — animation is additive, never a prerequisite for readable pricing.

## Phases

**Phase Numbering:**
- Integer phases (1–6): Planned milestone work executed in order
- Decimal phases (e.g., 3.1): Urgent insertions created via `/gsd:phase insert`

- [x] **Phase 1: Foundation** - Design tokens, file structure, and deployment infrastructure (completed 2026-05-19)
- [x] **Phase 2: HTML Skeleton** - All content sections hardcoded; page readable without JS or CSS (completed 2026-05-19)
- [ ] **Phase 3: CSS Styling** - Full layout, pricing card components, featured card treatment, mobile-responsive, CSS hover effects
- [ ] **Phase 4: Three.js Scene** - Isolated gold particle background; mobile fallback; no GSAP dependency
- [ ] **Phase 5: GSAP Animations** - Scroll-triggered entrance animations wired via GSAP ticker into Three.js; reduced-motion support
- [ ] **Phase 6: Polish & Deployment** - OG image, page weight audit, Telegram deeplink verification, GitHub Pages live

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffold is in place — design tokens, folder structure, and GitHub Pages deployment infrastructure exist before any content is written
**Depends on**: Nothing (first phase)
**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, PERF-07, PERF-08, PERF-09
**Success Criteria** (what must be TRUE):
  1. `base.css` exists with all gold-black CSS custom properties (`--gold-bright`, `--gold-mid`, `--black-rich`, `--black-card`, `--text-primary`) and font imports for Playfair Display + Be Vietnam Pro; Vietnamese glyphs are served via CSS2 API unicode-range blocks automatically (no `&subset=` parameter required)
  2. All filenames and folder names are lowercase; all asset paths use `./assets/` relative format
  3. `.nojekyll` file exists at repo root; pushing to GitHub Pages produces a live (even empty) URL with no 404s
  4. CSS variables for featured-card gold border/glow and non-featured card border are defined and referenceable
**Plans**: 2 plans

Plans:
- [x] 01-01: Create folder structure, base.css with design tokens, Google Fonts imports
- [x] 01-02: Add .nojekyll, verify GitHub Pages deployment pipeline

### Phase 2: HTML Skeleton
**Goal**: Every piece of pricing content is hardcoded in HTML and readable in a browser with zero JavaScript and zero external CSS — the page works as a functional price list before any styling or animation
**Depends on**: Phase 1
**Requirements**: BRAND-01, BRAND-02, BRAND-03, HERO-01, HERO-02, SVC-01, SVC-02, SVC-03, DATA-01, DATA-02, DATA-03, BL-01, BL-02, BL-03, BL-04, BC-01, BC-02, BC-03, BC-04, EN-01, EN-02, EN-03, EN-04, CTA-01, CTA-02, CTA-03, CTA-04
**Success Criteria** (what must be TRUE):
  1. Header shows TrustBackLink logo, brand name, and a clickable @trustbacklink Telegram username; footer shows name, Telegram link, and copyright — all visible without CSS
  2. Hero section has a one-line value tagline and a Telegram CTA link in raw HTML (above-the-fold position on mobile confirmed by viewport test)
  3. Three service cards (Backlink, Blog Comment, Entity) each have 2–3 line Vietnamese descriptions; Entity card includes the mandatory 2-sentence explanation
  4. All 11 pricing cards (4 Backlink + 4 Blog Comment + 3 Entity) are rendered with correct tier names, quantities, prices (format "500K"), per-unit prices, feature bullets, and "Nổi Bật" text markers on the specified Standard tiers
  5. Every "Dat ngay" button and CTA uses `tg://resolve?domain=trustbacklink` with `https://t.me/trustbacklink` fallback; pre-filled `?text=` messages are present on each card button; floating sticky CTA button and Contact section exist in DOM
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Header, footer, hero section HTML + floating CTA anchor
- [x] 02-02-PLAN.md — Services section with 3 service cards (Backlink, Blog Comment, Entity)
- [x] 02-03-PLAN.md — Backlink and Blog Comment pricing sections with all tiers (8 cards)
- [x] 02-04-PLAN.md — Entity pricing section (3 cards) + Contact CTA section + close main

### Phase 3: CSS Styling
**Goal**: The page looks like a luxury gold-black pricing page — all layout, card grid, featured card treatment, and CSS hover effects are complete; page is shippable as MVP without any JavaScript animation
**Depends on**: Phase 2
**Requirements**: ANIM-07
**Success Criteria** (what must be TRUE):
  1. Pricing grid renders correctly at 320px (mobile), 768px (tablet), and 1280px (desktop) — no overflow, no broken layout
  2. Featured "Nổi Bật" cards have gold border (`1px solid #FFD700`), gold glow (`box-shadow: 0 0 24px rgba(255,215,0,0.35)`), and an absolute-positioned badge; non-featured cards have `1px solid #1E1E1E` and no glow
  3. Pricing cards lift visually on hover (`transform: translateY(-4px)` + box-shadow change) via CSS only — no JavaScript required
  4. The dark overlay (`rgba(0,0,0,0.65)`) layer exists between the canvas placeholder z-index and all text content; text is legible on gold-black background
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Layout CSS: wire CSS links in index.html, header, hero, sections, services grid, footer, dark overlay
- [ ] 03-02-PLAN.md — Pricing card components: featured treatment, badge, btn-cta, floating CTA, hover transitions (ANIM-07)

### Phase 4: Three.js Scene
**Goal**: Gold floating particles run as a background scene that is fully isolated from layout and content — it can be removed without breaking a single pixel of the page; mobile fallback is in place
**Depends on**: Phase 3
**Requirements**: HERO-03, HERO-04, PERF-01, PERF-02, PERF-03, PERF-04, PERF-05
**Success Criteria** (what must be TRUE):
  1. On desktop (>=768px) a WebGL canvas shows gold floating particles (`z-index: 0; position: fixed; pointer-events: none`) and does not block any click or scroll interaction
  2. On mobile (<768px) the Three.js canvas is not initialized; the hero background shows a CSS `radial-gradient` gold-black fallback instead
  3. On devices without WebGL support the canvas is hidden and the CSS gradient fallback displays — no black rectangle, no JS error
  4. Particle count is 1000 on desktop and 400 on mobile; pixel ratio is capped at 1.5; the scene uses demand-based rendering (no unconditional RAF loop running at all times)
  5. The `scene.js` module exports `init()` and `resize()` and does NOT call `requestAnimationFrame` directly — it can be tested standalone before GSAP is wired
**Plans**: 2 plans

Plans:
- [ ] 04-01: scene.js — Three.js particle geometry, WebGL detection, demand-based render loop, mobile/WebGL fallbacks
- [ ] 04-02: Canvas positioning, overlay layer, mobile breakpoint disable, pixel ratio cap

### Phase 5: GSAP Animations
**Goal**: All entrance animations play once on scroll via GSAP ScrollTrigger; GSAP owns the RAF loop and Three.js renders inside it; reduced-motion users see no animations
**Depends on**: Phase 4
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-08, PERF-06
**Success Criteria** (what must be TRUE):
  1. Hero headline and logo fade in and translate from Y+30px to Y0 on page load (plays once, does not replay)
  2. Service cards (x3) and pricing cards stagger-fade in from bottom when scrolled into viewport via ScrollTrigger; Contact CTA block scales from 0.95 to 1.0 on scroll entry — all entrance animations play exactly once
  3. Floating Telegram button slides in from the right edge 3 seconds after page load
  4. `gsap.ticker.add(() => renderer.render(scene, camera))` is the sole render trigger for Three.js — no separate `requestAnimationFrame` call exists in scene.js
  5. With `prefers-reduced-motion: reduce` active: CSS animation properties are disabled via media query AND GSAP skips all tweens — verified by toggling OS accessibility setting
**Plans**: 2 plans

Plans:
- [ ] 05-01: GSAP integration — connect ticker to Three.js, hero load animation
- [ ] 05-02: ScrollTrigger animations — service cards, pricing cards, contact CTA, floating button entrance
- [ ] 05-03: Reduced-motion handling — CSS media query + GSAP skip logic

### Phase 6: Polish & Deployment
**Goal**: The live GitHub Pages URL is production-ready — OG image exists for Telegram link previews, total page weight is within budget, and every Telegram deeplink is verified working on a real device
**Depends on**: Phase 5
**Requirements**: DATA-04, PERF-10
**Success Criteria** (what must be TRUE):
  1. An OG image (1200x630px) exists at `./assets/og-image.jpg` and is referenced in `<meta property="og:image">`; sharing the URL in Telegram shows a proper link preview with the image
  2. Total page weight (HTML + CSS + JS + fonts + assets, excluding Three.js CDN) is at or below 800 KB measured by browser DevTools Network tab
  3. Pricing content (all cards, prices, CTA buttons) is visible in the browser within 1 second on a simulated mobile 4G connection (Lighthouse or DevTools throttle)
  4. All "Dat ngay" Telegram deeplinks open the correct Telegram chat on both Android and iOS; the pre-filled message `Toi+muon+mua+goi+[package name]` appears in the message field
**Plans**: 2 plans

Plans:
- [ ] 06-01: Create OG image, add Open Graph meta tags
- [ ] 06-02: Lighthouse audit, page weight verification, Telegram deeplink end-to-end test

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-05-19 |
| 2. HTML Skeleton | 4/4 | Complete    | 2026-05-19 |
| 3. CSS Styling | 1/2 | In Progress|  |
| 4. Three.js Scene | 0/2 | Not started | - |
| 5. GSAP Animations | 0/3 | Not started | - |
| 6. Polish & Deployment | 0/2 | Not started | - |
