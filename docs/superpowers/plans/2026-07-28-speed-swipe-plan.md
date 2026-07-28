# Speed Swipe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a new "Speed Swipe" learning mode with Tinder-style swipe gestures and rapid-fire vocabulary recognition.

**Architecture:** A new React component `SwipeMode.jsx` will handle the game state. It will use local state for timers, lives, and card generation. It integrates with `useGamification` for EXP and `useCategories` for word filtering.

**Tech Stack:** React, CSS Animations, native touch events for swiping.

## Global Constraints

- No Git commits (User explicitly disabled auto-commits).
- Must adhere to the existing Cyberpunk aesthetic.
- Must support both desktop (keyboard) and mobile (touch) inputs.

---

### Task 1: Route Setup and Home Menu Integration

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: A working route `/swipe` rendering a placeholder `SwipeMode` component.

- [ ] **Step 1: Create Placeholder Component**
Create a basic `SwipeMode.jsx` in `src/pages/` that just returns `<div>Swipe Mode</div>`.

- [ ] **Step 2: Add Route**
Update `src/App.jsx` to import `SwipeMode` and add the `<Route path="/swipe" element={<SwipeMode />} />`.

- [ ] **Step 3: Add to Home Menu**
Update `src/pages/Home.jsx` to include a new `<Link to="/swipe">` card with a title "Speed Swipe", description "Test your reflexes! Swipe right if the meaning matches, left if it's wrong.", and an icon (e.g., `Zap`).

- [ ] **Step 4: Verify**
Ensure clicking the Speed Swipe card navigates to `/swipe` and shows the placeholder.

---

### Task 2: UI Structure and State Setup

**Files:**
- Modify: `src/pages/SwipeMode.jsx`

**Interfaces:**
- Consumes: `useGamification`, `vocabularyData`, `LevelSelector`

- [ ] **Step 1: Setup State Hooks**
Add state variables: `level` (default 'all'), `words` (filtered list), `currentCard` (object with word, displayed meaning, isCorrect), `lives` (3), `combo` (0), `timeLeft` (100%), `isGameOver` (false).

- [ ] **Step 2: Build UI Layout**
Create the main layout:
- `game-header`: Title and `<LevelSelector>`
- `game-stats`: Show Lives (❤️) and Combo multiplier.
- Main area: A central Card showing the English word and the Thai meaning.

- [ ] **Step 3: Verification**
Verify the UI renders correctly without logic crashing.

---

### Task 3: Game Logic (Card Generation & Timer)

**Files:**
- Modify: `src/pages/SwipeMode.jsx`

- [ ] **Step 1: Implement `generateNextCard` function**
Randomly pick an English word from the `words` array. 
Generate a 50% chance: if true, show its correct meaning. If false, randomly pick a meaning from a *different* word in the dataset.

- [ ] **Step 2: Implement Timer Logic**
Use `useEffect` with `setInterval` to decrease `timeLeft` by a certain amount every 100ms.
If `timeLeft` <= 0, trigger `handleMistake()`.

- [ ] **Step 3: Implement `handleMistake` and `handleSuccess`**
- `handleMistake`: Reduce lives by 1, reset combo. If lives === 0, set `isGameOver = true`.
- `handleSuccess`: Increase combo.
- Both should immediately call `generateNextCard` and reset `timeLeft`.

---

### Task 4: Controls and Animations

**Files:**
- Modify: `src/pages/SwipeMode.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Keyboard Controls**
Add a `useEffect` for `keydown`. Left arrow = trigger swipe left (false). Right arrow = trigger swipe right (true).

- [ ] **Step 2: Touch Controls**
Add `onTouchStart`, `onTouchMove`, and `onTouchEnd` on the card container to track horizontal swipe distance. If the swipe distance exceeds a threshold, trigger the swipe actions.

- [ ] **Step 3: CSS Animations**
Add `.swipe-card` class in `index.css`. Add animation classes `.swipe-right` (tilts right, turns green) and `.swipe-left` (tilts left, turns red).
Update React state to apply these classes briefly before generating the next card.

- [ ] **Step 4: End Game UI & Gamification**
When `isGameOver` is true, show a summary screen with total cards completed and use `addExp()` from `useGamification` to award points based on score and max combo. Add a "Play Again" button.
