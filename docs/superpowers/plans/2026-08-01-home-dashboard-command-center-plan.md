# Home Dashboard & Command Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Home page (`src/pages/Home.jsx`) into an ultra-premium Cyberpunk Command Center with gamified player stats, spotlight launcher, and 4 skill-based learning domains.

**Architecture:** 
- CSS Design System in `src/index.css` provides responsive Cyber-Glass layout classes, glow utilities, and card aesthetics.
- `src/hooks/useGamification.js` provides user progression data (EXP, Level, Rank Titles, Daily Streak, Badges).
- `src/pages/Home.jsx` renders the Command Deck and 4 domain grids with 3D tilt interactions and responsive layouts.

**Tech Stack:** React 18, React Router v6, Lucide React icons, react-parallax-tilt, Vanilla CSS3 (Glassmorphism & Neon Shadows).

---

## Global Constraints
- Pure CSS with variables; no Tailwind classes required.
- All 12 existing learning modes must be preserved with working navigation.
- Responsive design for mobile (360px+), tablet, and desktop (1024px+).

---

### Task 1: Add Command Center & Glassmorphic Card Styles to `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS classes `.home-command-deck`, `.home-rank-badge`, `.home-exp-track`, `.home-exp-fill`, `.home-streak-chip`, `.home-spotlight-card`, `.home-domain-header`, `.home-mode-card`, `.home-tag-pill`.

- [ ] **Step 1: Append dedicated Home Command Center styles to `src/index.css`**
Add styles for:
- Command Deck container with 2-column desktop / 1-column mobile layout.
- Rank badge with neon borders and glowing typography.
- EXP Progress bar track & animated fill.
- Spotlight launcher card with animated pulse beacon.
- Domain section headers with glowing icons and pill counters.
- High-end glassmorphic mode cards with hover lift and gradient top accents.

- [ ] **Step 2: Verify CSS syntax and compilation**
Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit CSS additions**
```bash
git add src/index.css
git commit -m "style: add Cyberpunk Command Center styles to index.css"
```

---

### Task 2: Enhance `useGamification.js` with Rank Titles and Daily Streak

**Files:**
- Modify: `src/hooks/useGamification.js`

**Interfaces:**
- Consumes: `profile` from localStorage.
- Produces: `rankTitle`, `streakDays`, `expProgress`, `nextLevelExp`, `currentLevelBaseExp`.

- [ ] **Step 1: Add Rank Title mapper and Streak helper to `useGamification.js`**
- Compute `rankTitle` from current `level` (e.g. Level 1: `Code Initiate`, Level 2-3: `Cyber Scholar`, Level 4-6: `Vocab Specialist`, Level 7-9: `Neural Elite`, Level 10+: `Cyber Overlord`).
- Compute and persist `streakDays` in profile object with timestamp check.

- [ ] **Step 2: Verify hook exports and build**
Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit hook updates**
```bash
git add src/hooks/useGamification.js
git commit -m "feat: add rank titles and streak tracking to useGamification hook"
```

---

### Task 3: Refactor `src/pages/Home.jsx` into the Cyberpunk Command Center

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `useGamification()` progression data, `react-router-dom` navigation, `react-parallax-tilt`.
- Produces: Full Command Center UI with 4 skill-based domains:
  1. 📖 Reading & Comprehension (`/story-mode`, `/read`)
  2. 🎧 Listening & Pronunciation (`/listen`)
  3. ⚡ Vocabulary & Reflexes (`/match`, `/swipe`, `/guess`, `/typing`, `/assemble`)
  4. 🧩 Grammar & Structure (`/pos`, `/pos-guide`, `/syntax`, `/context`)

- [ ] **Step 1: Rewrite `Home.jsx` layout and JSX**
- Implement Hero Command Deck (Rank badge, Level, EXP bar, Streak chip, Badges, and Daily Spotlight card).
- Render the 4 skill-based domains using `react-parallax-tilt` and `.home-mode-card`.
- Add badges, tags (`⚡ Speed`, `📖 Reading`, `🧠 Grammar`, `✍️ Memory`), and hover animations.

- [ ] **Step 2: Verify build and routing**
Run: `npm run build`
Expected: PASS with all 12 routes intact.

- [ ] **Step 3: Commit Home.jsx refactor**
```bash
git add src/pages/Home.jsx
git commit -m "feat: revamp Home page into Cyberpunk Command Center"
```

---

### Task 4: Full System Verification & Review

**Files:**
- Test all pages & responsiveness.

- [ ] **Step 1: Run production build verification**
Run: `npm run build`
Expected: Zero errors, clean bundle generation.

- [ ] **Step 2: Check git status and cleanliness**
Run: `git status`
Expected: Clean working tree.
