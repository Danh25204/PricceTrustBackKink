# Phase 1: Foundation - Research

**Researched:** 2026-05-18
**Domain:** CSS custom properties, Google Fonts, GitHub Pages static deploy, vanilla HTML scaffold
**Confidence:** HIGH

---

## Summary

Phase 1 establishes the non-visible scaffold that every subsequent phase depends on: the CSS design token file (`base.css`), the folder structure, Google Fonts imports for Playfair Display + Be Vietnam Pro with Vietnamese subset, and the `.nojekyll` deployment guard file.

This is a greenfield phase — the repo root currently contains only `CLAUDE.md`. No existing files need migration or modification. Every artifact created in this phase is either a new file or a new empty directory. The phase produces no visible rendered output; the "deliverable" is infrastructure for downstream phases to consume.

The technical scope is narrow but the decisions made here (token names, folder structure, Google Fonts URL) become load-bearing contracts for all six subsequent phases. Getting names wrong here cascades into find-and-replace work later.

**Primary recommendation:** Create `base.css` with the exact token names specified in REQUIREMENTS.md and UI-SPEC.md, use the Google Fonts CSS2 API with `display=swap` and automatic Vietnamese subset (the CSS2 API serves `unicode-range` blocks automatically — the `&subset=` parameter is legacy and not needed in CSS2), and place an empty `.nojekyll` at repo root before the first push.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CSS design tokens | Static / Browser | — | CSS custom properties declared in base.css, consumed by all later CSS files via cascade |
| Google Fonts loading | Browser (network) | CDN (fonts.gstatic.com) | `<link>` in `<head>` fetches font CSS from Google; browser resolves unicode-range blocks automatically |
| Folder structure | Filesystem / Repo | — | Determines all relative path references in later phases |
| `.nojekyll` guard | GitHub Pages infra | — | Prevents Jekyll processing; must exist at repo root before first gh-pages push |
| Minimal HTML scaffold | Browser | — | Provides `<head>` with font link and `<link rel="stylesheet">` so base.css is loadable for verification |

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DESIGN-01 | CSS custom properties: `--gold-bright: #FFD700`, `--gold-mid: #C9A227`, `--black-rich: #0A0A0A`, `--black-card: #111111`, `--text-primary: #F5F0E8` | Exact values confirmed in CLAUDE.md, REQUIREMENTS.md, and UI-SPEC.md; all five tokens plus extended palette documented in Standard Stack section |
| DESIGN-02 | `rgba(0,0,0,0.65)` dark overlay token between Three.js canvas and text content | Token `--overlay-dark: rgba(0,0,0,0.65)` declared in base.css; CSS variable available for Phase 3/4 consumption |
| DESIGN-03 | Font headings: Playfair Display (Google Fonts, `&subset=vietnamese`) | Google Fonts CSS2 API confirmed; Playfair Display available with weight 700; Vietnamese subset served automatically via unicode-range |
| DESIGN-04 | Font body: Be Vietnam Pro (Google Fonts, `&subset=vietnamese`) | Be Vietnam Pro confirmed on Google Fonts with subsets [latin, latin-ext, vietnamese] and weights 100–900; weights 400+600 sufficient |
| DESIGN-05 | Featured card tokens: `border: 1px solid #FFD700`, `box-shadow: 0 0 24px rgba(255,215,0,0.35)`, badge "Nổi Bật" | Declared as `--card-featured-border` and `--card-featured-shadow` in base.css per UI-SPEC.md contract |
| DESIGN-06 | Non-featured cards: `border: 1px solid #1E1E1E`, no glow | Declared as `--card-default-border` in base.css |
| PERF-07 | All filenames and folder names lowercase | Enforced by folder structure pattern — all paths use lowercase; verified at creation time |
| PERF-08 | All asset paths relative (`./assets/`) not root-relative | Enforced in minimal index.html scaffold; `<link href="./assets/css/base.css">` pattern documented |
| PERF-09 | `.nojekyll` file at repo root | Empty file placed at repo root; purpose and placement fully documented |
</phase_requirements>

---

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| CSS Custom Properties | Native (all modern browsers) | Design token system | Zero-dependency, cascade-native, consumed directly without preprocessing |
| Google Fonts CSS2 API | Current | Web font loading for Playfair Display + Be Vietnam Pro | Free CDN, automatic `unicode-range` subset serving, `font-display: swap` support |
| `.nojekyll` | — (empty file) | GitHub Pages Jekyll bypass | Required for any repo with underscore-prefixed directories or non-Jekyll static site |

### No Third-Party Packages

Phase 1 installs zero npm packages. It is pure file creation. There is no `package.json`, no `node_modules`, no build step. The "stack" for this phase is the file system and the browser's native CSS engine.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts CDN | Self-hosted woff2 files | Self-hosting eliminates CDN dependency and avoids Google tracking; adds ~50 KB to repo and requires manual font subset extraction. For Phase 1 speed, CDN is faster to implement. Phase 6 can migrate if weight audit flags it. |
| CSS custom properties | Sass/Less variables | Sass/Less require a build step (violates zero-build constraint). CSS custom properties work at runtime, enabling potential future JS-driven theme switching. |
| Empty `.nojekyll` | GitHub Actions workflow | Actions gives more control but adds complexity; for a simple static site, `.nojekyll` in the push branch is sufficient. |

---

## Package Legitimacy Audit

No external packages are installed in Phase 1. This section is not applicable.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
[Repo root]
    |
    +-- index.html          <- minimal scaffold (<head> only, no body content yet)
    |      |
    |      +-- <link> href="./assets/css/base.css"
    |      +-- <link> href="[Google Fonts CSS2 URL]"
    |
    +-- assets/
    |      +-- css/
    |      |      +-- base.css     <- ALL design tokens, font-face references
    |      |      +-- layout.css   <- (empty placeholder, Phase 3)
    |      |      +-- components.css <- (empty placeholder, Phase 3)
    |      |      +-- animations.css <- (empty placeholder, Phase 3)
    |      +-- js/
    |      |      +-- vendor/      <- (empty dir, Three.js + GSAP land here in Phase 4/5)
    |      |      +-- scene.js     <- (empty placeholder, Phase 4)
    |      |      +-- animations.js <- (empty placeholder, Phase 5)
    |      |      +-- ui.js        <- (empty placeholder, Phase 2)
    |      |      +-- main.js      <- (empty placeholder, Phase 5)
    |      +-- images/             <- (empty dir, logo + og-image land here)
    |      +-- fonts/              <- (empty dir, reserved for self-hosted fallback if needed)
    |
    +-- .nojekyll           <- empty file, MUST exist at repo root
    +-- CLAUDE.md           <- already exists (do not modify)
```

Data flow: Browser loads `index.html` -> fetches `base.css` (design tokens parsed, CSS variables registered) -> fetches Google Fonts CSS (unicode-range blocks downloaded on-demand) -> tokens available to all subsequent CSS files.

### Recommended Project Structure

```
BaoGiaTrustBackLink/
├── index.html               # Minimal scaffold — <head> with font + CSS links only
├── assets/
│   ├── css/
│   │   ├── base.css         # Design tokens, font imports, reset, z-index stack
│   │   ├── layout.css       # (empty — Phase 3)
│   │   ├── components.css   # (empty — Phase 3)
│   │   └── animations.css   # (empty — Phase 3)
│   ├── js/
│   │   ├── vendor/          # (empty dir — Three.js + GSAP drop here in Phase 4/5)
│   │   ├── scene.js         # (empty — Phase 4)
│   │   ├── animations.js    # (empty — Phase 5)
│   │   ├── ui.js            # (empty — Phase 2)
│   │   └── main.js          # (empty — Phase 5)
│   ├── images/              # (empty dir — logo.svg + og-image.jpg land here)
│   └── fonts/               # (empty dir — reserved for self-hosted fonts if needed)
├── .nojekyll                # Empty file — blocks GitHub Pages Jekyll processing
└── CLAUDE.md                # Already exists — do not modify
```

**Why these directories exist now (even when empty):** Git does not track empty directories. Placeholder files (`.gitkeep` or empty `README.md`) are needed inside `vendor/`, `images/`, and `fonts/` so the directory structure is committed and the paths are valid for relative references in later phases.

### Pattern 1: CSS Custom Property Declaration Structure

**What:** All design tokens declared in `:root` in a single block, organized by category with comments.
**When to use:** Always in `base.css` — downstream CSS files import no variables, they reference `var(--token-name)` directly via cascade.

```css
/* Source: REQUIREMENTS.md DESIGN-01 through DESIGN-06; UI-SPEC.md Color section */

/* === COLORS === */
:root {
  /* Gold palette */
  --gold-bright: #FFD700;
  --gold-mid:    #C9A227;
  --gold-dim:    #8B6914;

  /* Black palette */
  --black-rich:   #0A0A0A;
  --black-card:   #111111;
  --black-border: #1E1E1E;

  /* Text */
  --text-primary: #F5F0E8;
  --text-muted:   #8A8070;

  /* Overlay */
  --overlay-dark: rgba(0, 0, 0, 0.65);

  /* Glow values */
  --gold-glow:     rgba(255, 215, 0, 0.35);
  --gold-glow-dim: rgba(255, 215, 0, 0.15);

  /* Error (reserved) */
  --color-error: #FF4444;
}

/* === SPACING === */
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --cta-touch: 56px;   /* Floating Telegram CTA minimum touch target */
}

/* === TYPOGRAPHY === */
:root {
  --text-sm:   14px;
  --text-base: 16px;
  --text-lg:   28px;
  --text-xl:   40px;
}

/* === Z-INDEX STACK === */
:root {
  --z-canvas:  0;
  --z-overlay: 1;
  --z-content: 2;
  --z-float:   100;
  --z-modal:   200;
}

/* === CARD TOKENS === */
:root {
  --card-featured-border:  1px solid var(--gold-bright);
  --card-featured-shadow:  0 0 24px var(--gold-glow);
  --card-default-border:   1px solid var(--black-border);
  --card-bg:               linear-gradient(135deg, var(--black-card) 0%, #0D0D0D 100%);
  --card-hover-lift:       translateY(-4px);
}

/* === BREAKPOINTS (reference values — used in media queries) === */
:root {
  --bp-mobile: 768px;
}
```

### Pattern 2: Google Fonts CSS2 Import

**What:** Single `<link>` tag in `<head>` before `base.css` — requests both font families in one HTTP round-trip.
**When to use:** Must be the first external resource in `<head>`, before the `base.css` `<link>`, to minimize FOUT (Flash of Unstyled Text).

```html
<!-- Source: Google Fonts CSS2 API — developers.google.com/fonts/docs/css2 -->
<!-- Vietnamese subset is served automatically via unicode-range by CSS2 API -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Be+Vietnam+Pro:wght@400;600&display=swap">
```

**Why `display=swap` is declared in the URL (not `@font-face`):** The CSS2 API generates `@font-face` blocks server-side. Appending `&display=swap` instructs Google's API to inject `font-display: swap` into every `@font-face` rule it returns, so the browser renders fallback text immediately without waiting for font download.

**Vietnamese subset handling in CSS2 API:** [VERIFIED: developers.google.com/fonts/docs/css2] The CSS2 API serves multiple `@font-face` blocks per font family, each with a `unicode-range` descriptor. The browser downloads only the blocks whose unicode ranges cover characters on the page. Vietnamese characters (U+0102–0103, U+0110–0111, U+0128–0129, U+01A0–01A1, U+01AF–01B0, U+1EA0–1EF9) are covered by the Vietnamese unicode-range block, which the browser fetches automatically. The legacy `&subset=vietnamese` parameter from the CSS1 API is not needed and not documented in CSS2 API; the automatic unicode-range mechanism supersedes it.

**Note on UI-SPEC.md:** The UI-SPEC.md documents a URL with `&subset=vietnamese`. That URL functions because the CSS2 API ignores unknown parameters gracefully — it does not break. However the parameter adds no behavior in the CSS2 API. The canonical URL above (without `&subset=`) is equivalent and cleaner. [CITED: developers.google.com/fonts/docs/css2]

### Pattern 3: Minimal index.html Scaffold

**What:** A valid HTML5 document with `<head>` only — no body content. Body content belongs to Phase 2. The scaffold's sole purpose is to make `base.css` loadable and verifiable in a browser.
**When to use:** End of Phase 1. After creation the developer can open `index.html` in a browser, open DevTools, and verify CSS custom properties are registered under `:root`.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustBackLink — Báo Giá Dịch Vụ SEO</title>

  <!-- Google Fonts: Playfair Display (heading) + Be Vietnam Pro (body) -->
  <!-- Vietnamese subset served automatically via unicode-range by CSS2 API -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Be+Vietnam+Pro:wght@400;600&display=swap">

  <!-- Design tokens — must load before any other stylesheet -->
  <link rel="stylesheet" href="./assets/css/base.css">
</head>
<body>
  <!-- Content added in Phase 2 -->
</body>
</html>
```

### Pattern 4: CSS Reset Block in base.css

**What:** Minimal box-sizing reset appended after custom properties.
**When to use:** At the bottom of `base.css`, after all `:root` declarations.

```css
/* === RESET === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--black-rich);
  color: var(--text-primary);
  font-family: 'Be Vietnam Pro', system-ui, sans-serif;
  font-size: var(--text-base);
  line-height: 1.6;
}

/* === REDUCED MOTION BASE === */
/* Source: REQUIREMENTS.md ANIM-08; ARCHITECTURE.md mobile rules */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Why include `prefers-reduced-motion` in Phase 1:** The media query must be defined before any animation CSS is written (Phase 3, 5). Placing it in `base.css` ensures it is always the lowest-specificity rule, safely overridable by phase-specific declarations. [CITED: REQUIREMENTS.md ANIM-08]

### Pattern 5: .nojekyll Placement

**What:** An empty file named `.nojekyll` placed at the repository root (same level as `index.html`).
**When to use:** Must exist at repo root in the branch configured as GitHub Pages source before the first push.

```
# File content: empty (zero bytes)
# Path: BaoGiaTrustBackLink/.nojekyll
# No content — existence alone signals GitHub Pages to bypass Jekyll
```

**Why it matters:** Without `.nojekyll`, GitHub Pages runs Jekyll on every push. Jekyll silently ignores:
- Files/folders starting with `_` (e.g., `_next/`, `_app/`)
- Files starting with `.` (dotfiles — including `.nojekyll` itself if already processed)
- Files in `node_modules/` or `vendor/`

For this project the immediate risk is lower (no underscore directories), but the file is required by PERF-09 and adds no cost. [CITED: docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll]

### Anti-Patterns to Avoid

- **Root-relative paths (`/assets/css/base.css`):** Works on a custom domain at the domain root, fails silently when deployed to a GitHub Pages sub-path (e.g., `username.github.io/BaoGiaTrustBackLink/`). Use `./assets/css/base.css` relative paths always. [CITED: ARCHITECTURE.md GitHub Pages gotchas]
- **Uppercase in filenames or folder names:** GitHub Pages runs on Linux — `Assets/` and `assets/` are different directories. All names must be lowercase. [CITED: REQUIREMENTS.md PERF-07]
- **Declaring `font-display` in project CSS:** The CSS2 API generates `@font-face` declarations server-side. Trying to override `font-display` in local CSS has no effect on Google-served `@font-face` blocks. The correct approach is `&display=swap` in the URL parameter.
- **Using `@import` for Google Fonts in CSS:** `@import` in CSS is render-blocking and delays font fetch until `base.css` is parsed. Use `<link rel="stylesheet">` in HTML `<head>` instead — it is fetched in parallel with HTML parsing.
- **Omitting `crossorigin` on `preconnect` for fonts.gstatic.com:** Fonts are served as cross-origin resources. The `crossorigin` attribute on the `fonts.gstatic.com` preconnect is required for the preconnect hint to actually warm the TLS connection used for font file downloads.
- **Checking custom properties in CSS files with `var(--token)` in media queries:** CSS custom properties cannot be used inside media query condition values (e.g., `@media (max-width: var(--bp-mobile))` does not work). Media queries must use literal pixel values. Declare `--bp-mobile: 768px` as documentation only; actual media queries use `768px` directly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Vietnamese font support | Custom `@font-face` with manually subsetted woff2 | Google Fonts CSS2 API with unicode-range | Subsetting Vietnamese requires HarfBuzz toolchain; Google does it server-side and serves only needed unicode blocks per browser request |
| CSS reset | Custom browser-behavior normalization | Minimal box-sizing reset (as documented above) | Normalize.css requires a build step or CDN; for this project scope the 5-line reset in base.css is sufficient |
| Design token system | Sass/Less variables | CSS custom properties (native) | Build step prohibited; CSS variables are cascade-native and inspectable in DevTools |

**Key insight:** Phase 1 has almost nothing to hand-roll. The only failure mode is creating the wrong token names or wrong file paths — both of which are fully specified in requirements and UI-SPEC.

---

## Common Pitfalls

### Pitfall 1: Token Name Divergence Between base.css and Later Phases

**What goes wrong:** Phase 3 author writes `var(--gold)` but Phase 1 declared `var(--gold-bright)`. The card renders black (CSS custom property returns `initial` on typo, which for `border-color` is `currentColor` or transparent).
**Why it happens:** Token names are defined in three places (REQUIREMENTS.md, UI-SPEC.md, CLAUDE.md) with slight variations. CLAUDE.md uses shorthand (`--gold-bright`) while STACK.md research used `--gold`. The authoritative source is REQUIREMENTS.md DESIGN-01 + UI-SPEC.md.
**How to avoid:** Use exactly the names from REQUIREMENTS.md DESIGN-01: `--gold-bright`, `--gold-mid`, `--black-rich`, `--black-card`, `--text-primary`. The extended tokens (`--gold-dim`, `--black-border`, `--text-muted`, etc.) come from UI-SPEC.md and STACK.md; use those exact names.
**Warning signs:** A CSS variable returning transparent or inheriting incorrectly; DevTools `:root` shows the property but it's not resolving.

### Pitfall 2: GitHub Pages Sub-Path vs. Root Domain

**What goes wrong:** If GitHub Pages is configured to serve from `https://username.github.io/BaoGiaTrustBackLink/` (a sub-path), root-relative paths (`/assets/css/base.css`) return 404. The page loads with no styles.
**Why it happens:** Root-relative paths resolve from the domain root, not the repository root. `username.github.io/BaoGiaTrustBackLink/` has a sub-path; `/assets/` resolves to `username.github.io/assets/` which does not exist.
**How to avoid:** Use `./assets/css/base.css` (relative) in all `<link>` and `<script>` tags. Relative paths work correctly regardless of whether the site is at the domain root or a sub-path.
**Warning signs:** Styles and scripts 404 in production but work locally; DevTools Network tab shows 404 on `.css` and `.js` files.

### Pitfall 3: Jekyll Processing Silently Removes Files

**What goes wrong:** Push to GitHub Pages without `.nojekyll`; the live URL 404s for certain pages or assets.
**Why it happens:** Jekyll processes the repository by default. Files starting with `_`, `.`, or in certain reserved directories are excluded from the build output. An `assets/` folder is fine now but future phases may add underscore-prefixed files.
**How to avoid:** Create `.nojekyll` at repo root in Phase 1 before any push to the GitHub Pages source branch.
**Warning signs:** Files exist in the repo but return 404 on the live URL; build logs in GitHub Actions (if enabled) show Jekyll processing.

### Pitfall 4: Google Fonts Blocked by Content Security Policy

**What goes wrong:** If a CSP `<meta>` header is added later that restricts `style-src` or `font-src`, Google Fonts CDN calls will be blocked.
**Why it happens:** CSP `style-src 'self'` blocks `fonts.googleapis.com`.
**How to avoid:** For this project (no CSP needed for a static pricing page), this is not relevant. Do not add a restrictive CSP meta tag. If a CSP is ever added, it must include `style-src https://fonts.googleapis.com` and `font-src https://fonts.gstatic.com`.
**Warning signs:** Console errors: `Refused to load stylesheet from 'https://fonts.googleapis.com/...' because it violates the following Content Security Policy directive`.

### Pitfall 5: Empty Directories Not Committed to Git

**What goes wrong:** `assets/js/vendor/`, `assets/images/`, and `assets/fonts/` are created locally but not committed because Git ignores empty directories. Phase 4/5 authors create files inside them but push fails because parent paths are wrong.
**How to avoid:** Add a `.gitkeep` file inside each empty directory that needs to be tracked.
**Warning signs:** `git status` shows no changes after creating empty directories.

---

## Code Examples

### Complete base.css Template

```css
/* =============================================================
   base.css — BaoGia TrustBackLink Design Tokens
   Source: REQUIREMENTS.md DESIGN-01 through DESIGN-06
           UI-SPEC.md (Color, Typography, Spacing, Z-Index sections)
   ============================================================= */

/* === COLORS === */
:root {
  /* Required by REQUIREMENTS.md DESIGN-01 */
  --gold-bright: #FFD700;
  --gold-mid:    #C9A227;
  --black-rich:  #0A0A0A;
  --black-card:  #111111;
  --text-primary: #F5F0E8;

  /* Extended palette — STACK.md + UI-SPEC.md */
  --gold-dim:     #8B6914;
  --black-border: #1E1E1E;
  --text-muted:   #8A8070;

  /* Overlay — REQUIREMENTS.md DESIGN-02 */
  --overlay-dark: rgba(0, 0, 0, 0.65);

  /* Glow — REQUIREMENTS.md DESIGN-05 */
  --gold-glow:     rgba(255, 215, 0, 0.35);
  --gold-glow-dim: rgba(255, 215, 0, 0.15);

  /* Reserved */
  --color-error: #FF4444;
}

/* === SPACING — UI-SPEC.md Spacing Scale === */
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --cta-touch: 56px;
}

/* === TYPOGRAPHY — UI-SPEC.md Typography section === */
:root {
  --text-sm:   14px;
  --text-base: 16px;
  --text-lg:   28px;
  --text-xl:   40px;
}

/* === Z-INDEX STACK — ARCHITECTURE.md canvas positioning === */
:root {
  --z-canvas:  0;
  --z-overlay: 1;
  --z-content: 2;
  --z-float:   100;
  --z-modal:   200;
}

/* === CARD TOKENS — UI-SPEC.md Featured Card Token Contract === */
:root {
  --card-featured-border: 1px solid var(--gold-bright);
  --card-featured-shadow: 0 0 24px var(--gold-glow);
  --card-default-border:  1px solid var(--black-border);
  --card-bg:              linear-gradient(135deg, var(--black-card) 0%, #0D0D0D 100%);
  --card-hover-lift:      translateY(-4px);
}

/* === BREAKPOINTS — reference values; do NOT use in media query conditions === */
/* Three.js disabled below 768px per REQUIREMENTS.md HERO-04 */
:root {
  --bp-mobile: 768px;
}

/* === RESET === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--black-rich);
  color: var(--text-primary);
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
  font-size: var(--text-base);
  line-height: 1.6;
}

/* === REDUCED MOTION — REQUIREMENTS.md ANIM-08 === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Complete Minimal index.html Scaffold

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustBackLink — Báo Giá Dịch Vụ SEO</title>

  <!-- Google Fonts: Playfair Display 700 (headings) + Be Vietnam Pro 400/600 (body) -->
  <!-- Vietnamese chars served via automatic unicode-range in CSS2 API -->
  <!-- Source: developers.google.com/fonts/docs/css2 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Be+Vietnam+Pro:wght@400;600&display=swap">

  <!-- Design tokens (base.css must load before any other stylesheet) -->
  <link rel="stylesheet" href="./assets/css/base.css">
</head>
<body>
  <!-- Phase 2 adds all content here -->
</body>
</html>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@import url('https://fonts.googleapis.com/css?family=...')` in CSS | `<link rel="stylesheet">` in HTML head | Ongoing best practice | `@import` is render-blocking; `<link>` fetches in parallel with HTML parse |
| `&subset=vietnamese` in Google Fonts URL (CSS1 API) | Automatic unicode-range blocks via CSS2 API | Google Fonts CSS2 API launch (~2020) | Browser requests only the unicode blocks it needs; no explicit subset parameter required |
| GitHub Pages Jekyll-processed static sites | `.nojekyll` + raw static files | GitHub Pages default behavior unchanged, but awareness increased with modern SSGs | Without `.nojekyll`, underscore-prefixed files are silently excluded |

**Deprecated/outdated:**
- `https://fonts.googleapis.com/css?` (CSS1 API): Still works but does not support variable fonts or automatic unicode-range. Upgrade to `css2` API.
- `&subset=vietnamese` parameter in CSS2 API URLs: Not documented in CSS2 API; parameter appears to be ignored or a no-op. Unicode-range handling is automatic.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `&subset=vietnamese` parameter in the CSS2 API is a no-op / superseded by automatic unicode-range | Google Fonts URL pattern | If wrong: Vietnamese diacritics may not load correctly. Mitigation: test by rendering Vietnamese text after Phase 1 and checking DevTools Network for `[subset=vietnamese]` font file requests. | [ASSUMED — CSS2 API docs do not explicitly document subset parameter behavior; behavior inferred from research] |
| A2 | GitHub Pages source branch is `main` (or `gh-pages`) with repo root or `/docs` as publish source — not a sub-path requiring `--prefix-url` | Pitfall 2, relative paths | If deployed to a sub-path the relative `./assets/` paths work correctly regardless. Low risk. | [ASSUMED — URL confirmed as open question in STATE.md] |
| A3 | No custom domain is configured for the GitHub Pages deployment | Path strategy | Root-relative paths would be acceptable with a custom domain at `/`, but relative paths (`./assets/`) work in all cases. Using relative paths regardless eliminates this assumption as a risk. | [ASSUMED] |

**If this table is empty:** Not applicable — three assumptions documented above.

---

## Open Questions (RESOLVED)

1. **Google Fonts `&subset=vietnamese` in CSS2 API — does it provide additional benefit?**
   - What we know: CSS2 API automatically serves unicode-range blocks covering Vietnamese. The `&subset=` parameter is not documented in the CSS2 API docs.
   - What's unclear: Whether explicitly adding `&subset=vietnamese` forces a different code path or larger subset to be pre-fetched.
   - Recommendation: Use the URL without `&subset=`. After Phase 2 (when Vietnamese text exists on the page), verify by opening DevTools Network and filtering for `fonts.gstatic.com` — Vietnamese-range font file requests confirm the subset is loaded.
   - **RESOLVED:** `&subset=` is a legacy CSS1 API parameter. The CSS2 API handles Vietnamese automatically via `unicode-range` blocks served per browser request — no explicit subset parameter is needed or documented. The canonical CSS2 URL omits `&subset=vietnamese`. Plans and ROADMAP updated to reflect this. [SOURCE: developers.google.com/fonts/docs/css2; Pattern 2 in this document]

2. **GitHub Pages source configuration — root or `/docs` folder?**
   - What we know: The project currently has no GitHub Pages configuration (blank repo). STATE.md flags this as an open question.
   - What's unclear: Whether the repo owner will use `main` branch root, `gh-pages` branch, or `/docs` folder.
   - Recommendation: Default to `main` branch root deployment. `.nojekyll` placed at repo root works for all three source configurations. Relative paths work regardless of source folder choice.
   - **RESOLVED:** Relative `./assets/` paths work correctly regardless of whether deployment is at root, sub-path, or `/docs` folder. No configuration-specific path handling is required. Plan 01-02 defaults to `main` branch root; this decision carries no deployment risk.

3. **Logo asset availability**
   - What we know: STATE.md flags "Logo asset confirmed available?" as a blocker for Phase 2.
   - What's unclear: Whether `assets/images/logo.svg` exists or needs to be created.
   - Recommendation: Phase 1 creates the `assets/images/` directory. Phase 2 plan must address logo source — placeholder `<div>` fallback if SVG is not ready.
   - **RESOLVED:** Logo is deferred to Phase 2. Phase 1 creates `assets/images/.gitkeep` as a placeholder so the directory is tracked in git. Phase 2 plan will address logo sourcing and include a `<div class="logo-placeholder">` fallback if the SVG is not ready at that time.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Git | Version control, GitHub Pages push | Yes | 2.51.0 | — |
| Node.js | Not required in Phase 1 | Yes | v22.20.0 | — |
| Browser | Local verification of base.css tokens in DevTools | Yes (assumed) | — | — |
| GitHub Pages (live URL) | PERF-09 verification | Unknown | — | Verify after push; no in-phase fallback |
| Internet (Google Fonts CDN) | Font loading in browser | Yes (assumed) | — | System font fallback in CSS font stack |

**Missing dependencies with no fallback:**
- GitHub Pages configuration: The project has not been pushed to GitHub Pages yet (0% progress). Phase 1 plan 01-02 must include the push + verification step. Blocked on: GitHub Pages source branch configured in repo settings.

**Missing dependencies with fallback:**
- Google Fonts CDN: If offline during local development, `'Be Vietnam Pro'` falls back to `system-ui, -apple-system, sans-serif` and `'Playfair Display'` falls back to `Georgia, serif`. Pricing content remains readable.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — Phase 1 is CSS/HTML file creation only; no JavaScript logic to unit test |
| Config file | none |
| Quick run command | Open `index.html` in browser; open DevTools > Elements > `:root` computed styles |
| Full suite command | Open `index.html`; verify all CSS custom properties resolve in DevTools |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DESIGN-01 | `--gold-bright`, `--gold-mid`, `--black-rich`, `--black-card`, `--text-primary` declared in `:root` | manual | DevTools > Computed > search `--gold-bright` | ❌ Wave 0 |
| DESIGN-02 | `--overlay-dark: rgba(0,0,0,0.65)` declared | manual | DevTools `:root` inspection | ❌ Wave 0 |
| DESIGN-03 | Playfair Display 700 loaded, Vietnamese glyphs render | manual | Inspect Network tab for fonts.gstatic.com requests; render Vietnamese text | ❌ Wave 0 |
| DESIGN-04 | Be Vietnam Pro 400+600 loaded, Vietnamese glyphs render | manual | Same as DESIGN-03 | ❌ Wave 0 |
| DESIGN-05 | `--card-featured-border` and `--card-featured-shadow` declared correctly | manual | DevTools `:root` inspection | ❌ Wave 0 |
| DESIGN-06 | `--card-default-border` declared correctly | manual | DevTools `:root` inspection | ❌ Wave 0 |
| PERF-07 | All filenames and folder names are lowercase | manual | `ls -la assets/` in shell | ❌ Wave 0 |
| PERF-08 | All asset paths in index.html are relative (`./assets/`) | manual | `grep -n "href\|src" index.html` — no `/assets/` root-relative paths | ❌ Wave 0 |
| PERF-09 | `.nojekyll` exists at repo root; GitHub Pages renders without 404 | manual | `ls -la .nojekyll`; push + load live URL | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** Visual browser check — open `index.html`, confirm no console errors, confirm at least one custom property resolves in DevTools
- **Per wave merge:** Full manual checklist above across all 9 requirements
- **Phase gate:** All 9 requirements confirmed green before Phase 2 begins

### Wave 0 Gaps

- [ ] No test files exist (Phase 1 has no JavaScript — all verification is manual browser inspection)
- [ ] No existing test infrastructure — this is a greenfield project

*(No automated test framework is warranted for Phase 1. All deliverables are CSS custom properties and file structure, verified via browser DevTools and shell `ls`.)*

---

## Security Domain

Phase 1 produces only a CSS file, an HTML scaffold, and an empty `.nojekyll` file. There is no user input, no JavaScript execution, no API calls, no authentication, and no dynamic data. ASVS categories do not apply to this phase.

The only security-adjacent concern is supply chain: Google Fonts is a third-party CDN. The fonts are loaded via `<link rel="stylesheet">` which fetches CSS. This CSS is not executed as JavaScript. The risk level is low for a static pricing display page.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | No | — |
| V6 Cryptography | No | — |

---

## Sources

### Primary (HIGH confidence)
- REQUIREMENTS.md (project file) — DESIGN-01 through DESIGN-06, PERF-07, PERF-08, PERF-09 exact specifications
- UI-SPEC.md (project file) — complete token contract for colors, spacing, typography, z-index, card tokens
- ARCHITECTURE.md (project file) — folder structure, file naming, GitHub Pages gotchas, script loading order
- CLAUDE.md (project file) — critical rules for paths, filenames, RAF loop, overlay

### Secondary (MEDIUM confidence)
- [CSS API update | Google Fonts](https://developers.google.com/fonts/docs/css2) — CSS2 API URL format, `display=swap` parameter
- [Get Started with the Google Fonts API](https://developers.google.com/fonts/docs/getting_started) — `<link>` vs `@import`, subset parameter
- [About GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) — `.nojekyll` purpose, Jekyll file exclusion rules
- [Be Vietnam Pro - Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro) — Vietnamese subset availability confirmed

### Tertiary (LOW confidence — inform only)
- WebSearch results on Google Fonts unicode-range/Vietnamese subset behavior — consistent with CSS2 API docs but not independently verified via official source. Assumption A1 is flagged accordingly.

---

## Metadata

**Confidence breakdown:**
- Token names and values: HIGH — all values come directly from REQUIREMENTS.md and UI-SPEC.md (authoritative project sources)
- Folder structure: HIGH — fully specified in ARCHITECTURE.md
- Google Fonts URL: MEDIUM — CSS2 API format verified via official docs; `&subset=` deprecation behavior is [ASSUMED]
- `.nojekyll`: HIGH — behavior verified in GitHub Pages official docs
- GitHub Pages path strategy: HIGH — relative path requirement well documented in ARCHITECTURE.md and confirmed by GitHub Pages docs

**Research date:** 2026-05-18
**Valid until:** 2026-11-18 (Google Fonts API stable; GitHub Pages behavior stable; CSS custom properties are a baseline spec)
