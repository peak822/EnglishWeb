# Daily Life Extended Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand English Study Web's reading catalog by adding 25 new comprehensive, long-form Daily Life articles across all CEFR levels (5 articles per level: A1, A2, B1, B2, C1) and enable C1 Advanced tier in the story catalog.

**Architecture:** 
- `src/data/stories.json` is updated with 25 new story records containing full English narrative texts and faithful Thai sentence-by-sentence translations.
- `src/pages/StorySelection.jsx` is updated to include the C1 Advanced tier in the category filter.
- `src/App.css` is updated with C1 level badge and active filter styling.

**Tech Stack:** React 19, JSON, Vite, Lucide React, Web Speech API.

## Global Constraints
- Every story MUST have non-empty `id`, `title`, `titleThai`, `genre`, `level`, `readTime`, `content`, and `contentThai`.
- Stories must be rich and extended in length (~180-250 words for A1, ~250-320 words for A2, ~320-400 words for B1, ~400-500 words for B2, ~450-550 words for C1).
- All changes must pass build (`npm run build`) and lint tests without errors.

---

### Task 1: Append 25 Long-Form Daily Life Stories to `src/data/stories.json`

**Files:**
- Modify: `src/data/stories.json`

**Interfaces:**
- Produces: 89 total story items in `stories.json` with 5 new stories each for A1, A2, B1, B2, and C1.

- [ ] **Step 1: Write Node script to generate and merge 25 stories into `src/data/stories.json`**
- [ ] **Step 2: Run script to update `stories.json`**
- [ ] **Step 3: Verify JSON validity and count per level**
- [ ] **Step 4: Commit**
```bash
git add src/data/stories.json
git commit -m "feat(stories): add 25 extended Daily Life stories across CEFR levels A1-C1"
```

---

### Task 2: Update `StorySelection.jsx` and CSS for C1 Category

**Files:**
- Modify: `src/pages/StorySelection.jsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add C1 Advanced category in `src/pages/StorySelection.jsx`**
- [ ] **Step 2: Add C1 level styles in `src/App.css`**
- [ ] **Step 3: Test and Commit**
```bash
git add src/pages/StorySelection.jsx src/App.css
git commit -m "feat(ui): add C1 Advanced level category and styling to StorySelection"
```

---

### Task 3: Build & Quality Verification

- [ ] **Step 1: Run Vite Build Check**
```bash
npm run build
```
- [ ] **Step 2: Run Lint Check**
```bash
npm run lint
```
- [ ] **Step 3: Commit and Summary**
```bash
git commit -m "chore: complete extended Daily Life stories expansion"
```
