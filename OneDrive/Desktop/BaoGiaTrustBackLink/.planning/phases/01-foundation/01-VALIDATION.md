---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 1 is CSS/HTML file creation only; no JavaScript logic to unit test |
| **Config file** | none |
| **Quick run command** | Open `index.html` in browser; open DevTools > Elements > `:root` computed styles |
| **Full suite command** | Open `index.html`; verify all CSS custom properties resolve in DevTools; run shell grep checks below |
| **Estimated runtime** | ~2 minutes (manual browser inspection) |

---

## Sampling Rate

- **After every task commit:** Visual browser check — open `index.html`, confirm no console errors, confirm at least one custom property resolves in DevTools
- **After every plan wave:** Full manual checklist across all 9 requirements
- **Before `/gsd:verify-work`:** All 9 requirements confirmed green
- **Max feedback latency:** ~2 minutes

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | DESIGN-01, DESIGN-02, DESIGN-05, DESIGN-06, PERF-07 | T-01-02 / — | Static CSS file — no user input, no execution | manual + grep | `grep -c "\-\-gold-bright" assets/css/base.css` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | DESIGN-03, DESIGN-04, PERF-07, PERF-08 | T-01-01 / — | External CDN CSS only — no JS execution | manual + grep | `grep -c "fonts\.googleapis\.com/css2" index.html` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | PERF-09 | — / — | Empty file — no content, no execution risk | manual | `ls .nojekyll` (file must exist, 0 bytes) | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 2 | PERF-09 | — / — | GitHub Pages serves static HTML — no dynamic behavior | manual | Load live URL in browser; confirm HTTP 200, no 404 | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test files exist — Phase 1 has no JavaScript. All verification is manual browser inspection and shell grep checks.

*Existing infrastructure covers all phase requirements via manual verification. No Wave 0 test scaffolding is needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `--gold-bright`, `--gold-mid`, `--black-rich`, `--black-card`, `--text-primary` declared in `:root` | DESIGN-01 | CSS custom properties require browser DevTools to inspect resolved computed values | Open `index.html` in browser > DevTools > Elements > select `:root` > Computed tab > search `--gold-bright`; confirm `#FFD700` |
| `--overlay-dark: rgba(0,0,0,0.65)` declared | DESIGN-02 | Same as above | DevTools `:root` computed > search `--overlay-dark`; confirm `rgba(0, 0, 0, 0.65)` |
| Playfair Display 700 loaded; Vietnamese glyphs render | DESIGN-03 | Font loading requires live network request and visual render check | DevTools Network > filter `fonts.gstatic.com`; after Phase 2 adds Vietnamese text, confirm Vietnamese diacritic font files downloaded |
| Be Vietnam Pro 400+600 loaded; Vietnamese glyphs render | DESIGN-04 | Same as DESIGN-03 | Same network tab check for Be Vietnam Pro font file requests |
| `--card-featured-border` and `--card-featured-shadow` declared correctly | DESIGN-05 | CSS variable with nested `var()` references require DevTools to confirm resolution chain | DevTools `:root` > confirm `--card-featured-border: 1px solid var(--gold-bright)` and `--card-featured-shadow: 0 0 24px var(--gold-glow)` |
| `--card-default-border` declared correctly | DESIGN-06 | Same as DESIGN-05 | DevTools `:root` > confirm `--card-default-border: 1px solid var(--black-border)` |
| All filenames and folder names are lowercase | PERF-07 | Filesystem case-sensitivity requires shell inspection | Run `ls assets/css/ assets/js/` — confirm all names are lowercase |
| All asset paths in index.html use `./assets/` relative format | PERF-08 | Requires inspection of rendered HTML source | `grep -n "href\|src" index.html` — confirm no entry starts with `/assets/` |
| `.nojekyll` exists at repo root; GitHub Pages renders without 404 | PERF-09 | GitHub Pages live URL requires a push and browser load | After push: load `https://[username].github.io/BaoGiaTrustBackLink/` — confirm HTTP 200; `ls -la .nojekyll` confirms file exists locally |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
