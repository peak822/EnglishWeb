# Mobile Optimization & Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the English Study Web application for mobile devices by eliminating UI/Navbar overflow, fixing high-frequency background re-render bottlenecks, and reducing initial load bundle size through route-based code splitting.

**Architecture:** 
1. Re-architect the top Navbar and Hero Command Deck with mobile-first responsive flex/grid layouts.
2. Implement route-level code splitting (`React.lazy` + `Suspense`) in `App.jsx` to load mode pages and heavy dictionary data on-demand.
3. Optimize `InteractiveBackground.jsx` by decoupling touch events from React state and reducing mobile particle overhead.
4. Update `index.html` viewport and font preconnects to prevent render-blocking.

**Tech Stack:** React 19, Vite, React Router DOM 7, Vanilla CSS, Lucide React, HTML5 Canvas.

## Global Constraints
- Do not break existing desktop UI, theme styling, or sound/speech functionality.
- Keep all 14 learning modes fully functional.
- Maintain Cyberpunk, Meadow Day, Milky Way, and Sunset Vaporwave themes.

---

### Task 1: HTML Viewport & Font Preconnect Optimization

**Files:**
- Modify: `index.html:1-14`
- Modify: `src/index.css:1-2`

- [ ] **Step 1: Update viewport tag and add font preconnects in `index.html`**
  - Change `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />` to `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`.
  - Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
  - Add `<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&family=Nunito:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">`.

- [ ] **Step 2: Remove `@import` from `src/index.css`**
  - Delete line 1 `@import url('https://fonts.googleapis.com/css2?...');` so fonts do not block CSS stylesheet parsing.

- [ ] **Step 3: Verify build**
  - Run `npm run build` to ensure no syntax errors.

---

### Task 2: Background Canvas & Animation GPU Optimization

**Files:**
- Modify: `src/components/InteractiveBackground.jsx:1-306`

- [ ] **Step 1: Eliminate React state re-renders during touch events**
  - Avoid calling `setPosition` in `touchmove` or `mousemove` to prevent React re-renders. Use `requestAnimationFrame` and direct canvas coords or CSS variables.
  - On touch devices, disable radial pointer glow tracking.

- [ ] **Step 2: Scale down particle count and disable expensive shadowBlur on mobile**
  - Detect mobile screen size: `const isMobile = window.innerWidth < 768;`
  - Reduce Cyberpunk particle count from 80 to 24 on mobile.
  - In particle line connection loop, reduce max distance check and skip `shadowBlur` on mobile devices.
  - Pause drawing loop when `document.hidden` is true to save mobile battery.

- [ ] **Step 3: Verify animation smoothness**
  - Check that canvas runs cleanly and unmounts cleanly on theme change.

---

### Task 3: Route-Based Code Splitting in `App.jsx`

**Files:**
- Modify: `src/App.jsx:1-129`

- [ ] **Step 1: Replace static page imports with `React.lazy()`**
  - Lazy load: `Home`, `TypingMode`, `AssembleMode`, `GuessMode`, `ReadMode`, `ListeningMode`, `ContextMode`, `SyntaxMode`, `MatchMode`, `SwipeMode`, `POSMode`, `POSGuide`, `StorySelection`, `StoryReader`.

- [ ] **Step 2: Wrap `<Routes>` in `<Suspense fallback={...}>`**
  - Add a styled Cyberpunk neon loading spinner fallback.

- [ ] **Step 3: Run `npm run build` and measure chunk reduction**
  - Verify initial JS bundle is split into small lazy chunks and drops from 880 KB to < 100 KB.

---

### Task 4: Responsive Navbar & Header Overhaul

**Files:**
- Modify: `src/App.jsx:40-98`
- Modify: `src/App.css:9-35`
- Modify: `src/index.css:1170-1290`

- [ ] **Step 1: Re-structure Navbar for mobile viewports**
  - On mobile screens (< 640px), wrap items cleanly so:
    - Top row / flex container displays Logo and Theme Dropdown.
    - Gamification Bar adapts with compact `Lv.X`, dynamic EXP bar, and streak/badge pill that never overflows horizontally.

- [ ] **Step 2: Add CSS rules for responsive navbar and badge clipping prevention**
  - Add media queries in `src/App.css` to size down padding, fonts, and dropdowns on narrow mobile screens (< 420px).

---

### Task 5: Home Page Command Deck & Touch Optimization

**Files:**
- Modify: `src/pages/Home.jsx:1-359`
- Modify: `src/index.css:1180-1420`

- [ ] **Step 1: Disable Parallax Tilt on touch/mobile devices**
  - Detect touch device capability or wrap `Tilt` conditionally so on touchscreens, standard card rendering with pure CSS active/hover is used, removing gyro/touch listeners and frame drops.

- [ ] **Step 2: Responsive Hero Command Deck**
  - Adjust `.home-profile-header`, `.home-avatar-wrap`, and `.home-rank-badge` in `src/index.css` to wrap gracefully on screens < 380px without clipping `Lv.1 • CODE...` or streak pills.

- [ ] **Step 3: Verify and test on mobile screen widths**
  - Test responsiveness at 360px, 390px, 412px, and desktop viewports.
