# Conversational & Natural Daily Life Story Translations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul and polish all 47 interactive story translations in `src/data/stories.json` to ensure natural, fluid, conversational Thai that reflects real-world daily speech and authentic storytelling.

**Architecture:** Master dataset `src/data/stories.json` integrating with `StoryReader.jsx`, `StorySelection.jsx`, `wordLookup.js`, and Web Speech API audio narration.

---

## Translation Quality Standards

- **Spoken Naturalness:** No robotic or word-for-word literal phrasing. Use natural Thai phrasing used in everyday conversations.
- **Idiomatic Rendering:** Phrasal verbs and English idioms translated into their true Thai conversational equivalents.
- **Paragraph Matching:** 100% 1:1 paragraph break alignment with the English source text.
- **Content Diversity:** Differentiate `story-b2-11` into *"Managing a Cross-Cultural Project Team"* (การบริหารโปรเจกต์กับทีมงานต่างชาติข้ามวัฒนธรรม).

---

## Task Breakdown

### Task 1: Refine Level A1 Story Translations (12 Stories)
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Polish A1 stories 1 to 6**
- [ ] **Step 2: Polish A1 stories 7 to 12**

### Task 2: Refine Level A2 Story Translations (12 Stories)
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Polish A2 stories 1 to 6**
- [ ] **Step 2: Polish A2 stories 7 to 12**

### Task 3: Refine Level B1 Story Translations (12 Stories)
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Polish B1 stories 1 to 6**
- [ ] **Step 2: Polish B1 stories 7 to 12**

### Task 4: Refine Level B2 Story Translations (11 Stories)
**Files:**
- Modify: `src/data/stories.json`

- [ ] **Step 1: Polish B2 stories 1 to 6**
- [ ] **Step 2: Polish B2 stories 7 to 11**

### Task 5: Quality Assurance & Build Verification
**Files:**
- Test/Verify: `scripts/verify_stories_thai.cjs`
- Test/Verify: `scripts/deep_audit.cjs`
- Build: `npm run build`

- [ ] **Step 1: Run validation scripts to confirm 100% translation cleanliness and schema validity**
- [ ] **Step 2: Run `npm run build` to confirm clean production build**
- [ ] **Step 3: Create walkthrough artifact**
