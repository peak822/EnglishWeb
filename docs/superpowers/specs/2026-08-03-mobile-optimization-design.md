# Mobile Optimization & Performance Design Specification

**Date:** 2026-08-03  
**Status:** Approved  
**Target:** Mobile & Touchscreen Experience (Performance, Layout, Bundle Size, Battery Life)

---

## 1. Objectives

1. **Fix Mobile UI & Layout Overflow:** Eliminate horizontal overflow in the top Navbar and Hero Command Deck across mobile viewport widths (320px - 430px).
2. **Eliminate Frame Drops & Battery Drain:** Optimize `InteractiveBackground.jsx` (eliminate React state re-renders on touchmove, reduce particle count on mobile, remove expensive canvas shadowBlur) and disable intensive Parallax Tilt calculations on touchscreens.
3. **Drastically Reduce Initial Bundle Size & Load Time:** Implement route-based code-splitting with `React.lazy()` and `<Suspense>`, optimize font loading, and remove viewport scaling restrictions.

---

## 2. Architectural & Component Changes

### A. Navigation & Mobile Header (`src/App.jsx`, `src/App.css`)
- **Responsive Navbar Layout:**
  - On desktop: Logo on left, Theme selector + Gamification bar on right.
  - On mobile (< 640px): Compact flex wrap / two-row responsive layout where Logo and Theme dropdown sit comfortably, and Gamification EXP pill stays 100% within viewport bounds without clipping.
- **Route-based Code Splitting:**
  - Wrap all 14 sub-pages in `React.lazy()`:
    `const TypingMode = React.lazy(() => import('./pages/TypingMode'));`
    `const AssembleMode = React.lazy(() => import('./pages/AssembleMode'));` ... etc.
  - Add `<Suspense fallback={<LoadingFallback />}>` in the `<Routes>` container.

### B. Canvas & Background Performance (`src/components/InteractiveBackground.jsx`)
- **Remove Touch-induced React Re-renders:**
  - Avoid triggering React `useState` (`setPosition`) on every `touchmove` event.
  - On touch devices, disable or throttle ambient mouse tracking, or update directly via lightweight DOM/canvas ref.
- **Mobile-Adaptive Particle System:**
  - On mobile screens (`window.innerWidth < 768`):
    - Reduce particle count from 80 to 25-30.
    - Omit the $O(N^2)$ particle-to-particle distance lines or reduce connection radius from 100px to 50px with a max connections cap per particle.
    - Remove `ctx.shadowBlur` (which triggers heavy GPU blur filters per frame).
- **Tab Inactive / Visibility Handler:** Pause the `requestAnimationFrame` loop when `document.hidden` is true.

### C. Home Page & Touch Interaction (`src/pages/Home.jsx`, `src/index.css`)
- **Conditional Tilt / Mobile Touch Friendly:**
  - On touch/coarse pointer devices, disable Tilt / 3D transformation calculation or use lightweight pure CSS hover styles (`@media (hover: hover)`), eliminating scroll lag on mobile cards.
- **Hero Profile & Command Deck:**
  - Update `.home-profile-header`, `.home-avatar-wrap`, `.home-rank-badge`, and streak badges to wrap gracefully with `min-width: 0` and flexible shrink properties for screen widths down to 320px.

### D. HTML & Font Loading (`index.html`, `src/index.css`)
- **Viewport Fix:**
  - Update `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` (remove `user-scalable=no` and `maximum-scale=1.0`).
- **Font Optimization:**
  - Add preconnect tags for Google Fonts in `index.html`.
  - Remove render-blocking `@import` at top of `index.css`.

---

## 3. Verification Plan

1. **Bundle Size Analysis:** Run `npm run build` and verify initial JS bundle drops from 880 KB to < 100 KB.
2. **Mobile Layout Verification:** Verify Navbar, Command Deck, and Mode Cards in mobile viewports (360px, 390px, 412px) for zero horizontal overflow and proper text wrapping.
3. **Scroll & Rendering Performance:** Confirm smooth 60fps scrolling and no React re-render spam on touch drag.
