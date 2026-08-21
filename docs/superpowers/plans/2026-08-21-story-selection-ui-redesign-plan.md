# Story Selection UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Short Story Reading UI to provide a clean, high-contrast, responsive 2x2 CEFR level selection grid and a 3-column story catalog with search filtering.

**Architecture:** Add dedicated Vanilla CSS rules in `src/index.css` for grid layouts, card elevations, neon glow accents, and search controls. Update `StorySelection.jsx` to utilize these classes and incorporate `react-parallax-tilt` and live search filtering.

**Tech Stack:** React, Vanilla CSS, `lucide-react`, `react-parallax-tilt`, Vite.

## Global Constraints
- Do not rely on Tailwind CSS classes; use dedicated Vanilla CSS classes in `src/index.css`.
- Ensure high text contrast using deep dark glass backgrounds (`rgba(13, 22, 45, 0.92)`).
- Provide responsive layouts: 2x2 grid for levels on desktop, 3-col/2-col/1-col for story catalog.
- Support real-time search filtering across English and Thai titles.

---

### Task 1: Implement Dedicated Story Selection CSS in `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS classes `.story-selection-wrap`, `.story-banner-card`, `.story-level-grid`, `.story-level-card`, `.story-catalog-controls`, `.story-search-wrap`, `.story-catalog-grid`, `.story-card`

- [ ] **Step 1: Add new story selection CSS classes to `src/index.css`**

Add comprehensive styling including:
- Responsive grid templates (`repeat(auto-fit, minmax(320px, 1fr))` for levels, `repeat(auto-fill, minmax(320px, 1fr))` for stories)
- Deep glassmorphism card styling with borders, padding, hover animations
- Level-specific neon accent styles (`--accent-color`, hover shadows, badges)
- Search bar styling with icon, input, and clear button
- Responsive breakpoints (`@media (max-width: 768px)` and `@media (max-width: 480px)`)

- [ ] **Step 2: Commit CSS changes**

```bash
git add src/index.css
git commit -m "style: add dedicated CSS for story selection and catalog grid"
```

---

### Task 2: Refactor `StorySelection.jsx` Component

**Files:**
- Modify: `src/pages/StorySelection.jsx`

**Interfaces:**
- Consumes: CSS classes from Task 1, `react-parallax-tilt`, `lucide-react`
- Produces: Enhanced Level Selection and Story Catalog views with Tilt 3D and Search

- [ ] **Step 1: Update `StorySelection.jsx`**
  - Import `Tilt` from `react-parallax-tilt`
  - Add search input state `searchTerm`
  - Render Level Selection in 2x2 Tilt cards with clear hierarchy, icons, badges, and action buttons
  - Render Story Catalog in responsive 3-column cards with top search bar, live filtering, and clear results count
  - Handle empty search state gracefully with a reset button

- [ ] **Step 2: Run build to verify zero JSX or import errors**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/pages/StorySelection.jsx
git commit -m "feat(ui): redesign StorySelection with 2x2 level grid, 3-column story catalog and search"
```

---

### Task 3: Build Verification & Final Polish

**Files:**
- Test: `npm run build`

- [ ] **Step 1: Execute production build verification**
Run: `npm run build`
Expected: 0 errors.

- [ ] **Step 2: Final commit and cleanup**
```bash
git add docs/superpowers/plans/2026-08-21-story-selection-ui-redesign-plan.md
git commit -m "docs: add implementation plan for StorySelection UI redesign"
```
