# Story Selection & Catalog UI Redesign Specification

**Author:** Antigravity AI  
**Date:** 2026-08-21  
**Scope:** Complete overhaul of `StorySelection.jsx` layout and CSS in `src/index.css` to transition from unstyled full-width stretched strips into a modern, high-contrast, cyber-glass 2x2 level selection grid and responsive 3-column story catalog with search filtering.

---

## 1. Problem Statement & Objectives

### 1.1 Current Issues
- The Level Selection view and Story List view in `StorySelection.jsx` were relying on Tailwind utility classes (e.g. `grid-cols-1 sm:grid-cols-2 gap-6`, `p-6`) which are not present in this Vanilla CSS codebase.
- As a result, the level categories and individual story cards collapsed into full-width, single-column horizontal wireframe strips with low background contrast against the dark space background image.
- Navigation, readability, and visual hierarchy were severely compromised.

### 1.2 Design Objectives
1. **Dedicated Vanilla CSS Classes:** Implement robust, responsive CSS grid and card styling for `story-level-grid`, `story-level-card`, `story-catalog-grid`, `story-item-card`, and `story-search-bar`.
2. **Deep Cyber-Glass Aesthetic & High Contrast:**
   - Background: `rgba(13, 22, 45, 0.92)` with backdrop blur to ensure crisp readability over the starry/planet wallpaper.
   - Distinct glowing borders & hover effects customized per CEFR level:
     - 🟢 **A1 Beginner:** `#4ade80` (Emerald Green)
     - 🔵 **A2 Elementary:** `#2dd4bf` (Cyan/Teal)
     - 🟣 **B1 Intermediate:** `#38bdf8` (Sky Blue)
     - 🟠 **B2 Upper Intermediate:** `#c084fc` (Neon Purple)
3. **Responsive Grid Layouts:**
   - **Level Selection View:** 2x2 grid on desktop/tablet (`minmax(320px, 1fr)`), 1 column on mobile. Includes 3D Tilt effect (`react-parallax-tilt`), prominent level icon, count badges (`16 บทความ`), bilingual titles, and clear call-to-action buttons.
   - **Story Catalog View:** 3 columns on large desktop, 2 columns on tablet, 1 column on mobile. Includes quick level-switch pills, real-time search input (filtering by English or Thai titles), genre badges (`Daily Life`), level badges, estimated read time with clock icon, and animated "เริ่มอ่าน" action buttons.

---

## 2. Component & Layout Architecture

### 2.1 CSS Architecture (`src/index.css`)
Add dedicated classes for the Story Selection module:
- `.story-selection-container`: max-width wrapper with smooth fade-in animation.
- `.story-level-grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;`
- `.story-level-card`: deep cyber-glass styling, flex column layout, hover elevation, glowing accent borders.
- `.story-catalog-grid`: `display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;`
- `.story-item-card`: interactive card with top badges, bold English title, Thai subtitle, readTime clock, and micro-animated arrow.
- `.story-search-bar`: integrated search input with search icon, clear button, and counter.

### 2.2 Component Updates (`src/pages/StorySelection.jsx`)
- Import `Tilt` from `react-parallax-tilt`.
- Implement live search state `searchTerm` to filter stories by title or Thai title.
- Replace unstyled tailwind classnames with dedicated CSS classes.
- Ensure all 16 stories per level (total 64) render cleanly with responsive layouts.

---

## 3. Verification Plan

1. **Visual & Responsive Testing:**
   - Test Level Selection on Desktop (2x2 grid) and Mobile (1 column).
   - Test Story Catalog on Desktop (3 columns), Tablet (2 columns), and Mobile (1 column).
   - Test Search functionality by typing English (e.g. "Coffee", "Pharmacy") and Thai (e.g. "กาแฟ", "ยา").
2. **Build Verification:**
   - Run `npm run build` to ensure 0 build errors.
