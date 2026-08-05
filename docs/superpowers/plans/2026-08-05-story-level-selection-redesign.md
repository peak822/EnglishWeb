# Story & Level Selection UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Level Selection and Story Selection screens in `StorySelection.jsx` into a premium, responsive Cyber-Glass Grid layout with bilingual titles, dynamic story counters, level-themed accents, and quick-navigation level switcher.

**Architecture:** Update `src/pages/StorySelection.jsx` to render a 2x2 modern glowing glass grid for CEFR levels and a 3-column responsive story grid with dual English & Thai titles. Complement with fine-tuned CSS transitions and glow utility classes in `src/index.css`.

**Tech Stack:** React, Tailwind-like utility classes, Lucide Icons, Vanilla CSS, Vite

## Global Constraints
- Must maintain full compatibility with existing `stories.json` data structure (`id`, `title`, `titleThai`, `genre`, `level`, `readTime`).
- Navigation routes must remain intact (`/story-mode/:id` and `/`).
- Mobile-friendly responsive breakpoints (`grid-cols-1` -> `sm:grid-cols-2` -> `lg:grid-cols-3` / `lg:grid-cols-4`).
- No broken layouts or clipped text.

---

### Task 1: Add Cyber-Glass & Level Glow Styles to CSS

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS classes for `.cyber-glass-card`, `.level-pill-btn`, `.level-badge-*`, and glow hover animations.

- [ ] **Step 1: Add Cyber-Glass CSS styles to `src/index.css`**

Add level glow styles, backdrop blur cards, and hover transition utilities:
```css
/* Story Selection Cyber-Glass Styling */
.cyber-glass-card {
  background: rgba(10, 15, 30, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 255, 255, 0.18);
  border-radius: var(--radius-lg);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cyber-glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 10px 25px -5px rgba(0, 255, 255, 0.15), inset 0 0 15px rgba(0, 255, 255, 0.05);
}

.cyber-glass-card.level-a1:hover {
  border-color: rgba(74, 222, 128, 0.6);
  box-shadow: 0 10px 25px -5px rgba(74, 222, 128, 0.25);
}

.cyber-glass-card.level-a2:hover {
  border-color: rgba(45, 212, 191, 0.6);
  box-shadow: 0 10px 25px -5px rgba(45, 212, 191, 0.25);
}

.cyber-glass-card.level-b1:hover {
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.25);
}

.cyber-glass-card.level-b2:hover {
  border-color: rgba(192, 132, 252, 0.6);
  box-shadow: 0 10px 25px -5px rgba(192, 132, 252, 0.25);
}
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/index.css
git commit -m "style(stories): add cyber-glass card and level glow styles"
```

---

### Task 2: Redesign Level Selection View in `StorySelection.jsx`

**Files:**
- Modify: `src/pages/StorySelection.jsx`

**Interfaces:**
- Produces: Enhanced 2x2 grid for levels (`A1`, `A2`, `B1`, `B2`) with icons (`Sparkles`, `BookOpen`, `Award`, `Zap`), Thai descriptions, level badges, and live story counter.

- [ ] **Step 1: Update categories data and Level Selection grid in `StorySelection.jsx`**
- [ ] **Step 2: Verify component rendering and count calculation**
- [ ] **Step 3: Commit Task 2**

```bash
git add src/pages/StorySelection.jsx
git commit -m "feat(stories): redesign level selection view with cyber-glass grid"
```

---

### Task 3: Redesign Story Selection View & Quick Navigation

**Files:**
- Modify: `src/pages/StorySelection.jsx`

**Interfaces:**
- Produces: Multi-column story grid showing English + Thai titles, genre badge, level badge, read time, and top navigation bar with Quick Level Switcher pills.

- [ ] **Step 1: Implement top navigation bar (Back button + Level Switcher pills)**
- [ ] **Step 2: Implement responsive 3-column story cards with bilingual titles**
- [ ] **Step 3: Commit Task 3**

```bash
git add src/pages/StorySelection.jsx
git commit -m "feat(stories): redesign story cards with bilingual titles and quick switcher"
```

---

### Task 4: Full Verification & Build Check

**Files:**
- Validate: `npm run build`

- [ ] **Step 1: Run Vite build**
Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 2: Update Walkthrough**
Update `walkthrough.md` with visual summary and test results.
